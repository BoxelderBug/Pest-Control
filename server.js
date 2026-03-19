const express = require("express");
const path = require("path");
require("dotenv").config({ quiet: true });

const app = express();
const PORT = process.env.PORT || 3000;
const OPENAI_API_KEY = String(process.env.OPENAI_API_KEY || "");
const GEMINI_API_KEY = String(process.env.GEMINI_API_KEY || "");
const AI_PROVIDER_CONFIG = String(process.env.AI_PROVIDER || "auto").trim().toLowerCase();
const OPENAI_MODEL = String(process.env.OPENAI_MODEL || "gpt-4o-mini");
const GEMINI_MODEL = String(process.env.GEMINI_MODEL || "gemini-2.5-flash");
const AI_TIMEOUT_MS = Number(process.env.AI_TIMEOUT_MS || process.env.OPENAI_TIMEOUT_MS || process.env.GEMINI_TIMEOUT_MS || 12000);
const AI_PROVIDER = resolveAiProvider();
const AI_MODEL = String(
  process.env.AI_MODEL
  || (AI_PROVIDER === "gemini" ? GEMINI_MODEL : OPENAI_MODEL)
);
const AI_ERROR_LOG_LIMIT = 120;
const aiErrorLog = [];

function resolveAiProvider() {
  if (AI_PROVIDER_CONFIG === "gemini" || AI_PROVIDER_CONFIG === "openai") {
    return AI_PROVIDER_CONFIG;
  }
  if (GEMINI_API_KEY) {
    return "gemini";
  }
  if (OPENAI_API_KEY) {
    return "openai";
  }
  return "none";
}

function hasProviderApiKey(provider = AI_PROVIDER) {
  if (provider === "gemini") {
    return Boolean(GEMINI_API_KEY);
  }
  if (provider === "openai") {
    return Boolean(OPENAI_API_KEY);
  }
  return false;
}

function getProviderLabel(provider = AI_PROVIDER) {
  return provider === "gemini" ? "Gemini" : provider === "openai" ? "OpenAI" : "AI";
}

function getMissingApiKeyDetail(provider = AI_PROVIDER) {
  if (provider === "gemini") {
    return "GEMINI_API_KEY is not configured on server.";
  }
  if (provider === "openai") {
    return "OPENAI_API_KEY is not configured on server.";
  }
  return "No AI key configured. Set GEMINI_API_KEY or OPENAI_API_KEY on server.";
}

app.use(express.json({ limit: "1mb" }));
app.use(express.static(__dirname));

app.get("/", (_req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

function createRequestId() {
  const nowPart = Date.now().toString(36);
  const randPart = Math.random().toString(36).slice(2, 8);
  return `ai_${nowPart}_${randPart}`;
}

function pushAiError(entry) {
  const safeEntry = {
    at: new Date().toISOString(),
    ...entry
  };
  aiErrorLog.push(safeEntry);
  if (aiErrorLog.length > AI_ERROR_LOG_LIMIT) {
    aiErrorLog.splice(0, aiErrorLog.length - AI_ERROR_LOG_LIMIT);
  }
}

function getErrorSummary(error) {
  const code = String(error && error.code ? error.code : "ai_unknown_error");
  const detail = String(error && error.detail ? error.detail : error && error.message ? error.message : "Unknown error")
    .replace(/\s+/g, " ")
    .slice(0, 280);
  const upstreamStatus = Number.isFinite(error && error.httpStatus) ? Number(error.httpStatus) : null;
  const provider = String(error && error.provider ? error.provider : AI_PROVIDER);
  const providerLabel = getProviderLabel(provider);

  if (code === "openai_timeout" || code === "gemini_timeout") {
    return {
      code,
      upstreamStatus,
      responseStatus: 504,
      clientMessage: "AI request timed out.",
      detail
    };
  }
  if (code === "openai_http_error" || code === "gemini_http_error") {
    const responseStatus = upstreamStatus === 429 ? 503 : 502;
    const authFailed = upstreamStatus === 401 || upstreamStatus === 403;
    const clientMessage = authFailed
      ? `${providerLabel} authentication failed.`
      : upstreamStatus === 429
        ? `${providerLabel} rate limit reached.`
        : `${providerLabel} request failed.`;
    return {
      code,
      upstreamStatus,
      responseStatus,
      clientMessage,
      detail
    };
  }
  if (code === "openai_empty_output" || code === "gemini_empty_output") {
    return {
      code,
      upstreamStatus,
      responseStatus: 502,
      clientMessage: "AI returned no text.",
      detail
    };
  }
  return {
    code,
    upstreamStatus,
    responseStatus: 500,
    clientMessage: "Failed to generate AI reply.",
    detail
  };
}

function buildSystemPrompt(channel, recipient) {
  const target = String(recipient || "").toLowerCase() === "customer" ? "customer" : "manager";
  if (String(channel || "").toLowerCase() === "customer_dialog") {
    return [
      "You are roleplaying a homeowner speaking with a pest-control technician at the front door.",
      "Reply in 1-2 concise sentences.",
      "Keep tone realistic, practical, and polite.",
      "Do not mention being an AI or break role.",
      "If the technician asks access/safety details, provide useful short details."
    ].join(" ");
  }

  if (target === "customer") {
    return [
      "You are a customer receiving a service update from a pest-control technician.",
      "Reply in 1 concise sentence.",
      "Keep the response polite and realistic.",
      "Do not mention being an AI."
    ].join(" ");
  }

  return [
    "You are a field service manager responding to a technician update.",
    "Reply in 1 concise sentence with practical next-step guidance.",
    "Keep tone professional and supportive.",
    "Do not mention being an AI."
  ].join(" ");
}

async function generateOpenAiReply({ channel, recipient, message, context }) {
  const systemPrompt = buildSystemPrompt(channel, recipient);
  const safeMessage = String(message || "").slice(0, 800);
  const safeContext = context && typeof context === "object" ? context : {};

  const input = [
    { role: "system", content: [{ type: "input_text", text: systemPrompt }] },
    {
      role: "user",
      content: [
        {
          type: "input_text",
          text: `Context: ${JSON.stringify(safeContext)}\n\nTechnician message: ${safeMessage}`
        }
      ]
    }
  ];

  const abortController = new AbortController();
  const timeoutId = setTimeout(() => {
    abortController.abort();
  }, AI_TIMEOUT_MS);

  let response;
  try {
    response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`
      },
      signal: abortController.signal,
      body: JSON.stringify({
        model: AI_MODEL,
        temperature: 0.6,
        max_output_tokens: 140,
        input
      })
    });
  } catch (error) {
    if (error && error.name === "AbortError") {
      const timeoutError = new Error("OpenAI request timed out.");
      timeoutError.code = "openai_timeout";
      timeoutError.provider = "openai";
      timeoutError.httpStatus = null;
      timeoutError.detail = `OpenAI fetch exceeded ${AI_TIMEOUT_MS}ms timeout.`;
      throw timeoutError;
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }

  if (!response.ok) {
    const errText = await response.text();
    let parsed = null;
    try {
      parsed = JSON.parse(errText);
    } catch (_error) {
      parsed = null;
    }
    const detail = parsed && parsed.error && parsed.error.message
      ? String(parsed.error.message)
      : String(errText || "").slice(0, 280);
    const upstreamError = new Error(`OpenAI HTTP ${response.status}`);
    upstreamError.code = "openai_http_error";
    upstreamError.provider = "openai";
    upstreamError.httpStatus = response.status;
    upstreamError.detail = detail;
    throw upstreamError;
  }

  const data = await response.json();
  const text = typeof data.output_text === "string" ? data.output_text.trim() : "";
  if (text) {
    return text;
  }

  const fallback = Array.isArray(data.output)
    ? data.output
      .flatMap((item) => (Array.isArray(item.content) ? item.content : []))
      .find((item) => item && typeof item.text === "string")
    : null;
  if (fallback && fallback.text) {
    return String(fallback.text).trim();
  }

  const emptyOutputError = new Error("No AI text returned.");
  emptyOutputError.code = "openai_empty_output";
  emptyOutputError.provider = "openai";
  emptyOutputError.httpStatus = 200;
  emptyOutputError.detail = "Responses API returned without output_text/content text.";
  throw emptyOutputError;
}

async function generateGeminiReply({ channel, recipient, message, context }) {
  const systemPrompt = buildSystemPrompt(channel, recipient);
  const safeMessage = String(message || "").slice(0, 800);
  const safeContext = context && typeof context === "object" ? context : {};
  const safeModel = AI_MODEL.startsWith("models/") ? AI_MODEL.slice(7) : AI_MODEL;
  const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(safeModel)}:generateContent?key=${encodeURIComponent(GEMINI_API_KEY)}`;

  const abortController = new AbortController();
  const timeoutId = setTimeout(() => {
    abortController.abort();
  }, AI_TIMEOUT_MS);

  let response;
  try {
    response = await fetch(geminiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      signal: abortController.signal,
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: systemPrompt }]
        },
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `Context: ${JSON.stringify(safeContext)}\n\nTechnician message: ${safeMessage}`
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.6,
          maxOutputTokens: 140
        }
      })
    });
  } catch (error) {
    if (error && error.name === "AbortError") {
      const timeoutError = new Error("Gemini request timed out.");
      timeoutError.code = "gemini_timeout";
      timeoutError.provider = "gemini";
      timeoutError.httpStatus = null;
      timeoutError.detail = `Gemini fetch exceeded ${AI_TIMEOUT_MS}ms timeout.`;
      throw timeoutError;
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }

  if (!response.ok) {
    const errText = await response.text();
    let parsed = null;
    try {
      parsed = JSON.parse(errText);
    } catch (_error) {
      parsed = null;
    }
    const detail = parsed && parsed.error && parsed.error.message
      ? String(parsed.error.message)
      : String(errText || "").slice(0, 280);
    const upstreamError = new Error(`Gemini HTTP ${response.status}`);
    upstreamError.code = "gemini_http_error";
    upstreamError.provider = "gemini";
    upstreamError.httpStatus = response.status;
    upstreamError.detail = detail;
    throw upstreamError;
  }

  const data = await response.json();
  const candidates = Array.isArray(data.candidates) ? data.candidates : [];
  const parts = candidates
    .flatMap((candidate) => (candidate && candidate.content && Array.isArray(candidate.content.parts) ? candidate.content.parts : []));
  const text = parts
    .map((part) => (part && typeof part.text === "string" ? part.text : ""))
    .join(" ")
    .trim();
  if (text) {
    return text;
  }

  const blockReason = data && data.promptFeedback && data.promptFeedback.blockReason
    ? `Prompt blocked: ${String(data.promptFeedback.blockReason)}`
    : "Gemini returned no candidate text.";
  const emptyOutputError = new Error("No AI text returned.");
  emptyOutputError.code = "gemini_empty_output";
  emptyOutputError.provider = "gemini";
  emptyOutputError.httpStatus = 200;
  emptyOutputError.detail = blockReason;
  throw emptyOutputError;
}

async function generateAiReply({ channel, recipient, message, context }) {
  if (AI_PROVIDER === "gemini") {
    return generateGeminiReply({ channel, recipient, message, context });
  }
  if (AI_PROVIDER === "openai") {
    return generateOpenAiReply({ channel, recipient, message, context });
  }
  const noProviderError = new Error("No AI provider configured.");
  noProviderError.code = "missing_api_key";
  noProviderError.provider = "none";
  noProviderError.httpStatus = null;
  noProviderError.detail = getMissingApiKeyDetail("none");
  throw noProviderError;
}

app.post("/api/ai-chat", async (req, res) => {
  const requestId = createRequestId();
  const startedAt = Date.now();
  try {
    if (!hasProviderApiKey()) {
      const missingDetail = getMissingApiKeyDetail();
      pushAiError({
        requestId,
        code: "missing_api_key",
        provider: AI_PROVIDER,
        responseStatus: 503,
        channel: String(req.body && req.body.channel ? req.body.channel : "phone"),
        recipient: String(req.body && req.body.recipient ? req.body.recipient : "manager"),
        detail: missingDetail
      });
      return res.status(503).json({
        ok: false,
        error: `AI backend not configured. ${missingDetail}`,
        code: "missing_api_key",
        requestId
      });
    }

    const { channel, recipient, message, context } = req.body || {};
    const safeMessage = String(message || "").trim();
    if (!safeMessage) {
      return res.status(400).json({ ok: false, error: "message is required", code: "validation_error", requestId });
    }

    const reply = await generateAiReply({
      channel: String(channel || "phone"),
      recipient: String(recipient || "manager"),
      message: safeMessage,
      context
    });

    return res.json({ ok: true, reply, requestId, latencyMs: Date.now() - startedAt });
  } catch (error) {
    const summary = getErrorSummary(error);
    const body = req.body && typeof req.body === "object" ? req.body : {};
    const entry = {
      requestId,
      code: summary.code,
      provider: AI_PROVIDER,
      responseStatus: summary.responseStatus,
      upstreamStatus: summary.upstreamStatus,
      channel: String(body.channel || "phone"),
      recipient: String(body.recipient || "manager"),
      messagePreview: String(body.message || "").slice(0, 120),
      latencyMs: Date.now() - startedAt,
      detail: summary.detail
    };
    pushAiError(entry);
    console.error(`[AI ${requestId}]`, entry);
    return res.status(summary.responseStatus).json({
      ok: false,
      error: summary.clientMessage,
      code: summary.code,
      requestId,
      detail: summary.detail
    });
  }
});

app.get("/api/ai-errors", (_req, res) => {
  return res.json({
    ok: true,
    provider: AI_PROVIDER,
    providerConfig: AI_PROVIDER_CONFIG,
    hasApiKey: hasProviderApiKey(),
    hasOpenAiKey: Boolean(OPENAI_API_KEY),
    hasGeminiKey: Boolean(GEMINI_API_KEY),
    model: AI_MODEL,
    timeoutMs: AI_TIMEOUT_MS,
    totalErrors: aiErrorLog.length,
    errors: aiErrorLog.slice(-40)
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

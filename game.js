const canvas = document.querySelector("#game-canvas");
const statusLine = document.querySelector("#status-line");
const hintLine = document.querySelector("#hint-line");
const dashboard = document.querySelector("#dashboard");
const dashStop = document.querySelector("#dash-stop");
const speedValue = document.querySelector("#speed-value");
const speedLimitValue = document.querySelector("#speed-limit-value");
const distanceValue = document.querySelector("#distance-value");
const missionCompleteCard = document.querySelector("#mission-complete");
const missionCompleteTitle = document.querySelector("#mission-complete-title");
const missionCompleteMessage = document.querySelector("#mission-complete-message");
const missionCompleteMinButton = document.querySelector("#mission-complete-min-btn");
const safetyDisclaimerScreen = document.querySelector("#safety-disclaimer-screen");
const safetyDisclaimerAcceptButton = document.querySelector("#safety-disclaimer-accept-btn");
const phoneToggleButton = document.querySelector("#phone-toggle-btn");
const phonePanel = document.querySelector("#phone-panel");
const phoneServiceTitle = document.querySelector("#phone-service-title");
const phoneSpeedLimitLine = document.querySelector("#phone-speed-limit");
const phoneDriveSpeedPanel = document.querySelector(".phone-drive-speed");
const phoneDriveSpeedValue = document.querySelector("#phone-drive-speed-value");
const phoneDriveSpeedSlider = document.querySelector("#phone-drive-speed-slider");
const phoneSpeedDownButton = document.querySelector("#phone-speed-down-btn");
const phoneSpeedUpButton = document.querySelector("#phone-speed-up-btn");
const phoneServiceNote = document.querySelector("#phone-service-note");
const phoneAppButtons = document.querySelectorAll(".phone-app-btn");
const phoneMessagesView = document.querySelector("#phone-app-messages");
const phoneEmailView = document.querySelector("#phone-app-email");
const fieldMgmtPanel = document.querySelector("#field-mgmt-panel");
const phoneMsgRecipient = document.querySelector("#phone-msg-recipient");
const phoneMsgThread = document.querySelector("#phone-msg-thread");
const phoneMsgInput = document.querySelector("#phone-msg-input");
const phoneMsgSendButton = document.querySelector("#phone-msg-send-btn");
const phoneEmailManagerButton = document.querySelector("#phone-email-manager-btn");
const phoneEmailCustomerButton = document.querySelector("#phone-email-customer-btn");
const phoneEmailList = document.querySelector("#phone-email-list");
const phoneEmailInput = document.querySelector("#phone-email-input");
const fieldCustomerSelect = document.querySelector("#field-customer-select");
const fieldTimeInButton = document.querySelector("#field-time-in-btn");
const fieldTimeOutButton = document.querySelector("#field-time-out-btn");
const fieldTechComment = document.querySelector("#field-tech-comment");
const fieldSaveCommentButton = document.querySelector("#field-save-comment-btn");
const fieldOrderStatus = document.querySelector("#field-order-status");
const fieldOrderDetails = document.querySelector("#field-order-details");
const phoneRainToggleButton = document.querySelector("#phone-rain-toggle-btn");
const phoneRoadLockButton = document.querySelector("#phone-road-lock-btn");
const phoneStartOverDayButton = document.querySelector("#phone-start-over-day-btn");
const phoneControlsButton = document.querySelector("#phone-controls-btn");
const phoneControlsSheet = document.querySelector("#phone-controls-sheet");
const trainerPanel = document.querySelector("#trainer-panel");
const trainerTip = document.querySelector("#trainer-tip");
const trainerModeButton = document.querySelector("#trainer-mode-btn");
const trainerModeState = document.querySelector("#trainer-mode-state");
const customerModeButton = document.querySelector("#customer-mode-btn");
const customerModeState = document.querySelector("#customer-mode-state");
const customerDialogPanel = document.querySelector("#customer-dialog-panel");
const customerDialogTitle = document.querySelector("#customer-dialog-title");
const customerDialogLine = document.querySelector("#customer-dialog-line");
const customerDialogHint = document.querySelector("#customer-dialog-hint");
const customerDialogInputWrap = document.querySelector("#customer-dialog-input-wrap");
const customerDialogInput = document.querySelector("#customer-dialog-input");
const customerDialogSendButton = document.querySelector("#customer-dialog-send-btn");
const customerDialogNextButton = document.querySelector("#customer-dialog-next-btn");
const sideProfilePanel = document.querySelector("#side-profile-panel");
const sideProfileTitle = document.querySelector("#side-profile-title");
const sideProfileNote = document.querySelector("#side-profile-note");
const coverageLine = document.querySelector("#coverage-line");
const gpsCanvas = document.querySelector("#gps-canvas");
const touchControlsWrap = document.querySelector("#touch-controls");

if (!canvas) {
  throw new Error("Game canvas not found.");
}

const ctx = canvas.getContext("2d");
const gpsCtx = gpsCanvas ? gpsCanvas.getContext("2d") : null;

const world = {
  width: 2200,
  height: 1400
};

const roads = [
  { x: 90, y: 312, w: 2020, h: 84, axis: "h", speedLimitMph: 30, kind: "residential", marking: "dots", streetName: "Cedar Lane", nameSignSide: "bottom", showSigns: false },
  { x: 90, y: 642, w: 2020, h: 84, axis: "h", speedLimitMph: 30, kind: "residential", marking: "dots", streetName: "Briarwood Court", nameSignSide: "top", signStep: 680, signStartOffset: 240 },
  { x: 90, y: 972, w: 2020, h: 84, axis: "h", speedLimitMph: 30, kind: "residential", marking: "dots", streetName: "Meadow Park Drive", nameSignSide: "bottom", signStep: 680, signStartOffset: 240 },
  { x: 1268, y: 250, w: 78, h: 930, axis: "v", speedLimitMph: 25, kind: "arterial", marking: "dashes", streetName: "Willow Avenue", nameSignSide: "right", signStep: 320, signStartOffset: 170 },
  { x: 2030, y: 250, w: 70, h: 930, axis: "v", speedLimitMph: 20, kind: "arterial", marking: "dashes", streetName: "Pine Avenue", nameSignSide: "left", signStep: 320, signStartOffset: 170 }
];

function buildSpeedLimitSigns() {
  const signs = [];
  roads.forEach((road, index) => {
    if (road.showSigns === false) {
      return;
    }
    if (road.axis === "h") {
      const step = road.signStep || 430;
      const startOffset = road.signStartOffset || 260;
      for (let x = road.x + startOffset; x <= road.x + road.w - 120; x += step) {
        const putAbove = ((Math.floor(x / step) + index) % 2) === 0;
        signs.push({
          x,
          y: putAbove ? road.y - 14 : road.y + road.h + 14,
          limit: road.speedLimitMph,
          side: putAbove ? "top" : "bottom"
        });
      }
      return;
    }

    const step = road.signStep || 360;
    const startOffset = road.signStartOffset || 220;
    for (let y = road.y + startOffset; y <= road.y + road.h - 120; y += step) {
      const putLeft = ((Math.floor(y / step) + index) % 2) === 0;
      signs.push({
        x: putLeft ? road.x - 14 : road.x + road.w + 14,
        y,
        limit: road.speedLimitMph,
        side: putLeft ? "left" : "right"
      });
    }
  });
  return signs;
}

const speedLimitSigns = buildSpeedLimitSigns();

function buildStreetNameSigns() {
  const signs = [];
  roads.forEach((road) => {
    if (!road.streetName) {
      return;
    }

    if (road.axis === "h") {
      const side = road.nameSignSide === "top" ? "top" : "bottom";
      const xPositions = [road.x + 90, road.x + road.w - 90];
      xPositions.forEach((x) => {
        signs.push({
          x,
          y: side === "top" ? road.y : road.y + road.h,
          side,
          axis: "h",
          name: road.streetName
        });
      });
      return;
    }

    const side = road.nameSignSide === "left" ? "left" : "right";
    const yPositions = [road.y + 90, road.y + road.h - 90];
    yPositions.forEach((y) => {
      signs.push({
        x: side === "left" ? road.x : road.x + road.w,
        y,
        side,
        axis: "v",
        name: road.streetName
      });
    });
  });
  return signs;
}

const streetNameSigns = buildStreetNameSigns();

const HOUSE_NUMBER_BY_ID = {
  home: "1204",
  h2: "1212",
  h3: "1220",
  h4: "1228",
  target: "1428",
  h6: "1436",
  h7: "804",
  h8: "812",
  h9: "820",
  h10: "828",
  h11: "836",
  h12: "844",
  h13: "220",
  h14: "228",
  h15: "236",
  h16: "244",
  h17: "252",
  h18: "260"
};

const houses = [
  {
    id: "home",
    label: "Home",
    x: 210,
    y: 150,
    w: 180,
    h: 120,
    color: "#f1dcc0",
    roof: "#9b664c",
    driveway: { x: 287, y: 270, w: 32, h: 62 }
  },
  {
    id: "h2",
    label: "",
    x: 520,
    y: 150,
    w: 170,
    h: 120,
    color: "#dceecf",
    roof: "#5d7852",
    driveway: { x: 591, y: 270, w: 30, h: 62 }
  },
  {
    id: "h3",
    label: "",
    x: 800,
    y: 150,
    w: 170,
    h: 120,
    color: "#f2e5d6",
    roof: "#8b5f48",
    driveway: { x: 872, y: 270, w: 30, h: 62 }
  },
  {
    id: "h4",
    label: "",
    x: 1080,
    y: 150,
    w: 170,
    h: 120,
    color: "#d9ebf5",
    roof: "#5a728f",
    driveway: { x: 1152, y: 270, w: 30, h: 62 }
  },
  {
    id: "target",
    label: "First Stop",
    x: 1420,
    y: 150,
    w: 190,
    h: 120,
    color: "#f7e6d4",
    roof: "#a16348",
    driveway: { x: 1500, y: 270, w: 32, h: 62 }
  },
  {
    id: "h6",
    label: "",
    x: 1730,
    y: 150,
    w: 170,
    h: 120,
    color: "#e4edd2",
    roof: "#677f57",
    driveway: { x: 1802, y: 270, w: 30, h: 62 }
  },
  {
    id: "h7",
    label: "",
    x: 220,
    y: 500,
    w: 170,
    h: 120,
    color: "#f1dfd1",
    roof: "#8e5b4d",
    driveway: { x: 292, y: 620, w: 30, h: 30 }
  },
  {
    id: "h8",
    label: "",
    x: 560,
    y: 500,
    w: 170,
    h: 120,
    color: "#d4e9d8",
    roof: "#4e7e60",
    driveway: { x: 632, y: 620, w: 30, h: 30 }
  },
  {
    id: "h9",
    label: "",
    x: 900,
    y: 500,
    w: 170,
    h: 120,
    color: "#eef0d8",
    roof: "#8a844f",
    driveway: { x: 972, y: 620, w: 30, h: 30 }
  },
  {
    id: "h10",
    label: "",
    x: 1240,
    y: 500,
    w: 170,
    h: 120,
    color: "#d8e8f5",
    roof: "#607994",
    driveway: { x: 1312, y: 620, w: 30, h: 30 }
  },
  {
    id: "h11",
    label: "",
    x: 1580,
    y: 500,
    w: 170,
    h: 120,
    color: "#f2dfd0",
    roof: "#985a43",
    driveway: { x: 1652, y: 620, w: 30, h: 30 }
  },
  {
    id: "h12",
    label: "",
    x: 1920,
    y: 500,
    w: 170,
    h: 120,
    color: "#deecd5",
    roof: "#55784f",
    driveway: { x: 1992, y: 620, w: 30, h: 30 }
  },
  {
    id: "h13",
    label: "",
    x: 260,
    y: 820,
    w: 170,
    h: 120,
    color: "#f0e7d6",
    roof: "#8f6a4a",
    driveway: { x: 332, y: 940, w: 30, h: 40 }
  },
  {
    id: "h14",
    label: "",
    x: 590,
    y: 820,
    w: 170,
    h: 120,
    color: "#dbead1",
    roof: "#648056",
    driveway: { x: 662, y: 940, w: 30, h: 40 }
  },
  {
    id: "h15",
    label: "",
    x: 920,
    y: 820,
    w: 170,
    h: 120,
    color: "#d8e6f4",
    roof: "#56718d",
    driveway: { x: 992, y: 940, w: 30, h: 40 }
  },
  {
    id: "h16",
    label: "",
    x: 1250,
    y: 820,
    w: 170,
    h: 120,
    color: "#f2ddd1",
    roof: "#9a5f49",
    driveway: { x: 1322, y: 940, w: 30, h: 40 }
  },
  {
    id: "h17",
    label: "",
    x: 1580,
    y: 820,
    w: 170,
    h: 120,
    color: "#deecd4",
    roof: "#5b7a52",
    driveway: { x: 1652, y: 940, w: 30, h: 40 }
  },
  {
    id: "h18",
    label: "",
    x: 1910,
    y: 820,
    w: 170,
    h: 120,
    color: "#f3e6da",
    roof: "#8f6646",
    driveway: { x: 1982, y: 940, w: 30, h: 40 }
  }
];

const GARAGE_HOUSE_IDS = new Set([
  "home",
  "h3",
  "h14",
  "h6",
  "h8",
  "h10",
  "h12",
  "h15",
  "h17"
]);

const DECK_HOUSE_IDS = new Set([
  "h2",
  "h4",
  "target",
  "h8",
  "h11",
  "h14",
  "h18"
]);

const DECK_STAIR_COOLDOWN_SECONDS = 0.34;

const parkingSpot = {
  x: 1498,
  y: 356,
  w: 96,
  h: 48
};

function getHouseNumber(house, index) {
  const fromMap = HOUSE_NUMBER_BY_ID[house.id];
  if (fromMap) {
    return fromMap;
  }
  return String(1000 + index * 8);
}

function getHouseDisplayName(house, index) {
  const number = getHouseNumber(house, index);
  if (house.id === "home") {
    return `Home (${number})`;
  }
  return `${number} ${house.id === "target" ? "Cedar Lane" : ""}`.trim();
}

function rectsOverlap(a, b, padding = 0) {
  return (
    a.x < b.x + b.w + padding
    && a.x + a.w > b.x - padding
    && a.y < b.y + b.h + padding
    && a.y + a.h > b.y - padding
  );
}

function normalizeHousePlacementsAwayFromRoads() {
  const roadPadding = 4;
  const houseSpacing = 6;
  const worldMargin = 18;
  const maxPasses = 6;

  const doesOverlapRoads = (x, y, w, h) => {
    const rect = { x, y, w, h };
    return roads.some((road) => rectsOverlap(rect, road, roadPadding));
  };

  const doesOverlapHouses = (houseIndex, x, y, w, h) => {
    const rect = { x, y, w, h };
    return houses.some((other, index) => {
      if (index === houseIndex) {
        return false;
      }
      return rectsOverlap(rect, { x: other.x, y: other.y, w: other.w, h: other.h }, houseSpacing);
    });
  };

  const clampX = (value, houseW) => clamp(value, worldMargin, world.width - houseW - worldMargin);
  const clampY = (value, houseH) => clamp(value, worldMargin, world.height - houseH - worldMargin);

  houses.forEach((house, index) => {
    for (let pass = 0; pass < maxPasses; pass += 1) {
      const overlappingRoad = roads.find((road) => rectsOverlap(house, road, roadPadding));
      if (!overlappingRoad) {
        break;
      }

      const candidates = [];
      if (overlappingRoad.axis === "v") {
        candidates.push(
          { x: clampX(overlappingRoad.x - house.w - roadPadding - 2, house.w), y: house.y },
          { x: clampX(overlappingRoad.x + overlappingRoad.w + roadPadding + 2, house.w), y: house.y }
        );
      } else {
        candidates.push(
          { x: house.x, y: clampY(overlappingRoad.y - house.h - roadPadding - 2, house.h) },
          { x: house.x, y: clampY(overlappingRoad.y + overlappingRoad.h + roadPadding + 2, house.h) }
        );
      }

      let best = null;
      let bestScore = Infinity;
      candidates.forEach((candidate) => {
        const overlapsRoad = doesOverlapRoads(candidate.x, candidate.y, house.w, house.h);
        const overlapsHouse = doesOverlapHouses(index, candidate.x, candidate.y, house.w, house.h);
        if (overlapsRoad || overlapsHouse) {
          return;
        }
        const score = Math.hypot(candidate.x - house.x, candidate.y - house.y);
        if (score < bestScore) {
          best = candidate;
          bestScore = score;
        }
      });

      if (!best) {
        // Fallback: move away from this road even if nearby house spacing has to be tight.
        if (overlappingRoad.axis === "v") {
          const toLeft = Math.abs(house.x + house.w - overlappingRoad.x);
          const toRight = Math.abs(overlappingRoad.x + overlappingRoad.w - house.x);
          house.x = clampX(
            toLeft <= toRight
              ? overlappingRoad.x - house.w - roadPadding - 2
              : overlappingRoad.x + overlappingRoad.w + roadPadding + 2,
            house.w
          );
        } else {
          const toTop = Math.abs(house.y + house.h - overlappingRoad.y);
          const toBottom = Math.abs(overlappingRoad.y + overlappingRoad.h - house.y);
          house.y = clampY(
            toTop <= toBottom
              ? overlappingRoad.y - house.h - roadPadding - 2
              : overlappingRoad.y + overlappingRoad.h + roadPadding + 2,
            house.h
          );
        }
      } else {
        house.x = best.x;
        house.y = best.y;
      }
    }
  });
}

function getNearestHorizontalRoadForHouse(house) {
  const horizontalRoads = roads.filter((road) => road.axis === "h");
  if (!horizontalRoads.length || !house) {
    return null;
  }

  const frontageY = house.y + house.h;
  let bestRoad = horizontalRoads[0];
  let bestDistance = Infinity;
  horizontalRoads.forEach((road) => {
    const roadCenterY = road.y + road.h / 2;
    const dist = Math.abs(frontageY - roadCenterY);
    if (dist < bestDistance) {
      bestDistance = dist;
      bestRoad = road;
    }
  });
  return bestRoad;
}

function normalizeHouseDriveways() {
  houses.forEach((house) => {
    const road = getNearestHorizontalRoadForHouse(house);
    if (!road) {
      return;
    }

    const hasGarage = GARAGE_HOUSE_IDS.has(house.id);
    const houseFrontY = house.y + house.h;
    const roadCenterY = road.y + road.h / 2;
    const houseAboveRoad = houseFrontY <= roadCenterY;
    const preferredCenterX = hasGarage
      ? house.x + 8 + (house.w * 0.48) / 2
      : house.x + house.w / 2;
    const width = Math.round(clamp(hasGarage ? house.w * 0.27 : house.w * 0.23, 40, 56));
    const minX = Math.max(house.x + 6, road.x + 12);
    const maxX = Math.min(house.x + house.w - width - 6, road.x + road.w - width - 12);
    const safeMaxX = maxX < minX ? minX : maxX;
    const driveX = Math.round(clamp(preferredCenterX - width / 2, minX, safeMaxX));

    if (houseAboveRoad) {
      const topY = Math.round(houseFrontY);
      const bottomY = Math.round(road.y + 6);
      house.driveway = {
        x: driveX,
        y: topY,
        w: width,
        h: Math.max(24, bottomY - topY)
      };
      return;
    }

    const bottomY = Math.round(house.y);
    const topY = Math.round(road.y + road.h - 6);
    house.driveway = {
      x: driveX,
      y: topY,
      w: width,
      h: Math.max(24, bottomY - topY)
    };
  });
}

function buildHouseParkingSpots() {
  const horizontalRoads = roads.filter((road) => road.axis === "h");
  const verticalRoads = roads.filter((road) => road.axis === "v");
  const nudgeSpotAwayFromIntersections = (spotX, spotW, road, preferredCenterX) => {
    let adjustedX = spotX;
    const roadMinX = road.x + 8;
    const roadMaxX = road.x + road.w - spotW - 8;
    const overlapRoads = verticalRoads.filter((vRoad) => {
      const overlapY = !(vRoad.y + vRoad.h < road.y || vRoad.y > road.y + road.h);
      return overlapY;
    });

    overlapRoads.forEach((vRoad) => {
      const clearance = Math.max(16, Math.round(vRoad.w * 0.35));
      const blockedStart = vRoad.x - clearance;
      const blockedEnd = vRoad.x + vRoad.w + clearance;
      const overlapsBlocked = adjustedX + spotW > blockedStart && adjustedX < blockedEnd;
      if (!overlapsBlocked) {
        return;
      }

      const leftCandidate = blockedStart - spotW - 6;
      const rightCandidate = blockedEnd + 6;
      const leftValid = leftCandidate >= roadMinX;
      const rightValid = rightCandidate <= roadMaxX;
      const chooseRight = preferredCenterX >= (vRoad.x + vRoad.w / 2);

      if (leftValid && rightValid) {
        adjustedX = chooseRight ? rightCandidate : leftCandidate;
      } else if (rightValid) {
        adjustedX = rightCandidate;
      } else if (leftValid) {
        adjustedX = leftCandidate;
      }
    });

    return clamp(adjustedX, roadMinX, roadMaxX);
  };
  const spots = [];
  houses.forEach((house, index) => {
    if (house.id === "target") {
      spots.push({
        houseId: house.id,
        houseIndex: index,
        x: parkingSpot.x,
        y: parkingSpot.y,
        w: parkingSpot.w,
        h: parkingSpot.h
      });
      return;
    }

    const frontageY = house.y + house.h;
    let bestRoad = horizontalRoads[0];
    let bestDistance = Infinity;
    horizontalRoads.forEach((road) => {
      const roadCenterY = road.y + road.h / 2;
      const dist = Math.abs(frontageY - roadCenterY);
      if (dist < bestDistance) {
        bestDistance = dist;
        bestRoad = road;
      }
    });
    if (!bestRoad) {
      return;
    }

    const spotW = 90;
    const spotH = 40;
    const drivewayCenterX = house.driveway
      ? house.driveway.x + house.driveway.w / 2
      : house.x + house.w / 2;
    const initialSpotX = clamp(drivewayCenterX - spotW / 2, bestRoad.x + 8, bestRoad.x + bestRoad.w - spotW - 8);
    const spotX = nudgeSpotAwayFromIntersections(initialSpotX, spotW, bestRoad, drivewayCenterX);
    const houseAboveRoad = frontageY <= bestRoad.y;
    const spotY = houseAboveRoad
      ? bestRoad.y + 8
      : bestRoad.y + bestRoad.h - spotH - 8;

    spots.push({
      houseId: house.id,
      houseIndex: index,
      x: spotX,
      y: spotY,
      w: spotW,
      h: spotH
    });
  });
  return spots;
}

normalizeHousePlacementsAwayFromRoads();
normalizeHouseDriveways();
const houseParkingSpots = buildHouseParkingSpots();

const route = [
  { x: 301, y: 312 },
  { x: 301, y: 376 },
  { x: 980, y: 376 },
  { x: 1360, y: 376 },
  { x: 1548, y: 376 },
  { x: 1548, y: 380 }
];
const TOTAL_STOPS_PER_DAY = 5;
const MIN_DRIVE_SPEED_MPH = 0;
const MAX_DRIVE_SPEED_MPH = 45;
const RAIN_TRIGGER_CHANCE = 0.06;
const RAIN_TRIGGER_MIN_SECONDS = 75;
const RAIN_TRIGGER_MAX_SECONDS = 190;
const AI_CHAT_TIMEOUT_MS = 12000;
const MAX_SPRAY_TRAIL_MARKS_PER_SIDE = 900;
const SPRAY_TRAIL_STAMP_INTERVAL = 0.03;
const DAY_PROGRESS_STORAGE_KEY = "pest-control-day-progress-v1";
const DAY_PROGRESS_STORAGE_VERSION = 1;
const DAY_PROGRESS_AUTOSAVE_SECONDS = 1.2;
const HOME_PLAYER_START = { x: 256, y: 305 };
const HOME_TRUCK_START = { x: 301, y: 312, angle: Math.PI / 2 };
const TRAINER_FOLLOW_DISTANCE = 66;
const TRAINER_FOLLOW_LERP = 4.4;
const TRAINER_TELEPORT_DISTANCE = 340;

const INITIAL_DEDUCTION_TALLY = {
  speeding: { count: 0, points: 0, label: "Speeding" },
  window: { count: 0, points: 0, label: "Sprayed Window Directly" },
  door: { count: 0, points: 0, label: "Sprayed Door Directly" },
  protected: { count: 0, points: 0, label: "Sprayed Protected Item" },
  timein: { count: 0, points: 0, label: "Left Vehicle Before Time In" }
};

const INITIAL_PHONE_COMMS = {
  messages: [
    { direction: "incoming", from: "Manager", text: "Morning. Confirm each stop in Field Management before service." }
  ],
  emails: [
    { from: "Dispatch", subject: "Route Loaded", body: "Today's five-stop route is ready. Drive safe and log all notes." }
  ]
};

const SERVICE_TYPES = [
  "Premier Home Perimeter+",
  "Premier Perimeter Barrier",
  "General Pest Barrier Spray",
  "Ant + Spider Exterior Treatment",
  "Mosquito Yard Fogging",
  "Rodent Inspection and Bait Stations",
  "Termite Perimeter Inspection"
];

const SERVICE_TRAINER_GUIDE = {
  "Premier Home Perimeter+": [
    "Premier Home: treat under eaves, around windows and doors, and along foundation seams.",
    "Use a steady mid concentration so product sticks without bouncing off siding.",
    "Complete all four sides before wrapping the ticket."
  ],
  "Premier Perimeter Barrier": [
    "Premier Perimeter: treat under eaves, and apply around windows and doors without direct contact.",
    "Keep concentration balanced so product sticks around openings.",
    "You lose points if spray lands directly on a window or door."
  ],
  "General Pest Barrier Spray": [
    "Start with an exterior perimeter spray, then treat door thresholds and window edges.",
    "Watch for moisture spots and entry points where ants or roaches track in.",
    "Keep product off toys, pet bowls, and food-contact surfaces."
  ],
  "Ant + Spider Exterior Treatment": [
    "Knock down visible webs first, then apply treatment along eaves and foundation joints.",
    "Focus on cracks, utility penetrations, and mulch lines where ant trails are active.",
    "Document nest activity and recommend trimming vegetation touching siding."
  ],
  "Mosquito Yard Fogging": [
    "Fog shaded harborage zones first: shrubs, fence lines, and damp corners.",
    "Avoid pollinator-heavy flowers during active bee hours and keep drift controlled.",
    "Note standing water sources and advise the customer on reduction steps."
  ],
  "Rodent Inspection and Bait Stations": [
    "Inspect for rub marks, droppings, and gnaw points before placing stations.",
    "Set tamper-resistant bait stations along travel paths near structure edges.",
    "Record station locations so follow-up checks are consistent."
  ],
  "Termite Perimeter Inspection": [
    "Inspect slab edges, expansion joints, and wood-to-soil contact points first.",
    "Check for mud tubes, moisture problems, and conducive conditions around the home.",
    "Photograph findings and flag high-risk areas for follow-up treatment."
  ]
};

const ORDER_PLAN_OPTIONS = [
  "Premier Home Perimeter+",
  "Premier Perimeter Barrier",
  "General Pest Barrier Spray",
  "Ant + Spider Exterior Treatment",
  "Rodent Inspection and Bait Stations",
  "Termite Perimeter Inspection"
];

const CUSTOMER_FIRST_NAMES = [
  "Ava",
  "Mason",
  "Isla",
  "Ethan",
  "Harper",
  "Liam",
  "Nora",
  "Leo",
  "Sofia",
  "Caleb",
  "Naomi",
  "Owen"
];

const CUSTOMER_LAST_NAMES = [
  "Miller",
  "Nguyen",
  "Santos",
  "Patel",
  "Johnson",
  "Rivera",
  "Brooks",
  "Campbell",
  "Lopez",
  "Garcia",
  "Bennett",
  "Diaz"
];

const ORDER_ADDRESS_BOOK = [
  "1428 Cedar Lane",
  "804 Cedar Lane",
  "221 Briarwood Ct",
  "97 Meadow Park Dr",
  "515 Oakview Ave"
];
const CUSTOMER_HOME_CHANCE = 0.58;

function cloneJson(value) {
  if (value === undefined) {
    return undefined;
  }
  return JSON.parse(JSON.stringify(value));
}

function getInitialDeductionTally() {
  return cloneJson(INITIAL_DEDUCTION_TALLY);
}

function getInitialPhoneComms() {
  return cloneJson(INITIAL_PHONE_COMMS);
}

function shuffleArray(values) {
  const copy = Array.isArray(values) ? values.slice() : [];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = copy[i];
    copy[i] = copy[j];
    copy[j] = tmp;
  }
  return copy;
}

function buildCustomerOrders() {
  const firstNames = shuffleArray(CUSTOMER_FIRST_NAMES);
  const lastNames = shuffleArray(CUSTOMER_LAST_NAMES);
  const plans = shuffleArray(ORDER_PLAN_OPTIONS);
  return ORDER_ADDRESS_BOOK.map((address, index) => {
    const first = firstNames[index % firstNames.length] || "Alex";
    const last = lastNames[index % lastNames.length] || "Taylor";
    return {
      id: `ord${index + 1}`,
      customer: `${first} ${last}`,
      firstName: first,
      lastName: last,
      address,
      plan: plans[index % plans.length] || ORDER_PLAN_OPTIONS[0],
      isHome: Math.random() < CUSTOMER_HOME_CHANCE
    };
  });
}

const CUSTOMER_ORDERS = buildCustomerOrders();
const DEFAULT_CUSTOMER_ORDERS = cloneJson(CUSTOMER_ORDERS);

function haveSameCustomerRouteSignature(ordersA, ordersB) {
  if (!Array.isArray(ordersA) || !Array.isArray(ordersB) || ordersA.length !== ordersB.length) {
    return false;
  }
  for (let i = 0; i < ordersA.length; i += 1) {
    const a = ordersA[i];
    const b = ordersB[i];
    if (!a || !b) {
      return false;
    }
    if (String(a.customer || "") !== String(b.customer || "")) {
      return false;
    }
    if (Boolean(a.isHome) !== Boolean(b.isHome)) {
      return false;
    }
  }
  return true;
}

function buildFreshCustomerOrders(previousOrders) {
  const prior = Array.isArray(previousOrders) ? previousOrders : [];
  let nextOrders = buildCustomerOrders();
  let attempts = 0;
  while (attempts < 8 && haveSameCustomerRouteSignature(nextOrders, prior)) {
    nextOrders = buildCustomerOrders();
    attempts += 1;
  }
  return nextOrders;
}

const SCRIPTED_CUSTOMER_LINES = [
  { speaker: "Customer", text: "Hey, thanks for coming by." },
  { speaker: "You", text: "Absolutely. I am here for your scheduled service and will start outside first." },
  { speaker: "Customer", text: "Sounds good. Gate is unlocked and pets are inside." }
];

const targetHouse = houses.find((house) => house.id === "target");
const HOUSE_SIDES = ["north", "east", "south", "west"];
const SIDE_LABELS = {
  north: "North Side",
  east: "East Side",
  south: "South Side",
  west: "West Side"
};

function createSideSprayTrail() {
  return {
    north: [],
    east: [],
    south: [],
    west: []
  };
}

const SPRAYER_IDEAL_CONCENTRATION = 0.56;
const WINDOW_TARGET_MARGIN = 18;
const DOOR_TARGET_MARGIN = 20;
const WINDOW_DIRECT_HIT_INSET = 7;
const DOOR_DIRECT_HIT_INSET = 8;
const SERVICE_PHASES = new Set(["service_briefing", "walk_to_door", "conversation", "working"]);
const FIRST_PERSON_PHASES = new Set(["walk_to_door", "conversation", "webster_pickup", "webster_working", "working"]);
const WEBSTER_REACH = 36;
const WEBSTER_STRIKE_DURATION = 0.28;
const REQUIRED_OPENING_COVERAGE_PERCENT = 100;
const targetDoorZone = targetHouse
  ? {
    x: targetHouse.x + targetHouse.w / 2 - 30,
    y: targetHouse.y + targetHouse.h + 4,
    w: 60,
    h: 36
  }
  : { x: 1500, y: 276, w: 60, h: 36 };

function createPerimeterBucket() {
  return { top: 0, right: 0, bottom: 0, left: 0 };
}

function isDoorRequiredForSide(side) {
  return side === "south";
}

function createSideOpeningPerimeter() {
  return {
    north: {
      windowLeft: createPerimeterBucket(),
      windowRight: createPerimeterBucket(),
      door: createPerimeterBucket()
    },
    east: {
      windowLeft: createPerimeterBucket(),
      windowRight: createPerimeterBucket(),
      door: createPerimeterBucket()
    },
    south: {
      windowLeft: createPerimeterBucket(),
      windowRight: createPerimeterBucket(),
      door: createPerimeterBucket()
    },
    west: {
      windowLeft: createPerimeterBucket(),
      windowRight: createPerimeterBucket(),
      door: createPerimeterBucket()
    }
  };
}

const player = {
  x: 256,
  y: 305,
  radius: 13,
  speed: 190
};

const truck = {
  x: 301,
  y: 312,
  angle: Math.PI / 2,
  speed: 0,
  w: 94,
  h: 44
};

const state = {
  phase: "walk_to_truck",
  inTruck: false,
  missionComplete: false,
  dayComplete: false,
  stopNumber: 1,
  dayTotalPoints: TOTAL_STOPS_PER_DAY * 100,
  dayPointsEarned: TOTAL_STOPS_PER_DAY * 100,
  currentStopPenaltyPoints: 0,
  deductionTally: getInitialDeductionTally(),
  speedPenaltyAccumulator: 0,
  dingAnimationTimer: 0,
  dingAnimationText: "",
  dingAnimationDetail: "",
  sprayViolationFlashTimer: 0,
  mapOpen: false,
  trainerMode: false,
  trainerFollower: {
    x: HOME_PLAYER_START.x - 34,
    y: HOME_PLAYER_START.y + 26
  },
  currentWaypoint: 1,
  parkedHold: 0,
  parkLocked: false,
  missedTimeInExitDinged: false,
  vehicleDoors: {
    driver: false,
    right: false,
    rear: false
  },
  serviceType: "",
  customerHome: false,
  customerAiMode: false,
  missionBannerMinimized: false,
  serviceBriefTimer: 0,
  conversationTimer: 0,
  customerDialog: {
    active: false,
    scriptedIndex: 0,
    scriptedLines: [],
    currentSpeaker: "",
    currentLine: "",
    playerMessagesSent: 0,
    aiReadyToComplete: false,
    aiPending: false,
    replySource: ""
  },
  completionBannerTimer: 0,
  disclaimerAccepted: false,
  serviceCoverage: {
    north: 0,
    east: 0,
    south: 0,
    west: 0
  },
  openingCoverage: {
    window: 0,
    door: 0
  },
  openingPerimeterBySide: createSideOpeningPerimeter(),
  sprayTrailBySide: createSideSprayTrail(),
  sprayTrailStampTimer: 0,
  activeHouseSide: "",
  sprayerConcentration: SPRAYER_IDEAL_CONCENTRATION,
  hoseMaxLength: 285,
  sprayActive: false,
  sprayBounceHits: 0,
  serviceComplete: false,
  sprayerNeedsRollup: false,
  hasPowerSprayer: false,
  serviceCompletionNote: "",
  hasWebster: false,
  webTargets: [],
  websterStrike: {
    active: false,
    side: "",
    x: 0,
    y: 0,
    hit: false,
    timer: 0,
    duration: WEBSTER_STRIKE_DURATION
  },
  serviceScore: 100,
  penaltyCooldown: 0,
  windowDirectHits: 0,
  doorDirectHits: 0,
  sprayerFeedback: "",
  sprayerFeedbackTimer: 0,
  noSprayZones: [],
  nearbyNoSprayZoneType: "",
  currentSpeedLimitMph: 25,
  speedLimiterActive: false,
  roadLockEnabled: false,
  targetDriveSpeedMph: 20,
  cruiseEnabled: false,
  phoneOpen: false,
  phoneControlsOpen: false,
  phoneApp: "field",
  phoneEmailPending: false,
  techCommentEditing: false,
  aiErrorEvents: [],
  aiLastError: "",
  aiLastErrorCode: "",
  aiLastRequestId: "",
  aiErrorToastCooldown: 0,
  phoneComms: getInitialPhoneComms(),
  firstPerson: {
    active: false,
    side: ""
  },
  fieldOrder: {
    selectedCustomerId: "",
    timedIn: false,
    timeInStamp: "",
    timedOut: false,
    timeOutStamp: "",
    techComment: "",
    pendingCloseout: null
  },
  fieldOrderLog: [],
  rain: {
    enabled: true,
    usedToday: false,
    willTrigger: Math.random() < RAIN_TRIGGER_CHANCE,
    triggered: false,
    active: false,
    elapsed: 0,
    triggerAt: randomBetween(RAIN_TRIGGER_MIN_SECONDS, RAIN_TRIGGER_MAX_SECONDS),
    context: "",
    stage: ""
  },
  pointer: {
    x: 0,
    y: 0,
    insideCanvas: false
  },
  deckStairCooldown: 0,
  timeMs: 0
};

const camera = {
  x: 0,
  y: 0
};

const view = {
  width: 0,
  height: 0
};

const input = {
  up: false,
  down: false,
  left: false,
  right: false,
  spray: false
};

const touchInput = {
  up: false,
  down: false,
  left: false,
  right: false
};

let dayProgressAutosaveTimer = 0;

function resetGameplayInputs() {
  input.up = false;
  input.down = false;
  input.left = false;
  input.right = false;
  input.spray = false;
}

function setSafetyDisclaimerAccepted(accepted) {
  state.disclaimerAccepted = Boolean(accepted);
  if (safetyDisclaimerScreen) {
    safetyDisclaimerScreen.hidden = state.disclaimerAccepted;
  }
  if (state.disclaimerAccepted) {
    if (statusLine && state.phase === "walk_to_truck" && !state.inTruck) {
      statusLine.textContent = "Walk to your truck and press E to get in.";
    }
    if (hintLine && state.phase === "walk_to_truck" && !state.inTruck) {
      hintLine.textContent = "WASD/Arrows to move. Use E to enter truck.";
    }
    saveDayProgressSnapshot();
    return;
  }
  if (!state.disclaimerAccepted) {
    resetGameplayInputs();
    Object.keys(touchInput).forEach((key) => {
      touchInput[key] = false;
    });
    if (statusLine) {
      statusLine.textContent = "Review the required notice and click I Understand to begin.";
    }
    if (hintLine) {
      hintLine.textContent = "Gameplay starts after you accept the safety disclaimer.";
    }
  }
  saveDayProgressSnapshot();
}

function acceptSafetyDisclaimer(event) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }
  setSafetyDisclaimerAccepted(true);
  if (safetyDisclaimerAcceptButton instanceof HTMLElement) {
    safetyDisclaimerAcceptButton.blur();
  }
}

function getDayProgressStorage() {
  if (typeof window === "undefined" || !window.localStorage) {
    return null;
  }
  return window.localStorage;
}

function normalizeDeductionTally(rawTally) {
  const base = getInitialDeductionTally();
  Object.keys(base).forEach((key) => {
    const source = rawTally && typeof rawTally === "object" ? rawTally[key] : null;
    const sourceCount = source && Number.isFinite(Number(source.count)) ? Number(source.count) : 0;
    const sourcePoints = source && Number.isFinite(Number(source.points)) ? Number(source.points) : 0;
    base[key].count = Math.max(0, Math.round(sourceCount));
    base[key].points = Math.max(0, Math.round(sourcePoints));
  });
  return base;
}

function normalizePhoneComms(rawComms) {
  const fallback = getInitialPhoneComms();
  const messagesRaw = rawComms && Array.isArray(rawComms.messages) ? rawComms.messages : [];
  const emailsRaw = rawComms && Array.isArray(rawComms.emails) ? rawComms.emails : [];
  const messages = messagesRaw
    .map((item) => ({
      direction: item && item.direction === "outgoing" ? "outgoing" : "incoming",
      from: String(item && item.from ? item.from : "Contact").slice(0, 40),
      text: String(item && item.text ? item.text : "").trim().slice(0, 240)
    }))
    .filter((item) => item.text.length > 0)
    .slice(-40);
  const emails = emailsRaw
    .map((item) => ({
      from: String(item && item.from ? item.from : "Dispatch").slice(0, 60),
      subject: String(item && item.subject ? item.subject : "Update").slice(0, 90),
      body: String(item && item.body ? item.body : "").trim().slice(0, 500)
    }))
    .filter((item) => item.body.length > 0)
    .slice(-30);

  return {
    messages: messages.length > 0 ? messages : fallback.messages,
    emails: emails.length > 0 ? emails : fallback.emails
  };
}

function normalizeFieldOrderLog(rawLog) {
  if (!Array.isArray(rawLog)) {
    return [];
  }
  return rawLog
    .map((item) => {
      const stopValue = Number(item && item.stop);
      const stopScoreValue = Number(item && item.stopScore);
      return {
        stop: clamp(Number.isFinite(stopValue) ? Math.round(stopValue) : 1, 1, TOTAL_STOPS_PER_DAY),
      customer: String(item && item.customer ? item.customer : "").slice(0, 80),
      address: String(item && item.address ? item.address : "").slice(0, 80),
      timedInAt: String(item && item.timedInAt ? item.timedInAt : "").slice(0, 24),
      timedOutAt: String(item && item.timedOutAt ? item.timedOutAt : "").slice(0, 24),
      rescheduled: Boolean(item && item.rescheduled),
      completedService: Boolean(item && item.completedService),
      note: String(item && item.note ? item.note : "").slice(0, 220),
        stopScore: clamp(Number.isFinite(stopScoreValue) ? Math.round(stopScoreValue) : 0, 0, 100)
      };
    })
    .slice(-TOTAL_STOPS_PER_DAY);
}

function normalizeCustomerOrders(rawOrders) {
  return ORDER_ADDRESS_BOOK.map((address, index) => {
    const fallback = DEFAULT_CUSTOMER_ORDERS[index] || {
      id: `ord${index + 1}`,
      firstName: "Alex",
      lastName: "Taylor",
      customer: "Alex Taylor",
      address,
      plan: ORDER_PLAN_OPTIONS[0],
      isHome: true
    };
    const source = Array.isArray(rawOrders) ? rawOrders[index] : null;
    const firstName = String(source && source.firstName ? source.firstName : fallback.firstName).trim().slice(0, 30) || fallback.firstName;
    const lastName = String(source && source.lastName ? source.lastName : fallback.lastName).trim().slice(0, 30) || fallback.lastName;
    const customer = `${firstName} ${lastName}`.trim();
    const planCandidate = String(source && source.plan ? source.plan : fallback.plan).trim();
    const plan = ORDER_PLAN_OPTIONS.includes(planCandidate) ? planCandidate : fallback.plan;
    const fallbackIsHome = typeof fallback.isHome === "boolean" ? fallback.isHome : Math.random() < CUSTOMER_HOME_CHANCE;
    const isHome = source && typeof source.isHome === "boolean" ? source.isHome : fallbackIsHome;
    return {
      id: `ord${index + 1}`,
      customer: customer || fallback.customer,
      firstName,
      lastName,
      address,
      plan,
      isHome: Boolean(isHome)
    };
  });
}

function createDayProgressSnapshot() {
  return {
    version: DAY_PROGRESS_STORAGE_VERSION,
    savedAt: Date.now(),
    stopNumber: clamp(Math.round(Number(state.stopNumber) || 1), 1, TOTAL_STOPS_PER_DAY),
    dayComplete: Boolean(state.dayComplete),
    dayPointsEarned: clamp(Math.round(Number(state.dayPointsEarned) || 0), 0, TOTAL_STOPS_PER_DAY * 100),
    deductionTally: normalizeDeductionTally(state.deductionTally),
    fieldOrderLog: normalizeFieldOrderLog(state.fieldOrderLog),
    rainUsedToday: Boolean(state.rain.usedToday),
    rainEnabled: Boolean(state.rain.enabled),
    trainerMode: Boolean(state.trainerMode),
    customerAiMode: Boolean(state.customerAiMode),
    disclaimerAccepted: Boolean(state.disclaimerAccepted),
    targetDriveSpeedMph: clamp(Number(state.targetDriveSpeedMph) || 20, MIN_DRIVE_SPEED_MPH, MAX_DRIVE_SPEED_MPH),
    roadLockEnabled: Boolean(state.roadLockEnabled),
    missionBannerMinimized: Boolean(state.missionBannerMinimized),
    phoneComms: normalizePhoneComms(state.phoneComms),
    customerOrders: normalizeCustomerOrders(CUSTOMER_ORDERS)
  };
}

function saveDayProgressSnapshot() {
  const storage = getDayProgressStorage();
  if (!storage) {
    return;
  }
  try {
    const payload = createDayProgressSnapshot();
    storage.setItem(DAY_PROGRESS_STORAGE_KEY, JSON.stringify(payload));
  } catch (_error) {
    // Ignore storage failures and continue gameplay.
  }
}

function loadDayProgressSnapshot() {
  const storage = getDayProgressStorage();
  if (!storage) {
    return null;
  }
  try {
    const raw = storage.getItem(DAY_PROGRESS_STORAGE_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw);
    if (!parsed || Number(parsed.version) !== DAY_PROGRESS_STORAGE_VERSION) {
      return null;
    }
    return parsed;
  } catch (_error) {
    return null;
  }
}

function clearDayProgressSnapshot() {
  const storage = getDayProgressStorage();
  if (!storage) {
    return;
  }
  try {
    storage.removeItem(DAY_PROGRESS_STORAGE_KEY);
  } catch (_error) {
    // Ignore storage failures and continue gameplay.
  }
}

function applyDayProgressSnapshot(snapshot) {
  if (!snapshot || typeof snapshot !== "object") {
    return false;
  }

  const restoredOrders = normalizeCustomerOrders(snapshot.customerOrders);
  CUSTOMER_ORDERS.splice(0, CUSTOMER_ORDERS.length, ...restoredOrders);

  state.dayTotalPoints = TOTAL_STOPS_PER_DAY * 100;
  state.dayPointsEarned = clamp(Math.round(Number(snapshot.dayPointsEarned) || state.dayTotalPoints), 0, state.dayTotalPoints);
  state.deductionTally = normalizeDeductionTally(snapshot.deductionTally);
  state.fieldOrderLog = normalizeFieldOrderLog(snapshot.fieldOrderLog);
  state.stopNumber = clamp(Math.round(Number(snapshot.stopNumber) || 1), 1, TOTAL_STOPS_PER_DAY);
  state.currentStopPenaltyPoints = 0;
  state.speedPenaltyAccumulator = 0;
  state.rain.usedToday = Boolean(snapshot.rainUsedToday);
  state.rain.enabled = snapshot.rainEnabled !== false;
  state.trainerMode = Boolean(snapshot.trainerMode);
  state.customerAiMode = Boolean(snapshot.customerAiMode);
  state.targetDriveSpeedMph = clamp(
    Number.isFinite(Number(snapshot.targetDriveSpeedMph)) ? Number(snapshot.targetDriveSpeedMph) : state.targetDriveSpeedMph,
    MIN_DRIVE_SPEED_MPH,
    MAX_DRIVE_SPEED_MPH
  );
  state.roadLockEnabled = Boolean(snapshot.roadLockEnabled);
  state.phoneComms = normalizePhoneComms(snapshot.phoneComms);
  state.phoneOpen = false;
  state.phoneControlsOpen = false;
  state.phoneApp = "field";
  state.aiErrorEvents = [];
  state.aiLastError = "";
  state.aiLastErrorCode = "";
  state.aiLastRequestId = "";
  state.aiErrorToastCooldown = 0;
  dayProgressAutosaveTimer = 0;

  const restoredDayComplete = Boolean(snapshot.dayComplete);
  if (restoredDayComplete) {
    state.stopNumber = TOTAL_STOPS_PER_DAY;
    finishDayAndShowSummary();
  } else {
    state.dayComplete = false;
    stageNextStopDrive();
    if (missionCompleteCard) {
      missionCompleteCard.hidden = true;
    }
  }

  setTrainerMode(state.trainerMode);
  setCustomerAiMode(state.customerAiMode);
  setRainEnabled(state.rain.enabled, { silent: true });
  setRoadLockEnabled(state.roadLockEnabled, { silent: true });
  setTargetDriveSpeed(state.targetDriveSpeedMph);
  setPhoneOpen(false);
  setPhoneControlsOpen(false);
  setPhoneApp("field", { force: true });
  updatePhoneMessagesUi();
  updatePhoneEmailUi();
  setMissionBannerMinimized(Boolean(snapshot.missionBannerMinimized));
  setSafetyDisclaimerAccepted(Boolean(snapshot.disclaimerAccepted));
  resetGameplayInputs();

  if (state.disclaimerAccepted && !state.dayComplete) {
    setSprayerFeedback(`Progress restored: back to Stop ${state.stopNumber}/${TOTAL_STOPS_PER_DAY}.`, 1.4);
  }

  return true;
}

function resetDayProgressToStart() {
  const previousOrders = normalizeCustomerOrders(CUSTOMER_ORDERS);
  const refreshedOrders = buildFreshCustomerOrders(previousOrders);
  CUSTOMER_ORDERS.splice(0, CUSTOMER_ORDERS.length, ...normalizeCustomerOrders(refreshedOrders));
  state.stopNumber = 1;
  state.dayTotalPoints = TOTAL_STOPS_PER_DAY * 100;
  state.dayPointsEarned = state.dayTotalPoints;
  state.currentStopPenaltyPoints = 0;
  state.deductionTally = getInitialDeductionTally();
  state.fieldOrderLog = [];
  state.dayComplete = false;
  state.missionComplete = false;
  state.speedPenaltyAccumulator = 0;
  state.rain.usedToday = false;
  state.rain.active = false;
  state.rain.triggered = false;
  state.rain.elapsed = 0;
  state.rain.context = "";
  state.rain.stage = "";
  state.phoneComms = getInitialPhoneComms();
  state.phoneOpen = false;
  state.phoneControlsOpen = false;
  state.phoneApp = "field";
  state.aiErrorEvents = [];
  state.aiLastError = "";
  state.aiLastErrorCode = "";
  state.aiLastRequestId = "";
  state.aiErrorToastCooldown = 0;

  stageNextStopDrive();
  setMissionBannerMinimized(false);
  setPhoneOpen(false);
  setPhoneControlsOpen(false);
  setPhoneApp("field", { force: true });
  updatePhoneMessagesUi();
  updatePhoneEmailUi();

  if (missionCompleteCard) {
    missionCompleteCard.hidden = true;
  }

  clearDayProgressSnapshot();
  saveDayProgressSnapshot();
  dayProgressAutosaveTimer = 0;
}

function tryStartOverDayFromPhone() {
  if (!ensurePhoneOpsAllowed("Put the vehicle in park before starting over the day.")) {
    updatePhoneAppUi();
    return;
  }
  const shouldReset = typeof window === "undefined"
    ? true
    : window.confirm("Start over this 5-stop day? Your current stop progress and score will reset.");
  if (!shouldReset) {
    return;
  }
  resetDayProgressToStart();
  setSprayerFeedback("Day restarted with a fresh set of customers. Back to Stop 1/5.", 1.35);
}

function updateDayProgressAutosave(dt) {
  dayProgressAutosaveTimer += Math.max(0, dt || 0);
  if (dayProgressAutosaveTimer >= DAY_PROGRESS_AUTOSAVE_SECONDS) {
    dayProgressAutosaveTimer = 0;
    saveDayProgressSnapshot();
  }
}

function isTextEntryElement(element) {
  if (!(element instanceof HTMLElement)) {
    return false;
  }
  if (element.isContentEditable) {
    return true;
  }
  return element.tagName === "INPUT" || element.tagName === "TEXTAREA" || element.tagName === "SELECT";
}

function applyMovementKeyState(code, isDown) {
  if (code === "ArrowUp" || code === "KeyW") {
    input.up = isDown;
    return true;
  }
  if (code === "ArrowDown" || code === "KeyS") {
    input.down = isDown;
    return true;
  }
  if (code === "ArrowLeft" || code === "KeyA") {
    input.left = isDown;
    return true;
  }
  if (code === "ArrowRight" || code === "KeyD") {
    input.right = isDown;
    return true;
  }
  if (code === "Space") {
    input.spray = isDown;
    return true;
  }
  return false;
}

function updatePointerFromEvent(event) {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  state.pointer.x = clamp(x, 0, rect.width);
  state.pointer.y = clamp(y, 0, rect.height);
  state.pointer.insideCanvas = true;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function parseHexColor(color) {
  if (typeof color !== "string") {
    return null;
  }
  let hex = color.trim();
  if (hex.startsWith("#")) {
    hex = hex.slice(1);
  }
  if (hex.length === 3) {
    hex = `${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`;
  }
  if (!/^[0-9a-fA-F]{6}$/.test(hex)) {
    return null;
  }
  return {
    r: parseInt(hex.slice(0, 2), 16),
    g: parseInt(hex.slice(2, 4), 16),
    b: parseInt(hex.slice(4, 6), 16)
  };
}

function shadeColor(color, amount) {
  const rgb = parseHexColor(color);
  if (!rgb) {
    return color;
  }
  const mixAmount = clamp(Math.abs(amount), 0, 1);
  const target = amount < 0 ? 0 : 255;
  const r = Math.round(rgb.r + (target - rgb.r) * mixAmount);
  const g = Math.round(rgb.g + (target - rgb.g) * mixAmount);
  const b = Math.round(rgb.b + (target - rgb.b) * mixAmount);
  return `rgb(${r}, ${g}, ${b})`;
}

function colorWithAlpha(color, alpha) {
  const rgb = parseHexColor(color);
  const safeAlpha = clamp(alpha, 0, 1);
  if (!rgb) {
    return `rgba(255, 255, 255, ${safeAlpha.toFixed(3)})`;
  }
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${safeAlpha.toFixed(3)})`;
}

function randomBetween(min, max) {
  return min + Math.random() * (max - min);
}

function lerp(start, end, t) {
  return start + (end - start) * t;
}

function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function getCurrentOrder() {
  if (!CUSTOMER_ORDERS.length) {
    return null;
  }
  const orderIndex = clamp(state.stopNumber - 1, 0, CUSTOMER_ORDERS.length - 1);
  return CUSTOMER_ORDERS[orderIndex] || CUSTOMER_ORDERS[0];
}

function getOrderById(orderId) {
  const safeId = String(orderId || "").trim();
  if (!safeId) {
    return null;
  }
  return CUSTOMER_ORDERS.find((order) => order.id === safeId) || null;
}

function getShiftClockText(timeMs = state.timeMs) {
  const startMinutes = 8 * 60;
  const elapsedMinutes = Math.floor(Math.max(0, timeMs) / 60000);
  const total = startMinutes + elapsedMinutes;
  const hours24 = Math.floor(total / 60) % 24;
  const minutes = total % 60;
  const suffix = hours24 >= 12 ? "PM" : "AM";
  const hours12 = ((hours24 + 11) % 12) + 1;
  return `${hours12}:${String(minutes).padStart(2, "0")} ${suffix}`;
}

function getFieldOrderStatusText() {
  const order = getCurrentOrder();
  if (!order) {
    return "No active order.";
  }
  if (!state.fieldOrder.timedIn) {
    return `Assigned: ${order.customer}. Select this customer and Time In before service.`;
  }
  if (state.fieldOrder.pendingCloseout && !state.fieldOrder.timedOut) {
    const hasComment = String(state.fieldOrder.techComment || "").trim().length >= 8;
    return hasComment
      ? `Timed in at ${state.fieldOrder.timeInStamp}. Ready to Time Out this order.`
      : `Timed in at ${state.fieldOrder.timeInStamp}. Add a tech comment, then Time Out.`;
  }
  if (!state.fieldOrder.pendingCloseout) {
    return `Timed in at ${state.fieldOrder.timeInStamp}. Service still in progress. You can Time Out now or finish service first.`;
  }
  return `Order closed at ${state.fieldOrder.timeOutStamp}.`;
}

function updateFieldManagementUi() {
  if (!fieldMgmtPanel || !fieldCustomerSelect || !fieldTimeInButton || !fieldTimeOutButton || !fieldTechComment || !fieldSaveCommentButton || !fieldOrderStatus || !fieldOrderDetails) {
    return;
  }

  const phoneOpsAllowed = canOperatePhoneApps();
  const currentOrder = getCurrentOrder();
  const previousSelection = String(state.fieldOrder.selectedCustomerId || "");

  if (fieldCustomerSelect.options.length !== CUSTOMER_ORDERS.length + 1) {
    fieldCustomerSelect.innerHTML = "";
    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = "Select customer...";
    fieldCustomerSelect.appendChild(placeholder);
    CUSTOMER_ORDERS.forEach((order, index) => {
      const option = document.createElement("option");
      option.value = order.id;
      const stopPrefix = index === state.stopNumber - 1 ? "[Assigned] " : "";
      option.textContent = `${stopPrefix}${order.customer}`;
      fieldCustomerSelect.appendChild(option);
    });
  } else {
    for (let i = 1; i < fieldCustomerSelect.options.length; i += 1) {
      const option = fieldCustomerSelect.options[i];
      const order = CUSTOMER_ORDERS[i - 1];
      if (!order) {
        continue;
      }
      const stopPrefix = (i - 1) === state.stopNumber - 1 ? "[Assigned] " : "";
      option.textContent = `${stopPrefix}${order.customer}`;
    }
  }

  if (previousSelection && CUSTOMER_ORDERS.some((order) => order.id === previousSelection)) {
    fieldCustomerSelect.value = previousSelection;
  } else {
    fieldCustomerSelect.value = "";
  }

  if (fieldTechComment.value !== state.fieldOrder.techComment) {
    fieldTechComment.value = state.fieldOrder.techComment;
  }
  const selectedOrder = getOrderById(fieldCustomerSelect.value);
  if (selectedOrder) {
    fieldOrderDetails.textContent = `Plan: ${selectedOrder.plan} | Address: ${selectedOrder.address}`;
  } else {
    fieldOrderDetails.textContent = "Select a customer to view plan and address.";
  }

  const isAssignedSelected = Boolean(currentOrder) && state.fieldOrder.selectedCustomerId === currentOrder.id;
  fieldCustomerSelect.disabled = !phoneOpsAllowed || state.dayComplete || state.fieldOrder.timedIn;
  fieldTimeInButton.disabled = !phoneOpsAllowed || state.dayComplete || state.fieldOrder.timedIn || !isAssignedSelected;
  const commentDisabled = !phoneOpsAllowed || state.dayComplete || !state.fieldOrder.timedIn || state.fieldOrder.timedOut;
  fieldTechComment.disabled = commentDisabled;
  fieldSaveCommentButton.disabled = commentDisabled;
  if (commentDisabled) {
    state.techCommentEditing = false;
  }
  fieldTechComment.readOnly = !commentDisabled && !state.techCommentEditing;
  const hasComment = String(state.fieldOrder.techComment || "").trim().length >= 8;
  fieldTimeOutButton.disabled = !phoneOpsAllowed
    || state.dayComplete
    || !state.fieldOrder.timedIn
    || state.fieldOrder.timedOut
    || !hasComment;

  fieldOrderStatus.textContent = getFieldOrderStatusText();
}

function resetFieldOrderForStop() {
  state.techCommentEditing = false;
  state.fieldOrder.selectedCustomerId = "";
  state.fieldOrder.timedIn = false;
  state.fieldOrder.timeInStamp = "";
  state.fieldOrder.timedOut = false;
  state.fieldOrder.timeOutStamp = "";
  state.fieldOrder.techComment = "";
  state.fieldOrder.pendingCloseout = null;
  updateFieldManagementUi();
}

function requestStopPhoneCloseout({ wasRescheduled = false, completionNote = "" } = {}) {
  if (state.fieldOrder.pendingCloseout) {
    return;
  }
  state.fieldOrder.pendingCloseout = { wasRescheduled, completionNote };
  const message = state.fieldOrder.timedIn
    ? "Order ready to close. Add a tech comment and tap Time Out in Field Management."
    : "Order ready to close. In Field Management, select assigned customer, Time In, then add comment and Time Out.";
  setSprayerFeedback(message, 2);
  updateFieldManagementUi();
}

function tryTimeInFieldOrder() {
  if (!ensurePhoneOpsAllowed("Put the vehicle in park before timing in.")) {
    updateFieldManagementUi();
    return;
  }
  const currentOrder = getCurrentOrder();
  if (!currentOrder) {
    return;
  }
  if (state.dayComplete) {
    return;
  }
  if (state.fieldOrder.timedIn) {
    setSprayerFeedback(`Already timed in at ${state.fieldOrder.timeInStamp}.`, 1.1);
    return;
  }
  if (state.fieldOrder.selectedCustomerId !== currentOrder.id) {
    setSprayerFeedback(`Select assigned customer: ${currentOrder.customer}.`, 1.25);
    updateFieldManagementUi();
    return;
  }

  state.fieldOrder.timedIn = true;
  state.fieldOrder.timeInStamp = getShiftClockText();
  setSprayerFeedback(`Timed in to ${currentOrder.customer} at ${state.fieldOrder.timeInStamp}.`, 1.2);
  updateFieldManagementUi();
}

function tryTimeOutFieldOrder() {
  if (!ensurePhoneOpsAllowed("Put the vehicle in park before timing out.")) {
    updateFieldManagementUi();
    return;
  }
  const currentOrder = getCurrentOrder();
  if (!currentOrder || state.dayComplete) {
    return;
  }
  if (!state.fieldOrder.timedIn) {
    setSprayerFeedback("Time In first before closing the order.", 1.2);
    return;
  }

  const comment = String(state.fieldOrder.techComment || "").trim();
  if (comment.length < 8) {
    setSprayerFeedback("Add a tech comment (at least 8 characters) before Time Out.", 1.2);
    return;
  }

  state.fieldOrder.timedOut = true;
  state.fieldOrder.timeOutStamp = getShiftClockText();
  const closeout = state.fieldOrder.pendingCloseout;
  const completedService = Boolean(closeout) || state.serviceComplete;
  const wasRescheduled = Boolean(closeout && closeout.wasRescheduled);
  const shortComment = comment.length > 120 ? `${comment.slice(0, 117)}...` : comment;
  const completionNote = closeout && closeout.completionNote
    ? `${closeout.completionNote} Tech comment: ${shortComment}`
    : completedService
      ? `Tech comment: ${shortComment}`
      : `Timed out before full property spray completion. Tech comment: ${shortComment}`;

  state.fieldOrderLog.push({
    stop: state.stopNumber,
    orderId: currentOrder.id,
    customer: currentOrder.customer,
    address: currentOrder.address,
    timedInAt: state.fieldOrder.timeInStamp,
    timedOutAt: state.fieldOrder.timeOutStamp,
    comment: shortComment,
    wasRescheduled,
    completedService
  });

  updateFieldManagementUi();
  setSprayerFeedback(`Timed out at ${state.fieldOrder.timeOutStamp}. Order submitted.`, 1.3);
  completeStopAndAdvance({
    wasRescheduled,
    wasCompleted: completedService,
    completionNote
  });
}

function saveTechComment() {
  if (!ensurePhoneOpsAllowed("Put the vehicle in park before saving tech comment.")) {
    updateFieldManagementUi();
    return;
  }
  if (!fieldTechComment) {
    return;
  }
  if (!state.fieldOrder.timedIn) {
    setSprayerFeedback("Time In first, then save your tech comment.", 1.1);
    return;
  }
  if (state.fieldOrder.timedOut) {
    setSprayerFeedback("Order is already timed out. Tech comment is locked.", 1.1);
    return;
  }

  const comment = String(fieldTechComment.value || "").trim();
  if (!comment) {
    setSprayerFeedback("Add a comment before saving.", 1.05);
    return;
  }

  state.fieldOrder.techComment = comment;
  fieldTechComment.value = comment;
  state.techCommentEditing = false;
  fieldTechComment.readOnly = true;
  fieldTechComment.blur();
  updateFieldManagementUi();
  setSprayerFeedback("Tech comment saved.", 1.05);
}

function pointInRect(x, y, rect) {
  return x >= rect.x && x <= rect.x + rect.w && y >= rect.y && y <= rect.y + rect.h;
}

function getNearestPointOnRect(x, y, rect) {
  return {
    x: clamp(x, rect.x, rect.x + rect.w),
    y: clamp(y, rect.y, rect.y + rect.h)
  };
}

function getHouseDeckLayout(house) {
  if (!house || !DECK_HOUSE_IDS.has(house.id)) {
    return null;
  }

  const deckW = Math.round(house.w * 0.62);
  const deckH = 18;
  const deckX = Math.round(house.x + (house.w - deckW) / 2);
  const deckY = house.y - deckH - 2;
  const stairsW = Math.max(14, Math.round(deckW * 0.2));
  const stairsH = 20;
  const stairsX = deckX + deckW - stairsW - 5;
  const stairsY = deckY - stairsH;

  const anchorX = stairsX + stairsW / 2;
  const safeMargin = 16;
  return {
    deckRect: { x: deckX, y: deckY, w: deckW, h: deckH },
    stairsRect: { x: stairsX, y: stairsY, w: stairsW, h: stairsH },
    upperPoint: {
      x: clamp(anchorX, safeMargin, world.width - safeMargin),
      y: clamp(deckY + deckH - safeMargin, safeMargin, world.height - safeMargin)
    },
    lowerPoint: {
      x: clamp(anchorX, safeMargin, world.width - safeMargin),
      y: clamp(stairsY - safeMargin, safeMargin, world.height - safeMargin)
    }
  };
}

function getDeckStairInteraction(expand = 0) {
  let best = null;
  let bestDistance = Infinity;

  houses.forEach((house, index) => {
    const layout = getHouseDeckLayout(house);
    if (!layout) {
      return;
    }
    const triggerRect = {
      x: layout.stairsRect.x - expand,
      y: layout.stairsRect.y - expand,
      w: layout.stairsRect.w + expand * 2,
      h: layout.stairsRect.h + expand * 2
    };
    if (!pointInRect(player.x, player.y, triggerRect)) {
      return;
    }

    const centerX = layout.stairsRect.x + layout.stairsRect.w / 2;
    const centerY = layout.stairsRect.y + layout.stairsRect.h / 2;
    const dist = distance(player, { x: centerX, y: centerY });
    if (dist < bestDistance) {
      bestDistance = dist;
      best = { house, index, layout, centerY };
    }
  });

  return best;
}

function tryTraverseDeckStairs({ manual = false } = {}) {
  if (state.inTruck || state.mapOpen || state.deckStairCooldown > 0) {
    return false;
  }

  const interaction = getDeckStairInteraction(manual ? 9 : 0);
  if (!interaction) {
    return false;
  }

  const ascending = player.y <= interaction.centerY;
  const destination = ascending ? interaction.layout.upperPoint : interaction.layout.lowerPoint;
  if (collidesHouseCircle(destination.x, destination.y, player.radius + 2)) {
    return false;
  }

  player.x = clamp(destination.x, player.radius, world.width - player.radius);
  player.y = clamp(destination.y, player.radius, world.height - player.radius);
  state.deckStairCooldown = DECK_STAIR_COOLDOWN_SECONDS;

  if (ascending) {
    setSprayerFeedback(
      `Deck stairs: up to the back deck at house ${getHouseNumber(interaction.house, interaction.index)}.`,
      1
    );
  } else {
    setSprayerFeedback("Deck stairs: down to yard level.", 0.95);
  }

  return true;
}

function getServiceCoveragePercent() {
  const total = HOUSE_SIDES.reduce((sum, side) => sum + (state.serviceCoverage[side] || 0), 0);
  return Math.round(total / HOUSE_SIDES.length);
}

function isPremierBarrierService() {
  return String(state.serviceType || "").includes("Premier");
}

function isRainServicePhase(phaseValue = state.phase) {
  return phaseValue === "webster_pickup" || phaseValue === "webster_working" || phaseValue === "working";
}

function isRainDrivingPhase(phaseValue = state.phase) {
  return phaseValue === "drive_to_stop";
}

function buildRandomNoSprayZones() {
  if (!targetHouse) {
    return [];
  }

  const zones = [];
  const zoneCount = 1 + Math.floor(Math.random() * 2);
  const sideOptions = ["north", "south", "west", "east"];
  const doorCenterX = targetDoorZone.x + targetDoorZone.w / 2;
  const doorCenterY = targetDoorZone.y + targetDoorZone.h / 2;
  let attempts = 0;

  while (zones.length < zoneCount && attempts < 44) {
    attempts += 1;
    const roll = Math.random();
    const type = roll < 0.46 ? "flowers" : roll < 0.8 ? "vegetables" : "toys";
    const toyGroup = type === "toys"
      ? (Math.random() < 0.5 ? "kids" : "dog")
      : "";
    const toyType = type === "toys"
      ? (toyGroup === "dog"
        ? (Math.random() < 0.5 ? "bone" : "frisbee")
        : (Math.random() < 0.5 ? "ball" : "truck"))
      : "";
    const radius = type === "flowers"
      ? randomBetween(12, 16)
      : type === "vegetables"
        ? randomBetween(15, 20)
        : randomBetween(13, 17);
    const side = sideOptions[Math.floor(Math.random() * sideOptions.length)];
    let x = targetHouse.x;
    let y = targetHouse.y;

    if (side === "north") {
      x = randomBetween(targetHouse.x + 16, targetHouse.x + targetHouse.w - 16);
      y = targetHouse.y - randomBetween(22, 42);
    } else if (side === "south") {
      x = randomBetween(targetHouse.x + 16, targetHouse.x + targetHouse.w - 16);
      if (Math.abs(x - doorCenterX) < 42) {
        x += x < doorCenterX ? -44 : 44;
      }
      x = clamp(x, targetHouse.x + 12, targetHouse.x + targetHouse.w - 12);
      y = targetHouse.y + targetHouse.h + randomBetween(22, 46);
    } else if (side === "west") {
      x = targetHouse.x - randomBetween(22, 42);
      y = randomBetween(targetHouse.y + 10, targetHouse.y + targetHouse.h - 10);
    } else {
      x = targetHouse.x + targetHouse.w + randomBetween(22, 42);
      y = randomBetween(targetHouse.y + 10, targetHouse.y + targetHouse.h - 10);
    }

    const doorDistance = distance({ x, y }, { x: doorCenterX, y: doorCenterY });
    if (doorDistance < 38) {
      continue;
    }

    const overlaps = zones.some((zone) => distance({ x, y }, zone) < (zone.radius + radius + 9));
    if (overlaps) {
      continue;
    }

    zones.push({
      x,
      y,
      radius,
      side,
      type,
      moved: false,
      produceType: type === "vegetables"
        ? (Math.random() < 0.56 ? "tomatoes" : "cucumbers")
        : "",
      toyGroup,
      toyType
    });
  }

  return zones;
}

function getNearbyNoSprayZone(playerX, playerY) {
  return state.noSprayZones.find((zone) => !zone.moved && distance({ x: playerX, y: playerY }, zone) <= zone.radius + 44) || null;
}

function getNoSprayZoneLabel(type, produceType = "", toyGroup = "") {
  if (type === "flowers") {
    return "flowering planters";
  }
  if (type === "toys") {
    return toyGroup === "dog" ? "dog toys" : "children's toys";
  }
  if (produceType === "cucumbers") {
    return "cucumber beds";
  }
  if (produceType === "tomatoes") {
    return "tomato beds";
  }
  return "vegetable beds";
}

function resetPerimeterBucket(bucket) {
  bucket.top = 0;
  bucket.right = 0;
  bucket.bottom = 0;
  bucket.left = 0;
}

function getPerimeterBucketPercent(bucket) {
  return Math.round((bucket.top + bucket.right + bucket.bottom + bucket.left) / 4);
}

function getSideOpeningPerimeter(side) {
  if (!side) {
    return null;
  }
  return state.openingPerimeterBySide[side] || null;
}

function syncOpeningCoverageFromPerimeter() {
  const windowValues = [];
  const doorValues = [];
  HOUSE_SIDES.forEach((side) => {
    const sidePerimeter = getSideOpeningPerimeter(side);
    if (!sidePerimeter) {
      return;
    }
    windowValues.push(getPerimeterBucketPercent(sidePerimeter.windowLeft));
    windowValues.push(getPerimeterBucketPercent(sidePerimeter.windowRight));
    if (isDoorRequiredForSide(side)) {
      doorValues.push(getPerimeterBucketPercent(sidePerimeter.door));
    }
  });

  const windowAvg = windowValues.length
    ? Math.round(windowValues.reduce((sum, value) => sum + value, 0) / windowValues.length)
    : 0;
  const doorAvg = doorValues.length
    ? Math.round(doorValues.reduce((sum, value) => sum + value, 0) / doorValues.length)
    : 100;

  state.openingCoverage.window = windowAvg;
  state.openingCoverage.door = doorAvg;
}

function getSideOpeningCoverage(side) {
  const sidePerimeter = getSideOpeningPerimeter(side);
  if (!sidePerimeter) {
    return {
      windowLeft: 0,
      windowRight: 0,
      door: 0
    };
  }
  return {
    windowLeft: getPerimeterBucketPercent(sidePerimeter.windowLeft),
    windowRight: getPerimeterBucketPercent(sidePerimeter.windowRight),
    door: isDoorRequiredForSide(side) ? getPerimeterBucketPercent(sidePerimeter.door) : 100
  };
}

function areSideOpeningsComplete(side, requiredPercent) {
  const sideCoverage = getSideOpeningCoverage(side);
  const windowsDone = sideCoverage.windowLeft >= requiredPercent && sideCoverage.windowRight >= requiredPercent;
  const doorDone = !isDoorRequiredForSide(side) || sideCoverage.door >= requiredPercent;
  return windowsDone && doorDone;
}

function markSideCompleteWhenBoxesCleared(side) {
  if (!side || !SIDE_LABELS[side]) {
    return;
  }
  const openingRequired = getRequiredOpeningCoveragePercent();
  if (!areSideOpeningsComplete(side, openingRequired)) {
    return;
  }
  const required = getRequiredCoveragePercent();
  state.serviceCoverage[side] = Math.max(state.serviceCoverage[side] || 0, required);
}

function getCurrentSprayBrushRadius() {
  return clamp(10 + (1 - state.sprayerConcentration) * 18, 9, 28);
}

function insetRect(rect, insetX, insetY) {
  const safeRect = rect && typeof rect === "object" ? rect : { x: 0, y: 0, w: 0, h: 0 };
  const maxInsetX = Math.max(0, (safeRect.w - 6) / 2);
  const maxInsetY = Math.max(0, (safeRect.h - 6) / 2);
  const ix = clamp(insetX, 0, maxInsetX);
  const iy = clamp(insetY, 0, maxInsetY);
  return {
    x: safeRect.x + ix,
    y: safeRect.y + iy,
    w: Math.max(6, safeRect.w - ix * 2),
    h: Math.max(6, safeRect.h - iy * 2)
  };
}

function getFirstPersonViewLayout(sideValue = state.firstPerson.side || "north") {
  const side = SIDE_LABELS[sideValue] ? sideValue : "north";
  const wallX = view.width * 0.1;
  const wallY = view.height * 0.2;
  const wallW = view.width * 0.8;
  const wallH = view.height * 0.62;
  const eaveH = Math.max(18, wallH * 0.09);
  const foundationH = Math.max(22, wallH * 0.11);

  const windowRects = [];
  let doorRect = null;
  if (side === "north") {
    windowRects.push(
      { x: wallX + wallW * 0.2, y: wallY + wallH * 0.25, w: wallW * 0.15, h: wallH * 0.24 },
      { x: wallX + wallW * 0.64, y: wallY + wallH * 0.25, w: wallW * 0.15, h: wallH * 0.24 }
    );
  } else if (side === "south") {
    windowRects.push(
      { x: wallX + wallW * 0.12, y: wallY + wallH * 0.25, w: wallW * 0.15, h: wallH * 0.22 },
      { x: wallX + wallW * 0.72, y: wallY + wallH * 0.25, w: wallW * 0.15, h: wallH * 0.22 }
    );
    doorRect = { x: wallX + wallW * 0.45, y: wallY + wallH * 0.49, w: wallW * 0.1, h: wallH * 0.39 };
  } else {
    windowRects.push(
      { x: wallX + wallW * 0.28, y: wallY + wallH * 0.24, w: wallW * 0.18, h: wallH * 0.22 },
      { x: wallX + wallW * 0.56, y: wallY + wallH * 0.24, w: wallW * 0.18, h: wallH * 0.22 }
    );
  }

  const windowTargetRects = windowRects.map((rect) => ({
    x: rect.x - WINDOW_TARGET_MARGIN,
    y: rect.y - WINDOW_TARGET_MARGIN,
    w: rect.w + WINDOW_TARGET_MARGIN * 2,
    h: rect.h + WINDOW_TARGET_MARGIN * 2
  }));
  const windowPenaltyRects = windowRects.map((rect) => insetRect(rect, WINDOW_DIRECT_HIT_INSET, WINDOW_DIRECT_HIT_INSET));
  const doorTargetRect = doorRect
    ? {
      x: doorRect.x - DOOR_TARGET_MARGIN,
      y: doorRect.y - DOOR_TARGET_MARGIN,
      w: doorRect.w + DOOR_TARGET_MARGIN * 2,
      h: doorRect.h + DOOR_TARGET_MARGIN * 2
    }
    : null;
  const doorPenaltyRect = doorRect ? insetRect(doorRect, DOOR_DIRECT_HIT_INSET, DOOR_DIRECT_HIT_INSET) : null;

  const sideZones = state.noSprayZones
    .filter((zone) => zone.side === side && !zone.moved)
    .map((zone) => {
      const ratio = side === "north" || side === "south"
        ? clamp((zone.x - targetHouse.x) / targetHouse.w, 0.05, 0.95)
        : clamp((zone.y - targetHouse.y) / targetHouse.h, 0.05, 0.95);
      const zoneX = wallX + wallW * ratio;
      const zoneBaseY = wallY + wallH + 8;
      const size = clamp(zone.radius, 10, 20);
      return {
        zone,
        size,
        center: { x: zoneX, y: zoneBaseY - size * 0.35 },
        hitRadius: size * 0.56
      };
    });

  return {
    side,
    wallX,
    wallY,
    wallW,
    wallH,
    eaveH,
    foundationH,
    windowRects,
    doorRect,
    windowTargetRects,
    doorTargetRect,
    windowPenaltyRects,
    doorPenaltyRect,
    sideZones
  };
}

function getFirstPersonSprayPoint(layout) {
  const pointerX = Number.isFinite(state.pointer.x) ? state.pointer.x : (view.width / 2);
  const pointerY = Number.isFinite(state.pointer.y) ? state.pointer.y : (view.height / 2);
  return {
    x: clamp(pointerX, layout.wallX + 4, layout.wallX + layout.wallW - 4),
    y: clamp(pointerY, layout.wallY + 4, layout.wallY + layout.wallH - 4)
  };
}

function addFirstPersonSprayTrailStamp(side, layout, sprayPoint, sprayRadius, concentration) {
  if (!side || !layout || !sprayPoint) {
    return;
  }
  const bucket = state.sprayTrailBySide && Array.isArray(state.sprayTrailBySide[side])
    ? state.sprayTrailBySide[side]
    : null;
  if (!bucket) {
    return;
  }

  const x = clamp(sprayPoint.x, layout.wallX + 2, layout.wallX + layout.wallW - 2);
  const y = clamp(sprayPoint.y, layout.wallY + 2, layout.wallY + layout.wallH - 2);
  const radius = clamp(sprayRadius * (0.32 + (1 - concentration) * 0.22), 3.4, 10.8);
  const alpha = clamp(0.08 + (1 - concentration) * 0.08, 0.06, 0.18);
  const stamp = { x, y, radius, alpha };
  const previous = bucket.length > 0 ? bucket[bucket.length - 1] : null;
  if (previous) {
    const gap = distance(previous, stamp);
    if (gap > radius * 1.7) {
      bucket.push({
        x: (previous.x + x) / 2,
        y: (previous.y + y) / 2,
        radius: (previous.radius + radius) / 2,
        alpha: (previous.alpha + alpha) / 2
      });
    }
  }
  bucket.push(stamp);

  if (bucket.length > MAX_SPRAY_TRAIL_MARKS_PER_SIDE) {
    bucket.splice(0, bucket.length - MAX_SPRAY_TRAIL_MARKS_PER_SIDE);
  }
}

function drawFirstPersonSprayTrail(layout, side) {
  if (!layout || !side) {
    return;
  }
  const bucket = state.sprayTrailBySide && Array.isArray(state.sprayTrailBySide[side])
    ? state.sprayTrailBySide[side]
    : null;
  if (!bucket || bucket.length < 1) {
    return;
  }

  ctx.save();
  bucket.forEach((mark) => {
    const radius = clamp(Number(mark.radius) || 0, 2.2, 12);
    const alpha = clamp(Number(mark.alpha) || 0, 0.04, 0.2);
    ctx.fillStyle = `rgba(154, 205, 236, ${alpha.toFixed(3)})`;
    ctx.beginPath();
    ctx.arc(mark.x, mark.y, radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = `rgba(189, 226, 248, ${(alpha * 0.52).toFixed(3)})`;
    ctx.beginPath();
    ctx.arc(mark.x, mark.y, radius * 0.45, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.restore();
}

function getWebSideRatio(web, side) {
  if (!targetHouse) {
    return 0.5;
  }
  if (side === "north" || side === "south") {
    return clamp((web.x - targetHouse.x) / targetHouse.w, 0.06, 0.94);
  }
  return clamp((web.y - targetHouse.y) / targetHouse.h, 0.06, 0.94);
}

function getWebSideDepth(web, side) {
  if (!targetHouse) {
    return 0;
  }
  if (side === "north") {
    return Math.abs(web.y - targetHouse.y);
  }
  if (side === "south") {
    return Math.abs((targetHouse.y + targetHouse.h) - web.y);
  }
  if (side === "west") {
    return Math.abs(web.x - targetHouse.x);
  }
  return Math.abs((targetHouse.x + targetHouse.w) - web.x);
}

function getStableNoise01(seedText) {
  const source = String(seedText || "seed");
  let hash = 0;
  for (let index = 0; index < source.length; index += 1) {
    hash = (hash * 31 + source.charCodeAt(index)) % 104729;
  }
  return ((Math.sin(hash) + 1) / 2);
}

function getFirstPersonWebTargets(layout) {
  if (!layout || !targetHouse) {
    return [];
  }
  const side = layout.side;
  const top = layout.wallY + layout.eaveH + 12;
  const bottom = layout.wallY + layout.wallH - layout.foundationH - 20;
  return state.webTargets
    .filter((web) => !web.cleared && web.side === side)
    .map((web) => {
      const ratio = getWebSideRatio(web, side);
      const depthNorm = clamp(getWebSideDepth(web, side) / 22, 0, 1);
      const sideNoise = getStableNoise01(web.id);
      const xJitter = (sideNoise - 0.5) * 20;
      const yBase = lerp(top, bottom, 0.08 + depthNorm * 0.54);
      const y = clamp(yBase + (sideNoise - 0.5) * 14, top, bottom);
      return {
        web,
        x: clamp(layout.wallX + layout.wallW * ratio + xJitter, layout.wallX + 20, layout.wallX + layout.wallW - 20),
        y,
        radius: clamp(web.radius * 1.2, 10, 18)
      };
    });
}

function startWebsterStrike(x, y, side, hit) {
  state.websterStrike.active = true;
  state.websterStrike.side = side || "";
  state.websterStrike.x = x;
  state.websterStrike.y = y;
  state.websterStrike.hit = Boolean(hit);
  state.websterStrike.duration = WEBSTER_STRIKE_DURATION;
  state.websterStrike.timer = WEBSTER_STRIKE_DURATION;
}

function tryKnockDownWebAtPointer() {
  if (state.phase !== "webster_working" || !state.firstPerson.active || state.mapOpen) {
    return false;
  }
  const side = state.firstPerson.side;
  if (!side) {
    return false;
  }
  const layout = getFirstPersonViewLayout(side);
  const pointer = getFirstPersonSprayPoint(layout);
  const candidates = getFirstPersonWebTargets(layout);
  if (!candidates.length) {
    startWebsterStrike(pointer.x, pointer.y, side, false);
    if (state.sprayerFeedbackTimer <= 0) {
      setSprayerFeedback("This side is clear. Move to another side for remaining webs.", 0.9);
    }
    return false;
  }

  let bestHit = null;
  let bestDistance = Infinity;
  candidates.forEach((item) => {
    const dist = distance(pointer, item);
    const threshold = item.radius + 10;
    if (dist <= threshold && dist < bestDistance) {
      bestHit = item;
      bestDistance = dist;
    }
  });

  if (!bestHit) {
    startWebsterStrike(pointer.x, pointer.y, side, false);
    setSprayerFeedback("Missed web. Click directly on webbing to knock it down.", 0.85);
    return false;
  }

  bestHit.web.cleared = true;
  startWebsterStrike(bestHit.x, bestHit.y, side, true);
  const remaining = getRemainingWebCount();
  setSprayerFeedback(
    remaining > 0
      ? `${SIDE_LABELS[side]} web knocked down. ${remaining} web${remaining === 1 ? "" : "s"} left.`
      : "Last web removed. Exterior spray phase unlocked.",
    0.95
  );
  return true;
}

function paintPerimeterBucket(bucket, rect, sprayPoint, sprayRadius, dt, efficiency) {
  if (!rect) {
    return;
  }

  const threshold = sprayRadius + 8;
  const gain = dt * 50 * efficiency;
  const insideX = sprayPoint.x >= rect.x - threshold && sprayPoint.x <= rect.x + rect.w + threshold;
  const insideY = sprayPoint.y >= rect.y - threshold && sprayPoint.y <= rect.y + rect.h + threshold;

  if (insideX && Math.abs(sprayPoint.y - rect.y) <= threshold) {
    bucket.top = clamp(bucket.top + gain, 0, 100);
  }
  if (insideY && Math.abs(sprayPoint.x - (rect.x + rect.w)) <= threshold) {
    bucket.right = clamp(bucket.right + gain, 0, 100);
  }
  if (insideX && Math.abs(sprayPoint.y - (rect.y + rect.h)) <= threshold) {
    bucket.bottom = clamp(bucket.bottom + gain, 0, 100);
  }
  if (insideY && Math.abs(sprayPoint.x - rect.x) <= threshold) {
    bucket.left = clamp(bucket.left + gain, 0, 100);
  }
}

function getPremierFeatureSpans() {
  if (!targetHouse) {
    return {
      windowRanges: [],
      doorRange: { start: 0, end: 0 }
    };
  }
  return {
    windowRanges: [
      { start: targetHouse.x + 20, end: targetHouse.x + 48 },
      { start: targetHouse.x + targetHouse.w - 48, end: targetHouse.x + targetHouse.w - 20 }
    ],
    doorRange: {
      start: targetHouse.x + targetHouse.w / 2 - 11,
      end: targetHouse.x + targetHouse.w / 2 + 11
    }
  };
}

function isValueInRange(value, start, end) {
  return value >= Math.min(start, end) && value <= Math.max(start, end);
}

function isValueInRangeWithPadding(value, start, end, padding) {
  return value >= Math.min(start, end) - padding && value <= Math.max(start, end) + padding;
}

function evaluatePremierBarrierContact(side, contactCoord) {
  const spans = getPremierFeatureSpans();
  const windowPadding = 11;
  const doorPadding = 13;
  const nearEdgeThreshold = 24;
  const minCoord = targetHouse ? targetHouse.x : 0;
  const maxCoord = targetHouse ? targetHouse.x + targetHouse.w : 0;

  let multiplier = 0.68;
  let penaltyType = "";
  let targetType = "eaves";

  if (side === "north") {
    const onWindow = spans.windowRanges.some((range) => isValueInRange(contactCoord, range.start, range.end));
    const aroundWindow = spans.windowRanges.some((range) => {
      return isValueInRangeWithPadding(contactCoord, range.start, range.end, windowPadding)
        && !isValueInRange(contactCoord, range.start, range.end);
    });
    if (onWindow) {
      penaltyType = "window";
      multiplier = 0.14;
      targetType = "window";
    } else if (aroundWindow) {
      multiplier = 1.12;
      targetType = "around-window";
    }
  } else if (side === "south") {
    const onDoor = isValueInRange(contactCoord, spans.doorRange.start, spans.doorRange.end);
    const aroundDoor = isValueInRangeWithPadding(contactCoord, spans.doorRange.start, spans.doorRange.end, doorPadding)
      && !onDoor;
    if (onDoor) {
      penaltyType = "door";
      multiplier = 0.12;
      targetType = "door";
    } else if (aroundDoor) {
      multiplier = 1.14;
      targetType = "around-door";
    }
  }

  if (
    isValueInRange(contactCoord, minCoord, minCoord + nearEdgeThreshold)
    || isValueInRange(contactCoord, maxCoord - nearEdgeThreshold, maxCoord)
  ) {
    multiplier += 0.12;
  }

  return {
    multiplier: clamp(multiplier, 0.1, 1.24),
    penaltyType,
    targetType
  };
}

function getTruckRearPoint() {
  return getTruckWebsterPoint();
}

function truckLocalToWorld(localX, localY) {
  const cos = Math.cos(truck.angle);
  const sin = Math.sin(truck.angle);
  return {
    x: truck.x + (localX * cos - localY * sin),
    y: truck.y + (localX * sin + localY * cos)
  };
}

function getTruckDriverDoorPoint() {
  return truckLocalToWorld(24, -24);
}

function getTruckRightDoorPoint() {
  return truckLocalToWorld(-8, 27);
}

function getTruckRearDoorPoint() {
  return truckLocalToWorld(-50, 0);
}

function getTruckWebsterPoint() {
  return truckLocalToWorld(-56, 0);
}

function buildWebTargets() {
  if (!targetHouse) {
    return [];
  }

  const webs = [];
  const sideCounts = {
    north: 3 + Math.floor(Math.random() * 2),
    south: 3 + Math.floor(Math.random() * 2),
    west: 2 + Math.floor(Math.random() * 2),
    east: 2 + Math.floor(Math.random() * 2)
  };

  const addWeb = (side, x, y) => {
    webs.push({
      id: `web-${side}-${webs.length + 1}`,
      side,
      x,
      y,
      radius: randomBetween(9, 14),
      cleared: false
    });
  };

  for (let i = 0; i < sideCounts.north; i += 1) {
    addWeb(
      "north",
      randomBetween(targetHouse.x + 20, targetHouse.x + targetHouse.w - 20),
      targetHouse.y + randomBetween(4, 18)
    );
  }
  for (let i = 0; i < sideCounts.south; i += 1) {
    addWeb(
      "south",
      randomBetween(targetHouse.x + 20, targetHouse.x + targetHouse.w - 20),
      targetHouse.y + targetHouse.h - randomBetween(4, 18)
    );
  }
  for (let i = 0; i < sideCounts.west; i += 1) {
    addWeb(
      "west",
      targetHouse.x + randomBetween(4, 18),
      randomBetween(targetHouse.y + 18, targetHouse.y + targetHouse.h - 18)
    );
  }
  for (let i = 0; i < sideCounts.east; i += 1) {
    addWeb(
      "east",
      targetHouse.x + targetHouse.w - randomBetween(4, 18),
      randomBetween(targetHouse.y + 18, targetHouse.y + targetHouse.h - 18)
    );
  }

  return webs;
}

function getRemainingWebCount() {
  return state.webTargets.filter((web) => !web.cleared).length;
}

function getRequiredCoveragePercent() {
  return state.serviceType === "Premier Home Perimeter+" ? 90 : 82;
}

function getCoverageForSide(side) {
  return Math.round(state.serviceCoverage[side] || 0);
}

function getRequiredOpeningCoveragePercent() {
  return REQUIRED_OPENING_COVERAGE_PERCENT;
}

function getOpeningCoverage(type) {
  return Math.round(state.openingCoverage[type] || 0);
}

function getServiceCompletionNote() {
  if (isPremierBarrierService()) {
    return `All sides and opening trim complete. Score ${Math.round(state.serviceScore)}/100 (${state.windowDirectHits} window hits, ${state.doorDirectHits} door hits).`;
  }
  return "All side trim boxes cleared around windows/doors.";
}

function getSprayerConcentrationLabel() {
  if (state.sprayerConcentration < 0.3) {
    return "too wide";
  }
  if (state.sprayerConcentration > 0.82) {
    return "too concentrated";
  }
  return "balanced";
}

function getActiveTargetHouseSide(margin = 54) {
  if (!targetHouse) {
    return "";
  }
  const x = player.x;
  const y = player.y;
  if (
    x < targetHouse.x - margin
    || x > targetHouse.x + targetHouse.w + margin
    || y < targetHouse.y - margin
    || y > targetHouse.y + targetHouse.h + margin
  ) {
    return "";
  }

  const distances = [
    { side: "north", value: Math.abs(y - targetHouse.y) },
    { side: "south", value: Math.abs(y - (targetHouse.y + targetHouse.h)) },
    { side: "west", value: Math.abs(x - targetHouse.x) },
    { side: "east", value: Math.abs(x - (targetHouse.x + targetHouse.w)) }
  ];
  distances.sort((a, b) => a.value - b.value);
  const nearest = distances[0];
  return nearest && nearest.value <= margin ? nearest.side : "";
}

function canUseFirstPersonMode() {
  if (!targetHouse || state.inTruck || state.mapOpen) {
    return false;
  }
  return FIRST_PERSON_PHASES.has(state.phase);
}

function updateFirstPersonMode() {
  if (!canUseFirstPersonMode()) {
    state.firstPerson.active = false;
    state.firstPerson.side = "";
    return;
  }

  const enterSide = getActiveTargetHouseSide(56);
  const staySide = getActiveTargetHouseSide(82);

  if (state.firstPerson.active) {
    if (!staySide) {
      state.firstPerson.active = false;
      state.firstPerson.side = "";
      return;
    }
    state.firstPerson.side = staySide;
    return;
  }

  if (enterSide) {
    state.firstPerson.active = true;
    state.firstPerson.side = enterSide;
  }
}

function setSprayerFeedback(message, seconds = 1.15) {
  state.sprayerFeedback = message;
  state.sprayerFeedbackTimer = seconds;
}

function resetServiceWorkState() {
  HOUSE_SIDES.forEach((side) => {
    state.serviceCoverage[side] = 0;
  });
  HOUSE_SIDES.forEach((side) => {
    const sidePerimeter = getSideOpeningPerimeter(side);
    if (!sidePerimeter) {
      return;
    }
    resetPerimeterBucket(sidePerimeter.windowLeft);
    resetPerimeterBucket(sidePerimeter.windowRight);
    resetPerimeterBucket(sidePerimeter.door);
  });
  syncOpeningCoverageFromPerimeter();
  state.sprayTrailBySide = createSideSprayTrail();
  state.sprayTrailStampTimer = 0;
  state.activeHouseSide = "";
  state.sprayerConcentration = SPRAYER_IDEAL_CONCENTRATION;
  state.sprayActive = false;
  state.sprayBounceHits = 0;
  state.serviceComplete = false;
  state.sprayerNeedsRollup = false;
  state.hasPowerSprayer = false;
  state.serviceCompletionNote = "";
  state.hasWebster = false;
  state.webTargets = [];
  state.websterStrike.active = false;
  state.websterStrike.side = "";
  state.websterStrike.timer = 0;
  state.serviceScore = 100;
  state.penaltyCooldown = 0;
  state.windowDirectHits = 0;
  state.doorDirectHits = 0;
  state.sprayerFeedback = "";
  state.sprayerFeedbackTimer = 0;
  state.sprayViolationFlashTimer = 0;
  state.deckStairCooldown = 0;
}

function triggerDingAnimation(text, detail = "") {
  state.dingAnimationText = text;
  state.dingAnimationDetail = String(detail || "");
  state.dingAnimationTimer = 0.55;
}

function getDeductionFeedback(type, points) {
  const penaltyPoints = Math.max(1, Math.round(points || 0));
  if (type === "speeding") {
    return `Ding: speeding. Slow down to the posted limit. (-${penaltyPoints})`;
  }
  if (type === "window") {
    return `Ding: sprayed window glass directly. Stay on trim/perimeter only. (-${penaltyPoints})`;
  }
  if (type === "door") {
    return `Ding: sprayed door surface directly. Spray around the frame, not the door. (-${penaltyPoints})`;
  }
  if (type === "protected") {
    return `Ding: sprayed a protected area/item. Avoid flowers, edible gardens, and toys. (-${penaltyPoints})`;
  }
  if (type === "timein") {
    return `Ding: left the vehicle before timing in. Time In first in Field Management. (-${penaltyPoints})`;
  }
  return `Ding: point deduction recorded. (-${penaltyPoints})`;
}

function isSprayViolationType(type) {
  return type === "window" || type === "door" || type === "protected";
}

function registerDeduction(type, points, dingText) {
  const penaltyPoints = Math.max(0, Math.round(points || 0));
  if (penaltyPoints <= 0) {
    return;
  }

  const bucket = state.deductionTally[type];
  if (bucket) {
    bucket.count += 1;
    bucket.points += penaltyPoints;
  }
  state.currentStopPenaltyPoints += penaltyPoints;
  state.dayPointsEarned = Math.max(0, state.dayPointsEarned - penaltyPoints);
  if (isSprayViolationType(type)) {
    state.sprayViolationFlashTimer = 0.38;
  }
  const deductionFeedback = getDeductionFeedback(type, penaltyPoints);
  triggerDingAnimation(dingText || `Ding: -${penaltyPoints}`, deductionFeedback);
  setSprayerFeedback(deductionFeedback, 1.35);
}

function maybeDingMissedTimeInBeforeExit() {
  if (state.missedTimeInExitDinged || state.fieldOrder.timedIn || state.dayComplete) {
    return false;
  }
  state.missedTimeInExitDinged = true;
  registerDeduction("timein", 5, "MISSED TIME IN -5");
  setSprayerFeedback("Ding: Time In your order before leaving the vehicle at a stop.", 1.6);
  return true;
}

function getCurrentStopPercent() {
  return clamp(100 - state.currentStopPenaltyPoints, 0, 100);
}

function formatDingBreakdown() {
  const parts = Object.values(state.deductionTally)
    .filter((item) => item.count > 0 || item.points > 0)
    .map((item) => `${item.label}: ${item.count} incident(s), -${item.points} pts`);
  return parts.length > 0 ? parts : ["No deductions logged."];
}

function resetRainForNextStop() {
  state.rain.triggered = false;
  state.rain.active = false;
  state.rain.elapsed = 0;
  state.rain.willTrigger = state.rain.enabled && !state.rain.usedToday && Math.random() < RAIN_TRIGGER_CHANCE;
  state.rain.triggerAt = randomBetween(RAIN_TRIGGER_MIN_SECONDS, RAIN_TRIGGER_MAX_SECONDS);
  state.rain.context = "";
  state.rain.stage = "";
}

function stageNextStopDrive() {
  resetCustomerDialogState();
  state.phase = "walk_to_truck";
  state.inTruck = false;
  setCruiseEnabled(false);
  state.mapOpen = false;
  state.missionComplete = false;
  state.serviceComplete = false;
  state.currentWaypoint = 1;
  state.parkedHold = 0;
  state.parkLocked = false;
  state.missedTimeInExitDinged = false;
  state.vehicleDoors.driver = false;
  state.vehicleDoors.right = false;
  state.vehicleDoors.rear = false;
  state.speedPenaltyAccumulator = 0;
  state.currentStopPenaltyPoints = 0;
  state.noSprayZones = [];
  state.nearbyNoSprayZoneType = "";
  state.activeHouseSide = "";
  state.phoneEmailPending = false;
  state.sprayerNeedsRollup = false;
  state.hasPowerSprayer = false;
  state.serviceCompletionNote = "";
  state.hasWebster = false;
  state.webTargets = [];
  state.sprayActive = false;
  state.deckStairCooldown = 0;
  input.spray = false;
  truck.x = HOME_TRUCK_START.x;
  truck.y = HOME_TRUCK_START.y;
  truck.angle = HOME_TRUCK_START.angle;
  truck.speed = 0;
  player.x = HOME_PLAYER_START.x;
  player.y = HOME_PLAYER_START.y;
  resetTrainerFollowerPosition();
  resetRainForNextStop();
  resetFieldOrderForStop();
}

function finishDayAndShowSummary() {
  state.dayComplete = true;
  state.missionComplete = true;
  state.phase = "day_complete";
  state.inTruck = false;
  state.sprayActive = false;
  input.spray = false;
  setMissionBannerMinimized(false);
  const finalPercent = Math.round((state.dayPointsEarned / state.dayTotalPoints) * 100);
  const breakdown = formatDingBreakdown();

  if (missionCompleteTitle) {
    missionCompleteTitle.textContent = `5-Stop Day Complete: ${finalPercent}% Correct`;
  }
  if (missionCompleteMessage) {
    missionCompleteMessage.innerHTML = `${breakdown.join("<br>")}`;
  }
  if (missionCompleteCard) {
    missionCompleteCard.hidden = false;
  }
  state.completionBannerTimer = 0;
}

function completeStopAndAdvance({ wasRescheduled = false, wasCompleted = true, completionNote = "" } = {}) {
  const stopPercent = getCurrentStopPercent();
  const thisStop = state.stopNumber;
  const nextStop = thisStop + 1;

  if (thisStop >= TOTAL_STOPS_PER_DAY) {
    finishDayAndShowSummary();
    return;
  }

  if (missionCompleteTitle) {
    missionCompleteTitle.textContent = wasRescheduled
      ? `Stop ${thisStop} Rescheduled`
      : `Stop ${thisStop} Complete`;
  }
  if (missionCompleteMessage) {
    const baseLine = wasRescheduled
      ? `Rain reschedule logged. Stop score: ${stopPercent}%.`
      : wasCompleted
        ? `Service completed. Stop score: ${stopPercent}%.`
        : `Order timed out early. Stop score: ${stopPercent}%.`;
    missionCompleteMessage.textContent = `${baseLine} ${completionNote} Next assignment: Stop ${nextStop}/${TOTAL_STOPS_PER_DAY}.`;
  }
  if (missionCompleteCard) {
    missionCompleteCard.hidden = false;
  }
  state.completionBannerTimer = 3.8;
  state.stopNumber = nextStop;
  stageNextStopDrive();
}

function triggerRainEvent() {
  if (state.rain.triggered) {
    return;
  }

  state.rain.triggered = true;
  state.rain.active = true;
  state.rain.usedToday = true;
  state.rain.willTrigger = false;

  if (isRainDrivingPhase()) {
    state.rain.context = "driving";
    state.rain.stage = "drive_to_spot";
    setSprayerFeedback("Rain started. Park at the customer spot, then text your manager.", 1.6);
    return;
  }

  if (isRainServicePhase()) {
    state.rain.context = "service";
    state.rain.stage = "service_talk_customer";
    state.customerHome = true;
    input.spray = false;
    state.sprayActive = false;
    setSprayerFeedback("Rain started during service. Tell the customer and reschedule.", 1.6);
  }
}

function maybeTriggerRain(dt) {
  if (!state.rain.enabled || !state.rain.willTrigger) {
    return;
  }
  if (state.rain.triggered) {
    return;
  }
  if (!isRainDrivingPhase() && !isRainServicePhase()) {
    return;
  }
  state.rain.elapsed += dt;
  if (state.rain.elapsed >= state.rain.triggerAt) {
    triggerRainEvent();
  }
}

function completeRainReschedule() {
  state.rain.stage = "done";
  state.phase = "rain_rescheduled";
  state.inTruck = false;
  input.spray = false;
  state.sprayActive = false;
  requestStopPhoneCloseout({ wasRescheduled: true, completionNote: "Customer and manager both notified." });
  setSprayerFeedback("Reschedule logged. Finish order closeout in Field Management.", 1.6);
}

function handleRainAction() {
  if (!state.rain.active) {
    return false;
  }

  if (state.rain.context === "driving") {
    if (!state.inTruck) {
      return false;
    }
    if (state.rain.stage !== "drive_text_manager") {
      return true;
    }
    if (!state.inTruck || !isTruckParkedCorrectly()) {
      setSprayerFeedback("Park in front of the customer stop before texting your manager.", 1.2);
      return true;
    }
    setSprayerFeedback("Manager text sent: rain delay, service rescheduled.", 1.25);
    appendPhoneMessage("outgoing", "You", "To Manager: Rain delay at stop, service rescheduled.");
    void (async () => {
      const outgoingText = "rain delay rescheduled";
      const aiReply = await requestAiChatReply({
        channel: "phone",
        recipient: "manager",
        message: outgoingText,
        context: {
          stopNumber: state.stopNumber,
          serviceType: state.serviceType,
          rainActive: true
        }
      });
      appendPhoneMessage("incoming", "Manager", aiReply || getSimulatedReply("manager", outgoingText));
    })();
    completeRainReschedule();
    return true;
  }

  if (state.rain.context === "service") {
    if (state.rain.stage === "service_talk_customer") {
      if (!pointInRect(player.x, player.y, targetDoorZone)) {
        setSprayerFeedback("Go to the front door and notify the customer first.", 1.2);
        return true;
      }
      state.rain.stage = "service_text_manager";
      setSprayerFeedback("Customer notified. Press E to text your manager.", 1.3);
      return true;
    }
    if (state.rain.stage === "service_text_manager") {
      setSprayerFeedback("Manager text sent: rain delay, service rescheduled.", 1.25);
      appendPhoneMessage("outgoing", "You", "To Manager: Rain started on service, customer notified and stop rescheduled.");
      void (async () => {
        const outgoingText = "rain started service rescheduled";
        const aiReply = await requestAiChatReply({
          channel: "phone",
          recipient: "manager",
          message: outgoingText,
          context: {
            stopNumber: state.stopNumber,
            serviceType: state.serviceType,
            rainActive: true
          }
        });
        appendPhoneMessage("incoming", "Manager", aiReply || getSimulatedReply("manager", outgoingText));
      })();
      completeRainReschedule();
      return true;
    }
    return true;
  }

  return true;
}

function wrapAngle(angle) {
  let normalized = angle;
  while (normalized > Math.PI) {
    normalized -= Math.PI * 2;
  }
  while (normalized < -Math.PI) {
    normalized += Math.PI * 2;
  }
  return normalized;
}

function isPointOnRoad(x, y) {
  return roads.some((road) => x >= road.x && x <= road.x + road.w && y >= road.y && y <= road.y + road.h);
}

function getRoadAtPoint(x, y) {
  return roads.find((road) => x >= road.x && x <= road.x + road.w && y >= road.y && y <= road.y + road.h) || null;
}

function getSpeedLimitMphAtPoint(x, y) {
  const road = getRoadAtPoint(x, y);
  if (road && Number.isFinite(road.speedLimitMph)) {
    return road.speedLimitMph;
  }
  return 8;
}

function getDistanceToRoadRect(road, x, y) {
  const dx = Math.max(road.x - x, 0, x - (road.x + road.w));
  const dy = Math.max(road.y - y, 0, y - (road.y + road.h));
  return Math.hypot(dx, dy);
}

function getRoadLockAssistPoint(x, y, angle) {
  let bestRoad = null;
  let bestScore = Infinity;

  roads.forEach((road) => {
    const dist = getDistanceToRoadRect(road, x, y);
    const headingPenalty = road.axis === "h"
      ? Math.abs(Math.sin(angle)) * 36
      : Math.abs(Math.cos(angle)) * 36;
    const score = dist + headingPenalty;
    if (score < bestScore) {
      bestScore = score;
      bestRoad = road;
    }
  });

  if (!bestRoad) {
    return null;
  }
  const farFromRoad = getDistanceToRoadRect(bestRoad, x, y) > 210;
  if (farFromRoad) {
    return null;
  }

  if (bestRoad.axis === "h") {
    const travelingEast = Math.cos(angle) >= 0;
    const laneY = bestRoad.y + bestRoad.h * (travelingEast ? 0.72 : 0.28);
    return {
      x: clamp(x, bestRoad.x + 16, bestRoad.x + bestRoad.w - 16),
      y: laneY,
      angle: travelingEast ? 0 : Math.PI
    };
  }

  const travelingSouth = Math.sin(angle) >= 0;
  const laneX = bestRoad.x + bestRoad.w * (travelingSouth ? 0.32 : 0.68);
  return {
    x: laneX,
    y: clamp(y, bestRoad.y + 16, bestRoad.y + bestRoad.h - 16),
    angle: travelingSouth ? Math.PI / 2 : -Math.PI / 2
  };
}

function lerpAngle(current, target, t) {
  const delta = wrapAngle(target - current);
  return wrapAngle(current + delta * t);
}

function collidesHouseCircle(x, y, radius) {
  return houses.some((house) => {
    const nearestX = clamp(x, house.x, house.x + house.w);
    const nearestY = clamp(y, house.y, house.y + house.h);
    const dx = x - nearestX;
    const dy = y - nearestY;
    return (dx * dx + dy * dy) < radius * radius;
  });
}

function getMoveAxis() {
  const up = input.up || touchInput.up;
  const down = input.down || touchInput.down;
  const left = input.left || touchInput.left;
  const right = input.right || touchInput.right;

  return {
    x: (right ? 1 : 0) - (left ? 1 : 0),
    y: (down ? 1 : 0) - (up ? 1 : 0)
  };
}

function getServiceTrainerTips(serviceType) {
  return SERVICE_TRAINER_GUIDE[serviceType] || [
    "Follow label directions and keep treatment targeted to pest activity areas."
  ];
}

function setTrainerMode(enabled) {
  state.trainerMode = Boolean(enabled);
  if (state.trainerMode) {
    resetTrainerFollowerPosition();
  }
  if (trainerModeButton) {
    trainerModeButton.setAttribute("aria-pressed", state.trainerMode ? "true" : "false");
  }
  if (trainerModeState) {
    trainerModeState.textContent = state.trainerMode ? "On" : "Off";
  }
  if (trainerPanel) {
    trainerPanel.hidden = !state.trainerMode;
  }
}

function resetTrainerFollowerPosition() {
  if (state.inTruck) {
    const seatPoint = truckLocalToWorld(20, 9);
    state.trainerFollower.x = clamp(seatPoint.x, player.radius, world.width - player.radius);
    state.trainerFollower.y = clamp(seatPoint.y, player.radius, world.height - player.radius);
    return;
  }
  state.trainerFollower.x = clamp(player.x - 34, player.radius, world.width - player.radius);
  state.trainerFollower.y = clamp(player.y + 26, player.radius, world.height - player.radius);
}

function resetCustomerDialogState() {
  state.customerDialog.active = false;
  state.customerDialog.scriptedIndex = 0;
  state.customerDialog.scriptedLines = [];
  state.customerDialog.currentSpeaker = "";
  state.customerDialog.currentLine = "";
  state.customerDialog.playerMessagesSent = 0;
  state.customerDialog.aiReadyToComplete = false;
  state.customerDialog.aiPending = false;
  state.customerDialog.replySource = "";
  if (customerDialogInput) {
    customerDialogInput.value = "";
  }
}

function setCustomerAiMode(enabled) {
  state.customerAiMode = Boolean(enabled);
  if (customerModeButton) {
    customerModeButton.setAttribute("aria-pressed", state.customerAiMode ? "true" : "false");
  }
  if (customerModeState) {
    customerModeState.textContent = state.customerAiMode ? "AI Typing" : "Click Through";
  }
}

function buildScriptedConversationLines() {
  return SCRIPTED_CUSTOMER_LINES.map((line) => {
    if (line.speaker !== "You") {
      return line;
    }
    return {
      speaker: line.speaker,
      text: `Absolutely. Today is ${state.serviceType || "your scheduled service"} and I will start outside first.`
    };
  });
}

function getCustomerDialogAiReply(messageText) {
  const text = String(messageText || "").toLowerCase();
  if (text.includes("rain")) {
    return "Thanks for the update. If rain starts we can reschedule.";
  }
  if (text.includes("pet") || text.includes("dog") || text.includes("cat")) {
    return "Pets are inside. Thanks for checking.";
  }
  if (text.includes("gate") || text.includes("backyard")) {
    return "The side gate is unlocked for you.";
  }
  if (text.includes("service") || text.includes("spray")) {
    return "Great, please focus around doors, windows, and the eaves.";
  }
  return "Sounds good. Please proceed and leave notes when finished.";
}

function beginCustomerConversation() {
  state.phase = "conversation";
  state.conversationTimer = 0;
  state.customerDialog.active = true;
  state.customerDialog.playerMessagesSent = 0;
  state.customerDialog.aiReadyToComplete = false;
  state.customerDialog.aiPending = false;
  state.customerDialog.replySource = "";

  if (state.customerAiMode) {
    state.customerDialog.scriptedLines = [];
    state.customerDialog.scriptedIndex = 0;
    state.customerDialog.currentSpeaker = "Customer";
    state.customerDialog.currentLine = "Hey, thanks for coming by. Send me a quick update before you start.";
    if (customerDialogInput) {
      customerDialogInput.value = "";
    }
  } else {
    state.customerDialog.scriptedLines = buildScriptedConversationLines();
    state.customerDialog.scriptedIndex = 0;
    const first = state.customerDialog.scriptedLines[0];
    state.customerDialog.currentSpeaker = first ? first.speaker : "Customer";
    state.customerDialog.currentLine = first ? first.text : "Thanks for coming by.";
  }
}

function tryAdvanceScriptedConversation() {
  if (state.phase !== "conversation" || state.customerAiMode) {
    return;
  }
  const lines = state.customerDialog.scriptedLines;
  if (!lines.length) {
    completeCheckIn(true);
    return;
  }
  const nextIndex = state.customerDialog.scriptedIndex + 1;
  if (nextIndex >= lines.length) {
    completeCheckIn(true);
    return;
  }
  state.customerDialog.scriptedIndex = nextIndex;
  const line = lines[nextIndex];
  state.customerDialog.currentSpeaker = line.speaker;
  state.customerDialog.currentLine = line.text;
}

async function trySendCustomerMessage() {
  if (state.phase !== "conversation" || !customerDialogInput) {
    return;
  }
  if (!state.customerAiMode) {
    setSprayerFeedback("Set Customer Mode to AI Typing to send typed messages.", 1.15);
    return;
  }
  if (state.customerDialog.aiPending) {
    return;
  }
  const text = String(customerDialogInput.value || "").trim();
  if (text.length < 3) {
    setSprayerFeedback("Type a short message to the customer before continuing.", 1.05);
    return;
  }
  customerDialogInput.value = "";
  state.customerDialog.playerMessagesSent += 1;
  const messageTurn = state.customerDialog.playerMessagesSent;
  state.customerDialog.aiPending = true;
  state.customerDialog.aiReadyToComplete = false;
  state.customerDialog.replySource = "pending";
  state.customerDialog.currentSpeaker = "You";
  state.customerDialog.currentLine = text;
  state.customerDialog.currentSpeaker = "Customer";
  state.customerDialog.currentLine = "...typing...";

  const currentOrder = getCurrentOrder();
  const fallbackReply = getCustomerDialogAiReply(text);
  const aiReply = await requestAiChatReply({
    channel: "customer_dialog",
    recipient: "customer",
    message: text,
    context: {
      serviceType: state.serviceType,
      stopNumber: state.stopNumber,
      customerHome: true,
      customerName: currentOrder ? currentOrder.customer : "",
      address: currentOrder ? currentOrder.address : "",
      plan: currentOrder ? currentOrder.plan : ""
    }
  });

  if (
    state.phase !== "conversation"
    || !state.customerDialog.active
    || !state.customerAiMode
    || state.customerDialog.playerMessagesSent !== messageTurn
  ) {
    state.customerDialog.aiPending = false;
    return;
  }

  state.customerDialog.currentSpeaker = "Customer";
  if (aiReply) {
    state.customerDialog.currentLine = aiReply;
    state.customerDialog.replySource = "ai";
  } else {
    state.customerDialog.currentLine = fallbackReply;
    state.customerDialog.replySource = "fallback";
    const reason = getLatestAiFailureReasonText();
    const action = getLatestAiFailureActionText();
    setSprayerFeedback(
      reason
        ? action
          ? `Customer AI unavailable (${reason}). ${action}`
          : `Customer AI unavailable (${reason}), using fallback response.`
        : "Customer AI unavailable, using fallback response.",
      2.4
    );
  }
  state.customerDialog.aiReadyToComplete = true;
  state.customerDialog.aiPending = false;
}

function tryCompleteAiConversation() {
  if (state.phase !== "conversation" || !state.customerAiMode) {
    return;
  }
  if (!state.customerDialog.aiReadyToComplete) {
    setSprayerFeedback("Send the customer a quick message first.", 1.05);
    return;
  }
  completeCheckIn(true);
}

function updateCustomerDialogUi() {
  if (!customerDialogPanel || !customerDialogTitle || !customerDialogLine || !customerDialogNextButton) {
    return;
  }
  const active = state.phase === "conversation" && state.customerDialog.active;
  customerDialogPanel.hidden = !active;
  if (!active) {
    return;
  }

  if (customerDialogTitle) {
    if (state.customerAiMode) {
      customerDialogTitle.textContent = state.customerDialog.replySource === "ai"
        ? "Door Check-In (AI Live)"
        : state.customerDialog.replySource === "fallback"
          ? "Door Check-In (Fallback Reply)"
          : "Door Check-In (AI Chat)";
    } else {
      customerDialogTitle.textContent = "Door Check-In";
    }
  }
  const speaker = state.customerDialog.currentSpeaker || "Customer";
  const line = state.customerDialog.currentLine || "Thanks for stopping by.";
  customerDialogLine.textContent = `${speaker}: ${line}`;

  if (state.customerAiMode) {
    if (customerDialogInputWrap) {
      customerDialogInputWrap.hidden = false;
    }
    customerDialogNextButton.textContent = state.customerDialog.aiReadyToComplete ? "Complete Check-In" : "Waiting On Message";
    customerDialogNextButton.disabled = !state.customerDialog.aiReadyToComplete || state.customerDialog.aiPending;
    if (customerDialogSendButton) {
      customerDialogSendButton.disabled = state.customerDialog.aiPending;
    }
    if (customerDialogInput) {
      customerDialogInput.disabled = state.customerDialog.aiPending;
    }
    if (customerDialogHint) {
      const reason = getLatestAiFailureReasonText();
      customerDialogHint.textContent = state.customerDialog.aiPending
        ? "Customer AI is replying..."
        : state.customerDialog.aiReadyToComplete
        ? state.customerDialog.replySource === "ai"
          ? "AI customer replied. Click Complete Check-In to begin service."
          : reason
            ? (() => {
              const action = getLatestAiFailureActionText();
              return action
                ? `Fallback reply used (AI unavailable: ${reason}). ${action}`
                : `Fallback reply used (AI unavailable: ${reason}). Send again or click Complete Check-In.`;
            })()
            : "Fallback reply used (AI unavailable). Send again or click Complete Check-In."
        : "Type and send a message to talk with the customer.";
    }
  } else {
    if (customerDialogInputWrap) {
      customerDialogInputWrap.hidden = true;
    }
    customerDialogNextButton.textContent = "Next";
    customerDialogNextButton.disabled = false;
    if (customerDialogSendButton) {
      customerDialogSendButton.disabled = false;
    }
    if (customerDialogInput) {
      customerDialogInput.disabled = false;
    }
    if (customerDialogHint) {
      const total = state.customerDialog.scriptedLines.length || 1;
      customerDialogHint.textContent = `Click Next to continue (${state.customerDialog.scriptedIndex + 1}/${total}).`;
    }
  }
}

function setPhoneControlsOpen(enabled) {
  state.phoneControlsOpen = Boolean(enabled);
  if (phoneControlsSheet) {
    phoneControlsSheet.hidden = !state.phoneControlsOpen;
  }
  if (phoneControlsButton) {
    phoneControlsButton.setAttribute("aria-expanded", state.phoneControlsOpen ? "true" : "false");
    phoneControlsButton.textContent = state.phoneControlsOpen ? "Hide Controls" : "Show Controls";
  }
}

function setPhoneOpen(enabled) {
  state.phoneOpen = Boolean(enabled);
  if (!state.phoneOpen && state.phoneControlsOpen) {
    setPhoneControlsOpen(false);
  }
  if (phoneToggleButton) {
    phoneToggleButton.setAttribute("aria-expanded", state.phoneOpen ? "true" : "false");
    phoneToggleButton.textContent = state.phoneOpen ? "Close Phone" : "Open Phone";
  }
}

function setPhoneApp(appName, options = {}) {
  const { force = false } = options;
  const normalized = String(appName || "").toLowerCase();
  if (normalized !== "messages" && normalized !== "email" && normalized !== "field") {
    return;
  }
  if (!force && !canOperatePhoneApps()) {
    ensurePhoneOpsAllowed();
    return;
  }
  state.phoneApp = normalized;
  updatePhoneAppUi();
}

function updatePhoneMessagesUi() {
  if (!phoneMsgThread) {
    return;
  }
  phoneMsgThread.innerHTML = "";
  state.phoneComms.messages.slice(-30).forEach((item) => {
    const line = document.createElement("p");
    line.className = `phone-msg-item ${item.direction === "outgoing" ? "outgoing" : "incoming"}`;
    line.innerHTML = `<strong>${item.from}:</strong> ${item.text}`;
    phoneMsgThread.appendChild(line);
  });
  phoneMsgThread.scrollTop = phoneMsgThread.scrollHeight;
}

function updatePhoneEmailUi() {
  if (!phoneEmailList) {
    return;
  }
  phoneEmailList.innerHTML = "";
  state.phoneComms.emails.slice(-20).forEach((email) => {
    const item = document.createElement("article");
    item.className = "phone-email-item";
    item.innerHTML = `<strong>${email.subject}</strong><span>${email.from}</span><p>${email.body}</p>`;
    phoneEmailList.appendChild(item);
  });
  phoneEmailList.scrollTop = phoneEmailList.scrollHeight;
}

function setPhoneEmailPending(isPending) {
  state.phoneEmailPending = Boolean(isPending);
  const phoneOpsAllowed = canOperatePhoneApps();
  if (phoneEmailManagerButton) {
    phoneEmailManagerButton.disabled = state.phoneEmailPending || !phoneOpsAllowed;
  }
  if (phoneEmailCustomerButton) {
    phoneEmailCustomerButton.disabled = state.phoneEmailPending || !phoneOpsAllowed;
  }
  if (phoneEmailInput) {
    phoneEmailInput.disabled = state.phoneEmailPending || !phoneOpsAllowed;
  }
}

function updatePhoneAppUi() {
  const phoneOpsAllowed = canOperatePhoneApps();
  if (!phoneOpsAllowed) {
    const activeElement = document.activeElement;
    if (phonePanel && activeElement instanceof HTMLElement && phonePanel.contains(activeElement)) {
      activeElement.blur();
    }
    state.techCommentEditing = false;
  }
  if (phoneAppButtons && phoneAppButtons.length > 0) {
    phoneAppButtons.forEach((button) => {
      const appName = String(button.getAttribute("data-phone-app") || "");
      button.setAttribute("aria-pressed", appName === state.phoneApp ? "true" : "false");
      button.disabled = !phoneOpsAllowed;
    });
  }
  if (phoneMsgRecipient) {
    phoneMsgRecipient.disabled = !phoneOpsAllowed;
  }
  if (phoneMsgInput) {
    phoneMsgInput.disabled = !phoneOpsAllowed;
  }
  if (phoneMsgSendButton) {
    phoneMsgSendButton.disabled = !phoneOpsAllowed;
  }
  if (phoneEmailInput) {
    phoneEmailInput.disabled = !phoneOpsAllowed || state.phoneEmailPending;
  }
  if (phoneEmailManagerButton) {
    phoneEmailManagerButton.disabled = !phoneOpsAllowed || state.phoneEmailPending;
  }
  if (phoneEmailCustomerButton) {
    phoneEmailCustomerButton.disabled = !phoneOpsAllowed || state.phoneEmailPending;
  }
  if (phoneStartOverDayButton) {
    phoneStartOverDayButton.disabled = !phoneOpsAllowed;
  }

  if (phoneMessagesView) {
    phoneMessagesView.hidden = !phoneOpsAllowed || state.phoneApp !== "messages";
  }
  if (phoneEmailView) {
    phoneEmailView.hidden = !phoneOpsAllowed || state.phoneApp !== "email";
  }
  if (fieldMgmtPanel) {
    fieldMgmtPanel.hidden = !phoneOpsAllowed || state.phoneApp !== "field";
  }
  updatePhoneMessagesUi();
  updatePhoneEmailUi();
  setPhoneEmailPending(state.phoneEmailPending);
}

function appendPhoneMessage(direction, from, text) {
  const safeText = String(text || "").trim();
  if (!safeText) {
    return;
  }
  state.phoneComms.messages.push({
    direction: direction === "outgoing" ? "outgoing" : "incoming",
    from: String(from || "Contact"),
    text: safeText
  });
  updatePhoneMessagesUi();
}

function recordAiError(details) {
  const entry = {
    at: new Date().toISOString(),
    channel: String(details && details.channel ? details.channel : "phone"),
    recipient: String(details && details.recipient ? details.recipient : "manager"),
    status: Number.isFinite(details && details.status) ? Number(details.status) : null,
    code: String(details && details.code ? details.code : "client_unknown_error"),
    requestId: String(details && details.requestId ? details.requestId : ""),
    error: String(details && details.error ? details.error : "Unknown AI error"),
    detail: String(details && details.detail ? details.detail : "").slice(0, 280)
  };

  state.aiLastError = entry.error;
  state.aiLastErrorCode = entry.code;
  state.aiLastRequestId = entry.requestId;
  state.aiErrorEvents.push(entry);
  if (state.aiErrorEvents.length > 40) {
    state.aiErrorEvents.splice(0, state.aiErrorEvents.length - 40);
  }

  if (typeof console !== "undefined" && typeof console.warn === "function") {
    console.warn("[AI ERROR]", entry);
  }
  if (typeof window !== "undefined") {
    window.__aiErrorLog = state.aiErrorEvents.slice();
  }

  if (state.aiErrorToastCooldown <= 0) {
    const requestText = entry.requestId ? ` req:${entry.requestId}` : "";
    setSprayerFeedback(`AI response failed (${entry.code}). Using fallback.${requestText}`, 1.8);
    state.aiErrorToastCooldown = 8;
  }
}

function clearAiErrorToastCooldown(dt) {
  if (state.aiErrorToastCooldown > 0) {
    state.aiErrorToastCooldown = Math.max(0, state.aiErrorToastCooldown - dt);
  }
}

async function requestAiChatReply({ channel, recipient, message, context }) {
  const safeMessage = String(message || "").trim();
  if (!safeMessage) {
    return "";
  }
  const safeChannel = String(channel || "phone");
  const safeRecipient = String(recipient || "manager");
  const abortController = typeof AbortController === "function" ? new AbortController() : null;
  const timeoutId = abortController
    ? window.setTimeout(() => {
      abortController.abort();
    }, AI_CHAT_TIMEOUT_MS)
    : null;
  try {
    const response = await fetch("/api/ai-chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      signal: abortController ? abortController.signal : undefined,
      body: JSON.stringify({
        channel: safeChannel,
        recipient: safeRecipient,
        message: safeMessage,
        context: context && typeof context === "object" ? context : {}
      })
    });
    if (!response.ok) {
      let data = null;
      try {
        data = await response.json();
      } catch (_parseError) {
        data = null;
      }
      recordAiError({
        channel: safeChannel,
        recipient: safeRecipient,
        status: response.status,
        code: data && data.code ? data.code : "api_http_error",
        requestId: data && data.requestId ? data.requestId : "",
        error: data && data.error ? data.error : `AI API HTTP ${response.status}`,
        detail: data && data.detail ? data.detail : ""
      });
      return "";
    }
    const data = await response.json();
    if (!data || data.ok !== true || typeof data.reply !== "string") {
      recordAiError({
        channel: safeChannel,
        recipient: safeRecipient,
        status: response.status,
        code: "invalid_ai_payload",
        requestId: data && data.requestId ? data.requestId : "",
        error: "AI API returned an unexpected payload.",
        detail: data ? JSON.stringify(data).slice(0, 280) : ""
      });
      return "";
    }
    return String(data.reply).trim();
  } catch (error) {
    const isTimeout = Boolean(error && error.name === "AbortError");
    recordAiError({
      channel: safeChannel,
      recipient: safeRecipient,
      status: null,
      code: isTimeout ? "client_timeout" : "network_error",
      requestId: "",
      error: isTimeout ? "AI request timed out in browser." : "Network error calling AI endpoint.",
      detail: error && error.message ? String(error.message) : ""
    });
    return "";
  } finally {
    if (timeoutId !== null) {
      window.clearTimeout(timeoutId);
    }
  }
}

function getSimulatedReply(recipient, outgoingText) {
  const content = String(outgoingText || "").toLowerCase();
  if (recipient === "manager") {
    if (content.includes("rain")) {
      return "Copy that. Document rain delay, add a tech note, and time out the order.";
    }
    if (content.includes("reschedule")) {
      return "Approved. Reschedule with customer and log it in Field Management.";
    }
    if (content.includes("complete")) {
      return "Nice work. Add final notes and close the stop in Field Management.";
    }
    return "Received. Keep me posted if anything changes at this stop.";
  }

  if (content.includes("arrive") || content.includes("arrival")) {
    return "Thanks for the heads-up. The gate is unlocked and pets are inside.";
  }
  if (content.includes("rain")) {
    return "Understood. Let's reschedule once weather clears.";
  }
  if (content.includes("complete")) {
    return "Thank you for the update. Please leave notes in the service summary.";
  }
  return "Thanks for the message. Please text when service is complete.";
}

function getLatestAiErrorEntry() {
  if (!Array.isArray(state.aiErrorEvents) || state.aiErrorEvents.length <= 0) {
    return null;
  }
  const latest = state.aiErrorEvents[state.aiErrorEvents.length - 1];
  if (!latest || typeof latest !== "object") {
    return null;
  }
  return latest;
}

function getLatestAiFailureReasonText() {
  const latest = getLatestAiErrorEntry();
  const code = String(state.aiLastErrorCode || (latest && latest.code) || "").toLowerCase();
  const status = Number.isFinite(latest && latest.status) ? Number(latest.status) : null;
  const detail = String(latest && latest.detail ? latest.detail : "").toLowerCase();
  if (!code) {
    return "";
  }
  if (code === "missing_api_key") {
    return "server has no AI key";
  }
  if (code === "network_error") {
    return "AI backend not reachable on this tab";
  }
  if (code === "client_timeout" || code === "gemini_timeout" || code === "openai_timeout") {
    return "AI timeout";
  }
  if (code === "api_http_error" && status === 404) {
    return "AI route not found on this host";
  }
  if ((code === "openai_http_error" || code === "gemini_http_error" || code === "api_http_error") && (status === 401 || status === 403)) {
    return "AI key rejected or lacks permission";
  }
  if ((code === "openai_http_error" || code === "gemini_http_error" || code === "api_http_error") && status === 429) {
    return "AI provider rate-limited";
  }
  if ((code === "openai_http_error" || code === "gemini_http_error" || code === "api_http_error") && detail.includes("model")) {
    return "AI model name is invalid";
  }
  if (code === "gemini_http_error" || code === "openai_http_error" || code === "api_http_error") {
    return "AI provider request failed";
  }
  if (code === "gemini_empty_output" || code === "openai_empty_output") {
    return "AI returned empty output";
  }
  if (code === "invalid_ai_payload") {
    return "unexpected AI payload";
  }
  return code.replace(/_/g, " ");
}

function getLatestAiFailureActionText() {
  const latest = getLatestAiErrorEntry();
  const code = String(state.aiLastErrorCode || (latest && latest.code) || "").toLowerCase();
  const status = Number.isFinite(latest && latest.status) ? Number(latest.status) : null;
  if (!code) {
    return "";
  }
  if (code === "missing_api_key") {
    return "Set GEMINI_API_KEY or OPENAI_API_KEY in `.env`, then restart `npm start`.";
  }
  if (code === "network_error" || (code === "api_http_error" && status === 404)) {
    return "Run `npm start` and open the game at `http://localhost:3000` (same server as backend).";
  }
  if ((code === "openai_http_error" || code === "gemini_http_error" || code === "api_http_error") && (status === 401 || status === 403)) {
    return "Verify your AI key and provider permissions, then restart the server.";
  }
  if ((code === "openai_http_error" || code === "gemini_http_error" || code === "api_http_error") && status === 429) {
    return "Wait briefly or switch provider/model to avoid rate limits.";
  }
  if (code === "client_timeout" || code === "gemini_timeout" || code === "openai_timeout") {
    return "Increase `AI_TIMEOUT_MS` or try again when network is stable.";
  }
  return "";
}

async function sendPhoneMessage() {
  if (!ensurePhoneOpsAllowed()) {
    updatePhoneAppUi();
    return;
  }
  if (!phoneMsgInput || !phoneMsgRecipient) {
    return;
  }
  const text = String(phoneMsgInput.value || "").trim();
  if (!text) {
    return;
  }
  const recipient = String(phoneMsgRecipient.value || "manager");
  const toLabel = recipient === "customer" ? "Customer" : "Manager";
  appendPhoneMessage("outgoing", "You", `To ${toLabel}: ${text}`);
  phoneMsgInput.value = "";

  const aiReply = await requestAiChatReply({
    channel: "phone",
    recipient,
    message: text,
    context: {
      stopNumber: state.stopNumber,
      serviceType: state.serviceType,
      rainActive: Boolean(state.rain.active)
    }
  });
  const reply = aiReply || getSimulatedReply(recipient, text);
  appendPhoneMessage("incoming", toLabel, reply);
}

async function sendPhoneEmail(recipient) {
  if (!ensurePhoneOpsAllowed()) {
    updatePhoneAppUi();
    return;
  }
  if (state.phoneEmailPending) {
    return;
  }

  const target = recipient === "customer" ? "Customer" : "Manager";
  const order = getCurrentOrder();
  const stopLabel = `Stop ${state.stopNumber}/${TOTAL_STOPS_PER_DAY}`;
  const subject = target === "Manager"
    ? `Field Update - ${stopLabel}`
    : `Service Update - ${order ? order.address : stopLabel}`;
  const typedText = String(phoneEmailInput && phoneEmailInput.value ? phoneEmailInput.value : "").trim();
  const fallbackBody = target === "Manager"
    ? `Status on ${stopLabel}: ${state.serviceType || "Service pending"}. Field app notes will be attached after closeout.`
    : `Hello ${order ? order.customer : "Customer"}, this is your technician with an update on today's ${state.serviceType || "service"} visit.`;
  const body = typedText || fallbackBody;

  state.phoneComms.emails.push({
    from: `You -> ${target}`,
    subject,
    body
  });
  updatePhoneEmailUi();
  if (phoneEmailInput) {
    phoneEmailInput.value = "";
  }

  setPhoneEmailPending(true);
  const aiReply = await requestAiChatReply({
    channel: "email",
    recipient: target.toLowerCase(),
    message: body,
    context: {
      stopNumber: state.stopNumber,
      serviceType: state.serviceType,
      rainActive: Boolean(state.rain.active)
    }
  });
  setPhoneEmailPending(false);

  const replyBody = aiReply || (target === "Manager"
    ? "Thanks for the update. Make sure timing and notes are completed in Field Management."
    : "Thanks for the update. Please send completion notes when finished.");
  state.phoneComms.emails.push({
    from: target,
    subject: `RE: ${subject}`,
    body: replyBody
  });
  updatePhoneEmailUi();
}

function updateDriveSpeedUi() {
  const cruiseState = state.cruiseEnabled ? "Cruise On" : "Cruise Off";
  const speedText = `${Math.round(state.targetDriveSpeedMph)} mph (${cruiseState})`;
  if (phoneDriveSpeedValue) {
    phoneDriveSpeedValue.textContent = speedText;
  }
  if (phoneDriveSpeedSlider) {
    phoneDriveSpeedSlider.value = `${Math.round(state.targetDriveSpeedMph)}`;
  }
}

function setCruiseEnabled(enabled) {
  const nextEnabled = Boolean(enabled) && state.targetDriveSpeedMph > 0;
  if (state.cruiseEnabled === nextEnabled) {
    updateDriveSpeedUi();
    return;
  }
  state.cruiseEnabled = nextEnabled;
  updateDriveSpeedUi();
}

function setTargetDriveSpeed(nextSpeedMph, options = {}) {
  const { engageCruise = false } = options;
  const numericSpeed = Number.isFinite(nextSpeedMph) ? nextSpeedMph : state.targetDriveSpeedMph;
  state.targetDriveSpeedMph = clamp(numericSpeed, MIN_DRIVE_SPEED_MPH, MAX_DRIVE_SPEED_MPH);
  const canEngageCruise = engageCruise
    && state.inTruck
    && state.phase === "drive_to_stop"
    && !state.missionComplete
    && state.targetDriveSpeedMph > 0;
  if (canEngageCruise) {
    setCruiseEnabled(true);
    return;
  }
  if (state.targetDriveSpeedMph <= 0) {
    setCruiseEnabled(false);
    return;
  }
  updateDriveSpeedUi();
}

function adjustTargetDriveSpeed(deltaMph, options = {}) {
  setTargetDriveSpeed(state.targetDriveSpeedMph + deltaMph, options);
}

function updateRainToggleButton() {
  if (!phoneRainToggleButton) {
    return;
  }
  phoneRainToggleButton.setAttribute("aria-pressed", state.rain.enabled ? "true" : "false");
  phoneRainToggleButton.textContent = state.rain.enabled ? "Rain: On" : "Rain: Off";
}

function setRainEnabled(enabled, options = {}) {
  const { silent = false } = options;
  const nextEnabled = Boolean(enabled);
  if (state.rain.enabled === nextEnabled) {
    updateRainToggleButton();
    return;
  }

  state.rain.enabled = nextEnabled;
  if (!nextEnabled) {
    state.rain.active = false;
    state.rain.context = "";
    state.rain.stage = "";
    state.rain.willTrigger = false;
    state.rain.triggered = true;
    if (!silent) {
      setSprayerFeedback("Rain events disabled.", 1);
    }
  } else {
    if (!state.rain.active) {
      state.rain.triggered = false;
      state.rain.elapsed = 0;
      state.rain.willTrigger = !state.rain.usedToday && Math.random() < RAIN_TRIGGER_CHANCE;
      state.rain.triggerAt = randomBetween(RAIN_TRIGGER_MIN_SECONDS, RAIN_TRIGGER_MAX_SECONDS);
    }
    if (!silent) {
      setSprayerFeedback(
        state.rain.usedToday
          ? "Rain enabled, but today's rain event already happened."
          : "Rain events enabled (rare).",
        1
      );
    }
  }
  updateRainToggleButton();
}

function updateTrainerPanel() {
  if (!state.trainerMode || !trainerTip) {
    return;
  }

  let message = "I'll ride shotgun and coach each step while you learn the route.";
  if (state.mapOpen) {
    message = "Use this map to scan neighborhood layout and potential service hotspots.";
  } else if (state.rain.active) {
    if (state.rain.stage === "drive_to_spot") {
      message = "Rain callout: finish this drive and park, then text your manager to reschedule.";
    } else if (state.rain.stage === "drive_text_manager") {
      message = "Hold parked position and send your manager a delay update from the phone.";
    } else if (state.rain.stage === "service_talk_customer") {
      message = "Walk to the door, explain the rain delay, then send your manager a text.";
    } else if (state.rain.stage === "service_text_manager") {
      message = "Customer informed. Press E again to text manager and close the stop.";
    }
  } else if (state.phase === "drive_to_stop") {
    message = "Smooth driving keeps equipment stable. Start slowing down before each turn.";
  } else if (state.phase === "service_briefing" || state.phase === "walk_to_door") {
    message = getServiceTrainerTips(state.serviceType)[0];
  } else if (state.phase === "conversation") {
    message = state.customerAiMode
      ? "Send a concise, professional customer message before starting treatment."
      : "Click through each customer line, then complete check-in.";
  } else if (state.phase === "webster_pickup") {
    message = "Before spraying, grab the webster at the van rear and clear visible webbing.";
  } else if (state.phase === "webster_working") {
    message = "Work clockwise around the home and knock down webs before chemical application.";
  } else if (state.phase === "working") {
    if (state.serviceComplete && state.sprayerNeedsRollup) {
      message = "Nice coverage. Now walk up to the truck and press E to roll up the power sprayer.";
    } else if (!state.vehicleDoors.right) {
      message = "Open the right-side sprayer door first, then press E again to grab the power sprayer.";
    } else if (!state.hasPowerSprayer) {
      message = "Power sprayer is still on the truck. Press E at the right-side door to grab it.";
    } else if (state.nearbyNoSprayZoneType) {
      message = state.nearbyNoSprayZoneType === "flowers"
        ? "Pause here: flowering planters are protected. Avoid spraying over them."
        : state.nearbyNoSprayZoneType === "toys"
          ? "Pause here: toys are in this area. Press E to move toys before spraying."
          : "Pause here: vegetable beds are protected. Keep spray off them.";
    } else if (state.activeHouseSide) {
      message = `${SIDE_LABELS[state.activeHouseSide]}: hold Space and paint with the mouse circle. Complete every window and door trim box on this side.`;
    } else if (state.sprayerConcentration < 0.3) {
      message = "Spray is too wide: coverage will be light and patchy. Scroll up to concentrate.";
    } else if (state.sprayerConcentration > 0.82) {
      message = "Spray is too concentrated: rebound risk increases. Scroll down slightly.";
    } else {
      const tips = getServiceTrainerTips(state.serviceType);
      const index = Math.floor((state.timeMs / 4200) % tips.length);
      message = tips[index];
    }
  }
  trainerTip.textContent = message;
}

function movePlayerNextToTruck() {
  const preferredAngles = [
    truck.angle + (Math.PI / 2),
    truck.angle - (Math.PI / 2),
    truck.angle + Math.PI,
    truck.angle
  ];
  const radii = [52, 62, 74, 86];

  for (const radius of radii) {
    for (const baseAngle of preferredAngles) {
      for (let offsetIndex = -1; offsetIndex <= 1; offsetIndex += 1) {
        const candidateAngle = baseAngle + offsetIndex * (Math.PI / 6);
        const candidateX = clamp(truck.x + Math.cos(candidateAngle) * radius, player.radius, world.width - player.radius);
        const candidateY = clamp(truck.y + Math.sin(candidateAngle) * radius, player.radius, world.height - player.radius);
        if (!collidesHouseCircle(candidateX, candidateY, player.radius + 2)) {
          player.x = candidateX;
          player.y = candidateY;
          return;
        }
      }
    }
  }

  for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 8) {
    const candidateX = clamp(truck.x + Math.cos(angle) * 64, player.radius, world.width - player.radius);
    const candidateY = clamp(truck.y + Math.sin(angle) * 64, player.radius, world.height - player.radius);
    if (!collidesHouseCircle(candidateX, candidateY, player.radius + 2)) {
      player.x = candidateX;
      player.y = candidateY;
      return;
    }
  }

  player.x = clamp(truck.x, player.radius, world.width - player.radius);
  player.y = clamp(truck.y + 62, player.radius, world.height - player.radius);
}

function completeCheckIn(customerWasHome) {
  resetCustomerDialogState();
  state.phase = "webster_pickup";
  state.missionComplete = false;
  resetServiceWorkState();
  state.webTargets = buildWebTargets();

  if (missionCompleteTitle) {
    missionCompleteTitle.textContent = customerWasHome ? "Check-in Complete" : "No Answer at Door";
  }
  if (missionCompleteMessage) {
    missionCompleteMessage.textContent = customerWasHome
      ? "Customer was home, you confirmed service details. First, grab the webster and clear webs."
      : "Customer was not home. First task: grab the webster and clear all webs around the house.";
  }
  if (missionCompleteCard) {
    missionCompleteCard.hidden = false;
  }
  state.completionBannerTimer = 3.2;
  if (phoneServiceNote) {
    const baseNote = customerWasHome
      ? "Status: Customer checked in. Begin exterior/interior service."
      : "Status: No answer. Begin service as scheduled.";
    phoneServiceNote.textContent = state.fieldOrder.timedIn
      ? baseNote
      : `${baseNote} Field Management step: select assigned customer and Time In first.`;
  }
  if (sideProfilePanel) {
    sideProfilePanel.hidden = false;
  }
}

function startDoorCheckIn() {
  if (!state.fieldOrder.timedIn) {
    setSprayerFeedback("Time In is required before door check-in. Use Field Management first.", 1.35);
    return;
  }
  if (state.customerHome) {
    beginCustomerConversation();
    return;
  }
  completeCheckIn(false);
}

function beginServicePhase() {
  resetCustomerDialogState();
  maybeDingMissedTimeInBeforeExit();
  state.inTruck = false;
  setCruiseEnabled(false);
  state.parkLocked = false;
  state.vehicleDoors.driver = false;
  state.vehicleDoors.right = false;
  state.vehicleDoors.rear = false;
  state.hasPowerSprayer = false;
  state.phase = "service_briefing";
  state.serviceBriefTimer = 0;
  state.serviceType = SERVICE_TYPES[Math.floor(Math.random() * SERVICE_TYPES.length)];
  state.noSprayZones = buildRandomNoSprayZones();
  state.nearbyNoSprayZoneType = "";
  const currentOrder = getCurrentOrder();
  state.customerHome = currentOrder ? Boolean(currentOrder.isHome) : Math.random() < CUSTOMER_HOME_CHANCE;
  state.deckStairCooldown = 0;
  truck.speed = 0;
  movePlayerNextToTruck();
  resetTrainerFollowerPosition();

  if (phoneServiceTitle) {
    phoneServiceTitle.textContent = `Service: ${state.serviceType}`;
  }
  if (phoneServiceNote) {
    phoneServiceNote.textContent = state.trainerMode
      ? `Arrival confirmed. Walk to the front door. Trainer tip: ${getServiceTrainerTips(state.serviceType)[0]}`
      : "Arrival confirmed. Walk to the front door to check in with the customer.";
  }
  if (phoneServiceNote) {
    phoneServiceNote.textContent = `${phoneServiceNote.textContent} Service standard: treat base + under eaves on each side, plus around windows and doors.`;
  }
}

function tryPickupWebster() {
  if (state.phase !== "webster_pickup") {
    return;
  }
  if (!state.fieldOrder.timedIn) {
    setSprayerFeedback("Field Management required: select assigned customer and Time In first.", 1.35);
    return;
  }

  const rearDoor = getTruckRearDoorPoint();
  if (!state.vehicleDoors.rear) {
    if (distance(player, rearDoor) <= 44) {
      state.vehicleDoors.rear = true;
      setSprayerFeedback("Rear door opened. Press E again to grab the webster.", 1.2);
    } else {
      setSprayerFeedback("Move to the rear doors to open them first.", 1.1);
    }
    return;
  }

  const rear = getTruckWebsterPoint();
  if (distance(player, rear) <= 44) {
    state.hasWebster = true;
    state.phase = "webster_working";
    state.vehicleDoors.rear = false;
    setSprayerFeedback("Webster grabbed. Knock down webs on all sides.", 1.2);
  } else {
    setSprayerFeedback("Step to the back of the truck to grab the webster.", 1.1);
  }
}

function tryExitTruck() {
  if (!state.inTruck) {
    return false;
  }
  if (Math.abs(truck.speed) > 10) {
    setSprayerFeedback("Slow to a stop before exiting the truck.", 1.1);
    return true;
  }

  state.inTruck = false;
  setCruiseEnabled(false);
  truck.speed = 0;
  state.vehicleDoors.driver = true;
  const driverExitPoint = truckLocalToWorld(24, -35);
  if (!collidesHouseCircle(driverExitPoint.x, driverExitPoint.y, player.radius + 2)) {
    player.x = clamp(driverExitPoint.x, player.radius, world.width - player.radius);
    player.y = clamp(driverExitPoint.y, player.radius, world.height - player.radius);
  } else {
    movePlayerNextToTruck();
  }
  if (dashboard) {
    dashboard.hidden = true;
  }
  const dingedTimeIn = state.phase === "drive_to_stop"
    && (isTruckInsideParkingZone() || isTruckParkedCorrectly())
    && maybeDingMissedTimeInBeforeExit();
  resetTrainerFollowerPosition();
  if (!dingedTimeIn) {
    setSprayerFeedback("You exited the truck. Press E near the truck to get back in.", 1.2);
  }
  return true;
}

function tryOpenSprayerDoor() {
  if (state.phase !== "working" || state.inTruck) {
    return false;
  }
  if (state.serviceComplete) {
    return false;
  }
  if (!state.fieldOrder.timedIn) {
    setSprayerFeedback("Time In to this order in Field Management before treatment.", 1.3);
    return true;
  }
  const rightDoor = getTruckRightDoorPoint();
  if (distance(player, rightDoor) <= 44) {
    if (!state.vehicleDoors.right) {
      state.vehicleDoors.right = true;
      setSprayerFeedback("Right-side sprayer door opened. Press E again to grab the power sprayer.", 1.2);
      return true;
    }
    if (!state.hasPowerSprayer) {
      state.hasPowerSprayer = true;
      setSprayerFeedback("Power sprayer grabbed. You can begin spraying.", 1.2);
      return true;
    }
    setSprayerFeedback("Power sprayer already in hand.", 0.9);
  } else if (!state.vehicleDoors.right) {
    setSprayerFeedback("Go to the right side of the truck and open the sprayer door first.", 1.2);
  } else if (!state.hasPowerSprayer) {
    setSprayerFeedback("Move to the right-side door and press E to grab the power sprayer.", 1.2);
  } else {
    setSprayerFeedback("Power sprayer already grabbed.", 0.9);
  }
  return true;
}

function tryRollUpPowerSprayer() {
  if (state.phase !== "working" || state.inTruck || !state.serviceComplete || !state.sprayerNeedsRollup) {
    return false;
  }

  if (distance(player, truck) <= 90) {
    state.sprayerNeedsRollup = false;
    state.hasPowerSprayer = false;
    state.vehicleDoors.right = false;
    const completionNote = state.serviceCompletionNote || getServiceCompletionNote();
    requestStopPhoneCloseout({ wasRescheduled: false, completionNote });
    setSprayerFeedback("Power sprayer rolled up and secured at the vehicle. Finish order closeout in Field Management.", 1.4);
  } else {
    setSprayerFeedback("Walk up to the vehicle and press E to roll up power sprayer.", 1.15);
  }
  return true;
}

function tryMoveNearbyToys() {
  if (state.inTruck || (state.phase !== "working" && state.phase !== "webster_working")) {
    return false;
  }

  const nearbyToyZone = state.noSprayZones.find((zone) => {
    if (zone.type !== "toys") {
      return false;
    }
    return distance(player, zone) <= zone.radius + 42;
  });
  if (!nearbyToyZone) {
    return false;
  }

  if (nearbyToyZone.moved) {
    setSprayerFeedback("Toys already moved out of treatment area.", 1);
    return true;
  }

  const offset = nearbyToyZone.radius + 24;
  if (nearbyToyZone.side === "north") {
    nearbyToyZone.y -= offset;
  } else if (nearbyToyZone.side === "south") {
    nearbyToyZone.y += offset;
  } else if (nearbyToyZone.side === "west") {
    nearbyToyZone.x -= offset;
  } else {
    nearbyToyZone.x += offset;
  }
  nearbyToyZone.x = clamp(nearbyToyZone.x, 18, world.width - 18);
  nearbyToyZone.y = clamp(nearbyToyZone.y, 18, world.height - 18);
  nearbyToyZone.moved = true;
  state.nearbyNoSprayZoneType = "";
  setSprayerFeedback(
    nearbyToyZone.toyGroup === "dog"
      ? "Dog toys moved out of treatment area."
      : "Kids toys moved out of treatment area.",
    1.2
  );
  return true;
}

function handleActionPress() {
  if (handleRainAction()) {
    return;
  }
  if (state.inTruck) {
    tryExitTruck();
    return;
  }
  if (state.phase === "webster_pickup") {
    tryPickupWebster();
    return;
  }
  if (tryTraverseDeckStairs({ manual: true })) {
    return;
  }
  if (tryMoveNearbyToys()) {
    return;
  }
  if (tryRollUpPowerSprayer()) {
    return;
  }
  if (tryOpenSprayerDoor()) {
    return;
  }
  tryEnterTruck();
}

function tryEnterTruck() {
  const canEnter =
    state.phase === "walk_to_truck"
    || state.phase === "drive_to_stop";
  if (state.inTruck || !canEnter || state.missionComplete) {
    return;
  }
  const driverDoor = getTruckDriverDoorPoint();
  const nearDoor = distance(player, driverDoor) <= 46;
  if (!nearDoor) {
    if (distance(player, truck) <= 96) {
      setSprayerFeedback("Driver seat is at the left-front door. Move there first.", 1.15);
    }
    return;
  }
  if (!state.vehicleDoors.driver) {
    state.vehicleDoors.driver = true;
    setSprayerFeedback("Driver door opened. Press E again to enter the seat.", 1.15);
    return;
  }
  if (nearDoor) {
    state.inTruck = true;
    setCruiseEnabled(false);
    state.vehicleDoors.driver = false;
    if (state.phase === "walk_to_truck") {
      state.phase = "drive_to_stop";
      state.parkLocked = false;
    }
    if (dashboard) {
      dashboard.hidden = false;
    }
    statusLine.textContent = "Truck started. GPS loaded to first stop.";
    hintLine.textContent = "Follow the glowing blue route. Park inside the glowing rectangle.";
  }
}

function setKeyState(event, isDown) {
  const code = event.code;
  if (!state.disclaimerAccepted) {
    if (isDown && !event.repeat && (code === "Enter" || code === "NumpadEnter" || code === "Space")) {
      acceptSafetyDisclaimer(event);
      return;
    }
    if (!isDown) {
      applyMovementKeyState(code, false);
    }
    if (isDown) {
      event.preventDefault();
    }
    return;
  }
  const activeElement = document.activeElement;
  if (isTextEntryElement(activeElement)) {
    if (!isDown) {
      applyMovementKeyState(code, false);
    }
    if (isDown && !event.repeat && code === "Escape" && activeElement instanceof HTMLElement) {
      activeElement.blur();
      resetGameplayInputs();
      event.preventDefault();
    }
    return;
  }
  if (isDown && !event.repeat && code === "KeyT") {
    setTrainerMode(!state.trainerMode);
    event.preventDefault();
    return;
  }
  if (isDown && !event.repeat && code === "KeyM") {
    state.mapOpen = !state.mapOpen;
    event.preventDefault();
    return;
  }
  if (isDown && !event.repeat && code === "KeyL") {
    if (!state.inTruck) {
      setSprayerFeedback("Road lock can be toggled while in the truck.", 1);
      event.preventDefault();
      return;
    }
    setRoadLockEnabled(!state.roadLockEnabled);
    event.preventDefault();
    return;
  }
  if (isDown && !event.repeat && (code === "BracketRight" || code === "Equal")) {
    adjustTargetDriveSpeed(1, { engageCruise: true });
    event.preventDefault();
    return;
  }
  if (isDown && !event.repeat && (code === "BracketLeft" || code === "Minus")) {
    adjustTargetDriveSpeed(-1, { engageCruise: true });
    event.preventDefault();
    return;
  }
  if (isDown && !event.repeat && code === "KeyP") {
    if (tryQuickParkAtHouse()) {
      event.preventDefault();
      return;
    }
  }
  if (applyMovementKeyState(code, isDown)) {
    event.preventDefault();
  }
  if (isDown && !event.repeat && code === "KeyE") {
    handleActionPress();
  }
}

function setTouchControl(name, isDown) {
  if (!(name in touchInput)) {
    return;
  }
  touchInput[name] = isDown;
}

function attachTouchControls() {
  if (!touchControlsWrap) {
    return;
  }

  const buttons = touchControlsWrap.querySelectorAll("button[data-control]");
  buttons.forEach((button) => {
    const control = button.getAttribute("data-control");
    if (!control) {
      return;
    }

    button.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      if (!state.disclaimerAccepted) {
        return;
      }
      button.setPointerCapture(event.pointerId);
      if (control === "action") {
        handleActionPress();
        return;
      }
      setTouchControl(control, true);
    });

    const release = () => {
      if (control !== "action") {
        setTouchControl(control, false);
      }
    };

    button.addEventListener("pointerup", release);
    button.addEventListener("pointercancel", release);
    button.addEventListener("pointerleave", release);
    button.addEventListener("lostpointercapture", release);
  });
}

function updatePlayer(dt) {
  const axis = getMoveAxis();
  let vx = axis.x;
  let vy = axis.y;

  if (vx !== 0 || vy !== 0) {
    const length = Math.hypot(vx, vy);
    vx /= length;
    vy /= length;
  }

  const nextX = player.x + vx * player.speed * dt;
  const nextY = player.y + vy * player.speed * dt;

  const clampedX = clamp(nextX, player.radius, world.width - player.radius);
  const clampedY = clamp(nextY, player.radius, world.height - player.radius);

  if (!collidesHouseCircle(clampedX, clampedY, player.radius + 2)) {
    player.x = clampedX;
    player.y = clampedY;
  }

  tryTraverseDeckStairs();
}

function updateTrainerFollower(dt) {
  if (!state.trainerMode) {
    return;
  }

  if (state.inTruck) {
    const seatPoint = truckLocalToWorld(20, 9);
    state.trainerFollower.x = seatPoint.x;
    state.trainerFollower.y = seatPoint.y;
    return;
  }

  const trainer = state.trainerFollower;
  const distToPlayer = distance(trainer, player);
  if (!Number.isFinite(trainer.x) || !Number.isFinite(trainer.y) || distToPlayer > TRAINER_TELEPORT_DISTANCE) {
    resetTrainerFollowerPosition();
    return;
  }

  const moveAxis = getMoveAxis();
  let dirX = moveAxis.x;
  let dirY = moveAxis.y;
  if (dirX === 0 && dirY === 0) {
    const towardPlayerX = player.x - trainer.x;
    const towardPlayerY = player.y - trainer.y;
    const len = Math.hypot(towardPlayerX, towardPlayerY);
    if (len > 0.001) {
      dirX = towardPlayerX / len;
      dirY = towardPlayerY / len;
    } else {
      dirY = 1;
    }
  } else {
    const len = Math.hypot(dirX, dirY);
    dirX /= len;
    dirY /= len;
  }

  let targetX = player.x - dirX * TRAINER_FOLLOW_DISTANCE;
  let targetY = player.y - dirY * TRAINER_FOLLOW_DISTANCE;
  targetX = clamp(targetX, player.radius, world.width - player.radius);
  targetY = clamp(targetY, player.radius, world.height - player.radius);

  let nextX = trainer.x + (targetX - trainer.x) * Math.min(1, dt * TRAINER_FOLLOW_LERP);
  let nextY = trainer.y + (targetY - trainer.y) * Math.min(1, dt * TRAINER_FOLLOW_LERP);
  nextX = clamp(nextX, player.radius, world.width - player.radius);
  nextY = clamp(nextY, player.radius, world.height - player.radius);

  if (!collidesHouseCircle(nextX, nextY, player.radius + 2)) {
    trainer.x = nextX;
    trainer.y = nextY;
    return;
  }

  for (let radius = TRAINER_FOLLOW_DISTANCE - 8; radius <= TRAINER_FOLLOW_DISTANCE + 22; radius += 10) {
    for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 8) {
      const candidateX = clamp(player.x + Math.cos(angle) * radius, player.radius, world.width - player.radius);
      const candidateY = clamp(player.y + Math.sin(angle) * radius, player.radius, world.height - player.radius);
      if (!collidesHouseCircle(candidateX, candidateY, player.radius + 2)) {
        trainer.x = candidateX;
        trainer.y = candidateY;
        return;
      }
    }
  }
}

function applyTruckPhysics(dt) {
  if (state.parkLocked) {
    truck.speed = 0;
    return;
  }

  const axis = getMoveAxis();
  const manualThrottle = clamp(-axis.y, -1, 1);
  const steer = clamp(axis.x, -1, 1);

  const onRoad = isPointOnRoad(truck.x, truck.y);
  const speedLimitMph = getSpeedLimitMphAtPoint(truck.x, truck.y);
  state.currentSpeedLimitMph = speedLimitMph;
  state.speedLimiterActive = false;
  const maxForward = onRoad ? 255 : 150;
  const maxReverse = onRoad ? 120 : 75;
  const acceleration = onRoad ? 300 : 220;
  const drag = onRoad ? 165 : 230;

  if (state.cruiseEnabled && manualThrottle < -0.08) {
    setCruiseEnabled(false);
  }

  const targetUnits = state.cruiseEnabled ? (state.targetDriveSpeedMph / 0.24) : 0;
  if (targetUnits > 0) {
    if (truck.speed < targetUnits) {
      truck.speed = Math.min(targetUnits, truck.speed + acceleration * dt);
    } else if (truck.speed > targetUnits) {
      truck.speed = Math.max(targetUnits, truck.speed - drag * 0.65 * dt);
    }
  } else if (truck.speed > 0) {
    truck.speed = Math.max(0, truck.speed - drag * dt);
  } else if (truck.speed < 0) {
    truck.speed = Math.min(0, truck.speed + drag * dt);
  }

  if (manualThrottle < -0.08) {
    truck.speed += acceleration * manualThrottle * dt;
  } else if (manualThrottle > 0.08) {
    truck.speed += acceleration * manualThrottle * dt;
  }

  truck.speed = clamp(truck.speed, -maxReverse, maxForward);

  const currentMph = Math.abs(truck.speed) * 0.24;
  const overspeedBy = currentMph - speedLimitMph;
  state.speedLimiterActive = overspeedBy > 0.8;
  if (state.speedLimiterActive) {
    const interval = overspeedBy >= 12 ? 0.42 : overspeedBy >= 7 ? 0.65 : 0.95;
    state.speedPenaltyAccumulator += dt;
    while (state.speedPenaltyAccumulator >= interval) {
      state.speedPenaltyAccumulator -= interval;
      const penaltyPoints = overspeedBy >= 12 ? 2 : 1;
      registerDeduction("speeding", penaltyPoints, `SPEEDING -${penaltyPoints}`);
      setSprayerFeedback(
        `Speeding citation: ${Math.round(currentMph)} in ${Math.round(speedLimitMph)}. -${penaltyPoints} point${penaltyPoints > 1 ? "s" : ""}.`,
        1.2
      );
    }
  } else {
    state.speedPenaltyAccumulator = Math.max(0, state.speedPenaltyAccumulator - dt * 0.8);
  }

  if (Math.abs(truck.speed) < 2 && manualThrottle === 0 && !state.cruiseEnabled) {
    truck.speed = 0;
  }

  const speedRatio = clamp(Math.abs(truck.speed) / 190, 0, 1);
  if (steer !== 0 && speedRatio > 0.02) {
    const steeringDirection = truck.speed >= 0 ? 1 : -1;
    truck.angle += steer * steeringDirection * (2.3 * speedRatio) * dt;
    truck.angle = wrapAngle(truck.angle);
  }

  const nx = truck.x + Math.cos(truck.angle) * truck.speed * dt;
  const ny = truck.y + Math.sin(truck.angle) * truck.speed * dt;

  let boundaryX = clamp(nx, 24, world.width - 24);
  let boundaryY = clamp(ny, 24, world.height - 24);

  if (state.roadLockEnabled) {
    const lockPoint = getRoadLockAssistPoint(boundaryX, boundaryY, truck.angle);
    if (lockPoint) {
      const snapStrength = clamp(0.34 + Math.abs(truck.speed) / 240, 0.34, 0.8);
      boundaryX = lerp(boundaryX, lockPoint.x, snapStrength);
      boundaryY = lerp(boundaryY, lockPoint.y, snapStrength);
      truck.angle = lerpAngle(truck.angle, lockPoint.angle, clamp(dt * 8.4, 0, 1));
    }
  }

  if (!collidesHouseCircle(boundaryX, boundaryY, 34)) {
    truck.x = boundaryX;
    truck.y = boundaryY;
  } else {
    truck.speed *= -0.2;
  }
}

function updateRouteProgress() {
  if (state.currentWaypoint >= route.length - 1) {
    return;
  }

  const next = route[state.currentWaypoint];
  if (distance(truck, next) < 74) {
    state.currentWaypoint += 1;
  }
}

function isTruckParkedCorrectly() {
  const centerX = parkingSpot.x + parkingSpot.w / 2;
  const centerY = parkingSpot.y + parkingSpot.h / 2;
  const withinX = Math.abs(truck.x - centerX) <= (parkingSpot.w / 2 - 8);
  const withinY = Math.abs(truck.y - centerY) <= (parkingSpot.h / 2 - 7);
  const headingAlignment = Math.abs(Math.cos(truck.angle)) > 0.84;
  const almostStopped = Math.abs(truck.speed) < 18;
  return withinX && withinY && headingAlignment && almostStopped;
}

function isTruckInsideParkingZone() {
  const centerX = parkingSpot.x + parkingSpot.w / 2;
  const centerY = parkingSpot.y + parkingSpot.h / 2;
  const withinX = Math.abs(truck.x - centerX) <= (parkingSpot.w / 2 - 4);
  const withinY = Math.abs(truck.y - centerY) <= (parkingSpot.h / 2 - 4);
  return withinX && withinY;
}

function isTruckInParkForPhoneOps() {
  const nearlyStopped = Math.abs(truck.speed) < 1.5;
  const parkedInDesignatedSpot = state.parkLocked || isTruckInsideParkingZone() || isTruckParkedCorrectly();
  return nearlyStopped && parkedInDesignatedSpot;
}

function canOperatePhoneApps() {
  return isTruckInParkForPhoneOps();
}

function ensurePhoneOpsAllowed(message = "Put the vehicle in park before using phone apps.") {
  if (canOperatePhoneApps()) {
    return true;
  }
  setSprayerFeedback(message, 1.15);
  return false;
}

function updateRoadLockButton() {
  if (!phoneRoadLockButton) {
    return;
  }
  phoneRoadLockButton.setAttribute("aria-pressed", state.roadLockEnabled ? "true" : "false");
  phoneRoadLockButton.textContent = state.roadLockEnabled ? "Road Lock: On" : "Road Lock: Off";
  phoneRoadLockButton.disabled = !state.inTruck;
}

function setRoadLockEnabled(enabled, options = {}) {
  const { silent = false } = options;
  const nextEnabled = Boolean(enabled);
  if (state.roadLockEnabled === nextEnabled) {
    updateRoadLockButton();
    return;
  }
  state.roadLockEnabled = nextEnabled;
  updateRoadLockButton();
  if (!silent) {
    setSprayerFeedback(
      nextEnabled
        ? "Road lock enabled. Truck will stay aligned to the road lane."
        : "Road lock disabled. Manual steering restored.",
      1.05
    );
  }
}

function setMissionBannerMinimized(minimized) {
  state.missionBannerMinimized = Boolean(minimized);
  if (missionCompleteCard) {
    missionCompleteCard.classList.toggle("is-minimized", state.missionBannerMinimized);
  }
  if (missionCompleteMinButton) {
    missionCompleteMinButton.setAttribute("aria-pressed", state.missionBannerMinimized ? "true" : "false");
    missionCompleteMinButton.textContent = state.missionBannerMinimized ? "Expand" : "Minimize";
  }
}

function lockTruckIntoParkingSpot() {
  const centerX = parkingSpot.x + parkingSpot.w / 2;
  const centerY = parkingSpot.y + parkingSpot.h / 2;
  truck.x = centerX;
  truck.y = centerY;
  truck.speed = 0;
  truck.angle = Math.cos(truck.angle) >= 0 ? 0 : Math.PI;
  state.parkLocked = true;
  state.parkedHold = Math.max(state.parkedHold, 0.16);
  setSprayerFeedback("Parking spot locked. Truck secured in place.", 1);
}

function tryQuickParkAtHouse() {
  if (!state.inTruck || state.mapOpen || state.dayComplete) {
    return false;
  }
  if (!houseParkingSpots.length) {
    return false;
  }

  let bestSpot = houseParkingSpots[0];
  let bestDistance = Infinity;
  houseParkingSpots.forEach((spot) => {
    const center = { x: spot.x + spot.w / 2, y: spot.y + spot.h / 2 };
    const dist = distance(truck, center);
    if (dist < bestDistance) {
      bestDistance = dist;
      bestSpot = spot;
    }
  });

  const centerX = bestSpot.x + bestSpot.w / 2;
  const centerY = bestSpot.y + bestSpot.h / 2;
  truck.x = centerX;
  truck.y = centerY;
  truck.speed = 0;
  truck.angle = Math.cos(truck.angle) >= 0 ? 0 : Math.PI;
  state.parkLocked = false;
  state.parkedHold = 0;
  setCruiseEnabled(false);

  const house = houses[bestSpot.houseIndex];
  const name = house ? getHouseDisplayName(house, bestSpot.houseIndex) : "house";
  setSprayerFeedback(`Quick parked in front of ${name}.`, 1.1);
  return true;
}

function updateMission(dt) {
  if (state.missionComplete) {
    return;
  }

  if (state.phase === "drive_to_stop" && state.inTruck) {
    updateRouteProgress();

    if (!state.parkLocked && isTruckInsideParkingZone()) {
      lockTruckIntoParkingSpot();
    }

    if (state.parkLocked || isTruckParkedCorrectly()) {
      state.parkedHold += dt;
      const holdSeconds = state.parkLocked ? 0.28 : 1.2;
      if (state.parkedHold >= holdSeconds) {
        if (state.rain.active && state.rain.context === "driving") {
          if (state.rain.stage === "drive_to_spot") {
            state.rain.stage = "drive_text_manager";
            truck.speed = 0;
            setSprayerFeedback("Rain delay: parked correctly. Press E to text your manager.", 1.35);
          }
        } else {
          beginServicePhase();
        }
      }
    } else {
      state.parkedHold = 0;
    }
    return;
  }

  if (state.phase === "service_briefing") {
    state.serviceBriefTimer += dt;
    if (state.serviceBriefTimer >= 0.55) {
      state.phase = "walk_to_door";
    }
    return;
  }

  if (state.phase === "walk_to_door") {
    if (pointInRect(player.x, player.y, targetDoorZone)) {
      startDoorCheckIn();
    }
    return;
  }

  if (state.phase === "conversation") {
    return;
  }
}

function updateSideProfilePanel() {
  if (!sideProfilePanel || !sideProfileTitle || !sideProfileNote || !coverageLine) {
    return;
  }

  if (state.phase !== "working" && state.phase !== "webster_working") {
    sideProfilePanel.hidden = true;
    return;
  }

  sideProfilePanel.hidden = state.mapOpen || state.firstPerson.active;
  const side = state.activeHouseSide;
  const concentrationText = `${Math.round(state.sprayerConcentration * 100)}% (${getSprayerConcentrationLabel()})`;
  const required = getRequiredCoveragePercent();
  const openingRequired = getRequiredOpeningCoveragePercent();
  const totalCoverage = getServiceCoveragePercent();
  const windowTrim = getOpeningCoverage("window");
  const doorTrim = getOpeningCoverage("door");
  const sideText = side ? SIDE_LABELS[side] : "No Side In Range";
  const sideCoverage = side ? getCoverageForSide(side) : 0;
  const sideOpenings = side ? getSideOpeningCoverage(side) : null;
  const sideOpeningsText = sideOpenings
    ? `W1:${sideOpenings.windowLeft}% W2:${sideOpenings.windowRight}% D:${isDoorRequiredForSide(side) ? `${sideOpenings.door}%` : "N/A"}`
    : "";

  sideProfileTitle.textContent = sideText;
  if (state.phase === "webster_working") {
    sideProfileNote.textContent = `Webster phase: enter first-person on ${SIDE_LABELS[side] || "a side"} and click each web to knock it down.`;
  } else if (state.serviceComplete) {
    sideProfileNote.textContent = `Service complete. Side passes and opening trim targets reached.`;
  } else if (state.nearbyNoSprayZoneType) {
    sideProfileNote.textContent = state.nearbyNoSprayZoneType === "flowers"
      ? "Protected flowers nearby: avoid spraying directly over them."
      : state.nearbyNoSprayZoneType === "toys"
        ? "Protected toys nearby: press E to move them before spraying."
        : "Protected vegetable bed nearby: avoid spraying directly over it.";
  } else if (!side) {
    sideProfileNote.textContent = "Walk up to a wall to treat base/eave pass, then finish window/door trim.";
  } else if (areSideOpeningsComplete(side, openingRequired)) {
    sideProfileNote.textContent = `${SIDE_LABELS[side]} done: trim boxes cleared. Move to the next side.`;
  } else if (state.sprayerConcentration < 0.3) {
    sideProfileNote.textContent = `Spray is too wide on ${SIDE_LABELS[side]}; coverage is light.`;
  } else if (state.sprayerConcentration > 0.82) {
    sideProfileNote.textContent = `Spray is too concentrated on ${SIDE_LABELS[side]}; bounce-back risk is high.`;
  } else {
    sideProfileNote.textContent = state.serviceType === "Premier Home Perimeter+"
      ? `${SIDE_LABELS[side]} profile: treat under eaves, then windows/doors, then foundation line.`
      : `${SIDE_LABELS[side]} profile visible. Hold Space to apply even treatment.`;
  }

  coverageLine.textContent = state.phase === "webster_working"
    ? `Webs Remaining: ${getRemainingWebCount()}`
    : side
      ? isPremierBarrierService()
        ? `Coverage ${sideCoverage}% | Openings ${sideOpeningsText} | Score ${Math.round(state.serviceScore)}/100`
        : `Coverage ${sideCoverage}% | Openings ${sideOpeningsText} | Conc ${concentrationText}`
      : isPremierBarrierService()
        ? `Total ${totalCoverage}% | Openings W:${windowTrim}/${openingRequired} D:${doorTrim}/${openingRequired} | Score ${Math.round(state.serviceScore)}/100`
        : `Total ${totalCoverage}% | Openings W:${windowTrim}/${openingRequired} D:${doorTrim}/${openingRequired} | Conc ${concentrationText}`;
}

function updateSprayerSystem(dt) {
  const rainServiceInterruption = state.rain.active
    && state.rain.context === "service"
    && (state.rain.stage === "service_talk_customer" || state.rain.stage === "service_text_manager");
  if (rainServiceInterruption) {
    state.sprayActive = false;
    state.activeHouseSide = "";
    state.nearbyNoSprayZoneType = "";
    return;
  }

  if (state.phase !== "webster_working" && state.phase !== "working") {
    state.sprayActive = false;
    state.activeHouseSide = "";
    state.nearbyNoSprayZoneType = "";
    return;
  }

  if (state.sprayerFeedbackTimer > 0) {
    state.sprayerFeedbackTimer = Math.max(0, state.sprayerFeedbackTimer - dt);
    if (state.sprayerFeedbackTimer === 0) {
      state.sprayerFeedback = "";
    }
  }
  if (state.penaltyCooldown > 0) {
    state.penaltyCooldown = Math.max(0, state.penaltyCooldown - dt);
  }
  if (state.sprayTrailStampTimer > 0) {
    state.sprayTrailStampTimer = Math.max(0, state.sprayTrailStampTimer - dt);
  }

  const side = state.firstPerson.active ? state.firstPerson.side : getActiveTargetHouseSide();
  const hoseAnchor = getTruckRightDoorPoint();
  const hoseDistance = distance(player, hoseAnchor);
  const hoseConnected = hoseDistance <= state.hoseMaxLength;
  const noSprayZone = getNearbyNoSprayZone(player.x, player.y);
  state.nearbyNoSprayZoneType = noSprayZone ? noSprayZone.type : "";
  state.activeHouseSide = side;
  const isWebsterPhase = state.phase === "webster_working";
  const firstPersonReady = state.firstPerson.active && Boolean(side);
  const firstPersonLayout = firstPersonReady ? getFirstPersonViewLayout(side) : null;
  const sprayPoint = firstPersonLayout ? getFirstPersonSprayPoint(firstPersonLayout) : null;
  const sprayRadius = getCurrentSprayBrushRadius();
  const sprayerToolReady = state.vehicleDoors.right && state.hasPowerSprayer;
  if (!isWebsterPhase && state.phase === "working" && !sprayerToolReady) {
    state.sprayActive = false;
    if (input.spray && state.sprayerFeedbackTimer <= 0) {
      if (!state.vehicleDoors.right) {
        setSprayerFeedback("Open the right-side sprayer door first (press E at the truck).", 1.2);
      } else {
        setSprayerFeedback("Press E at the right-side door to grab the power sprayer first.", 1.2);
      }
    }
    return;
  }
  state.sprayActive = Boolean(
    !isWebsterPhase
    && !state.mapOpen
    && firstPersonReady
    && Boolean(sprayPoint)
    && input.spray
    && hoseConnected
    && !state.serviceComplete
  );

  if (isWebsterPhase) {
    state.sprayActive = false;
    if (!state.hasWebster) {
      state.phase = "webster_pickup";
      return;
    }
    if (!firstPersonReady && state.sprayerFeedbackTimer <= 0) {
      setSprayerFeedback("Walk up to a house side, then click each web in first-person to remove it.", 1.1);
    }

    const remaining = getRemainingWebCount();
    if (remaining <= 0) {
      state.phase = "working";
      state.hasWebster = false;
      setSprayerFeedback("All webs cleared. Start exterior spray treatment.", 1.35);
    }
    return;
  }

  if (input.spray && !firstPersonReady && state.sprayerFeedbackTimer <= 0) {
    setSprayerFeedback("Spraying applies in first-person view near a house side.", 1.05);
  }
  if (input.spray && firstPersonReady && !hoseConnected && state.sprayerFeedbackTimer <= 0) {
    setSprayerFeedback("Hose reached max length. Move closer to the truck reel.", 1.2);
  }
  if (input.spray && firstPersonReady && noSprayZone && state.sprayerFeedbackTimer <= 0) {
    setSprayerFeedback(
      `Protected ${getNoSprayZoneLabel(noSprayZone.type, noSprayZone.produceType, noSprayZone.toyGroup)} nearby. Don't spray directly over them.`,
      1.25
    );
  }

  if (state.sprayActive) {
    const concentration = state.sprayerConcentration;
    const idealDelta = Math.abs(concentration - SPRAYER_IDEAL_CONCENTRATION);
    let efficiency = clamp(1 - idealDelta * 1.75, 0.22, 1);
    if (firstPersonLayout && sprayPoint && side && state.sprayTrailStampTimer <= 0) {
      addFirstPersonSprayTrailStamp(side, firstPersonLayout, sprayPoint, sprayRadius, concentration);
      state.sprayTrailStampTimer = SPRAY_TRAIL_STAMP_INTERVAL;
    }
    const hitProtected = firstPersonLayout
      ? firstPersonLayout.sideZones.find((item) => distance(sprayPoint, item.center) <= (sprayRadius + item.hitRadius))
      : null;

    if (hitProtected && state.penaltyCooldown <= 0) {
      state.serviceScore = Math.max(0, state.serviceScore - 6);
      registerDeduction("protected", 6, "PROTECTED ITEM -6");
      setSprayerFeedback(
        `Penalty: sprayed protected ${getNoSprayZoneLabel(hitProtected.zone.type, hitProtected.zone.produceType, hitProtected.zone.toyGroup)}.`,
        1.2
      );
      state.penaltyCooldown = 0.45;
    }

    const hitWindowDirect = firstPersonLayout
      ? firstPersonLayout.windowPenaltyRects.some((rect) => pointInRect(sprayPoint.x, sprayPoint.y, rect))
      : false;
    const hitDoorDirect = Boolean(firstPersonLayout && firstPersonLayout.doorPenaltyRect && pointInRect(sprayPoint.x, sprayPoint.y, firstPersonLayout.doorPenaltyRect));

    if (state.penaltyCooldown <= 0 && (hitWindowDirect || hitDoorDirect)) {
      if (hitWindowDirect) {
        state.serviceScore = Math.max(0, state.serviceScore - 7);
        state.windowDirectHits += 1;
        registerDeduction("window", 7, "WINDOW HIT -7");
        setSprayerFeedback("Point deduction: direct spray on window glass.", 1.1);
      } else if (hitDoorDirect) {
        state.serviceScore = Math.max(0, state.serviceScore - 9);
        state.doorDirectHits += 1;
        registerDeduction("door", 9, "DOOR HIT -9");
        setSprayerFeedback("Point deduction: direct spray on door.", 1.15);
      }
      state.penaltyCooldown = 0.45;
    } else if (firstPersonLayout) {
      const sidePerimeter = getSideOpeningPerimeter(side);
      if (sidePerimeter) {
        paintPerimeterBucket(sidePerimeter.windowLeft, firstPersonLayout.windowTargetRects[0], sprayPoint, sprayRadius, dt, efficiency);
        paintPerimeterBucket(sidePerimeter.windowRight, firstPersonLayout.windowTargetRects[1], sprayPoint, sprayRadius, dt, efficiency);
        if (firstPersonLayout.doorTargetRect) {
          paintPerimeterBucket(sidePerimeter.door, firstPersonLayout.doorTargetRect, sprayPoint, sprayRadius, dt, efficiency);
        }
      }
      syncOpeningCoverageFromPerimeter();
      markSideCompleteWhenBoxesCleared(side);

      const touchingWindowTrim = firstPersonLayout.windowTargetRects.some((rect) => {
        const expanded = {
          x: rect.x - sprayRadius,
          y: rect.y - sprayRadius,
          w: rect.w + sprayRadius * 2,
          h: rect.h + sprayRadius * 2
        };
        return pointInRect(sprayPoint.x, sprayPoint.y, expanded);
      });
      const touchingDoorTrim = Boolean(firstPersonLayout.doorTargetRect && pointInRect(
        sprayPoint.x,
        sprayPoint.y,
        {
          x: firstPersonLayout.doorTargetRect.x - sprayRadius,
          y: firstPersonLayout.doorTargetRect.y - sprayRadius,
          w: firstPersonLayout.doorTargetRect.w + sprayRadius * 2,
          h: firstPersonLayout.doorTargetRect.h + sprayRadius * 2
        }
      ));
      if ((touchingWindowTrim || touchingDoorTrim) && Math.random() < dt * 1.1) {
        setSprayerFeedback(
          touchingDoorTrim ? "Painting around door trim." : "Painting around window trim.",
          0.5
        );
      }
    }

    if (concentration < 0.3) {
      efficiency *= 0.52;
      if (Math.random() < dt * 1.4) {
        setSprayerFeedback("Spray pattern is too wide. Coverage is thin.", 0.9);
      }
    } else if (concentration > 0.82) {
      efficiency *= 0.43;
      if (Math.random() < dt * 2.2) {
        state.sprayBounceHits += 1;
        setSprayerFeedback("Spray bounced off siding and hit nearby items.", 1.15);
      }
    }

    const gain = dt * 24 * efficiency;
    state.serviceCoverage[side] = clamp(state.serviceCoverage[side] + gain, 0, 100);
  }

  if (!state.serviceComplete) {
    const required = getRequiredCoveragePercent();
    const sidesComplete = HOUSE_SIDES.every((wall) => getCoverageForSide(wall) >= required);
    const complete = sidesComplete;
    if (complete) {
      state.serviceComplete = true;
      state.sprayerNeedsRollup = true;
      state.serviceCompletionNote = getServiceCompletionNote();
      setSprayerFeedback("Exterior treatment complete. Return to the truck and press E to roll up power sprayer.", 1.9);
      state.sprayActive = false;
      input.spray = false;
    } else if (!sidesComplete && state.sprayerFeedbackTimer <= 0) {
      const incompleteSide = HOUSE_SIDES.find((wall) => getCoverageForSide(wall) < required);
      if (incompleteSide) {
        setSprayerFeedback(`Finish every window/door trim box on ${SIDE_LABELS[incompleteSide]} to mark that side done.`, 1.2);
      }
    }
  }

}

function updateCamera(dt) {
  const target = state.inTruck ? truck : player;
  const targetX = clamp(target.x - view.width / 2, 0, world.width - view.width);
  const targetY = clamp(target.y - view.height / 2, 0, world.height - view.height);

  camera.x += (targetX - camera.x) * Math.min(1, dt * 6);
  camera.y += (targetY - camera.y) * Math.min(1, dt * 6);
}

function isDrivingForwardViewActive() {
  return state.inTruck && !state.mapOpen;
}

function getDrivingCameraRotation() {
  return -truck.angle - Math.PI / 2;
}

function applyWorldCameraTransform() {
  if (!isDrivingForwardViewActive()) {
    ctx.translate(-camera.x, -camera.y);
    return;
  }

  const anchorX = truck.x;
  const anchorY = truck.y;
  ctx.translate(view.width / 2, view.height / 2);
  ctx.rotate(getDrivingCameraRotation());
  ctx.translate(-anchorX, -anchorY);
}

function updateHud() {
  const spotCenter = {
    x: parkingSpot.x + parkingSpot.w / 2,
    y: parkingSpot.y + parkingSpot.h / 2
  };
  const distanceFeet = Math.max(0, Math.round(distance(truck, spotCenter) * 1.9));
  const doorCenter = {
    x: targetDoorZone.x + targetDoorZone.w / 2,
    y: targetDoorZone.y + targetDoorZone.h / 2
  };
  const doorDistanceFeet = Math.max(0, Math.round(distance(player, doorCenter) * 1.9));
  const currentSpeedMph = Math.round(Math.abs(truck.speed) * 0.24);
  const limitMph = Math.round(state.currentSpeedLimitMph || getSpeedLimitMphAtPoint(truck.x, truck.y));
  const cruiseStatus = state.cruiseEnabled ? "Cruise ON" : "Cruise OFF";
  const stopLabel = `Stop ${state.stopNumber}/${TOTAL_STOPS_PER_DAY}`;
  const currentOrder = getCurrentOrder();
  const stopAddress = currentOrder ? currentOrder.address : "1428 Cedar Lane";

  updateFieldManagementUi();
  updatePhoneAppUi();

  if (dashStop) {
    dashStop.textContent = `${stopLabel}: ${stopAddress}`;
  }

  if (phoneSpeedLimitLine) {
    phoneSpeedLimitLine.textContent = `Speed Limit: ${limitMph} mph`;
  }
  updateRoadLockButton();
  let phoneContextActive = false;
  if (phoneServiceTitle && phoneServiceNote) {
    if (state.rain.active) {
      phoneContextActive = true;
      phoneServiceTitle.textContent = "Weather Alert: Rain";
      if (state.rain.stage === "drive_to_spot") {
        phoneServiceNote.textContent = `Rain started while driving. Park at this stop first (${distanceFeet} ft), then text manager.`;
      } else if (state.rain.stage === "drive_text_manager") {
        phoneServiceNote.textContent = "Truck is parked. Press E to text manager: rain delay and reschedule.";
      } else if (state.rain.stage === "service_talk_customer") {
        phoneServiceNote.textContent = "Rain started on service. Go to front door and tell customer you must reschedule.";
      } else if (state.rain.stage === "service_text_manager") {
        phoneServiceNote.textContent = "Customer notified. Press E to text manager and log the reschedule.";
      } else {
        phoneServiceNote.textContent = "Rain delay complete. Service rescheduled with manager.";
      }
    } else {
      const inDrivingMode = state.phase === "drive_to_stop" || (state.inTruck && !state.missionComplete);
      const inServiceMode = state.phase === "service_briefing"
        || state.phase === "walk_to_door"
        || state.phase === "conversation"
        || state.phase === "webster_pickup"
        || state.phase === "webster_working"
        || state.phase === "working";
      if (inDrivingMode) {
        phoneContextActive = true;
        phoneServiceTitle.textContent = `GPS: ${stopLabel} - ${stopAddress}`;
        phoneServiceNote.textContent = state.inTruck
          ? `Route active. ${distanceFeet} ft to destination. Target speed: ${Math.round(state.targetDriveSpeedMph)} mph (${cruiseStatus}).`
          : "You are outside the truck. Move to it and press E to continue driving.";
      } else if (inServiceMode) {
        phoneContextActive = true;
        if (!String(phoneServiceTitle.textContent || "").trim() || String(phoneServiceTitle.textContent || "").startsWith("GPS:")) {
          phoneServiceTitle.textContent = `Service: ${state.serviceType || "--"}`;
        }
        if (state.phase === "webster_pickup") {
          phoneServiceNote.textContent = state.vehicleDoors.rear
            ? "Step 1: Rear doors open. Press E to grab webster, then clear all exterior webs."
            : "Step 1: Go to back of van and open rear doors, then grab webster.";
        } else if (state.phase === "conversation") {
          phoneServiceNote.textContent = state.customerAiMode
            ? "Door check-in: send a typed message in the customer dialog panel."
            : "Door check-in: click Next through the customer conversation panel.";
        } else if (state.phase === "webster_working") {
          phoneServiceNote.textContent = `Web knockdown: walk to each side, enter first-person, and click each web. ${getRemainingWebCount()} left.`;
        } else if (state.phase === "working" && state.serviceComplete && state.sprayerNeedsRollup) {
          phoneServiceNote.textContent = "Final step before closeout: walk to the truck and press E to roll up power sprayer.";
        } else if (state.phase === "working" && !state.serviceComplete && !state.sprayerFeedback) {
          if (!state.vehicleDoors.right) {
            phoneServiceNote.textContent = "Before spraying, open the right-side truck door for the power sprayer.";
          } else if (!state.hasPowerSprayer) {
            phoneServiceNote.textContent = "Right-side door is open. Press E there to grab the power sprayer.";
          } else if (!state.firstPerson.active) {
            phoneServiceNote.textContent = "Walk up to a house side to enter first-person before spraying.";
          } else {
            phoneServiceNote.textContent = `Paint from side view: each side requires both windows (and door where present). Total openings W:${getOpeningCoverage("window")}% D:${getOpeningCoverage("door")}%.`;
          }
        }
        if (!state.fieldOrder.timedIn) {
          phoneServiceNote.textContent = `Field Management: select ${currentOrder ? currentOrder.customer : "assigned customer"} and Time In before door check-in.`;
        } else if (state.serviceComplete && state.sprayerNeedsRollup) {
          phoneServiceNote.textContent = "Spray complete. Roll up the power sprayer at the truck, then finish closeout in Field Management.";
        } else if (state.fieldOrder.pendingCloseout) {
          phoneServiceNote.textContent = "Order complete. Add tech comment in Field Management, then Time Out to close this stop.";
        }
        if (!canOperatePhoneApps()) {
          phoneServiceNote.textContent = "Phone apps are locked while vehicle is not in park. GPS stays available.";
        }
      }
    }
  }
  if (!phoneContextActive && state.phoneOpen) {
    setPhoneOpen(false);
  }
  if (phoneToggleButton) {
    phoneToggleButton.hidden = !phoneContextActive;
  }
  if (phonePanel) {
    phonePanel.hidden = !(phoneContextActive && state.phoneOpen);
  }
  if (phoneDriveSpeedPanel) {
    phoneDriveSpeedPanel.hidden = !state.inTruck;
  }
  if (phoneSpeedDownButton) {
    phoneSpeedDownButton.disabled = !state.inTruck;
  }
  if (phoneSpeedUpButton) {
    phoneSpeedUpButton.disabled = !state.inTruck;
  }
  if (phoneDriveSpeedSlider) {
    phoneDriveSpeedSlider.disabled = !state.inTruck;
  }
  if (phoneRoadLockButton) {
    phoneRoadLockButton.disabled = !state.inTruck;
  }
  if ((!phoneContextActive || !state.phoneOpen) && state.phoneControlsOpen) {
    setPhoneControlsOpen(false);
  }

  if (state.mapOpen) {
    statusLine.textContent = "Area map open. Review the full neighborhood and every house.";
    hintLine.textContent = "Press M to close map and continue the job.";
  } else if (state.phase === "day_complete") {
    const finalPercent = Math.round((state.dayPointsEarned / state.dayTotalPoints) * 100);
    statusLine.textContent = `Shift complete. Final day score: ${finalPercent}% correct across ${TOTAL_STOPS_PER_DAY} stops.`;
    hintLine.textContent = "Review the end-of-day ding breakdown on the report card.";
  } else if (state.rain.active) {
    if (state.rain.stage === "drive_to_spot") {
      statusLine.textContent = `Rain started while driving. Park at ${stopAddress} (${distanceFeet} ft).`;
      hintLine.textContent = "Pull into the glowing parking spot first, then text your manager.";
    } else if (state.rain.stage === "drive_text_manager") {
      statusLine.textContent = "Truck parked at customer stop. Rain delay requires a manager text.";
      hintLine.textContent = "Press E to text manager from your phone.";
    } else if (state.rain.stage === "service_talk_customer") {
      statusLine.textContent = `Rain started during service. Walk to front door (${doorDistanceFeet} ft) and reschedule.`;
      hintLine.textContent = "Press E at the door to tell the customer you must reschedule.";
    } else if (state.rain.stage === "service_text_manager") {
      statusLine.textContent = "Customer notified. Next step: text your manager to log the rain reschedule.";
      hintLine.textContent = "Press E to send manager update.";
    } else {
      statusLine.textContent = "Rain delay complete. Stop has been rescheduled.";
      hintLine.textContent = "Manager notified and customer updated.";
    }
  } else if (state.phase === "walk_to_truck") {
    const driverDoor = getTruckDriverDoorPoint();
    const driverDoorDistance = Math.max(0, Math.round(distance(player, driverDoor) * 1.9));
    const closeToDriverDoor = distance(player, driverDoor) <= 46;
    statusLine.textContent = closeToDriverDoor
      ? `${stopLabel}: Driver seat at left front. Press E to ${state.vehicleDoors.driver ? "get in" : "open driver door"}.`
      : `${stopLabel}: Walk to the left-front driver door (${driverDoorDistance} ft).`;
    hintLine.textContent = "WASD/Arrows to move on foot. Press E at the left-front door.";
  } else if (state.phase === "drive_to_stop") {
    if (!state.inTruck) {
      const driverDoor = getTruckDriverDoorPoint();
      const driverDoorDistance = Math.max(0, Math.round(distance(player, driverDoor) * 1.9));
      statusLine.textContent = `You are outside the truck. Driver door is ${driverDoorDistance} ft away (left-front).`;
      hintLine.textContent = "Press E at the left-front door to open it, then E again to enter.";
    } else {
      const roadLockStatus = state.roadLockEnabled ? "Road Lock ON" : "Road Lock OFF";
      statusLine.textContent = `${stopLabel}: GPS active to ${stopAddress} (${distanceFeet} ft). Limit ${limitMph} mph, target ${Math.round(state.targetDriveSpeedMph)} mph (${cruiseStatus}, ${roadLockStatus}).`;
      if (state.speedLimiterActive) {
        hintLine.textContent = `Over the posted limit. You can continue, but points are docked while speeding.`;
      } else if (!state.cruiseEnabled) {
        hintLine.textContent = "Cruise is off. Hold W/Up to drive manually, or set target speed from phone Controls. Press L to toggle Road Lock.";
      } else if (distanceFeet < 170) {
        hintLine.textContent = "Approaching stop: line up with the glowing parking rectangle. Press E to exit when stopped. Press P to quick-park nearest house.";
      } else if (state.currentWaypoint < route.length - 1) {
        hintLine.textContent = "Stay on the blue route line. Adjust target mph in the phone or with [ and ]. Press L for Road Lock, P to quick-park nearest house.";
      } else if (state.parkedHold > 0) {
        hintLine.textContent = "Hold still for a moment to confirm a proper park.";
      } else {
        hintLine.textContent = "Park in the glowing rectangle on the road in front of the house, or press P to quick-park nearest house.";
      }
    }
  } else if (state.phase === "service_briefing") {
    statusLine.textContent = `Parked correctly. Phone loaded service: ${state.serviceType}.`;
    hintLine.textContent = state.fieldOrder.timedIn
      ? "Get out and walk to the front door to check in."
      : "Before door check-in, use Field Management to Time In to this order.";
  } else if (state.phase === "walk_to_door") {
    statusLine.textContent = `Service: ${state.serviceType}. Walk to front door (${doorDistanceFeet} ft).`;
    hintLine.textContent = state.fieldOrder.timedIn
      ? "Check in with the customer before starting treatment."
      : "Time In is required before knocking. Park and use Field Management first.";
  } else if (state.phase === "conversation") {
    if (state.customerAiMode) {
      statusLine.textContent = "Door check-in (AI typing): send a message to the customer.";
      hintLine.textContent = state.customerDialog.aiReadyToComplete
        ? "Click Complete Check-In in the dialog panel to continue."
        : "Type your customer message and click Send.";
    } else {
      statusLine.textContent = "Door check-in: click through the conversation.";
      hintLine.textContent = "Use the Next button in the dialog panel to continue.";
    }
  } else if (state.phase === "webster_pickup") {
    const rearDoor = getTruckRearDoorPoint();
    const rear = getTruckWebsterPoint();
    const rearDoorDistance = Math.max(0, Math.round(distance(player, rearDoor) * 1.9));
    const rearDistance = Math.max(0, Math.round(distance(player, rear) * 1.9));
    if (!state.fieldOrder.timedIn) {
      statusLine.textContent = "Field Management required before service tools.";
      hintLine.textContent = `On your phone, select ${currentOrder ? currentOrder.customer : "the assigned customer"} and tap Time In.`;
    } else if (!state.vehicleDoors.rear) {
      statusLine.textContent = `Step 1: Open rear doors for the webster (${rearDoorDistance} ft).`;
      hintLine.textContent = "Go to the back doors and press E to open them.";
    } else {
      statusLine.textContent = `Step 1: Grab the webster from the rear compartment (${rearDistance} ft).`;
      hintLine.textContent = "Press E at the rear to grab the webster.";
    }
  } else if (state.phase === "webster_working") {
    const remainingWebs = getRemainingWebCount();
    statusLine.textContent = `Step 1: Knock down webs. ${remainingWebs} webs remaining.`;
    hintLine.textContent = state.sprayerFeedback
      ? state.sprayerFeedback
      : "Walk up to each side, enter first-person, and click webs to clear them.";
  } else if (state.phase === "working") {
    const coverage = getServiceCoveragePercent();
    const required = getRequiredCoveragePercent();
    const openingRequired = getRequiredOpeningCoveragePercent();
    const windowTrim = getOpeningCoverage("window");
    const doorTrim = getOpeningCoverage("door");
    const hoseDistance = Math.round(distance(player, truck));
    const hoseConnected = hoseDistance <= state.hoseMaxLength;
    statusLine.textContent = state.serviceComplete
      ? state.sprayerNeedsRollup
        ? `Service complete: ${state.serviceType}. Roll up power sprayer at truck.`
        : `Service complete: ${state.serviceType}. Close out the stop in Field Management.`
      : isPremierBarrierService()
        ? `${state.serviceType}: ${coverage}% side avg, W:${windowTrim}% D:${doorTrim}%. Score ${Math.round(state.serviceScore)}/100.`
        : `${state.serviceType}: ${coverage}% side avg, W:${windowTrim}% D:${doorTrim}%.`;

    if (state.serviceComplete && state.sprayerNeedsRollup) {
      const truckDistance = Math.max(0, Math.round(distance(player, truck) * 1.9));
      hintLine.textContent = `Final tool step: walk to the truck (${truckDistance} ft) and press E to roll up power sprayer.`;
    } else if (state.serviceComplete && state.fieldOrder.pendingCloseout) {
      hintLine.textContent = "Phone workflow: add tech comment in Field Management and tap Time Out.";
    } else if (state.sprayerFeedback) {
      hintLine.textContent = state.sprayerFeedback;
    } else if (!state.vehicleDoors.right) {
      const rightDoor = getTruckRightDoorPoint();
      const rightDoorDistance = Math.max(0, Math.round(distance(player, rightDoor) * 1.9));
      hintLine.textContent = `Open the right-side sprayer door first (${rightDoorDistance} ft). Press E at the right side of truck.`;
    } else if (!state.hasPowerSprayer) {
      const rightDoor = getTruckRightDoorPoint();
      const rightDoorDistance = Math.max(0, Math.round(distance(player, rightDoor) * 1.9));
      hintLine.textContent = `Grab the power sprayer at the right-side door (${rightDoorDistance} ft). Press E to take it.`;
    } else if (!state.firstPerson.active) {
      hintLine.textContent = "Walk up to a house side to enter first-person before spraying.";
    } else if (state.nearbyNoSprayZoneType) {
      hintLine.textContent = state.nearbyNoSprayZoneType === "flowers"
        ? "Protected flowers nearby: do not spray directly over them."
        : state.nearbyNoSprayZoneType === "toys"
          ? "Protected toys nearby: press E to move toys, then spray."
          : "Protected vegetable beds nearby: do not spray directly over them.";
    } else if (!hoseConnected) {
      hintLine.textContent = "Hose is stretched too far from the truck reel. Move closer.";
    } else {
      hintLine.textContent = `Paint each side in first-person and clear every window/door trim box to complete that side. Spray radius ${Math.round(getCurrentSprayBrushRadius())} px at ${Math.round(state.sprayerConcentration * 100)}% ${getSprayerConcentrationLabel()}.`;
    }
  }

  if (speedValue) {
    speedValue.textContent = `${currentSpeedMph} mph`;
  }
  if (speedLimitValue) {
    speedLimitValue.textContent = `${limitMph} mph`;
  }
  if (distanceValue) {
    distanceValue.textContent = `${distanceFeet} ft`;
  }
}

function drawGround() {
  ctx.fillStyle = "#bcd89a";
  ctx.fillRect(0, 0, world.width, world.height);

  ctx.strokeStyle = "rgba(62, 113, 61, 0.2)";
  ctx.lineWidth = 1;

  for (let x = 0; x <= world.width; x += 80) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, world.height);
    ctx.stroke();
  }

  for (let y = 0; y <= world.height; y += 80) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(world.width, y);
    ctx.stroke();
  }
}

function drawRoad(road) {
  const isResidential = road.kind === "residential";
  const markingStyle = road.marking || (isResidential ? "dots" : "dashes");
  const roadGrad = road.axis === "h"
    ? ctx.createLinearGradient(road.x, road.y, road.x, road.y + road.h)
    : ctx.createLinearGradient(road.x, road.y, road.x + road.w, road.y);

  if (isResidential) {
    roadGrad.addColorStop(0, "#565f67");
    roadGrad.addColorStop(0.5, "#4f5861");
    roadGrad.addColorStop(1, "#48525a");
  } else {
    roadGrad.addColorStop(0, "#3f474e");
    roadGrad.addColorStop(0.5, "#384047");
    roadGrad.addColorStop(1, "#313940");
  }

  ctx.fillStyle = roadGrad;
  ctx.fillRect(road.x, road.y, road.w, road.h);

  ctx.strokeStyle = isResidential ? "#646f79" : "#566068";
  ctx.lineWidth = isResidential ? 1.4 : 1.8;
  ctx.strokeRect(road.x, road.y, road.w, road.h);

  const edgeInset = isResidential ? 3 : 10;
  ctx.strokeStyle = isResidential ? "rgba(208, 217, 226, 0.42)" : "rgba(236, 243, 250, 0.78)";
  ctx.lineWidth = isResidential ? 1 : 2;
  if (road.axis === "h") {
    ctx.beginPath();
    ctx.moveTo(road.x, road.y + edgeInset);
    ctx.lineTo(road.x + road.w, road.y + edgeInset);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(road.x, road.y + road.h - edgeInset);
    ctx.lineTo(road.x + road.w, road.y + road.h - edgeInset);
    ctx.stroke();
  } else {
    ctx.beginPath();
    ctx.moveTo(road.x + edgeInset, road.y);
    ctx.lineTo(road.x + edgeInset, road.y + road.h);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(road.x + road.w - edgeInset, road.y);
    ctx.lineTo(road.x + road.w - edgeInset, road.y + road.h);
    ctx.stroke();
  }

  ctx.strokeStyle = markingStyle === "dots"
    ? "rgba(240, 247, 255, 0.9)"
    : "rgba(255, 226, 140, 0.88)";
  ctx.lineWidth = markingStyle === "dots" ? 2 : 3;
  ctx.setLineDash(markingStyle === "dots" ? [1.5, 11] : [18, 14]);
  ctx.lineCap = markingStyle === "dots" ? "round" : "butt";

  if (road.axis === "h") {
    const y = road.y + road.h / 2;
    ctx.beginPath();
    ctx.moveTo(road.x, y);
    ctx.lineTo(road.x + road.w, y);
    ctx.stroke();
  } else {
    const x = road.x + road.w / 2;
    ctx.beginPath();
    ctx.moveTo(x, road.y);
    ctx.lineTo(x, road.y + road.h);
    ctx.stroke();
  }

  ctx.setLineDash([]);
  ctx.lineCap = "butt";
}

function drawSpeedLimitSigns() {
  speedLimitSigns.forEach((sign) => {
    const postLength = 11;
    const signWidth = 22;
    const signHeight = 17;

    ctx.save();
    ctx.translate(sign.x, sign.y);

    ctx.strokeStyle = "#60666c";
    ctx.lineWidth = 2;
    if (sign.side === "top") {
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, postLength);
      ctx.stroke();
    } else if (sign.side === "bottom") {
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, -postLength);
      ctx.stroke();
    } else if (sign.side === "left") {
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(postLength, 0);
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(-postLength, 0);
      ctx.stroke();
    }

    let boxX = -signWidth / 2;
    let boxY = -signHeight / 2;
    if (sign.side === "top") {
      boxY = -signHeight - 1;
    } else if (sign.side === "bottom") {
      boxY = 1;
    } else if (sign.side === "left") {
      boxX = -signWidth - 1;
    } else if (sign.side === "right") {
      boxX = 1;
    }

    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = "#191f25";
    ctx.lineWidth = 1.3;
    ctx.fillRect(boxX, boxY, signWidth, signHeight);
    ctx.strokeRect(boxX, boxY, signWidth, signHeight);

    ctx.fillStyle = "#20272d";
    ctx.font = "700 9px 'Space Grotesk', sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(String(sign.limit), boxX + signWidth / 2, boxY + signHeight / 2 + 0.2);

    ctx.restore();
  });
}

function drawStreetNameSigns() {
  streetNameSigns.forEach((sign) => {
    const postLength = 16;
    const signHeight = 14;
    const text = String(sign.name || "");

    ctx.save();
    ctx.font = "700 9px Outfit, sans-serif";
    const measured = ctx.measureText(text).width;
    const signWidth = clamp(measured + 14, 54, 132);
    let boxX = -signWidth / 2;
    let boxY = -signHeight / 2;

    ctx.translate(sign.x, sign.y);
    ctx.strokeStyle = "#667079";
    ctx.lineWidth = 1.8;

    if (sign.axis === "h" && sign.side === "top") {
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, -postLength);
      ctx.stroke();
      boxY = -postLength - signHeight - 1;
    } else if (sign.axis === "h" && sign.side === "bottom") {
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, postLength);
      ctx.stroke();
      boxY = postLength + 1;
    } else if (sign.axis === "v" && sign.side === "left") {
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(-postLength, 0);
      ctx.stroke();
      boxX = -postLength - signWidth - 1;
    } else {
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(postLength, 0);
      ctx.stroke();
      boxX = postLength + 1;
    }

    ctx.fillStyle = "#2c7a49";
    ctx.strokeStyle = "#1a4f2f";
    ctx.lineWidth = 1;
    ctx.fillRect(boxX, boxY, signWidth, signHeight);
    ctx.strokeRect(boxX, boxY, signWidth, signHeight);

    ctx.fillStyle = "#eaf8ec";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, boxX + signWidth / 2, boxY + signHeight / 2 + 0.2);
    ctx.restore();
  });
}

function drawNoSprayZones() {
  if (!targetHouse || !SERVICE_PHASES.has(state.phase)) {
    return;
  }

  state.noSprayZones.forEach((zone) => {
    const isMovedToy = zone.type === "toys" && zone.moved;
    const isNearby = Boolean(state.nearbyNoSprayZoneType) && distance(player, zone) <= zone.radius + 46;
    const haloAlpha = isMovedToy ? 0.28 : (isNearby ? 0.58 : 0.35);

    ctx.save();
    ctx.strokeStyle = isMovedToy
      ? `rgba(88, 181, 114, ${haloAlpha.toFixed(3)})`
      : `rgba(210, 67, 74, ${haloAlpha.toFixed(3)})`;
    ctx.lineWidth = isNearby ? 3 : 2;
    ctx.setLineDash(isMovedToy ? [4, 4] : [6, 5]);
    ctx.beginPath();
    ctx.arc(zone.x, zone.y, zone.radius + 9, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    if (zone.type === "flowers") {
      ctx.fillStyle = "#916646";
      ctx.beginPath();
      ctx.ellipse(zone.x, zone.y + 4, zone.radius * 0.82, zone.radius * 0.52, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#537f42";
      ctx.beginPath();
      ctx.arc(zone.x, zone.y, zone.radius * 0.45, 0, Math.PI * 2);
      ctx.fill();

      const petalColors = ["#f05d79", "#f2c64f", "#ec7cc3"];
      for (let i = 0; i < 5; i += 1) {
        const angle = (Math.PI * 2 * i) / 5;
        ctx.fillStyle = petalColors[i % petalColors.length];
        ctx.beginPath();
        ctx.arc(
          zone.x + Math.cos(angle) * zone.radius * 0.48,
          zone.y - 1 + Math.sin(angle) * zone.radius * 0.48,
          zone.radius * 0.23,
          0,
          Math.PI * 2
        );
        ctx.fill();
      }
      ctx.fillStyle = "#f3d46b";
      ctx.beginPath();
      ctx.arc(zone.x, zone.y - 1, zone.radius * 0.2, 0, Math.PI * 2);
      ctx.fill();
    } else if (zone.type === "toys") {
      if (zone.toyGroup === "dog") {
        ctx.fillStyle = zone.toyType === "frisbee" ? "#57b3d9" : "#f0c98b";
        if (zone.toyType === "frisbee") {
          ctx.beginPath();
          ctx.ellipse(zone.x, zone.y, zone.radius * 0.5, zone.radius * 0.25, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = "#dff6ff";
          ctx.lineWidth = 1.1;
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.arc(zone.x - zone.radius * 0.24, zone.y, zone.radius * 0.18, 0, Math.PI * 2);
          ctx.arc(zone.x + zone.radius * 0.24, zone.y, zone.radius * 0.18, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillRect(zone.x - zone.radius * 0.24, zone.y - zone.radius * 0.13, zone.radius * 0.48, zone.radius * 0.26);
        }
      } else {
        ctx.fillStyle = "#f1b24d";
        ctx.beginPath();
        ctx.arc(zone.x, zone.y, zone.radius * 0.42, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#f7d68c";
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(zone.x, zone.y, zone.radius * 0.42, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = "#de5d58";
        ctx.fillRect(zone.x - zone.radius * 0.45, zone.y + zone.radius * 0.25, zone.radius * 0.9, zone.radius * 0.22);
        ctx.fillStyle = "#5a89d8";
        ctx.fillRect(zone.x - zone.radius * 0.38, zone.y - zone.radius * 0.1, zone.radius * 0.76, zone.radius * 0.3);
        ctx.fillStyle = "#2e2e31";
        ctx.beginPath();
        ctx.arc(zone.x - zone.radius * 0.28, zone.y + zone.radius * 0.52, zone.radius * 0.14, 0, Math.PI * 2);
        ctx.arc(zone.x + zone.radius * 0.28, zone.y + zone.radius * 0.52, zone.radius * 0.14, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = isMovedToy ? "#cdebd3" : "#e8f0d8";
      ctx.font = "700 9px Outfit, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "bottom";
      if (isMovedToy) {
        ctx.fillText("Moved Toys", zone.x, zone.y - zone.radius * 0.55);
      } else {
        ctx.fillText(zone.toyGroup === "dog" ? "Dog Toys" : "Kids Toys", zone.x, zone.y - zone.radius * 0.55);
      }
    } else {
      const bedW = zone.radius * 1.65;
      const bedH = zone.radius * 1.15;
      ctx.fillStyle = "#6f4a34";
      ctx.fillRect(zone.x - bedW / 2, zone.y - bedH / 2, bedW, bedH);
      ctx.strokeStyle = "#8b6343";
      ctx.lineWidth = 1.2;
      ctx.strokeRect(zone.x - bedW / 2, zone.y - bedH / 2, bedW, bedH);
      ctx.fillStyle = "#4d9a4f";
      for (let i = -2; i <= 2; i += 1) {
        const stemX = zone.x + i * (bedW / 6);
        const stemY = zone.y + bedH * 0.08;
        ctx.fillRect(stemX - 1.2, stemY - zone.radius * 0.35, 2.4, zone.radius * 0.35);
      }

      if (zone.produceType === "cucumbers") {
        ctx.fillStyle = "#69b45c";
        for (let i = -2; i <= 2; i += 1) {
          const produceX = zone.x + i * (bedW / 6);
          const produceY = zone.y - bedH * 0.18;
          ctx.beginPath();
          ctx.ellipse(produceX, produceY, zone.radius * 0.16, zone.radius * 0.09, 0.15, 0, Math.PI * 2);
          ctx.fill();
        }
      } else {
        ctx.fillStyle = "#d84f4f";
        for (let i = -2; i <= 2; i += 1) {
          const produceX = zone.x + i * (bedW / 6);
          const produceY = zone.y - bedH * 0.16;
          ctx.beginPath();
          ctx.arc(produceX, produceY, zone.radius * 0.11, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.fillStyle = "#e8f0d8";
      ctx.font = "700 9px Outfit, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "bottom";
      ctx.fillText(zone.produceType === "cucumbers" ? "Cucumber Bed" : "Tomato Bed", zone.x, zone.y - bedH * 0.56);
    }
    ctx.restore();
  });
}

function drawPremierBarrierTargets() {
  if (state.phase !== "working" || !targetHouse || state.mapOpen || !state.firstPerson.active) {
    return;
  }

  const windows = [
    { x: targetHouse.x + 20, y: targetHouse.y + 36, w: 28, h: 20 },
    { x: targetHouse.x + targetHouse.w - 48, y: targetHouse.y + 36, w: 28, h: 20 }
  ];
  const door = { x: targetHouse.x + targetHouse.w / 2 - 11, y: targetHouse.y + targetHouse.h - 30, w: 22, h: 30 };

  ctx.save();
  ctx.setLineDash([7, 5]);
  ctx.strokeStyle = "rgba(84, 205, 126, 0.9)";
  ctx.lineWidth = 2;

  windows.forEach((rect) => {
    ctx.strokeRect(rect.x - 8, rect.y - 8, rect.w + 16, rect.h + 16);
  });
  ctx.strokeRect(door.x - 10, door.y - 10, door.w + 20, door.h + 20);

  ctx.setLineDash([4, 5]);
  ctx.strokeStyle = "rgba(228, 84, 90, 0.95)";
  windows.forEach((rect) => {
    ctx.strokeRect(rect.x, rect.y, rect.w, rect.h);
  });
  ctx.strokeRect(door.x, door.y, door.w, door.h);

  ctx.setLineDash([8, 6]);
  ctx.strokeStyle = "rgba(108, 217, 149, 0.8)";
  ctx.lineWidth = 2.4;
  ctx.beginPath();
  ctx.moveTo(targetHouse.x - 6, targetHouse.y - 6);
  ctx.lineTo(targetHouse.x + targetHouse.w + 6, targetHouse.y - 6);
  ctx.stroke();

  ctx.restore();
}

function drawHouses() {
  houses.forEach((house, index) => {
    const hasGarage = GARAGE_HOUSE_IDS.has(house.id);
    const deckLayout = getHouseDeckLayout(house);
    const leftWindow = { x: house.x + 20, y: house.y + 36, w: 28, h: 20 };
    const rightWindow = { x: house.x + house.w - 48, y: house.y + 36, w: 28, h: 20 };
    const garageRect = hasGarage
      ? {
        x: house.x + 8,
        y: house.y + house.h - 42,
        w: house.w * 0.48,
        h: 36
      }
      : null;
    const door = hasGarage
      ? { x: house.x + house.w * 0.76 - 11, y: house.y + house.h - 30, w: 22, h: 30 }
      : { x: house.x + house.w / 2 - 11, y: house.y + house.h - 30, w: 22, h: 30 };

    const sidingLight = shadeColor(house.color, 0.12);
    const sidingDark = shadeColor(house.color, -0.1);
    const roofLight = shadeColor(house.roof, 0.16);
    const roofDark = shadeColor(house.roof, -0.2);

    if (house.driveway) {
      const nearestRoad = getNearestHorizontalRoadForHouse(house);
      const houseAboveRoad = Boolean(nearestRoad) && (house.y + house.h <= nearestRoad.y + nearestRoad.h / 2);
      const driveGrad = ctx.createLinearGradient(
        house.driveway.x,
        house.driveway.y,
        house.driveway.x + house.driveway.w,
        house.driveway.y + house.driveway.h
      );
      driveGrad.addColorStop(0, "#d6dade");
      driveGrad.addColorStop(1, "#a8afb7");
      ctx.fillStyle = driveGrad;
      ctx.fillRect(house.driveway.x, house.driveway.y, house.driveway.w, house.driveway.h);
      ctx.strokeStyle = "#7f8893";
      ctx.lineWidth = 1.1;
      ctx.strokeRect(house.driveway.x, house.driveway.y, house.driveway.w, house.driveway.h);

      if (nearestRoad) {
        const flare = clamp(house.driveway.w * 0.2, 6, 12);
        const roadEdgeY = houseAboveRoad ? nearestRoad.y + 1 : nearestRoad.y + nearestRoad.h - 1;
        const topY = houseAboveRoad ? house.driveway.y + house.driveway.h - 2 : house.driveway.y + 2;
        const bottomY = roadEdgeY;
        const hasConnector = houseAboveRoad ? bottomY > topY + 1 : bottomY < topY - 1;
        if (hasConnector) {
          const connectorGrad = ctx.createLinearGradient(
            house.driveway.x,
            Math.min(topY, bottomY),
            house.driveway.x + house.driveway.w,
            Math.max(topY, bottomY)
          );
          connectorGrad.addColorStop(0, "#cfd5db");
          connectorGrad.addColorStop(1, "#a1aab3");
          ctx.fillStyle = connectorGrad;
          ctx.beginPath();
          ctx.moveTo(house.driveway.x + 1, topY);
          ctx.lineTo(house.driveway.x + house.driveway.w - 1, topY);
          ctx.lineTo(house.driveway.x + house.driveway.w + flare, bottomY);
          ctx.lineTo(house.driveway.x - flare, bottomY);
          ctx.closePath();
          ctx.fill();
          ctx.strokeStyle = "rgba(122, 132, 142, 0.75)";
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      ctx.strokeStyle = "rgba(98, 108, 118, 0.45)";
      ctx.lineWidth = 0.9;
      if (house.driveway.h > house.driveway.w) {
        const segmentHeight = house.driveway.h / 4;
        for (let i = 1; i < 4; i += 1) {
          const y = house.driveway.y + segmentHeight * i;
          ctx.beginPath();
          ctx.moveTo(house.driveway.x + 2, y);
          ctx.lineTo(house.driveway.x + house.driveway.w - 2, y);
          ctx.stroke();
        }
      } else {
        const segmentWidth = house.driveway.w / 4;
        for (let i = 1; i < 4; i += 1) {
          const x = house.driveway.x + segmentWidth * i;
          ctx.beginPath();
          ctx.moveTo(x, house.driveway.y + 2);
          ctx.lineTo(x, house.driveway.y + house.driveway.h - 2);
          ctx.stroke();
        }
      }
    }

    ctx.fillStyle = "#d3dfc1";
    ctx.fillRect(house.x - 12, house.y - 12, house.w + 24, house.h + 24);

    if (deckLayout) {
      const deck = deckLayout.deckRect;
      const stairs = deckLayout.stairsRect;

      const deckGrad = ctx.createLinearGradient(deck.x, deck.y, deck.x, deck.y + deck.h);
      deckGrad.addColorStop(0, "#b08662");
      deckGrad.addColorStop(1, "#8f684c");
      ctx.fillStyle = deckGrad;
      ctx.fillRect(deck.x, deck.y, deck.w, deck.h);
      ctx.strokeStyle = "#5f4533";
      ctx.lineWidth = 1.1;
      ctx.strokeRect(deck.x, deck.y, deck.w, deck.h);

      ctx.strokeStyle = "rgba(243, 222, 196, 0.4)";
      ctx.lineWidth = 0.9;
      for (let plankX = deck.x + 8; plankX < deck.x + deck.w - 6; plankX += 10) {
        ctx.beginPath();
        ctx.moveTo(plankX, deck.y + 1);
        ctx.lineTo(plankX, deck.y + deck.h - 1);
        ctx.stroke();
      }

      ctx.fillStyle = "#6f4f3a";
      const postY = deck.y + deck.h;
      [deck.x + 4, deck.x + deck.w * 0.5 - 2, deck.x + deck.w - 8].forEach((postX) => {
        ctx.fillRect(postX, postY, 4, 13);
      });

      const stairGrad = ctx.createLinearGradient(stairs.x, stairs.y, stairs.x, stairs.y + stairs.h);
      stairGrad.addColorStop(0, "#9f7658");
      stairGrad.addColorStop(1, "#7b5a43");
      ctx.fillStyle = stairGrad;
      ctx.fillRect(stairs.x, stairs.y, stairs.w, stairs.h);
      ctx.strokeStyle = "#5f4533";
      ctx.lineWidth = 1;
      ctx.strokeRect(stairs.x, stairs.y, stairs.w, stairs.h);

      ctx.strokeStyle = "rgba(236, 211, 183, 0.55)";
      for (let step = 1; step <= 3; step += 1) {
        const stepY = stairs.y + (stairs.h / 4) * step;
        ctx.beginPath();
        ctx.moveTo(stairs.x + 1.2, stepY);
        ctx.lineTo(stairs.x + stairs.w - 1.2, stepY);
        ctx.stroke();
      }
    }

    ctx.save();
    ctx.shadowBlur = 14;
    ctx.shadowColor = "rgba(32, 44, 28, 0.25)";
    ctx.shadowOffsetY = 6;
    const sidingGrad = ctx.createLinearGradient(house.x, house.y, house.x, house.y + house.h);
    sidingGrad.addColorStop(0, sidingLight);
    sidingGrad.addColorStop(1, sidingDark);
    ctx.fillStyle = sidingGrad;
    ctx.fillRect(house.x, house.y, house.w, house.h);
    ctx.restore();

    ctx.strokeStyle = colorWithAlpha(house.roof, 0.46);
    ctx.lineWidth = 1.3;
    ctx.strokeRect(house.x, house.y, house.w, house.h);

    ctx.strokeStyle = colorWithAlpha(house.color, 0.42);
    ctx.lineWidth = 0.8;
    for (let y = house.y + 12; y < house.y + house.h - 6; y += 12) {
      ctx.beginPath();
      ctx.moveTo(house.x + 5, y);
      ctx.lineTo(house.x + house.w - 5, y);
      ctx.stroke();
    }

    ctx.fillStyle = shadeColor(house.roof, -0.07);
    ctx.fillRect(house.x - 6, house.y + 8, house.w + 12, 7);

    ctx.save();
    ctx.shadowBlur = 10;
    ctx.shadowColor = "rgba(30, 20, 16, 0.28)";
    const roofGrad = ctx.createLinearGradient(house.x, house.y - 34, house.x, house.y + 12);
    roofGrad.addColorStop(0, roofLight);
    roofGrad.addColorStop(1, roofDark);
    ctx.fillStyle = roofGrad;
    ctx.beginPath();
    ctx.moveTo(house.x - 4, house.y + 10);
    ctx.lineTo(house.x + house.w / 2, house.y - 34);
    ctx.lineTo(house.x + house.w + 4, house.y + 10);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    ctx.strokeStyle = colorWithAlpha(shadeColor(house.roof, -0.24), 0.6);
    ctx.lineWidth = 1;
    for (let i = -2; i <= 7; i += 1) {
      const y = house.y - 24 + i * 5;
      ctx.beginPath();
      ctx.moveTo(house.x + 14 + i * 1.2, y);
      ctx.lineTo(house.x + house.w - 14 - i * 1.2, y);
      ctx.stroke();
    }

    if ((index % 3) !== 1) {
      const chimneyX = house.x + house.w * 0.24;
      const chimneyY = house.y - 28;
      ctx.fillStyle = shadeColor(house.roof, -0.28);
      ctx.fillRect(chimneyX, chimneyY, 12, 24);
      ctx.fillStyle = shadeColor(house.roof, -0.4);
      ctx.fillRect(chimneyX - 2, chimneyY - 4, 16, 5);
    }

    const drawWindow = (rect) => {
      ctx.fillStyle = "#efe7d8";
      ctx.fillRect(rect.x - 3, rect.y - 3, rect.w + 6, rect.h + 6);

      const paneGrad = ctx.createLinearGradient(rect.x, rect.y, rect.x, rect.y + rect.h);
      paneGrad.addColorStop(0, "#d8edfb");
      paneGrad.addColorStop(1, "#9fc5de");
      ctx.fillStyle = paneGrad;
      ctx.fillRect(rect.x, rect.y, rect.w, rect.h);

      ctx.strokeStyle = "rgba(35, 58, 76, 0.72)";
      ctx.lineWidth = 1.1;
      ctx.strokeRect(rect.x, rect.y, rect.w, rect.h);

      ctx.strokeStyle = "rgba(237, 247, 255, 0.85)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(rect.x + rect.w / 2, rect.y + 1);
      ctx.lineTo(rect.x + rect.w / 2, rect.y + rect.h - 1);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(rect.x + 1, rect.y + rect.h / 2);
      ctx.lineTo(rect.x + rect.w - 1, rect.y + rect.h / 2);
      ctx.stroke();

      const shutterColor = shadeColor(house.roof, -0.12);
      ctx.fillStyle = shutterColor;
      ctx.fillRect(rect.x - 8, rect.y + 1, 4, rect.h - 2);
      ctx.fillRect(rect.x + rect.w + 4, rect.y + 1, 4, rect.h - 2);
    };

    drawWindow(leftWindow);
    drawWindow(rightWindow);

    if (garageRect) {
      const garageGrad = ctx.createLinearGradient(garageRect.x, garageRect.y, garageRect.x, garageRect.y + garageRect.h);
      garageGrad.addColorStop(0, "#d6dbe0");
      garageGrad.addColorStop(1, "#b2bac2");
      ctx.fillStyle = garageGrad;
      ctx.fillRect(garageRect.x, garageRect.y, garageRect.w, garageRect.h);
      ctx.strokeStyle = "#7b8793";
      ctx.lineWidth = 1;
      ctx.strokeRect(garageRect.x, garageRect.y, garageRect.w, garageRect.h);

      ctx.strokeStyle = "rgba(119, 129, 138, 0.6)";
      ctx.lineWidth = 0.9;
      const panelCount = 4;
      for (let panel = 1; panel < panelCount; panel += 1) {
        const panelY = garageRect.y + (garageRect.h / panelCount) * panel;
        ctx.beginPath();
        ctx.moveTo(garageRect.x + 2, panelY);
        ctx.lineTo(garageRect.x + garageRect.w - 2, panelY);
        ctx.stroke();
      }
      const apronW = garageRect.w - 4;
      ctx.fillStyle = "#bcc4cb";
      ctx.fillRect(garageRect.x + 2, house.y + house.h, apronW, 20);
      ctx.strokeStyle = "rgba(130, 140, 148, 0.45)";
      ctx.strokeRect(garageRect.x + 2, house.y + house.h, apronW, 20);
    }

    const doorGrad = ctx.createLinearGradient(door.x, door.y, door.x, door.y + door.h);
    doorGrad.addColorStop(0, "#8e5f44");
    doorGrad.addColorStop(1, "#6f462f");
    ctx.fillStyle = doorGrad;
    ctx.fillRect(door.x, door.y, door.w, door.h);
    ctx.strokeStyle = "#4a2e1f";
    ctx.lineWidth = 1;
    ctx.strokeRect(door.x, door.y, door.w, door.h);

    ctx.strokeStyle = "rgba(227, 199, 172, 0.48)";
    ctx.strokeRect(door.x + 4, door.y + 4, door.w - 8, 9);
    ctx.strokeRect(door.x + 4, door.y + 16, door.w - 8, 10);

    ctx.fillStyle = "#d8be88";
    ctx.beginPath();
    ctx.arc(door.x + door.w - 4.5, door.y + door.h / 2, 1.7, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#b4b8bd";
    ctx.fillRect(door.x - 8, door.y + door.h, door.w + 16, 5);
    ctx.fillRect(door.x + door.w / 2 - 4, house.y + house.h, 8, 24);

    const houseNumber = getHouseNumber(house, index);
    const plaqueW = Math.max(36, houseNumber.length * 9 + 14);
    const plaqueX = door.x + door.w / 2 - plaqueW / 2;
    const plaqueY = door.y - 18;
    ctx.fillStyle = "#e8deca";
    ctx.fillRect(plaqueX, plaqueY, plaqueW, 13);
    ctx.strokeStyle = "#8d7b61";
    ctx.lineWidth = 1;
    ctx.strokeRect(plaqueX, plaqueY, plaqueW, 13);
    ctx.fillStyle = "#3e3527";
    ctx.font = "700 10px 'Space Grotesk', sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(houseNumber, plaqueX + plaqueW / 2, plaqueY + 6.8);

    const shrubCount = hasGarage ? 2 + (index % 2) : 3 + (index % 2);
    const shrubStart = hasGarage ? house.x + house.w * 0.56 : house.x + 18;
    const shrubSpan = hasGarage ? house.w * 0.38 : (house.w - 36);
    for (let i = 0; i < shrubCount; i += 1) {
      const t = shrubCount === 1 ? 0.5 : i / (shrubCount - 1);
      const shrubX = shrubStart + t * shrubSpan;
      const shrubY = house.y + house.h + 8;
      const shrubR = 7 + ((i + index) % 3);
      ctx.fillStyle = i % 2 === 0 ? "#5d8a47" : "#4f7d3f";
      ctx.beginPath();
      ctx.arc(shrubX, shrubY, shrubR, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "rgba(190, 227, 165, 0.35)";
      ctx.beginPath();
      ctx.arc(shrubX - 2, shrubY - 2, shrubR * 0.48, 0, Math.PI * 2);
      ctx.fill();
    }

    if (house.label) {
      const isTarget = house.id === "target";
      const labelY = house.y - 18;
      const text = house.label;
      const labelWidth = Math.max(58, text.length * (isTarget ? 8.2 : 7.4));
      ctx.fillStyle = isTarget ? "rgba(18, 79, 42, 0.18)" : "rgba(64, 80, 58, 0.16)";
      ctx.fillRect(house.x + house.w / 2 - labelWidth / 2, labelY - 14, labelWidth, 18);
      ctx.fillStyle = isTarget ? "#114f2a" : "#334336";
      ctx.font = isTarget ? "700 18px 'Space Grotesk', sans-serif" : "600 15px Outfit, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "alphabetic";
      ctx.fillText(text, house.x + house.w / 2, labelY);
    }
  });
}

function drawRoute() {
  if (!state.inTruck || state.phase !== "drive_to_stop" || state.missionComplete) {
    return;
  }

  const points = [{ x: truck.x, y: truck.y }, ...route.slice(state.currentWaypoint)];

  ctx.save();
  ctx.lineWidth = 5;
  ctx.strokeStyle = "rgba(78, 199, 243, 0.88)";
  ctx.setLineDash([14, 10]);

  ctx.beginPath();
  points.forEach((point, index) => {
    if (index === 0) {
      ctx.moveTo(point.x, point.y);
      return;
    }
    ctx.lineTo(point.x, point.y);
  });
  ctx.stroke();
  ctx.restore();

  const next = route[Math.min(state.currentWaypoint, route.length - 1)];
  if (next) {
    const angle = Math.atan2(next.y - truck.y, next.x - truck.x);
    const arrowX = truck.x + Math.cos(angle) * 42;
    const arrowY = truck.y + Math.sin(angle) * 42;

    ctx.save();
    ctx.translate(arrowX, arrowY);
    ctx.rotate(angle);
    ctx.fillStyle = "#4ec7f3";
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-16, -8);
    ctx.lineTo(-16, 8);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
}

function drawParkingSpot() {
  if (!(state.phase === "drive_to_stop" || state.phase === "service_briefing")) {
    return;
  }

  const pulse = 0.55 + 0.45 * Math.sin(state.timeMs * 0.0055);
  const alphaFill = 0.2 + pulse * 0.2;
  const alphaStroke = 0.55 + pulse * 0.35;

  ctx.save();
  ctx.fillStyle = `rgba(246, 240, 95, ${alphaFill.toFixed(3)})`;
  ctx.strokeStyle = `rgba(255, 249, 170, ${alphaStroke.toFixed(3)})`;
  ctx.lineWidth = 3;
  ctx.shadowBlur = 18;
  ctx.shadowColor = "rgba(246, 240, 95, 0.85)";

  ctx.fillRect(parkingSpot.x, parkingSpot.y, parkingSpot.w, parkingSpot.h);
  ctx.strokeRect(parkingSpot.x, parkingSpot.y, parkingSpot.w, parkingSpot.h);

  ctx.restore();
}

function drawHouseParkingSpots() {
  if (!houseParkingSpots.length || state.mapOpen) {
    return;
  }

  const pulse = 0.42 + 0.58 * Math.sin(state.timeMs * 0.0052);
  houseParkingSpots.forEach((spot) => {
    if (spot.houseId === "target" && (state.phase === "drive_to_stop" || state.phase === "service_briefing")) {
      return;
    }
    const center = { x: spot.x + spot.w / 2, y: spot.y + spot.h / 2 };
    const nearbyTruck = state.inTruck && distance(truck, center) <= 190;
    const fillAlpha = nearbyTruck ? 0.14 + pulse * 0.14 : 0.08 + pulse * 0.08;
    const strokeAlpha = nearbyTruck ? 0.7 + pulse * 0.22 : 0.34 + pulse * 0.16;

    ctx.save();
    ctx.fillStyle = `rgba(110, 190, 255, ${fillAlpha.toFixed(3)})`;
    ctx.strokeStyle = `rgba(165, 220, 255, ${strokeAlpha.toFixed(3)})`;
    ctx.lineWidth = nearbyTruck ? 2.4 : 1.5;
    ctx.setLineDash(nearbyTruck ? [8, 6] : [6, 8]);
    ctx.fillRect(spot.x, spot.y, spot.w, spot.h);
    ctx.strokeRect(spot.x, spot.y, spot.w, spot.h);
    ctx.setLineDash([]);

    if (nearbyTruck) {
      ctx.fillStyle = "rgba(233, 247, 255, 0.88)";
      ctx.font = "700 10px 'Space Grotesk', sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("P", center.x, center.y + 0.6);
    }
    ctx.restore();
  });
}

function drawDoorCheckInZone() {
  if (
    !(state.phase === "walk_to_door" || state.phase === "conversation")
    && !(state.rain.active && state.rain.context === "service" && state.rain.stage === "service_talk_customer")
  ) {
    return;
  }

  const pulse = 0.45 + 0.55 * Math.sin(state.timeMs * 0.006);

  ctx.save();
  ctx.fillStyle = `rgba(110, 205, 255, ${(0.16 + pulse * 0.12).toFixed(3)})`;
  ctx.strokeStyle = `rgba(154, 227, 255, ${(0.5 + pulse * 0.4).toFixed(3)})`;
  ctx.lineWidth = 2.5;
  ctx.shadowBlur = 14;
  ctx.shadowColor = "rgba(80, 195, 255, 0.85)";
  ctx.fillRect(targetDoorZone.x, targetDoorZone.y, targetDoorZone.w, targetDoorZone.h);
  ctx.strokeRect(targetDoorZone.x, targetDoorZone.y, targetDoorZone.w, targetDoorZone.h);
  ctx.restore();
}

function drawWebsterPickupZone() {
  if (state.phase !== "webster_pickup") {
    return;
  }
  if (!state.vehicleDoors.rear) {
    return;
  }
  const rear = getTruckWebsterPoint();
  const pulse = 0.45 + 0.55 * Math.sin(state.timeMs * 0.007);

  ctx.save();
  ctx.fillStyle = `rgba(244, 227, 103, ${(0.2 + pulse * 0.22).toFixed(3)})`;
  ctx.strokeStyle = `rgba(255, 245, 165, ${(0.55 + pulse * 0.35).toFixed(3)})`;
  ctx.lineWidth = 2.4;
  ctx.shadowBlur = 14;
  ctx.shadowColor = "rgba(244, 227, 103, 0.85)";
  ctx.beginPath();
  ctx.arc(rear.x, rear.y, 20, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

function drawVehicleDoorAccessZones() {
  const pulse = 0.45 + 0.55 * Math.sin(state.timeMs * 0.0066);

  const drawDoorZone = (point, fillColor, strokeColor, radius = 18) => {
    ctx.save();
    ctx.fillStyle = fillColor;
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 2.3;
    ctx.shadowBlur = 12;
    ctx.shadowColor = strokeColor;
    ctx.beginPath();
    ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  };

  if (!state.inTruck && (state.phase === "walk_to_truck" || state.phase === "drive_to_stop")) {
    const driverPoint = getTruckDriverDoorPoint();
    drawDoorZone(
      driverPoint,
      `rgba(112, 196, 255, ${(0.18 + pulse * 0.16).toFixed(3)})`,
      `rgba(167, 227, 255, ${(0.45 + pulse * 0.4).toFixed(3)})`,
      19
    );
  }

  if (state.phase === "webster_pickup" && !state.vehicleDoors.rear) {
    const rearDoorPoint = getTruckRearDoorPoint();
    drawDoorZone(
      rearDoorPoint,
      `rgba(244, 227, 103, ${(0.18 + pulse * 0.2).toFixed(3)})`,
      `rgba(255, 245, 165, ${(0.5 + pulse * 0.36).toFixed(3)})`,
      20
    );
  }

  if (state.phase === "working" && (!state.vehicleDoors.right || !state.hasPowerSprayer || (state.serviceComplete && state.sprayerNeedsRollup))) {
    if (state.serviceComplete && state.sprayerNeedsRollup) {
      drawDoorZone(
        { x: truck.x, y: truck.y },
        `rgba(250, 230, 122, ${(0.18 + pulse * 0.2).toFixed(3)})`,
        `rgba(255, 247, 174, ${(0.48 + pulse * 0.36).toFixed(3)})`,
        30
      );
    } else {
      const rightDoorPoint = getTruckRightDoorPoint();
      drawDoorZone(
        rightDoorPoint,
        `rgba(140, 228, 184, ${(0.16 + pulse * 0.18).toFixed(3)})`,
        `rgba(182, 245, 212, ${(0.45 + pulse * 0.36).toFixed(3)})`,
        19
      );
    }
  }
}

function drawWebTargets() {
  if (state.phase !== "webster_working") {
    return;
  }

  state.webTargets.forEach((web) => {
    if (web.cleared) {
      return;
    }
    const nearby = distance(player, web) <= WEBSTER_REACH + 4;
    const alpha = nearby ? 0.92 : 0.76;
    ctx.save();
    ctx.strokeStyle = `rgba(240, 246, 255, ${alpha.toFixed(3)})`;
    ctx.lineWidth = nearby ? 1.8 : 1.2;
    ctx.beginPath();
    ctx.arc(web.x, web.y, web.radius, 0, Math.PI * 2);
    ctx.stroke();
    for (let i = 0; i < 8; i += 1) {
      const angle = (Math.PI * 2 * i) / 8;
      ctx.beginPath();
      ctx.moveTo(web.x, web.y);
      ctx.lineTo(web.x + Math.cos(angle) * web.radius, web.y + Math.sin(angle) * web.radius);
      ctx.stroke();
    }
    ctx.restore();
  });
}

function drawActiveServiceSideHighlight() {
  if (state.phase !== "working" || !state.activeHouseSide || !targetHouse || state.mapOpen) {
    return;
  }

  const pulse = 0.45 + 0.55 * Math.sin(state.timeMs * 0.008);
  ctx.save();
  ctx.strokeStyle = `rgba(61, 181, 120, ${(0.38 + pulse * 0.42).toFixed(3)})`;
  ctx.lineWidth = 4;
  ctx.setLineDash([10, 8]);

  if (state.activeHouseSide === "north") {
    ctx.beginPath();
    ctx.moveTo(targetHouse.x, targetHouse.y);
    ctx.lineTo(targetHouse.x + targetHouse.w, targetHouse.y);
    ctx.stroke();
  } else if (state.activeHouseSide === "south") {
    ctx.beginPath();
    ctx.moveTo(targetHouse.x, targetHouse.y + targetHouse.h);
    ctx.lineTo(targetHouse.x + targetHouse.w, targetHouse.y + targetHouse.h);
    ctx.stroke();
  } else if (state.activeHouseSide === "west") {
    ctx.beginPath();
    ctx.moveTo(targetHouse.x, targetHouse.y);
    ctx.lineTo(targetHouse.x, targetHouse.y + targetHouse.h);
    ctx.stroke();
  } else if (state.activeHouseSide === "east") {
    ctx.beginPath();
    ctx.moveTo(targetHouse.x + targetHouse.w, targetHouse.y);
    ctx.lineTo(targetHouse.x + targetHouse.w, targetHouse.y + targetHouse.h);
    ctx.stroke();
  }

  ctx.setLineDash([]);
  ctx.restore();
}

function drawSprayerRig() {
  if (state.phase !== "working" || state.inTruck || !targetHouse || state.mapOpen) {
    return;
  }
  if (!state.hasPowerSprayer) {
    return;
  }

  const reelPoint = truckLocalToWorld(-8, 27);
  const reelX = reelPoint.x;
  const reelY = reelPoint.y;
  const nozzleX = player.x;
  const nozzleY = player.y + 1;
  const hoseDistance = distance({ x: reelX, y: reelY }, { x: nozzleX, y: nozzleY });
  const tautRatio = clamp(hoseDistance / state.hoseMaxLength, 0, 1.2);

  ctx.save();
  ctx.strokeStyle = tautRatio > 1 ? "#cf6d3a" : "#2f3135";
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.moveTo(reelX, reelY);
  ctx.quadraticCurveTo(
    (reelX + nozzleX) / 2,
    (reelY + nozzleY) / 2 + 12,
    nozzleX,
    nozzleY
  );
  ctx.stroke();

  ctx.fillStyle = "#20232a";
  ctx.beginPath();
  ctx.arc(reelX, reelY, 5.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#8d9ab3";
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.fillStyle = "#3a3f49";
  ctx.fillRect(nozzleX - 5, nozzleY - 2, 10, 4);

  if (state.sprayActive) {
    const nearest = getNearestPointOnRect(player.x, player.y, targetHouse);
    const angle = Math.atan2(nearest.y - player.y, nearest.x - player.x);
    const range = 78 + state.sprayerConcentration * 30;
    const waviness = (1 - state.sprayerConcentration) * 0.16;
    const timeWobble = Math.sin(state.timeMs * 0.02) * waviness;
    const beamWidth = clamp(5.4 - state.sprayerConcentration * 2.9, 1.9, 5.8);
    const beamAlpha = clamp(0.42 + state.sprayerConcentration * 0.28, 0.4, 0.72);
    const endX = nozzleX + Math.cos(angle + timeWobble) * range;
    const endY = nozzleY + Math.sin(angle + timeWobble) * range;

    ctx.strokeStyle = `rgba(157, 218, 255, ${beamAlpha.toFixed(3)})`;
    ctx.lineWidth = beamWidth;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(nozzleX, nozzleY);
    ctx.lineTo(endX, endY);
    ctx.stroke();

    ctx.strokeStyle = `rgba(211, 236, 255, ${(beamAlpha * 0.9).toFixed(3)})`;
    ctx.lineWidth = Math.max(1.1, beamWidth * 0.5);
    ctx.beginPath();
    ctx.moveTo(nozzleX, nozzleY);
    ctx.lineTo(
      nozzleX + Math.cos(angle + timeWobble * 1.35) * (range * 0.96),
      nozzleY + Math.sin(angle + timeWobble * 1.35) * (range * 0.96)
    );
    ctx.stroke();

    ctx.fillStyle = "rgba(201, 232, 255, 0.64)";
    ctx.beginPath();
    ctx.arc(endX, endY, Math.max(1.2, beamWidth * 0.58), 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

function drawBallCap(headX, headY, options = {}) {
  const color = options.color || "#b6121e";
  const scale = Number.isFinite(options.scale) ? options.scale : 1;
  const brimDirection = options.brimDirection === -1 ? -1 : 1;
  const domeHalfW = 4.9 * scale;
  const domeTop = headY - 9.2 * scale;
  const domeBase = headY - 4.2 * scale;

  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(headX - domeHalfW, domeBase);
  ctx.quadraticCurveTo(headX, domeTop, headX + domeHalfW, domeBase);
  ctx.lineTo(headX + domeHalfW, domeBase + 1.8 * scale);
  ctx.lineTo(headX - domeHalfW, domeBase + 1.8 * scale);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "rgba(255, 255, 255, 0.18)";
  ctx.fillRect(headX - domeHalfW + 0.8 * scale, domeBase + 0.15 * scale, 4 * scale, 0.7 * scale);

  ctx.fillStyle = color;
  const brimAnchorX = headX + 2.3 * scale * brimDirection;
  ctx.fillRect(
    brimDirection > 0 ? brimAnchorX : brimAnchorX - 2.4 * scale,
    domeBase + 1.2 * scale,
    2.4 * scale,
    1 * scale
  );
  ctx.beginPath();
  ctx.ellipse(
    headX + 5.9 * scale * brimDirection,
    domeBase + 2.1 * scale,
    3.7 * scale,
    1.35 * scale,
    -0.16 * brimDirection,
    0,
    Math.PI * 2
  );
  ctx.fill();
}

function drawPlayer() {
  if (state.inTruck) {
    return;
  }

  ctx.save();
  ctx.translate(player.x, player.y);

  ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
  ctx.beginPath();
  ctx.ellipse(0, 11, 11, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#c9252f";
  ctx.fillRect(-9, -7, 18, 12);
  ctx.fillStyle = "#141518";
  ctx.fillRect(-9, 5, 18, 10);
  ctx.fillStyle = "#111317";
  ctx.fillRect(-9, 15, 7, 4);
  ctx.fillRect(2, 15, 7, 4);

  ctx.fillStyle = "#f5c89c";
  ctx.beginPath();
  ctx.arc(0, -11, 7, 0, Math.PI * 2);
  ctx.fill();
  drawBallCap(0, -11, { color: "#b6121e", scale: 1, brimDirection: 1 });

  if (state.hasWebster && (state.phase === "webster_working" || state.phase === "webster_pickup")) {
    const side = state.activeHouseSide;
    let angle = -Math.PI / 4;
    if (side === "west") {
      angle = Math.PI;
    } else if (side === "east") {
      angle = 0;
    } else if (side === "north") {
      angle = -Math.PI / 2;
    } else if (side === "south") {
      angle = Math.PI / 2;
    }
    ctx.strokeStyle = "#7f858c";
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(0, -4);
    ctx.lineTo(Math.cos(angle) * 28, -4 + Math.sin(angle) * 28);
    ctx.stroke();
    ctx.strokeStyle = "#f4f5f8";
    ctx.lineWidth = 2.8;
    ctx.beginPath();
    ctx.moveTo(Math.cos(angle) * 28, -4 + Math.sin(angle) * 28);
    ctx.lineTo(Math.cos(angle) * 34, -4 + Math.sin(angle) * 34);
    ctx.stroke();
  }

  ctx.restore();
}

function drawTrainerFollower() {
  if (!state.trainerMode || state.inTruck || state.mapOpen || state.firstPerson.active) {
    return;
  }

  const trainer = state.trainerFollower;
  if (!Number.isFinite(trainer.x) || !Number.isFinite(trainer.y)) {
    return;
  }

  ctx.save();
  ctx.translate(trainer.x, trainer.y);

  ctx.fillStyle = "rgba(0, 0, 0, 0.18)";
  ctx.beginPath();
  ctx.ellipse(0, 11, 10.5, 4.8, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#b81d27";
  ctx.fillRect(-8.5, -7, 17, 12);
  ctx.fillStyle = "#15181c";
  ctx.fillRect(-8.5, 5, 17, 10);
  ctx.fillStyle = "#111317";
  ctx.fillRect(-8.5, 15, 6.5, 4);
  ctx.fillRect(2, 15, 6.5, 4);

  ctx.fillStyle = "#f1c59e";
  ctx.beginPath();
  ctx.arc(0, -11, 6.6, 0, Math.PI * 2);
  ctx.fill();
  drawBallCap(0, -11, { color: "#b6121e", scale: 0.94, brimDirection: 1 });

  ctx.restore();
}

function drawTruck() {
  ctx.save();
  ctx.translate(truck.x, truck.y);
  ctx.rotate(truck.angle);

  ctx.fillStyle = "rgba(0, 0, 0, 0.24)";
  ctx.beginPath();
  ctx.ellipse(-4, 27, 56, 13, 0, 0, Math.PI * 2);
  ctx.fill();

  const wheelCenters = [
    { x: -24, y: -23.5, side: "top" },
    { x: 29, y: -23.5, side: "top" },
    { x: -24, y: 23.5, side: "bottom" },
    { x: 29, y: 23.5, side: "bottom" }
  ];

  wheelCenters.forEach((wheel) => {
    ctx.save();
    ctx.beginPath();
    if (wheel.side === "top") {
      ctx.rect(wheel.x - 10, -60, 20, 38.2);
    } else {
      ctx.rect(wheel.x - 10, 21.8, 20, 60);
    }
    ctx.clip();

    ctx.fillStyle = "#0f1216";
    ctx.beginPath();
    ctx.arc(wheel.x, wheel.y, 6.8, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#2b323a";
    ctx.beginPath();
    ctx.arc(wheel.x, wheel.y, 4.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#8fa0ad";
    ctx.beginPath();
    ctx.arc(wheel.x, wheel.y, 1.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });

  const bodyGrad = ctx.createLinearGradient(-56, -24, 44, 24);
  bodyGrad.addColorStop(0, "#99131e");
  bodyGrad.addColorStop(0.5, "#cb2531");
  bodyGrad.addColorStop(1, "#eb4e56");
  ctx.fillStyle = bodyGrad;
  ctx.beginPath();
  ctx.moveTo(-50, -21);
  ctx.lineTo(10, -21);
  ctx.quadraticCurveTo(24, -21, 34, -16.5);
  ctx.quadraticCurveTo(45, -10.5, 48, 0);
  ctx.quadraticCurveTo(45, 10.5, 34, 16.5);
  ctx.quadraticCurveTo(24, 21, 10, 21);
  ctx.lineTo(-50, 21);
  ctx.quadraticCurveTo(-56, 21, -56, 15);
  ctx.lineTo(-56, -15);
  ctx.quadraticCurveTo(-56, -21, -50, -21);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "#731119";
  ctx.lineWidth = 1.4;
  ctx.stroke();

  ctx.fillStyle = "rgba(255, 255, 255, 0.16)";
  ctx.fillRect(-47, -18, 58, 4);

  ctx.fillStyle = "rgba(148, 18, 28, 0.45)";
  ctx.fillRect(-10, -20, 2, 40);
  ctx.fillRect(10, -20, 2, 40);
  ctx.fillStyle = "rgba(115, 15, 22, 0.52)";
  ctx.fillRect(24, -19, 2, 38);

  ctx.fillStyle = "#b61f2a";
  ctx.beginPath();
  ctx.moveTo(16, -18);
  ctx.lineTo(31, -18);
  ctx.quadraticCurveTo(42, -17, 44, -8);
  ctx.lineTo(44, 8);
  ctx.quadraticCurveTo(42, 17, 31, 18);
  ctx.lineTo(16, 18);
  ctx.closePath();
  ctx.fill();

  const windshield = { x: 22.8, y: -12.8, w: 14.8, h: 25.6, r: 4.2 };
  ctx.fillStyle = "#d8e8f2";
  ctx.beginPath();
  ctx.moveTo(windshield.x + windshield.r, windshield.y);
  ctx.lineTo(windshield.x + windshield.w - windshield.r, windshield.y);
  ctx.quadraticCurveTo(windshield.x + windshield.w, windshield.y, windshield.x + windshield.w, windshield.y + windshield.r);
  ctx.lineTo(windshield.x + windshield.w, windshield.y + windshield.h - windshield.r);
  ctx.quadraticCurveTo(
    windshield.x + windshield.w,
    windshield.y + windshield.h,
    windshield.x + windshield.w - windshield.r,
    windshield.y + windshield.h
  );
  ctx.lineTo(windshield.x + windshield.r, windshield.y + windshield.h);
  ctx.quadraticCurveTo(windshield.x, windshield.y + windshield.h, windshield.x, windshield.y + windshield.h - windshield.r);
  ctx.lineTo(windshield.x, windshield.y + windshield.r);
  ctx.quadraticCurveTo(windshield.x, windshield.y, windshield.x + windshield.r, windshield.y);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "rgba(39, 58, 75, 0.76)";
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.fillStyle = "rgba(255, 255, 255, 0.38)";
  ctx.fillRect(24.4, -11.1, 8.8, 2.1);

  ctx.fillStyle = "#f0f4f7";
  ctx.fillRect(43.5, -9.5, 2.5, 8.2);
  ctx.fillRect(43.5, 1.3, 2.5, 8.2);
  ctx.fillStyle = "#ffb85d";
  ctx.fillRect(42.5, -0.8, 2.8, 2.2);
  ctx.fillRect(42.5, 0.8, 2.8, 2.2);

  ctx.fillStyle = "#d6434c";
  ctx.fillRect(-56, -9.2, 3, 8.4);
  ctx.fillRect(-56, 0.8, 3, 8.4);
  ctx.fillStyle = "#ffd886";
  ctx.fillRect(-54.8, -0.8, 2, 2.2);
  ctx.fillRect(-54.8, 0.8, 2, 2.2);

  if (state.vehicleDoors.driver) {
    ctx.fillStyle = "#be202b";
    ctx.beginPath();
    ctx.moveTo(20, -22);
    ctx.lineTo(34, -22);
    ctx.lineTo(38, -34);
    ctx.lineTo(24, -34);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "#f2aeb6";
    ctx.lineWidth = 1.2;
    ctx.stroke();
  }
  if (state.vehicleDoors.right) {
    ctx.fillStyle = "#be202b";
    ctx.beginPath();
    ctx.moveTo(-16, 22);
    ctx.lineTo(4, 22);
    ctx.lineTo(8, 34);
    ctx.lineTo(-12, 34);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "#f2aeb6";
    ctx.lineWidth = 1.2;
    ctx.stroke();
  }
  if (state.vehicleDoors.rear) {
    ctx.fillStyle = "#b31b26";
    ctx.fillRect(-64, -12, 12, 24);
    ctx.strokeStyle = "#f2aeb6";
    ctx.lineWidth = 1.2;
    ctx.strokeRect(-64, -12, 12, 24);
    ctx.strokeStyle = "rgba(248, 220, 224, 0.65)";
    ctx.beginPath();
    ctx.moveTo(-58, -11);
    ctx.lineTo(-58, 11);
    ctx.stroke();
  }

  if (state.inTruck) {
    // Driver avatar in left-front seat while operating the van.
    ctx.fillStyle = "#c9252f";
    ctx.fillRect(19, -8.5, 10, 8);
    ctx.fillStyle = "#141518";
    ctx.fillRect(19, -0.5, 10, 6);
    ctx.fillStyle = "#f2c7a0";
    ctx.beginPath();
    ctx.arc(24, -12.5, 4.5, 0, Math.PI * 2);
    ctx.fill();
    drawBallCap(24, -12.5, { color: "#b6121e", scale: 0.62, brimDirection: 1 });
    ctx.fillStyle = "#101216";
    ctx.fillRect(18, 0.8, 12, 3);
  }

  if (state.trainerMode && state.inTruck) {
    ctx.fillStyle = "#c9252f";
    ctx.fillRect(19, 4, 10, 8);
    ctx.fillStyle = "#141518";
    ctx.fillRect(19, 12, 10, 6);
    ctx.fillStyle = "#f2c7a0";
    ctx.beginPath();
    ctx.arc(24, 0, 4.5, 0, Math.PI * 2);
    ctx.fill();
    drawBallCap(24, 0, { color: "#b6121e", scale: 0.64, brimDirection: 1 });
    ctx.fillStyle = "#101216";
    ctx.fillRect(18, 13, 12, 3);
  }

  ctx.restore();
}

function drawMapBoundaries() {
  ctx.strokeStyle = "rgba(40, 68, 39, 0.45)";
  ctx.lineWidth = 4;
  ctx.strokeRect(0, 0, world.width, world.height);
}

function drawGpsPanel() {
  if (!gpsCtx || !gpsCanvas || !state.inTruck) {
    return;
  }

  const dpr = window.devicePixelRatio || 1;
  const width = Math.floor(gpsCanvas.clientWidth * dpr);
  const height = Math.floor(gpsCanvas.clientHeight * dpr);

  if (gpsCanvas.width !== width || gpsCanvas.height !== height) {
    gpsCanvas.width = width;
    gpsCanvas.height = height;
  }

  gpsCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
  gpsCtx.clearRect(0, 0, gpsCanvas.clientWidth, gpsCanvas.clientHeight);

  const innerPad = 8;
  const miniWidth = gpsCanvas.clientWidth - innerPad * 2;
  const miniHeight = gpsCanvas.clientHeight - innerPad * 2;

  const scale = Math.min(miniWidth / world.width, miniHeight / world.height);
  const offsetX = innerPad + (miniWidth - world.width * scale) / 2;
  const offsetY = innerPad + (miniHeight - world.height * scale) / 2;

  gpsCtx.fillStyle = "#1f2b22";
  gpsCtx.fillRect(0, 0, gpsCanvas.clientWidth, gpsCanvas.clientHeight);

  roads.forEach((road) => {
    gpsCtx.fillStyle = "#3f4e43";
    gpsCtx.fillRect(offsetX + road.x * scale, offsetY + road.y * scale, road.w * scale, road.h * scale);
  });

  gpsCtx.strokeStyle = "rgba(114, 222, 255, 0.95)";
  gpsCtx.lineWidth = 1.8;
  gpsCtx.beginPath();
  route.forEach((point, index) => {
    const px = offsetX + point.x * scale;
    const py = offsetY + point.y * scale;
    if (index === 0) {
      gpsCtx.moveTo(px, py);
    } else {
      gpsCtx.lineTo(px, py);
    }
  });
  gpsCtx.stroke();

  gpsCtx.fillStyle = "rgba(246, 240, 95, 0.75)";
  gpsCtx.fillRect(
    offsetX + parkingSpot.x * scale,
    offsetY + parkingSpot.y * scale,
    Math.max(2, parkingSpot.w * scale),
    Math.max(2, parkingSpot.h * scale)
  );

  gpsCtx.fillStyle = "#ff4d5b";
  gpsCtx.beginPath();
  gpsCtx.arc(offsetX + truck.x * scale, offsetY + truck.y * scale, 3.3, 0, Math.PI * 2);
  gpsCtx.fill();
}

function drawAreaMapOverlay() {
  if (!state.mapOpen) {
    return;
  }

  const panelWidth = Math.min(view.width * 0.9, 920);
  const panelHeight = Math.min(view.height * 0.88, 620);
  const panelX = (view.width - panelWidth) / 2;
  const panelY = (view.height - panelHeight) / 2;

  const mapPadX = 24;
  const mapPadTop = 58;
  const mapPadBottom = 44;
  const mapWidth = panelWidth - mapPadX * 2;
  const mapHeight = panelHeight - mapPadTop - mapPadBottom;
  const mapScale = Math.min(mapWidth / world.width, mapHeight / world.height);
  const drawWidth = world.width * mapScale;
  const drawHeight = world.height * mapScale;
  const mapX = panelX + mapPadX + (mapWidth - drawWidth) / 2;
  const mapY = panelY + mapPadTop + (mapHeight - drawHeight) / 2;

  const toMapX = (x) => mapX + x * mapScale;
  const toMapY = (y) => mapY + y * mapScale;

  ctx.save();
  ctx.fillStyle = "rgba(10, 16, 12, 0.62)";
  ctx.fillRect(0, 0, view.width, view.height);

  ctx.fillStyle = "rgba(252, 255, 248, 0.98)";
  ctx.strokeStyle = "rgba(43, 73, 45, 0.75)";
  ctx.lineWidth = 2;
  ctx.fillRect(panelX, panelY, panelWidth, panelHeight);
  ctx.strokeRect(panelX, panelY, panelWidth, panelHeight);

  ctx.fillStyle = "#1f3f24";
  ctx.font = "700 22px 'Space Grotesk', sans-serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillText("Neighborhood Map", panelX + 18, panelY + 14);

  ctx.fillStyle = "#3f5e44";
  ctx.font = "600 13px Outfit, sans-serif";
  ctx.fillText("All houses and streets are shown. Press M to close.", panelX + 18, panelY + 38);

  ctx.fillStyle = "#b9d995";
  ctx.fillRect(mapX, mapY, drawWidth, drawHeight);

  roads.forEach((road) => {
    ctx.fillStyle = "#4a535b";
    ctx.fillRect(
      toMapX(road.x),
      toMapY(road.y),
      Math.max(2, road.w * mapScale),
      Math.max(2, road.h * mapScale)
    );
  });

  houses.forEach((house, index) => {
    const houseX = toMapX(house.x);
    const houseY = toMapY(house.y);
    const houseW = Math.max(3, house.w * mapScale);
    const houseH = Math.max(3, house.h * mapScale);
    const houseNumber = getHouseNumber(house, index);
    const label = house.id === "home" ? `Home ${houseNumber}` : house.id === "target" ? `Stop 1 (${houseNumber})` : houseNumber;

    ctx.fillStyle = house.id === "target" ? "#ffdf8f" : house.id === "home" ? "#d8f0ff" : "#e7f2d4";
    ctx.fillRect(houseX, houseY, houseW, houseH);
    ctx.strokeStyle = "rgba(53, 72, 45, 0.8)";
    ctx.lineWidth = 1;
    ctx.strokeRect(houseX, houseY, houseW, houseH);

    ctx.fillStyle = "#263a27";
    ctx.font = "700 12px Outfit, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";
    ctx.fillText(label, houseX + houseW / 2, houseY - 2);
  });

  if (state.noSprayZones.length > 0 && SERVICE_PHASES.has(state.phase)) {
    state.noSprayZones.forEach((zone) => {
      ctx.fillStyle = zone.moved
        ? "#8aa696"
        : zone.type === "flowers"
          ? "#d84f72"
          : zone.type === "toys"
            ? (zone.toyGroup === "dog" ? "#57b3d9" : "#f0b453")
            : "#5a9f53";
      ctx.beginPath();
      ctx.arc(toMapX(zone.x), toMapY(zone.y), Math.max(2.2, zone.radius * mapScale * 0.45), 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#8d2f38";
      ctx.lineWidth = 1;
      ctx.stroke();
    });
  }

  ctx.fillStyle = "rgba(255, 242, 86, 0.65)";
  ctx.fillRect(
    toMapX(parkingSpot.x),
    toMapY(parkingSpot.y),
    Math.max(2, parkingSpot.w * mapScale),
    Math.max(2, parkingSpot.h * mapScale)
  );

  ctx.fillStyle = "#cf2630";
  ctx.beginPath();
  ctx.arc(toMapX(truck.x), toMapY(truck.y), 4.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#1f4dce";
  ctx.beginPath();
  ctx.arc(toMapX(player.x), toMapY(player.y), 3.8, 0, Math.PI * 2);
  ctx.fill();

  const legendY = panelY + panelHeight - 26;
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.font = "600 12px Outfit, sans-serif";
  ctx.fillStyle = "#2f4331";
  ctx.fillText("Truck", panelX + 40, legendY);
  ctx.fillText("You", panelX + 138, legendY);
  ctx.fillText("Target Parking", panelX + 212, legendY);

  ctx.fillStyle = "#cf2630";
  ctx.beginPath();
  ctx.arc(panelX + 24, legendY, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#1f4dce";
  ctx.beginPath();
  ctx.arc(panelX + 122, legendY, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(255, 242, 86, 0.88)";
  ctx.fillRect(panelX + 188, legendY - 6, 14, 12);

  ctx.restore();
}

function drawFirstPersonWebbing(webTargets) {
  webTargets.forEach((item) => {
    ctx.save();
    ctx.strokeStyle = "rgba(242, 248, 255, 0.92)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(item.x, item.y, item.radius, 0, Math.PI * 2);
    ctx.stroke();

    ctx.lineWidth = 1.1;
    for (let index = 0; index < 8; index += 1) {
      const angle = (Math.PI * 2 * index) / 8;
      ctx.beginPath();
      ctx.moveTo(item.x, item.y);
      ctx.lineTo(item.x + Math.cos(angle) * item.radius, item.y + Math.sin(angle) * item.radius);
      ctx.stroke();
    }

    ctx.strokeStyle = "rgba(244, 252, 255, 0.64)";
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.arc(item.x, item.y, item.radius * 0.58, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  });
}

function drawFirstPersonWebsterStrike(side) {
  if (!state.websterStrike.active || state.websterStrike.timer <= 0) {
    return;
  }
  if (state.websterStrike.side && side && state.websterStrike.side !== side) {
    return;
  }

  const duration = Math.max(0.01, state.websterStrike.duration || WEBSTER_STRIKE_DURATION);
  const progress = clamp(1 - (state.websterStrike.timer / duration), 0, 1);
  const eased = 1 - Math.pow(1 - progress, 3);
  const startX = view.width * 0.54;
  const startY = view.height - 22;
  const sweep = Math.sin(progress * Math.PI) * 16 * (1 - progress * 0.2);
  const headX = lerp(startX, state.websterStrike.x, eased) + sweep;
  const headY = lerp(startY, state.websterStrike.y, eased) - Math.sin(progress * Math.PI) * 8;
  const strikeAngle = Math.atan2(state.websterStrike.y - headY, state.websterStrike.x - headX);

  ctx.save();
  ctx.strokeStyle = "#77818e";
  ctx.lineWidth = 4;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(headX, headY);
  ctx.stroke();

  ctx.strokeStyle = "#f3f6fb";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(
    headX + Math.cos(strikeAngle + Math.PI / 2) * 8,
    headY + Math.sin(strikeAngle + Math.PI / 2) * 8
  );
  ctx.lineTo(
    headX + Math.cos(strikeAngle - Math.PI / 2) * 8,
    headY + Math.sin(strikeAngle - Math.PI / 2) * 8
  );
  ctx.stroke();

  if (state.websterStrike.hit && progress > 0.32) {
    const flashAlpha = clamp((1 - progress) * 1.4, 0, 0.82);
    ctx.strokeStyle = `rgba(239, 247, 255, ${flashAlpha.toFixed(3)})`;
    ctx.lineWidth = 1.6;
    for (let index = 0; index < 6; index += 1) {
      const angle = (Math.PI * 2 * index) / 6;
      const burst = 7 + Math.sin(progress * Math.PI) * 5;
      ctx.beginPath();
      ctx.moveTo(state.websterStrike.x, state.websterStrike.y);
      ctx.lineTo(
        state.websterStrike.x + Math.cos(angle) * burst,
        state.websterStrike.y + Math.sin(angle) * burst
      );
      ctx.stroke();
    }
  }
  ctx.restore();
}

function drawFirstPersonCrewMember(x, y, scale = 1, palette = {}) {
  const shirt = palette.shirt || "#c9252f";
  const pants = palette.pants || "#141518";
  const skin = palette.skin || "#f5c89c";
  const hat = palette.hat || "#b6121e";

  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);

  ctx.fillStyle = "rgba(0, 0, 0, 0.16)";
  ctx.beginPath();
  ctx.ellipse(0, 12, 10, 4.8, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = shirt;
  ctx.fillRect(-8.6, -7, 17.2, 12);
  ctx.fillStyle = pants;
  ctx.fillRect(-8.6, 5, 17.2, 9.5);
  ctx.fillStyle = "#101216";
  ctx.fillRect(-8.2, 14.5, 6.2, 3.5);
  ctx.fillRect(2, 14.5, 6.2, 3.5);

  ctx.fillStyle = skin;
  ctx.beginPath();
  ctx.arc(0, -11, 6.8, 0, Math.PI * 2);
  ctx.fill();
  drawBallCap(0, -11, { color: hat, scale: 0.98, brimDirection: 1 });

  ctx.restore();
}

function drawFirstPersonCrewPresence() {
  const baseY = view.height - 34;

  ctx.save();
  ctx.globalAlpha = 0.88;
  drawFirstPersonCrewMember(62, baseY, 0.92, {
    shirt: "#c9252f",
    pants: "#141518",
    hat: "#b6121e"
  });
  if (state.trainerMode && !state.inTruck) {
    drawFirstPersonCrewMember(view.width - 64, baseY, 0.9, {
      shirt: "#b81d27",
      pants: "#15181c",
      hat: "#b6121e"
    });
  }
  ctx.restore();
}

function drawFirstPersonView() {
  if (!state.firstPerson.active || !targetHouse) {
    return;
  }

  const layout = getFirstPersonViewLayout(state.firstPerson.side || "north");
  const side = layout.side;
  const sideLabel = SIDE_LABELS[side] || "Side";
  const sprayPoint = getFirstPersonSprayPoint(layout);
  const sprayRadius = getCurrentSprayBrushRadius();
  const isWebsterPhase = state.phase === "webster_working";
  const webTargets = isWebsterPhase ? getFirstPersonWebTargets(layout) : [];
  const sideOpeningCoverage = getSideOpeningCoverage(side);

  const skyGrad = ctx.createLinearGradient(0, 0, 0, view.height);
  skyGrad.addColorStop(0, "#b8d7f0");
  skyGrad.addColorStop(0.45, "#d9ecf8");
  skyGrad.addColorStop(1, "#9ec179");
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, view.width, view.height);

  ctx.fillStyle = "rgba(105, 136, 78, 0.34)";
  ctx.beginPath();
  ctx.moveTo(0, view.height * 0.73);
  ctx.lineTo(view.width, view.height * 0.73);
  ctx.lineTo(view.width, view.height);
  ctx.lineTo(0, view.height);
  ctx.closePath();
  ctx.fill();

  const sidingGrad = ctx.createLinearGradient(layout.wallX, layout.wallY, layout.wallX, layout.wallY + layout.wallH);
  sidingGrad.addColorStop(0, shadeColor(targetHouse.color, 0.16));
  sidingGrad.addColorStop(1, shadeColor(targetHouse.color, -0.12));
  ctx.fillStyle = sidingGrad;
  ctx.fillRect(layout.wallX, layout.wallY, layout.wallW, layout.wallH);

  ctx.strokeStyle = colorWithAlpha(targetHouse.roof, 0.5);
  ctx.lineWidth = 2;
  ctx.strokeRect(layout.wallX, layout.wallY, layout.wallW, layout.wallH);

  ctx.fillStyle = shadeColor(targetHouse.roof, -0.08);
  ctx.fillRect(layout.wallX - 6, layout.wallY - layout.eaveH, layout.wallW + 12, layout.eaveH + 4);
  ctx.fillStyle = colorWithAlpha(targetHouse.roof, 0.38);
  ctx.fillRect(layout.wallX - 2, layout.wallY - 3, layout.wallW + 4, 6);

  ctx.fillStyle = "#9a9078";
  ctx.fillRect(layout.wallX, layout.wallY + layout.wallH - layout.foundationH, layout.wallW, layout.foundationH);

  ctx.strokeStyle = colorWithAlpha(targetHouse.color, 0.26);
  ctx.lineWidth = 1;
  for (let y = layout.wallY + 12; y < layout.wallY + layout.wallH - layout.foundationH - 4; y += 14) {
    ctx.beginPath();
    ctx.moveTo(layout.wallX + 6, y);
    ctx.lineTo(layout.wallX + layout.wallW - 6, y);
    ctx.stroke();
  }
  layout.windowRects.forEach((rect, index) => {
    ctx.fillStyle = "#efe6d7";
    ctx.fillRect(rect.x - 5, rect.y - 5, rect.w + 10, rect.h + 10);
    const paneGrad = ctx.createLinearGradient(rect.x, rect.y, rect.x, rect.y + rect.h);
    paneGrad.addColorStop(0, "#dbf0ff");
    paneGrad.addColorStop(1, "#9fc5de");
    ctx.fillStyle = paneGrad;
    ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
    ctx.strokeStyle = "rgba(33, 56, 72, 0.76)";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(rect.x, rect.y, rect.w, rect.h);
    ctx.strokeStyle = "rgba(245, 251, 255, 0.85)";
    ctx.beginPath();
    ctx.moveTo(rect.x + rect.w / 2, rect.y + 2);
    ctx.lineTo(rect.x + rect.w / 2, rect.y + rect.h - 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(rect.x + 2, rect.y + rect.h / 2);
    ctx.lineTo(rect.x + rect.w - 2, rect.y + rect.h / 2);
    ctx.stroke();

    if (state.phase === "working") {
      const openingPercent = index === 0 ? sideOpeningCoverage.windowLeft : sideOpeningCoverage.windowRight;
      const remainingRatio = clamp((100 - openingPercent) / 100, 0, 1);
      if (remainingRatio > 0.02) {
        const targetRect = layout.windowTargetRects[index];
        const dashAlpha = 0.12 + remainingRatio * 0.76;
        ctx.strokeStyle = `rgba(100, 220, 147, ${dashAlpha.toFixed(3)})`;
        ctx.lineWidth = 1.25 + remainingRatio * 1.15;
        ctx.setLineDash([8, 6]);
        ctx.strokeRect(targetRect.x, targetRect.y, targetRect.w, targetRect.h);
        ctx.setLineDash([]);
      }
    }
  });

  if (layout.doorRect) {
    const doorGrad = ctx.createLinearGradient(layout.doorRect.x, layout.doorRect.y, layout.doorRect.x, layout.doorRect.y + layout.doorRect.h);
    doorGrad.addColorStop(0, "#896048");
    doorGrad.addColorStop(1, "#684431");
    ctx.fillStyle = doorGrad;
    ctx.fillRect(layout.doorRect.x, layout.doorRect.y, layout.doorRect.w, layout.doorRect.h);
    ctx.strokeStyle = "#4a2e1f";
    ctx.lineWidth = 1.4;
    ctx.strokeRect(layout.doorRect.x, layout.doorRect.y, layout.doorRect.w, layout.doorRect.h);
    ctx.fillStyle = "#d9c08a";
    ctx.beginPath();
    ctx.arc(layout.doorRect.x + layout.doorRect.w - 8, layout.doorRect.y + layout.doorRect.h / 2, 2.2, 0, Math.PI * 2);
    ctx.fill();

    if (state.phase === "working") {
      const doorRemainingRatio = clamp((100 - sideOpeningCoverage.door) / 100, 0, 1);
      if (doorRemainingRatio > 0.02) {
        const dashAlpha = 0.12 + doorRemainingRatio * 0.76;
        ctx.strokeStyle = `rgba(98, 218, 144, ${dashAlpha.toFixed(3)})`;
        ctx.lineWidth = 1.25 + doorRemainingRatio * 1.15;
        ctx.setLineDash([8, 6]);
        ctx.strokeRect(layout.doorTargetRect.x, layout.doorTargetRect.y, layout.doorTargetRect.w, layout.doorTargetRect.h);
        ctx.setLineDash([]);
      }
      ctx.strokeStyle = "rgba(225, 83, 93, 0.9)";
      ctx.lineWidth = 1.8;
      ctx.setLineDash([5, 5]);
      ctx.strokeRect(layout.doorRect.x, layout.doorRect.y, layout.doorRect.w, layout.doorRect.h);
      ctx.setLineDash([]);
    }
  }

  drawFirstPersonSprayTrail(layout, side);

  if (isWebsterPhase) {
    drawFirstPersonWebbing(webTargets);
  }

  layout.sideZones.forEach((zoneItem) => {
    const zone = zoneItem.zone;
    const zoneX = zoneItem.center.x;
    const zoneBaseY = zoneItem.center.y + zoneItem.size * 0.35;
    const size = zoneItem.size;

    ctx.strokeStyle = "rgba(227, 87, 96, 0.8)";
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 5]);
    ctx.beginPath();
    ctx.arc(zoneX, zoneBaseY - size * 0.35, size * 0.92, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    if (zone.type === "flowers") {
      ctx.fillStyle = "#8b6447";
      ctx.beginPath();
      ctx.ellipse(zoneX, zoneBaseY, size * 0.85, size * 0.4, 0, 0, Math.PI * 2);
      ctx.fill();
      const petalColors = ["#f05d79", "#f2c64f", "#ec7cc3"];
      for (let i = 0; i < 5; i += 1) {
        const angle = (Math.PI * 2 * i) / 5;
        ctx.fillStyle = petalColors[i % petalColors.length];
        ctx.beginPath();
        ctx.arc(
          zoneX + Math.cos(angle) * size * 0.34,
          zoneBaseY - size * 0.56 + Math.sin(angle) * size * 0.22,
          size * 0.17,
          0,
          Math.PI * 2
        );
        ctx.fill();
      }
      ctx.fillStyle = "#f3d46b";
      ctx.beginPath();
      ctx.arc(zoneX, zoneBaseY - size * 0.56, size * 0.14, 0, Math.PI * 2);
      ctx.fill();
    } else if (zone.type === "toys") {
      if (zone.toyGroup === "dog") {
        if (zone.toyType === "frisbee") {
          ctx.fillStyle = "#57b3d9";
          ctx.beginPath();
          ctx.ellipse(zoneX, zoneBaseY - size * 0.25, size * 0.38, size * 0.18, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = "#ddf6ff";
          ctx.lineWidth = 1.2;
          ctx.stroke();
        } else {
          ctx.fillStyle = "#f0c98b";
          ctx.beginPath();
          ctx.arc(zoneX - size * 0.24, zoneBaseY - size * 0.25, size * 0.14, 0, Math.PI * 2);
          ctx.arc(zoneX + size * 0.24, zoneBaseY - size * 0.25, size * 0.14, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillRect(zoneX - size * 0.24, zoneBaseY - size * 0.34, size * 0.48, size * 0.18);
        }
      } else if (zone.toyType === "truck") {
        ctx.fillStyle = "#5a89d8";
        ctx.fillRect(zoneX - size * 0.46, zoneBaseY - size * 0.5, size * 0.92, size * 0.34);
        ctx.fillStyle = "#dd6158";
        ctx.fillRect(zoneX - size * 0.36, zoneBaseY - size * 0.18, size * 0.72, size * 0.26);
        ctx.fillStyle = "#2d2f33";
        ctx.beginPath();
        ctx.arc(zoneX - size * 0.24, zoneBaseY + size * 0.1, size * 0.14, 0, Math.PI * 2);
        ctx.arc(zoneX + size * 0.24, zoneBaseY + size * 0.1, size * 0.14, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillStyle = "#f1b24d";
        ctx.beginPath();
        ctx.arc(zoneX, zoneBaseY - size * 0.25, size * 0.33, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#f6d894";
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.arc(zoneX, zoneBaseY - size * 0.25, size * 0.33, 0, Math.PI * 2);
        ctx.stroke();
      }
    } else {
      ctx.fillStyle = "#6f4a34";
      ctx.fillRect(zoneX - size * 0.72, zoneBaseY - size * 0.55, size * 1.44, size * 0.45);
      ctx.strokeStyle = "#8b6343";
      ctx.lineWidth = 1.1;
      ctx.strokeRect(zoneX - size * 0.72, zoneBaseY - size * 0.55, size * 1.44, size * 0.45);
      ctx.fillStyle = "#4d9a4f";
      for (let i = -1; i <= 1; i += 1) {
        ctx.fillRect(zoneX + i * size * 0.24 - 1.2, zoneBaseY - size * 0.78, 2.4, size * 0.3);
      }
      ctx.fillStyle = zone.produceType === "cucumbers" ? "#69b45c" : "#d84f4f";
      for (let i = -1; i <= 1; i += 1) {
        ctx.beginPath();
        if (zone.produceType === "cucumbers") {
          ctx.ellipse(zoneX + i * size * 0.24, zoneBaseY - size * 0.7, size * 0.12, size * 0.07, 0.15, 0, Math.PI * 2);
        } else {
          ctx.arc(zoneX + i * size * 0.24, zoneBaseY - size * 0.7, size * 0.09, 0, Math.PI * 2);
        }
        ctx.fill();
      }
    }
  });

  drawFirstPersonCrewPresence();

  if (state.sprayActive) {
    const beamWidth = clamp(sprayRadius * 0.56, 3, 12);
    const sourceX = view.width / 2 + Math.sin(state.timeMs * 0.018) * 4;
    const sourceY = view.height - 26;

    ctx.strokeStyle = "rgba(165, 221, 255, 0.7)";
    ctx.lineWidth = beamWidth;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(sourceX, sourceY);
    ctx.lineTo(sprayPoint.x, sprayPoint.y);
    ctx.stroke();

    ctx.strokeStyle = "rgba(212, 239, 255, 0.82)";
    ctx.lineWidth = Math.max(1.4, beamWidth * 0.5);
    ctx.beginPath();
    ctx.moveTo(sourceX, sourceY);
    ctx.lineTo(sprayPoint.x + Math.sin(state.timeMs * 0.012) * 2.2, sprayPoint.y - 1);
    ctx.stroke();

    ctx.fillStyle = "rgba(205, 233, 252, 0.72)";
    ctx.beginPath();
    ctx.arc(sprayPoint.x, sprayPoint.y, Math.max(1.5, beamWidth * 0.44), 0, Math.PI * 2);
    ctx.fill();
  }

  if (!isWebsterPhase) {
    const overProtected = layout.sideZones.some((item) => distance(sprayPoint, item.center) <= (sprayRadius + item.hitRadius));
    ctx.strokeStyle = overProtected ? "rgba(241, 119, 119, 0.92)" : "rgba(232, 246, 255, 0.8)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(sprayPoint.x, sprayPoint.y, sprayRadius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = overProtected ? "rgba(236, 96, 96, 0.09)" : "rgba(195, 225, 247, 0.08)";
    ctx.beginPath();
    ctx.arc(sprayPoint.x, sprayPoint.y, sprayRadius, 0, Math.PI * 2);
    ctx.fill();
  } else {
    ctx.strokeStyle = "rgba(236, 245, 255, 0.9)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(sprayPoint.x - 9, sprayPoint.y);
    ctx.lineTo(sprayPoint.x + 9, sprayPoint.y);
    ctx.moveTo(sprayPoint.x, sprayPoint.y - 9);
    ctx.lineTo(sprayPoint.x, sprayPoint.y + 9);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(sprayPoint.x, sprayPoint.y, 11, 0, Math.PI * 2);
    ctx.stroke();
  }

  if (isWebsterPhase) {
    drawFirstPersonWebsterStrike(side);
  }

  if (state.nearbyNoSprayZoneType) {
    ctx.fillStyle = "rgba(46, 24, 24, 0.6)";
    ctx.fillRect(14, view.height - 76, 260, 46);
    ctx.strokeStyle = "rgba(241, 143, 143, 0.86)";
    ctx.lineWidth = 1.4;
    ctx.strokeRect(14, view.height - 76, 260, 46);
    ctx.fillStyle = "#ffd9d2";
    ctx.font = "700 13px 'Space Grotesk', sans-serif";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText(
      state.nearbyNoSprayZoneType === "flowers"
        ? "Protected flowers nearby"
        : state.nearbyNoSprayZoneType === "toys"
          ? "Protected toys nearby (press E to move)"
          : "Protected vegetables nearby",
      24,
      view.height - 52
    );
  }

  ctx.fillStyle = "rgba(14, 22, 16, 0.52)";
  ctx.fillRect(14, 14, 310, 56);
  ctx.strokeStyle = "rgba(176, 225, 186, 0.56)";
  ctx.lineWidth = 1.2;
  ctx.strokeRect(14, 14, 310, 56);
  ctx.fillStyle = "#dff2dc";
  ctx.font = "700 15px 'Space Grotesk', sans-serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillText(`First Person View: ${sideLabel}`, 24, 24);
  ctx.font = "600 12px Outfit, sans-serif";
  ctx.fillStyle = "#c6ddc4";
  if (isWebsterPhase) {
    ctx.fillText(`Click each web to knock it down (${webTargets.length} on this side).`, 24, 46);
  } else {
    ctx.fillText("Paint with mouse circle. Trace every window and door box on this side.", 24, 46);
  }
}

function drawRainOverlay() {
  if (!state.rain.active) {
    return;
  }

  const drift = (state.timeMs * 0.028) % 28;
  ctx.save();
  ctx.fillStyle = "rgba(44, 55, 78, 0.035)";
  ctx.fillRect(0, 0, view.width, view.height);
  ctx.strokeStyle = "rgba(170, 204, 245, 0.24)";
  ctx.lineWidth = 1;

  for (let y = -24; y < view.height + 28; y += 30) {
    for (let x = -20; x < view.width + 30; x += 52) {
      const jitter = ((x * 17 + y * 9) % 18);
      const dropX = x + ((drift + jitter) % 24);
      const dropY = y + ((drift * 0.55 + jitter * 0.35) % 18);
      ctx.beginPath();
      ctx.moveTo(dropX, dropY);
      ctx.lineTo(dropX - 4, dropY + 10);
      ctx.stroke();
    }
  }

  ctx.restore();
}

function drawDingOverlay() {
  if (state.dingAnimationTimer <= 0) {
    return;
  }

  const t = clamp(state.dingAnimationTimer / 0.55, 0, 1);
  const sprayDing = state.sprayViolationFlashTimer > 0;
  const borderAlpha = sprayDing ? (0.44 + t * 0.4) : (0.26 + t * 0.34);
  const cardAlpha = sprayDing ? (0.58 + t * 0.3) : (0.46 + t * 0.26);
  const lift = (1 - t) * 8;

  ctx.save();
  if (sprayDing) {
    const flashT = clamp(state.sprayViolationFlashTimer / 0.38, 0, 1);
    const flashAlpha = 0.08 + flashT * 0.14;
    ctx.fillStyle = `rgba(193, 28, 42, ${flashAlpha.toFixed(3)})`;
    ctx.fillRect(0, 0, view.width, view.height);
  }

  const hasDetail = String(state.dingAnimationDetail || "").trim().length > 0;
  const cardW = Math.min(460, view.width - 40);
  const cardH = hasDetail ? 56 : 40;
  const cardX = (view.width - cardW) / 2;
  const cardY = 18 - lift;
  ctx.shadowBlur = 14;
  ctx.shadowColor = sprayDing ? "rgba(97, 9, 18, 0.46)" : "rgba(46, 5, 9, 0.34)";
  ctx.fillStyle = sprayDing
    ? `rgba(112, 14, 24, ${cardAlpha.toFixed(3)})`
    : `rgba(45, 9, 12, ${cardAlpha.toFixed(3)})`;
  ctx.strokeStyle = sprayDing
    ? `rgba(255, 101, 115, ${borderAlpha.toFixed(3)})`
    : `rgba(254, 164, 132, ${borderAlpha.toFixed(3)})`;
  ctx.lineWidth = 2;
  ctx.fillRect(cardX, cardY, cardW, cardH);
  ctx.strokeRect(cardX, cardY, cardW, cardH);
  ctx.fillStyle = sprayDing ? "#ffd5db" : "#ffe3d6";
  ctx.font = "700 14px 'Space Grotesk', sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = hasDetail ? "alphabetic" : "middle";
  if (hasDetail) {
    ctx.fillText(state.dingAnimationText || "DING", cardX + cardW / 2, cardY + 22);
    ctx.fillStyle = sprayDing ? "#ffeaee" : "#fff1e8";
    ctx.font = "600 11px Outfit, sans-serif";
    ctx.fillText(state.dingAnimationDetail, cardX + cardW / 2, cardY + 40);
  } else {
    ctx.fillText(state.dingAnimationText || "DING", cardX + cardW / 2, cardY + cardH / 2);
  }
  ctx.restore();
}

function render() {
  ctx.clearRect(0, 0, view.width, view.height);
  if (state.firstPerson.active && !state.mapOpen) {
    drawFirstPersonView();
  } else {
    ctx.fillStyle = "#bcd89a";
    ctx.fillRect(0, 0, view.width, view.height);

    ctx.save();
    applyWorldCameraTransform();

    drawGround();
    roads.forEach(drawRoad);
    drawSpeedLimitSigns();
    drawStreetNameSigns();
    drawHouses();
    drawNoSprayZones();
    drawPremierBarrierTargets();
    drawRoute();
    drawParkingSpot();
    drawHouseParkingSpots();
    drawVehicleDoorAccessZones();
    drawDoorCheckInZone();
    drawWebsterPickupZone();
    drawWebTargets();
    drawActiveServiceSideHighlight();
    drawTrainerFollower();
    drawPlayer();
    drawSprayerRig();
    drawTruck();
    drawMapBoundaries();

    ctx.restore();
  }

  drawGpsPanel();
  drawAreaMapOverlay();
  drawRainOverlay();
  drawDingOverlay();
}

function resizeCanvas() {
  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;

  view.width = rect.width;
  view.height = rect.height;

  canvas.width = Math.floor(rect.width * dpr);
  canvas.height = Math.floor(rect.height * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  if (!state.pointer.insideCanvas) {
    state.pointer.x = rect.width / 2;
    state.pointer.y = rect.height / 2;
  } else {
    state.pointer.x = clamp(state.pointer.x, 0, rect.width);
    state.pointer.y = clamp(state.pointer.y, 0, rect.height);
  }
}

function update(dt) {
  clearAiErrorToastCooldown(dt);
  updateDayProgressAutosave(dt);

  if (!state.disclaimerAccepted) {
    state.sprayActive = false;
    if (dashboard) {
      dashboard.hidden = true;
    }
    return;
  }

  if (state.deckStairCooldown > 0) {
    state.deckStairCooldown = Math.max(0, state.deckStairCooldown - dt);
  }

  if (!state.mapOpen) {
    if (state.inTruck) {
      applyTruckPhysics(dt);
    } else {
      updatePlayer(dt);
    }
    updateTrainerFollower(dt);
    maybeTriggerRain(dt);
    updateMission(dt);
    updateSprayerSystem(dt);
    updateCamera(dt);
  } else {
    state.sprayActive = false;
  }
  updateFirstPersonMode();
  updateHud();
  updateCustomerDialogUi();
  updateSideProfilePanel();
  updateTrainerPanel();

  if (state.dingAnimationTimer > 0) {
    state.dingAnimationTimer = Math.max(0, state.dingAnimationTimer - dt);
    if (state.dingAnimationTimer === 0) {
      state.dingAnimationText = "";
      state.dingAnimationDetail = "";
    }
  }
  if (state.sprayViolationFlashTimer > 0) {
    state.sprayViolationFlashTimer = Math.max(0, state.sprayViolationFlashTimer - dt);
  }
  if (state.websterStrike.active) {
    state.websterStrike.timer = Math.max(0, state.websterStrike.timer - dt);
    if (state.websterStrike.timer === 0) {
      state.websterStrike.active = false;
      state.websterStrike.side = "";
      state.websterStrike.hit = false;
    }
  }

  if (state.completionBannerTimer > 0) {
    state.completionBannerTimer = Math.max(0, state.completionBannerTimer - dt);
    if (state.completionBannerTimer === 0 && missionCompleteCard) {
      missionCompleteCard.hidden = true;
    }
  }

  if (dashboard) {
    dashboard.hidden = !state.inTruck;
  }
}

let lastTime = performance.now();
function tick(now) {
  const dt = Math.min((now - lastTime) / 1000, 0.05);
  lastTime = now;
  state.timeMs = now;

  update(dt);
  render();

  requestAnimationFrame(tick);
}

function init() {
  resizeCanvas();
  attachTouchControls();
  setTrainerMode(false);
  setCustomerAiMode(false);
  resetCustomerDialogState();
  updateCustomerDialogUi();
  setPhoneOpen(false);
  setPhoneControlsOpen(false);
  updateRainToggleButton();
  updateRoadLockButton();
  updateDriveSpeedUi();
  setPhoneApp(state.phoneApp || "field", { force: true });
  resetFieldOrderForStop();
  setMissionBannerMinimized(false);
  setSafetyDisclaimerAccepted(false);
  const restoredSnapshot = applyDayProgressSnapshot(loadDayProgressSnapshot());
  if (!restoredSnapshot) {
    saveDayProgressSnapshot();
  }

  if (typeof window !== "undefined") {
    window.getAiErrorLog = () => state.aiErrorEvents.slice();
    window.getServerAiErrors = async () => {
      const response = await fetch("/api/ai-errors");
      if (!response.ok) {
        throw new Error(`Failed to fetch /api/ai-errors (${response.status})`);
      }
      return response.json();
    };
    window.addEventListener("beforeunload", () => {
      saveDayProgressSnapshot();
    });
  }

  if (trainerModeButton) {
    trainerModeButton.addEventListener("click", () => {
      setTrainerMode(!state.trainerMode);
    });
  }
  if (customerModeButton) {
    customerModeButton.addEventListener("click", () => {
      setCustomerAiMode(!state.customerAiMode);
    });
  }
  if (safetyDisclaimerAcceptButton) {
    safetyDisclaimerAcceptButton.addEventListener("click", acceptSafetyDisclaimer);
    safetyDisclaimerAcceptButton.addEventListener("pointerdown", acceptSafetyDisclaimer);
    safetyDisclaimerAcceptButton.addEventListener("touchstart", acceptSafetyDisclaimer, { passive: false });
  }
  if (safetyDisclaimerScreen) {
    safetyDisclaimerScreen.addEventListener("click", (event) => {
      const target = event.target;
      if (target instanceof HTMLElement && target.id === "safety-disclaimer-accept-btn") {
        acceptSafetyDisclaimer(event);
      }
    });
  }
  if (missionCompleteMinButton) {
    missionCompleteMinButton.addEventListener("click", () => {
      setMissionBannerMinimized(!state.missionBannerMinimized);
    });
  }
  if (customerDialogNextButton) {
    customerDialogNextButton.addEventListener("click", () => {
      if (state.customerAiMode) {
        tryCompleteAiConversation();
      } else {
        tryAdvanceScriptedConversation();
      }
    });
  }
  if (customerDialogSendButton) {
    customerDialogSendButton.addEventListener("click", () => {
      void trySendCustomerMessage();
    });
  }
  if (customerDialogInput) {
    customerDialogInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        void trySendCustomerMessage();
      }
    });
  }
  if (phoneControlsButton) {
    phoneControlsButton.addEventListener("click", () => {
      setPhoneControlsOpen(!state.phoneControlsOpen);
    });
  }
  if (phoneToggleButton) {
    phoneToggleButton.addEventListener("click", () => {
      setPhoneOpen(!state.phoneOpen);
    });
  }
  if (phoneRainToggleButton) {
    phoneRainToggleButton.addEventListener("click", () => {
      setRainEnabled(!state.rain.enabled);
    });
  }
  if (phoneRoadLockButton) {
    phoneRoadLockButton.addEventListener("click", () => {
      if (!state.inTruck) {
        setSprayerFeedback("Enter the truck to use road lock.", 1);
        updateRoadLockButton();
        return;
      }
      setRoadLockEnabled(!state.roadLockEnabled);
    });
  }
  if (phoneStartOverDayButton) {
    phoneStartOverDayButton.addEventListener("click", () => {
      tryStartOverDayFromPhone();
    });
  }
  if (phoneSpeedDownButton) {
    phoneSpeedDownButton.addEventListener("click", () => {
      adjustTargetDriveSpeed(-1, { engageCruise: true });
    });
  }
  if (phoneSpeedUpButton) {
    phoneSpeedUpButton.addEventListener("click", () => {
      adjustTargetDriveSpeed(1, { engageCruise: true });
    });
  }
  if (phoneDriveSpeedSlider) {
    phoneDriveSpeedSlider.addEventListener("input", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLInputElement)) {
        return;
      }
      setTargetDriveSpeed(Number(target.value), { engageCruise: true });
    });
  }
  if (phoneAppButtons && phoneAppButtons.length > 0) {
    phoneAppButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const appName = button.getAttribute("data-phone-app");
        setPhoneApp(appName || "field");
      });
    });
  }
  if (phoneMsgSendButton) {
    phoneMsgSendButton.addEventListener("click", () => {
      sendPhoneMessage();
    });
  }
  if (phoneMsgInput) {
    phoneMsgInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        sendPhoneMessage();
      }
    });
  }
  if (phoneEmailManagerButton) {
    phoneEmailManagerButton.addEventListener("click", () => {
      void sendPhoneEmail("manager");
    });
  }
  if (phoneEmailCustomerButton) {
    phoneEmailCustomerButton.addEventListener("click", () => {
      void sendPhoneEmail("customer");
    });
  }
  if (phoneEmailInput) {
    phoneEmailInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        void sendPhoneEmail("manager");
      }
    });
  }
  if (fieldCustomerSelect) {
    fieldCustomerSelect.addEventListener("change", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLSelectElement)) {
        return;
      }
      state.fieldOrder.selectedCustomerId = target.value;
      updateFieldManagementUi();
    });
  }
  if (fieldTechComment) {
    fieldTechComment.addEventListener("pointerdown", () => {
      if (fieldTechComment.disabled) {
        return;
      }
      state.techCommentEditing = true;
      fieldTechComment.readOnly = false;
    });
    fieldTechComment.addEventListener("focus", () => {
      if (fieldTechComment.disabled) {
        return;
      }
      fieldTechComment.readOnly = !state.techCommentEditing;
    });
    fieldTechComment.addEventListener("blur", () => {
      state.techCommentEditing = false;
      if (!fieldTechComment.disabled) {
        fieldTechComment.readOnly = true;
      }
    });
    fieldTechComment.addEventListener("input", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLTextAreaElement)) {
        return;
      }
      if (!state.techCommentEditing) {
        return;
      }
      state.fieldOrder.techComment = target.value;
      updateFieldManagementUi();
    });
  }
  if (fieldTimeInButton) {
    fieldTimeInButton.addEventListener("click", () => {
      tryTimeInFieldOrder();
    });
  }
  if (fieldTimeOutButton) {
    fieldTimeOutButton.addEventListener("click", () => {
      tryTimeOutFieldOrder();
    });
  }
  if (fieldSaveCommentButton) {
    fieldSaveCommentButton.addEventListener("click", () => {
      saveTechComment();
    });
  }

  window.addEventListener("resize", resizeCanvas);
  window.addEventListener("keydown", (event) => setKeyState(event, true));
  window.addEventListener("keyup", (event) => setKeyState(event, false));
  canvas.addEventListener("mousemove", (event) => {
    updatePointerFromEvent(event);
  });
  canvas.addEventListener("mouseenter", (event) => {
    updatePointerFromEvent(event);
    state.pointer.insideCanvas = true;
  });
  canvas.addEventListener("mousedown", (event) => {
    updatePointerFromEvent(event);
    if (event.button === 0) {
      if (state.phase === "webster_working" && state.firstPerson.active && !state.mapOpen) {
        input.spray = false;
        tryKnockDownWebAtPointer();
      } else {
        input.spray = true;
      }
      event.preventDefault();
    }
  });
  window.addEventListener("mouseup", (event) => {
    if (event.button === 0) {
      input.spray = false;
    }
  });
  canvas.addEventListener("mouseleave", () => {
    input.spray = false;
    state.pointer.insideCanvas = false;
  });
  canvas.addEventListener("wheel", (event) => {
    if (state.phase !== "working") {
      return;
    }
    state.sprayerConcentration = clamp(
      state.sprayerConcentration - event.deltaY * 0.0006,
      0.08,
      0.98
    );
    event.preventDefault();
  }, { passive: false });
  window.addEventListener("blur", () => {
    resetGameplayInputs();
    Object.keys(touchInput).forEach((key) => {
      touchInput[key] = false;
    });
  });
  document.addEventListener("focusin", (event) => {
    if (isTextEntryElement(event.target)) {
      resetGameplayInputs();
    }
  });

  requestAnimationFrame(tick);
}

init();

import { HERO_ART, BOSS_ART } from './art.js';

const ROWS = 5;
const COLS = 6;
const TEAM_SIZE = 5;
const BASE_MOVE_TIME = 6; // seconds

const ORB_TYPES = [
  { id: "fire", label: "火焰" },
  { id: "water", label: "水流" },
  { id: "wood", label: "蒼藤" },
  { id: "light", label: "聖光" },
  { id: "dark", label: "暗影" },
  { id: "heart", label: "治癒" }
];

const ELEMENT_MAP = ORB_TYPES.reduce((acc, orb) => {
  acc[orb.id] = orb.label;
  return acc;
}, {});

const ENEMY_PHASES = [
  {
    threshold: 1,
    shieldElement: "fire",
    shieldReduction: 0.35,
    attack: 3600,
    countdownMax: 2,
    announcement: "虛空審判者展開熾焰護盾，審判開始！"
  },
  {
    threshold: 0.6,
    shieldElement: "dark",
    shieldReduction: 0.45,
    attack: 3900,
    countdownMax: 2,
    announcement: "虛空審判者轉化為暗影相位，攻勢與護盾同時增強！"
  },
  {
    threshold: 0.3,
    shieldElement: "light",
    shieldReduction: 0.2,
    attack: 4600,
    countdownMax: 1,
    announcement: "審判者狂怒暴走，倒數加快，光壁鎧甲覆體！"
  }
];

const battleScreen = document.getElementById("battle-screen");
const teamStage = document.getElementById("team-stage");
const teamStageCloseButton = document.getElementById("team-stage-close");
const boardElement = document.getElementById("board");
const heroesContainer = document.getElementById("heroes");
const heroDetailPanel = document.getElementById("hero-detail");
const enemyHpBar = document.getElementById("enemy-hp");
const enemyHpText = document.getElementById("enemy-hp-text");
const enemyAttackText = document.getElementById("enemy-attack");
const enemyCountdownText = document.getElementById("enemy-countdown");
const enemyStatusText = document.getElementById("enemy-status");
const enemyNameText = document.getElementById("enemy-name");
const bossPortraitElement = document.getElementById("boss-portrait");
const playerHpBar = document.getElementById("player-hp");
const playerHpText = document.getElementById("player-hp-text");
const playerStatusText = document.getElementById("player-status");
const moveBar = document.getElementById("move-bar");
const logList = document.getElementById("log-list");
const overlay = document.getElementById("overlay");
const overlayTitle = document.getElementById("overlay-title");
const overlayMessage = document.getElementById("overlay-message");
const restartButton = document.getElementById("restart-button");
const openTeamButton = document.getElementById("open-team");
const teamSelectedContainer = document.getElementById("team-selected");
const collectionGrid = document.getElementById("collection-grid");
const teamMessage = document.getElementById("team-message");
const applyTeamButton = document.getElementById("apply-team");

let board = [];
let dragState = null;
let isResolving = false;
let isGameOver = false;
let moveTimerFrame = null;
let moveDeadline = null;
const logHistory = [];
let activeHeroes = [];
let teamSelection = [];
let hasBattleStarted = false;
let selectedHero = null;
let heroDetailElements = null;

const ACTIVE_BOSS_ID = "void-arbiter";
if (bossPortraitElement && BOSS_ART[ACTIVE_BOSS_ID]) {
  bossPortraitElement.innerHTML = BOSS_ART[ACTIVE_BOSS_ID];
}

const playerState = {
  maxHp: 24000,
  hp: 24000,
  shieldTurns: 0,
  shieldValue: 0,
  damageBoostTurns: 0,
  damageBoostValue: 1,
  comboBoostTurns: 0,
  comboBoostValue: 0,
  bonusMoveTime: 0,
  regenEffects: [],
  elementBuffs: {}
};

const enemyState = {
  name: "虛空審判者",
  maxHp: 42000,
  hp: 42000,
  attack: 3600,
  countdown: 2,
  countdownMax: 2,
  shieldElement: "fire",
  shieldReduction: 0.35,
  weakenTurns: 0,
  weakenValue: 0,
  dotEffects: [],
  actionLockTurns: 0,
  countdownDelay: 0,
  armorBreakTurns: 0,
  armorBreakValue: 0,
  phaseIndex: 0
};

function formatNumber(num) {
  return num.toLocaleString("zh-Hant");
}

function getElementGradient(element) {
  switch (element) {
    case "fire":
      return "linear-gradient(135deg, #ff8053, #ff2e2e)";
    case "water":
      return "linear-gradient(135deg, #4fc3f7, #1b74ff)";
    case "wood":
      return "linear-gradient(135deg, #88e27f, #1f8a3d)";
    case "light":
      return "linear-gradient(135deg, #ffe066, #f4c23c)";
    case "dark":
      return "linear-gradient(135deg, #b388ff, #5f2da5)";
    case "heart":
      return "linear-gradient(135deg, #ff9ac9, #ff4f9b)";
    default:
      return "linear-gradient(135deg, #999, #555)";
  }
}

function randomOrb(checkRepeat) {
  let orb;
  do {
    orb = ORB_TYPES[Math.floor(Math.random() * ORB_TYPES.length)].id;
  } while (checkRepeat && checkRepeat(orb));
  return orb;
}

function causesMatch(grid, row, col) {
  return orb => {
    grid[row][col] = orb;
    const matched = hasMatchAt(grid, row, col);
    grid[row][col] = null;
    return matched;
  };
}

function hasMatchAt(grid, row, col) {
  const orb = grid[row][col];
  if (!orb) return false;
  let count = 1;
  for (let c = col - 1; c >= 0 && grid[row][c] === orb; c--) count++;
  for (let c = col + 1; c < COLS && grid[row][c] === orb; c++) count++;
  if (count >= 3) return true;
  count = 1;
  for (let r = row - 1; r >= 0 && grid[r][col] === orb; r--) count++;
  for (let r = row + 1; r < ROWS && grid[r][col] === orb; r++) count++;
  return count >= 3;
}

function createInitialBoard() {
  const grid = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      grid[r][c] = randomOrb(causesMatch(grid, r, c));
    }
  }
  return grid;
}

function renderBoard(highlightSet = null) {
  boardElement.innerHTML = "";
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const orb = document.createElement("div");
      orb.className = `orb orb-${board[r][c]}`;
      if (highlightSet && highlightSet.has(`${r},${c}`)) {
        orb.classList.add("clearing");
      }
      if (
        dragState &&
        dragState.lastCell &&
        dragState.lastCell.row === r &&
        dragState.lastCell.col === c
      ) {
        orb.classList.add("active");
      }
      boardElement.appendChild(orb);
    }
  }
}

function logMessage(message) {
  logHistory.push({ message, time: Date.now() });
  while (logHistory.length > 12) {
    logHistory.shift();
  }
  renderLog();
}

function renderLog() {
  logList.innerHTML = "";
  logHistory.forEach(entry => {
    const li = document.createElement("li");
    li.textContent = entry.message;
    logList.appendChild(li);
  });
  logList.scrollTop = logList.scrollHeight;
}

function updateEnemyPanel() {
  const hpRatio = enemyState.hp / enemyState.maxHp;
  enemyHpBar.style.width = `${Math.max(0, Math.min(1, hpRatio)) * 100}%`;
  enemyHpText.textContent = `${formatNumber(enemyState.hp)} / ${formatNumber(
    enemyState.maxHp
  )}`;
  if (enemyAttackText) {
    enemyAttackText.textContent = formatNumber(enemyState.attack);
  }
  enemyCountdownText.textContent = enemyState.countdown;
  enemyNameText.textContent = enemyState.name;

  const statuses = [];
  statuses.push(
    `護盾：${ELEMENT_MAP[enemyState.shieldElement]}傷害 -${Math.round(
      enemyState.shieldReduction * 100
    )}%`
  );
  if (enemyState.weakenTurns > 0) {
    statuses.push(`攻擊力下降 ${enemyState.weakenTurns} 回合`);
  }
  if (enemyState.armorBreakTurns > 0) {
    statuses.push(
      `防禦破碎 ${enemyState.armorBreakTurns} 回合 (+${Math.round(
        enemyState.armorBreakValue * 100
      )}% 傷害)`
    );
  }
  if (enemyState.dotEffects.length > 0) {
    statuses.push(`持續灼蝕 ${enemyState.dotEffects.length} 層`);
  }
  if (enemyState.actionLockTurns > 0) {
    statuses.push(`行動封鎖 ${enemyState.actionLockTurns} 回合`);
  }
  if (enemyState.countdownDelay > 0) {
    statuses.push(`時間禁錮 ${enemyState.countdownDelay} 回合`);
  }
  enemyStatusText.textContent = statuses.join(" ｜ ");
}

function updatePlayerPanel() {
  const hpRatio = playerState.hp / playerState.maxHp;
  playerHpBar.style.width = `${Math.max(0, Math.min(1, hpRatio)) * 100}%`;
  playerHpText.textContent = `${formatNumber(playerState.hp)} / ${formatNumber(
    playerState.maxHp
  )}`;

  const statuses = [];
  if (playerState.shieldTurns > 0) {
    statuses.push(
      `護盾 ${playerState.shieldTurns} 回合 (${Math.round(
        playerState.shieldValue * 100
      )}% 減傷)`
    );
  }
  if (playerState.damageBoostTurns > 0) {
    statuses.push(
      `攻擊提升 ${playerState.damageBoostTurns} 回合 (${Math.round(
        (playerState.damageBoostValue - 1) * 100
      )}% 加成)`
    );
  }
  if (playerState.comboBoostTurns > 0) {
    statuses.push(
      `連鎖加乘 ${playerState.comboBoostTurns} 回合 (+${Math.round(
        playerState.comboBoostValue * 100
      )}%)`
    );
  }
  const elementEntries = Object.entries(playerState.elementBuffs);
  if (elementEntries.length > 0) {
    const text = elementEntries
      .map(([element, buff]) =>
        `${ELEMENT_MAP[element]} +${Math.round(buff.value * 100)}%/${buff.turns}T`
      )
      .join("，");
    statuses.push(`元素增幅：${text}`);
  }
  if (playerState.regenEffects.length > 0) {
    const healPerTurn = playerState.regenEffects.reduce(
      (sum, effect) => sum + effect.amount,
      0
    );
    statuses.push(`持續回復 ${formatNumber(healPerTurn)} / 回合`);
  }
  if (playerState.bonusMoveTime > 0 && !dragState) {
    statuses.push(`下一回合 +${playerState.bonusMoveTime.toFixed(1)} 秒移動時間`);
  }
  playerStatusText.textContent = statuses.join(" ｜ ");
}

function defineHero(config) {
  const art = HERO_ART[config.id] || {};
  return {
    id: config.id,
    name: config.name,
    element: config.element,
    rarity: config.rarity,
    attack: config.attack,
    skillName: config.skill.name,
    skillDescription: config.skill.description,
    skillCooldown: config.skill.cooldown,
    useSkill: config.skill.effect,
    icon: art.hero || '',
    skillIcon: art.skill || ''
  };
}

const HERO_LIBRARY = [
  // 火焰陣營
  defineHero({
    id: "ember-sovereign",
    name: "熾焰君王・赫里昂",
    element: "fire",
    rarity: 5,
    attack: 1720,
    skill: {
      name: "熾焰輪迴",
      description: "轉換 4 顆木符石為火並以烈焰灼燒敵人 3 回合。",
      cooldown: 5,
      effect: hero => {
        const converted = convertOrbs("wood", "fire", 4);
        if (converted > 0) {
          logMessage(`熾焰輪迴：${converted} 顆木符石化為烈焰！`);
        } else {
          logMessage("熾焰輪迴：烈焰直接吞噬敵人！");
        }
        applyEnemyDot({ damage: 900, turns: 3, label: "熾焰灼燒" });
      }
    }
  }),
  defineHero({
    id: "drake-artillerist",
    name: "龍紋爆術師・莉菈",
    element: "fire",
    rarity: 4,
    attack: 1580,
    skill: {
      name: "龍紋爆裂",
      description: "轉換 3 顆心符石為火，火屬攻擊 2 回合 +30%。",
      cooldown: 6,
      effect: hero => {
        const converted = convertOrbs("heart", "fire", 3);
        logMessage(`龍紋爆裂：火焰補給 ${converted} 顆，攻勢大幅提升！`);
        applyElementBuff("fire", 0.3, 2);
      }
    }
  }),
  defineHero({
    id: "radiant-vanguard",
    name: "烈煌騎士・羅格",
    element: "fire",
    rarity: 4,
    attack: 1650,
    skill: {
      name: "煌焰審判",
      description: "以劍氣造成 3 倍攻擊真實傷害並粉碎護甲 2 回合。",
      cooldown: 7,
      effect: hero => {
        dealDirectDamage(hero.attack * 3, "煌焰審判", { ignoreShield: true });
        applyArmorBreak(0.4, 2, "羅格的烈焰斬擊削弱敵人防禦！");
      }
    }
  }),
  defineHero({
    id: "cinder-ronin",
    name: "焦土浪人・焚夜",
    element: "fire",
    rarity: 3,
    attack: 1490,
    skill: {
      name: "焦土灼刃",
      description: "施加灼燒 4 回合並讓全體攻擊 2 回合 +35%。",
      cooldown: 6,
      effect: hero => {
        applyEnemyDot({ damage: 700, turns: 4, label: "焦土烈焰" });
        applyDamageBoost(1.35, 2, "焚夜點燃戰意，攻擊力提升！");
      }
    }
  }),
  defineHero({
    id: "ash-bard",
    name: "灰燼詠者・芮蘿",
    element: "fire",
    rarity: 3,
    attack: 1400,
    skill: {
      name: "餘燼共鳴",
      description: "隨機 4 顆符石轉為火並提升連鎖倍率 2 回合。",
      cooldown: 5,
      effect: hero => {
        const painted = paintRandomOrbs("fire", 4);
        logMessage(`餘燼共鳴：烈焰蔓延 ${painted} 格！`);
        applyComboBoost(0.15, 2, "火焰詩歌激發了連鎖節奏！");
      }
    }
  }),
  defineHero({
    id: "lava-herder",
    name: "熔岩馭獸師・班斯",
    element: "fire",
    rarity: 4,
    attack: 1600,
    skill: {
      name: "熔爐奔流",
      description: "隨機 6 顆符石轉為火並延緩敵人倒數 1 回合。",
      cooldown: 7,
      effect: hero => {
        const painted = paintRandomOrbs("fire", 6);
        logMessage(`熔爐奔流：熔火席捲 ${painted} 格！`);
        applyCountdownDelay(1, "熔岩奔流拖慢了虛空審判者的步伐。");
      }
    }
  }),
  defineHero({
    id: "crimson-duelist",
    name: "真紅斬姬・霜火",
    element: "fire",
    rarity: 5,
    attack: 1780,
    skill: {
      name: "紅蓮瞬斬",
      description: "造成 4 倍攻擊真實傷害並使下一回合移動 +1 秒。",
      cooldown: 8,
      effect: hero => {
        dealDirectDamage(hero.attack * 4, "紅蓮瞬斬", { ignoreShield: true });
        extendMoveTime(1, "霜火的舞步延長了移動時間！");
      }
    }
  }),
  defineHero({
    id: "magmabreaker",
    name: "爆甲鐵拳・塔羅",
    element: "fire",
    rarity: 3,
    attack: 1520,
    skill: {
      name: "熔爆重拳",
      description: "依照場上火符石造成巨量爆擊並短暫破甲。",
      cooldown: 5,
      effect: hero => {
        const fireCount = countOrbs("fire");
        const damage = fireCount * 280;
        dealDirectDamage(damage, "熔爆重拳", { ignoreShield: true });
        if (fireCount >= 8) {
          applyArmorBreak(0.25, 1, "熔爆重拳震碎護甲！");
        }
      }
    }
  }),
  defineHero({
    id: "pyrolumen",
    name: "光火雙星・煉雅",
    element: "fire",
    rarity: 4,
    attack: 1620,
    skill: {
      name: "雙星連弧",
      description: "轉換 3 顆光符石為火，火與光攻擊 3 回合 +25%。",
      cooldown: 6,
      effect: hero => {
        const converted = convertOrbs("light", "fire", 3);
        logMessage(`雙星連弧：光火共鳴轉換 ${converted} 顆！`);
        applyElementBuff("fire", 0.25, 3);
        applyElementBuff("light", 0.25, 3);
      }
    }
  }),
  defineHero({
    id: "meteor-dancer",
    name: "流星舞者・莎芙拉",
    element: "fire",
    rarity: 4,
    attack: 1500,
    skill: {
      name: "流星步伐",
      description: "延長移動時間 2 秒並提升連鎖倍率 1 回合。",
      cooldown: 4,
      effect: hero => {
        extendMoveTime(2, "流星步伐：舞步拉長了戰術空窗。");
        applyComboBoost(0.2, 1, "流星軌跡提高了連鎖節奏！");
      }
    }
  }),
  // 水流陣營
  defineHero({
    id: "tide-matriarch",
    name: "潮生主母・伊蕾娜",
    element: "water",
    rarity: 5,
    attack: 1590,
    skill: {
      name: "潮汐護恩",
      description: "轉換 3 顆火符石為水並獲得 40% 護盾與 2 回合削弱。",
      cooldown: 6,
      effect: hero => {
        const converted = convertOrbs("fire", "water", 3);
        logMessage(`潮汐護恩：淨化 ${converted} 顆火焰！`);
        applyShield(0.4, 2, "潮汐護恩形成水盾守護。");
        applyEnemyWeaken(0.35, 2, "水幕壓制了敵人的力量。");
      }
    }
  }),
  defineHero({
    id: "frost-oracle",
    name: "雪羽占星師・菲兒",
    element: "water",
    rarity: 4,
    attack: 1480,
    skill: {
      name: "雪羽時停",
      description: "冰封敵人 1 回合並凍結倒數。",
      cooldown: 7,
      effect: hero => {
        applyEnemyActionLock(1, "雪羽時停：敵人被霜凍封印！");
        applyCountdownDelay(1, "時間也被冰晶暫停。");
      }
    }
  }),
  defineHero({
    id: "azure-medic",
    name: "碧藍醫士・諾敏",
    element: "water",
    rarity: 3,
    attack: 1340,
    skill: {
      name: "水療脈動",
      description: "回復 20% 生命並 3 回合每回合再生 1800。",
      cooldown: 5,
      effect: hero => {
        healPlayerPercent(0.2, "水療脈動：");
        applyRegen(1800, 3, "水療脈動");
      }
    }
  }),
  defineHero({
    id: "abyss-scout",
    name: "深渦斥候・托林",
    element: "water",
    rarity: 3,
    attack: 1460,
    skill: {
      name: "深渦引力",
      description: "轉換 2 顆暗符石為水並延緩倒數 2 回合。",
      cooldown: 6,
      effect: hero => {
        const converted = convertOrbs("dark", "water", 2);
        logMessage(`深渦引力：暗影被吞沒 ${converted} 顆。`);
        applyCountdownDelay(2, "深渦將審判者拉入遲滯。");
      }
    }
  }),
  defineHero({
    id: "iceblade-assassin",
    name: "霜影刺客・瑟蓮",
    element: "water",
    rarity: 4,
    attack: 1710,
    skill: {
      name: "極寒破襲",
      description: "造成 3 倍攻擊真實傷害並令敵人 1 回合無法行動。",
      cooldown: 7,
      effect: hero => {
        dealDirectDamage(hero.attack * 3, "極寒破襲", { ignoreShield: true });
        applyEnemyActionLock(1, "極寒破襲凍結了敵人的動作！");
      }
    }
  }),
  defineHero({
    id: "tidal-minstrel",
    name: "潮歌吟遊家・梅薇",
    element: "water",
    rarity: 3,
    attack: 1380,
    skill: {
      name: "潮歌激昂",
      description: "全體技能冷卻 -2 並下回合移動 +1 秒。",
      cooldown: 6,
      effect: hero => {
        chargeTeam(2);
        extendMoveTime(1, "潮歌激昂：節奏提速！");
      }
    }
  }),
  defineHero({
    id: "star-navigator",
    name: "星海巡航者・璐米",
    element: "water",
    rarity: 4,
    attack: 1500,
    skill: {
      name: "星流洗禮",
      description: "隨機 3 顆符石轉為心並回復 12% 生命。",
      cooldown: 5,
      effect: hero => {
        const painted = paintRandomOrbs("heart", 3);
        logMessage(`星流洗禮：星光化為 ${painted} 顆治癒符石。`);
        healPlayerPercent(0.12, "星流洗禮：");
      }
    }
  }),
  defineHero({
    id: "glacier-magus",
    name: "寒晶術士・路德",
    element: "water",
    rarity: 4,
    attack: 1540,
    skill: {
      name: "寒晶侵蝕",
      description: "轉換 3 顆暗符石為水並使敵人攻擊 -40% 3 回合。",
      cooldown: 6,
      effect: hero => {
        const converted = convertOrbs("dark", "water", 3);
        logMessage(`寒晶侵蝕：暗影化作寒霜 ${converted} 顆。`);
        applyEnemyWeaken(0.4, 3, "寒晶侵蝕使敵人攻勢遲鈍。");
      }
    }
  }),
  defineHero({
    id: "abyss-warden",
    name: "海淵護衛・戴倫",
    element: "water",
    rarity: 5,
    attack: 1620,
    skill: {
      name: "巨潮壁壘",
      description: "獲得 55% 護盾並 2 回合每回合再生 2200。",
      cooldown: 6,
      effect: hero => {
        applyShield(0.55, 1, "巨潮壁壘形成無堅不摧的海盾！");
        applyRegen(2200, 2, "巨潮壁壘");
      }
    }
  }),
  defineHero({
    id: "stormcaller",
    name: "雲雨法師・泰洛",
    element: "water",
    rarity: 4,
    attack: 1470,
    skill: {
      name: "雲雨變換",
      description: "洗牌符石並額外延緩倒數 1 回合。",
      cooldown: 6,
      effect: hero => {
        shuffleBoard();
        logMessage("雲雨變換：盤面重新洗牌！");
        applyCountdownDelay(1, "雲雨法術牽制了敵人的腳步。");
      }
    }
  }),
  // 蒼藤陣營
  defineHero({
    id: "verdant-sage",
    name: "綠野智者・阿寧",
    element: "wood",
    rarity: 4,
    attack: 1530,
    skill: {
      name: "生命回響",
      description: "轉換 3 顆心符石為木並賦予再生 2000（3 回合）。",
      cooldown: 5,
      effect: hero => {
        const converted = convertOrbs("heart", "wood", 3);
        logMessage(`生命回響：自然復甦 ${converted} 顆符石！`);
        applyRegen(2000, 3, "生命回響");
      }
    }
  }),
  defineHero({
    id: "vine-rogue",
    name: "藤鞭妖俠・夏玟",
    element: "wood",
    rarity: 4,
    attack: 1580,
    skill: {
      name: "毒藤纏殺",
      description: "施加劇毒 4 回合並讓木屬攻擊 3 回合 +20%。",
      cooldown: 6,
      effect: hero => {
        applyEnemyDot({ damage: 950, turns: 4, label: "毒藤蔓延" });
        applyElementBuff("wood", 0.2, 3);
      }
    }
  }),
  defineHero({
    id: "grove-champion",
    name: "森王巨熊・布魯格",
    element: "wood",
    rarity: 3,
    attack: 1660,
    skill: {
      name: "原野咆哮",
      description: "獲得 35% 護盾 3 回合並轉換 2 顆符石為木。",
      cooldown: 6,
      effect: hero => {
        applyShield(0.35, 3, "原野咆哮：大地守護！");
        const painted = paintRandomOrbs("wood", 2);
        logMessage(`原野咆哮：大地滋養 ${painted} 格。`);
      }
    }
  }),
  defineHero({
    id: "emerald-warden",
    name: "翠羽監察官・琳恩",
    element: "wood",
    rarity: 4,
    attack: 1510,
    skill: {
      name: "森律號令",
      description: "木屬攻擊 2 回合 +35%，木屬英雄技能冷卻 -1。",
      cooldown: 5,
      effect: hero => {
        applyElementBuff("wood", 0.35, 2);
        chargeTeam(1, { element: "wood" });
        logMessage("森律號令：木之同盟同步前進！");
      }
    }
  }),
  defineHero({
    id: "sprout-traveler",
    name: "星芽旅者・希菈",
    element: "wood",
    rarity: 3,
    attack: 1420,
    skill: {
      name: "繁星延蔓",
      description: "延長移動時間 1.5 秒並轉換 2 顆光符石為木。",
      cooldown: 4,
      effect: hero => {
        extendMoveTime(1.5, "繁星延蔓：蔓延出新的路徑。");
        convertOrbs("light", "wood", 2);
      }
    }
  }),
  defineHero({
    id: "sky-ranger",
    name: "蒼穹遊俠・歐菲",
    element: "wood",
    rarity: 4,
    attack: 1700,
    skill: {
      name: "疾風箭雨",
      description: "造成 3 倍攻擊真實傷害並強化連鎖 1 回合。",
      cooldown: 6,
      effect: hero => {
        dealDirectDamage(hero.attack * 3, "疾風箭雨", { ignoreShield: true });
        applyComboBoost(0.15, 1, "疾風箭雨：箭雨開闢更多連結！");
      }
    }
  }),
  defineHero({
    id: "oracle-of-vines",
    name: "藤蔓占卜師・芙蒂雅",
    element: "wood",
    rarity: 4,
    attack: 1470,
    skill: {
      name: "蔓延新生",
      description: "隨機轉換 2 顆符石為木與 2 顆為心。",
      cooldown: 5,
      effect: hero => {
        const woodPainted = paintRandomOrbs("wood", 2);
        const heartPainted = paintRandomOrbs("heart", 2);
        logMessage(
          `蔓延新生：木芽擴散 ${woodPainted} 格，治癒萌芽 ${heartPainted} 格。`
        );
      }
    }
  }),
  defineHero({
    id: "forest-guardian",
    name: "林海守衛・卡登",
    element: "wood",
    rarity: 4,
    attack: 1560,
    skill: {
      name: "林海庇護",
      description: "獲得 45% 護盾 2 回合並延緩倒數 1 回合。",
      cooldown: 6,
      effect: hero => {
        applyShield(0.45, 2, "林海庇護厚植防線！");
        applyCountdownDelay(1, "林海根網糾纏敵人腳步。");
      }
    }
  }),
  defineHero({
    id: "wild-drummer",
    name: "野律鼓者・里卡",
    element: "wood",
    rarity: 3,
    attack: 1390,
    skill: {
      name: "原鼓震鳴",
      description: "連鎖倍率 2 回合 +25%，全體技能冷卻 -1。",
      cooldown: 5,
      effect: hero => {
        applyComboBoost(0.25, 2, "原鼓震鳴：節奏躍動！");
        chargeTeam(1);
      }
    }
  }),
  defineHero({
    id: "shadow-huntress",
    name: "森影潛獵者・嘉莉",
    element: "wood",
    rarity: 5,
    attack: 1680,
    skill: {
      name: "蛇影毒擊",
      description: "施加劇毒 3 回合並造成 2 倍攻擊真實傷害。",
      cooldown: 7,
      effect: hero => {
        applyEnemyDot({ damage: 1300, turns: 3, label: "蛇影劇毒" });
        dealDirectDamage(hero.attack * 2, "蛇影毒擊", { ignoreShield: true });
      }
    }
  }),
  // 聖光陣營
  defineHero({
    id: "dawn-empress",
    name: "晨曦女王・艾琳",
    element: "light",
    rarity: 5,
    attack: 1580,
    skill: {
      name: "晨曦賜福",
      description: "回復 22% 生命並讓全體攻擊 2 回合 +35%。",
      cooldown: 6,
      effect: hero => {
        healPlayerPercent(0.22, "晨曦賜福：");
        applyDamageBoost(1.35, 2, "晨曦女王點燃希望！");
      }
    }
  }),
  defineHero({
    id: "judicator-vyss",
    name: "聖焰裁判・薇絲",
    element: "light",
    rarity: 4,
    attack: 1670,
    skill: {
      name: "裁判聖焰",
      description: "轉換 3 顆暗符石為光並粉碎護甲 2 回合。",
      cooldown: 6,
      effect: hero => {
        const converted = convertOrbs("dark", "light", 3);
        logMessage(`裁判聖焰：暗影瓦解 ${converted} 顆！`);
        applyArmorBreak(0.3, 2, "聖焰裁判削弱了護盾！");
      }
    }
  }),
  defineHero({
    id: "radiant-priest",
    name: "輝煌祭司・蘿亞",
    element: "light",
    rarity: 3,
    attack: 1400,
    skill: {
      name: "光耀祈禱",
      description: "附與再生 1800（3 回合）並全體技能冷卻 -1。",
      cooldown: 5,
      effect: hero => {
        applyRegen(1800, 3, "光耀祈禱");
        chargeTeam(1);
        logMessage("光耀祈禱：聖光庇佑隊伍。");
      }
    }
  }),
  defineHero({
    id: "lumina-blade",
    name: "耀境劍豪・凱洛",
    element: "light",
    rarity: 4,
    attack: 1750,
    skill: {
      name: "耀刃瞬襲",
      description: "造成 3.5 倍攻擊真實傷害並延長移動 1 秒。",
      cooldown: 6,
      effect: hero => {
        dealDirectDamage(hero.attack * 3.5, "耀刃瞬襲", { ignoreShield: true });
        extendMoveTime(1, "耀刃瞬襲：劍光指引更長路徑。");
      }
    }
  }),
  defineHero({
    id: "celestial-tactician",
    name: "星陣策士・宇珞",
    element: "light",
    rarity: 4,
    attack: 1520,
    skill: {
      name: "星陣轉輪",
      description: "延長移動時間 2 秒並延緩倒數 1 回合。",
      cooldown: 5,
      effect: hero => {
        extendMoveTime(2, "星陣轉輪：星象校正移動時間。");
        applyCountdownDelay(1, "星陣結界束縛了審判者。");
      }
    }
  }),
  defineHero({
    id: "halo-savant",
    name: "光輪賢者・雪莉",
    element: "light",
    rarity: 3,
    attack: 1360,
    skill: {
      name: "光輪洗禮",
      description: "隨機 3 顆符石轉為光並回復 10% 生命。",
      cooldown: 5,
      effect: hero => {
        const painted = paintRandomOrbs("light", 3);
        logMessage(`光輪洗禮：光芒降臨 ${painted} 格。`);
        healPlayerPercent(0.1, "光輪洗禮：");
      }
    }
  }),
  defineHero({
    id: "aegis-dion",
    name: "聖鎧守望者・迪昂",
    element: "light",
    rarity: 5,
    attack: 1620,
    skill: {
      name: "守護降臨",
      description: "獲得 60% 護盾 1 回合並讓全體攻擊 1 回合 +20%。",
      cooldown: 6,
      effect: hero => {
        applyShield(0.6, 1, "守護降臨：金耀護盾生成！");
        applyDamageBoost(1.2, 1, "守護降臨提升了士氣。");
      }
    }
  }),
  defineHero({
    id: "domain-neira",
    name: "光域術師・涅拉",
    element: "light",
    rarity: 4,
    attack: 1490,
    skill: {
      name: "光域協奏",
      description: "光屬攻擊 3 回合 +30%，連鎖倍率 3 回合 +10%。",
      cooldown: 6,
      effect: hero => {
        applyElementBuff("light", 0.3, 3);
        applyComboBoost(0.1, 3, "光域協奏穩定節奏！");
      }
    }
  }),
  defineHero({
    id: "pulse-healer",
    name: "光脈醫者・瑪莉",
    element: "light",
    rarity: 3,
    attack: 1320,
    skill: {
      name: "脈動恢復",
      description: "回復 16% 生命並賦與再生 1500（2 回合）。",
      cooldown: 5,
      effect: hero => {
        healPlayerPercent(0.16, "脈動恢復：");
        applyRegen(1500, 2, "脈動恢復");
      }
    }
  }),
  defineHero({
    id: "silver-envoy",
    name: "銀翼特使・索拉",
    element: "light",
    rarity: 4,
    attack: 1450,
    skill: {
      name: "銀翼庇佑",
      description: "全體技能冷卻 -2 並獲得 30% 護盾 2 回合。",
      cooldown: 6,
      effect: hero => {
        chargeTeam(2);
        applyShield(0.3, 2, "銀翼庇佑：護盾覆翼。");
      }
    }
  }),
  // 暗影陣營
  defineHero({
    id: "noctis-witch",
    name: "夜紋女巫・塔莉雅",
    element: "dark",
    rarity: 5,
    attack: 1710,
    skill: {
      name: "夜紋魔焰",
      description: "轉換 3 顆光符石為暗並讓全體攻擊 2 回合 +40%。",
      cooldown: 6,
      effect: hero => {
        const converted = convertOrbs("light", "dark", 3);
        logMessage(`夜紋魔焰：吞噬聖光 ${converted} 顆。`);
        applyDamageBoost(1.4, 2, "夜紋魔焰席捲全場！");
      }
    }
  }),
  defineHero({
    id: "void-hunter",
    name: "虛空獵人・傑洛",
    element: "dark",
    rarity: 5,
    attack: 1820,
    skill: {
      name: "虛空裂刃",
      description: "造成 3.8 倍攻擊真實傷害並破甲 2 回合。",
      cooldown: 7,
      effect: hero => {
        dealDirectDamage(hero.attack * 3.8, "虛空裂刃", { ignoreShield: true });
        applyArmorBreak(0.25, 2, "虛空裂刃撕裂了護盾！");
      }
    }
  }),
  defineHero({
    id: "shadow-walker",
    name: "深影行者・露琪",
    element: "dark",
    rarity: 4,
    attack: 1500,
    skill: {
      name: "影蝕劇毒",
      description: "施加劇毒 4 回合並轉換 1 顆心符石為暗。",
      cooldown: 6,
      effect: hero => {
        applyEnemyDot({ damage: 1100, turns: 4, label: "影蝕劇毒" });
        convertOrbs("heart", "dark", 1);
      }
    }
  }),
  defineHero({
    id: "gloom-keeper",
    name: "暗耀守祕者・伊傲",
    element: "dark",
    rarity: 4,
    attack: 1480,
    skill: {
      name: "暗耀封印",
      description: "延緩倒數 2 回合並使敵人攻擊 -30% 2 回合。",
      cooldown: 6,
      effect: hero => {
        applyCountdownDelay(2, "暗耀封印拖慢了審判節奏。");
        applyEnemyWeaken(0.3, 2, "暗耀封印抑制敵力。");
      }
    }
  }),
  defineHero({
    id: "river-shaman",
    name: "冥河巫醫・古魯",
    element: "dark",
    rarity: 3,
    attack: 1440,
    skill: {
      name: "冥河血契",
      description: "造成 2.5 倍攻擊真實傷害並回復 12% 生命。",
      cooldown: 6,
      effect: hero => {
        dealDirectDamage(hero.attack * 2.5, "冥河血契", { ignoreShield: true });
        healPlayerPercent(0.12, "冥河血契：");
      }
    }
  }),
  defineHero({
    id: "fallen-strategist",
    name: "墮落軍師・法隆",
    element: "dark",
    rarity: 4,
    attack: 1520,
    skill: {
      name: "墮策引燃",
      description: "暗屬技能冷卻 -2 並提升連鎖倍率 2 回合。",
      cooldown: 6,
      effect: hero => {
        chargeTeam(2, { element: "dark" });
        applyComboBoost(0.15, 2, "墮策引燃：暗影戰術加速。");
      }
    }
  }),
  defineHero({
    id: "abyssal-seer",
    name: "幽冥占星家・曼紗",
    element: "dark",
    rarity: 4,
    attack: 1490,
    skill: {
      name: "幽冥凌轉",
      description: "洗牌盤面、轉換 2 顆符石為暗並使全體攻擊 2 回合 +25%。",
      cooldown: 7,
      effect: hero => {
        shuffleBoard();
        paintRandomOrbs("dark", 2);
        applyDamageBoost(1.25, 2, "幽冥凌轉：命運軌跡改寫！");
      }
    }
  }),
  defineHero({
    id: "shadow-wraith",
    name: "影蝕刺靈・克洛",
    element: "dark",
    rarity: 4,
    attack: 1570,
    skill: {
      name: "影蝕束縛",
      description: "敵人 1 回合無法行動並破甲 2 回合，轉換 2 顆心符石為暗。",
      cooldown: 7,
      effect: hero => {
        applyEnemyActionLock(1, "影蝕束縛將敵人定身！");
        applyArmorBreak(0.2, 2, "影蝕束縛撕開護盾裂縫。");
        convertOrbs("heart", "dark", 2);
      }
    }
  }),
  defineHero({
    id: "dusk-swordmaster",
    name: "暮色劍聖・薩迪爾",
    element: "dark",
    rarity: 5,
    attack: 1760,
    skill: {
      name: "暮色連閃",
      description: "延長移動時間 1.5 秒並造成 2.8 倍攻擊真實傷害。",
      cooldown: 6,
      effect: hero => {
        extendMoveTime(1.5, "暮色連閃：影步無聲。");
        dealDirectDamage(hero.attack * 2.8, "暮色連閃", { ignoreShield: true });
      }
    }
  }),
  defineHero({
    id: "obsidian-bard",
    name: "黑曜歌者・萊爾",
    element: "dark",
    rarity: 3,
    attack: 1380,
    skill: {
      name: "黑曜挽歌",
      description: "轉換 3 顆心符石為暗並附與再生 1500（3 回合）。",
      cooldown: 5,
      effect: hero => {
        const converted = convertOrbs("heart", "dark", 3);
        logMessage(`黑曜挽歌：哀歌染黑 ${converted} 顆心符。`);
        applyRegen(1500, 3, "黑曜挽歌");
      }
    }
  })
];

const heroIndex = HERO_LIBRARY.reduce((acc, hero) => {
  acc[hero.id] = hero;
  return acc;
}, {});

function instantiateHero(data) {
  return {
    id: data.id,
    name: data.name,
    element: data.element,
    rarity: data.rarity,
    attack: data.attack,
    skillName: data.skillName,
    skillDescription: data.skillDescription,
    skillMax: data.skillCooldown,
    skillCharge: 0,
    onSkill: data.useSkill,
    icon: data.icon,
    skillIcon: data.skillIcon,
    cardElement: null,
    progressFill: null
  };
}
function createHeroCards() {
  if (!heroesContainer) return;
  heroesContainer.innerHTML = "";

  activeHeroes.forEach(hero => {
    const avatar = document.createElement("button");
    avatar.type = "button";
    avatar.className = "hero-avatar";
    avatar.dataset.element = hero.element;
    avatar.style.setProperty("--element-gradient", getElementGradient(hero.element));
    avatar.title = `${hero.name}｜${ELEMENT_MAP[hero.element]}`;
    avatar.setAttribute(
      "aria-label",
      `${hero.name}（${ELEMENT_MAP[hero.element]}）技能冷卻 ${hero.skillCharge}/${hero.skillMax}`
    );

    const portrait = document.createElement("span");
    portrait.className = "hero-avatar-portrait";
    portrait.style.setProperty("--element-gradient", getElementGradient(hero.element));
    if (hero.icon) {
      portrait.innerHTML = hero.icon;
    } else {
      const fallback = document.createElement("span");
      fallback.className = "hero-icon-fallback";
      fallback.textContent = hero.name.slice(0, 2);
      portrait.appendChild(fallback);
    }

    const cooldown = document.createElement("span");
    cooldown.className = "hero-avatar-cd";
    const cooldownFill = document.createElement("span");
    cooldownFill.className = "hero-avatar-cd-fill";
    cooldown.appendChild(cooldownFill);

    avatar.appendChild(portrait);
    avatar.appendChild(cooldown);

    avatar.addEventListener("click", () => {
      showHeroDetail(hero);
    });

    hero.cardElement = avatar;
    hero.progressFill = cooldownFill;

    heroesContainer.appendChild(avatar);
  });

  updateHeroUI();
  updateHeroDetailUI();
}

function clearHeroDetail() {
  if (!heroDetailPanel) return;
  selectedHero = null;
  heroDetailElements = null;
  heroDetailPanel.innerHTML = "";
  heroDetailPanel.classList.add("empty");
  heroDetailPanel.classList.remove("ready");
  heroDetailPanel.removeAttribute("data-element");
  heroDetailPanel.style.removeProperty("--element-gradient");
  const placeholder = document.createElement("p");
  placeholder.className = "hero-detail-placeholder";
  placeholder.textContent = "點選英雄頭像以查看詳情。";
  heroDetailPanel.appendChild(placeholder);
  activeHeroes.forEach(hero => {
    if (hero.cardElement) {
      hero.cardElement.classList.remove("selected");
    }
  });
}

function showHeroDetail(hero) {
  if (!heroDetailPanel) return;
  selectedHero = hero;
  heroDetailPanel.classList.remove("empty");
  heroDetailPanel.innerHTML = "";
  heroDetailPanel.dataset.element = hero.element;
  heroDetailPanel.style.setProperty("--element-gradient", getElementGradient(hero.element));

  activeHeroes.forEach(current => {
    if (current.cardElement) {
      current.cardElement.classList.toggle("selected", current === hero);
    }
  });

  const header = document.createElement("div");
  header.className = "hero-detail-header";

  const portrait = document.createElement("div");
  portrait.className = "hero-detail-portrait";
  portrait.style.setProperty("--element-gradient", getElementGradient(hero.element));
  if (hero.icon) {
    portrait.innerHTML = hero.icon;
  } else {
    const fallback = document.createElement("span");
    fallback.className = "hero-icon-fallback";
    fallback.textContent = hero.name.slice(0, 2);
    portrait.appendChild(fallback);
  }

  const info = document.createElement("div");
  info.className = "hero-detail-info";

  const topline = document.createElement("div");
  topline.className = "hero-detail-topline";
  const name = document.createElement("h4");
  name.className = "hero-detail-name";
  name.textContent = hero.name;
  const rarity = document.createElement("span");
  rarity.className = "hero-detail-rarity";
  rarity.textContent = "★".repeat(hero.rarity);
  topline.appendChild(name);
  topline.appendChild(rarity);

  const meta = document.createElement("div");
  meta.className = "hero-detail-meta";
  const element = document.createElement("span");
  element.className = "hero-detail-element";
  element.textContent = ELEMENT_MAP[hero.element];
  const attack = document.createElement("span");
  attack.className = "hero-detail-attack";
  meta.appendChild(element);
  meta.appendChild(attack);

  info.appendChild(topline);
  info.appendChild(meta);

  header.appendChild(portrait);
  header.appendChild(info);

  const skillRow = document.createElement("div");
  skillRow.className = "hero-detail-skill";
  const skillIcon = document.createElement("span");
  skillIcon.className = "hero-detail-skill-icon";
  skillIcon.style.setProperty("--element-gradient", getElementGradient(hero.element));
  if (hero.skillIcon) {
    skillIcon.innerHTML = hero.skillIcon;
  } else {
    const iconFallback = document.createElement("span");
    iconFallback.className = "skill-icon-fallback";
    iconFallback.textContent = hero.skillName.charAt(0);
    skillIcon.appendChild(iconFallback);
  }
  const skillInfo = document.createElement("div");
  skillInfo.className = "hero-detail-skill-info";
  const skillName = document.createElement("p");
  skillName.className = "hero-detail-skill-name";
  skillName.textContent = hero.skillName;
  const skillDesc = document.createElement("p");
  skillDesc.className = "hero-detail-skill-desc";
  skillDesc.textContent = hero.skillDescription;
  skillInfo.appendChild(skillName);
  skillInfo.appendChild(skillDesc);
  skillRow.appendChild(skillIcon);
  skillRow.appendChild(skillInfo);

  const progress = document.createElement("div");
  progress.className = "hero-detail-progress";
  const progressBar = document.createElement("div");
  progressBar.className = "hero-detail-progress-bar";
  const progressFill = document.createElement("div");
  progressFill.className = "hero-detail-progress-fill";
  progressBar.appendChild(progressFill);
  const cooldown = document.createElement("span");
  cooldown.className = "hero-detail-cooldown";
  progress.appendChild(progressBar);
  progress.appendChild(cooldown);

  const action = document.createElement("button");
  action.type = "button";
  action.className = "hero-detail-action";
  action.textContent = "發動技能";
  action.addEventListener("click", () => {
    useHeroSkill(hero);
  });

  heroDetailPanel.appendChild(header);
  heroDetailPanel.appendChild(skillRow);
  heroDetailPanel.appendChild(progress);
  heroDetailPanel.appendChild(action);

  heroDetailElements = {
    name,
    rarity,
    element,
    attack,
    skillName,
    skillDesc,
    cooldown,
    progressFill,
    actionButton: action
  };

  updateHeroDetailUI();
}

function canUseHeroSkill(hero) {
  if (!hero) return false;
  if (isResolving || dragState || isGameOver) return false;
  return hero.skillCharge >= hero.skillMax;
}

function useHeroSkill(hero) {
  if (!canUseHeroSkill(hero)) {
    return;
  }
  hero.skillCharge = 0;
  hero.onSkill(hero);
  updateHeroUI();
  updateHeroDetailUI();
  renderBoard();
  updatePlayerPanel();
  updateEnemyPanel();
}

function updateHeroUI() {
  activeHeroes.forEach(hero => {
    const ratio = hero.skillMax > 0 ? hero.skillCharge / hero.skillMax : 1;
    if (hero.progressFill) {
      hero.progressFill.style.width = `${Math.min(1, ratio) * 100}%`;
    }
    if (hero.cardElement) {
      hero.cardElement.classList.toggle("ready", ratio >= 1);
      hero.cardElement.classList.toggle("selected", selectedHero === hero);
      hero.cardElement.setAttribute(
        "aria-label",
        `${hero.name}（${ELEMENT_MAP[hero.element]}）技能冷卻 ${hero.skillCharge}/${hero.skillMax}`
      );
    }
  });
}

function updateHeroDetailUI() {
  if (!heroDetailPanel) return;
  if (!selectedHero || !heroDetailElements) {
    heroDetailPanel.classList.remove("ready");
    return;
  }

  if (!activeHeroes.includes(selectedHero)) {
    clearHeroDetail();
    return;
  }

  const hero = selectedHero;
  heroDetailPanel.dataset.element = hero.element;
  heroDetailPanel.style.setProperty("--element-gradient", getElementGradient(hero.element));

  heroDetailElements.name.textContent = hero.name;
  heroDetailElements.rarity.textContent = "★".repeat(hero.rarity);
  heroDetailElements.element.textContent = ELEMENT_MAP[hero.element];
  heroDetailElements.attack.textContent = `攻擊 ${formatNumber(hero.attack)}`;
  heroDetailElements.skillName.textContent = hero.skillName;
  heroDetailElements.skillDesc.textContent = hero.skillDescription;

  const ratio = hero.skillMax > 0 ? hero.skillCharge / hero.skillMax : 1;
  heroDetailElements.progressFill.style.width = `${Math.min(1, ratio) * 100}%`;
  const remaining = Math.max(0, hero.skillMax - hero.skillCharge);
  heroDetailElements.cooldown.textContent =
    ratio >= 1
      ? "技能已就緒"
      : `冷卻 ${hero.skillCharge}/${hero.skillMax}（剩餘 ${remaining}）`;

  const usable = canUseHeroSkill(hero);
  heroDetailElements.actionButton.disabled = !usable;
  heroDetailElements.actionButton.setAttribute("aria-disabled", usable ? "false" : "true");
  heroDetailPanel.classList.toggle("ready", hero.skillCharge >= hero.skillMax);
}

function getCellFromEvent(event) {
  const rect = boardElement.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  if (x < 0 || y < 0 || x > rect.width || y > rect.height) {
    return null;
  }
  const col = Math.min(COLS - 1, Math.max(0, Math.floor((x / rect.width) * COLS)));
  const row = Math.min(ROWS - 1, Math.max(0, Math.floor((y / rect.height) * ROWS)));
  return { row, col };
}

function isAdjacent(a, b) {
  const dr = Math.abs(a.row - b.row);
  const dc = Math.abs(a.col - b.col);
  return (dr === 1 && dc === 0) || (dr === 0 && dc === 1);
}

function handlePointerDown(event) {
  if (isResolving || isGameOver) return;
  const cell = getCellFromEvent(event);
  if (!cell) return;
  if (dragState) return;

  const moveBonus = playerState.bonusMoveTime;
  const duration = BASE_MOVE_TIME + moveBonus;
  playerState.bonusMoveTime = Math.max(0, playerState.bonusMoveTime - moveBonus);

  dragState = {
    pointerId: event.pointerId,
    lastCell: cell,
    path: [`${cell.row},${cell.col}`],
    duration
  };
  boardElement.classList.add("dragging");
  boardElement.setPointerCapture(event.pointerId);
  renderBoard();
  updateHeroDetailUI();
  updatePlayerPanel();
  startMoveTimer(duration);
}

function handlePointerMove(event) {
  if (!dragState || event.pointerId !== dragState.pointerId) return;
  const cell = getCellFromEvent(event);
  if (!cell) return;

  const last = dragState.lastCell;
  if (cell.row === last.row && cell.col === last.col) return;
  if (!isAdjacent(cell, last)) return;

  swapCells(last, cell);
  dragState.lastCell = cell;
  dragState.path.push(`${cell.row},${cell.col}`);
  renderBoard();
}

function handlePointerUp(event) {
  if (!dragState || event.pointerId !== dragState.pointerId) return;
  endDrag();
}

function handlePointerCancel(event) {
  if (!dragState || event.pointerId !== dragState.pointerId) return;
  endDrag();
}

function startMoveTimer(duration) {
  if (moveTimerFrame) cancelAnimationFrame(moveTimerFrame);
  const start = performance.now();
  moveDeadline = start + duration * 1000;

  const update = now => {
    if (!dragState) {
      moveBar.style.width = "0%";
      return;
    }
    const remaining = moveDeadline - now;
    if (remaining <= 0) {
      moveBar.style.width = "0%";
      endDrag();
      return;
    }
    const ratio = remaining / (duration * 1000);
    moveBar.style.width = `${Math.max(0, Math.min(1, ratio)) * 100}%`;
    moveTimerFrame = requestAnimationFrame(update);
  };

  moveBar.style.width = "100%";
  moveTimerFrame = requestAnimationFrame(update);
}

function cancelMoveTimer() {
  if (moveTimerFrame) {
    cancelAnimationFrame(moveTimerFrame);
    moveTimerFrame = null;
  }
  moveDeadline = null;
  moveBar.style.width = "0%";
}

function endDrag() {
  if (!dragState) return;
  try {
    boardElement.releasePointerCapture(dragState.pointerId);
  } catch (err) {
    // ignore pointer release failure
  }
  dragState = null;
  boardElement.classList.remove("dragging");
  cancelMoveTimer();
  renderBoard();
  updateHeroDetailUI();
  resolveBoard();
}

async function resolveBoard() {
  if (isResolving) return;
  isResolving = true;
  updateHeroDetailUI();

  let totalCombos = 0;
  let totalCascades = 0;
  const elementCombos = Object.fromEntries(ORB_TYPES.map(orb => [orb.id, 0]));
  const elementOrbs = Object.fromEntries(ORB_TYPES.map(orb => [orb.id, 0]));

  while (true) {
    const matchResult = findMatches(board);
    if (matchResult.cells.size === 0) break;
    totalCascades++;
    totalCombos += matchResult.groups.length;

    const highlightSet = matchResult.cells;
    renderBoard(highlightSet);
    await wait(260);

    matchResult.groups.forEach(group => {
      elementCombos[group.type] += 1;
      elementOrbs[group.type] += group.cells.length;
    });

    matchResult.cells.forEach(key => {
      const [r, c] = key.split(",").map(Number);
      board[r][c] = null;
    });
    renderBoard(highlightSet);
    await wait(120);

    collapseBoard();
    renderBoard();
    await wait(200);
  }

  if (totalCombos > 0) {
    applyComboEffects(totalCombos, totalCascades, elementCombos, elementOrbs);
  } else {
    logMessage("未成功消除，敵人逼近了！");
    advancePlayerTurn();
  }

  updateHeroUI();
  updateHeroDetailUI();
  updatePlayerPanel();
  updateEnemyPanel();

  if (!isGameOver) {
    await enemyTurn();
  }

  isResolving = false;
  updateHeroDetailUI();
  updatePlayerPanel();
  updateEnemyPanel();
}

function findMatches(grid) {
  const cells = new Set();
  const groups = [];

  for (let r = 0; r < ROWS; r++) {
    let streak = 1;
    for (let c = 1; c <= COLS; c++) {
      if (c < COLS && grid[r][c] === grid[r][c - 1] && grid[r][c]) {
        streak++;
      } else {
        if (streak >= 3 && grid[r][c - 1]) {
          const type = grid[r][c - 1];
          const comboCells = [];
          for (let k = 1; k <= streak; k++) {
            const key = `${r},${c - k}`;
            cells.add(key);
            comboCells.push(key);
          }
          groups.push({ type, cells: comboCells });
        }
        streak = 1;
      }
    }
  }

  for (let c = 0; c < COLS; c++) {
    let streak = 1;
    for (let r = 1; r <= ROWS; r++) {
      if (r < ROWS && grid[r][c] === grid[r - 1][c] && grid[r][c]) {
        streak++;
      } else {
        if (streak >= 3 && grid[r - 1][c]) {
          const type = grid[r - 1][c];
          const comboCells = [];
          for (let k = 1; k <= streak; k++) {
            const key = `${r - k},${c}`;
            cells.add(key);
            comboCells.push(key);
          }
          groups.push({ type, cells: comboCells });
        }
        streak = 1;
      }
    }
  }

  return { cells, groups };
}

function collapseBoard() {
  for (let c = 0; c < COLS; c++) {
    const column = [];
    for (let r = ROWS - 1; r >= 0; r--) {
      if (board[r][c]) {
        column.push(board[r][c]);
      }
    }
    for (let r = ROWS - 1; r >= 0; r--) {
      board[r][c] = column[ROWS - 1 - r] || randomOrb();
    }
  }
}

function applyComboEffects(totalCombos, cascades, elementCombos, elementOrbs) {
  let comboMultiplier = 1 + 0.25 * (totalCombos - 1);
  if (playerState.comboBoostTurns > 0) {
    comboMultiplier *= 1 + playerState.comboBoostValue;
  }
  const cascadeBonus = 1 + 0.1 * Math.max(0, cascades - 1);
  const resonanceActive = totalCombos >= 6;
  const resonanceBonus = resonanceActive ? 1.35 : 1;

  const summary = [];
  const cascadeText = cascades > 1 ? `，落珠 ${cascades} 次` : "";
  summary.push(`達成 ${totalCombos} 連鎖，倍率 x${comboMultiplier.toFixed(2)}${cascadeText}`);
  if (resonanceActive) {
    summary.push("靈能共鳴觸發！全體獲得額外傷害。");
  }

  let totalDamage = 0;
  activeHeroes.forEach(hero => {
    const combos = elementCombos[hero.element] || 0;
    const orbs = elementOrbs[hero.element] || 0;
    let damage = 0;
    if (combos > 0) {
      const base = hero.attack;
      const elementBonus = 1 + 0.5 * (combos - 1) + 0.05 * Math.max(0, orbs - combos * 3);
      let multiplier = comboMultiplier * cascadeBonus * elementBonus * resonanceBonus;
      if (playerState.damageBoostTurns > 0) {
        multiplier *= playerState.damageBoostValue;
      }
      const elementBuff = playerState.elementBuffs[hero.element];
      if (elementBuff && elementBuff.turns > 0) {
        multiplier *= 1 + elementBuff.value;
      }
      let rawDamage = Math.round(base * multiplier);
      if (enemyState.shieldElement === hero.element) {
        rawDamage = Math.round(rawDamage * (1 - enemyState.shieldReduction));
        if (rawDamage > 0) {
          summary.push(`${hero.name} 造成 ${formatNumber(rawDamage)} 傷害（護盾減免）`);
        } else {
          summary.push(`${hero.name} 的攻擊被護盾完全抵銷`);
        }
      } else {
        summary.push(`${hero.name} 造成 ${formatNumber(rawDamage)} 傷害`);
      }
      if (enemyState.armorBreakTurns > 0) {
        rawDamage = Math.round(rawDamage * (1 + enemyState.armorBreakValue));
      }
      damage = Math.max(0, rawDamage);
    }

    if (combos > 0 || elementCombos.heart > 0) {
      const charge = combos + (elementCombos.heart > 0 ? 1 : 0) + (resonanceActive ? 1 : 0);
      hero.skillCharge = Math.min(hero.skillMax, hero.skillCharge + charge);
    } else {
      hero.skillCharge = Math.min(hero.skillMax, hero.skillCharge + 1);
    }

    totalDamage += damage;
  });

  const heartCombos = elementCombos.heart || 0;
  if (heartCombos > 0) {
    const heal = Math.round(500 * (elementOrbs.heart || 0) * (1 + 0.15 * Math.max(0, heartCombos - 1)));
    healPlayer(heal, "符石治癒：");
  }

  if (totalDamage > 0) {
    enemyState.hp = Math.max(0, enemyState.hp - totalDamage);
    summary.push(`總傷害 ${formatNumber(totalDamage)}`);
    updateEnemyPanel();
    if (enemyState.hp <= 0) {
      logMessage(summary.join("；"));
      handleVictory();
      return;
    }
    checkEnemyPhaseTransitions();
  }

  if (summary.length > 0) {
    logMessage(summary.join("；"));
  }

  advancePlayerTurn();
}
function healPlayer(amount, prefix = "") {
  if (amount <= 0) return;
  const before = playerState.hp;
  playerState.hp = Math.min(playerState.maxHp, playerState.hp + amount);
  const actual = playerState.hp - before;
  if (actual > 0) {
    logMessage(`${prefix}回復 ${formatNumber(actual)} HP`);
  }
}

function healPlayerPercent(percent, prefix = "") {
  const amount = Math.round(playerState.maxHp * percent);
  healPlayer(amount, prefix);
}

function advancePlayerTurn() {
  if (playerState.damageBoostTurns > 0) {
    playerState.damageBoostTurns -= 1;
    if (playerState.damageBoostTurns === 0) {
      playerState.damageBoostValue = 1;
    }
  }
  if (playerState.comboBoostTurns > 0) {
    playerState.comboBoostTurns -= 1;
    if (playerState.comboBoostTurns === 0) {
      playerState.comboBoostValue = 0;
    }
  }
  Object.keys(playerState.elementBuffs).forEach(element => {
    const buff = playerState.elementBuffs[element];
    buff.turns -= 1;
    if (buff.turns <= 0) {
      delete playerState.elementBuffs[element];
    }
  });
  if (enemyState.armorBreakTurns > 0) {
    enemyState.armorBreakTurns -= 1;
    if (enemyState.armorBreakTurns === 0) {
      enemyState.armorBreakValue = 0;
    }
  }
}

function applyDamageBoost(multiplier, turns, message) {
  if (playerState.damageBoostTurns > 0) {
    playerState.damageBoostValue = Math.max(playerState.damageBoostValue, multiplier);
    playerState.damageBoostTurns = Math.max(playerState.damageBoostTurns, turns);
  } else {
    playerState.damageBoostValue = multiplier;
    playerState.damageBoostTurns = turns;
  }
  if (message) {
    logMessage(message);
  }
}

function applyShield(value, turns, message) {
  playerState.shieldValue = Math.max(playerState.shieldValue, value);
  playerState.shieldTurns = Math.max(playerState.shieldTurns, turns);
  if (message) {
    logMessage(message);
  }
}

function applyEnemyWeaken(value, turns, message) {
  enemyState.weakenValue = Math.max(enemyState.weakenValue, value);
  enemyState.weakenTurns = Math.max(enemyState.weakenTurns, turns);
  if (message) {
    logMessage(message);
  }
}

function applyArmorBreak(value, turns, message) {
  enemyState.armorBreakValue = Math.max(enemyState.armorBreakValue, value);
  enemyState.armorBreakTurns = Math.max(enemyState.armorBreakTurns, turns);
  if (message) {
    logMessage(message);
  }
  updateEnemyPanel();
}

function applyEnemyDot({ damage, turns, label }) {
  enemyState.dotEffects.push({ damage, turns, label });
  logMessage(`${label}：敵人將在 ${turns} 回合內持續受創！`);
  updateEnemyPanel();
}

function applyEnemyActionLock(turns, message) {
  enemyState.actionLockTurns = Math.max(enemyState.actionLockTurns, turns);
  if (message) {
    logMessage(message);
  }
  updateEnemyPanel();
}

function applyCountdownDelay(turns, message) {
  enemyState.countdownDelay += turns;
  if (message) {
    logMessage(message);
  }
  updateEnemyPanel();
}

function applyComboBoost(value, turns, message) {
  playerState.comboBoostValue = Math.max(playerState.comboBoostValue, value);
  playerState.comboBoostTurns = Math.max(playerState.comboBoostTurns, turns);
  if (message) {
    logMessage(message);
  }
}

function applyElementBuff(element, value, turns) {
  const current = playerState.elementBuffs[element];
  if (current) {
    current.value = Math.max(current.value, value);
    current.turns = Math.max(current.turns, turns);
  } else {
    playerState.elementBuffs[element] = { value, turns };
  }
  logMessage(`${ELEMENT_MAP[element]}攻擊提升 ${Math.round(value * 100)}% 持續 ${turns} 回合！`);
}

function applyRegen(amount, turns, label) {
  playerState.regenEffects.push({ amount, turns, label });
  logMessage(`${label}：接下來 ${turns} 回合每回合回復 ${formatNumber(amount)}。`);
}

function chargeTeam(amount, options = {}) {
  const { element = null, excludeId = null } = options;
  activeHeroes.forEach(hero => {
    if (excludeId && hero.id === excludeId) return;
    if (element && hero.element !== element) return;
    hero.skillCharge = Math.min(hero.skillMax, hero.skillCharge + amount);
  });
}

function dealDirectDamage(amount, label, options = {}) {
  const { element = null, ignoreShield = true } = options;
  let finalDamage = Math.round(amount);
  if (!ignoreShield && element && enemyState.shieldElement === element) {
    finalDamage = Math.round(finalDamage * (1 - enemyState.shieldReduction));
  }
  if (enemyState.armorBreakTurns > 0) {
    finalDamage = Math.round(finalDamage * (1 + enemyState.armorBreakValue));
  }
  finalDamage = Math.max(0, finalDamage);
  if (finalDamage <= 0) {
    logMessage(`${label}被敵人的護盾抵擋。`);
    return;
  }
  enemyState.hp = Math.max(0, enemyState.hp - finalDamage);
  logMessage(`${label}造成 ${formatNumber(finalDamage)} 傷害！`);
  updateEnemyPanel();
  if (enemyState.hp <= 0) {
    handleVictory();
  } else {
    checkEnemyPhaseTransitions();
  }
}

function extendMoveTime(seconds, message) {
  playerState.bonusMoveTime = Math.max(0, playerState.bonusMoveTime + seconds);
  if (message) {
    logMessage(message);
  }
}

function paintRandomOrbs(element, count) {
  const positions = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      positions.push({ r, c });
    }
  }
  shuffle(positions);
  let painted = 0;
  for (let i = 0; i < positions.length && painted < count; i++) {
    const pos = positions[i];
    if (board[pos.r][pos.c] !== element) {
      board[pos.r][pos.c] = element;
      painted++;
    }
  }
  renderBoard();
  return painted;
}

function countOrbs(type) {
  let total = 0;
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (board[r][c] === type) total++;
    }
  }
  return total;
}

function convertOrbs(fromType, toType, maxCount) {
  const positions = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (board[r][c] === fromType) {
        positions.push({ r, c });
      }
    }
  }
  if (positions.length === 0) return 0;
  shuffle(positions);
  const count = Math.min(maxCount, positions.length);
  for (let i = 0; i < count; i++) {
    const pos = positions[i];
    board[pos.r][pos.c] = toType;
  }
  renderBoard();
  return count;
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function shuffleBoard() {
  const flat = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      flat.push(board[r][c]);
    }
  }
  shuffle(flat);
  let index = 0;
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      board[r][c] = flat[index++];
    }
  }
  renderBoard();
}

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function swapCells(a, b) {
  const temp = board[a.row][a.col];
  board[a.row][a.col] = board[b.row][b.col];
  board[b.row][b.col] = temp;
}

async function enemyTurn() {
  if (enemyState.hp <= 0 || isGameOver) return;

  if (processEnemyDamageOverTime()) {
    return;
  }
  if (isGameOver) return;

  if (enemyState.actionLockTurns > 0) {
    enemyState.actionLockTurns -= 1;
    logMessage('敵人被束縛，無法行動！');
    updateEnemyPanel();
    processPlayerRegen();
    return;
  }

  if (enemyState.countdownDelay > 0) {
    enemyState.countdownDelay -= 1;
    logMessage('時間禁錮延緩了敵人的倒數。');
    updateEnemyPanel();
    processPlayerRegen();
    return;
  }

  enemyState.countdown -= 1;
  if (enemyState.countdown > 0) {
    logMessage(`敵人倒數 ${enemyState.countdown}，危機逼近。`);
    updateEnemyPanel();
    processPlayerRegen();
    return;
  }

  let attackPower = enemyState.attack;
  if (enemyState.weakenTurns > 0) {
    attackPower = Math.round(attackPower * (1 - enemyState.weakenValue));
  }
  if (playerState.shieldTurns > 0) {
    attackPower = Math.round(attackPower * (1 - playerState.shieldValue));
  }
  attackPower = Math.max(0, attackPower);

  if (attackPower === 0) {
    logMessage('護盾抵擋了所有傷害！');
  } else {
    playerState.hp = Math.max(0, playerState.hp - attackPower);
    logMessage(`虛空審判者釋放黑暗制裁，造成 ${formatNumber(attackPower)} 傷害！`);
  }

  enemyState.countdown = enemyState.countdownMax;

  if (playerState.shieldTurns > 0) {
    playerState.shieldTurns -= 1;
    if (playerState.shieldTurns === 0) {
      playerState.shieldValue = 0;
    }
  }
  if (enemyState.weakenTurns > 0) {
    enemyState.weakenTurns -= 1;
    if (enemyState.weakenTurns === 0) {
      enemyState.weakenValue = 0;
    }
  }

  processPlayerRegen();

  if (playerState.hp <= 0) {
    handleDefeat();
  }
  processPlayerRegen();
}

function processEnemyDamageOverTime() {
  if (enemyState.dotEffects.length === 0) return false;
  let totalDamage = 0;
  const parts = [];
  enemyState.dotEffects = enemyState.dotEffects.filter(effect => {
    if (effect.turns <= 0) return false;
    let damage = Math.round(effect.damage);
    if (enemyState.armorBreakTurns > 0) {
      damage = Math.round(damage * (1 + enemyState.armorBreakValue));
    }
    if (damage > 0) {
      enemyState.hp = Math.max(0, enemyState.hp - damage);
      parts.push(`${effect.label}造成 ${formatNumber(damage)} 傷害`);
      totalDamage += damage;
    }
    effect.turns -= 1;
    return effect.turns > 0;
  });
  if (totalDamage > 0) {
    logMessage(parts.join('；'));
    updateEnemyPanel();
    if (enemyState.hp <= 0) {
      handleVictory();
      return true;
    }
    checkEnemyPhaseTransitions();
  }
  return false;
}

function processPlayerRegen() {
  if (playerState.regenEffects.length === 0) return;
  const remaining = [];
  playerState.regenEffects.forEach(effect => {
    if (effect.turns <= 0) return;
    healPlayer(effect.amount, `${effect.label}：`);
    effect.turns -= 1;
    if (effect.turns > 0) {
      remaining.push(effect);
    }
  });
  playerState.regenEffects = remaining;
}

function handleVictory() {
  if (isGameOver) return;
  isGameOver = true;
  updateEnemyPanel();
  logMessage('敵方護盾瓦解，守護者勝利！');
  showOverlay('勝利', '你擊敗了虛空審判者，解放了失落的聖城。');
}

function handleDefeat() {
  if (isGameOver) return;
  isGameOver = true;
  updatePlayerPanel();
  logMessage('隊伍遭受重創，戰鬥失敗……');
  showOverlay('戰敗', '調整隊伍或多多練習連鎖，再次挑戰！');
}

function showOverlay(title, message) {
  overlayTitle.textContent = title;
  overlayMessage.textContent = message;
  overlay.classList.remove('hidden');
}

function hideOverlay() {
  overlay.classList.add('hidden');
}

function enterEnemyPhase(index, silent = false) {
  const phase = ENEMY_PHASES[index];
  enemyState.phaseIndex = index;
  enemyState.shieldElement = phase.shieldElement;
  enemyState.shieldReduction = phase.shieldReduction;
  enemyState.attack = phase.attack;
  enemyState.countdownMax = phase.countdownMax;
  enemyState.countdown = Math.min(enemyState.countdown, enemyState.countdownMax);
  if (!silent && phase.announcement) {
    logMessage(phase.announcement);
  }
  updateEnemyPanel();
}

function checkEnemyPhaseTransitions() {
  const ratio = enemyState.hp / enemyState.maxHp;
  for (let i = enemyState.phaseIndex + 1; i < ENEMY_PHASES.length; i++) {
    if (ratio <= ENEMY_PHASES[i].threshold) {
      enemyState.countdown = Math.min(enemyState.countdown + 1, ENEMY_PHASES[i].countdownMax);
      enterEnemyPhase(i);
    }
  }
}

function resetGame() {
  board = createInitialBoard();
  playerState.hp = playerState.maxHp;
  playerState.shieldTurns = 0;
  playerState.shieldValue = 0;
  playerState.damageBoostTurns = 0;
  playerState.damageBoostValue = 1;
  playerState.comboBoostTurns = 0;
  playerState.comboBoostValue = 0;
  playerState.bonusMoveTime = 0;
  playerState.regenEffects = [];
  playerState.elementBuffs = {};

  enemyState.hp = enemyState.maxHp;
  enemyState.countdown = ENEMY_PHASES[0].countdownMax;
  enemyState.countdownMax = ENEMY_PHASES[0].countdownMax;
  enemyState.weakenTurns = 0;
  enemyState.weakenValue = 0;
  enemyState.dotEffects = [];
  enemyState.actionLockTurns = 0;
  enemyState.countdownDelay = 0;
  enemyState.armorBreakTurns = 0;
  enemyState.armorBreakValue = 0;
  enemyState.phaseIndex = 0;
  enterEnemyPhase(0, true);

  activeHeroes.forEach(hero => {
    hero.skillCharge = 0;
  });

  logHistory.length = 0;
  isResolving = false;
  isGameOver = false;
  dragState = null;
  hideOverlay();
  cancelMoveTimer();
  renderBoard();
  updateHeroUI();
  updateHeroDetailUI();
  updatePlayerPanel();
  updateEnemyPanel();
  logMessage('戰鬥開始！拖曳符石創造最大連鎖。');
  logMessage(ENEMY_PHASES[0].announcement);
}
function showTeamStage(mode = "overlay") {
  if (!teamStage) return;
  if (mode === "initial") {
    teamStage.classList.add("initial");
  } else {
    teamStage.classList.remove("initial");
  }
  teamStage.classList.add("visible");
}

function hideTeamStage() {
  if (!teamStage) return;
  teamStage.classList.remove("visible");
}

function openTeamBuilder(options = {}) {
  if (isResolving) return;
  const mode = options.mode || (hasBattleStarted ? "overlay" : "initial");
  if (activeHeroes.length > 0) {
    teamSelection = activeHeroes.map(hero => hero.id);
  }
  renderTeamSelection();
  renderCollectionGrid();
  applyTeamButton.textContent = hasBattleStarted
    ? "套用隊伍並重新挑戰"
    : "確認隊伍並進入戰鬥";
  showTeamStage(mode);
}

function renderTeamSelection() {
  teamSelectedContainer.innerHTML = '';
  for (let i = 0; i < TEAM_SIZE; i++) {
    const slot = document.createElement('div');
    slot.className = 'team-slot';
    const heroId = teamSelection[i];
    if (heroId) {
      const heroData = heroIndex[heroId];
      const top = document.createElement('div');
      top.className = 'team-slot-top';

      const portrait = document.createElement('div');
      portrait.className = 'team-slot-icon';
      portrait.style.setProperty('--element-gradient', getElementGradient(heroData.element));
      if (heroData.icon) {
        portrait.innerHTML = heroData.icon;
      } else {
        const fallback = document.createElement('span');
        fallback.className = 'hero-icon-fallback';
        fallback.textContent = heroData.name.slice(0, 2);
        portrait.appendChild(fallback);
      }

      const details = document.createElement('div');
      details.className = 'team-slot-details';

      const name = document.createElement('h4');
      name.textContent = heroData.name;

      const meta = document.createElement('p');
      meta.className = 'team-slot-meta';
      meta.textContent = `${ELEMENT_MAP[heroData.element]} ｜ 稀有度 ${'★'.repeat(heroData.rarity)} ｜ 攻擊 ${formatNumber(heroData.attack)} ｜ CD ${heroData.skillCooldown}`;

      const skillRow = document.createElement('div');
      skillRow.className = 'team-slot-skill';
      const skillIcon = document.createElement('span');
      skillIcon.className = 'team-slot-skill-icon';
      skillIcon.style.setProperty('--element-gradient', getElementGradient(heroData.element));
      if (heroData.skillIcon) {
        skillIcon.innerHTML = heroData.skillIcon;
      } else {
        const iconFallback = document.createElement('span');
        iconFallback.className = 'skill-icon-fallback';
        iconFallback.textContent = heroData.skillName.charAt(0);
        skillIcon.appendChild(iconFallback);
      }
      const skillText = document.createElement('p');
      skillText.className = 'team-slot-skill-text';
      skillText.textContent = `${heroData.skillName}：${heroData.skillDescription}`;
      skillRow.appendChild(skillIcon);
      skillRow.appendChild(skillText);

      details.appendChild(name);
      details.appendChild(meta);
      details.appendChild(skillRow);

      top.appendChild(portrait);
      top.appendChild(details);

      slot.appendChild(top);

      const remove = document.createElement('button');
      remove.type = 'button';
      remove.className = 'team-slot-remove';
      remove.textContent = '移除';
      remove.addEventListener('click', () => {
        teamSelection.splice(i, 1);
        renderTeamSelection();
        renderCollectionGrid();
      });
      slot.appendChild(remove);
    } else {
      slot.classList.add('empty');
      slot.textContent = `空位 ${i + 1}`;
    }
    teamSelectedContainer.appendChild(slot);
  }
  teamMessage.textContent = `已選擇 ${teamSelection.length} / ${TEAM_SIZE} 名英雄`;
  applyTeamButton.disabled = teamSelection.length !== TEAM_SIZE;
}

function renderCollectionGrid() {
  collectionGrid.innerHTML = '';
  HERO_LIBRARY.forEach(hero => {
    const card = document.createElement('article');
    card.className = 'collection-card';
    card.dataset.element = hero.element;
    if (teamSelection.includes(hero.id)) {
      card.classList.add('selected');
    }

    const header = document.createElement('div');
    header.className = 'collection-header';
    const name = document.createElement('h4');
    name.textContent = hero.name;
    const stars = document.createElement('span');
    stars.className = 'collection-stars';
    stars.textContent = '★'.repeat(hero.rarity);
    header.appendChild(name);
    header.appendChild(stars);

    const portrait = document.createElement('div');
    portrait.className = 'collection-portrait';
    portrait.style.setProperty('--element-gradient', getElementGradient(hero.element));
    if (hero.icon) {
      portrait.innerHTML = hero.icon;
    } else {
      const fallback = document.createElement('span');
      fallback.className = 'hero-icon-fallback';
      fallback.textContent = hero.name.slice(0, 2);
      portrait.appendChild(fallback);
    }

    const elementBadge = document.createElement('span');
    elementBadge.className = 'collection-element';
    elementBadge.textContent = ELEMENT_MAP[hero.element];

    const attack = document.createElement('p');
    attack.className = 'collection-attack';
    attack.textContent = `攻擊 ${formatNumber(hero.attack)} ｜ CD ${hero.skillCooldown}`;

    const skill = document.createElement('div');
    skill.className = 'collection-skill';
    const skillIcon = document.createElement('span');
    skillIcon.className = 'collection-skill-icon';
    skillIcon.style.setProperty('--element-gradient', getElementGradient(hero.element));
    if (hero.skillIcon) {
      skillIcon.innerHTML = hero.skillIcon;
    } else {
      const iconFallback = document.createElement('span');
      iconFallback.className = 'skill-icon-fallback';
      iconFallback.textContent = hero.skillName.charAt(0);
      skillIcon.appendChild(iconFallback);
    }
    const skillText = document.createElement('p');
    skillText.className = 'collection-skill-text';
    skillText.textContent = `${hero.skillName}：${hero.skillDescription}`;
    skill.appendChild(skillIcon);
    skill.appendChild(skillText);

    const action = document.createElement('button');
    action.type = 'button';
    action.className = 'collection-action';
    if (teamSelection.includes(hero.id)) {
      action.textContent = '移出隊伍';
      action.disabled = false;
      action.addEventListener('click', () => {
        teamSelection = teamSelection.filter(id => id !== hero.id);
        renderTeamSelection();
        renderCollectionGrid();
      });
    } else if (teamSelection.length >= TEAM_SIZE) {
      action.textContent = '隊伍已滿';
      action.disabled = true;
    } else {
      action.textContent = '加入隊伍';
      action.addEventListener('click', () => {
        teamSelection.push(hero.id);
        renderTeamSelection();
        renderCollectionGrid();
      });
    }

    card.appendChild(header);
    card.appendChild(portrait);
    card.appendChild(elementBadge);
    card.appendChild(attack);
    card.appendChild(skill);
    card.appendChild(action);
    collectionGrid.appendChild(card);
  });
}

function applyTeamSelection() {
  if (teamSelection.length !== TEAM_SIZE) {
    teamMessage.textContent = '請選滿五名英雄後再開始戰鬥。';
    return;
  }
  setActiveHeroes(teamSelection);
  if (!hasBattleStarted) {
    hasBattleStarted = true;
    battleScreen.classList.remove('hidden');
    teamStage.classList.remove('initial');
  }
  hideTeamStage();
  resetGame();
}

function setActiveHeroes(heroIds) {
  activeHeroes = heroIds.map(id => instantiateHero(heroIndex[id]));
  createHeroCards();
  clearHeroDetail();
}

boardElement.addEventListener('pointerdown', handlePointerDown);
boardElement.addEventListener('pointermove', handlePointerMove);
boardElement.addEventListener('pointerup', handlePointerUp);
boardElement.addEventListener('pointercancel', handlePointerCancel);
window.addEventListener('pointerup', event => {
  if (!dragState) return;
  if (event.pointerId === dragState.pointerId) {
    endDrag();
  }
});

document.addEventListener('visibilitychange', () => {
  if (document.hidden && dragState) {
    endDrag();
  }
});

openTeamButton.addEventListener('click', () => {
  if (isResolving || !hasBattleStarted) return;
  openTeamBuilder({ mode: 'overlay' });
});

if (teamStageCloseButton) {
  teamStageCloseButton.addEventListener('click', () => {
    if (!hasBattleStarted) return;
    hideTeamStage();
  });
}

if (teamStage) {
  teamStage.addEventListener('click', event => {
    if (event.target === teamStage && hasBattleStarted) {
      hideTeamStage();
    }
  });
}

document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && hasBattleStarted && teamStage?.classList.contains('visible')) {
    hideTeamStage();
  }
});

applyTeamButton.addEventListener('click', applyTeamSelection);
restartButton.addEventListener('click', () => {
  if (hasBattleStarted) {
    resetGame();
  }
});

const initialTeam = HERO_LIBRARY.slice(0, TEAM_SIZE).map(hero => hero.id);
teamSelection = [...initialTeam];
openTeamBuilder({ mode: 'initial' });

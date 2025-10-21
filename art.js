const ELEMENT_PALETTES = {
  fire: {
    deep: '#2b0d14',
    mid: '#842021',
    bright: '#ff5e3a',
    aura: '#ffad63',
    highlight: '#ffe7b3',
    stroke: '#ff835c',
    detail: '#ffe5cc'
  },
  water: {
    deep: '#0b1d2f',
    mid: '#155a88',
    bright: '#37a4ff',
    aura: '#64d8ff',
    highlight: '#d6f6ff',
    stroke: '#4ab0ff',
    detail: '#ebfaff'
  },
  wood: {
    deep: '#102012',
    mid: '#2d7039',
    bright: '#5ece6e',
    aura: '#96f59f',
    highlight: '#e3ffdb',
    stroke: '#5fcd76',
    detail: '#ecffe9'
  },
  light: {
    deep: '#291d04',
    mid: '#7b5f1b',
    bright: '#f5c047',
    aura: '#ffe58a',
    highlight: '#fff6d4',
    stroke: '#f0c86b',
    detail: '#fff3d8'
  },
  dark: {
    deep: '#150c23',
    mid: '#45246a',
    bright: '#7d3de1',
    aura: '#9d7bff',
    highlight: '#e4d8ff',
    stroke: '#8656ff',
    detail: '#f3edff'
  }
};

function sanitizeId(value) {
  return value.replace(/[^a-z0-9-]/gi, '-');
}

const attrMap = {
  strokeWidth: 'stroke-width',
  strokeLinecap: 'stroke-linecap',
  strokeLinejoin: 'stroke-linejoin',
  fillOpacity: 'fill-opacity',
  strokeOpacity: 'stroke-opacity',
  className: 'class'
};

function shapeAttrs(options = {}) {
  return Object.entries(options)
    .filter(([, value]) => value !== undefined && value !== null)
    .map(([key, value]) => {
      const attr = attrMap[key] || key;
      return ` ${attr}="${value}"`;
    })
    .join('');
}

function pathShape(d, options = {}) {
  return `<path d="${d}"${shapeAttrs(options)} />`;
}

function circleShape(cx, cy, r, options = {}) {
  return `<circle cx="${cx}" cy="${cy}" r="${r}"${shapeAttrs(options)} />`;
}

function rectShape(x, y, width, height, options = {}) {
  return `<rect x="${x}" y="${y}" width="${width}" height="${height}"${shapeAttrs(options)} />`;
}

function polygonShape(points, options = {}) {
  return `<polygon points="${points}"${shapeAttrs(options)} />`;
}

function polylineShape(points, options = {}) {
  return `<polyline points="${points}"${shapeAttrs(options)} />`;
}

function starShape(cx, cy, spikes, outerRadius, innerRadius, options = {}) {
  const step = Math.PI / spikes;
  const points = [];
  for (let i = 0; i < spikes * 2; i++) {
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    const angle = i * step - Math.PI / 2;
    const x = cx + Math.cos(angle) * radius;
    const y = cy + Math.sin(angle) * radius;
    points.push(`${x.toFixed(2)},${y.toFixed(2)}`);
  }
  return polygonShape(points.join(' '), options);
}

function createHeroIcon(id, element, shapes) {
  const palette = ELEMENT_PALETTES[element];
  const safeId = sanitizeId(id);
  const gradId = `hero-${safeId}-grad`;
  const glowId = `hero-${safeId}-glow`;
  return `
<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" role="img" class="hero-icon">
  <defs>
    <linearGradient id="${gradId}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${palette.mid}" />
      <stop offset="100%" stop-color="${palette.bright}" />
    </linearGradient>
    <radialGradient id="${glowId}" cx="50%" cy="40%" r="60%">
      <stop offset="0%" stop-color="${palette.highlight}" stop-opacity="0.95" />
      <stop offset="100%" stop-color="${palette.aura}" stop-opacity="0" />
    </radialGradient>
  </defs>
  <rect x="1.5" y="1.5" width="77" height="77" rx="20" fill="${palette.deep}" stroke="${palette.stroke}" stroke-width="1.5" opacity="0.7" />
  <rect x="5" y="5" width="70" height="70" rx="18" fill="url(#${gradId})" />
  <circle cx="40" cy="36" r="26" fill="url(#${glowId})" opacity="0.88" />
  <g>${shapes.join('\n    ')}</g>
</svg>
`.trim();
}

function createSkillIcon(id, element, shapes) {
  const palette = ELEMENT_PALETTES[element];
  const safeId = sanitizeId(id);
  const gradId = `skill-${safeId}-grad`;
  const glowId = `skill-${safeId}-glow`;
  return `
<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" role="img" class="skill-icon">
  <defs>
    <linearGradient id="${gradId}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${palette.mid}" />
      <stop offset="100%" stop-color="${palette.bright}" />
    </linearGradient>
    <radialGradient id="${glowId}" cx="45%" cy="45%" r="55%">
      <stop offset="0%" stop-color="${palette.highlight}" stop-opacity="0.9" />
      <stop offset="100%" stop-color="${palette.aura}" stop-opacity="0" />
    </radialGradient>
  </defs>
  <circle cx="40" cy="40" r="35" fill="${palette.deep}" stroke="${palette.stroke}" stroke-width="1.5" opacity="0.75" />
  <circle cx="40" cy="40" r="31" fill="url(#${gradId})" />
  <circle cx="40" cy="40" r="23" fill="url(#${glowId})" opacity="0.85" />
  <g>${shapes.join('\n    ')}</g>
</svg>
`.trim();
}

const heroArtConfig = [
  // Fire heroes - 中世紀風格角色設計
  {
    id: 'ember-sovereign',
    element: 'fire',
    heroShapes: [
      // 君王身軀與披風
      pathShape('M32 46 L28 56 L34 58 L40 60 L46 58 L52 56 L48 46 Z', {
        fill: '#ff8246',
        stroke: '#ffd18c',
        'stroke-width': 1.8,
        'stroke-linejoin': 'round'
      }),
      // 頭部
      circleShape(40, 36, 6, {
        fill: '#ffcf6f',
        stroke: '#ff6433',
        'stroke-width': 1.5
      }),
      // 王冠
      pathShape('M34 32 L36 28 L38 32 L40 26 L42 32 L44 28 L46 32 L44 34 L36 34 Z', {
        fill: '#ffe7b3',
        stroke: '#ff5e3a',
        'stroke-width': 1.5,
        'stroke-linejoin': 'round'
      }),
      // 王冠寶石
      circleShape(40, 30, 2, {
        fill: '#ff5e3a',
        stroke: '#ffe7b3',
        'stroke-width': 1
      }),
      // 眼睛
      circleShape(37, 36, 1, { fill: '#ff5e3a' }),
      circleShape(43, 36, 1, { fill: '#ff5e3a' }),
      // 披風火焰紋
      pathShape('M32 52 C34 50 36 50 38 52', {
        fill: 'none',
        stroke: '#ffad63',
        'stroke-width': 1.2,
        'stroke-linecap': 'round'
      }),
      pathShape('M42 52 C44 50 46 50 48 52', {
        fill: 'none',
        stroke: '#ffad63',
        'stroke-width': 1.2,
        'stroke-linecap': 'round'
      }),
      // 火焰光環
      pathShape('M32 34 C30 32 28 32 28 34', {
        fill: '#ffad63',
        'fill-opacity': 0.7
      }),
      pathShape('M48 34 C50 32 52 32 52 34', {
        fill: '#ffad63',
        'fill-opacity': 0.7
      })
    ],
    skillShapes: [
      // 熾焰輪迴 - 火焰漩渦
      pathShape('M40 28 C48 28 54 34 54 42 C54 50 48 56 40 56 C32 56 26 50 26 42 C26 34 32 28 40 28', {
        fill: 'none',
        stroke: '#ff8246',
        'stroke-width': 2.8,
        'stroke-linecap': 'round'
      }),
      pathShape('M40 32 C44 32 48 36 48 42 C48 46 44 50 40 50 C36 50 32 46 32 42 C32 36 36 32 40 32', {
        fill: 'none',
        stroke: '#ffe7b3',
        'stroke-width': 2,
        'stroke-linecap': 'round'
      }),
      // 火焰粒子
      circleShape(28, 36, 2, { fill: '#ffad63', 'fill-opacity': 0.9 }),
      circleShape(52, 38, 2.5, { fill: '#ff5e3a', 'fill-opacity': 0.8 }),
      circleShape(30, 48, 2, { fill: '#ffe7b3', 'fill-opacity': 0.9 }),
      circleShape(50, 46, 2.5, { fill: '#ffad63', 'fill-opacity': 0.8 })
    ]
  },

  {
    id: 'drake-artillerist',
    element: 'fire',
    heroShapes: [
      // 龍頭輪廓
      pathShape('M24 42 C24 38 26 34 30 32 L36 28 L42 26 C46 26 50 28 52 32 C54 36 54 40 52 44 L48 50 C46 52 42 54 38 54 C34 54 30 52 28 48 L24 42 Z', {
        fill: '#ff8246',
        stroke: '#ffd18c',
        'stroke-width': 2,
        'stroke-linejoin': 'round'
      }),
      // 龍角
      pathShape('M36 28 C34 24 34 20 36 18 C37 21 38 24 38 28 Z', {
        fill: '#ff5e3a',
        stroke: '#ffe7b3',
        'stroke-width': 1.2
      }),
      pathShape('M42 26 C44 22 46 20 48 18 C47 21 46 24 44 28 Z', {
        fill: '#ff5e3a',
        stroke: '#ffe7b3',
        'stroke-width': 1.2
      }),
      // 龍眼
      circleShape(36, 36, 3, {
        fill: '#ffe7b3',
        stroke: '#ff5e3a',
        'stroke-width': 1
      }),
      circleShape(36, 36, 1.5, {
        fill: '#ff5e3a'
      }),
      // 龍鼻孔噴火
      pathShape('M28 44 C24 44 22 46 20 48 C22 46 24 46 28 44', {
        fill: '#ffad63',
        'fill-opacity': 0.9
      }),
      pathShape('M30 48 C26 50 24 52 22 54 C24 52 26 52 30 48', {
        fill: '#ffad63',
        'fill-opacity': 0.9
      }),
      // 龍鱗紋
      pathShape('M38 40 L44 38 L42 42 Z', {
        fill: '#ffcf6f',
        'fill-opacity': 0.6
      }),
      pathShape('M40 46 L46 44 L44 48 Z', {
        fill: '#ffcf6f',
        'fill-opacity': 0.6
      })
    ],
    skillShapes: [
      // 龍紋爆裂 - 爆炸符文
      circleShape(40, 42, 12, {
        fill: 'none',
        stroke: '#ff8246',
        'stroke-width': 2.5,
        'stroke-dasharray': '8 4'
      }),
      // 龍紋符號
      pathShape('M36 36 L44 36 L44 44 L36 44 Z', {
        fill: 'none',
        stroke: '#ffe7b3',
        'stroke-width': 2,
        'stroke-linejoin': 'round'
      }),
      pathShape('M32 40 L36 40 M44 40 L48 40', {
        fill: 'none',
        stroke: '#ffad63',
        'stroke-width': 1.8,
        'stroke-linecap': 'round'
      }),
      pathShape('M40 32 L40 36 M40 44 L40 48', {
        fill: 'none',
        stroke: '#ffad63',
        'stroke-width': 1.8,
        'stroke-linecap': 'round'
      }),
      // 爆炸火花
      starShape(30, 32, 4, 3, 1.5, { fill: '#ff5e3a', 'fill-opacity': 0.9 }),
      starShape(50, 34, 4, 3.5, 1.5, { fill: '#ffad63', 'fill-opacity': 0.9 }),
      starShape(32, 50, 4, 3, 1.5, { fill: '#ffe7b3', 'fill-opacity': 0.9 }),
      starShape(48, 48, 4, 3.5, 1.5, { fill: '#ff5e3a', 'fill-opacity': 0.9 })
    ]
  },
  {
    id: 'radiant-vanguard',
    element: 'fire',
    heroShapes: [
      // 騎士身軀與鎧甲
      pathShape('M32 44 L28 54 L32 58 L40 60 L48 58 L52 54 L48 44 Z', {
        fill: '#ff8246',
        stroke: '#ffd18c',
        'stroke-width': 2,
        'stroke-linejoin': 'round'
      }),
      // 頭盔
      pathShape('M34 36 L32 42 L34 44 L46 44 L48 42 L46 36 Z', {
        fill: '#ffcf6f',
        stroke: '#ff6433',
        'stroke-width': 1.8,
        'stroke-linejoin': 'round'
      }),
      // 頭盔頂部
      pathShape('M36 36 L38 32 L40 28 L42 32 L44 36 Z', {
        fill: '#ffe7b3',
        stroke: '#ff5e3a',
        'stroke-width': 1.5,
        'stroke-linejoin': 'round'
      }),
      // 面甲十字縫
      pathShape('M40 38 L40 44', {
        fill: 'none',
        stroke: '#ff5e3a',
        'stroke-width': 1.5
      }),
      pathShape('M36 40 L44 40', {
        fill: 'none',
        stroke: '#ff5e3a',
        'stroke-width': 1.5
      }),
      // 肩甲
      pathShape('M28 46 L26 48 L28 50 L30 48 Z', {
        fill: '#ffcf6f',
        stroke: '#ff6433',
        'stroke-width': 1.2
      }),
      pathShape('M52 46 L54 48 L52 50 L50 48 Z', {
        fill: '#ffcf6f',
        stroke: '#ff6433',
        'stroke-width': 1.2
      }),
      // 盾牌（手持）
      pathShape('M24 48 L22 52 L24 56 L28 56 L28 52 Z', {
        fill: '#ffe7b3',
        stroke: '#ff8246',
        'stroke-width': 1.5,
        'stroke-linejoin': 'round'
      }),
      // 火焰光芒
      pathShape('M40 26 L38 28 L42 28 Z', {
        fill: '#ffad63',
        'fill-opacity': 0.8
      })
    ],
    skillShapes: [
      // 煌焰審判 - 聖劍斬擊
      pathShape('M40 22 L40 58', {
        fill: 'none',
        stroke: '#ffe7b3',
        'stroke-width': 4,
        'stroke-linecap': 'round'
      }),
      pathShape('M40 24 L40 56', {
        fill: 'none',
        stroke: '#ff8246',
        'stroke-width': 2.5,
        'stroke-linecap': 'round'
      }),
      // 劍柄護手
      pathShape('M30 34 L50 34', {
        fill: 'none',
        stroke: '#ffd18c',
        'stroke-width': 3,
        'stroke-linecap': 'round'
      }),
      // 光芒
      pathShape('M36 26 L40 22 L44 26', {
        fill: 'none',
        stroke: '#ffe7b3',
        'stroke-width': 2,
        'stroke-linejoin': 'round',
        'stroke-linecap': 'round'
      }),
      // 火焰粒子
      starShape(26, 40, 4, 4, 2, { fill: '#ffad63', 'fill-opacity': 0.9 }),
      starShape(54, 42, 4, 4, 2, { fill: '#ff5e3a', 'fill-opacity': 0.9 }),
      circleShape(32, 50, 2, { fill: '#ffe7b3', 'fill-opacity': 0.8 }),
      circleShape(48, 48, 2, { fill: '#ffad63', 'fill-opacity': 0.8 })
    ]
  },
  {
    id: 'cinder-ronin',
    element: 'fire',
    heroShapes: [
      // 浪人身軀與和服
      pathShape('M32 44 L28 52 L32 58 L40 60 L48 58 L52 52 L48 44 L46 48 L34 48 Z', {
        fill: '#ff8246',
        stroke: '#ffd18c',
        'stroke-width': 2,
        'stroke-linejoin': 'round'
      }),
      // 頭部
      circleShape(40, 36, 5, {
        fill: '#ffcf6f',
        stroke: '#ff6433',
        'stroke-width': 1.5
      }),
      // 斗笠
      pathShape('M32 32 L28 34 L30 36 L50 36 L52 34 L48 32 Z', {
        fill: '#ff5e3a',
        stroke: '#ffe7b3',
        'stroke-width': 1.5,
        'stroke-linejoin': 'round'
      }),
      pathShape('M34 32 L40 28 L46 32 Z', {
        fill: '#ffad63',
        stroke: '#ffe7b3',
        'stroke-width': 1.2,
        'stroke-linejoin': 'round'
      }),
      // 眼睛
      pathShape('M36 36 L38 36', {
        fill: 'none',
        stroke: '#ff5e3a',
        'stroke-width': 1.2,
        'stroke-linecap': 'round'
      }),
      pathShape('M42 36 L44 36', {
        fill: 'none',
        stroke: '#ff5e3a',
        'stroke-width': 1.2,
        'stroke-linecap': 'round'
      }),
      // 刀柄（腰間配刀）
      pathShape('M48 50 L56 48', {
        fill: 'none',
        stroke: '#ffe7b3',
        'stroke-width': 2.5,
        'stroke-linecap': 'round'
      }),
      // 和服紋路
      pathShape('M36 50 C38 48 42 48 44 50', {
        fill: 'none',
        stroke: '#ffad63',
        'stroke-width': 1,
        'stroke-linecap': 'round'
      }),
      // 火焰餘燼
      circleShape(30, 56, 1.5, {
        fill: '#ffad63',
        'fill-opacity': 0.8
      })
    ],
    skillShapes: [
      // 焦土灼刃 - 烈焰斬擊
      pathShape('M22 58 L58 22', {
        fill: 'none',
        stroke: '#ffe7b3',
        'stroke-width': 4.5,
        'stroke-linecap': 'round'
      }),
      pathShape('M24 58 L58 24', {
        fill: 'none',
        stroke: '#ff8246',
        'stroke-width': 3,
        'stroke-linecap': 'round'
      }),
      // 火焰波紋
      pathShape('M32 58 C34 52 38 48 44 46', {
        fill: 'none',
        stroke: '#ffad63',
        'stroke-width': 2,
        'stroke-linecap': 'round',
        'stroke-opacity': 0.8
      }),
      pathShape('M28 54 C32 48 38 42 46 38', {
        fill: 'none',
        stroke: '#ff5e3a',
        'stroke-width': 1.5,
        'stroke-linecap': 'round',
        'stroke-opacity': 0.7
      }),
      // 火花
      starShape(36, 52, 4, 4, 1.5, { fill: '#ffe7b3', 'fill-opacity': 0.9 }),
      starShape(44, 44, 4, 3.5, 1.5, { fill: '#ffad63', 'fill-opacity': 0.9 }),
      starShape(52, 36, 4, 4, 1.5, { fill: '#ff5e3a', 'fill-opacity': 0.9 })
    ]
  },
  {
    id: 'ash-bard',
    element: 'fire',
    heroShapes: [
      // 詠者身軀與長袍
      pathShape('M34 46 L30 54 L34 58 L40 60 L46 58 L50 54 L46 46 L44 50 L36 50 Z', {
        fill: '#ff8246',
        stroke: '#ffd18c',
        'stroke-width': 2,
        'stroke-linejoin': 'round'
      }),
      // 頭部
      circleShape(40, 36, 5.5, {
        fill: '#ffcf6f',
        stroke: '#ff6433',
        'stroke-width': 1.5
      }),
      // 帽子（吟遊詩人帽）
      pathShape('M34 32 L32 30 L34 28 L40 26 L46 28 L48 30 L46 32 Z', {
        fill: '#ff5e3a',
        stroke: '#ffe7b3',
        'stroke-width': 1.5,
        'stroke-linejoin': 'round'
      }),
      pathShape('M38 26 L40 22 L42 26 Z', {
        fill: '#ffad63',
        'fill-opacity': 0.8
      }),
      // 眼睛
      circleShape(37, 36, 1, { fill: '#ff5e3a' }),
      circleShape(43, 36, 1, { fill: '#ff5e3a' }),
      // 嘴巴（唱歌）
      pathShape('M38 40 C39 41 41 41 42 40', {
        fill: 'none',
        stroke: '#ff5e3a',
        'stroke-width': 1,
        'stroke-linecap': 'round'
      }),
      // 手持魯特琴（小）
      pathShape('M48 48 Q50 50 50 54 Q50 56 48 56', {
        fill: 'none',
        stroke: '#ffe7b3',
        'stroke-width': 2,
        'stroke-linecap': 'round'
      }),
      // 音符飄揚
      pathShape('M52 40 C52 38 54 38 54 40 L54 44', {
        fill: 'none',
        stroke: '#ffad63',
        'stroke-width': 1.3,
        'stroke-linecap': 'round'
      }),
      circleShape(54, 44, 1.3, { fill: '#ffad63' }),
      pathShape('M56 36 C56 34 58 34 58 36 L58 40', {
        fill: 'none',
        stroke: '#ffe7b3',
        'stroke-width': 1.3,
        'stroke-linecap': 'round'
      }),
      circleShape(58, 40, 1.3, { fill: '#ffe7b3' })
    ],
    skillShapes: [
      // 餘燼共鳴 - 音波
      pathShape('M26 42 C26 34 32 28 40 28 C48 28 54 34 54 42 C54 50 48 56 40 56 C32 56 26 50 26 42', {
        fill: 'none',
        stroke: '#ff8246',
        'stroke-width': 2.5,
        'stroke-linecap': 'round',
        'stroke-opacity': 0.8
      }),
      pathShape('M30 42 C30 36 34 32 40 32 C46 32 50 36 50 42 C50 48 46 52 40 52 C34 52 30 48 30 42', {
        fill: 'none',
        stroke: '#ffad63',
        'stroke-width': 2,
        'stroke-linecap': 'round',
        'stroke-opacity': 0.7
      }),
      pathShape('M34 42 C34 38 36 36 40 36 C44 36 46 38 46 42 C46 46 44 48 40 48 C36 48 34 46 34 42', {
        fill: 'none',
        stroke: '#ffe7b3',
        'stroke-width': 1.5,
        'stroke-linecap': 'round',
        'stroke-opacity': 0.9
      }),
      // 音符粒子
      circleShape(24, 38, 2, { fill: '#ffad63', 'fill-opacity': 0.8 }),
      circleShape(56, 44, 2, { fill: '#ff5e3a', 'fill-opacity': 0.8 }),
      circleShape(28, 50, 1.5, { fill: '#ffe7b3', 'fill-opacity': 0.9 })
    ]
  },
  {
    id: 'lava-herder',
    element: 'fire',
    heroShapes: [
      // 野獸頭部輪廓（狼）
      pathShape('M26 38 C26 32 28 28 32 26 L38 24 L44 26 C48 28 50 32 50 38 L50 44 C50 48 48 50 44 52 L40 54 C36 54 32 52 30 48 L26 42 Z', {
        fill: '#ff8246',
        stroke: '#ffd18c',
        'stroke-width': 2,
        'stroke-linejoin': 'round'
      }),
      // 獸耳
      pathShape('M32 26 L30 20 L34 24 Z', {
        fill: '#ff5e3a',
        stroke: '#ffe7b3',
        'stroke-width': 1.2,
        'stroke-linejoin': 'round'
      }),
      pathShape('M44 26 L46 20 L42 24 Z', {
        fill: '#ff5e3a',
        stroke: '#ffe7b3',
        'stroke-width': 1.2,
        'stroke-linejoin': 'round'
      }),
      // 獸眼
      circleShape(34, 36, 2.5, {
        fill: '#ffe7b3',
        stroke: '#ff5e3a',
        'stroke-width': 1
      }),
      circleShape(42, 36, 2.5, {
        fill: '#ffe7b3',
        stroke: '#ff5e3a',
        'stroke-width': 1
      }),
      // 瞳孔
      circleShape(34, 36, 1, { fill: '#ff5e3a' }),
      circleShape(42, 36, 1, { fill: '#ff5e3a' }),
      // 獸鼻與嘴
      polygonShape('38,42 36,44 38,45 40,44', {
        fill: '#ff6433'
      }),
      // 熔岩滴落
      pathShape('M32 52 C32 54 30 56 30 58 C30 56 28 54 28 52', {
        fill: '#ffad63',
        'fill-opacity': 0.8
      }),
      pathShape('M40 54 C40 56 38 58 38 60 C38 58 36 56 36 54', {
        fill: '#ff5e3a',
        'fill-opacity': 0.8
      }),
      pathShape('M48 52 C48 54 46 56 46 58 C46 56 44 54 44 52', {
        fill: '#ffad63',
        'fill-opacity': 0.8
      })
    ],
    skillShapes: [
      // 熔爐奔流 - 野獸爪印
      pathShape('M28 44 L32 36 L34 44 Z', {
        fill: '#ff8246',
        stroke: '#ffe7b3',
        'stroke-width': 1.5,
        'stroke-linejoin': 'round'
      }),
      pathShape('M36 42 L40 34 L42 42 Z', {
        fill: '#ff8246',
        stroke: '#ffe7b3',
        'stroke-width': 1.5,
        'stroke-linejoin': 'round'
      }),
      pathShape('M44 44 L48 36 L50 44 Z', {
        fill: '#ff8246',
        stroke: '#ffe7b3',
        'stroke-width': 1.5,
        'stroke-linejoin': 'round'
      }),
      // 掌墊
      pathShape('M34 48 C34 46 36 44 40 44 C44 44 46 46 46 48 C46 52 44 54 40 54 C36 54 34 52 34 48', {
        fill: '#ff8246',
        stroke: '#ffe7b3',
        'stroke-width': 1.8,
        'stroke-linejoin': 'round'
      }),
      // 熔岩效果
      circleShape(26, 50, 2, { fill: '#ffad63', 'fill-opacity': 0.9 }),
      circleShape(52, 48, 2.5, { fill: '#ff5e3a', 'fill-opacity': 0.9 }),
      circleShape(38, 58, 2, { fill: '#ffe7b3', 'fill-opacity': 0.8 })
    ]
  },
  {
    id: 'crimson-duelist',
    element: 'fire',
    heroShapes: [
      // 決鬥者身軀（女性輕甲）
      pathShape('M34 44 L30 52 L34 58 L40 60 L46 58 L50 52 L46 44 Z', {
        fill: '#ff8246',
        stroke: '#ffd18c',
        'stroke-width': 2,
        'stroke-linejoin': 'round'
      }),
      // 頭部
      circleShape(40, 34, 5.5, {
        fill: '#ffcf6f',
        stroke: '#ff6433',
        'stroke-width': 1.5
      }),
      // 長髮（馬尾）
      pathShape('M46 32 L50 28 L52 32 L50 36 L48 34 Z', {
        fill: '#ff5e3a',
        stroke: '#ffe7b3',
        'stroke-width': 1.3,
        'stroke-linejoin': 'round'
      }),
      pathShape('M48 36 L50 40 L48 44', {
        fill: 'none',
        stroke: '#ff5e3a',
        'stroke-width': 2,
        'stroke-linecap': 'round'
      }),
      // 眼睛
      circleShape(37, 34, 1, { fill: '#ff5e3a' }),
      circleShape(43, 34, 1, { fill: '#ff5e3a' }),
      // 劍姿（持劍準備攻擊）
      pathShape('M52 48 L58 42', {
        fill: 'none',
        stroke: '#ffe7b3',
        'stroke-width': 2.5,
        'stroke-linecap': 'round'
      }),
      // 護手
      pathShape('M52 48 L54 50', {
        fill: 'none',
        stroke: '#ffad63',
        'stroke-width': 2,
        'stroke-linecap': 'round'
      }),
      // 輕甲紋飾
      pathShape('M36 48 C38 46 42 46 44 48', {
        fill: 'none',
        stroke: '#ffad63',
        'stroke-width': 1.2,
        'stroke-linecap': 'round'
      }),
      // 動態線條
      pathShape('M56 44 C54 42 52 42 50 44', {
        fill: '#ff5e3a',
        'fill-opacity': 0.6
      })
    ],
    skillShapes: [
      // 紅蓮瞬斬 - 快速斬擊軌跡
      pathShape('M24 54 L56 26', {
        fill: 'none',
        stroke: '#ffe7b3',
        'stroke-width': 4,
        'stroke-linecap': 'round'
      }),
      pathShape('M26 56 L58 28', {
        fill: 'none',
        stroke: '#ff8246',
        'stroke-width': 2.8,
        'stroke-linecap': 'round'
      }),
      // 紅蓮火焰
      pathShape('M32 52 C34 48 36 46 40 44', {
        fill: 'none',
        stroke: '#ff5e3a',
        'stroke-width': 2,
        'stroke-linecap': 'round',
        'stroke-opacity': 0.8
      }),
      pathShape('M44 40 C48 36 50 34 54 32', {
        fill: 'none',
        stroke: '#ffad63',
        'stroke-width': 1.8,
        'stroke-linecap': 'round',
        'stroke-opacity': 0.7
      }),
      // 火花
      starShape(30, 50, 4, 4, 1.5, { fill: '#ffe7b3', 'fill-opacity': 0.9 }),
      starShape(40, 42, 4, 3.5, 1.5, { fill: '#ff5e3a', 'fill-opacity': 0.9 }),
      starShape(50, 34, 4, 4, 1.5, { fill: '#ffad63', 'fill-opacity': 0.9 })
    ]
  },
  {
    id: 'magmabreaker',
    element: 'fire',
    heroShapes: [
      // 重裝戰士身軀
      pathShape('M30 44 L26 54 L30 58 L40 60 L50 58 L54 54 L50 44 Z', {
        fill: '#ff8246',
        stroke: '#ffd18c',
        'stroke-width': 2.2,
        'stroke-linejoin': 'round'
      }),
      // 頭盔（全罩式）
      pathShape('M32 36 L30 42 L34 44 L46 44 L50 42 L48 36 Z', {
        fill: '#ff5e3a',
        stroke: '#ffe7b3',
        'stroke-width': 2,
        'stroke-linejoin': 'round'
      }),
      pathShape('M34 36 L36 32 L40 30 L44 32 L46 36 Z', {
        fill: '#ffcf6f',
        stroke: '#ff6433',
        'stroke-width': 1.8,
        'stroke-linejoin': 'round'
      }),
      // 面甲縫隙（眼睛）
      pathShape('M36 38 L38 38', {
        fill: 'none',
        stroke: '#ff5e3a',
        'stroke-width': 2,
        'stroke-linecap': 'round'
      }),
      pathShape('M42 38 L44 38', {
        fill: 'none',
        stroke: '#ff5e3a',
        'stroke-width': 2,
        'stroke-linecap': 'round'
      }),
      // 厚重肩甲
      pathShape('M26 46 L22 48 L24 52 L28 50 Z', {
        fill: '#ffcf6f',
        stroke: '#ff6433',
        'stroke-width': 1.8,
        'stroke-linejoin': 'round'
      }),
      pathShape('M54 46 L58 48 L56 52 L52 50 Z', {
        fill: '#ffcf6f',
        stroke: '#ff6433',
        'stroke-width': 1.8,
        'stroke-linejoin': 'round'
      }),
      // 鐵拳（右手）
      pathShape('M52 52 L58 54 L60 56 L58 58 L54 56 Z', {
        fill: '#ffe7b3',
        stroke: '#ff8246',
        'stroke-width': 2,
        'stroke-linejoin': 'round'
      }),
      // 熔岩裂紋
      pathShape('M36 48 C38 50 42 50 44 48', {
        fill: 'none',
        stroke: '#ffad63',
        'stroke-width': 1.5,
        'stroke-linecap': 'round'
      }),
      // 火焰粒子
      circleShape(24, 52, 1.5, { fill: '#ffad63', 'fill-opacity': 0.8 })
    ],
    skillShapes: [
      // 熔爆重拳 - 衝擊波
      circleShape(40, 42, 12, {
        fill: 'none',
        stroke: '#ff8246',
        'stroke-width': 3,
        'stroke-opacity': 0.8
      }),
      circleShape(40, 42, 8, {
        fill: 'none',
        stroke: '#ffe7b3',
        'stroke-width': 2.5,
        'stroke-opacity': 0.9
      }),
      // 中心拳頭
      pathShape('M36 38 L34 42 L36 46 L44 46 L46 42 L44 38 Z', {
        fill: '#ff8246',
        stroke: '#ffd18c',
        'stroke-width': 2,
        'stroke-linejoin': 'round'
      }),
      // 爆炸碎片
      pathShape('M28 34 L24 30', {
        fill: 'none',
        stroke: '#ffad63',
        'stroke-width': 2,
        'stroke-linecap': 'round'
      }),
      pathShape('M52 34 L56 30', {
        fill: 'none',
        stroke: '#ff5e3a',
        'stroke-width': 2,
        'stroke-linecap': 'round'
      }),
      pathShape('M30 50 L26 54', {
        fill: 'none',
        stroke: '#ffe7b3',
        'stroke-width': 2,
        'stroke-linecap': 'round'
      }),
      starShape(22, 42, 4, 3, 1.5, { fill: '#ffad63', 'fill-opacity': 0.9 }),
      starShape(58, 42, 4, 3, 1.5, { fill: '#ff5e3a', 'fill-opacity': 0.9 })
    ]
  },
  {
    id: 'pyrolumen',
    element: 'fire',
    heroShapes: [
      // 雙子身軀（左邊火）
      pathShape('M28 46 L24 54 L28 58 L34 60 L36 54 L34 46 Z', {
        fill: '#ff8246',
        stroke: '#ffd18c',
        'stroke-width': 1.8,
        'stroke-linejoin': 'round'
      }),
      // 雙子身軀（右邊光）
      pathShape('M46 46 L44 54 L46 60 L52 58 L56 54 L52 46 Z', {
        fill: '#ffcf6f',
        stroke: '#ffe7b3',
        'stroke-width': 1.8,
        'stroke-linejoin': 'round'
      }),
      // 左頭（火）
      circleShape(32, 38, 4.5, {
        fill: '#ff5e3a',
        stroke: '#ffe7b3',
        'stroke-width': 1.3
      }),
      // 右頭（光）
      circleShape(48, 38, 4.5, {
        fill: '#ffe7b3',
        stroke: '#ff8246',
        'stroke-width': 1.3
      }),
      // 左眼
      circleShape(32, 38, 1, { fill: '#ffe7b3' }),
      // 右眼
      circleShape(48, 38, 1, { fill: '#ff5e3a' }),
      // 火焰光環（左）
      starShape(32, 32, 5, 4, 2, {
        fill: '#ffad63',
        'fill-opacity': 0.8
      }),
      // 光芒（右）
      starShape(48, 32, 4, 4, 2.5, {
        fill: '#ffe7b3',
        'fill-opacity': 0.9
      }),
      // 連結能量
      pathShape('M36 50 C38 48 42 48 44 50', {
        fill: 'none',
        stroke: '#ffad63',
        'stroke-width': 1.5,
        'stroke-linecap': 'round'
      }),
      // 火焰粒子
      circleShape(40, 44, 2, {
        fill: '#ff8246',
        'fill-opacity': 0.7
      })
    ],
    skillShapes: [
      // 雙星連弧 - 交織軌跡
      pathShape('M26 50 C32 42 38 38 44 36', {
        fill: 'none',
        stroke: '#ff8246',
        'stroke-width': 3,
        'stroke-linecap': 'round'
      }),
      pathShape('M54 36 C48 42 42 46 36 50', {
        fill: 'none',
        stroke: '#ffe7b3',
        'stroke-width': 3,
        'stroke-linecap': 'round'
      }),
      // 雙星
      starShape(28, 48, 5, 5, 2.5, {
        fill: '#ff5e3a',
        stroke: '#ffe7b3',
        'stroke-width': 1
      }),
      starShape(52, 38, 5, 5, 2.5, {
        fill: '#ffe7b3',
        stroke: '#ff8246',
        'stroke-width': 1
      }),
      // 能量粒子
      circleShape(36, 42, 2, { fill: '#ffad63', 'fill-opacity': 0.9 }),
      circleShape(44, 44, 2, { fill: '#ffe7b3', 'fill-opacity': 0.9 }),
      circleShape(40, 40, 1.5, { fill: '#ff5e3a', 'fill-opacity': 0.8 })
    ]
  },
  {
    id: 'meteor-dancer',
    element: 'fire',
    heroShapes: [
      // 舞者身軀（飄逸姿態）
      pathShape('M34 46 L32 54 L36 58 L40 60 L44 58 L48 54 L44 46 L42 50 L38 50 Z', {
        fill: '#ff8246',
        stroke: '#ffd18c',
        'stroke-width': 2,
        'stroke-linejoin': 'round'
      }),
      // 頭部
      circleShape(40, 34, 5, {
        fill: '#ffcf6f',
        stroke: '#ff6433',
        'stroke-width': 1.5
      }),
      // 頭髮（飄揚）
      pathShape('M36 30 L32 26 L30 30 L32 34', {
        fill: '#ff5e3a',
        stroke: '#ffe7b3',
        'stroke-width': 1.3,
        'stroke-linejoin': 'round'
      }),
      pathShape('M44 30 L48 26 L50 30 L48 34', {
        fill: '#ff5e3a',
        stroke: '#ffe7b3',
        'stroke-width': 1.3,
        'stroke-linejoin': 'round'
      }),
      // 眼睛
      circleShape(37, 34, 1, { fill: '#ff5e3a' }),
      circleShape(43, 34, 1, { fill: '#ff5e3a' }),
      // 舞蹈飄帶（左）
      pathShape('M32 48 C28 46 24 46 22 48 C24 44 26 42 30 42', {
        fill: 'none',
        stroke: '#ffe7b3',
        'stroke-width': 2,
        'stroke-linecap': 'round'
      }),
      // 舞蹈飄帶（右）
      pathShape('M48 48 C52 46 56 46 58 48 C56 44 54 42 50 42', {
        fill: 'none',
        stroke: '#ffe7b3',
        'stroke-width': 2,
        'stroke-linecap': 'round'
      }),
      // 流星軌跡
      pathShape('M46 38 C48 36 50 34 52 32', {
        fill: 'none',
        stroke: '#ffad63',
        'stroke-width': 1.5,
        'stroke-linecap': 'round'
      }),
      starShape(52, 32, 4, 3, 1.5, {
        fill: '#ffe7b3',
        'fill-opacity': 0.9
      }),
      // 火焰粒子
      circleShape(26, 44, 1.5, {
        fill: '#ffad63',
        'fill-opacity': 0.8
      }),
      circleShape(54, 44, 1.5, {
        fill: '#ff5e3a',
        'fill-opacity': 0.8
      })
    ],
    skillShapes: [
      // 流星步伐 - 流星軌跡
      pathShape('M24 56 C30 48 36 42 44 36 C48 32 52 30 56 28', {
        fill: 'none',
        stroke: '#ffe7b3',
        'stroke-width': 3.5,
        'stroke-linecap': 'round'
      }),
      pathShape('M26 56 C32 48 38 42 46 36 C50 32 54 30 58 28', {
        fill: 'none',
        stroke: '#ff8246',
        'stroke-width': 2.5,
        'stroke-linecap': 'round'
      }),
      // 流星
      starShape(56, 30, 5, 5, 2.5, {
        fill: '#ffe7b3',
        stroke: '#ff8246',
        'stroke-width': 1
      }),
      starShape(46, 38, 4, 4, 2, {
        fill: '#ffad63',
        'fill-opacity': 0.9
      }),
      starShape(34, 48, 4, 3.5, 1.5, {
        fill: '#ff5e3a',
        'fill-opacity': 0.8
      }),
      // 火焰尾跡
      circleShape(28, 54, 2, { fill: '#ffad63', 'fill-opacity': 0.7 }),
      circleShape(38, 44, 1.5, { fill: '#ffe7b3', 'fill-opacity': 0.7 })
    ]
  },
  // Water heroes
  {
    id: 'tide-matriarch',
    element: 'water',
    heroShapes: [
      pathShape('M40 22 C52 26 58 36 56 46 C54 54 48 60 40 62 C32 60 26 54 24 46 C22 36 28 26 40 22 Z', {
        fill: '#8ce4ff',
        stroke: '#2b86ff',
        'stroke-width': 1.6,
        'stroke-linejoin': 'round'
      }),
      pathShape('M40 24 L40 54 M40 24 L36 28 L36 32 M40 24 L44 28 L44 32 M34 42 L46 42', {
        fill: 'none',
        stroke: '#d6f6ff',
        'stroke-width': 1.4,
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round'
      }),
      pathShape('M28 48 C32 44 36 44 40 48 C44 52 48 52 52 48', {
        fill: 'none',
        stroke: '#58c3ff',
        'stroke-width': 1.6,
        'stroke-linecap': 'round'
      }),
      circleShape(40, 50, 3, {
        fill: '#37a4ff',
        'fill-opacity': 0.4
      })
    ],
    skillShapes: [
      pathShape('M30 46 C30 34 42 28 54 32', {
        fill: 'none',
        stroke: '#58c3ff',
        'stroke-width': 2.4,
        'stroke-linecap': 'round'
      }),
      polygonShape('54,32 48,28 50,36', {
        fill: '#58c3ff',
        stroke: '#bde9ff',
        'stroke-width': 0.8
      }),
      pathShape('M40 28 L52 34 L50 48 C47 54 44 56 40 58 C36 56 33 54 30 48 L28 34 Z', {
        fill: 'none',
        stroke: '#8ce4ff',
        'stroke-width': 1.6,
        'stroke-linejoin': 'round'
      }),
      circleShape(28, 52, 2.2, {
        fill: '#64d8ff'
      })
    ]
  },
  {
    id: 'frost-oracle',
    element: 'water',
    heroShapes: [
      pathShape('M40 24 L40 56 M26 40 L54 40 M28 28 L52 52 M52 28 L28 52', {
        fill: 'none',
        stroke: '#bde9ff',
        'stroke-width': 1.2,
        'stroke-linecap': 'round'
      }),
      pathShape('M34 28 L46 28 L38 36 L46 44 L34 44 L42 36 Z', {
        fill: 'none',
        stroke: '#8ecbff',
        'stroke-width': 1.2,
        'stroke-linejoin': 'round'
      }),
      circleShape(40, 40, 4, {
        fill: '#8ce4ff'
      }),
      circleShape(26, 40, 2.3, {
        fill: '#d6f6ff'
      }),
      circleShape(54, 40, 2.3, {
        fill: '#d6f6ff'
      })
    ],
    skillShapes: [
      starShape(40, 40, 6, 10, 4, {
        fill: 'none',
        stroke: '#cbeeff',
        'stroke-width': 1.6
      }),
      circleShape(40, 40, 14, {
        fill: 'none',
        stroke: '#58b6ff',
        'stroke-width': 1.4
      }),
      pathShape('M40 40 L46 34', {
        fill: 'none',
        stroke: '#58c3ff',
        'stroke-width': 1.2,
        'stroke-linecap': 'round'
      }),
      pathShape('M40 40 L40 48', {
        fill: 'none',
        stroke: '#58c3ff',
        'stroke-width': 1.2,
        'stroke-linecap': 'round'
      }),
      circleShape(48, 30, 2, {
        fill: '#d6f6ff'
      })
    ]
  },
  {
    id: 'azure-medic',
    element: 'water',
    heroShapes: [
      pathShape('M40 20 C48 32 52 40 52 46 C52 54 46 60 40 60 C34 60 28 54 28 46 C28 40 32 32 40 20 Z', {
        fill: '#8ce4ff',
        stroke: '#37a4ff',
        'stroke-width': 1.4,
        'stroke-linejoin': 'round'
      }),
      pathShape('M40 30 L40 50 M32 40 L48 40', {
        fill: 'none',
        stroke: '#d6f6ff',
        'stroke-width': 1.6,
        'stroke-linecap': 'round'
      }),
      polylineShape('30,46 34,44 38,48 42,44 46,48 50,46', {
        stroke: '#64d8ff',
        'stroke-width': 1.2,
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round'
      })
    ],
    skillShapes: [
      circleShape(40, 40, 12, {
        fill: 'none',
        stroke: '#8ce4ff',
        'stroke-width': 1.8
      }),
      pathShape('M40 26 C44 32 46 36 46 40 C46 44 43 48 40 48 C37 48 34 44 34 40 C34 36 36 32 40 26 Z', {
        fill: 'rgba(140, 228, 255, 0.6)',
        stroke: '#58c3ff',
        'stroke-width': 1
      }),
      pathShape('M40 34 L40 46 M36 40 L44 40', {
        fill: 'none',
        stroke: '#d6f6ff',
        'stroke-width': 1.4,
        'stroke-linecap': 'round'
      }),
      pathShape('M26 52 C32 54 48 54 54 52', {
        fill: 'none',
        stroke: '#58c3ff',
        'stroke-width': 1.2,
        'stroke-linecap': 'round'
      })
    ]
  },
  {
    id: 'abyss-scout',
    element: 'water',
    heroShapes: [
      pathShape('M34 22 L46 58 L40 58 L42 48 L32 28 Z', {
        fill: '#58c3ff',
        stroke: '#0f4da2',
        'stroke-width': 1.2,
        'stroke-linejoin': 'round'
      }),
      pathShape('M26 46 C30 40 36 38 42 40 C48 42 52 40 56 36', {
        fill: 'none',
        stroke: '#8ce4ff',
        'stroke-width': 1.6,
        'stroke-linecap': 'round'
      }),
      circleShape(46, 34, 3, {
        fill: '#d6f6ff',
        stroke: '#58c3ff',
        'stroke-width': 1
      })
    ],
    skillShapes: [
      pathShape('M28 48 C28 34 42 28 54 34', {
        fill: 'none',
        stroke: '#58c3ff',
        'stroke-width': 2,
        'stroke-linecap': 'round'
      }),
      polygonShape('54,34 48,30 50,38', {
        fill: '#58c3ff',
        stroke: '#bde9ff',
        'stroke-width': 0.8
      }),
      circleShape(54, 44, 5.5, {
        fill: 'none',
        stroke: '#64d8ff',
        'stroke-width': 1.2
      }),
      pathShape('M46 40 L58 42 L52 48', {
        fill: 'none',
        stroke: '#8ce4ff',
        'stroke-width': 1.4,
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round'
      })
    ]
  },
  {
    id: 'iceblade-assassin',
    element: 'water',
    heroShapes: [
      pathShape('M36 20 L44 20 L50 42 L40 62 L30 42 Z', {
        fill: '#c3efff',
        stroke: '#1b74ff',
        'stroke-width': 1.2,
        'stroke-linejoin': 'round'
      }),
      pathShape('M32 32 L48 52', {
        fill: 'none',
        stroke: '#8ce4ff',
        'stroke-width': 1.4,
        'stroke-linecap': 'round'
      }),
      pathShape('M48 32 L32 52', {
        fill: 'none',
        stroke: '#8ce4ff',
        'stroke-width': 1.4,
        'stroke-linecap': 'round'
      }),
      pathShape('M46 26 C50 28 52 34 50 38 C48 42 52 44 56 44 C50 48 44 46 44 38 C44 32 44 28 46 26 Z', {
        fill: 'rgba(142, 209, 255, 0.5)'
      })
    ],
    skillShapes: [
      pathShape('M28 54 L56 28', {
        fill: 'none',
        stroke: '#bde9ff',
        'stroke-width': 3,
        'stroke-linecap': 'round'
      }),
      circleShape(50, 32, 7, {
        fill: 'none',
        stroke: '#64d8ff',
        'stroke-width': 1.6
      }),
      pathShape('M48 34 C48 30 52 30 52 34 L52 40 L48 40 Z', {
        fill: '#8ce4ff',
        stroke: '#d6f6ff',
        'stroke-width': 0.8
      }),
      polygonShape('34,52 38,48 42,52 38,56', {
        fill: '#c3efff'
      })
    ]
  },
  {
    id: 'tidal-minstrel',
    element: 'water',
    heroShapes: [
      pathShape('M30 24 Q28 44 36 56 Q38 60 34 62 Q46 58 52 40 Q54 32 50 24 Z', {
        fill: 'none',
        stroke: '#d6f6ff',
        'stroke-width': 1.6
      }),
      pathShape('M36 26 L46 48', {
        fill: 'none',
        stroke: '#58c3ff',
        'stroke-width': 1.1
      }),
      pathShape('M38 24 L48 46', {
        fill: 'none',
        stroke: '#58c3ff',
        'stroke-width': 1.1
      }),
      pathShape('M50 36 C56 34 58 40 54 44 C52 46 52 48 54 50 C50 50 48 48 48 44 C48 40 49 38 50 36 Z', {
        fill: '#8ce4ff'
      })
    ],
    skillShapes: [
      pathShape('M26 48 C26 34 36 30 44 34 C52 38 54 48 48 54 C42 58 34 56 30 50', {
        fill: 'none',
        stroke: '#58c3ff',
        'stroke-width': 2,
        'stroke-linecap': 'round'
      }),
      circleShape(50, 34, 6, {
        fill: 'none',
        stroke: '#d6f6ff',
        'stroke-width': 1.4
      }),
      pathShape('M50 30 L50 48 C50 51 47 54 44 52 C41 50 44 46 47 46 L47 32 Z', {
        fill: '#8ce4ff',
        stroke: '#d6f6ff',
        'stroke-width': 0.8
      }),
      starShape(34, 42, 5, 4.5, 2.2, {
        fill: '#bde9ff',
        'fill-opacity': 0.7
      })
    ]
  },
  {
    id: 'star-navigator',
    element: 'water',
    heroShapes: [
      circleShape(40, 40, 18, {
        fill: 'none',
        stroke: '#64d8ff',
        'stroke-width': 1.6
      }),
      starShape(40, 40, 4, 14, 6, {
        fill: '#8ce4ff',
        'fill-opacity': 0.6
      }),
      pathShape('M24 50 C28 46 34 44 40 46', {
        fill: 'none',
        stroke: '#58c3ff',
        'stroke-width': 1.2,
        'stroke-linecap': 'round'
      }),
      pathShape('M40 46 C46 44 50 38 52 32', {
        fill: 'none',
        stroke: '#d6f6ff',
        'stroke-width': 1,
        'stroke-linecap': 'round'
      })
    ],
    skillShapes: [
      circleShape(40, 40, 9, {
        fill: 'rgba(214, 246, 255, 0.4)',
        stroke: '#8ce4ff',
        'stroke-width': 1.2
      }),
      pathShape('M30 42 C30 34 34 30 40 30 C46 30 50 34 50 42 C50 48 46 54 40 54', {
        fill: 'none',
        stroke: '#58c3ff',
        'stroke-width': 1.4,
        'stroke-linecap': 'round'
      }),
      pathShape('M40 54 C35 54 32 58 32 62 C36 60 40 58 44 60 C44 56 42 54 40 54 Z', {
        fill: '#ff9ac9',
        'fill-opacity': 0.8,
        stroke: '#ffd0e6',
        'stroke-width': 0.8
      }),
      starShape(52, 32, 5, 4, 1.8, {
        fill: '#d6f6ff'
      })
    ]
  },
  {
    id: 'glacier-magus',
    element: 'water',
    heroShapes: [
      polygonShape('40,18 50,34 44,54 36,54 30,34', {
        fill: '#a8e6ff',
        stroke: '#1b74ff',
        'stroke-width': 1.2,
        'stroke-linejoin': 'round'
      }),
      polygonShape('34,28 40,24 46,28 42,36 38,36', {
        fill: '#d6f6ff',
        'fill-opacity': 0.8
      }),
      pathShape('M28 48 C32 44 36 44 40 48 C44 52 48 52 52 48', {
        fill: 'none',
        stroke: '#58c3ff',
        'stroke-width': 1.4,
        'stroke-linecap': 'round'
      }),
      circleShape(42, 38, 3, {
        fill: '#64d8ff'
      })
    ],
    skillShapes: [
      pathShape('M30 46 C30 34 40 30 48 34 C54 36 56 42 52 48', {
        fill: 'none',
        stroke: '#58c3ff',
        'stroke-width': 2,
        'stroke-linecap': 'round'
      }),
      polygonShape('44,34 52,32 50,40', {
        fill: '#8ce4ff',
        stroke: '#cbeeff',
        'stroke-width': 0.8
      }),
      pathShape('M46 42 C52 42 56 46 56 52 C52 50 48 50 46 54', {
        fill: 'none',
        stroke: '#bde9ff',
        'stroke-width': 1.2,
        'stroke-linecap': 'round'
      }),
      circleShape(32, 52, 3, {
        fill: '#8ce4ff'
      })
    ]
  },
  {
    id: 'abyss-warden',
    element: 'water',
    heroShapes: [
      pathShape('M40 22 L56 30 L52 52 C48 58 44 62 40 64 C36 62 32 58 28 52 L24 30 Z', {
        fill: '#8ce4ff',
        stroke: '#1b74ff',
        'stroke-width': 1.6,
        'stroke-linejoin': 'round'
      }),
      pathShape('M40 26 L40 54', {
        fill: 'none',
        stroke: '#d6f6ff',
        'stroke-width': 1.4,
        'stroke-linecap': 'round'
      }),
      pathShape('M32 46 C36 42 44 42 48 46', {
        fill: 'none',
        stroke: '#58c3ff',
        'stroke-width': 1.2,
        'stroke-linecap': 'round'
      }),
      pathShape('M36 32 L40 26 L44 32', {
        fill: 'none',
        stroke: '#d6f6ff',
        'stroke-width': 1.2,
        'stroke-linecap': 'round'
      })
    ],
    skillShapes: [
      pathShape('M30 46 C32 38 40 34 48 36 C54 38 56 44 54 48', {
        fill: 'none',
        stroke: '#58c3ff',
        'stroke-width': 2.2,
        'stroke-linecap': 'round'
      }),
      circleShape(44, 44, 12, {
        fill: 'none',
        stroke: '#8ce4ff',
        'stroke-width': 1.6
      }),
      pathShape('M44 36 L44 44 L50 46', {
        fill: 'none',
        stroke: '#d6f6ff',
        'stroke-width': 1.2,
        'stroke-linecap': 'round'
      }),
      pathShape('M30 54 C34 58 46 60 52 56', {
        fill: 'none',
        stroke: '#64d8ff',
        'stroke-width': 1.2,
        'stroke-linecap': 'round'
      })
    ]
  },
  {
    id: 'stormcaller',
    element: 'water',
    heroShapes: [
      pathShape('M26 40 C26 30 34 26 44 28 C52 30 56 36 56 42 C56 48 52 52 44 54 C36 56 30 52 26 46 Z', {
        fill: '#8ce4ff',
        stroke: '#1b74ff',
        'stroke-width': 1.2,
        'stroke-linejoin': 'round'
      }),
      pathShape('M40 34 L36 48 L44 44 L40 58 L52 38 L44 40 L48 30 Z', {
        fill: '#37a4ff',
        stroke: '#d6f6ff',
        'stroke-width': 1.2,
        'stroke-linejoin': 'round'
      }),
      circleShape(32, 34, 2.5, {
        fill: '#d6f6ff'
      })
    ],
    skillShapes: [
      pathShape('M28 46 C34 36 44 32 54 36', {
        fill: 'none',
        stroke: '#58c3ff',
        'stroke-width': 2.2,
        'stroke-linecap': 'round'
      }),
      pathShape('M40 38 L36 52 L44 48 L40 62 L54 40 L46 42 L50 32 Z', {
        fill: '#8ce4ff',
        stroke: '#d6f6ff',
        'stroke-width': 1.2,
        'stroke-linejoin': 'round'
      }),
      circleShape(32, 52, 2, {
        fill: '#64d8ff'
      }),
      circleShape(50, 34, 2, {
        fill: '#cbeeff'
      })
    ]
  },
  // Wood heroes
  {
    id: 'verdant-sage',
    element: 'wood',
    heroShapes: [
      pathShape('M34 22 L38 28 L36 48 L40 60 L34 62 L30 48 Z', {
        fill: '#5ece6e',
        stroke: '#1f8a3d',
        'stroke-width': 1.4,
        'stroke-linejoin': 'round'
      }),
      pathShape('M40 24 C46 26 50 32 48 38 C46 42 48 46 52 48 C46 48 42 44 40 38 C38 32 38 26 40 24 Z', {
        fill: '#96f59f',
        'fill-opacity': 0.6
      }),
      pathShape('M28 40 C30 34 34 32 38 34', {
        fill: 'none',
        stroke: '#5fcd76',
        'stroke-width': 1.4,
        'stroke-linecap': 'round'
      }),
      circleShape(36, 36, 3, {
        fill: '#e3ffdb'
      })
    ],
    skillShapes: [
      pathShape('M30 46 C30 36 36 32 42 34 C48 36 52 42 52 50', {
        fill: 'none',
        stroke: '#5ece6e',
        'stroke-width': 2.2,
        'stroke-linecap': 'round'
      }),
      pathShape('M30 50 C34 56 40 60 48 60 C44 54 44 48 46 42', {
        fill: 'none',
        stroke: '#96f59f',
        'stroke-width': 1.6,
        'stroke-linecap': 'round'
      }),
      circleShape(34, 44, 4, {
        fill: '#9cef8f',
        stroke: '#2d7039',
        'stroke-width': 1
      }),
      starShape(50, 36, 5, 4.5, 2, {
        fill: '#dcffd6'
      })
    ]
  },
  {
    id: 'vine-rogue',
    element: 'wood',
    heroShapes: [
      pathShape('M28 52 C28 40 36 34 44 36 C50 38 54 44 52 50 C50 54 46 56 42 54 C38 52 34 56 34 60', {
        fill: 'none',
        stroke: '#52c97d',
        'stroke-width': 2,
        'stroke-linecap': 'round'
      }),
      pathShape('M38 26 L46 24 L52 40 L38 56 L34 46 Z', {
        fill: '#88e27f',
        stroke: '#1f8a3d',
        'stroke-width': 1.2,
        'stroke-linejoin': 'round'
      }),
      pathShape('M48 34 C54 34 58 38 58 44 C54 42 50 44 48 48', {
        fill: 'none',
        stroke: '#9cef8f',
        'stroke-width': 1.4,
        'stroke-linecap': 'round'
      })
    ],
    skillShapes: [
      pathShape('M28 48 C28 36 38 32 46 36 C52 38 56 44 56 52', {
        fill: 'none',
        stroke: '#5ece6e',
        'stroke-width': 2.2,
        'stroke-linecap': 'round'
      }),
      pathShape('M34 50 C36 54 36 58 32 62 C38 60 44 56 46 50', {
        fill: 'none',
        stroke: '#9cef8f',
        'stroke-width': 1.6,
        'stroke-linecap': 'round'
      }),
      pathShape('M44 40 L52 36 L50 46', {
        fill: '#52c97d',
        stroke: '#dcffd6',
        'stroke-width': 0.9
      }),
      circleShape(32, 40, 3, {
        fill: '#6ed374'
      })
    ]
  },
  {
    id: 'grove-champion',
    element: 'wood',
    heroShapes: [
      pathShape('M28 46 C28 34 36 28 44 28 C52 28 58 34 58 46 C58 56 50 62 44 62 C36 62 28 56 28 46 Z', {
        fill: '#5ece6e',
        stroke: '#1f8a3d',
        'stroke-width': 1.6,
        'stroke-linejoin': 'round'
      }),
      circleShape(34, 32, 3.2, {
        fill: '#88e27f'
      }),
      circleShape(52, 32, 3.2, {
        fill: '#88e27f'
      }),
      pathShape('M36 46 L32 50 L36 52 M44 46 L48 50 L44 52', {
        fill: 'none',
        stroke: '#2d7039',
        'stroke-width': 1.4,
        'stroke-linecap': 'round'
      })
    ],
    skillShapes: [
      pathShape('M28 48 C34 36 48 32 60 36', {
        fill: 'none',
        stroke: '#5ece6e',
        'stroke-width': 2.4,
        'stroke-linecap': 'round'
      }),
      pathShape('M30 54 C34 60 42 62 50 60', {
        fill: 'none',
        stroke: '#9cef8f',
        'stroke-width': 1.6,
        'stroke-linecap': 'round'
      }),
      circleShape(36, 44, 3.5, {
        fill: '#dcffd6'
      }),
      pathShape('M48 38 L52 42 L48 46', {
        fill: 'none',
        stroke: '#5fcd76',
        'stroke-width': 1.4,
        'stroke-linecap': 'round'
      })
    ]
  },
  {
    id: 'emerald-warden',
    element: 'wood',
    heroShapes: [
      pathShape('M30 24 C38 24 46 28 52 36 C56 42 56 50 50 56 C44 50 38 46 32 48 Z', {
        fill: '#88e27f',
        stroke: '#1f8a3d',
        'stroke-width': 1.4,
        'stroke-linejoin': 'round'
      }),
      pathShape('M34 28 C36 36 34 44 28 50 L36 50 L44 44', {
        fill: 'none',
        stroke: '#5fcd76',
        'stroke-width': 1.2,
        'stroke-linecap': 'round'
      }),
      circleShape(44, 36, 4, {
        fill: '#dcffd6',
        stroke: '#2d7039',
        'stroke-width': 1
      })
    ],
    skillShapes: [
      pathShape('M28 46 C30 36 38 32 46 34 C52 36 54 42 54 48', {
        fill: 'none',
        stroke: '#5ece6e',
        'stroke-width': 2,
        'stroke-linecap': 'round'
      }),
      pathShape('M34 48 C36 54 36 58 32 62 C40 58 46 52 48 44', {
        fill: 'none',
        stroke: '#9cef8f',
        'stroke-width': 1.4,
        'stroke-linecap': 'round'
      }),
      polygonShape('48,38 56,36 54,44', {
        fill: '#88e27f',
        stroke: '#dcffd6',
        'stroke-width': 0.9
      }),
      circleShape(32, 38, 2.6, {
        fill: '#6ed374'
      })
    ]
  },
  {
    id: 'sprout-traveler',
    element: 'wood',
    heroShapes: [
      starShape(38, 36, 5, 12, 5, {
        fill: '#dcffd6',
        stroke: '#5fcd76',
        'stroke-width': 1
      }),
      pathShape('M38 24 C44 28 46 34 44 40 C42 44 44 48 48 50 C42 50 38 46 36 40 C34 34 34 28 38 24 Z', {
        fill: '#9cef8f',
        'fill-opacity': 0.6
      }),
      pathShape('M30 48 C34 46 38 46 42 50 C46 54 50 54 54 50', {
        fill: 'none',
        stroke: '#52c97d',
        'stroke-width': 1.4,
        'stroke-linecap': 'round'
      })
    ],
    skillShapes: [
      pathShape('M28 48 C28 38 34 32 42 32 C50 32 56 38 56 48', {
        fill: 'none',
        stroke: '#5ece6e',
        'stroke-width': 2.2,
        'stroke-linecap': 'round'
      }),
      pathShape('M32 52 C36 56 40 58 44 56 C48 54 50 48 48 42', {
        fill: 'none',
        stroke: '#96f59f',
        'stroke-width': 1.6,
        'stroke-linecap': 'round'
      }),
      circleShape(34, 40, 3, {
        fill: '#6ed374'
      }),
      starShape(50, 34, 4, 5, 2, {
        fill: '#e3ffdb'
      })
    ]
  },
  {
    id: 'sky-ranger',
    element: 'wood',
    heroShapes: [
      pathShape('M30 24 C38 24 46 30 50 38 C54 46 52 54 44 60', {
        fill: 'none',
        stroke: '#5ece6e',
        'stroke-width': 1.8,
        'stroke-linecap': 'round'
      }),
      pathShape('M28 22 L28 62', {
        fill: 'none',
        stroke: '#1f8a3d',
        'stroke-width': 1.4,
        'stroke-linecap': 'round'
      }),
      pathShape('M32 36 L52 44 L32 52', {
        fill: 'none',
        stroke: '#88e27f',
        'stroke-width': 1.6,
        'stroke-linecap': 'round'
      }),
      polygonShape('52,44 58,42 56,48', {
        fill: '#dcffd6'
      })
    ],
    skillShapes: [
      pathShape('M28 48 C32 38 42 34 54 36', {
        fill: 'none',
        stroke: '#5ece6e',
        'stroke-width': 2.2,
        'stroke-linecap': 'round'
      }),
      pathShape('M30 52 L52 44 L34 60', {
        fill: 'none',
        stroke: '#96f59f',
        'stroke-width': 1.6,
        'stroke-linecap': 'round'
      }),
      polygonShape('52,44 60,40 58,48', {
        fill: '#6ed374',
        stroke: '#dcffd6',
        'stroke-width': 0.8
      }),
      circleShape(32, 40, 2.4, {
        fill: '#9cef8f'
      })
    ]
  },
  {
    id: 'oracle-of-vines',
    element: 'wood',
    heroShapes: [
      circleShape(38, 36, 8, {
        fill: '#dcffd6',
        stroke: '#5fcd76',
        'stroke-width': 1.2
      }),
      circleShape(48, 48, 6, {
        fill: '#9cef8f',
        'fill-opacity': 0.7
      }),
      pathShape('M28 48 C32 44 36 44 40 48 C44 52 48 52 52 48', {
        fill: 'none',
        stroke: '#52c97d',
        'stroke-width': 1.4,
        'stroke-linecap': 'round'
      }),
      pathShape('M34 28 C30 36 30 44 34 52', {
        fill: 'none',
        stroke: '#2d7039',
        'stroke-width': 1.2,
        'stroke-linecap': 'round'
      })
    ],
    skillShapes: [
      pathShape('M28 46 C28 36 34 30 42 32 C48 34 52 40 54 48', {
        fill: 'none',
        stroke: '#5ece6e',
        'stroke-width': 2,
        'stroke-linecap': 'round'
      }),
      circleShape(36, 44, 4, {
        fill: '#9cef8f',
        stroke: '#2d7039',
        'stroke-width': 1
      }),
      pathShape('M34 54 C38 60 48 62 54 58', {
        fill: 'none',
        stroke: '#96f59f',
        'stroke-width': 1.4,
        'stroke-linecap': 'round'
      }),
      polygonShape('46,36 54,34 52,42', {
        fill: '#6ed374'
      })
    ]
  },
  {
    id: 'forest-guardian',
    element: 'wood',
    heroShapes: [
      pathShape('M40 22 L56 32 L52 54 C48 60 44 64 40 66 C36 64 32 60 28 54 L24 32 Z', {
        fill: '#5ece6e',
        stroke: '#1f8a3d',
        'stroke-width': 1.6,
        'stroke-linejoin': 'round'
      }),
      pathShape('M40 26 L40 58', {
        fill: 'none',
        stroke: '#dcffd6',
        'stroke-width': 1.4,
        'stroke-linecap': 'round'
      }),
      pathShape('M32 46 C36 40 44 40 48 46', {
        fill: 'none',
        stroke: '#52c97d',
        'stroke-width': 1.2,
        'stroke-linecap': 'round'
      }),
      circleShape(40, 36, 4, {
        fill: '#9cef8f'
      })
    ],
    skillShapes: [
      pathShape('M28 46 C32 36 40 32 48 34 C54 36 56 42 54 48', {
        fill: 'none',
        stroke: '#5ece6e',
        'stroke-width': 2.2,
        'stroke-linecap': 'round'
      }),
      circleShape(44, 44, 12, {
        fill: 'none',
        stroke: '#9cef8f',
        'stroke-width': 1.6
      }),
      pathShape('M44 36 L44 44 L50 46', {
        fill: 'none',
        stroke: '#dcffd6',
        'stroke-width': 1.2,
        'stroke-linecap': 'round'
      }),
      circleShape(32, 54, 3, {
        fill: '#6ed374'
      })
    ]
  },
  {
    id: 'wild-drummer',
    element: 'wood',
    heroShapes: [
      circleShape(40, 44, 14, {
        fill: '#88e27f',
        stroke: '#1f8a3d',
        'stroke-width': 1.4
      }),
      circleShape(40, 44, 10, {
        fill: '#dcffd6'
      }),
      pathShape('M30 30 L48 58', {
        fill: 'none',
        stroke: '#52c97d',
        'stroke-width': 1.4,
        'stroke-linecap': 'round'
      }),
      pathShape('M50 30 L32 58', {
        fill: 'none',
        stroke: '#52c97d',
        'stroke-width': 1.4,
        'stroke-linecap': 'round'
      })
    ],
    skillShapes: [
      pathShape('M28 48 C28 36 38 32 46 34 C52 36 56 42 56 52', {
        fill: 'none',
        stroke: '#5ece6e',
        'stroke-width': 2,
        'stroke-linecap': 'round'
      }),
      circleShape(40, 46, 8, {
        fill: 'none',
        stroke: '#9cef8f',
        'stroke-width': 1.4
      }),
      pathShape('M32 38 C36 40 44 40 48 38', {
        fill: 'none',
        stroke: '#dcffd6',
        'stroke-width': 1.2,
        'stroke-linecap': 'round'
      }),
      starShape(52, 36, 4, 4, 2, {
        fill: '#6ed374'
      })
    ]
  },
  {
    id: 'shadow-huntress',
    element: 'wood',
    heroShapes: [
      pathShape('M32 26 L42 28 L52 48 L44 56 Z', {
        fill: '#6ed374',
        stroke: '#1f8a3d',
        'stroke-width': 1.2,
        'stroke-linejoin': 'round'
      }),
      pathShape('M36 30 L28 50 L36 58', {
        fill: 'none',
        stroke: '#52c97d',
        'stroke-width': 1.4,
        'stroke-linecap': 'round'
      }),
      pathShape('M44 36 C50 36 54 40 54 46 C50 44 46 46 44 50', {
        fill: 'none',
        stroke: '#9cef8f',
        'stroke-width': 1.4,
        'stroke-linecap': 'round'
      }),
      circleShape(50, 34, 2.4, {
        fill: '#dcffd6'
      })
    ],
    skillShapes: [
      pathShape('M28 48 C30 38 38 34 46 36 C52 38 56 44 56 52', {
        fill: 'none',
        stroke: '#5ece6e',
        'stroke-width': 2,
        'stroke-linecap': 'round'
      }),
      pathShape('M32 50 C34 56 34 60 30 64 C36 60 44 54 46 46', {
        fill: 'none',
        stroke: '#96f59f',
        'stroke-width': 1.6,
        'stroke-linecap': 'round'
      }),
      pathShape('M44 40 L52 36 L50 46', {
        fill: '#6ed374',
        stroke: '#dcffd6',
        'stroke-width': 0.8
      }),
      circleShape(32, 38, 2.4, {
        fill: '#52c97d'
      })
    ]
  },
  // Light heroes
  {
    id: 'dawn-empress',
    element: 'light',
    heroShapes: [
      pathShape('M24 52 C28 40 36 34 44 34 C52 34 60 40 64 52 Z', {
        fill: '#ffe680',
        stroke: '#f0c86b',
        'stroke-width': 1.6,
        'stroke-linejoin': 'round'
      }),
      polygonShape('32,40 36,28 40,34 44,28 48,40', {
        fill: '#fff6d4',
        stroke: '#fcd35d',
        'stroke-width': 1.2,
        'stroke-linejoin': 'round'
      }),
      pathShape('M40 24 L40 16', {
        fill: 'none',
        stroke: '#ffe7a8',
        'stroke-width': 1.4,
        'stroke-linecap': 'round'
      }),
      pathShape('M30 28 L26 20', {
        fill: 'none',
        stroke: '#ffe7a8',
        'stroke-width': 1.2,
        'stroke-linecap': 'round'
      }),
      pathShape('M50 28 L54 20', {
        fill: 'none',
        stroke: '#ffe7a8',
        'stroke-width': 1.2,
        'stroke-linecap': 'round'
      })
    ],
    skillShapes: [
      circleShape(40, 44, 12, {
        fill: 'none',
        stroke: '#ffe680',
        'stroke-width': 2
      }),
      pathShape('M28 50 C30 42 36 38 44 38 C52 38 58 42 60 50', {
        fill: 'none',
        stroke: '#fcd35d',
        'stroke-width': 1.6,
        'stroke-linecap': 'round'
      }),
      starShape(40, 36, 6, 6, 2.4, {
        fill: '#fff6d4'
      }),
      circleShape(32, 54, 2.6, {
        fill: '#f5c047'
      })
    ]
  },
  {
    id: 'judicator-vyss',
    element: 'light',
    heroShapes: [
      pathShape('M40 22 L40 58', {
        fill: 'none',
        stroke: '#f5c047',
        'stroke-width': 1.6,
        'stroke-linecap': 'round'
      }),
      circleShape(40, 26, 4, {
        fill: '#fff6d4',
        stroke: '#f0c86b',
        'stroke-width': 1
      }),
      pathShape('M30 38 L50 38', {
        fill: 'none',
        stroke: '#ffd980',
        'stroke-width': 1.4,
        'stroke-linecap': 'round'
      }),
      pathShape('M30 38 L26 46 L34 46 Z', {
        fill: '#ffe680',
        stroke: '#fcd35d',
        'stroke-width': 0.8
      }),
      pathShape('M50 38 L46 46 L54 46 Z', {
        fill: '#ffe680',
        stroke: '#fcd35d',
        'stroke-width': 0.8
      })
    ],
    skillShapes: [
      pathShape('M28 52 C34 40 46 36 58 42', {
        fill: 'none',
        stroke: '#f5c047',
        'stroke-width': 2.2,
        'stroke-linecap': 'round'
      }),
      pathShape('M32 56 L32 44', {
        fill: 'none',
        stroke: '#ffe680',
        'stroke-width': 1.4,
        'stroke-linecap': 'round'
      }),
      pathShape('M48 56 L48 44', {
        fill: 'none',
        stroke: '#ffe680',
        'stroke-width': 1.4,
        'stroke-linecap': 'round'
      }),
      starShape(44, 36, 5, 4.5, 2, {
        fill: '#fff6d4'
      })
    ]
  },
  {
    id: 'radiant-priest',
    element: 'light',
    heroShapes: [
      pathShape('M36 22 L44 24 L48 40 L40 60 L32 40 Z', {
        fill: '#ffe680',
        stroke: '#f0c86b',
        'stroke-width': 1.2,
        'stroke-linejoin': 'round'
      }),
      pathShape('M40 28 L40 52', {
        fill: 'none',
        stroke: '#fff6d4',
        'stroke-width': 1.4,
        'stroke-linecap': 'round'
      }),
      pathShape('M32 36 L48 44', {
        fill: 'none',
        stroke: '#ffd980',
        'stroke-width': 1.2,
        'stroke-linecap': 'round'
      }),
      starShape(40, 24, 6, 6, 2.4, {
        fill: '#fffbe6'
      })
    ],
    skillShapes: [
      circleShape(40, 44, 10, {
        fill: 'none',
        stroke: '#ffe680',
        'stroke-width': 1.8
      }),
      pathShape('M40 32 C44 34 46 38 46 42 C46 46 44 50 40 52 C36 50 34 46 34 42 C34 38 36 34 40 32 Z', {
        fill: '#fff6d4',
        'fill-opacity': 0.6
      }),
      pathShape('M36 42 L44 46', {
        fill: 'none',
        stroke: '#f5c047',
        'stroke-width': 1.2,
        'stroke-linecap': 'round'
      }),
      pathShape('M44 42 L36 46', {
        fill: 'none',
        stroke: '#f5c047',
        'stroke-width': 1.2,
        'stroke-linecap': 'round'
      })
    ]
  },
  {
    id: 'lumina-blade',
    element: 'light',
    heroShapes: [
      pathShape('M38 20 L42 20 L48 42 L40 60 L32 42 Z', {
        fill: '#fff0b8',
        stroke: '#f0c86b',
        'stroke-width': 1.2,
        'stroke-linejoin': 'round'
      }),
      pathShape('M28 36 C32 30 38 28 44 30 L40 36 L32 40', {
        fill: 'none',
        stroke: '#ffe680',
        'stroke-width': 1.4,
        'stroke-linecap': 'round'
      }),
      pathShape('M52 36 C48 30 42 28 36 30 L40 36 L48 40', {
        fill: 'none',
        stroke: '#ffe680',
        'stroke-width': 1.4,
        'stroke-linecap': 'round'
      }),
      circleShape(40, 30, 3.2, {
        fill: '#fff6d4'
      })
    ],
    skillShapes: [
      pathShape('M28 54 L56 28', {
        fill: 'none',
        stroke: '#ffe680',
        'stroke-width': 3,
        'stroke-linecap': 'round'
      }),
      circleShape(50, 28, 7, {
        fill: 'none',
        stroke: '#fcd35d',
        'stroke-width': 1.6
      }),
      pathShape('M50 22 L50 28 L56 28', {
        fill: 'none',
        stroke: '#ffe7a8',
        'stroke-width': 1.2,
        'stroke-linecap': 'round'
      }),
      starShape(32, 48, 4, 4, 2, {
        fill: '#fffbe6'
      })
    ]
  },
  {
    id: 'celestial-tactician',
    element: 'light',
    heroShapes: [
      circleShape(40, 40, 18, {
        fill: 'none',
        stroke: '#f5c047',
        'stroke-width': 1.6
      }),
      circleShape(40, 40, 10, {
        fill: 'none',
        stroke: '#ffe680',
        'stroke-width': 1.2
      }),
      pathShape('M24 40 L56 40', {
        fill: 'none',
        stroke: '#ffd980',
        'stroke-width': 1.2,
        'stroke-linecap': 'round'
      }),
      pathShape('M40 24 L40 56', {
        fill: 'none',
        stroke: '#ffd980',
        'stroke-width': 1.2,
        'stroke-linecap': 'round'
      }),
      starShape(48, 32, 5, 4.5, 2, {
        fill: '#fff6d4'
      })
    ],
    skillShapes: [
      pathShape('M28 46 C28 36 36 32 44 32 C52 32 58 36 58 44 C58 52 52 56 44 56 C36 56 30 52 28 46 Z', {
        fill: 'none',
        stroke: '#f5c047',
        'stroke-width': 2
      }),
      pathShape('M34 42 C40 38 48 38 54 44', {
        fill: 'none',
        stroke: '#ffe680',
        'stroke-width': 1.4,
        'stroke-linecap': 'round'
      }),
      pathShape('M40 34 L46 30 L44 38', {
        fill: '#fff6d4',
        stroke: '#f0c86b',
        'stroke-width': 0.8
      }),
      circleShape(32, 52, 2.4, {
        fill: '#ffe7a8'
      })
    ]
  },
  {
    id: 'halo-savant',
    element: 'light',
    heroShapes: [
      circleShape(40, 28, 10, {
        fill: 'none',
        stroke: '#ffe680',
        'stroke-width': 1.6
      }),
      pathShape('M28 36 C30 30 36 28 42 30 C38 34 38 38 40 44 C34 42 30 40 28 36 Z', {
        fill: '#fff6d4',
        'fill-opacity': 0.7
      }),
      pathShape('M52 36 C50 30 44 28 38 30 C42 34 42 38 40 44 C46 42 50 40 52 36 Z', {
        fill: '#ffe680',
        'fill-opacity': 0.6
      }),
      circleShape(40, 46, 4, {
        fill: '#fcd35d'
      })
    ],
    skillShapes: [
      circleShape(40, 40, 12, {
        fill: 'none',
        stroke: '#ffe680',
        'stroke-width': 1.8
      }),
      pathShape('M28 44 C30 36 36 32 44 32 C52 32 58 36 60 44', {
        fill: 'none',
        stroke: '#fcd35d',
        'stroke-width': 1.6,
        'stroke-linecap': 'round'
      }),
      pathShape('M34 48 C36 52 36 56 32 60 C38 58 44 54 46 48', {
        fill: 'none',
        stroke: '#fff6d4',
        'stroke-width': 1.2,
        'stroke-linecap': 'round'
      }),
      starShape(48, 34, 4, 4, 2, {
        fill: '#fffbe6'
      })
    ]
  },
  {
    id: 'aegis-dion',
    element: 'light',
    heroShapes: [
      pathShape('M40 22 L56 30 L52 52 C48 58 44 62 40 64 C36 62 32 58 28 52 L24 30 Z', {
        fill: '#ffe680',
        stroke: '#f0c86b',
        'stroke-width': 1.6,
        'stroke-linejoin': 'round'
      }),
      pathShape('M40 28 L40 54', {
        fill: 'none',
        stroke: '#fff6d4',
        'stroke-width': 1.4,
        'stroke-linecap': 'round'
      }),
      pathShape('M32 42 L48 42', {
        fill: 'none',
        stroke: '#ffd980',
        'stroke-width': 1.4,
        'stroke-linecap': 'round'
      }),
      circleShape(40, 34, 4, {
        fill: '#fffbe6'
      })
    ],
    skillShapes: [
      circleShape(40, 44, 12, {
        fill: 'none',
        stroke: '#f5c047',
        'stroke-width': 2
      }),
      pathShape('M40 34 L40 50', {
        fill: 'none',
        stroke: '#ffe680',
        'stroke-width': 1.4,
        'stroke-linecap': 'round'
      }),
      pathShape('M32 42 L48 42', {
        fill: 'none',
        stroke: '#ffe680',
        'stroke-width': 1.4,
        'stroke-linecap': 'round'
      }),
      pathShape('M28 52 C32 56 40 58 48 54', {
        fill: 'none',
        stroke: '#fff6d4',
        'stroke-width': 1.2,
        'stroke-linecap': 'round'
      })
    ]
  },
  {
    id: 'domain-neira',
    element: 'light',
    heroShapes: [
      pathShape('M28 48 C28 34 38 30 48 34 C56 36 60 44 54 52 C50 56 44 58 38 56', {
        fill: 'none',
        stroke: '#f5c047',
        'stroke-width': 2,
        'stroke-linecap': 'round'
      }),
      pathShape('M36 26 C42 28 46 32 46 38 C46 44 42 48 36 50', {
        fill: 'none',
        stroke: '#ffe680',
        'stroke-width': 1.4,
        'stroke-linecap': 'round'
      }),
      circleShape(34, 36, 3.6, {
        fill: '#fff6d4'
      }),
      circleShape(48, 48, 2.4, {
        fill: '#ffd980'
      })
    ],
    skillShapes: [
      pathShape('M26 46 C26 36 32 30 40 30 C48 30 54 36 54 44 C54 52 48 58 40 58 C32 58 26 52 26 46 Z', {
        fill: 'none',
        stroke: '#f5c047',
        'stroke-width': 2
      }),
      pathShape('M30 50 C34 56 46 58 54 52', {
        fill: 'none',
        stroke: '#ffe680',
        'stroke-width': 1.6,
        'stroke-linecap': 'round'
      }),
      circleShape(34, 40, 3, {
        fill: '#fffbe6'
      }),
      starShape(48, 36, 4, 4, 2, {
        fill: '#ffd980'
      })
    ]
  },
  {
    id: 'pulse-healer',
    element: 'light',
    heroShapes: [
      pathShape('M34 40 C34 34 38 32 40 36 C42 32 46 34 46 40 C46 48 40 54 40 54 C40 54 34 48 34 40 Z', {
        fill: '#ffb5c8',
        stroke: '#ffe0ef',
        'stroke-width': 1
      }),
      pathShape('M26 48 C30 42 36 38 44 38 C52 38 58 42 60 48', {
        fill: 'none',
        stroke: '#ffe680',
        'stroke-width': 1.6,
        'stroke-linecap': 'round'
      }),
      circleShape(40, 30, 4, {
        fill: '#fff6d4'
      }),
      pathShape('M36 48 L44 44', {
        fill: 'none',
        stroke: '#fcd35d',
        'stroke-width': 1.2,
        'stroke-linecap': 'round'
      })
    ],
    skillShapes: [
      circleShape(40, 44, 10, {
        fill: 'none',
        stroke: '#ffe680',
        'stroke-width': 1.8
      }),
      pathShape('M28 50 C32 42 38 38 46 40 C52 42 56 48 56 54', {
        fill: 'none',
        stroke: '#fcd35d',
        'stroke-width': 1.6,
        'stroke-linecap': 'round'
      }),
      pathShape('M34 44 C36 40 40 38 44 40 C48 42 50 46 48 50', {
        fill: 'none',
        stroke: '#fff6d4',
        'stroke-width': 1.2,
        'stroke-linecap': 'round'
      }),
      circleShape(32, 54, 2.6, {
        fill: '#ffb5c8'
      })
    ]
  },
  {
    id: 'silver-envoy',
    element: 'light',
    heroShapes: [
      pathShape('M28 36 C32 30 38 28 44 30 L40 36 L32 42', {
        fill: 'none',
        stroke: '#ffe680',
        'stroke-width': 1.4,
        'stroke-linecap': 'round'
      }),
      pathShape('M52 36 C48 30 42 28 36 30 L40 36 L48 42', {
        fill: 'none',
        stroke: '#ffe680',
        'stroke-width': 1.4,
        'stroke-linecap': 'round'
      }),
      pathShape('M40 20 L44 28 L42 44 L38 44 L36 28 Z', {
        fill: '#fff6d4',
        stroke: '#f0c86b',
        'stroke-width': 1.2,
        'stroke-linejoin': 'round'
      }),
      circleShape(40, 30, 3, {
        fill: '#ffe7a8'
      })
    ],
    skillShapes: [
      pathShape('M28 46 C32 36 42 32 54 36', {
        fill: 'none',
        stroke: '#f5c047',
        'stroke-width': 2.2,
        'stroke-linecap': 'round'
      }),
      pathShape('M34 48 L48 40 L40 56', {
        fill: 'none',
        stroke: '#ffe680',
        'stroke-width': 1.6,
        'stroke-linecap': 'round'
      }),
      circleShape(50, 36, 6, {
        fill: 'none',
        stroke: '#fff6d4',
        'stroke-width': 1.2
      }),
      circleShape(32, 54, 2.4, {
        fill: '#ffd980'
      })
    ]
  },
  // Dark heroes
  {
    id: 'noctis-witch',
    element: 'dark',
    heroShapes: [
      pathShape('M34 24 C46 24 56 34 56 46 C56 58 46 64 36 62 C44 56 48 48 48 40 C48 32 44 26 34 24 Z', {
        fill: '#9b74ff',
        stroke: '#5f2da5',
        'stroke-width': 1.6,
        'stroke-linejoin': 'round'
      }),
      pathShape('M46 28 C52 32 54 38 52 44 C50 48 52 52 56 54 C50 54 46 50 44 44 C42 38 42 32 46 28 Z', {
        fill: '#d5c0ff',
        'fill-opacity': 0.6
      }),
      starShape(36, 32, 5, 5, 2.4, {
        fill: '#f3edff'
      })
    ],
    skillShapes: [
      pathShape('M28 48 C28 36 40 30 52 34', {
        fill: 'none',
        stroke: '#7d3de1',
        'stroke-width': 2.4,
        'stroke-linecap': 'round'
      }),
      polygonShape('52,34 46,30 48,38', {
        fill: '#7d3de1',
        stroke: '#d5c0ff',
        'stroke-width': 0.8
      }),
      pathShape('M40 40 C42 44 42 48 40 52 C38 48 38 44 40 40 Z', {
        fill: '#ffe0f2',
        stroke: '#aa84ff',
        'stroke-width': 0.8
      }),
      circleShape(30, 54, 2.4, {
        fill: '#c5afff'
      })
    ]
  },
  {
    id: 'void-hunter',
    element: 'dark',
    heroShapes: [
      pathShape('M28 52 C28 38 36 30 48 30 C54 30 58 34 58 40 C58 46 54 50 48 50 C42 50 36 54 34 60 C32 56 28 56 28 52 Z', {
        fill: '#7d3de1',
        stroke: '#45246a',
        'stroke-width': 1.6,
        'stroke-linejoin': 'round'
      }),
      pathShape('M46 34 C52 34 56 38 56 44 C52 42 48 42 46 46', {
        fill: 'none',
        stroke: '#c5afff',
        'stroke-width': 1.4,
        'stroke-linecap': 'round'
      }),
      pathShape('M36 38 L32 44 L36 48', {
        fill: 'none',
        stroke: '#aa84ff',
        'stroke-width': 1.4,
        'stroke-linecap': 'round'
      }),
      circleShape(50, 34, 2.6, {
        fill: '#f3edff'
      })
    ],
    skillShapes: [
      pathShape('M28 54 L58 30', {
        fill: 'none',
        stroke: '#9b74ff',
        'stroke-width': 3,
        'stroke-linecap': 'round'
      }),
      polygonShape('58,30 52,26 54,34', {
        fill: '#7d3de1',
        stroke: '#d5c0ff',
        'stroke-width': 0.8
      }),
      pathShape('M44 36 L50 32', {
        fill: 'none',
        stroke: '#c5afff',
        'stroke-width': 1.4,
        'stroke-linecap': 'round'
      }),
      circleShape(32, 50, 2.6, {
        fill: '#aa84ff'
      })
    ]
  },
  {
    id: 'shadow-walker',
    element: 'dark',
    heroShapes: [
      pathShape('M32 26 L44 24 L54 46 L38 60 L30 44 Z', {
        fill: '#7d3de1',
        stroke: '#45246a',
        'stroke-width': 1.2,
        'stroke-linejoin': 'round'
      }),
      pathShape('M36 30 L28 48 L36 58', {
        fill: 'none',
        stroke: '#9b74ff',
        'stroke-width': 1.4,
        'stroke-linecap': 'round'
      }),
      pathShape('M46 36 C52 36 56 40 56 46 C52 44 48 46 46 50', {
        fill: 'none',
        stroke: '#d5c0ff',
        'stroke-width': 1.4,
        'stroke-linecap': 'round'
      }),
      circleShape(50, 34, 2.4, {
        fill: '#f3edff'
      })
    ],
    skillShapes: [
      pathShape('M30 48 C30 36 38 32 46 36 C52 38 56 44 56 52', {
        fill: 'none',
        stroke: '#7d3de1',
        'stroke-width': 2,
        'stroke-linecap': 'round'
      }),
      pathShape('M34 50 C36 56 34 60 30 64 C36 60 44 54 46 46', {
        fill: 'none',
        stroke: '#c5afff',
        'stroke-width': 1.4,
        'stroke-linecap': 'round'
      }),
      pathShape('M42 40 C46 42 48 46 48 50 C48 54 46 58 42 58 C38 58 36 54 36 50 C36 46 38 42 42 40 Z', {
        fill: '#ff7fb2',
        stroke: '#ffd0e6',
        'stroke-width': 0.8
      }),
      circleShape(32, 40, 2.4, {
        fill: '#aa84ff'
      })
    ]
  },
  {
    id: 'gloom-keeper',
    element: 'dark',
    heroShapes: [
      pathShape('M40 24 C48 24 54 30 54 38 L54 46 C54 54 48 60 40 60 C32 60 26 54 26 46 L26 38 C26 30 32 24 40 24 Z', {
        fill: '#7d3de1',
        stroke: '#45246a',
        'stroke-width': 1.6,
        'stroke-linejoin': 'round'
      }),
      circleShape(40, 42, 8, {
        fill: '#9b74ff'
      }),
      pathShape('M40 36 C42 36 44 38 44 40 L44 46 L36 46 L36 40 C36 38 38 36 40 36 Z', {
        fill: '#d5c0ff'
      }),
      circleShape(40, 42, 2.4, {
        fill: '#45246a'
      })
    ],
    skillShapes: [
      pathShape('M30 46 C30 36 36 30 44 30 C52 30 58 36 58 44 C58 52 52 58 44 58 C36 58 30 52 30 46 Z', {
        fill: 'none',
        stroke: '#7d3de1',
        'stroke-width': 2.2
      }),
      pathShape('M32 40 L28 34', {
        fill: 'none',
        stroke: '#c5afff',
        'stroke-width': 1.4,
        'stroke-linecap': 'round'
      }),
      pathShape('M48 40 L52 34', {
        fill: 'none',
        stroke: '#c5afff',
        'stroke-width': 1.4,
        'stroke-linecap': 'round'
      }),
      circleShape(40, 48, 3, {
        fill: '#f3edff'
      })
    ]
  },
  {
    id: 'river-shaman',
    element: 'dark',
    heroShapes: [
      pathShape('M34 24 C46 24 56 32 56 44 C56 52 48 60 40 60 C32 60 24 52 24 44 C24 32 32 24 34 24 Z', {
        fill: '#7d3de1',
        stroke: '#45246a',
        'stroke-width': 1.4,
        'stroke-linejoin': 'round'
      }),
      circleShape(36, 38, 3.2, {
        fill: '#f3edff'
      }),
      circleShape(44, 38, 3.2, {
        fill: '#f3edff'
      }),
      pathShape('M36 46 C38 48 42 48 44 46', {
        fill: 'none',
        stroke: '#c5afff',
        'stroke-width': 1.2,
        'stroke-linecap': 'round'
      }),
      pathShape('M26 50 C30 46 36 46 42 48 C48 50 52 50 56 48', {
        fill: 'none',
        stroke: '#9b74ff',
        'stroke-width': 1.4,
        'stroke-linecap': 'round'
      })
    ],
    skillShapes: [
      pathShape('M30 48 C30 36 38 30 46 32 C52 34 56 40 56 48', {
        fill: 'none',
        stroke: '#7d3de1',
        'stroke-width': 2,
        'stroke-linecap': 'round'
      }),
      pathShape('M34 50 C36 56 36 60 32 64 C38 60 44 54 46 46', {
        fill: 'none',
        stroke: '#c5afff',
        'stroke-width': 1.4,
        'stroke-linecap': 'round'
      }),
      circleShape(36, 40, 3, {
        fill: '#f3edff'
      }),
      circleShape(48, 44, 2.6, {
        fill: '#aa84ff'
      })
    ]
  },
  {
    id: 'fallen-strategist',
    element: 'dark',
    heroShapes: [
      pathShape('M34 24 L46 24 L50 32 L46 38 L50 46 L46 60 L34 60 L30 46 L34 38 L30 32 Z', {
        fill: '#7d3de1',
        stroke: '#45246a',
        'stroke-width': 1.4,
        'stroke-linejoin': 'round'
      }),
      pathShape('M32 28 L48 54', {
        fill: 'none',
        stroke: '#aa84ff',
        'stroke-width': 1.2,
        'stroke-linecap': 'round'
      }),
      circleShape(40, 32, 3, {
        fill: '#f3edff'
      })
    ],
    skillShapes: [
      pathShape('M28 46 C28 36 36 32 44 34 C50 36 54 42 54 48', {
        fill: 'none',
        stroke: '#7d3de1',
        'stroke-width': 2,
        'stroke-linecap': 'round'
      }),
      pathShape('M30 50 C34 56 42 58 50 54', {
        fill: 'none',
        stroke: '#c5afff',
        'stroke-width': 1.4,
        'stroke-linecap': 'round'
      }),
      polygonShape('46,36 54,34 52,42', {
        fill: '#aa84ff',
        stroke: '#f3edff',
        'stroke-width': 0.8
      }),
      circleShape(32, 40, 2.4, {
        fill: '#9b74ff'
      })
    ]
  },
  {
    id: 'abyssal-seer',
    element: 'dark',
    heroShapes: [
      pathShape('M28 40 C34 30 46 30 52 40 C46 50 34 50 28 40 Z', {
        fill: '#7d3de1',
        stroke: '#45246a',
        'stroke-width': 1.4,
        'stroke-linejoin': 'round'
      }),
      circleShape(40, 40, 6, {
        fill: '#c5afff',
        stroke: '#5f2da5',
        'stroke-width': 1.2
      }),
      circleShape(40, 40, 2.2, {
        fill: '#2d1147'
      }),
      starShape(32, 30, 5, 4, 2, {
        fill: '#f3edff'
      }),
      starShape(48, 50, 5, 3.5, 1.8, {
        fill: '#d5c0ff'
      })
    ],
    skillShapes: [
      pathShape('M28 46 C28 36 34 30 42 30 C50 30 56 36 56 46', {
        fill: 'none',
        stroke: '#7d3de1',
        'stroke-width': 2,
        'stroke-linecap': 'round'
      }),
      circleShape(40, 44, 8, {
        fill: 'none',
        stroke: '#c5afff',
        'stroke-width': 1.4
      }),
      starShape(40, 36, 6, 5, 2, {
        fill: '#f3edff'
      }),
      pathShape('M32 52 C36 56 44 56 48 52', {
        fill: 'none',
        stroke: '#aa84ff',
        'stroke-width': 1.2,
        'stroke-linecap': 'round'
      })
    ]
  },
  {
    id: 'shadow-wraith',
    element: 'dark',
    heroShapes: [
      pathShape('M36 22 C44 22 52 28 52 36 C52 44 48 50 44 56 C42 60 46 62 50 62 C44 64 38 60 36 54 C34 50 32 42 30 32 Z', {
        fill: '#7d3de1',
        stroke: '#45246a',
        'stroke-width': 1.4,
        'stroke-linejoin': 'round'
      }),
      pathShape('M28 40 L36 48 L28 56', {
        fill: 'none',
        stroke: '#aa84ff',
        'stroke-width': 1.2,
        'stroke-linecap': 'round'
      }),
      pathShape('M52 40 L44 48 L52 56', {
        fill: 'none',
        stroke: '#aa84ff',
        'stroke-width': 1.2,
        'stroke-linecap': 'round'
      }),
      circleShape(40, 32, 3, {
        fill: '#f3edff'
      })
    ],
    skillShapes: [
      pathShape('M28 46 C28 36 34 30 42 32 C48 34 52 40 54 48', {
        fill: 'none',
        stroke: '#7d3de1',
        'stroke-width': 2,
        'stroke-linecap': 'round'
      }),
      pathShape('M32 52 C34 56 34 60 30 64 C36 60 44 54 46 46', {
        fill: 'none',
        stroke: '#c5afff',
        'stroke-width': 1.4,
        'stroke-linecap': 'round'
      }),
      pathShape('M46 38 C50 42 52 48 50 54', {
        fill: 'none',
        stroke: '#aa84ff',
        'stroke-width': 1.4,
        'stroke-linecap': 'round'
      }),
      circleShape(32, 40, 2.4, {
        fill: '#d5c0ff'
      })
    ]
  },
  {
    id: 'dusk-swordmaster',
    element: 'dark',
    heroShapes: [
      pathShape('M38 20 L42 20 L50 42 L40 62 L30 42 Z', {
        fill: '#9b74ff',
        stroke: '#45246a',
        'stroke-width': 1.2,
        'stroke-linejoin': 'round'
      }),
      pathShape('M28 32 C34 28 42 28 48 32', {
        fill: 'none',
        stroke: '#c5afff',
        'stroke-width': 1.4,
        'stroke-linecap': 'round'
      }),
      pathShape('M52 32 C58 36 58 44 52 50 C50 44 48 40 44 38', {
        fill: 'none',
        stroke: '#aa84ff',
        'stroke-width': 1.2,
        'stroke-linecap': 'round'
      }),
      circleShape(44, 28, 3, {
        fill: '#f3edff'
      })
    ],
    skillShapes: [
      pathShape('M28 54 L56 28', {
        fill: 'none',
        stroke: '#9b74ff',
        'stroke-width': 3,
        'stroke-linecap': 'round'
      }),
      circleShape(52, 30, 7, {
        fill: 'none',
        stroke: '#c5afff',
        'stroke-width': 1.6
      }),
      pathShape('M52 24 L52 30 L58 30', {
        fill: 'none',
        stroke: '#d5c0ff',
        'stroke-width': 1.2,
        'stroke-linecap': 'round'
      }),
      starShape(32, 48, 4, 4, 2, {
        fill: '#f3edff'
      })
    ]
  },
  {
    id: 'obsidian-bard',
    element: 'dark',
    heroShapes: [
      pathShape('M32 24 C42 24 50 30 52 38 C54 46 50 54 42 58 C34 54 30 46 32 38 C34 32 34 28 32 24 Z', {
        fill: '#9b74ff',
        stroke: '#45246a',
        'stroke-width': 1.4,
        'stroke-linejoin': 'round'
      }),
      pathShape('M36 30 L44 46', {
        fill: 'none',
        stroke: '#d5c0ff',
        'stroke-width': 1.2
      }),
      pathShape('M38 28 L46 44', {
        fill: 'none',
        stroke: '#d5c0ff',
        'stroke-width': 1.2
      }),
      pathShape('M50 34 C56 32 58 38 54 42 C52 44 52 46 54 48 C50 48 48 46 48 42 C48 38 49 36 50 34 Z', {
        fill: '#c5afff'
      })
    ],
    skillShapes: [
      pathShape('M28 48 C28 36 38 32 46 36 C52 38 56 44 50 52', {
        fill: 'none',
        stroke: '#7d3de1',
        'stroke-width': 2,
        'stroke-linecap': 'round'
      }),
      pathShape('M52 38 L52 56 C52 59 49 62 46 60 C43 58 46 54 49 54 L49 40 Z', {
        fill: '#aa84ff',
        stroke: '#d5c0ff',
        'stroke-width': 1
      }),
      starShape(34, 40, 5, 4.5, 2, {
        fill: '#f3edff'
      }),
      circleShape(42, 48, 2.4, {
        fill: '#9b74ff'
      })
    ]
  }
];

export const HERO_ART = heroArtConfig.reduce((acc, entry) => {
  acc[entry.id] = {
    hero: createHeroIcon(entry.id, entry.element, entry.heroShapes),
    skill: createSkillIcon(entry.id, entry.element, entry.skillShapes)
  };
  return acc;
}, {});

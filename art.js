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
  // Fire heroes
  {
    id: 'ember-sovereign',
    element: 'fire',
    heroShapes: [
      pathShape('M40 16 C47 25 50 33 47 40 C45 45 47 50 52 55 C43 52 37 45 34 38 C31 31 34 22 40 16 Z', {
        fill: '#ffcf6f',
        stroke: '#ff8246',
        'stroke-width': 1.6,
        'stroke-linejoin': 'round'
      }),
      polygonShape('28,46 26,32 33,36 40,30 47,36 54,32 52,46', {
        fill: 'none',
        stroke: '#ffe0a6',
        'stroke-width': 1.8,
        'stroke-linejoin': 'round'
      }),
      circleShape(40, 52, 4.5, {
        fill: '#ff8246',
        stroke: '#ffd18c',
        'stroke-width': 1.2,
        'stroke-opacity': 0.8
      })
    ],
    skillShapes: [
      pathShape('M26 50 C26 36 39 28 52 32', {
        fill: 'none',
        stroke: '#ff8246',
        'stroke-width': 2.6,
        'stroke-linecap': 'round'
      }),
      polygonShape('52,32 46,28 48,36', {
        fill: '#ff8246',
        stroke: '#ffd18c',
        'stroke-width': 1
      }),
      pathShape('M40 40 C42.5 44 42.5 48 40 53 C37.5 48 37.5 44 40 40 Z', {
        fill: '#6ed374',
        stroke: '#2f9350',
        'stroke-width': 1
      }),
      circleShape(32, 56, 3, {
        fill: '#ffcf6f',
        'fill-opacity': 0.8
      })
    ]
  },

  {
    id: 'drake-artillerist',
    element: 'fire',
    heroShapes: [
      pathShape('M28 44 C28 32 38 26 46 28 C52 30 54 36 50 42 C46 47 38 50 32 48 C34 52 36 54 38 56 C32 54 28 50 28 44 Z', {
        fill: '#ffb36f',
        stroke: '#ff663b',
        'stroke-width': 1.4,
        'stroke-linejoin': 'round'
      }),
      pathShape('M34 48 C40 42 48 44 54 50 C48 52 40 54 34 48 Z', {
        fill: '#ff6f3e',
        'fill-opacity': 0.6
      }),
      polylineShape('30,34 44,26 52,30', {
        stroke: '#ffe5c6',
        'stroke-width': 1.8,
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round'
      }),
      circleShape(45, 35, 2.2, {
        fill: '#ff8246',
        stroke: '#ffd8aa',
        'stroke-width': 0.8
      })
    ],
    skillShapes: [
      pathShape('M32 48 C32 36 42 30 52 34', {
        fill: 'none',
        stroke: '#ff8246',
        'stroke-width': 2.2,
        'stroke-linecap': 'round'
      }),
      polygonShape('52,34 46,30 48,38', {
        fill: '#ff8246',
        stroke: '#ffd8ad',
        'stroke-width': 0.8
      }),
      pathShape('M34 44 C34 38 40 36 40 40 C40 36 46 38 46 44 C46 50 40 55 40 55 C40 55 34 50 34 44 Z', {
        fill: '#ff8fbf',
        stroke: '#ffd4de',
        'stroke-width': 1
      }),
      pathShape('M46 44 C50 47 52 51 50 55 C48 58 52 60 56 58 C50 64 44 60 44 52 C44 48 45 46 46 44 Z', {
        fill: '#ff6a3c',
        stroke: '#ffd18c',
        'stroke-width': 1.2,
        'stroke-linejoin': 'round'
      }),
      circleShape(30, 54, 2.2, {
        fill: '#ffe0a6'
      })
    ]
  },
  {
    id: 'radiant-vanguard',
    element: 'fire',
    heroShapes: [
      pathShape('M40 20 L56 28 L52 48 C49 54 44 58 40 60 C36 58 31 54 28 48 L24 28 Z', {
        fill: '#ffcf6f',
        stroke: '#ff8246',
        'stroke-width': 1.6,
        'stroke-linejoin': 'round'
      }),
      pathShape('M40 22 L42 44 L38 52 L36 48 L38 46 L36 28 Z', {
        fill: '#ffe5cc',
        stroke: '#ff6433',
        'stroke-width': 1.2
      }),
      pathShape('M48 34 C52 38 52 44 48 48 C46 50 48 54 52 54 C46 56 42 52 42 46 C42 40 44 36 48 34 Z', {
        fill: '#ff9152',
        'fill-opacity': 0.7
      })
    ],
    skillShapes: [
      pathShape('M24 52 L54 26', {
        fill: 'none',
        stroke: '#ffe0a6',
        'stroke-width': 3.4,
        'stroke-linecap': 'round'
      }),
      pathShape('M30 58 L58 30', {
        fill: 'none',
        stroke: '#ff8246',
        'stroke-width': 2,
        'stroke-linecap': 'round'
      }),
      polylineShape('44,28 48,32 52,30', {
        stroke: '#ffd0a0',
        'stroke-width': 1.4,
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round'
      }),
      starShape(52, 32, 4, 4, 2, {
        fill: '#ffe7b3',
        'fill-opacity': 0.85
      })
    ]
  },
  {
    id: 'cinder-ronin',
    element: 'fire',
    heroShapes: [
      pathShape('M28 48 C34 30 46 26 54 30 C48 34 40 40 34 58 Z', {
        fill: '#ffe5cc',
        stroke: '#ff7342',
        'stroke-width': 1.4
      }),
      pathShape('M24 44 C26 34 30 28 38 26 C32 34 32 42 34 52 C36 60 30 60 24 54 Z', {
        fill: '#ff8246',
        'fill-opacity': 0.7
      }),
      pathShape('M42 34 C48 36 50 42 46 48 C44 52 46 54 50 56 C44 56 40 52 40 46 C40 40 42 36 42 34 Z', {
        fill: 'none',
        stroke: '#ffd4aa',
        'stroke-width': 1.2,
        'stroke-linecap': 'round'
      })
    ],
    skillShapes: [
      pathShape('M26 56 L50 28', {
        fill: 'none',
        stroke: '#ffe0a6',
        'stroke-width': 2.4,
        'stroke-linecap': 'round'
      }),
      pathShape('M34 60 L56 32', {
        fill: 'none',
        stroke: '#ff7040',
        'stroke-width': 2,
        'stroke-linecap': 'round'
      }),
      pathShape('M44 34 C50 38 52 46 48 52 C46 56 50 58 54 58 C48 64 40 60 40 50 C40 44 42 38 44 34 Z', {
        fill: '#ff934f',
        'fill-opacity': 0.6
      }),
      pathShape('M28 40 L32 34 L36 40 Z', {
        fill: '#ffd98f',
        stroke: '#ffe9c0',
        'stroke-width': 0.8
      })
    ]
  },
  {
    id: 'ash-bard',
    element: 'fire',
    heroShapes: [
      pathShape('M30 24 Q28 38 34 50 Q36 56 32 58 Q44 56 48 38 Q50 30 46 24 Z', {
        fill: 'none',
        stroke: '#ffe7b3',
        'stroke-width': 1.6
      }),
      pathShape('M34 28 L44 48', {
        fill: 'none',
        stroke: '#ff9f65',
        'stroke-width': 1
      }),
      pathShape('M36 26 L46 46', {
        fill: 'none',
        stroke: '#ff9f65',
        'stroke-width': 1
      }),
      pathShape('M38 24 L48 44', {
        fill: 'none',
        stroke: '#ff8246',
        'stroke-width': 1
      }),
      pathShape('M50 36 C56 34 58 40 54 44 C52 46 52 48 54 50 C50 50 48 48 48 44 C48 40 49 38 50 36 Z', {
        fill: '#ffb36f'
      })
    ],
    skillShapes: [
      pathShape('M26 46 C26 34 38 30 46 34 C54 38 56 48 48 54 C42 58 34 56 30 50', {
        fill: 'none',
        stroke: '#ff9152',
        'stroke-width': 2,
        'stroke-linecap': 'round'
      }),
      pathShape('M50 38 L50 56 C50 59 47 62 44 60 C41 58 44 54 47 54 L47 40 Z', {
        fill: '#ffb978',
        stroke: '#ffe4bc',
        'stroke-width': 1
      }),
      starShape(34, 40, 5, 5, 2.5, {
        fill: '#ffe7b3',
        'fill-opacity': 0.7
      }),
      circleShape(42, 48, 2, {
        fill: '#ffd9aa'
      })
    ]
  },
  {
    id: 'lava-herder',
    element: 'fire',
    heroShapes: [
      pathShape('M30 48 C30 36 38 28 46 28 C52 28 58 32 58 40 C58 48 52 52 46 52 C42 52 38 56 38 60 C34 56 30 52 30 48 Z', {
        fill: '#ff8246',
        stroke: '#ffb679',
        'stroke-width': 1.4,
        'stroke-linejoin': 'round'
      }),
      pathShape('M48 28 C54 26 58 30 58 36 C56 32 52 30 48 28 Z', {
        fill: '#ffcf8b'
      }),
      polylineShape('34,48 40,44 46,48 50,44', {
        stroke: '#ffd7a0',
        'stroke-width': 1.2,
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round'
      }),
      circleShape(34, 56, 2.4, {
        fill: '#ffae63'
      })
    ],
    skillShapes: [
      pathShape('M26 46 C30 36 42 34 52 38 C58 40 58 48 52 50 C44 52 36 50 30 56', {
        fill: 'none',
        stroke: '#ff743a',
        'stroke-width': 2.4,
        'stroke-linecap': 'round'
      }),
      circleShape(54, 44, 6.2, {
        fill: 'none',
        stroke: '#ffd18c',
        'stroke-width': 1.6
      }),
      pathShape('M54 40 L54 44 L58 46', {
        fill: 'none',
        stroke: '#ffd18c',
        'stroke-width': 1.3,
        'stroke-linecap': 'round'
      }),
      circleShape(40, 60, 2, {
        fill: '#ffe0a6'
      })
    ]
  },
  {
    id: 'crimson-duelist',
    element: 'fire',
    heroShapes: [
      pathShape('M28 58 L52 26', {
        fill: 'none',
        stroke: '#ffe5c6',
        'stroke-width': 2.6,
        'stroke-linecap': 'round'
      }),
      pathShape('M32 26 L56 56', {
        fill: 'none',
        stroke: '#ff7844',
        'stroke-width': 2,
        'stroke-linecap': 'round'
      }),
      circleShape(40, 40, 7.2, {
        fill: 'none',
        stroke: '#ff9156',
        'stroke-width': 1.5,
        'stroke-dasharray': '6 3'
      }),
      circleShape(40, 42, 3.2, {
        fill: '#ffd8a2'
      })
    ],
    skillShapes: [
      pathShape('M24 54 C30 42 44 36 58 34', {
        fill: 'none',
        stroke: '#ffe7b3',
        'stroke-width': 2.8,
        'stroke-linecap': 'round'
      }),
      circleShape(48, 32, 7.8, {
        fill: 'none',
        stroke: '#ff924f',
        'stroke-width': 1.8
      }),
      pathShape('M48 25 L48 32 L54 32', {
        fill: 'none',
        stroke: '#ffd18c',
        'stroke-width': 1.2,
        'stroke-linecap': 'round'
      }),
      starShape(32, 48, 4, 4, 2, {
        fill: '#ffcf8f',
        'fill-opacity': 0.8
      })
    ]
  },
  {
    id: 'magmabreaker',
    element: 'fire',
    heroShapes: [
      pathShape('M28 48 C28 38 36 32 44 32 C50 32 56 36 56 44 C56 50 52 56 44 58 C36 60 30 56 28 48 Z', {
        fill: '#ff7e49',
        stroke: '#ffb480',
        'stroke-width': 1.6,
        'stroke-linejoin': 'round'
      }),
      pathShape('M32 30 L46 24 L50 30 L36 36 Z', {
        fill: '#ffcf8b',
        'fill-opacity': 0.6
      }),
      pathShape('M24 54 L20 60', {
        fill: 'none',
        stroke: '#ffe7b3',
        'stroke-width': 1.4,
        'stroke-linecap': 'round'
      }),
      pathShape('M60 40 L66 40', {
        fill: 'none',
        stroke: '#ffe7b3',
        'stroke-width': 1.4,
        'stroke-linecap': 'round'
      }),
      pathShape('M48 60 L52 66', {
        fill: 'none',
        stroke: '#ffe7b3',
        'stroke-width': 1.4,
        'stroke-linecap': 'round'
      })
    ],
    skillShapes: [
      circleShape(36, 44, 9, {
        fill: 'rgba(255, 193, 120, 0.3)',
        stroke: '#ffd3a0',
        'stroke-width': 1.4
      }),
      pathShape('M30 50 C30 42 36 38 42 38 C48 38 54 42 54 48 C54 54 48 58 42 58 C36 58 32 56 30 50 Z', {
        fill: '#ff8a4f',
        stroke: '#ffd18c',
        'stroke-width': 1.4,
        'stroke-linejoin': 'round'
      }),
      pathShape('M45 36 L50 32', {
        fill: 'none',
        stroke: '#ffb475',
        'stroke-width': 1.2,
        'stroke-linecap': 'round'
      }),
      pathShape('M48 40 L54 38', {
        fill: 'none',
        stroke: '#ffb475',
        'stroke-width': 1.2,
        'stroke-linecap': 'round'
      }),
      polygonShape('54,48 60,46 58,52', {
        fill: '#ff9a5a'
      })
    ]
  },
  {
    id: 'pyrolumen',
    element: 'fire',
    heroShapes: [
      circleShape(34, 36, 10, {
        fill: 'none',
        stroke: '#ffdca2',
        'stroke-width': 1.6
      }),
      circleShape(48, 44, 11, {
        fill: 'none',
        stroke: '#ff8a52',
        'stroke-width': 1.8,
        'stroke-dasharray': '6 3'
      }),
      starShape(34, 34, 5, 5.5, 2.5, {
        fill: '#ffe7b3',
        'fill-opacity': 0.8
      }),
      starShape(50, 48, 5, 6, 2.5, {
        fill: '#ff9c5e',
        'fill-opacity': 0.9
      }),
      pathShape('M30 50 C36 46 44 44 50 38', {
        fill: 'none',
        stroke: '#ffd4a0',
        'stroke-width': 1.2,
        'stroke-linecap': 'round'
      })
    ],
    skillShapes: [
      circleShape(40, 40, 8, {
        fill: '#ffe8c2',
        stroke: '#ffd086',
        'stroke-width': 1.4
      }),
      pathShape('M28 40 C28 28 36 22 48 24', {
        fill: 'none',
        stroke: '#ff9a5a',
        'stroke-width': 2.2,
        'stroke-linecap': 'round'
      }),
      polygonShape('48,24 42,20 44,28', {
        fill: '#ff8848',
        stroke: '#ffd29a',
        'stroke-width': 0.8
      }),
      pathShape('M46 40 C46 48 52 54 60 54', {
        fill: 'none',
        stroke: '#ffe7b3',
        'stroke-width': 1.6,
        'stroke-linecap': 'round'
      })
    ]
  },
  {
    id: 'meteor-dancer',
    element: 'fire',
    heroShapes: [
      pathShape('M24 48 C28 34 40 30 56 28 L48 40 Z', {
        fill: '#ff823f',
        'fill-opacity': 0.7
      }),
      circleShape(50, 34, 7, {
        fill: '#ffd38c',
        stroke: '#ff9b52',
        'stroke-width': 1.4
      }),
      pathShape('M30 52 L36 46', {
        fill: 'none',
        stroke: '#ffe0a6',
        'stroke-width': 1.2,
        'stroke-linecap': 'round'
      }),
      pathShape('M34 56 L40 50', {
        fill: 'none',
        stroke: '#ffe0a6',
        'stroke-width': 1.2,
        'stroke-linecap': 'round'
      }),
      starShape(32, 40, 4, 5, 2, {
        fill: '#ffcf8f',
        'fill-opacity': 0.7
      })
    ],
    skillShapes: [
      pathShape('M28 48 C28 36 42 32 52 38 C58 42 58 50 52 54 C46 58 36 56 32 48', {
        fill: 'none',
        stroke: '#ff9052',
        'stroke-width': 2.4,
        'stroke-linecap': 'round'
      }),
      circleShape(48, 32, 7, {
        fill: 'none',
        stroke: '#ffd9a2',
        'stroke-width': 1.6
      }),
      pathShape('M48 25 L48 32 L54 32', {
        fill: 'none',
        stroke: '#ffd18c',
        'stroke-width': 1.2,
        'stroke-linecap': 'round'
      }),
      circleShape(32, 54, 2.4, {
        fill: '#ffe2a6'
      })
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

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

function ellipseShape(cx, cy, rx, ry, options = {}) {
  return `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}"${shapeAttrs(options)} />`;
}

function createHairLayers(type = 'short', options = {}) {
  const {
    color = '#3e2b25',
    highlight = '#694437',
    accent,
    stroke = '#2a1a16',
    side = 'left'
  } = options;
  const hairStroke = { stroke, 'stroke-width': 1.4, 'stroke-linejoin': 'round' };
  const layers = { back: [], front: [], accessories: [] };

  const push = (target, shape) => {
    if (shape) target.push(shape);
  };

  switch (type) {
    case 'regal': {
      push(
        layers.back,
        pathShape('M24 30 Q26 16 40 14 Q54 16 56 30 L54 54 Q46 64 34 64 Q26 58 24 50 Z', {
          fill: color,
          ...hairStroke
        })
      );
      push(
        layers.front,
        pathShape('M30 28 Q38 20 48 28 Q46 36 40 34 Q34 36 30 28 Z', {
          fill: color,
          ...hairStroke
        })
      );
      if (highlight) {
        push(
          layers.front,
          pathShape('M32 28 Q40 24 48 30', {
            fill: 'none',
            stroke: highlight,
            'stroke-width': 1.5,
            'stroke-linecap': 'round'
          })
        );
      }
      if (accent) {
        push(
          layers.accessories,
          pathShape('M28 26 L32 18 L36 26 L40 20 L44 26 L48 18 L52 26 L48 30 L32 30 Z', {
            fill: accent,
            stroke: highlight || stroke,
            'stroke-width': 1.2,
            'stroke-linejoin': 'round'
          })
        );
      }
      break;
    }
    case 'long-curtain': {
      push(
        layers.back,
        pathShape('M24 28 Q20 46 26 66 Q34 76 40 76 Q46 76 54 66 Q60 46 56 28 Q48 18 40 18 Q32 18 24 28 Z', {
          fill: color,
          ...hairStroke
        })
      );
      push(
        layers.front,
        pathShape('M30 28 Q32 36 30 44 Q28 38 26 32 Z', {
          fill: color,
          ...hairStroke
        })
      );
      push(
        layers.front,
        pathShape('M50 28 Q48 36 50 44 Q52 38 54 32 Z', {
          fill: color,
          ...hairStroke
        })
      );
      if (highlight) {
        push(
          layers.back,
          pathShape('M28 34 Q40 20 52 34', {
            fill: 'none',
            stroke: highlight,
            'stroke-width': 1.6,
            'stroke-linecap': 'round'
          })
        );
      }
      break;
    }
    case 'long-left': {
      push(
        layers.back,
        pathShape('M24 28 Q20 48 26 68 Q34 74 40 74 L36 60 Q34 46 36 34 Z', {
          fill: color,
          ...hairStroke
        })
      );
      push(
        layers.front,
        pathShape('M30 26 Q32 36 30 44 Q28 36 28 30 Z', {
          fill: color,
          ...hairStroke
        })
      );
      if (highlight) {
        push(
          layers.front,
          pathShape('M32 30 Q34 36 32 42', {
            fill: 'none',
            stroke: highlight,
            'stroke-width': 1.4,
            'stroke-linecap': 'round'
          })
        );
      }
      break;
    }
    case 'long-right': {
      push(
        layers.back,
        pathShape('M56 28 Q60 48 54 68 Q46 74 40 74 L44 60 Q46 46 44 34 Z', {
          fill: color,
          ...hairStroke
        })
      );
      push(
        layers.front,
        pathShape('M50 26 Q48 36 50 44 Q52 36 52 30 Z', {
          fill: color,
          ...hairStroke
        })
      );
      if (highlight) {
        push(
          layers.front,
          pathShape('M48 30 Q46 36 48 42', {
            fill: 'none',
            stroke: highlight,
            'stroke-width': 1.4,
            'stroke-linecap': 'round'
          })
        );
      }
      break;
    }
    case 'twin-tail': {
      push(
        layers.back,
        pathShape('M26 32 Q24 44 28 58 Q30 64 34 66 L32 52 Q30 42 34 34 Z', {
          fill: color,
          ...hairStroke
        })
      );
      push(
        layers.back,
        pathShape('M54 32 Q56 44 52 58 Q50 64 46 66 L48 52 Q50 42 46 34 Z', {
          fill: color,
          ...hairStroke
        })
      );
      push(
        layers.front,
        pathShape('M32 26 Q36 24 40 26 Q44 24 48 26 Q46 30 40 32 Q34 30 32 26 Z', {
          fill: color,
          ...hairStroke
        })
      );
      if (highlight) {
        push(
          layers.front,
          pathShape('M32 28 Q36 30 40 32 Q44 30 48 28', {
            fill: 'none',
            stroke: highlight,
            'stroke-width': 1.2,
            'stroke-linecap': 'round'
          })
        );
      }
      break;
    }
    case 'short-spiky': {
      push(
        layers.back,
        pathShape('M26 28 Q32 14 40 14 Q48 14 54 28 L50 38 Q46 32 40 30 Q34 32 30 38 Z', {
          fill: color,
          ...hairStroke
        })
      );
      push(
        layers.front,
        pathShape('M32 28 Q36 24 40 28 Q44 24 48 28 L44 34 Q40 32 36 34 Z', {
          fill: color,
          ...hairStroke
        })
      );
      if (highlight) {
        push(
          layers.front,
          pathShape('M34 28 Q40 24 46 28', {
            fill: 'none',
            stroke: highlight,
            'stroke-width': 1.3,
            'stroke-linecap': 'round'
          })
        );
      }
      break;
    }
    case 'sidecut': {
      if (side === 'left') {
        push(
          layers.back,
          pathShape('M24 28 Q28 16 44 18 Q52 22 54 30 Q52 48 46 60 Q42 66 36 66 Q28 54 24 36 Z', {
            fill: color,
            ...hairStroke
          })
        );
        push(
          layers.front,
          pathShape('M30 26 Q36 22 44 28 Q40 34 34 34 Q30 34 30 26 Z', {
            fill: color,
            ...hairStroke
          })
        );
      } else {
        push(
          layers.back,
          pathShape('M56 28 Q52 16 36 18 Q28 22 26 30 Q28 48 34 60 Q38 66 44 66 Q52 54 56 36 Z', {
            fill: color,
            ...hairStroke
          })
        );
        push(
          layers.front,
          pathShape('M50 26 Q44 22 36 28 Q40 34 46 34 Q50 34 50 26 Z', {
            fill: color,
            ...hairStroke
          })
        );
      }
      if (highlight) {
        push(
          layers.front,
          pathShape(side === 'left' ? 'M32 28 Q38 24 44 30' : 'M48 28 Q42 24 36 30', {
            fill: 'none',
            stroke: highlight,
            'stroke-width': 1.3,
            'stroke-linecap': 'round'
          })
        );
      }
      break;
    }
    case 'topknot': {
      push(
        layers.back,
        pathShape('M26 30 Q32 16 40 14 Q48 16 54 30 L52 50 Q46 60 34 60 Q28 52 26 44 Z', {
          fill: color,
          ...hairStroke
        })
      );
      push(
        layers.front,
        pathShape('M32 28 Q38 24 44 28 L42 34 Q38 32 34 34 Z', {
          fill: color,
          ...hairStroke
        })
      );
      push(
        layers.accessories,
        pathShape('M38 18 Q40 12 42 18 L40 20 Z', {
          fill: accent || highlight || color,
          stroke,
          'stroke-width': 1
        })
      );
      break;
    }
    case 'braided': {
      push(
        layers.back,
        pathShape('M26 30 Q24 46 30 62 Q34 70 40 76 Q46 70 50 62 Q56 46 54 30 Q48 20 40 20 Q32 20 26 30 Z', {
          fill: color,
          ...hairStroke
        })
      );
      push(
        layers.front,
        pathShape('M32 30 Q34 36 32 42 L36 46 Q34 50 32 54', {
          fill: 'none',
          stroke: highlight || '#dda',
          'stroke-width': 1.5,
          'stroke-linecap': 'round'
        })
      );
      push(
        layers.front,
        pathShape('M48 30 Q46 36 48 42 L44 46 Q46 50 48 54', {
          fill: 'none',
          stroke: highlight || '#dda',
          'stroke-width': 1.5,
          'stroke-linecap': 'round'
        })
      );
      break;
    }
    case 'helmet': {
      const metal = accent || '#8d7f6f';
      push(
        layers.back,
        pathShape('M26 30 Q30 12 40 12 Q50 12 54 30 Q56 44 54 58 Q50 62 30 62 Q24 54 26 30 Z', {
          fill: metal,
          stroke,
          'stroke-width': 1.6,
          'stroke-linejoin': 'round'
        })
      );
      push(
        layers.front,
        pathShape('M30 34 Q40 28 50 34 Q48 40 40 42 Q32 40 30 34 Z', {
          fill: highlight || '#54483b',
          stroke,
          'stroke-width': 1.2,
          'stroke-linejoin': 'round'
        })
      );
      break;
    }
    case 'hood': {
      push(
        layers.back,
        pathShape('M24 32 Q28 12 40 12 Q52 12 56 32 L54 58 Q44 68 32 68 Q26 56 24 48 Z', {
          fill: color,
          stroke,
          'stroke-width': 1.6,
          'stroke-linejoin': 'round'
        })
      );
      push(
        layers.front,
        pathShape('M32 24 Q40 18 48 24 L46 34 Q40 30 34 34 Z', {
          fill: color,
          stroke,
          'stroke-width': 1.2,
          'stroke-linejoin': 'round'
        })
      );
      if (highlight) {
        push(
          layers.front,
          pathShape('M32 26 Q40 20 48 26', {
            fill: 'none',
            stroke: highlight,
            'stroke-width': 1.2,
            'stroke-linecap': 'round'
          })
        );
      }
      break;
    }
    case 'mane': {
      push(
        layers.back,
        pathShape('M20 32 Q24 10 40 10 Q56 10 60 32 L58 60 Q48 74 40 76 Q32 74 22 60 Z', {
          fill: color,
          stroke,
          'stroke-width': 1.8,
          'stroke-linejoin': 'round'
        })
      );
      if (highlight) {
        push(
          layers.back,
          pathShape('M26 34 Q40 18 54 34', {
            fill: 'none',
            stroke: highlight,
            'stroke-width': 1.8,
            'stroke-linecap': 'round'
          })
        );
      }
      break;
    }
    case 'ponytail': {
      push(
        layers.back,
        pathShape('M32 24 Q40 16 48 24 L50 44 Q48 56 44 64 L52 70 Q44 74 36 70 L38 60 Q36 46 32 34 Z', {
          fill: color,
          ...hairStroke
        })
      );
      push(
        layers.front,
        pathShape('M32 26 Q38 22 44 26 L42 32 Q38 30 34 32 Z', {
          fill: color,
          ...hairStroke
        })
      );
      if (accent) {
        push(
          layers.accessories,
          pathShape('M44 58 L50 62 L48 66 L42 62 Z', {
            fill: accent,
            stroke,
            'stroke-width': 1
          })
        );
      }
      break;
    }
    case 'windswept': {
      push(
        layers.back,
        pathShape('M24 30 Q32 12 48 16 Q56 18 58 26 L56 44 Q48 38 40 36 Q34 36 30 40 Z', {
          fill: color,
          ...hairStroke
        })
      );
      push(
        layers.front,
        pathShape('M30 28 Q38 22 48 26 Q44 30 38 32 Q34 32 30 30 Z', {
          fill: color,
          ...hairStroke
        })
      );
      if (highlight) {
        push(
          layers.front,
          pathShape('M32 28 Q40 24 48 28', {
            fill: 'none',
            stroke: highlight,
            'stroke-width': 1.4,
            'stroke-linecap': 'round'
          })
        );
      }
      break;
    }
    case 'shaved': {
      push(
        layers.back,
        pathShape('M30 32 Q34 18 40 18 Q46 18 50 32 Q46 28 40 28 Q34 28 30 32 Z', {
          fill: color,
          ...hairStroke
        })
      );
      break;
    }
    default: {
      push(
        layers.back,
        pathShape('M26 30 Q32 14 40 14 Q48 14 54 30 L50 46 Q44 38 40 36 Q34 38 30 46 Z', {
          fill: color,
          ...hairStroke
        })
      );
      if (highlight) {
        push(
          layers.back,
          pathShape('M32 26 Q40 20 48 26', {
            fill: 'none',
            stroke: highlight,
            'stroke-width': 1.2,
            'stroke-linecap': 'round'
          })
        );
      }
      break;
    }
  }

  return layers;
}

function createEyeSet(options = {}, variant = 'human') {
  const {
    iris = '#3a2d29',
    pupil = '#160b09',
    highlight = '#fff',
    glow,
    shape = 'soft',
    size = 'medium',
    offsetY = 0
  } = options;

  const sizeMap = {
    small: { rx: 2.4, ry: 1.6 },
    medium: { rx: 3, ry: 2 },
    large: { rx: 3.6, ry: 2.3 }
  };
  const { rx, ry } = sizeMap[size] || sizeMap.medium;
  const baseY = 34 + offsetY;

  function makeEye(cx) {
    const shapes = [];
    if (shape === 'narrow') {
      shapes.push(
        pathShape(`M${(cx - rx).toFixed(2)} ${baseY.toFixed(2)} Q${cx.toFixed(2)} ${(baseY - ry).toFixed(2)} ${(cx + rx).toFixed(2)} ${baseY.toFixed(2)} Q${cx.toFixed(2)} ${(baseY + ry - 1).toFixed(2)} ${(cx - rx).toFixed(2)} ${baseY.toFixed(2)}`, {
          fill: '#fff',
          'fill-opacity': 0.85
        })
      );
    } else if (shape === 'sharp') {
      shapes.push(
        pathShape(`M${(cx - rx).toFixed(2)} ${(baseY - 0.6).toFixed(2)} Q${cx.toFixed(2)} ${(baseY - ry).toFixed(2)} ${(cx + rx).toFixed(2)} ${(baseY - 0.6).toFixed(2)} L${(cx + rx).toFixed(2)} ${(baseY + 0.6).toFixed(2)} Q${cx.toFixed(2)} ${(baseY + ry).toFixed(2)} ${(cx - rx).toFixed(2)} ${(baseY + 0.6).toFixed(2)} Z`, {
          fill: '#fff',
          'fill-opacity': 0.88
        })
      );
    } else if (shape === 'beast') {
      shapes.push(
        pathShape(`M${(cx - rx).toFixed(2)} ${baseY.toFixed(2)} Q${cx.toFixed(2)} ${(baseY - ry).toFixed(2)} ${(cx + rx).toFixed(2)} ${baseY.toFixed(2)} Q${cx.toFixed(2)} ${(baseY + ry).toFixed(2)} ${(cx - rx).toFixed(2)} ${baseY.toFixed(2)}`, {
          fill: iris,
          'fill-opacity': 0.9
        })
      );
    } else {
      shapes.push(
        ellipseShape(cx, baseY, rx, ry, {
          fill: '#fff',
          'fill-opacity': 0.92
        })
      );
    }

    if (shape !== 'beast') {
      shapes.push(
        ellipseShape(cx, baseY, rx * 0.65, ry * 0.75, {
          fill: iris
        })
      );
      shapes.push(
        ellipseShape(cx, baseY, rx * 0.35, ry * 0.45, {
          fill: pupil
        })
      );
    } else {
      shapes.push(
        pathShape(`M${(cx - rx * 0.2).toFixed(2)} ${(baseY - ry).toFixed(2)} L${(cx + rx * 0.2).toFixed(2)} ${(baseY + ry).toFixed(2)} L${(cx - rx * 0.2).toFixed(2)} ${(baseY + ry).toFixed(2)} Z`, {
          fill: pupil
        })
      );
    }

    shapes.push(
      ellipseShape(cx - rx * 0.3, baseY - ry * 0.4, rx * 0.25, ry * 0.3, {
        fill: highlight,
        'fill-opacity': 0.6
      })
    );

    if (glow) {
      shapes.push(
        ellipseShape(cx, baseY, rx * 1.4, ry * 1.3, {
          fill: glow,
          'fill-opacity': 0.35
        })
      );
    }

    return shapes;
  }

  return [...makeEye(34), ...makeEye(46)];
}

function createBrowsSet(options = {}) {
  const { color = '#2c1a16', type = 'soft', weight = 1.6 } = options;
  if (type === 'none') return [];
  const browShapes = [];
  const y = type === 'fierce' ? 30 : 31;
  const offset = type === 'raised' ? -1.5 : type === 'fierce' ? -2 : 0;
  const curve = type === 'fierce' ? -2 : type === 'arched' ? -1 : -0.5;

  browShapes.push(
    pathShape(`M32 ${y} Q36 ${y + curve} 38 ${y + offset}`, {
      fill: 'none',
      stroke: color,
      'stroke-width': weight,
      'stroke-linecap': 'round'
    })
  );
  browShapes.push(
    pathShape(`M48 ${y} Q44 ${y + curve} 42 ${y + offset}`, {
      fill: 'none',
      stroke: color,
      'stroke-width': weight,
      'stroke-linecap': 'round'
    })
  );
  return browShapes;
}

function createMouthSet(options = {}, variant = 'human') {
  const { type = variant === 'beast' ? 'fangs' : 'calm', color = '#b96b5c', highlight = '#f3c2aa' } = options;
  const shapes = [];
  if (type === 'smile') {
    shapes.push(
      pathShape('M34 44 Q40 48 46 44', {
        fill: 'none',
        stroke: color,
        'stroke-width': 1.4,
        'stroke-linecap': 'round'
      })
    );
  } else if (type === 'stern') {
    shapes.push(
      pathShape('M35 44 L45 44', {
        fill: 'none',
        stroke: color,
        'stroke-width': 1.4,
        'stroke-linecap': 'round'
      })
    );
  } else if (type === 'open') {
    shapes.push(
      pathShape('M36 44 Q40 48 44 44 Q40 50 36 44 Z', {
        fill: color,
        stroke: color,
        'stroke-width': 1,
        'stroke-linejoin': 'round'
      })
    );
    shapes.push(
      pathShape('M38 46 Q40 47 42 46', {
        fill: 'none',
        stroke: highlight,
        'stroke-width': 0.8,
        'stroke-linecap': 'round'
      })
    );
  } else if (type === 'fangs') {
    shapes.push(
      pathShape('M34 44 Q40 48 46 44', {
        fill: 'none',
        stroke: color,
        'stroke-width': 1.2,
        'stroke-linecap': 'round'
      })
    );
    shapes.push(pathShape('M38 44 L39 46 L38 46 Z', { fill: '#f5f1f0' }));
    shapes.push(pathShape('M42 44 L41 46 L42 46 Z', { fill: '#f5f1f0' }));
  } else {
    shapes.push(
      pathShape('M34 44 Q40 46 46 44', {
        fill: 'none',
        stroke: color,
        'stroke-width': 1.2,
        'stroke-linecap': 'round'
      })
    );
  }
  return shapes;
}

function createExtrasLayers(extras = []) {
  const layers = { back: [], mid: [], front: [], top: [] };

  extras.forEach(extra => {
    if (!extra) return;
    const {
      type,
      color = '#d8b76f',
      secondary = '#f9f3d4',
      side = 'both',
      layer = 'front',
      accent
    } = extra;
    const target = layers[layer] || layers.front;

    switch (type) {
      case 'crown':
        target.push(
          pathShape('M28 24 L32 16 L36 24 L40 18 L44 24 L48 16 L52 24 L48 30 L32 30 Z', {
            fill: color,
            stroke: secondary,
            'stroke-width': 1.2,
            'stroke-linejoin': 'round'
          })
        );
        if (accent) {
          target.push(circleShape(40, 22, 2.2, { fill: accent, stroke: secondary, 'stroke-width': 0.8 }));
        }
        break;
      case 'tiara':
        target.push(
          pathShape('M30 26 Q40 18 50 26 L48 30 Q40 24 32 30 Z', {
            fill: color,
            stroke: secondary,
            'stroke-width': 1,
            'stroke-linejoin': 'round'
          })
        );
        if (accent) {
          target.push(circleShape(40, 24, 1.8, { fill: accent }));
        }
        break;
      case 'headband':
        target.push(
          pathShape('M28 28 Q40 24 52 28 L50 30 Q40 26 30 30 Z', {
            fill: color,
            stroke: secondary,
            'stroke-width': 0.8
          })
        );
        break;
      case 'goggles':
        target.push(
          pathShape('M30 26 Q40 22 50 26', {
            fill: 'none',
            stroke: color,
            'stroke-width': 3.2,
            'stroke-linecap': 'round'
          })
        );
        target.push(circleShape(34, 28, 4, { fill: secondary, stroke: color, 'stroke-width': 1.2, 'fill-opacity': 0.65 }));
        target.push(circleShape(46, 28, 4, { fill: secondary, stroke: color, 'stroke-width': 1.2, 'fill-opacity': 0.65 }));
        break;
      case 'mask-lower':
        target.push(
          pathShape('M32 40 Q40 46 48 40 L46 48 Q40 52 34 48 Z', {
            fill: color,
            stroke: secondary,
            'stroke-width': 1,
            'stroke-linejoin': 'round'
          })
        );
        break;
      case 'mask-full':
        target.push(
          pathShape('M30 30 Q40 24 50 30 L52 40 Q50 50 40 52 Q30 50 28 40 Z', {
            fill: color,
            stroke: secondary,
            'stroke-width': 1.3,
            'stroke-linejoin': 'round'
          })
        );
        break;
      case 'scar': {
        const scarPath = side === 'right'
          ? pathShape('M44 34 L48 42', { stroke: color, 'stroke-width': 1.1, 'stroke-linecap': 'round' })
          : pathShape('M36 34 L32 42', { stroke: color, 'stroke-width': 1.1, 'stroke-linecap': 'round' });
        target.push(scarPath);
        break;
      }
      case 'facepaint': {
        const paint = side === 'right'
          ? pathShape('M44 36 Q46 40 44 44', { stroke: color, 'stroke-width': 2.4, 'stroke-linecap': 'round' })
          : pathShape('M36 36 Q34 40 36 44', { stroke: color, 'stroke-width': 2.4, 'stroke-linecap': 'round' });
        target.push(paint);
        break;
      }
      case 'earring': {
        if (side === 'both' || side === 'left') {
          target.push(circleShape(30, 44, 1.8, { fill: color, stroke: secondary, 'stroke-width': 0.8 }));
        }
        if (side === 'both' || side === 'right') {
          target.push(circleShape(50, 44, 1.8, { fill: color, stroke: secondary, 'stroke-width': 0.8 }));
        }
        break;
      }
      case 'feather':
        if (side === 'right') {
          target.push(pathShape('M48 22 Q56 18 58 30 Q54 28 50 32 Z', { fill: color, stroke: secondary, 'stroke-width': 1 }));
        } else if (side === 'left') {
          target.push(pathShape('M32 22 Q24 18 22 30 Q26 28 30 32 Z', { fill: color, stroke: secondary, 'stroke-width': 1 }));
        } else {
          target.push(pathShape('M32 22 Q24 18 22 30 Q26 28 30 32 Z', { fill: color, stroke: secondary, 'stroke-width': 1 }));
          target.push(pathShape('M48 22 Q56 18 58 30 Q54 28 50 32 Z', { fill: color, stroke: secondary, 'stroke-width': 1 }));
        }
        break;
      case 'leaf-crown':
        target.push(pathShape('M28 26 Q32 20 36 26 Q40 20 44 26 Q48 20 52 26 L40 30 Z', {
          fill: color,
          stroke: secondary,
          'stroke-width': 1
        }));
        break;
      case 'leaf-cap':
        target.push(pathShape('M30 24 Q40 14 50 24 Q44 22 40 24 Q36 22 30 24 Z', {
          fill: color,
          stroke: secondary,
          'stroke-width': 1.1
        }));
        target.push(pathShape('M40 16 L40 22', { stroke: secondary, 'stroke-width': 1 }));
        break;
      case 'antlers':
        target.push(pathShape('M28 18 Q22 14 22 26 Q24 22 26 30 Q24 28 24 34', {
          fill: 'none',
          stroke: color,
          'stroke-width': 1.6,
          'stroke-linecap': 'round'
        }));
        target.push(pathShape('M52 18 Q58 14 58 26 Q56 22 54 30 Q56 28 56 34', {
          fill: 'none',
          stroke: color,
          'stroke-width': 1.6,
          'stroke-linecap': 'round'
        }));
        break;
      case 'horns':
        target.push(pathShape('M30 20 Q28 14 30 12 Q32 16 32 22 Z', { fill: color }));
        target.push(pathShape('M50 20 Q52 14 50 12 Q48 16 48 22 Z', { fill: color }));
        break;
      case 'halo':
        target.push(ellipseShape(40, 18, 18, 6, {
          fill: 'none',
          stroke: color,
          'stroke-width': 1.8,
          'stroke-opacity': 0.85
        }));
        break;
      case 'witch-hat':
        target.push(pathShape('M18 34 Q40 16 62 34 L40 26 Z', {
          fill: color,
          stroke: secondary,
          'stroke-width': 1.6,
          'stroke-linejoin': 'round'
        }));
        target.push(pathShape('M20 34 Q40 30 60 34 Q40 38 20 34 Z', {
          fill: secondary,
          'fill-opacity': 0.8
        }));
        break;
      case 'forehead-gem':
        target.push(circleShape(40, 30, 2.4, { fill: accent || secondary, stroke: color, 'stroke-width': 0.8 }));
        break;
      case 'beard':
        if (accent === 'long') {
          target.push(pathShape('M34 48 Q40 60 46 48 L46 58 Q40 66 34 58 Z', { fill: color, stroke: secondary, 'stroke-width': 1, 'stroke-linejoin': 'round' }));
        } else if (accent === 'medium') {
          target.push(pathShape('M34 48 Q40 56 46 48 L44 56 Q40 60 36 56 Z', { fill: color, stroke: secondary, 'stroke-width': 1, 'stroke-linejoin': 'round' }));
        } else if (accent === 'short') {
          target.push(pathShape('M36 46 Q40 50 44 46 L42 50 Q40 52 38 50 Z', { fill: color, stroke: secondary, 'stroke-width': 0.8 }));
        } else if (accent === 'goatee') {
          target.push(pathShape('M38 46 Q40 50 42 46 L41 52 Q40 54 39 52 Z', { fill: color, stroke: secondary, 'stroke-width': 0.8 }));
        }
        break;
      case 'third-eye':
        target.push(ellipseShape(40, 28, 2.2, 1.6, { fill: secondary, stroke: color, 'stroke-width': 1 }));
        target.push(circleShape(40, 28, 0.9, { fill: accent || '#1c0f1f' }));
        break;
      case 'bone-mask':
        target.push(pathShape('M30 32 Q40 26 50 32 L52 40 Q50 48 40 50 Q30 48 28 40 Z', {
          fill: color,
          stroke: secondary,
          'stroke-width': 1.4,
          'stroke-linejoin': 'round'
        }));
        target.push(pathShape('M34 36 L36 38 M44 36 L42 38', {
          stroke: secondary,
          'stroke-width': 1.2,
          'stroke-linecap': 'round'
        }));
        break;
      case 'spirit-flame':
        target.push(pathShape('M28 18 Q32 10 40 16 Q44 10 52 18 Q48 14 40 22 Q32 14 28 18 Z', {
          fill: color,
          'fill-opacity': 0.55
        }));
        break;
      case 'star-ornament':
        target.push(starShape(52, 26, 5, 4, 2, { fill: color, stroke: secondary, 'stroke-width': 1 }));
        break;
      case 'shell-crown':
        target.push(pathShape('M28 26 L34 20 L40 26 L46 20 L52 26 L40 30 Z', {
          fill: color,
          stroke: secondary,
          'stroke-width': 1.1,
          'stroke-linejoin': 'round'
        }));
        break;
      case 'monocle':
        target.push(circleShape(46, 34, 4, { fill: 'none', stroke: color, 'stroke-width': 1.3 }));
        target.push(pathShape('M50 30 Q54 24 54 20', { stroke: color, 'stroke-width': 1.1, 'stroke-linecap': 'round' }));
        break;
      case 'vines':
        target.push(pathShape('M28 44 Q24 36 30 30 Q36 24 32 20', {
          fill: 'none',
          stroke: color,
          'stroke-width': 1.2,
          'stroke-linecap': 'round'
        }));
        target.push(pathShape('M52 44 Q56 36 50 30 Q44 24 48 20', {
          fill: 'none',
          stroke: color,
          'stroke-width': 1.2,
          'stroke-linecap': 'round'
        }));
        break;
      default:
        break;
    }
  });

  return layers;
}

function buildPortrait(options = {}) {
  const {
    element,
    skinTone = '#f4d1ba',
    skinShadow = '#d79f82',
    hair = {},
    outfit = {},
    eyes = {},
    mouth = {},
    brows = {},
    face = {},
    extras = [],
    variant = 'human',
    background = {}
  } = options;

  const layers = {
    base: [],
    back: [],
    mid: [],
    features: [],
    front: [],
    top: []
  };

  const outfitBase = outfit.base || '#2f2533';
  const outfitTrim = outfit.trim || '#4a364f';
  const outfitSecondary = outfit.secondary || '#3d2d42';
  const outfitAccent = outfit.collar || '#d3a364';
  const outfitShadow = outfit.shadow || 'rgba(0,0,0,0.18)';

  if (background.split) {
    layers.base.push(
      pathShape('M8 16 C20 4 60 4 72 16 L72 56 C60 68 20 68 8 56 Z', {
        fill: background.split,
        opacity: 0.16
      })
    );
  }

  const shoulderPath = outfit.shape === 'high-collar'
    ? 'M20 62 Q40 48 60 62 L56 78 Q40 72 24 78 Z'
    : 'M18 62 Q40 50 62 62 L58 78 Q40 72 22 78 Z';

  layers.base.push(
    pathShape(shoulderPath, {
      fill: outfitBase,
      stroke: outfitTrim,
      'stroke-width': 1.6,
      'stroke-linejoin': 'round'
    })
  );

  if (outfitSecondary) {
    const secondaryPath = outfit.shape === 'high-collar'
      ? 'M26 60 Q40 52 54 60 L52 74 Q40 70 28 74 Z'
      : 'M28 60 Q40 52 52 60 L50 74 Q40 70 30 74 Z';
    layers.base.push(
      pathShape(secondaryPath, {
        fill: outfitSecondary,
        opacity: 0.9
      })
    );
  }

  if (outfitAccent) {
    const collarPath = outfit.shape === 'high-collar'
      ? 'M30 54 Q40 50 50 54 L48 64 Q40 60 32 64 Z'
      : 'M30 56 Q40 52 50 56 L48 66 Q40 62 32 66 Z';
    layers.base.push(
      pathShape(collarPath, {
        fill: outfitAccent,
        'fill-opacity': 0.85
      })
    );
  }

  if (outfit.emblem) {
    layers.base.push(
      pathShape('M38 64 L40 58 L42 64 L40 70 Z', {
        fill: outfit.emblem,
        'fill-opacity': 0.85
      })
    );
  }

  layers.base.push(
    pathShape('M30 64 Q40 60 50 64', {
      fill: 'none',
      stroke: outfitShadow,
      'stroke-width': 1.2,
      'stroke-linecap': 'round'
    })
  );

  const hairLayers = createHairLayers(hair.type, hair);
  layers.back.push(...hairLayers.back);

  const addEars = () => {
    const earColor = face.earColor || skinTone;
    if (face.ears === 'pointed') {
      layers.back.push(
        pathShape('M28 34 Q26 26 30 22 Q32 28 32 34 Z', {
          fill: earColor,
          stroke: skinShadow,
          'stroke-width': 1
        })
      );
      layers.back.push(
        pathShape('M52 34 Q54 26 50 22 Q48 28 48 34 Z', {
          fill: earColor,
          stroke: skinShadow,
          'stroke-width': 1
        })
      );
    } else if (face.ears === 'rounded') {
      layers.back.push(
        ellipseShape(29, 36, 3, 4, {
          fill: earColor,
          stroke: skinShadow,
          'stroke-width': 1
        })
      );
      layers.back.push(
        ellipseShape(51, 36, 3, 4, {
          fill: earColor,
          stroke: skinShadow,
          'stroke-width': 1
        })
      );
    }
  };

  if (variant === 'human') {
    addEars();
  }

  if (variant === 'beast') {
    layers.mid.push(
      pathShape('M26 36 Q32 16 40 16 Q48 16 54 36 Q56 46 54 56 Q48 62 40 62 Q32 62 26 56 Q24 46 26 36 Z', {
        fill: skinTone,
        stroke: skinShadow,
        'stroke-width': 1.6,
        'stroke-linejoin': 'round'
      })
    );
    layers.mid.push(
      pathShape('M36 44 Q40 52 44 44 L44 48 Q40 54 36 48 Z', {
        fill: skinShadow,
        'fill-opacity': 0.6
      })
    );
    layers.features.push(...createEyeSet({ ...eyes, shape: 'beast', size: eyes.size || 'medium' }, 'beast'));
    layers.features.push(pathShape('M34 40 Q40 48 46 40 Q44 48 40 50 Q36 48 34 40 Z', { fill: '#2b1616', 'fill-opacity': 0.9 }));
    layers.features.push(...createMouthSet({ type: mouth.type || 'fangs', color: mouth.color || '#311917' }, 'beast'));
  } else if (variant === 'spirit') {
    layers.mid.push(
      ellipseShape(40, face.cy || 34, face.rx || 11, face.ry || 13, {
        fill: skinTone,
        'fill-opacity': 0.65,
        stroke: skinShadow,
        'stroke-width': 1.4
      })
    );
    layers.features.push(...createEyeSet({ ...eyes, glow: eyes.glow || '#a98cff' }, 'spirit'));
    layers.features.push(...createBrowsSet({ color: eyes.glow || '#ccb7ff', type: brows.type || 'soft', weight: brows.weight || 1.2 }));
    layers.features.push(...createMouthSet({ type: mouth.type || 'calm', color: mouth.color || '#d7bfe8' }, 'spirit'));
  } else if (variant === 'construct') {
    layers.mid.push(
      pathShape('M30 30 Q40 20 50 30 L52 44 Q50 58 40 60 Q30 58 28 44 Z', {
        fill: skinTone,
        stroke: skinShadow,
        'stroke-width': 1.4,
        'stroke-linejoin': 'round'
      })
    );
    layers.features.push(...createEyeSet({ ...eyes, shape: eyes.shape || 'sharp', glow: eyes.glow || '#78e6ff' }, 'construct'));
    layers.features.push(pathShape('M32 40 L48 40', { stroke: skinShadow, 'stroke-width': 1.2 }));
    layers.features.push(...createMouthSet({ type: mouth.type || 'stern', color: mouth.color || '#7f8b9c' }, 'construct'));
  } else {
    addEars();
    const neckPath = 'M34 46 Q40 50 46 46 L46 60 Q40 66 34 60 Z';
    layers.mid.push(
      pathShape(neckPath, {
        fill: skinTone,
        stroke: skinShadow,
        'stroke-width': 1.2,
        'stroke-linejoin': 'round'
      })
    );
    layers.mid.push(
      ellipseShape(40, face.cy || 34, face.rx || 11, face.ry || 13, {
        fill: skinTone,
        stroke: skinShadow,
        'stroke-width': 1.4
      })
    );
    layers.mid.push(
      ellipseShape(44, (face.cy || 34) + 4, (face.rx || 11) * 0.5, (face.ry || 13) * 0.6, {
        fill: skinShadow,
        'fill-opacity': 0.22
      })
    );
    layers.features.push(...createEyeSet(eyes, 'human'));
    layers.features.push(...createBrowsSet({ color: brows.color || hair.brow || hair.color || '#2e1e16', type: brows.type || 'soft', weight: brows.weight || 1.6 }));
    layers.features.push(pathShape('M40 36 Q39 40 40 44', {
      fill: 'none',
      stroke: skinShadow,
      'stroke-width': 1,
      'stroke-linecap': 'round'
    }));
    layers.features.push(...createMouthSet(mouth, 'human'));
  }

  const extrasLayers = createExtrasLayers(extras);
  layers.back.push(...extrasLayers.back);
  layers.mid.push(...extrasLayers.mid);
  layers.features.push(...extrasLayers.front);
  layers.top.push(...extrasLayers.top);

  layers.front.push(...hairLayers.front);
  layers.top.push(...hairLayers.accessories);

  return [
    ...layers.base,
    ...layers.back,
    ...layers.mid,
    ...layers.features,
    ...layers.front,
    ...layers.top
  ];
}

const HERO_PORTRAIT_SETTINGS = {
  'ember-sovereign': {
    skinTone: '#f6cfb1',
    hair: { type: 'regal', color: '#92372e', highlight: '#ff8653', accent: '#f7d27a' },
    outfit: { base: '#401720', secondary: '#5d2029', collar: '#f5c974', trim: '#702a2d' },
    eyes: { iris: '#ffcf9a', pupil: '#4a1b15', shape: 'sharp' },
    brows: { color: '#72231d', type: 'arched' },
    mouth: { type: 'stern', color: '#b0554a' },
    extras: [
      { type: 'crown', color: '#f5c974', secondary: '#fff2c1', accent: '#ff7852' }
    ],
    background: { split: '#ffb17d' }
  },
  'drake-artillerist': {
    skinTone: '#f5cdb5',
    hair: { type: 'sidecut', color: '#992f2c', highlight: '#ff7b56', side: 'right' },
    outfit: { base: '#372027', secondary: '#472b33', collar: '#f4b170', trim: '#5b3438' },
    eyes: { iris: '#ffdcb5', pupil: '#3a1d14', shape: 'sharp' },
    brows: { color: '#722822', type: 'fierce' },
    mouth: { type: 'smile', color: '#b35f53' },
    extras: [
      { type: 'goggles', color: '#ffb26b', secondary: '#ffe9cf' }
    ],
    background: { split: '#ff9b6a' }
  },
  'radiant-vanguard': {
    skinTone: '#f2cbb3',
    hair: { type: 'helmet', color: '#6a4a3b', highlight: '#cfa97f', accent: '#b3925b' },
    outfit: { base: '#36262d', secondary: '#472f38', collar: '#d7a962', shape: 'high-collar' },
    eyes: { iris: '#f9e7c0', pupil: '#2b1a18', shape: 'narrow' },
    brows: { color: '#4f2e24', type: 'fierce' },
    mouth: { type: 'stern', color: '#a86855' },
    background: { split: '#f9c080' }
  },
  'cinder-ronin': {
    skinTone: '#f4c4a9',
    hair: { type: 'topknot', color: '#7d231e', highlight: '#ff6a4a' },
    outfit: { base: '#352124', secondary: '#4a2d2f', collar: '#f5a65b' },
    eyes: { iris: '#ffcfa6', pupil: '#3d1612', shape: 'sharp' },
    brows: { color: '#65201b', type: 'fierce' },
    mouth: { type: 'stern', color: '#ad5e52' },
    extras: [
      { type: 'mask-lower', color: '#5b2322', secondary: '#ff8b5a' },
      { type: 'scar', color: '#963d35', side: 'right' }
    ],
    background: { split: '#ff915d' }
  },
  'ash-bard': {
    skinTone: '#f5c8b6',
    hair: { type: 'long-curtain', color: '#a44d39', highlight: '#ff9870' },
    outfit: { base: '#3b222b', secondary: '#4c2c36', collar: '#f2a96d' },
    eyes: { iris: '#ffd6b2', pupil: '#381b14', shape: 'soft' },
    brows: { color: '#7c3527', type: 'soft' },
    mouth: { type: 'smile', color: '#b86c5a' },
    extras: [
      { type: 'earring', color: '#ffd8a5', secondary: '#fff2db', side: 'both' }
    ],
    background: { split: '#ffb282' }
  },
  'lava-herder': {
    skinTone: '#f2c09f',
    hair: { type: 'ponytail', color: '#7a2f1d', highlight: '#ff8a58', accent: '#d8572f' },
    outfit: { base: '#3a1f1f', secondary: '#4f2a23', collar: '#d58b44', shadow: 'rgba(46,16,16,0.35)' },
    eyes: { iris: '#ffbd7d', pupil: '#3b1a12', shape: 'sharp' },
    brows: { color: '#6a2c1f', type: 'fierce' },
    mouth: { type: 'stern', color: '#b76842' },
    extras: [
      { type: 'beard', color: '#62301e', secondary: '#9a5b3f', accent: 'medium' }
    ],
    background: { split: '#ff9c63' }
  },
  'crimson-duelist': {
    skinTone: '#f4c3b0',
    hair: { type: 'long-right', color: '#a83b37', highlight: '#ff8d6d' },
    outfit: { base: '#3b2028', secondary: '#4a2731', collar: '#f4a26d' },
    eyes: { iris: '#ffd7bb', pupil: '#371513', shape: 'sharp' },
    brows: { color: '#782925', type: 'arched' },
    mouth: { type: 'smile', color: '#b86356' },
    extras: [
      { type: 'feather', side: 'right', color: '#ffd1a0', secondary: '#fffcf0' }
    ],
    background: { split: '#ffa577' }
  },
  'magmabreaker': {
    skinTone: '#f1b99c',
    hair: { type: 'shaved', color: '#7f3c2c', highlight: '#d36940' },
    outfit: { base: '#331f1f', secondary: '#432625', collar: '#d07c3e', shape: 'high-collar' },
    eyes: { iris: '#ffc691', pupil: '#371911', shape: 'narrow' },
    brows: { color: '#5c291f', type: 'fierce' },
    mouth: { type: 'stern', color: '#b06143' },
    extras: [
      { type: 'headband', color: '#c9653a', secondary: '#ffd19c' },
      { type: 'scar', color: '#9c3f34', side: 'left' }
    ],
    background: { split: '#ff955c' }
  },
  'pyrolumen': {
    skinTone: '#f6c7b4',
    hair: { type: 'regal', color: '#b53d3b', highlight: '#ff9f6c', accent: '#f9d07c' },
    outfit: { base: '#41232c', secondary: '#542f38', collar: '#f3a26f' },
    eyes: { iris: '#ffe6c2', pupil: '#3c1814', shape: 'soft', glow: '#ffb07f' },
    brows: { color: '#8b332f', type: 'arched' },
    mouth: { type: 'smile', color: '#ba6a58' },
    extras: [
      { type: 'forehead-gem', color: '#ffb97a', secondary: '#fff4d2', accent: '#ff7aa5' }
    ],
    background: { split: '#ffb985' }
  },
  'meteor-dancer': {
    skinTone: '#f6c2b0',
    hair: { type: 'twin-tail', color: '#cf5f5a', highlight: '#ffad7b' },
    outfit: { base: '#362230', secondary: '#452b3a', collar: '#f3a76d' },
    eyes: { iris: '#ffe4c4', pupil: '#371812', shape: 'soft' },
    brows: { color: '#8c3d35', type: 'soft' },
    mouth: { type: 'smile', color: '#be6d5a' },
    extras: [
      { type: 'star-ornament', color: '#ffd37a', secondary: '#fff1ce' }
    ],
    background: { split: '#ffb07e' }
  },
  'tide-matriarch': {
    skinTone: '#e7c6bb',
    hair: { type: 'long-curtain', color: '#2e5a7a', highlight: '#66b7ff' },
    outfit: { base: '#173247', secondary: '#224a63', collar: '#7ed0ff', trim: '#1e3a4d' },
    eyes: { iris: '#b8f0ff', pupil: '#1b2430', shape: 'soft', glow: '#7bd4ff' },
    brows: { color: '#214f6a', type: 'arched' },
    mouth: { type: 'calm', color: '#a0736c' },
    extras: [
      { type: 'shell-crown', color: '#a7e4ff', secondary: '#f0fbff' }
    ],
    background: { split: '#71ccff' }
  },
  'frost-oracle': {
    skinTone: '#e6d4cc',
    hair: { type: 'hood', color: '#234b68', highlight: '#6fb7ff' },
    outfit: { base: '#143045', secondary: '#1f3d55', collar: '#7fbef8', shape: 'high-collar' },
    eyes: { iris: '#dff4ff', pupil: '#1d2836', shape: 'sharp', glow: '#94d6ff' },
    brows: { color: '#2c5674', type: 'fierce' },
    mouth: { type: 'stern', color: '#8f6a64' },
    extras: [
      { type: 'forehead-gem', color: '#76d2ff', secondary: '#ffffff' }
    ],
    background: { split: '#68bff5' }
  },
  'azure-medic': {
    skinTone: '#e9d1c6',
    hair: { type: 'short-spiky', color: '#2f6b89', highlight: '#6ac4ff' },
    outfit: { base: '#1c394b', secondary: '#244b63', collar: '#7ad9ff' },
    eyes: { iris: '#d3f5ff', pupil: '#1e2732', shape: 'soft' },
    brows: { color: '#28586c', type: 'soft' },
    mouth: { type: 'smile', color: '#9b6d62' },
    extras: [
      { type: 'headband', color: '#7be0ff', secondary: '#eefaff' }
    ],
    background: { split: '#63c8ff' }
  },
  'abyss-scout': {
    skinTone: '#e5cfc2',
    hair: { type: 'windswept', color: '#264a6a', highlight: '#5faef0' },
    outfit: { base: '#172f43', secondary: '#223c52', collar: '#63b3ff' },
    eyes: { iris: '#c7ecff', pupil: '#1b2836', shape: 'sharp' },
    brows: { color: '#1d4b6a', type: 'fierce' },
    mouth: { type: 'smile', color: '#8f6a5f' },
    extras: [
      { type: 'goggles', color: '#5fb8ff', secondary: '#e1f5ff' }
    ],
    background: { split: '#68b4ff' }
  },
  'iceblade-assassin': {
    skinTone: '#e3cbc0',
    hair: { type: 'hood', color: '#1b3a52', highlight: '#5ea0cf' },
    outfit: { base: '#162c3f', secondary: '#21394f', collar: '#6cb6ff' },
    eyes: { iris: '#dcf5ff', pupil: '#182230', shape: 'sharp', glow: '#88d7ff' },
    brows: { color: '#26465b', type: 'fierce' },
    mouth: { type: 'stern', color: '#7f5f58' },
    extras: [
      { type: 'mask-lower', color: '#234a6a', secondary: '#7ec7ff' }
    ],
    background: { split: '#6db8ff' }
  },
  'tidal-minstrel': {
    skinTone: '#e8d1c4',
    hair: { type: 'braided', color: '#2d5774', highlight: '#74c2ff' },
    outfit: { base: '#1a3245', secondary: '#264357', collar: '#7dd4ff' },
    eyes: { iris: '#cfefff', pupil: '#1c2834', shape: 'soft' },
    brows: { color: '#2f5570', type: 'arched' },
    mouth: { type: 'smile', color: '#9c7268' },
    extras: [
      { type: 'earring', color: '#cdeeff', secondary: '#ffffff', side: 'both' }
    ],
    background: { split: '#6cc8ff' }
  },
  'star-navigator': {
    skinTone: '#ead6ca',
    hair: { type: 'ponytail', color: '#275d84', highlight: '#69c9ff', accent: '#9de2ff' },
    outfit: { base: '#182f45', secondary: '#23425a', collar: '#86dcff' },
    eyes: { iris: '#d8f3ff', pupil: '#1e2833', shape: 'soft' },
    brows: { color: '#2f5672', type: 'soft' },
    mouth: { type: 'smile', color: '#9c7166' },
    extras: [
      { type: 'goggles', color: '#7cd8ff', secondary: '#f1fbff' }
    ],
    background: { split: '#6fcfff' }
  },
  'glacier-magus': {
    skinTone: '#e8d7cc',
    hair: { type: 'hood', color: '#2a4f6a', highlight: '#6ab1df' },
    outfit: { base: '#163043', secondary: '#213c52', collar: '#76b9f7', shape: 'high-collar' },
    eyes: { iris: '#e9faff', pupil: '#1d2832', shape: 'soft' },
    brows: { color: '#f1f8ff', type: 'arched' },
    mouth: { type: 'calm', color: '#8e6f63' },
    extras: [
      { type: 'beard', color: '#dfe9f9', secondary: '#9ab6cf', accent: 'long' }
    ],
    background: { split: '#72c4ff' }
  },
  'abyss-warden': {
    skinTone: '#e2c9bd',
    hair: { type: 'helmet', color: '#2b455a', highlight: '#6cb0df', accent: '#90d8ff' },
    outfit: { base: '#142c3d', secondary: '#1f3b4e', collar: '#6fb5e9', shape: 'high-collar' },
    eyes: { iris: '#d6f3ff', pupil: '#1e2731', shape: 'narrow' },
    brows: { color: '#294055', type: 'fierce' },
    mouth: { type: 'stern', color: '#8c6e63' },
    background: { split: '#68b2ec' }
  },
  'stormcaller': {
    skinTone: '#e9d4c7',
    hair: { type: 'windswept', color: '#2c638b', highlight: '#77d6ff' },
    outfit: { base: '#1a3449', secondary: '#25435a', collar: '#7bd4ff' },
    eyes: { iris: '#dff6ff', pupil: '#1f2933', shape: 'soft', glow: '#7fd8ff' },
    brows: { color: '#2a5875', type: 'arched' },
    mouth: { type: 'smile', color: '#8d6e63' },
    extras: [
      { type: 'halo', color: '#84e4ff' }
    ],
    background: { split: '#6bd6ff' }
  },
  'verdant-sage': {
    skinTone: '#e9cdb2',
    hair: { type: 'long-curtain', color: '#2f6b3b', highlight: '#70d98c' },
    outfit: { base: '#1e3924', secondary: '#28482d', collar: '#7fd68d' },
    eyes: { iris: '#d6f5db', pupil: '#1b2d1e', shape: 'soft' },
    brows: { color: '#2f5a39', type: 'arched' },
    mouth: { type: 'smile', color: '#946a54' },
    extras: [
      { type: 'leaf-crown', color: '#7fd68d', secondary: '#dff6df' }
    ],
    background: { split: '#7edb9e' }
  },
  'vine-rogue': {
    skinTone: '#e3c7ab',
    hair: { type: 'hood', color: '#2a5234', highlight: '#6ecf82' },
    outfit: { base: '#1b3221', secondary: '#25402d', collar: '#73d382' },
    eyes: { iris: '#c9f5d2', pupil: '#1a2b1e', shape: 'sharp' },
    brows: { color: '#234c31', type: 'fierce' },
    mouth: { type: 'stern', color: '#8c624d' },
    extras: [
      { type: 'mask-lower', color: '#23492f', secondary: '#8fe8a1' }
    ],
    background: { split: '#75d48f' }
  },
  'grove-champion': {
    skinTone: '#5b3b23',
    skinShadow: '#3a2416',
    hair: { type: 'mane', color: '#714d2d', highlight: '#b78447' },
    outfit: { base: '#2a1c13', secondary: '#3b2719', collar: '#c78a41' },
    eyes: { iris: '#f3d27c', pupil: '#1c1009', shape: 'beast' },
    mouth: { type: 'fangs', color: '#2d1a14' },
    variant: 'beast',
    extras: [
      { type: 'horns', color: '#d9b37c' }
    ],
    background: { split: '#74c985' }
  },
  'emerald-warden': {
    skinTone: '#e9c9ae',
    hair: { type: 'braided', color: '#356b41', highlight: '#79d58c' },
    outfit: { base: '#203b26', secondary: '#2b4b30', collar: '#74d38a' },
    eyes: { iris: '#d5f7d6', pupil: '#1a2c1d', shape: 'sharp' },
    brows: { color: '#2d5033', type: 'arched' },
    mouth: { type: 'stern', color: '#8f6d58' },
    extras: [
      { type: 'feather', side: 'left', color: '#f4f1ce', secondary: '#7adf9f' }
    ],
    background: { split: '#6fd48a' }
  },
  'sprout-traveler': {
    skinTone: '#f3d1b5',
    hair: { type: 'short-spiky', color: '#4f8b42', highlight: '#8ce087' },
    outfit: { base: '#1f3924', secondary: '#2c4a2f', collar: '#81d78b' },
    eyes: { iris: '#dfffe3', pupil: '#192c1c', shape: 'soft' },
    brows: { color: '#3e6d3c', type: 'soft' },
    mouth: { type: 'smile', color: '#a67861' },
    extras: [
      { type: 'leaf-cap', color: '#74d682', secondary: '#e0ffd9' }
    ],
    background: { split: '#7fdd9d' }
  },
  'sky-ranger': {
    skinTone: '#f1ceb6',
    hair: { type: 'windswept', color: '#3a7b58', highlight: '#7fe0a5' },
    outfit: { base: '#1f3828', secondary: '#294c34', collar: '#78d39b' },
    eyes: { iris: '#d3f8e3', pupil: '#182b1d', shape: 'sharp' },
    brows: { color: '#325f45', type: 'fierce' },
    mouth: { type: 'smile', color: '#9b705a' },
    extras: [
      { type: 'goggles', color: '#8be3bb', secondary: '#e8fff1' }
    ],
    background: { split: '#74d7a0' }
  },
  'oracle-of-vines': {
    skinTone: '#edd0b6',
    hair: { type: 'long-curtain', color: '#2f6d4a', highlight: '#72d39a' },
    outfit: { base: '#233d2a', secondary: '#2f5038', collar: '#7dd9a0' },
    eyes: { iris: '#e4fbea', pupil: '#1a2f1f', shape: 'soft' },
    brows: { color: '#316347', type: 'arched' },
    mouth: { type: 'calm', color: '#9b735e' },
    extras: [
      { type: 'vines', color: '#83e6a9' },
      { type: 'forehead-gem', color: '#8bf0c0', secondary: '#f2fff8' }
    ],
    background: { split: '#70d7a2' }
  },
  'forest-guardian': {
    skinTone: '#e3c4a3',
    hair: { type: 'mane', color: '#3a5f38', highlight: '#72c07a' },
    outfit: { base: '#1c2f21', secondary: '#273e2b', collar: '#6ec983' },
    eyes: { iris: '#d5f2d8', pupil: '#1a2b1e', shape: 'sharp' },
    brows: { color: '#2a4d32', type: 'fierce' },
    mouth: { type: 'stern', color: '#896951' },
    extras: [
      { type: 'antlers', color: '#d2b58b' }
    ],
    background: { split: '#6dd294' }
  },
  'wild-drummer': {
    skinTone: '#e4bfa0',
    hair: { type: 'mane', color: '#4b6d36', highlight: '#92df7f' },
    outfit: { base: '#233722', secondary: '#2e452c', collar: '#7fd480' },
    eyes: { iris: '#e7f9df', pupil: '#1b291d', shape: 'soft' },
    brows: { color: '#3a5830', type: 'soft' },
    mouth: { type: 'smile', color: '#956e55' },
    extras: [
      { type: 'facepaint', color: '#ff934f', side: 'left' },
      { type: 'facepaint', color: '#ffd25e', side: 'right' }
    ],
    background: { split: '#79d892' }
  },
  'shadow-huntress': {
    skinTone: '#e7c5ab',
    hair: { type: 'hood', color: '#234733', highlight: '#64cc94' },
    outfit: { base: '#16271d', secondary: '#213327', collar: '#6bce93' },
    eyes: { iris: '#cff5de', pupil: '#1a2a1f', shape: 'sharp' },
    brows: { color: '#1e4030', type: 'fierce' },
    mouth: { type: 'stern', color: '#876953' },
    extras: [
      { type: 'mask-lower', color: '#1f3e2d', secondary: '#7adfa6' }
    ],
    background: { split: '#6ad48d' }
  },
  'dawn-empress': {
    skinTone: '#f5d7bf',
    hair: { type: 'regal', color: '#c67a3d', highlight: '#ffdf9a', accent: '#ffeec5' },
    outfit: { base: '#3a2b1e', secondary: '#4e3825', collar: '#ffd77b', trim: '#6a4c2c', shape: 'high-collar' },
    eyes: { iris: '#ffe9c2', pupil: '#2e2118', shape: 'soft', glow: '#ffd480' },
    brows: { color: '#8a502d', type: 'arched' },
    mouth: { type: 'smile', color: '#b67a5c' },
    extras: [
      { type: 'crown', color: '#ffd77b', secondary: '#fff4c5', accent: '#ff9a5a' }
    ],
    background: { split: '#ffd58f' }
  },
  'judicator-vyss': {
    skinTone: '#f4d9bd',
    hair: { type: 'hood', color: '#7b5a28', highlight: '#f5db8a' },
    outfit: { base: '#352a1c', secondary: '#45341f', collar: '#f1c864', shape: 'high-collar' },
    eyes: { iris: '#ffe5b6', pupil: '#2b2115', shape: 'sharp' },
    brows: { color: '#684722', type: 'fierce' },
    mouth: { type: 'stern', color: '#a67858' },
    extras: [
      { type: 'mask-lower', color: '#3f301f', secondary: '#f6d685' }
    ],
    background: { split: '#ffcf84' }
  },
  'radiant-priest': {
    skinTone: '#f6dabb',
    hair: { type: 'hood', color: '#c8a05a', highlight: '#ffe9ad' },
    outfit: { base: '#3a2c1f', secondary: '#4a3824', collar: '#f3d07a' },
    eyes: { iris: '#fff1c8', pupil: '#2e2317', shape: 'soft', glow: '#ffe69a' },
    brows: { color: '#7d5a31', type: 'arched' },
    mouth: { type: 'smile', color: '#ba8665' },
    extras: [
      { type: 'halo', color: '#ffe9a8' }
    ],
    background: { split: '#ffe19a' }
  },
  'lumina-blade': {
    skinTone: '#f3d1b5',
    hair: { type: 'short-spiky', color: '#f6c25e', highlight: '#fff1c0' },
    outfit: { base: '#2f2519', secondary: '#3f301f', collar: '#f0c66d' },
    eyes: { iris: '#ffe5b7', pupil: '#2a1e15', shape: 'sharp' },
    brows: { color: '#a9682f', type: 'fierce' },
    mouth: { type: 'stern', color: '#af7455' },
    extras: [
      { type: 'scar', color: '#c98057', side: 'left' }
    ],
    background: { split: '#ffd289' }
  },
  'celestial-tactician': {
    skinTone: '#f4d2b8',
    hair: { type: 'topknot', color: '#c08444', highlight: '#ffd796', accent: '#f0c46a' },
    outfit: { base: '#2f2419', secondary: '#3c2f1f', collar: '#f2c46d' },
    eyes: { iris: '#ffecc3', pupil: '#2a1f16', shape: 'soft' },
    brows: { color: '#a46a33', type: 'arched' },
    mouth: { type: 'smile', color: '#b47b58' },
    extras: [
      { type: 'monocle', color: '#f6d589' }
    ],
    background: { split: '#ffd58b' }
  },
  'halo-savant': {
    skinTone: '#f7dbbf',
    hair: { type: 'long-left', color: '#dbad63', highlight: '#ffe7af' },
    outfit: { base: '#322518', secondary: '#402f1c', collar: '#f5d27f' },
    eyes: { iris: '#fff2c7', pupil: '#2a1e16', shape: 'soft', glow: '#ffeaa5' },
    brows: { color: '#b67d41', type: 'soft' },
    mouth: { type: 'smile', color: '#b57e5b' },
    extras: [
      { type: 'halo', color: '#ffeab5' }
    ],
    background: { split: '#ffe5a0' }
  },
  'aegis-dion': {
    skinTone: '#f2cfb3',
    hair: { type: 'helmet', color: '#b99a60', highlight: '#ffe6b4', accent: '#e2c178' },
    outfit: { base: '#2f241a', secondary: '#3b2d1e', collar: '#f1ca73', shape: 'high-collar' },
    eyes: { iris: '#ffe6b3', pupil: '#2a1d15', shape: 'narrow' },
    brows: { color: '#946635', type: 'fierce' },
    mouth: { type: 'stern', color: '#ab7a56' },
    background: { split: '#ffd189' }
  },
  'domain-neira': {
    skinTone: '#f6d8bf',
    hair: { type: 'long-right', color: '#dca962', highlight: '#ffe5b1' },
    outfit: { base: '#34261a', secondary: '#432e1f', collar: '#f3ca7a' },
    eyes: { iris: '#fff0c9', pupil: '#2b1e16', shape: 'soft' },
    brows: { color: '#b78045', type: 'arched' },
    mouth: { type: 'smile', color: '#b9815e' },
    extras: [
      { type: 'forehead-gem', color: '#ffe9b9', secondary: '#fff6db' }
    ],
    background: { split: '#ffd593' }
  },
  'pulse-healer': {
    skinTone: '#f6d7c1',
    hair: { type: 'short-spiky', color: '#d7a260', highlight: '#ffe5b2' },
    outfit: { base: '#33251b', secondary: '#412e1f', collar: '#f5cd82' },
    eyes: { iris: '#ffecc6', pupil: '#2a1f16', shape: 'soft' },
    brows: { color: '#a87342', type: 'soft' },
    mouth: { type: 'smile', color: '#b88663' },
    extras: [
      { type: 'headband', color: '#ffe3a4', secondary: '#fff6d5' }
    ],
    background: { split: '#ffe0a0' }
  },
  'silver-envoy': {
    skinTone: '#f5d6bd',
    hair: { type: 'ponytail', color: '#cda35d', highlight: '#ffe8b8', accent: '#fff6dc' },
    outfit: { base: '#2f231a', secondary: '#3c2b1e', collar: '#f3cb7c' },
    eyes: { iris: '#ffeecc', pupil: '#2a1d15', shape: 'soft' },
    brows: { color: '#ad7a3e', type: 'arched' },
    mouth: { type: 'smile', color: '#b88562' },
    extras: [
      { type: 'feather', side: 'right', color: '#fff2d8', secondary: '#fceab0' }
    ],
    background: { split: '#ffdca0' }
  },
  'noctis-witch': {
    skinTone: '#e2c4d5',
    hair: { type: 'long-curtain', color: '#4a2d63', highlight: '#a37ce0' },
    outfit: { base: '#1f1230', secondary: '#2b1a3b', collar: '#8f6be0' },
    eyes: { iris: '#e6d4ff', pupil: '#1a1224', shape: 'soft', glow: '#b8a0ff' },
    brows: { color: '#6c4b92', type: 'arched' },
    mouth: { type: 'smile', color: '#a66f94' },
    extras: [
      { type: 'witch-hat', color: '#2f1843', secondary: '#a17ae3' }
    ],
    background: { split: '#b89cff' }
  },
  'void-hunter': {
    skinTone: '#35304b',
    skinShadow: '#1a1329',
    hair: { type: 'hood', color: '#2f1d4a', highlight: '#7a58bf' },
    outfit: { base: '#1a1129', secondary: '#261936', collar: '#7a59d0', shape: 'high-collar' },
    eyes: { iris: '#ccbfff', pupil: '#1b0e33', shape: 'sharp', glow: '#9a87ff' },
    brows: { type: 'none' },
    mouth: { type: 'stern', color: '#6c5cae' },
    extras: [
      { type: 'mask-full', color: '#3c2b63', secondary: '#a991ff' }
    ],
    variant: 'construct',
    background: { split: '#b29cff' }
  },
  'shadow-walker': {
    skinTone: '#dcbfcf',
    hair: { type: 'hood', color: '#2c1e3e', highlight: '#6c4aa1' },
    outfit: { base: '#1b1028', secondary: '#261836', collar: '#7a5dc9' },
    eyes: { iris: '#e7d1ff', pupil: '#180f24', shape: 'sharp', glow: '#a48cff' },
    brows: { color: '#6d4a9f', type: 'fierce' },
    mouth: { type: 'stern', color: '#936a8f' },
    extras: [
      { type: 'mask-lower', color: '#271835', secondary: '#8b6cd8' }
    ],
    background: { split: '#b79dff' }
  },
  'gloom-keeper': {
    skinTone: '#e2c6d7',
    hair: { type: 'hood', color: '#3a2451', highlight: '#8462c9' },
    outfit: { base: '#1f142c', secondary: '#2d1d3a', collar: '#8b68d2' },
    eyes: { iris: '#e9d5ff', pupil: '#180f23', shape: 'soft' },
    brows: { color: '#7c58b4', type: 'arched' },
    mouth: { type: 'calm', color: '#a77ca7' },
    extras: [
      { type: 'forehead-gem', color: '#c8a8ff', secondary: '#f0e5ff' }
    ],
    background: { split: '#bfa4ff' }
  },
  'river-shaman': {
    skinTone: '#d9bfc9',
    hair: { type: 'mane', color: '#46355a', highlight: '#8c72c7' },
    outfit: { base: '#22142b', secondary: '#2e1c36', collar: '#8159b6' },
    eyes: { iris: '#f1e1ff', pupil: '#1a1125', shape: 'soft' },
    brows: { color: '#6b4a91', type: 'arched' },
    mouth: { type: 'calm', color: '#a378a1' },
    extras: [
      { type: 'bone-mask', color: '#d8c3b5', secondary: '#8f6b52' }
    ],
    background: { split: '#b99cff' }
  },
  'fallen-strategist': {
    skinTone: '#e4c5d4',
    hair: { type: 'topknot', color: '#4a2a4f', highlight: '#9a62c1', accent: '#6f3f8a' },
    outfit: { base: '#1f1327', secondary: '#2d1a34', collar: '#8053b4' },
    eyes: { iris: '#e1caff', pupil: '#1a0f26', shape: 'sharp' },
    brows: { color: '#5b2d6f', type: 'arched' },
    mouth: { type: 'smile', color: '#a8709f' },
    extras: [
      { type: 'beard', color: '#3a1d40', secondary: '#785098', accent: 'goatee' }
    ],
    background: { split: '#b490ff' }
  },
  'abyssal-seer': {
    skinTone: '#e3c7da',
    hair: { type: 'hood', color: '#35214d', highlight: '#7a57b8' },
    outfit: { base: '#1d112a', secondary: '#291634', collar: '#8d65d0' },
    eyes: { iris: '#edd7ff', pupil: '#180f24', shape: 'soft', glow: '#bca0ff' },
    brows: { color: '#6f48a3', type: 'arched' },
    mouth: { type: 'calm', color: '#a87cae' },
    extras: [
      { type: 'third-eye', color: '#b090ff', secondary: '#f0eaff', accent: '#492d7a' }
    ],
    background: { split: '#b99dff' }
  },
  'shadow-wraith': {
    skinTone: '#bfa5ff',
    skinShadow: '#6b4fd0',
    hair: { type: 'mane', color: '#3b2370', highlight: '#8a6bff' },
    outfit: { base: '#1b1030', secondary: '#28163c', collar: '#8c6ade' },
    eyes: { iris: '#ede3ff', pupil: '#150c26', shape: 'soft', glow: '#cbb7ff' },
    brows: { type: 'none' },
    mouth: { type: 'calm', color: '#d8caff' },
    variant: 'spirit',
    extras: [
      { type: 'spirit-flame', color: '#9f83ff' },
      { type: 'horns', color: '#cbb2ff' }
    ],
    background: { split: '#bfa8ff' }
  },
  'dusk-swordmaster': {
    skinTone: '#e4c1d0',
    hair: { type: 'long-right', color: '#6d3d7f', highlight: '#b07ad8' },
    outfit: { base: '#201528', secondary: '#2c1d35', collar: '#8856c1' },
    eyes: { iris: '#f1dcff', pupil: '#170f25', shape: 'sharp' },
    brows: { color: '#5d2c72', type: 'fierce' },
    mouth: { type: 'stern', color: '#9d6d94' },
    extras: [
      { type: 'scar', color: '#c68ba5', side: 'left' }
    ],
    background: { split: '#b395ff' }
  },
  'obsidian-bard': {
    skinTone: '#e6c5d8',
    hair: { type: 'long-curtain', color: '#51366d', highlight: '#9a75d7' },
    outfit: { base: '#21132f', secondary: '#2d1c3c', collar: '#8360c9' },
    eyes: { iris: '#ead7ff', pupil: '#170f23', shape: 'soft' },
    brows: { color: '#6c4a93', type: 'arched' },
    mouth: { type: 'smile', color: '#a877aa' },
    extras: [
      { type: 'earring', color: '#d7c1ff', secondary: '#f2eaff', side: 'left' }
    ],
    background: { split: '#b89cff' }
  }
};

function createHeroIcon(id, element, shapes) {
  const palette = ELEMENT_PALETTES[element];
  const safeId = sanitizeId(id);
  const gradId = `hero-${safeId}-grad`;
  const glowId = `hero-${safeId}-glow`;
  const frameId = `hero-${safeId}-frame`;
  const clipId = `hero-${safeId}-clip`;
  const sheenId = `hero-${safeId}-sheen`;
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
    <linearGradient id="${frameId}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${palette.detail}" stop-opacity="0.9" />
      <stop offset="45%" stop-color="${palette.bright}" stop-opacity="0.7" />
      <stop offset="100%" stop-color="${palette.deep}" stop-opacity="0.85" />
    </linearGradient>
    <linearGradient id="${sheenId}" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${palette.highlight}" stop-opacity="0.4" />
      <stop offset="60%" stop-color="${palette.aura}" stop-opacity="0" />
    </linearGradient>
    <clipPath id="${clipId}">
      <rect x="6" y="6" width="68" height="68" rx="16" />
    </clipPath>
  </defs>
  <rect x="1.5" y="1.5" width="77" height="77" rx="20" fill="${palette.deep}" stroke="${palette.stroke}" stroke-width="1.6" opacity="0.85" />
  <rect x="4" y="4" width="72" height="72" rx="19" fill="url(#${frameId})" opacity="0.95" />
  <rect x="6" y="6" width="68" height="68" rx="16" fill="url(#${gradId})" stroke="${palette.detail}" stroke-width="0.4" />
  <g clip-path="url(#${clipId})">
    <path d="M6 26 C16 12 64 12 74 26 L74 32 C64 20 16 20 6 32 Z" fill="${palette.highlight}" fill-opacity="0.16" />
    <circle cx="40" cy="38" r="30" fill="url(#${glowId})" opacity="0.75" />
    <path d="M6 54 C18 66 62 66 74 54" fill="none" stroke="url(#${sheenId})" stroke-width="3" stroke-linecap="round" opacity="0.4" />
    <g>${shapes.join('\n      ')}</g>
  </g>
  <rect x="6" y="6" width="68" height="68" rx="16" fill="none" stroke="${palette.stroke}" stroke-width="0.8" opacity="0.55" />
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

heroArtConfig.forEach(entry => {
  const portrait = HERO_PORTRAIT_SETTINGS[entry.id];
  if (portrait) {
    entry.heroShapes = buildPortrait({ element: entry.element, ...portrait });
  }
});

export const HERO_ART = heroArtConfig.reduce((acc, entry) => {
  acc[entry.id] = {
    hero: createHeroIcon(entry.id, entry.element, entry.heroShapes),
    skill: createSkillIcon(entry.id, entry.element, entry.skillShapes)
  };
  return acc;
}, {});

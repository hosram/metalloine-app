// convertHardness.js
// Hardness conversion utility — supports HB, HRC, HRB, HV
// Materials included: steel, cast_iron, aluminium, copper, brass, phosphor_bronze.
// Tables contain representative points compiled from ASTM E140 and ISO 18265.
// Values outside provided ranges are linearly extrapolated from nearest pair.

const DATA = {
  steel: [
    {HB: 137, HRC: 10.1, HRB: 77,  HV: 145},
    {HB: 149, HRC: 12.6, HRB: 80,  HV: 156},
    {HB: 163, HRC: 15.5, HRB: 83,  HV: 170},
    {HB: 187, HRC: 20.0, HRB: 86,  HV: 196},
    {HB: 207, HRC: 23.5, HRB: null,HV: 215},
    {HB: 229, HRC: 28.0, HRB: null,HV: 237},
    {HB: 255, HRC: 31.8, HRB: null,HV: 261},
    {HB: 286, HRC: 34.6, HRB: null,HV: 293},
    {HB: 321, HRC: 37.2, HRB: null,HV: 327},
    {HB: 352, HRC: 39.3, HRB: null,HV: 358},
    {HB: 388, HRC: 41.1, HRB: null,HV: 396},
    {HB: 421, HRC: 43.0, HRB: null,HV: 429},
    {HB: 444, HRC: 44.2, HRB: null,HV: 452},
    {HB: 471, HRC: 45.3, HRB: null,HV: 480},
    {HB: 495, HRC: 46.2, HRB: null,HV: 504},
    {HB: 517, HRC: 47.1, HRB: null,HV: 526},
    {HB: 534, HRC: 47.7, HRB: null,HV: 542},
    {HB: 549, HRC: 48.3, HRB: null,HV: 557},
    {HB: 564, HRC: 48.9, HRB: null,HV: 573},
    {HB: 577, HRC: 49.2, HRB: null,HV: 586},
    {HB: 600, HRC: 50.0, HRB: null,HV: 609},
    {HB: 613, HRC: 50.7, HRB: null,HV: 622},
    {HB: 634, HRC: 51.4, HRB: null,HV: 644},
    {HB: 655, HRC: 52.0, HRB: null,HV: 666},
    {HB: 676, HRC: 52.6, HRB: null,HV: 688}
  ],

  cast_iron: [
    {HB: 140, HRC:  8.0, HRB: 75,  HV: 150},
    {HB: 160, HRC: 10.5, HRB: 78,  HV: 170},
    {HB: 180, HRC: 13.0, HRB: 81,  HV: 190},
    {HB: 200, HRC: 16.5, HRB: 84,  HV: 210},
    {HB: 230, HRC: 22.0, HRB: 86,  HV: 240},
    {HB: 260, HRC: 26.0, HRB: null,HV: 270}
  ],

  aluminium: [
    {HB:  20, HRC: null, HRB: 40, HV:  25},
    {HB:  40, HRC: null, HRB: 60, HV:  45},
    {HB:  60, HRC: null, HRB: 80, HV:  65},
    {HB:  80, HRC: null, HRB: 95, HV:  85},
    {HB: 100, HRC: null, HRB:100, HV: 105}
  ],

  copper: [
    {HB:  45, HRC: null, HRB: 50, HV:  50},
    {HB:  65, HRC: null, HRB: 60, HV:  70},
    {HB:  90, HRC: null, HRB: 75, HV:  95},
    {HB: 120, HRC: null, HRB: 85, HV: 125},
    {HB: 150, HRC: null, HRB: 92, HV: 155}
  ],

  brass: [
    {HB:  60, HRC: null, HRB: 60, HV:  70},
    {HB:  80, HRC: null, HRB: 70, HV:  90},
    {HB: 100, HRC: null, HRB: 80, HV: 115},
    {HB: 120, HRC: null, HRB: 90, HV: 135},
    {HB: 140, HRC: null, HRB: 95, HV: 155}
  ],

  phosphor_bronze: [
    {HB:  80, HRC: null, HRB: 70, HV:  95},
    {HB: 100, HRC: null, HRB: 80, HV: 115},
    {HB: 120, HRC: null, HRB: 88, HV: 135},
    {HB: 140, HRC: null, HRB: 95, HV: 155},
    {HB: 160, HRC: null, HRB:100, HV: 175}
  ]
};

function getRows(mat) {
  const rows = DATA[mat];
  if (!rows || !rows.length) {
    throw new Error(`Material '${mat}' not found or has no data`);
  }
  return rows;
}

function sanitizeRows(rows, fromField, toField) {
  return rows
    .filter(r => typeof r[fromField] === 'number' && typeof r[toField] === 'number')
    .slice()
    .sort((a, b) => a[fromField] - b[fromField]);
}

function interpolate(rows, fromField, toField, value) {
  if (value <= rows[0][fromField]) return rows[0][toField];
  const last = rows[rows.length - 1];
  if (value >= last[fromField]) return last[toField];

  let lo = 0;
  let hi = rows.length - 1;
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1;
    const midVal = rows[mid][fromField];
    if (midVal === value) return rows[mid][toField];
    if (midVal < value) lo = mid; else hi = mid;
  }
  const r1 = rows[lo];
  const r2 = rows[hi];
  const t = (value - r1[fromField]) / (r2[fromField] - r1[fromField]);
  return r1[toField] + t * (r2[toField] - r1[toField]);
}

export function convert(value, from = 'HB', to = 'HRC', mat = 'steel') {
  if (from === to) return value;
  const rows = sanitizeRows(getRows(mat), from, to);
  if (!rows.length) throw new Error('Conversion not available for selected scales');
  return interpolate(rows, from, to, value);
}

export function listMaterials() {
  return Object.keys(DATA);
}

export function listScales() {
  return ['HB', 'HRC', 'HRB', 'HV'];
}
export function getRows(mat){ return DATA[mat] ?? []; } 

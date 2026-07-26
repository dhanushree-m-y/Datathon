'use strict';

/* ---------- state ---------- */
let LANG = 'en';
const API = '/server/drishti_api';

/* ---------- embedded fallback (mirrors functions/drishti_api/scenarios.js) ---------- */
const NETWORK = {
  nodes: [
    { id: 'P-3391', label: 'Ravi K.', type: 'accused', central: true },
    { id: 'P-2210', label: 'Suresh', type: 'accused' },
    { id: 'P-4102', label: 'Anand', type: 'accused' },
    { id: 'V-8891', label: 'Victim', type: 'victim' },
    { id: 'L-KRM', label: 'KR Market', type: 'location' },
    { id: 'A-4471', label: 'A/C 4471', type: 'account' }
  ],
  edges: [
    { s: 'P-3391', t: 'P-2210', k: 'co-accused' },
    { s: 'P-3391', t: 'P-4102', k: 'co-accused' },
    { s: 'P-3391', t: 'V-8891', k: 'accused-of' },
    { s: 'P-3391', t: 'L-KRM', k: 'operates-in' },
    { s: 'P-3391', t: 'A-4471', k: 'holds' },
    { s: 'P-2210', t: 'A-4471', k: 'holds' }
  ]
};
const TREND = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
  theft: [42, 38, 45, 52, 61, 68, 74, 66, 58],
  assault: [21, 19, 24, 22, 28, 31, 35, 30, 26]
};
const HOTSPOTS = [
  { name: 'Bengaluru South', count: 74, sev: 0.95 },
  { name: 'KR Puram', count: 52, sev: 0.7 },
  { name: 'Whitefield', count: 38, sev: 0.5 }
];
const RISK = [
  { id: 'P-3391', name: 'Ravi K.', priors: 4, band: 'High' },
  { id: 'P-2210', name: 'Suresh', priors: 3, band: 'High' },
  { id: 'P-4102', name: 'Anand', priors: 2, band: 'Medium' }
];

function localResolve(text) {
  const q = String(text || '').toLowerCase();
  if (/(network|associat|cluster|link|gang|organi|142)/.test(q)) return {
    intent: 'network analysis', viz: 'network', data: NETWORK, confidence: 'high',
    answer_en: 'Accused Ravi K. (P-3391) is linked to 4 prior FIRs and a 3-member cluster showing organized-crime indicators. He is the highest-degree node; shared account A/C-4471 ties two accused together.',
    answer_kn: 'ಆರೋಪಿ ರವಿ ಕೆ. (P-3391) 4 ಹಿಂದಿನ ಎಫ್‌ಐಆರ್‌ಗಳಿಗೆ ಮತ್ತು 3-ಸದಸ್ಯರ ಗುಂಪಿಗೆ ಸಂಬಂಧಿಸಿದ್ದಾರೆ. ಸಂಘಟಿತ ಅಪರಾಧದ ಸೂಚನೆಗಳಿವೆ.',
    evidence: ['FIR 142/2025', 'FIR 88/2024', 'FIR 51/2024', 'Account A/C-4471'],
    reasoning: ["Resolved 'the accused' to P-3391 via FIR 142/2025", 'Retrieved 4 prior FIRs linked to P-3391', 'Computed centrality — P-3391 is the cluster hub']
  };
  if (/(hotspot|trend|theft|pattern|month|season|where)/.test(q)) return {
    intent: 'trend analytics', viz: 'trend', data: { trend: TREND, hotspots: HOTSPOTS }, confidence: 'high',
    answer_en: 'Theft peaked in July (74 incidents), up 76% since January. Three hotspot clusters are flagged; Bengaluru South leads, followed by KR Puram and Whitefield.',
    answer_kn: 'ಜುಲೈನಲ್ಲಿ ಕಳ್ಳತನ ಗರಿಷ್ಠ (74 ಪ್ರಕರಣಗಳು), ಜನವರಿಯಿಂದ 76% ಏರಿಕೆ. ಮೂರು ಹಾಟ್‌ಸ್ಪಾಟ್ ಕ್ಲಸ್ಟರ್‌ಗಳು.',
    evidence: ['Incident aggregates Jan–Sep 2025', 'PS Bengaluru South', 'PS KR Puram'],
    reasoning: ['Aggregated incidents by month & type', 'Ranked stations by density', 'Flagged Bengaluru South (+76% QoQ)']
  };
  if (/(risk|repeat|habitual|offender|priorit|rank)/.test(q)) return {
    intent: 'offender profiling', viz: 'risk', data: RISK, confidence: 'medium',
    answer_en: '12 repeat offenders were risk-ranked. 2 fall in the High band and are prioritized for investigation, scored on prior count, MO recurrence, and network centrality.',
    answer_kn: '12 ಪುನರಾವರ್ತಿತ ಅಪರಾಧಿಗಳನ್ನು ಅಪಾಯದ ಆಧಾರದಲ್ಲಿ ಶ್ರೇಣೀಕರಿಸಲಾಗಿದೆ. 2 ಮಂದಿ ಹೆಚ್ಚಿನ ಅಪಾಯದಲ್ಲಿ.',
    evidence: ['offender_profile P-3391', 'offender_profile P-2210', 'offender_profile P-4102'],
    reasoning: ['Selected persons with 2+ priors', 'Scored on priors, MO recurrence, recency, centrality', 'Banded into High/Medium/Low']
  };
  return {
    intent: 'record lookup', viz: 'record', confidence: 'high',
    data: { fir: '142/2025', crime: 'House theft', station: 'Bengaluru South', status: 'Under investigation', accused: 'Ravi K. (P-3391)', priors: 4 },
    answer_en: 'FIR 142/2025 — House theft at KR Market, Bengaluru South. Status: Under investigation. Accused: Ravi K. (P-3391). Reported 12 May 2025. 4 linked prior cases on record.',
    answer_kn: 'ಎಫ್‌ಐಆರ್ 142/2025 — ಕೆಆರ್ ಮಾರುಕಟ್ಟೆಯಲ್ಲಿ ಮನೆ ಕಳ್ಳತನ. ಸ್ಥಿತಿ: ತನಿಖೆಯಲ್ಲಿದೆ. ಆರೋಪಿ: ರವಿ ಕೆ. (P-3391).',
    evidence: ['FIR 142/2025'],
    reasoning: ['Matched FIR 142/2025', 'Returned status, accused & linked-case count']
  };
}

/* ---------- api ---------- */
let API_LIVE = false;
async function resolveQuery(text) {
  try {
    const r = await fetch(API + '/query', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });
    if (!r.ok) throw new Error('bad status');
    const j = await r.json();
    setApiState(true);
    return j;
  } catch (e) {
    setApiState(false);
    return localResolve(text);
  }
}
function setApiState(live) {
  API_LIVE = live;
  const el = document.getElementById('apiState');
  el.textContent = live ? '● live API' : '● demo data (offline)';
  el.className = 'api-state ' + (live ? 'live' : 'mock');
}

/* ---------- chat ---------- */
const log = document.getElementById('log');
function addMsg(role, html) {
  const d = document.createElement('div');
  d.className = 'msg ' + role;
  d.innerHTML = html;
  log.appendChild(d);
  log.scrollTop = log.scrollHeight;
  return d;
}
function esc(s) { return String(s).replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c])); }

async function ask(text) {
  if (!text.trim()) return;
  addMsg('user', esc(text));
  const thinking = addMsg('bot', '<em style="color:var(--muted)">…searching records</em>');
  const res = await resolveQuery(text);
  const answer = LANG === 'kn' ? (res.answer_kn || res.answer_en) : res.answer_en;
  const ev = (res.evidence || []).map(e => '<span class="chip">' + esc(e) + '</span>').join('');
  thinking.innerHTML = esc(answer) +
    '<div class="ev">' + ev + '</div>' +
    '<span class="conf">confidence: <b>' + esc(res.confidence || 'n/a') + '</b></span>';
  renderInsight(res);
}

/* ---------- insight rendering ---------- */
function renderInsight(res) {
  document.getElementById('intentPill').textContent = res.intent || 'insight';
  document.getElementById('confBadge').textContent = 'confidence · ' + (res.confidence || 'n/a');
  const viz = document.getElementById('viz');
  if (res.viz === 'network') viz.innerHTML = renderNetwork(res.data);
  else if (res.viz === 'trend') viz.innerHTML = renderTrend(res.data);
  else if (res.viz === 'risk') viz.innerHTML = renderRisk(res.data);
  else viz.innerHTML = renderRecord(res.data);

  const evWrap = document.getElementById('evidence');
  evWrap.hidden = false;
  document.getElementById('evChips').innerHTML = (res.evidence || []).map(e => '<span class="chip">' + esc(e) + '</span>').join('');
  document.getElementById('reasoning').innerHTML = (res.reasoning || []).map(r => '<li>' + esc(r) + '</li>').join('');
}

const NODE_COLORS = { accused: '#FF3D7F', victim: '#F5A623', location: '#9B5DE5', account: '#17B978' };
function renderNetwork(g) {
  const W = 460, H = 300, cx = W / 2, cy = H / 2, R = 108;
  const others = g.nodes.filter(n => !n.central);
  const central = g.nodes.find(n => n.central) || g.nodes[0];
  const pos = {}; pos[central.id] = { x: cx, y: cy };
  others.forEach((n, i) => {
    const a = (-Math.PI / 2) + (i * 2 * Math.PI / others.length);
    pos[n.id] = { x: cx + R * Math.cos(a), y: cy + R * Math.sin(a) };
  });
  let s = '<div class="viz-title">Criminal network · centered on ' + esc(central.id) + '</div>';
  s += '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="network graph">';
  g.edges.forEach(e => {
    const a = pos[e.s], b = pos[e.t]; if (!a || !b) return;
    s += '<line x1="' + a.x + '" y1="' + a.y + '" x2="' + b.x + '" y2="' + b.y + '" stroke="#5A1E44" stroke-width="1.5"/>';
    s += '<text class="edge-label" x="' + ((a.x + b.x) / 2) + '" y="' + ((a.y + b.y) / 2 - 3) + '" text-anchor="middle">' + esc(e.k) + '</text>';
  });
  g.nodes.forEach(n => {
    const p = pos[n.id]; const r = n.central ? 22 : 15; const col = NODE_COLORS[n.type] || '#FF3D7F';
    s += '<circle cx="' + p.x + '" cy="' + p.y + '" r="' + r + '" fill="' + col + '" stroke="#290A20" stroke-width="2"/>';
    s += '<text class="node-label" x="' + p.x + '" y="' + (p.y + r + 12) + '" text-anchor="middle">' + esc(n.label) + '</text>';
  });
  s += '</svg>';
  s += '<div class="hotspots" style="margin-top:2px">' +
    Object.entries(NODE_COLORS).map(([k, c]) =>
      '<span style="font-size:11px;color:var(--muted);margin-right:12px"><b style="color:' + c + '">●</b> ' + k + '</span>').join('') +
    '</div>';
  return s;
}

function renderTrend(d) {
  const t = d.trend, W = 460, H = 210, pl = 34, pr = 12, pt = 12, pb = 26;
  const max = 80, n = t.labels.length;
  const X = i => pl + (W - pl - pr) * (i / (n - 1));
  const Y = v => pt + (H - pt - pb) * (1 - v / max);
  const line = (arr, col) => {
    const pts = arr.map((v, i) => X(i).toFixed(1) + ',' + Y(v).toFixed(1)).join(' ');
    return '<polyline points="' + pts + '" fill="none" stroke="' + col + '" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>';
  };
  let grid = '';
  for (let v = 0; v <= max; v += 20) grid += '<line x1="' + pl + '" y1="' + Y(v) + '" x2="' + (W - pr) + '" y2="' + Y(v) + '" stroke="#5A1E44" stroke-width="1"/>' +
    '<text class="edge-label" x="' + (pl - 6) + '" y="' + (Y(v) + 3) + '" text-anchor="end">' + v + '</text>';
  let xlab = t.labels.map((l, i) => '<text class="edge-label" x="' + X(i) + '" y="' + (H - 8) + '" text-anchor="middle">' + l + '</text>').join('');
  let s = '<div class="viz-title">Reported incidents by month</div>';
  s += '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="trend chart">' + grid + line(t.theft, '#FF3D7F') + line(t.assault, '#9B5DE5') + xlab + '</svg>';
  s += '<div style="font-size:11.5px;color:var(--muted);margin:2px 0 8px"><b style="color:#FF3D7F">●</b> Theft &nbsp; <b style="color:#9B5DE5">●</b> Assault</div>';
  s += '<div class="viz-title">Hotspot clusters</div><div class="hotspots">';
  const hmax = Math.max(...d.hotspots.map(h => h.count));
  d.hotspots.forEach(h => {
    s += '<div class="hot"><span>' + esc(h.name) + '</span><span class="bar" style="width:' + (100 * h.count / hmax) + '%"></span><span class="n">' + h.count + '</span></div>';
  });
  s += '</div>';
  return s;
}

function renderRisk(rows) {
  let s = '<div class="viz-title">Offender risk ranking</div><div class="risk-grid">';
  rows.forEach(r => {
    s += '<div class="risk-card"><div class="who">' + esc(r.name) + '<span>' + esc(r.id) + ' · ' + r.priors + ' priors</span></div>' +
      '<span class="band ' + esc(r.band) + '">' + esc(r.band) + ' risk</span></div>';
  });
  s += '</div>';
  return s;
}

function renderRecord(d) {
  const rows = [
    ['FIR number', d.fir], ['Crime', d.crime], ['Police station', d.station],
    ['Status', d.status], ['Accused', d.accused], ['Linked prior cases', d.priors]
  ];
  let s = '<div class="viz-title">FIR record</div><div class="record">';
  rows.forEach(([k, v]) => { s += '<div class="row"><span>' + esc(k) + '</span><b>' + esc(v) + '</b></div>'; });
  s += '</div>';
  return s;
}

/* ---------- suggestions ---------- */
const SUGGEST = [
  'Show the network around the accused in FIR 142/2025',
  'What are the theft hotspots this year?',
  'Rank repeat offenders by risk',
  'Look up FIR 142/2025'
];
function renderSuggest() {
  document.getElementById('suggest').innerHTML = SUGGEST.map(s => '<button>' + esc(s) + '</button>').join('');
  document.querySelectorAll('#suggest button').forEach(b =>
    b.addEventListener('click', () => { document.getElementById('input').value = ''; ask(b.textContent); }));
}

/* ---------- wiring ---------- */
document.getElementById('composer').addEventListener('submit', e => {
  e.preventDefault();
  const inp = document.getElementById('input');
  const v = inp.value; inp.value = '';
  ask(v);
});
document.querySelectorAll('#lang .seg-btn').forEach(b => b.addEventListener('click', () => {
  document.querySelectorAll('#lang .seg-btn').forEach(x => x.classList.remove('active'));
  b.classList.add('active'); LANG = b.dataset.lang;
  document.getElementById('input').placeholder = LANG === 'kn'
    ? 'ಎಫ್‌ಐಆರ್, ನೆಟ್‌ವರ್ಕ್, ಹಾಟ್‌ಸ್ಪಾಟ್‌ಗಳ ಬಗ್ಗೆ ಕೇಳಿ…'
    : 'Ask about FIRs, networks, hotspots, offenders…';
}));
document.getElementById('export').addEventListener('click', () => window.print());

/* voice */
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
const micBtn = document.getElementById('mic');
if (SR) {
  const rec = new SR(); rec.interimResults = false; rec.maxAlternatives = 1;
  micBtn.addEventListener('click', () => {
    rec.lang = LANG === 'kn' ? 'kn-IN' : 'en-IN';
    micBtn.classList.add('rec');
    try { rec.start(); } catch (e) { micBtn.classList.remove('rec'); }
  });
  rec.onresult = ev => { const t = ev.results[0][0].transcript; micBtn.classList.remove('rec'); ask(t); };
  rec.onerror = () => micBtn.classList.remove('rec');
  rec.onend = () => micBtn.classList.remove('rec');
} else {
  micBtn.title = 'Voice not supported in this browser';
  micBtn.addEventListener('click', () => alert('Voice input is not supported in this browser. Try Chrome.'));
}

/* boot */
renderSuggest();
addMsg('bot', 'Namaste 👋 I am <b>Drishti</b>. Ask me about FIRs, criminal networks, crime hotspots, or offender risk — in English or Kannada. Every answer comes with its evidence trail.');
fetch(API + '/').then(r => setApiState(r.ok)).catch(() => setApiState(false));

'use strict';

/*
 * Drishti mock intelligence.
 * Resolves a natural-language question to a canned, evidence-backed answer.
 * In the real product this is the AppSail conversational engine:
 *   intent parse (LLM) -> parameterized query allowlist -> RAG over Data Store.
 * Here it is a deterministic keyword resolver over synthetic data.
 */

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

function resolve(text) {
  const q = String(text || '').toLowerCase();

  if (/(network|associat|cluster|link|gang|organi|142)/.test(q)) {
    return {
      intent: 'network_analysis',
      answer_en: 'Accused Ravi K. (P-3391) is linked to 4 prior FIRs and a 3-member cluster showing organized-crime indicators. He is the highest-degree node; shared account A/C-4471 ties two accused together.',
      answer_kn: 'ಆರೋಪಿ ರವಿ ಕೆ. (P-3391) 4 ಹಿಂದಿನ ಎಫ್‌ಐಆರ್‌ಗಳಿಗೆ ಮತ್ತು 3-ಸದಸ್ಯರ ಗುಂಪಿಗೆ ಸಂಬಂಧಿಸಿದ್ದಾರೆ. ಸಂಘಟಿತ ಅಪರಾಧದ ಸೂಚನೆಗಳಿವೆ; ಹಂಚಿಕೆಯ ಖಾತೆ A/C-4471 ಇಬ್ಬರು ಆರೋಪಿಗಳನ್ನು ಜೋಡಿಸುತ್ತದೆ.',
      evidence: ['FIR 142/2025', 'FIR 88/2024', 'FIR 51/2024', 'Account A/C-4471'],
      reasoning: [
        "Resolved 'the accused' to person P-3391 via FIR 142/2025",
        'Retrieved 4 prior FIRs linked to P-3391',
        'Computed graph centrality — P-3391 is the hub of a 3-member cluster'
      ],
      confidence: 'high',
      viz: 'network',
      data: NETWORK
    };
  }

  if (/(hotspot|trend|theft|pattern|month|season|where)/.test(q)) {
    return {
      intent: 'trend_analytics',
      answer_en: 'Theft peaked in July (74 incidents), up 76% since January. Three hotspot clusters are flagged; Bengaluru South leads, followed by KR Puram and Whitefield.',
      answer_kn: 'ಜುಲೈನಲ್ಲಿ ಕಳ್ಳತನ ಗರಿಷ್ಠ (74 ಪ್ರಕರಣಗಳು), ಜನವರಿಯಿಂದ 76% ಏರಿಕೆ. ಮೂರು ಹಾಟ್‌ಸ್ಪಾಟ್ ಕ್ಲಸ್ಟರ್‌ಗಳು; ಬೆಂಗಳೂರು ದಕ್ಷಿಣ ಮುಂಚೂಣಿಯಲ್ಲಿದೆ.',
      evidence: ['Incident aggregates Jan–Sep 2025', 'PS Bengaluru South', 'PS KR Puram'],
      reasoning: [
        'Aggregated incidents by month and crime type',
        'Ranked stations by incident density to detect hotspots',
        'Flagged Bengaluru South as an emerging cluster (+76% QoQ)'
      ],
      confidence: 'high',
      viz: 'trend',
      data: { trend: TREND, hotspots: HOTSPOTS }
    };
  }

  if (/(risk|repeat|habitual|offender|priorit|rank)/.test(q)) {
    return {
      intent: 'offender_profiling',
      answer_en: '12 repeat offenders were risk-ranked. 2 fall in the High band and are prioritized for investigation, scored on prior count, MO recurrence, and network centrality.',
      answer_kn: '12 ಪುನರಾವರ್ತಿತ ಅಪರಾಧಿಗಳನ್ನು ಅಪಾಯದ ಆಧಾರದಲ್ಲಿ ಶ್ರೇಣೀಕರಿಸಲಾಗಿದೆ. 2 ಮಂದಿ ಹೆಚ್ಚಿನ ಅಪಾಯದ ಗುಂಪಿನಲ್ಲಿದ್ದಾರೆ.',
      evidence: ['offender_profile P-3391', 'offender_profile P-2210', 'offender_profile P-4102'],
      reasoning: [
        'Selected persons with 2+ prior FIRs in jurisdiction',
        'Scored on prior count, MO recurrence, recency, network centrality',
        'Banded scores into High / Medium / Low'
      ],
      confidence: 'medium',
      viz: 'risk',
      data: RISK
    };
  }

  // default: FIR record lookup
  return {
    intent: 'record_lookup',
    answer_en: 'FIR 142/2025 — House theft at KR Market, Bengaluru South. Status: Under investigation. Accused: Ravi K. (P-3391). Reported 12 May 2025. 4 linked prior cases on record.',
    answer_kn: 'ಎಫ್‌ಐಆರ್ 142/2025 — ಕೆಆರ್ ಮಾರುಕಟ್ಟೆಯಲ್ಲಿ ಮನೆ ಕಳ್ಳತನ, ಬೆಂಗಳೂರು ದಕ್ಷಿಣ. ಸ್ಥಿತಿ: ತನಿಖೆಯಲ್ಲಿದೆ. ಆರೋಪಿ: ರವಿ ಕೆ. (P-3391).',
    evidence: ['FIR 142/2025'],
    reasoning: ['Matched FIR number 142/2025', 'Returned status, accused, and linked-case count'],
    confidence: 'high',
    viz: 'record',
    data: {
      fir: '142/2025', crime: 'House theft', station: 'Bengaluru South',
      status: 'Under investigation', accused: 'Ravi K. (P-3391)', priors: 4
    }
  };
}

module.exports = { resolve };

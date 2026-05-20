/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ThresholdScore = 2 | 1 | 0 | -1 | -2;

export interface ThresholdDefinition {
  score: ThresholdScore;
  label: string;
  shortLabel: string;
  description: string;
  colorClass: string;
  borderColorClass: string;
  bgHex: string;
  textHex: string;
  lightBgHex: string;
}

export const THRESHOLD_MAP: Record<ThresholdScore, ThresholdDefinition> = {
  2: {
    score: 2,
    label: "True Threshold (Essential)",
    shortLabel: "+2",
    description: "Essential. I would only consider a future position if this variable is a regular, significant part of the role.",
    colorClass: "bg-emerald-600 text-white",
    borderColorClass: "border-emerald-600",
    bgHex: "#059669",
    textHex: "#ffffff",
    lightBgHex: "#ecfdf5"
  },
  1: {
    score: 1,
    label: "Not a Threshold (Preferred)",
    shortLabel: "+1",
    description: "Preferred. I prefer this variable as part of the work, but would consider a role without it if short-term or minor.",
    colorClass: "bg-teal-500 text-white",
    borderColorClass: "border-teal-500",
    bgHex: "#14b8a6",
    textHex: "#ffffff",
    lightBgHex: "#f0fdfa"
  },
  0: {
    score: 0,
    label: "Neutral",
    shortLabel: "0",
    description: "Neutral. This variable has no impact on my decision to take a role.",
    colorClass: "bg-slate-300 text-slate-800",
    borderColorClass: "border-slate-300",
    bgHex: "#cbd5e1",
    textHex: "#1e293b",
    lightBgHex: "#f8fafc"
  },
  "-1": {
    score: -1,
    label: "Not a Threshold (Avoid)",
    shortLabel: "-1",
    description: "Avoid. I would prefer this variable was not part of the role, but would consider it if short-term or minor.",
    colorClass: "bg-amber-500 text-white",
    borderColorClass: "border-amber-500",
    bgHex: "#f59e0b",
    textHex: "#ffffff",
    lightBgHex: "#fffbeb"
  },
  "-2": {
    score: -2,
    label: "True Threshold (Deal-breaker)",
    shortLabel: "-2",
    description: "Deal-breaker. I would not consider a position if this variable is involved in the role in any capacity.",
    colorClass: "bg-rose-600 text-white",
    borderColorClass: "border-rose-600",
    bgHex: "#e11d48",
    textHex: "#ffffff",
    lightBgHex: "#fff1f2"
  }
};

export interface LensItem {
  id: string;
  text: string;
  score: ThresholdScore;
}

export interface Experience {
  id: string;
  title: string;
  type: string;
  notes?: string;
  dateCreated: string;
  actions: LensItem[];
  data: LensItem[];
  ethos: LensItem[];
  people: LensItem[];
  tangibles: LensItem[];
}

export type LensKey = "actions" | "data" | "ethos" | "people" | "tangibles";

export interface LensInfo {
  key: LensKey;
  letter: string;
  title: string;
  description: string;
  fullExplanation: string;
  placeholders: string[];
  examples: { text: string; score: ThresholdScore; reason?: string }[];
}

export const LENS_METADATA: Record<LensKey, LensInfo> = {
  actions: {
    key: "actions",
    letter: "A",
    title: "Actions (Concrete Skills)",
    description: "Specific, concrete skills utilized that allowed you to succeed.",
    fullExplanation: "Focus on granular behaviors and specific procedural actions rather than abstract general terms. Instead of 'communication', specify 'writing weekly synthesis emails' or 'coordinating speaker schedules'.",
    placeholders: [
      "e.g., Pipetting and performing qPCR assays",
      "e.g., Writing weekly student newsletter emails",
      "e.g., Resolving customer billing discrepancies over the phone",
      "e.g., Drafting literature reviews in APA format"
    ],
    examples: [
      { text: "Writing clear, persuasive research grants", score: 2, reason: "Loved synthesizing complex ideas into pitches." },
      { text: "Presenting findings in weekly team standups", score: 1, reason: "Liked the structure, but nerve-wracking if repetitive." },
      { text: "Entering temperature metrics manually in spreadsheets", score: -2, reason: "Felt mind-numbing; prone to transcription errors." }
    ]
  },
  data: {
    key: "data",
    letter: "D",
    title: "Data (Substantive Content)",
    description: "The substantive information, subject matter, or problems filling your mind.",
    fullExplanation: "Identify the topical areas, datasets, or fields of inquiry that you worked with. This captures the 'what' of your thoughts—whether it is viral epidemiology, late-nineteenth-century French poetry, or school funding policies.",
    placeholders: [
      "e.g., Infectious disease dynamics & pathogen lifecycles",
      "e.g., Mid-century Scandinavian furniture architectural history",
      "e.g., K-12 public education legislative amendments",
      "e.g., Machine learning hyperparameter optimization formulas"
    ],
    examples: [
      { text: "Infectious disease progression & pathogen transmission vectors", score: 2, reason: "Genuinely fascinated by epidemiological modeling." },
      { text: "Basic statistical significance calculations (p-values)", score: 1, reason: "Useful tool, but preferred the biological context." },
      { text: "Budget lines and office supply inventories", score: -1, reason: "Boring; didn't spark intellectual engagement." }
    ]
  },
  ethos: {
    key: "ethos",
    letter: "E",
    title: "Ethos (Culture & Values)",
    description: "The organizational culture, environment, and interpersonal respect.",
    fullExplanation: "How team members treated each other, the unspoken values, the speed of work, and organizational structure. Was it highly collaborative, transparent, top-down hierarchical, highly competitive, or slow and methodical?",
    placeholders: [
      "e.g., Highly collaborative, feedback-friendly work culture",
      "e.g., Flat hierarchy with extreme autonomy and remote flexibility",
      "e.g., Fast-paced, high-pressure, competitive peer-review team",
      "e.g., Slow, methodical, bureaucracy-heavy academic setting"
    ],
    examples: [
      { text: "Psychological safety & supportive mistakes-as-lessons policy", score: 2, reason: "Felt safe to try complex experiments." },
      { text: "Strict hierarchical chain of approval on all lab benches", score: -2, reason: "Felt suffocated by micro-management." },
      { text: "Rapid-fire Slack messaging & expectations of immediate replies", score: -1, reason: "Anxiety-inducing during off-hours." }
    ]
  },
  people: {
    key: "people",
    letter: "P",
    title: "People (Colleagues & Clients)",
    description: "The colleagues you worked alongside and recipient populations served.",
    fullExplanation: "Examine who populated your world. Includes your peer cohort, your supervisors, your direct reports, and the specific recipient or client audience you served (e.g., elderly low-income patients, passionate peer researchers, or commercial enterprise clients).",
    placeholders: [
      "e.g., First-generation college applicants from local high schools",
      "e.g., Postdoctoral researchers and senior microbiology PIs",
      "e.g., Tech startup founders seeking seed capital",
      "e.g., Compassionate volunteer wildlife veterinarians"
    ],
    examples: [
      { text: "Passionate peers who nerd-out over biological science details", score: 2, reason: "Energized by intense shared interest." },
      { text: "Providing instruction directly to high school students", score: 1, reason: "Rewarding but could be socially exhausting." },
      { text: "Highly skeptical clients who challenge basic research rigor", score: -1, reason: "Frustrating to handle repeatedly." }
    ]
  },
  tangibles: {
    key: "tangibles",
    letter: "T",
    title: "Tangibles (Settings & Autonomy)",
    description: "Physical settings, conditions, autonomy levels, and artifacts produced.",
    fullExplanation: "The concrete constraints of the position: work environment (outdoor field, busy laboratory, home desk), work schedules, autonomy, role ambiguity, and physical deliverables (e.g., producing a molecular assay kit or presenting a poster at a conference).",
    placeholders: [
      "e.g., Hybrid schedule with 20 hours/week and fluid timeline",
      "e.g., Wet lab environment with loud fume hoods, stand-up station",
      "e.g., Highly ambiguous role instructions requiring self-direction",
      "e.g., High-quality printed 3x4 research poster artifact"
    ],
    examples: [
      { text: "A physical lab bench workspace of my own", score: 1, reason: "Nice to have a dedicated territory." },
      { text: "Highly ambiguous project goals with no specific manual", score: -2, reason: "Felt paralyzed by the lack of structural guidelines." },
      { text: "Rigid shift start times clocked to the physical second", score: -1, reason: "Prefer flex hours due to commute issues." }
    ]
  }
};

export const INITIAL_EXPERIENCES: Experience[] = [
  {
    id: "sample-bio-lab",
    title: "Bioinformatics & Wet Lab Research Assistant",
    type: "Internship",
    notes: "Completed a 6-month summer internship at university infectious diseases labs, doing molecular diagnostic setups and data modeling.",
    dateCreated: "2026-05-18T14:30:00Z",
    actions: [
      { id: "a1", text: "Performing delicate chemical assays and liquid-handling pipetting", score: 2 },
      { id: "a2", text: "Writing clear, peer-reviewed experimental summaries in lab notebooks", score: 1 },
      { id: "a3", text: "Typing redundant metadata spreadsheets without automated scripts", score: -2 },
      { id: "a4", text: "Presenting biweekly slide decks to a critical team of 15 researchers", score: 1 }
    ],
    data: [
      { id: "d1", text: "Infectious disease progression & genetic viral sequencing data", score: 2 },
      { id: "d2", text: "Statistical analysis using R and machine learning regressions", score: 1 },
      { id: "d3", text: "Sponsor billing invoices and laboratory procurement tables", score: -1 }
    ],
    ethos: [
      { id: "e1", text: "A supportive environment with strong psychological safety and mentorship", score: 2 },
      { id: "e2", text: "Fast-paced academic pressure to publish outcomes swiftly", score: -1 },
      { id: "e3", text: "Siloed communication where work is rarely shared across benches", score: -2 }
    ],
    people: [
      { id: "p1", text: "Postdoctoral mentors who nerd-out over evolutionary biology specifics", score: 2 },
      { id: "p2", text: "Busy Principal Investigators with highly limited, scheduled calendar accessibility", score: -1 }
    ],
    tangibles: [
      { id: "t1", text: "Dedicated physical lab bench space with high-end machinery", score: 1 },
      { id: "t2", text: "Flexible wet lab working hours where I can schedule around classes", score: 2 },
      { id: "t3", text: "Extremely high ambiguity regarding project deliverables without guidelines", score: -2 }
    ]
  },
  {
    id: "sample-ambassador",
    title: "Admissions Division Campus Student Ambassador",
    type: "Campus leadership",
    notes: "Worked part-time during sophomore year, delivering campus historical tours and advising prospective families.",
    dateCreated: "2026-05-19T09:15:00Z",
    actions: [
      { id: "a5", text: "Public speaking and storytelling in front of groups of 30+ visitors", score: 2 },
      { id: "a6", text: "Answering rapid-fire FAQ queries regarding campus financial aid policies", score: 1 },
      { id: "a7", text: "Lifting and packing physical marketing banners and boxes in severe heat", score: -1 }
    ],
    data: [
      { id: "d4", text: "Campus historical landmarks and academic degree program archives", score: 1 },
      { id: "d5", text: "Higher education recruitment conversion metrics and spreadsheets", score: 0 }
    ],
    ethos: [
      { id: "e4", text: "High energy, outgoing, welcoming culture emphasizing group cheerfulness", score: 1 },
      { id: "e5", text: "Highly repetitive scripts with low room for content curation", score: -2 }
    ],
    people: [
      { id: "p3", text: "Anxious high school students and their highly protective parents", score: 1 },
      { id: "p4", text: "Energetic and friendly undergraduate peer students", score: 2 }
    ],
    tangibles: [
      { id: "t4", text: "Walking outdoors in varying, humid, and unpredictable weather environments", score: -1 },
      { id: "t5", text: "High visibility role where I wear a branded uniform sweater", score: 0 }
    ]
  }
];

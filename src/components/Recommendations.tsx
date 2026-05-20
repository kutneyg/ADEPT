/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  Compass, 
  HelpCircle, 
  Search, 
  Copy, 
  Check, 
  ArrowUpRight, 
  Printer, 
  Download, 
  GraduationCap, 
  Layers, 
  Briefcase, 
  MapPin, 
  Fingerprint, 
  UserCheck, 
  Cpu,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  XCircle,
  Plus,
  Trash2,
  FileText,
  UserPlus,
  Send,
  AlertCircle
} from "lucide-react";
import { Experience, LensKey, LENS_METADATA } from "../types";

interface RecommendationsProps {
  experiences: Experience[];
  currentExperience: Experience | null;
  onDownloadJSON: () => void;
  onPrint: () => void;
}

interface JobHypothesis {
  id: string;
  title: string;
  isCustom?: boolean;
  ratings: Record<string, "high" | "uncertain" | "low" | "avoided" | "present">; // key: item ID, value: rating
}

export default function Recommendations({
  experiences,
  currentExperience,
  onDownloadJSON,
  onPrint
}: RecommendationsProps) {
  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});
  const [customJobTitleInput, setCustomJobTitleInput] = useState("");
  const [senderName, setSenderName] = useState("your name");
  
  // Aggregate ALL Experiences +2 Anchors and -2 Dealbreakers
  const allExperiences = experiences || [];
  
  const aggregatedAnchors: { id: string; text: string; lensKey: LensKey; expTitle: string }[] = [];
  const aggregatedDealbreakers: { id: string; text: string; lensKey: LensKey; expTitle: string }[] = [];

  allExperiences.forEach(exp => {
    const lenses: LensKey[] = ["actions", "data", "ethos", "people", "tangibles"];
    lenses.forEach(lens => {
      const items = exp[lens] || [];
      items.forEach(item => {
        if (item.score === 2) {
          // Guard against exact duplicates to keep the dashboard clean
          if (!aggregatedAnchors.some(a => a.text.toLowerCase().trim() === item.text.toLowerCase().trim())) {
            aggregatedAnchors.push({
              id: `${exp.id}-${lens}-${item.id}`,
              text: item.text,
              lensKey: lens,
              expTitle: exp.title
            });
          }
        } else if (item.score === -2) {
          if (!aggregatedDealbreakers.some(d => d.text.toLowerCase().trim() === item.text.toLowerCase().trim())) {
            aggregatedDealbreakers.push({
              id: `${exp.id}-${lens}-${item.id}`,
              text: item.text,
              lensKey: lens,
              expTitle: exp.title
            });
          }
        }
      });
    });
  });

  // Track user-created Job Hypotheses
  const [jobHypotheses, setJobHypotheses] = useState<JobHypothesis[]>([]);
  const [activeHypothesisId, setActiveHypothesisId] = useState<string>("");

  // Initialize job hypotheses list once aggregated items are loaded
  useEffect(() => {
    if (jobHypotheses.length === 0 && (aggregatedAnchors.length > 0 || aggregatedDealbreakers.length > 0)) {
      // Build clever initial default hypotheses based on their loaded experiences
      const initial: JobHypothesis[] = [];
      const titles = Array.from(new Set(allExperiences.map(e => e.title)));
      
      if (titles.includes("Bioinformatics & Wet Lab Research Assistant")) {
        initial.push({
          id: "hypo-1",
          title: "Bioinformatics Research Associate",
          ratings: {}
        });
      } else {
        initial.push({
          id: "hypo-1",
          title: "Academic Research Analyst",
          ratings: {}
        });
      }

      if (titles.includes("Admissions Division Campus Student Ambassador")) {
        initial.push({
          id: "hypo-2",
          title: "Admissions Program Facilitator",
          ratings: {}
        });
      } else {
        initial.push({
          id: "hypo-2",
          title: "Industry Program Coordinator",
          ratings: {}
        });
      }

      setJobHypotheses(initial);
      setActiveHypothesisId(initial[0].id);
    }
  }, [allExperiences, aggregatedAnchors.length]);

  const activeHypo = jobHypotheses.find(h => h.id === activeHypothesisId) || null;

  const triggerCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedStates(prev => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setCopiedStates(prev => ({ ...prev, [id]: false }));
    }, 2000);
  };

  const handleAddCustomHypothesis = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customJobTitleInput.trim()) return;
    
    const newHypo: JobHypothesis = {
      id: `hypo-custom-${Date.now()}`,
      title: customJobTitleInput.trim(),
      isCustom: true,
      ratings: {}
    };

    setJobHypotheses(prev => [...prev, newHypo]);
    setActiveHypothesisId(newHypo.id);
    setCustomJobTitleInput("");
  };

  const handleDeleteHypothesis = (id: string) => {
    const updated = jobHypotheses.filter(h => h.id !== id);
    setJobHypotheses(updated);
    if (activeHypothesisId === id) {
      if (updated.length > 0) {
        setActiveHypothesisId(updated[0].id);
      } else {
        setActiveHypothesisId("");
      }
    }
  };

  const handleUpdateRating = (itemId: string, rating: "high" | "uncertain" | "low" | "avoided" | "present") => {
    if (!activeHypo) return;
    setJobHypotheses(prev => prev.map(h => {
      if (h.id === activeHypothesisId) {
        return {
          ...h,
          ratings: {
            ...h.ratings,
            [itemId]: rating
          }
        };
      }
      return h;
    }));
  };

  // Generate tailored interview questions based on lens type
  const generateAnchorQuestions = (item: { text: string; lensKey: LensKey }) => {
    const val = item.text;
    switch (item.lensKey) {
      case "actions":
        return [
          `“Can you describe a typical week? What percentage of hours is spent directly on [${val}]?”`,
          `“What level of autonomy will I have in executing [${val}] compared to strictly predefined protocols?”`
        ];
      case "data":
        return [
          `“To what extent is the routine daily focus here centered on [${val}] as opposed to administrative tasks?”`,
          `“If I want to specialize or go deeper in solving problems around [${val}], does this pathway support that?”`
        ];
      case "ethos":
        return [
          `“How does the organizational culture here support [${val}] when meeting tight deadlines or high-stakes pressure?”`,
          `“Can you share a concrete, recent example of how leadership reinforces [${val}] in minor daily decisions?”`
        ];
      case "people":
        return [
          `“How directly or frequently will I work with [${val}] in this specific position?”`,
          `“What are the main rewards and challenges you find when interfacing with [${val}] here?”`
        ];
      case "tangibles":
        return [
          `“What structural or physical arrangements exist inside the work setting to support conditions like [${val}]?”`,
          `“How does the department align performance reviews and promotion metrics with things like [${val}]?”`
        ];
    }
  };

  const generateDealbreakerQuestions = (item: { text: string; lensKey: LensKey }) => {
    const val = item.text;
    switch (item.lensKey) {
      case "actions":
        return [
          `“How much of this position involves routine [${val}]? Are there options to delegate or streamline this?”`,
          `“Is [${val}] considered a core expectation, or are there digital/procedural tools to automate it?”`
        ];
      case "data":
        return [
          `“Does this role require spending major cycles grappling with [${val}]? How is that split across team members?”`
        ];
      case "ethos":
        return [
          `“When work pace accelerates and deadlines lock, how does the team structure handle [${val}]? Is it a standard friction point?”`
        ];
      case "people":
        return [
          `“To what degree is interaction with [${val}] mandatory or frequent? Is there a buffer or tier support system?”`
        ];
      case "tangibles":
        return [
          `“What is the realistic flexibility when faced with [${val}] constraints? How do colleagues navigate this?”`
        ];
    }
  };

  const getLensIcon = (key: LensKey) => {
    switch (key) {
      case "actions": return <Cpu className="w-3.5 h-3.5 text-indigo-600" />;
      case "data": return <Layers className="w-3.5 h-3.5 text-sky-600" />;
      case "ethos": return <Fingerprint className="w-3.5 h-3.5 text-fuchsia-600" />;
      case "people": return <UserCheck className="w-3.5 h-3.5 text-amber-600" />;
      case "tangibles": return <MapPin className="w-3.5 h-3.5 text-emerald-600" />;
    }
  };

  // Compute stats for current active job hypothesis
  const totalAnchorsCount = aggregatedAnchors.length;
  const totalDealbreakersCount = aggregatedDealbreakers.length;
  
  const highAnchors = activeHypo ? aggregatedAnchors.filter(a => activeHypo.ratings[a.id] === "high") : [];
  const uncertainAnchors = activeHypo ? aggregatedAnchors.filter(a => activeHypo.ratings[a.id] === "uncertain" || !activeHypo.ratings[a.id]) : aggregatedAnchors;
  const lowAnchors = activeHypo ? aggregatedAnchors.filter(a => activeHypo.ratings[a.id] === "low") : [];

  const avoidedDealbreakers = activeHypo ? aggregatedDealbreakers.filter(d => activeHypo.ratings[d.id] === "avoided") : [];
  const uncertainDealbreakers = activeHypo ? aggregatedDealbreakers.filter(d => activeHypo.ratings[d.id] === "uncertain" || !activeHypo.ratings[d.id]) : aggregatedDealbreakers;
  const presentDealbreakers = activeHypo ? aggregatedDealbreakers.filter(d => activeHypo.ratings[d.id] === "present") : [];

  // Boolean Query Compiler based on current active role and anchors
  const generateBooleanQuery = () => {
    const activeTitle = activeHypo ? activeHypo.title : "Target Role";
    const quoteWords = aggregatedAnchors.map(i => `"${i.text}"`);
    if (quoteWords.length === 0) {
      return `"${activeTitle}"`;
    }
    const joinedTerms = quoteWords.join(" AND ");
    return `"${activeTitle}" AND ${joinedTerms}`;
  };

  const currentQuery = generateBooleanQuery();

  // Custom Outreach Email Script compiler populated with top anchors
  const compileOutreachHook = () => {
    const activeTitle = activeHypo ? activeHypo.title : "[Target Role]";
    const keyAnchor1 = aggregatedAnchors[0] ? `“${aggregatedAnchors[0].text}”` : "specific action settings";
    const keyAnchor2 = aggregatedAnchors[1] ? `“${aggregatedAnchors[1].text}”` : "supportive environments";
    
    return `Subject: Informational Interview Inquiry - ${senderName} (University Explorer)

Hi [Professional's Name],

I hope you don't mind the direct message! I am currently an student evaluating future career paths and conducting some structured reflection on my past finite experiences. 

I was browsing profiles and noticed your background working as a ${activeTitle}. Your career timeline is extremely interesting to me. I'm currently testing some hypotheses about roles that heavily feature areas like ${keyAnchor1} and align well with ${keyAnchor2}. 

Would you be open to a brief 15-minute informational interview sometime next week? I would love to ask you a couple of brief questions to learn about your day-to-day work from a peer-to-peer perspective. I have prepared targeted, non-obvious questions is to make the discussion highly respectful of your time.

Thank you so much for considering this, and I look forward to hearing from you.

Sincerely,
${senderName}`;
  };

  return (
    <div id="recommendations-container" className="space-y-8">
      
      {/* HEADER OVERVIEW BANNER */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 md:p-8 shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-indigo-505/10 rounded-full blur-3xl opacity-40 pointer-events-none" />
        
        <div className="relative space-y-4">
          <div className="flex items-center gap-2 text-indigo-300 font-mono text-[10px] uppercase font-bold tracking-widest bg-indigo-950/80 border border-indigo-805/50 px-3 py-1 rounded-full w-fit">
            <Compass className="w-3.5 h-3.5" /> Stage 3: Hypothesis Testing Studio
          </div>

          <div className="space-y-2">
            <h2 className="text-xl md:text-2xl font-semibold tracking-tight">Vesting Your Career Hypotheses</h2>
            <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
              Based on the ADEPT methodology, you shouldn't start your future seeking directions on arbitrary postings or salary criteria alone. Instead, anchor your exploration directly on securing your <strong>+2 Essential Anchors</strong> and insulating against your <strong>-2 Dealbreakers</strong>. Use this workspace to estimate alignment, prep proactive professional outreach, and generate custom informational interview guides.
            </p>
          </div>
        </div>
      </div>

      {allExperiences.length === 0 ? (
        <div className="bg-white border border-slate-150 rounded-xl p-12 text-center space-y-6">
          <AlertCircle className="w-12 h-12 text-slate-300 mx-auto" />
          <div className="max-w-md mx-auto space-y-2">
            <h3 className="font-bold text-slate-800 text-sm">No Evaluation Data Found</h3>
            <p className="text-xs text-slate-500 leading-normal">
              The recommendations model requires at least one evaluated experience to identify patterns, anchors, and dealbreakers. 
            </p>
          </div>
          <p className="text-[11px] text-indigo-600 bg-indigo-50 border border-indigo-100 rounded-lg px-4 py-2.5 max-w-sm mx-auto font-medium">
            💡 Please load sample demo models from the top header bar to test this workspace immediately!
          </p>
        </div>
      ) : (
        <>
          {/* SECTION 1: SYSTEMIC ANCHOR & DEALBREAKER INDICES */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-indigo-600 animate-pulse" />
                1. Integrated Cross-Experience Diagnostic Map
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                We combed through all <strong>{allExperiences.length} logged experiences</strong> to extract your non-negotiables:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Green Anchors list */}
              <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-4 md:p-5 space-y-3.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-emerald-950 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-1.5 h-3 bg-emerald-500 rounded-sm"></span>
                    Core Career Anchors (+2 Essential)
                  </h4>
                  <span className="text-[10px] font-mono text-emerald-750 bg-emerald-100 px-2 py-0.5 rounded-full font-bold">
                    {aggregatedAnchors.length} found
                  </span>
                </div>
                <p className="text-[11px] text-emerald-900/80 leading-relaxed">
                  These must be standard, recurring elements of your future role. If absent, the work will feel shallow or misaligned.
                </p>

                {aggregatedAnchors.length === 0 ? (
                  <p className="text-xs text-emerald-800 italic font-mono p-3 bg-white/50 border border-dashed border-emerald-200/50 rounded-lg">
                    [No +2 True Thresholds logged yet. Go back to Deconstruct Lenses to set some items as essential.]
                  </p>
                ) : (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {aggregatedAnchors.map((item) => (
                      <div key={item.id} className="bg-white border border-emerald-200/30 p-2.5 rounded-lg flex items-start gap-2 text-xs shadow-2xs">
                        <div className="mt-0.5 shrink-0">{getLensIcon(item.lensKey)}</div>
                        <div className="space-y-0.5">
                          <p className="font-semibold text-slate-800 leading-snug">{item.text}</p>
                          <p className="text-[9px] font-mono text-slate-400">
                            Lens: <span className="font-semibold text-indigo-600 capitalize">{item.lensKey}</span> • Logged in: <span className="italic">{item.expTitle}</span>
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Red Dealbreakers list */}
              <div className="bg-rose-50/50 border border-rose-100 rounded-xl p-4 md:p-5 space-y-3.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-rose-955 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-1.5 h-3 bg-rose-500 rounded-sm"></span>
                    Core Career Guardrails (-2 Dealbreakers)
                  </h4>
                  <span className="text-[10px] font-mono text-rose-750 bg-rose-100 px-2 py-0.5 rounded-full font-bold">
                    {aggregatedDealbreakers.length} found
                  </span>
                </div>
                <p className="text-[11px] text-rose-900/80 leading-relaxed">
                  These represent severe pain points. If any future job includes these in substantial capacity, it will likely lead to rapid burnout.
                </p>

                {aggregatedDealbreakers.length === 0 ? (
                  <p className="text-xs text-rose-800 italic font-mono p-3 bg-white/50 border border-dashed border-rose-200/50 rounded-lg">
                    [No -2 Absolute Dealbreakers logged yet. Great! If any exist, evaluate them in Deconstruct Lenses.]
                  </p>
                ) : (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {aggregatedDealbreakers.map((item) => (
                      <div key={item.id} className="bg-white border border-rose-205/30 p-2.5 rounded-lg flex items-start gap-2 text-xs shadow-2xs">
                        <div className="mt-0.5 shrink-0">❌</div>
                        <div className="space-y-0.5">
                          <p className="font-semibold text-slate-800 leading-snug">{item.text}</p>
                          <p className="text-[9px] font-mono text-slate-400">
                            Lens: <span className="font-semibold text-rose-600 capitalize">{item.lensKey}</span> • Logged in: <span className="italic">{item.expTitle}</span>
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* SECTION 2: INTERACTIVE HYPOTHESIS TESTING ENVIRONMENT */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Sidebar with Hypotheses list */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4 text-indigo-600" />
                  Your Active Job Hypotheses
                </h4>
                <p className="text-[11px] text-slate-500">
                  Select a career role path to test, or type a custom query to initiate a new test.
                </p>
              </div>

              {/* Add Custom Role form */}
              <form onSubmit={handleAddCustomHypothesis} className="flex gap-2">
                <input
                  type="text"
                  value={customJobTitleInput}
                  onChange={(e) => setCustomJobTitleInput(e.target.value)}
                  placeholder="e.g. Healthcare Consultant"
                  className="flex-1 text-xs border border-slate-200 rounded-lg px-2.5 py-2.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  title="Add custom hypotesis role"
                  className="px-3 bg-indigo-650 hover:bg-indigo-705 text-white rounded-lg text-xs font-bold hover:shadow-xs transition-colors flex items-center justify-center shrink-0"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </form>

              {/* List of active Hypotheses */}
              <div className="space-y-2 pt-1 max-h-72 overflow-y-auto">
                {jobHypotheses.map((hypo) => {
                  const isActive = hypo.id === activeHypothesisId;
                  // Calculate raw metrics for badge
                  const ratedCount = Object.keys(hypo.ratings).length;
                  const totalItems = totalAnchorsCount + totalDealbreakersCount;
                  
                  return (
                    <button
                      key={hypo.id}
                      onClick={() => setActiveHypothesisId(hypo.id)}
                      className={`w-full text-left p-3 rounded-xl border transition-all flex items-start justify-between gap-2 group ${
                        isActive 
                          ? "bg-indigo-50 border-indigo-200 text-indigo-900 shadow-3xs" 
                          : "bg-slate-50 hover:bg-slate-100 border-slate-200/60 text-slate-700"
                      }`}
                    >
                      <div className="space-y-1 mini-text-fix">
                        <p className="text-xs font-bold leading-tight truncate max-w-[150px]">{hypo.title}</p>
                        <p className="text-[9px] text-slate-400 font-mono">
                          {ratedCount === 0 
                            ? "🔴 Unassessed" 
                            : `🟢 ${ratedCount}/${totalItems} variables mapped`}
                        </p>
                      </div>

                      <div className="flex items-center gap-1">
                        {hypo.isCustom && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteHypothesis(hypo.id);
                            }}
                            className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-slate-200/55"
                            title="Delete custom hypothesis"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <span className="text-xs text-slate-400">→</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="md:col-span-1 border-t border-slate-100 pt-3">
                <span className="text-[10px] text-slate-500 leading-relaxed block">
                  💡 <strong>Tip for Advisors:</strong> Select a role with the student, and go item-by-item to rate the likelihood of satisfying each anchor.
                </span>
              </div>
            </div>

            {/* Main Interactive Worksheet */}
            <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 md:p-6 shadow-2xs space-y-5">
              {activeHypo ? (
                <>
                  {/* TOP HEADER FIT METER */}
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="space-y-1">
                      <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400 font-mono">Current Analysis Sandbox</span>
                      <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5 leading-none">
                        <Briefcase className="w-4 h-4 text-indigo-600" />
                        {activeHypo.title}
                      </h3>
                    </div>

                    {/* VETTED INDEX */}
                    <div className="grid grid-cols-2 gap-3 text-center md:text-right shrink-0">
                      <div className="bg-white px-3 py-1.5 rounded-lg border border-slate-200/60 shadow-3xs space-y-0.5">
                        <span className="text-[10px] text-emerald-850 font-bold block leading-none">Anchors Found</span>
                        <span className="text-xs font-bold text-slate-700 font-mono">
                          {highAnchors.length} / {totalAnchorsCount}
                        </span>
                      </div>
                      <div className="bg-white px-3 py-1.5 rounded-lg border border-slate-200/60 shadow-3xs space-y-0.5">
                        <span className="text-[10px] text-red-850 font-bold block leading-none">Clash Risks</span>
                        <span className="text-xs font-bold text-slate-700 font-mono">
                          {presentDealbreakers.length} / {totalDealbreakersCount}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* ADVISOR VERDICT BOX */}
                  <div className="rounded-xl border p-4 text-xs flex gap-3 text-slate-900 transition-colors bg-indigo-50/40 border-indigo-150">
                    <Lightbulb className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <h5 className="font-bold text-indigo-950">Hypothesis Sandbox Advisor Verdict</h5>
                      
                      {highAnchors.length === totalAnchorsCount && presentDealbreakers.length === 0 ? (
                        <p className="leading-relaxed">
                          This role matches your criteria <strong>perfectly</strong> based on your estimates! Every core anchor (+2) is likely met, and every dealbreaker is successfully bypassed. This is a very high priority directory to investigate.
                        </p>
                      ) : presentDealbreakers.length > 0 ? (
                        <p className="leading-relaxed">
                          ⚠️ <strong>High Alert:</strong> You identified a <strong>High Risk Clash</strong> with {presentDealbreakers.length} core dealbreaker(s) (e.g. {presentDealbreakers.map(d=>`“${d.text}”`).join(", ")}). You must focus your informational interviews specifically on learning if there are sub-departments or specialized teams that can insulate you from this element.
                        </p>
                      ) : lowAnchors.length > 0 ? (
                        <p className="leading-relaxed">
                          Some core anchors (e.g. {lowAnchors.map(l=>`“${l.text}”`).join(", ")}) are <strong>unlikely</strong> to be satisfied here. Try to search for alternative titles, or ask professionals how they configure their workloads to find these values.
                        </p>
                      ) : (
                        <p className="leading-relaxed text-indigo-900/90">
                          Complete the checklist below to score this career hypothesis. Map out your assumptions about whether each anchor is present or absent in a typical <strong>{activeHypo.title}</strong> role.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* CHANNELS RATING WORKSHEET */}
                  <div className="space-y-3.5">
                    <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block font-mono">
                      Evaluate Alignment Hypotheses
                    </h4>

                    <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                      {/* Anchor items mapping */}
                      {aggregatedAnchors.map((anchor) => {
                        const currentVal = activeHypo.ratings[anchor.id] || "unassessed";
                        return (
                          <div key={anchor.id} className="border border-slate-100 rounded-xl p-3 bg-slate-50/20 hover:bg-slate-50/50 transition-colors space-y-2">
                            <div className="flex items-start justify-between gap-4">
                              <div className="space-y-0.5 max-w-[70%]">
                                <span className="text-[9px] uppercase font-mono font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100/40">
                                  Anchor (+2)
                                </span>
                                <p className="text-xs font-bold text-slate-800 leading-snug">{anchor.text}</p>
                              </div>

                              {/* Button segment controls */}
                              <div className="flex gap-1">
                                <button
                                  type="button"
                                  onClick={() => handleUpdateRating(anchor.id, "high")}
                                  className={`px-2 py-1 rounded text-[10px] font-bold border transition-all ${
                                    currentVal === "high"
                                      ? "bg-emerald-600 border-emerald-600 text-white shadow-3xs hover:bg-emerald-700"
                                      : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                                  }`}
                                  title="Highly likely to be present"
                                >
                                  🟢 Presence
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleUpdateRating(anchor.id, "low")}
                                  className={`px-2 py-1 rounded text-[10px] font-bold border transition-all ${
                                    currentVal === "low"
                                      ? "bg-amber-600 border-amber-600 text-white shadow-3xs hover:bg-amber-700"
                                      : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                                  }`}
                                  title="Unlikely to be present"
                                >
                                  🔴 Absent
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}

                      {/* Dealbreaker items mapping */}
                      {aggregatedDealbreakers.map((db) => {
                        const currentVal = activeHypo.ratings[db.id] || "unassessed";
                        return (
                          <div key={db.id} className="border border-slate-100 rounded-xl p-3 bg-slate-50/20 hover:bg-slate-50/50 transition-colors space-y-2">
                            <div className="flex items-start justify-between gap-4">
                              <div className="space-y-0.5 max-w-[70%]">
                                <span className="text-[9px] uppercase font-mono font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-100/40">
                                  Dealbreaker (-2)
                                </span>
                                <p className="text-xs font-bold text-slate-800 leading-snug">{db.text}</p>
                              </div>

                              {/* Button segment controls */}
                              <div className="flex gap-1">
                                <button
                                  type="button"
                                  onClick={() => handleUpdateRating(db.id, "avoided")}
                                  className={`px-2 py-1 rounded text-[10px] font-bold border transition-all ${
                                    currentVal === "avoided"
                                      ? "bg-emerald-600 border-emerald-600 text-white shadow-3xs"
                                      : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                                  }`}
                                  title="Absent in this role"
                                >
                                  🟢 Avoided
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleUpdateRating(db.id, "present")}
                                  className={`px-2 py-1 rounded text-[10px] font-bold border transition-all ${
                                    currentVal === "present"
                                      ? "bg-rose-600 border-rose-600 text-white shadow-3xs"
                                      : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                                  }`}
                                  title="Present / Active risk"
                                >
                                  🔴 Clash Risk
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              ) : (
                <div className="p-8 text-center border border-dashed border-slate-200 rounded-xl">
                  <p className="text-xs text-slate-500 font-medium">Please select or add a Job Hypothesis sidebar item to carry out testing.</p>
                </div>
              )}
            </div>
          </div>

          {/* SECTION 3: PROFESSIONAL OUTREACH SCRIPT ENGINE */}
          {activeHypo && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                  <UserPlus className="w-4 h-4 text-indigo-600" />
                  2. Outreach Blueprint: Reaching Out to Future Professionals
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Do not rely on guesses alone. Test your <strong>{activeHypo.title}</strong> hypothesis by conducting a 15-minute conversation with real professionals.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1 space-y-3">
                  <div className="space-y-1">
                    <h5 className="text-xs font-bold text-slate-800 uppercase tracking-widest font-mono">Outreach Recipe</h5>
                    <p className="text-xs text-slate-500 leading-normal">
                      Use university database indexes, advisor contacts, or LinkedIn filter options to locate 3-5 alumni currently serving as **{activeHypo.title}**.
                    </p>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded-xl space-y-2 border border-slate-100">
                    <span className="text-[9px] uppercase font-bold text-slate-400 block font-mono">LinkedIn Precision Search Syntax</span>
                    <p className="font-mono text-[10px] text-indigo-950 font-bold bg-white p-2 rounded border border-slate-200 break-normal select-all">
                      "{activeHypo.title}" AND ("{aggregatedAnchors[0] ? aggregatedAnchors[0].text : "alumni"}")
                    </p>
                    <span className="text-[9px] text-slate-400 block">
                      💡 Click search or paste this into search networks to trace live matches.
                    </span>
                  </div>

                  {/* Student Signature Name editor */}
                  <div className="space-y-1.5 pt-1">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                      Personalize Outreach Signature Name
                    </label>
                    <input
                      type="text"
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      placeholder="Your name"
                      className="w-full text-xs font-semibold border border-slate-200 rounded-lg px-2.5 py-2.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                    />
                  </div>
                </div>

                <div className="md:col-span-2 space-y-2.5 flex flex-col justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider font-mono">
                      Tailored Informational Interview Inquiry
                    </span>
                    <div className="bg-slate-900 text-slate-100 p-4 rounded-xl font-mono text-xs relative group whitespace-pre-wrap break-words leading-relaxed select-all border border-slate-800">
                      {compileOutreachHook()}
                      
                      <div className="absolute right-3 top-3">
                        <button
                          type="button"
                          onClick={() => triggerCopy("outreach", compileOutreachHook())}
                          className="p-1.5 bg-slate-800 hover:bg-slate-705 text-slate-300 hover:text-white rounded-lg transition-colors border border-slate-700/50 flex items-center justify-center"
                          title="Copy outreach template to clipboard"
                        >
                          {copiedStates["outreach"] ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  <span className="text-[10px] text-slate-500 block">
                    💡 This template actively injects your key anchors from your custom portfolios to frame high-value inquiries rather than boring, generic 'can I chat' boilerplates.
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 4: BESPOKE QUESTION GUIDE (DOCKABLE / PRINTABLE) */}
          <div id="informational-interview-card" className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-5">
            <div className="border-b border-slate-100 pb-3 flex flex-wrap items-center justify-between gap-2">
              <div className="space-y-0.5">
                <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-indigo-650" />
                  3. Built-To-Order Informational Interview Probe Manual
                </h3>
                <p className="text-xs text-slate-500">
                  Bring these core criteria verification probes to your informal call to evaluate the hypothesis.
                </p>
              </div>

              {/* Utility shortcuts */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onPrint}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-all border border-slate-200 flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print Guide PDF
                </button>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" id="probes-interview-guide">
              {/* Anchor guide items */}
              {aggregatedAnchors.map((item) => {
                const questions = generateAnchorQuestions(item) || [];
                return (
                  <div 
                    key={`guide-${item.id}`} 
                    className="p-4 rounded-xl border border-emerald-100 bg-emerald-50/10 hover:bg-emerald-50/20 transition-colors flex flex-col justify-between space-y-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        {getLensIcon(item.lensKey)}
                        <span className="text-[9px] text-emerald-850 uppercase font-mono font-bold bg-emerald-50 px-1 py-0.5 rounded">
                          Anchor (+2)
                        </span>
                      </div>
                      <div className="text-xs font-bold text-slate-900 leading-snug">
                        “{item.text}”
                      </div>
                    </div>

                    <div className="space-y-2 border-t border-slate-150/40 pt-2 shrink-0">
                      <span className="text-[9px] uppercase font-bold text-slate-450 tracking-wider">Target Probe Question:</span>
                      <p className="text-[11px] text-slate-800 font-medium leading-relaxed italic bg-white p-2.5 rounded border border-emerald-100/30">
                        {questions[0]}
                      </p>
                    </div>

                    <div className="flex items-center justify-end shrink-0 pt-1">
                      <button
                        id={`copy-probe-${item.id}`}
                        onClick={() => triggerCopy(item.id, questions[0])}
                        className="text-[10px] font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1 transition-colors px-1.5 py-1 rounded hover:bg-white border border-transparent hover:border-slate-200"
                      >
                        {copiedStates[item.id] ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-505" /> Copied Probe
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" /> Copy Probe
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}

              {/* Dealbreaker guide items */}
              {aggregatedDealbreakers.map((item) => {
                const questions = generateDealbreakerQuestions(item) || [];
                return (
                  <div 
                    key={`guide-db-${item.id}`} 
                    className="p-4 rounded-xl border border-rose-100 bg-rose-50/10 hover:bg-rose-50/20 transition-colors flex flex-col justify-between space-y-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] text-rose-850 uppercase font-mono font-bold bg-rose-50 px-1 py-0.5 rounded">
                          Dealbreaker (-2)
                        </span>
                      </div>
                      <div className="text-xs font-bold text-slate-900 leading-snug">
                        “{item.text}”
                      </div>
                    </div>

                    <div className="space-y-2 border-t border-slate-150/40 pt-2 shrink-0">
                      <span className="text-[9px] uppercase font-bold text-slate-450 tracking-wider">Protective Shield Probe:</span>
                      <p className="text-[11px] text-slate-800 font-medium leading-relaxed italic bg-white p-2.5 rounded border border-rose-100/30">
                        {questions[0]}
                      </p>
                    </div>

                    <div className="flex items-center justify-end shrink-0 pt-1">
                      <button
                        id={`copy-db-probe-${item.id}`}
                        onClick={() => triggerCopy(item.id, questions[0])}
                        className="text-[10px] font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1 transition-colors px-1.5 py-1 rounded hover:bg-white border border-transparent hover:border-slate-200"
                      >
                        {copiedStates[item.id] ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-rose-505" /> Copied Probe
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" /> Copy Probe
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* PORTABILITY TOOLBOX UNDERLAY */}
      <div className="bg-slate-100/50 border border-slate-200 p-5 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center md:text-left">
          <h4 className="font-bold text-slate-800 text-xs">Portability & Print Services Ready</h4>
          <p className="text-xs text-slate-505 max-w-xl leading-normal">
            Export your entire evaluation coordinates or click the Formatted Print Service to export a premium Letter-size document for offline 1-on-1 advisor sessions.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
          <button
            onClick={onPrint}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold hover:shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            Print Active Sheet
          </button>
          
          <button
            onClick={onDownloadJSON}
            className="px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            Download Workspace JSON
          </button>
        </div>
      </div>

    </div>
  );
}

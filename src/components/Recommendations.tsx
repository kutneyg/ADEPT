/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Compass, 
  HelpCircle, 
  Search, 
  Copy, 
  Check, 
  ArrowUpRight, 
  Printer, 
  Download, 
  Share2, 
  GraduationCap, 
  Layers, 
  Briefcase, 
  MapPin, 
  Fingerprint, 
  UserCheck, 
  Cpu
} from "lucide-react";
import { Experience, LensKey, LENS_METADATA } from "../types";

interface RecommendationsProps {
  experience: Experience;
  onDownloadJSON: () => void;
  onPrint: () => void;
}

export default function Recommendations({
  experience,
  onDownloadJSON,
  onPrint
}: RecommendationsProps) {
  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});
  const [customJobTitle, setCustomJobTitle] = useState("Research Associate");

  // Aggregate +2 elements with lens annotations
  const actionsAnchors = experience.actions.filter(item => item.score === 2);
  const dataAnchors = experience.data.filter(item => item.score === 2);
  const ethosAnchors = experience.ethos.filter(item => item.score === 2);
  const peopleAnchors = experience.people.filter(item => item.score === 2);
  const tangiblesAnchors = experience.tangibles.filter(item => item.score === 2);

  const allAnchors = [
    ...actionsAnchors.map(item => ({ ...item, lensKey: "actions" as LensKey })),
    ...dataAnchors.map(item => ({ ...item, lensKey: "data" as LensKey })),
    ...ethosAnchors.map(item => ({ ...item, lensKey: "ethos" as LensKey })),
    ...peopleAnchors.map(item => ({ ...item, lensKey: "people" as LensKey })),
    ...tangiblesAnchors.map(item => ({ ...item, lensKey: "tangibles" as LensKey }))
  ];

  const triggerCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedStates(prev => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setCopiedStates(prev => ({ ...prev, [id]: false }));
    }, 2000);
  };

  // Generate tailored questions based on +2 lenses
  const generateQuestions = (item: { text: string; lensKey: LensKey }) => {
    const val = item.text;
    switch (item.lensKey) {
      case "actions":
        return [
          `“To what extent will I get to actively engage in [${val}] in this specific position?”`,
          `“In a typical week, what percentage of my hours would be dedicated directly to [${val}]?”`
        ];
      case "data":
        return [
          `“Can you describe the frequency with which the team interfaces with raw topics like [${val}]?”`,
          `“If I am interested in deeper problem-solving involving [${val}], does this pathway support specialized tracks?”`
        ];
      case "ethos":
        return [
          `“Regarding the workflow culture, how does the organization support elements of [${val}] in daily meetings?”`,
          `“Could you share a concrete example of how senior leadership reinforces [${val}] among junior staff?”`
        ];
      case "people":
        return [
          `“How directly will I interact with populations like [${val}] in this work?”`,
          `“In what ways does this department keep its daily actions responsive to the needs of [${val}]?”`
        ];
      case "tangibles":
        return [
          `“What structural guidelines exist inside the workspace to support conditions like [${val}]?”`,
          `“How does the department align performance reviews with the constraints of [${val}]?”`
        ];
    }
  };

  // Compile boolean query
  // Example: ("Research Associate") AND ("infectious disease modeling" OR "clinical assays")
  const generateBooleanQuery = () => {
    const quoteWords = allAnchors.map(i => `"${i.text}"`);
    if (quoteWords.length === 0) {
      return `"${customJobTitle}"`;
    }
    const joinedTerms = quoteWords.join(" AND ");
    return `"${customJobTitle}" AND ${joinedTerms}`;
  };

  const currentQuery = generateBooleanQuery();

  const getLensIcon = (key: LensKey) => {
    switch (key) {
      case "actions": return <Cpu className="w-3.5 h-3.5 text-indigo-600" />;
      case "data": return <Layers className="w-3.5 h-3.5 text-sky-600" />;
      case "ethos": return <Fingerprint className="w-3.5 h-3.5 text-fuchsia-600" />;
      case "people": return <UserCheck className="w-3.5 h-3.5 text-amber-600" />;
      case "tangibles": return <MapPin className="w-3.5 h-3.5 text-emerald-600" />;
    }
  };

  return (
    <div id="recommendations-container" className="space-y-6">
      
      {/* SECTION 3: Strategic Advising Takeaway Banner */}
      <div id="strategic-takeaway-banner" className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl p-6 md:p-8 shadow-md relative overflow-hidden">
        {/* Background ambient light */}
        <div className="absolute right-0 top-0 w-64 h-64 bg-indigo-500/15 rounded-full blur-3xl" />
        
        <div className="relative space-y-4">
          <div className="flex items-center gap-2 text-indigo-300 font-mono text-[10px] uppercase font-bold tracking-widest bg-indigo-900/40 border border-indigo-800 px-3 py-1 rounded-full w-fit">
            <GraduationCap className="w-4 h-4" /> Academic Strategy Takeaway
          </div>

          <div className="space-y-1">
            <h2 className="text-xl md:text-2xl font-semibold tracking-tight">Your Custom Career Hypothesis Model</h2>
            <p className="text-xs text-indigo-200/80 max-w-2xl leading-relaxed">
              Based on the ADEPT deconstruction, your professional seeking coordinates shouldn't start with arbitrary salary boards. To protect your well-being, anchor your future search on serving your target populations within culture structures that fit your nature.
            </p>
          </div>

          {/* Strategic Insight card */}
          <div className="bg-white/5 border border-white/10 p-5 rounded-xl space-y-3">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-1.5 h-3 bg-indigo-400 rounded-sm"></span>
              Recommended Search Anchors
            </h4>

            <div className="grid gap-4 md:grid-cols-2 text-xs">
              <div className="space-y-1">
                <span className="text-indigo-300 font-bold uppercase tracking-wider text-[10px]">Primary Populations Served (+2 People)</span>
                {peopleAnchors.length === 0 ? (
                  <p className="text-indigo-200/60 italic font-mono">[No People anchors logged yet]</p>
                ) : (
                  <ul className="space-y-1 pr-4">
                    {peopleAnchors.map(p => (
                      <li key={p.id} className="text-slate-100 flex items-start gap-1 font-medium">
                        <span className="text-indigo-400 font-bold">•</span>
                        <span>{p.text}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="space-y-1">
                <span className="text-indigo-300 font-bold uppercase tracking-wider text-[10px]">Critical Supportive Environment (+2 Ethos)</span>
                {ethosAnchors.length === 0 ? (
                  <p className="text-indigo-200/60 italic font-mono">[No Ethos culture anchors logged yet]</p>
                ) : (
                  <ul className="space-y-1">
                    {ethosAnchors.map(e => (
                      <li key={e.id} className="text-slate-100 flex items-start gap-1 font-medium">
                        <span className="text-indigo-400 font-bold">•</span>
                        <span>{e.text}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Boolean queries & Job Boards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Search Query string compiler */}
        <div id="search-query-card" className="lg:col-span-2 bg-white rounded-xl border border-slate-100 p-6 shadow-sm space-y-4">
          <div className="space-y-1">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <Search className="w-4 h-4 text-indigo-600" />
              Boolean Search Query Generator
            </h3>
            <p className="text-xs text-slate-500 leading-normal">
              Job boards like Handshake, LinkedIn, and Google Jobs support exact Boolean filtering syntax. We've compiled your <strong>+2 Anchors</strong> into a precision string to bypass generic search results.
            </p>
          </div>

          {/* Interact Option: Refine Role filter */}
          <div className="space-y-1.5">
            <label id="lbl-custom-job-title" className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              1. Interpolate Custom Target Title
            </label>
            <div className="relative">
              <input
                id="input-custom-job-title"
                type="text"
                value={customJobTitle}
                onChange={(e) => setCustomJobTitle(e.target.value)}
                placeholder="e.g. Research Specialist, Lab Intern, Project Manager"
                className="w-full text-xs font-semibold border border-slate-200 rounded-lg px-3 py-2.5 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
              />
            </div>
          </div>

          {/* Compiled Output Section */}
          <div className="space-y-1.5">
            <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              2. Your Compiled Filtering Formula
            </span>
            
            <div className="bg-slate-900 text-slate-105 p-4 rounded-xl font-mono text-xs relative group break-all select-all border border-slate-850">
              <div className="mr-14 leading-relaxed pr-2 font-mono">
                {currentQuery}
              </div>

              <div className="absolute right-3 top-3">
                <button
                  id="btn-copy-boolean-query"
                  onClick={() => triggerCopy("boolean", currentQuery)}
                  className="p-2 bg-slate-800 hover:bg-slate-700 hover:text-white rounded-lg text-slate-400 transition-colors border border-slate-700/50 flex items-center justify-center"
                  title="Copy filter to clipboard"
                >
                  {copiedStates["boolean"] ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
              <span className="text-[10px] text-slate-500">
                💡 Paste this directly into the LinkedIn or Google Jobs search box to filter for exact matches.
              </span>
              
              {/* Direct Link Launchers */}
              <div className="flex items-center gap-2">
                <a
                  href={`https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(currentQuery)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] text-slate-600 bg-slate-100 hover:bg-slate-200 hover:text-slate-800 px-2 py-1.5 rounded-md border border-slate-100 transition-colors flex items-center gap-1 font-bold font-mono"
                >
                  Search LinkedIn <ArrowUpRight className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Portability Toolbox Panel */}
        <div id="portability-toolbox" className="bg-white rounded-xl border border-slate-150 p-6 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-1">
            <h3 className="font-bold text-slate-800 text-sm">
              Portability Toolkit
            </h3>
            <p className="text-xs text-slate-500 leading-normal">
              Export your deconstruct evaluation models so you can review them with an advisor or advisor team.
            </p>
          </div>

          <div className="space-y-2 pt-2">
            {/* Print trigger */}
            <button
              id="recommendations-print-btn"
              type="button"
              onClick={onPrint}
              className="w-full py-3 bg-indigo-650 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-all shadow-2xs flex items-center justify-center gap-2"
            >
              <Printer className="w-4 h-4" />
              Print / Save PDF (Formatted)
            </button>

            {/* JSON Download */}
            <button
              id="recommendations-download-json-btn"
              type="button"
              onClick={onDownloadJSON}
              className="w-full py-3 bg-slate-100 hover:bg-slate-150 text-slate-800 rounded-lg text-xs font-bold transition-all border border-slate-200 flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4 text-slate-600" />
              Download Workspace JSON
            </button>
          </div>

          <div className="bg-slate-50 border border-slate-100 p-3 rounded-lg text-[10px] text-slate-600 leading-normal">
            <strong>Advising Ready:</strong> Our printed layout is custom optimized for standard Letter-size printing. All formulas, notes, and thresholds fit cleanly onto printed sheets.
          </div>
        </div>
      </div>

      {/* SECTION 1: Informational Interview Questions Grid */}
      <div id="informational-interview-card" className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm space-y-4">
        <div className="border-b border-slate-100 pb-3">
          <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-indigo-600" />
            Vesting the Hypotheses: Custom Informational Interview Guide
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            When speaking to alumni, professionals, or supervisors during informational interviews, do not ask basic boilerplate questions. Probe specifically for your <strong>+2 Anchors</strong>.
          </p>
        </div>

        {allAnchors.length === 0 ? (
          <div className="p-8 text-center border border-dashed border-slate-200 rounded-xl bg-slate-50/20">
            <p className="text-xs text-slate-500 font-medium">No active +2 Anchors logged yet.</p>
            <p className="text-[11px] text-slate-400 mt-1 max-w-md mx-auto">
              Suggested questions will automatically generate here once you review your experiences and set variables to <strong className="text-emerald-600">+2 (Essential)</strong>.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" id="probes-interview-guide">
            {allAnchors.map((item) => {
              const questions = generateQuestions(item) || [];
              return (
                <div 
                  key={item.id} 
                  className="p-4 rounded-xl border border-slate-100 bg-slate-50/30 hover:bg-slate-50 transition-colors flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      {getLensIcon(item.lensKey)}
                      <span className="text-[10px] text-slate-400 uppercase font-mono font-bold">
                        {LENS_METADATA[item.lensKey].title.split(" (")[0]} Anchor
                      </span>
                    </div>
                    <div className="text-[11px] font-bold text-slate-900 line-clamp-2">
                      “{item.text}”
                    </div>
                  </div>

                  <div className="space-y-2 border-t border-slate-100 pt-2 shrink-0">
                    <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Suggested Probe Question:</span>
                    <p className="text-[11px] text-indigo-950/90 font-medium leading-relaxed italic bg-indigo-50/50 p-2 rounded border border-indigo-100/30">
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
                          <Check className="w-3 h-3 text-emerald-500" /> Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" /> Copy Probe
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}

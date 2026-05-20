/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { 
  ShieldAlert, 
  Anchor, 
  ArrowRight, 
  Smile, 
  Frown, 
  HelpCircle, 
  Activity, 
  Layers, 
  Compass, 
  AlertTriangle,
  Info
} from "lucide-react";
import { Experience, THRESHOLD_MAP, ThresholdScore, LensKey, LENS_METADATA } from "../types";

interface PatternAnalysisProps {
  experience: Experience;
  onNavigateToLens: (lensKey: LensKey) => void;
  onNextStep: () => void;
}

export default function PatternAnalysis({
  experience,
  onNavigateToLens,
  onNextStep
}: PatternAnalysisProps) {
  
  // Aggregate items across all lenses with metadata about which lens they came from
  const allAggregatedItems = [
    ...experience.actions.map(item => ({ ...item, lensKey: "actions" as LensKey })),
    ...experience.data.map(item => ({ ...item, lensKey: "data" as LensKey })),
    ...experience.ethos.map(item => ({ ...item, lensKey: "ethos" as LensKey })),
    ...experience.people.map(item => ({ ...item, lensKey: "people" as LensKey })),
    ...experience.tangibles.map(item => ({ ...item, lensKey: "tangibles" as LensKey }))
  ];

  // Helper selectors
  const anchors = allAggregatedItems.filter(item => item.score === 2);
  const preferred = allAggregatedItems.filter(item => item.score === 1);
  const neutral = allAggregatedItems.filter(item => item.score === 0);
  const avoid = allAggregatedItems.filter(item => item.score === -1);
  const dealbreakers = allAggregatedItems.filter(item => item.score === -2);

  const totalCount = allAggregatedItems.length;

  const getLensBadgeColor = (key: LensKey) => {
    switch (key) {
      case "actions": return "bg-indigo-50 border-indigo-150 text-indigo-700";
      case "data": return "bg-sky-50 border-sky-150 text-sky-700";
      case "ethos": return "bg-fuchsia-50 border-fuchsia-150 text-fuchsia-700";
      case "people": return "bg-amber-50 border-amber-150 text-amber-700";
      case "tangibles": return "bg-emerald-50 border-emerald-150 text-emerald-700";
    }
  };

  return (
    <div id="pattern-analysis-container" className="space-y-6">
      
      {/* Overview Stat Row */}
      <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-100 pb-4 mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Compass className="w-5 h-5 text-indigo-600" />
              Pattern Analysis Dashboard
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Your aggregated variables mapped into polar vocational coordinates</p>
          </div>
          
          <div className="text-xs text-slate-500 font-medium bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-150 flex items-center gap-2">
            <Activity className="w-4 h-4 text-slate-400" />
            <span>Deconstruction complete: <strong>{totalCount}</strong> elements categorized</span>
          </div>
        </div>

        {/* Score distribution meter */}
        {totalCount === 0 ? (
          <div className="p-4 text-center text-xs text-slate-500 bg-slate-50 rounded-lg">
            No variables found. Go back and log actions, data, culture, colleagues, or settings.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {([2, 1, 0, -1, -2] as const).map((score) => {
              const count = allAggregatedItems.filter(i => i.score === score).length;
              const def = THRESHOLD_MAP[score];
              const pct = totalCount > 0 ? (count / totalCount) * 100 : 0;

              return (
                <div key={score} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 flex flex-col justify-between space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Score {def.shortLabel}</span>
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded" style={{ backgroundColor: def.bgHex, color: def.textHex }}>
                      {count}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-[11px] font-bold text-slate-800 truncate">{def.label.split(" (")[0]}</h4>
                    <div className="w-full bg-slate-200/55 h-1.5 rounded-full mt-1 overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: def.bgHex }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* STEP 3: The Polar Extremes: Anchors (+2) vs Deal Breakers (-2) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left COLUMN: Anchors of your Career Universe (+2) */}
        <div id="anchors-panel" className="bg-emerald-50/20 rounded-2xl border border-emerald-500/20 shadow-sm overflow-hidden flex flex-col justify-between">
          <div>
            {/* Column Banner */}
            <div className="bg-emerald-500/10 px-6 py-5 border-b border-emerald-500/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                  <Anchor className="w-5 h-5 animate-bounce-slow" />
                </div>
                <div>
                  <h3 className="font-bold text-emerald-950 text-sm">Anchors of your Career Universe</h3>
                  <p className="text-[11px] text-emerald-800/80">True Thresholds: These are absolute requirements (+2)</p>
                </div>
              </div>
              <span className="text-xs font-mono font-black text-emerald-700 bg-emerald-100 border border-emerald-200/50 px-2.5 py-1 rounded-full">
                {anchors.length} found
              </span>
            </div>

            {/* List Body */}
            <div className="p-6 space-y-3">
              {anchors.length === 0 ? (
                <div className="bg-white border border-emerald-500/10 rounded-xl p-8 text-center space-y-2">
                  <p className="text-xs text-slate-500 font-medium">No Anchors (+2) logged yet.</p>
                  <p className="text-[11px] text-slate-400 leading-normal max-w-sm mx-auto">
                    Go back to the 5 Lenses setup and rate your absolute favorite, essential variables as <strong className="text-emerald-600">+2</strong>. These will generate your hypothesis tests.
                  </p>
                </div>
              ) : (
                <div className="grid gap-2.5" id="anchors-list-grid">
                  {anchors.map(item => (
                    <div 
                      key={item.id}
                      className="bg-white border border-slate-100 p-3 rounded-xl flex items-start gap-2.5 shadow-2xs hover:border-emerald-500/20 transition-all cursor-pointer"
                      onClick={() => onNavigateToLens(item.lensKey)}
                    >
                      <button 
                        title="Essential Threshold"
                        className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 font-bold font-mono text-xs flex items-center justify-center shrink-0 border border-emerald-100"
                      >
                        +2
                      </button>
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-slate-800 leading-normal">{item.text}</p>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${getLensBadgeColor(item.lensKey)} uppercase font-mono tracking-wide inline-block`}>
                          Lens: {LENS_METADATA[item.lensKey].title.split(" (")[0]}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick advice widget */}
          <div className="p-4 bg-emerald-500/5 border-t border-emerald-500/10 text-[11px] text-emerald-900 leading-relaxed font-normal flex items-start gap-2 m-4 rounded-xl">
            <Smile className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              <strong>Vocational Core:</strong> These elements are non-negotiable anchors. Do not accept a job or post-grad pathway unless these features can be reasonably integrated or validated during due diligence.
            </span>
          </div>
        </div>

        {/* Right COLUMN: Deal Breakers (-2) */}
        <div id="barriers-panel" className="bg-rose-50/20 rounded-2xl border border-rose-500/20 shadow-sm overflow-hidden flex flex-col justify-between">
          <div>
            {/* Column Banner */}
            <div className="bg-rose-500/10 px-6 py-5 border-b border-rose-500/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-xs">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-rose-950 text-sm">Non-Negotiable Deal-Breakers</h3>
                  <p className="text-[11px] text-rose-800/80">True Threshold Barriers: Absolute avoidances (-2)</p>
                </div>
              </div>
              <span className="text-xs font-mono font-black text-rose-700 bg-rose-100 border border-rose-200/50 px-2.5 py-1 rounded-full">
                {dealbreakers.length} found
              </span>
            </div>

            {/* List Body */}
            <div className="p-6 space-y-3">
              {dealbreakers.length === 0 ? (
                <div className="bg-white border border-rose-500/10 rounded-xl p-8 text-center space-y-2">
                  <p className="text-xs text-slate-500 font-medium">No Deal-Breakers (-2) logged.</p>
                  <p className="text-[11px] text-slate-400 leading-normal max-w-sm mx-auto">
                    Go back to the lenses and mark any extreme negatives or toxic environments you suffered as <strong className="text-rose-600">-2</strong>.
                  </p>
                </div>
              ) : (
                <div className="grid gap-2.5" id="dealbreakers-list-grid">
                  {dealbreakers.map(item => (
                    <div 
                      key={item.id}
                      className="bg-white border border-slate-100 p-3 rounded-xl flex items-start gap-2.5 shadow-2xs hover:border-rose-500/20 transition-all cursor-pointer"
                      onClick={() => onNavigateToLens(item.lensKey)}
                    >
                      <button 
                        title="Deal-breaker"
                        className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 font-bold font-mono text-xs flex items-center justify-center shrink-0 border border-rose-100"
                      >
                        -2
                      </button>
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-slate-800 leading-normal">{item.text}</p>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${getLensBadgeColor(item.lensKey)} uppercase font-mono tracking-wide inline-block`}>
                          Lens: {LENS_METADATA[item.lensKey].title.split(" (")[0]}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick advice widget */}
          <div className="p-4 bg-rose-500/5 border-t border-rose-500/10 text-[11px] text-rose-900 leading-relaxed font-normal flex items-start gap-2 m-4 rounded-xl">
            <Frown className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>
              <strong>Professional Boundaries:</strong> These are boundaries where you have historical proof of friction. If an employer suggests these conditions or activities are expected, you are justified to treat it as an structural mismatch.
            </span>
          </div>
        </div>
      </div>

      {/* Middle Section: Preferences (Scores +1 and -1) */}
      <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-4 flex items-center gap-2">
          <span>Preferred vs. Preferred Avoidance Elements (+1 vs -1)</span>
          <span className="text-[10px] text-slate-400 font-normal">These represent soft alignments rather than rigid blockades.</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Preferred Elements */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 text-teal-600">
              <span className="w-2 h-2 rounded-full bg-teal-500"></span>
              Strong Preferences (+1)
            </h4>
            
            {preferred.length === 0 ? (
              <p className="text-xs text-slate-400 bg-slate-50 p-3 rounded-lg border border-slate-100">None logged.</p>
            ) : (
              <div className="max-h-56 overflow-y-auto space-y-1.5 pr-2">
                {preferred.map(item => (
                  <div key={item.id} className="text-xs text-slate-700 bg-slate-50/50 p-2 border border-slate-100 rounded-lg flex items-center justify-between">
                    <span className="line-clamp-1 pr-2">{item.text}</span>
                    <span className="text-[10px] font-mono text-teal-700 bg-teal-50 px-1 rounded font-bold">{LENS_METADATA[item.lensKey].letter}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Avoid Elements */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 text-amber-600">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              Prefer Avoidance (-1)
            </h4>
            
            {avoid.length === 0 ? (
              <p className="text-xs text-slate-400 bg-slate-50 p-3 rounded-lg border border-slate-100">None logged.</p>
            ) : (
              <div className="max-h-56 overflow-y-auto space-y-1.5 pr-2">
                {avoid.map(item => (
                  <div key={item.id} className="text-xs text-slate-700 bg-slate-50/50 p-2 border border-slate-100 rounded-lg flex items-center justify-between">
                    <span className="line-clamp-1 pr-2">{item.text}</span>
                    <span className="text-[10px] font-mono text-amber-700 bg-amber-50 px-1 rounded font-bold">{LENS_METADATA[item.lensKey].letter}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Synthesis Nudge Card */}
      <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-indigo-600 mt-0.5 shrink-0" />
          <div className="space-y-1">
            <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wide">Ready for Career Hypothesis testing?</h4>
            <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
              Based on your polar coordinates (your {anchors.length} Anchors and {dealbreakers.length} Deal-breakers), we have generated structural informational interviews, customized Boolean search keywords, and advising strategic summaries in the next tab to test these hypotheses!
            </p>
          </div>
        </div>

        <button
          id="btn-go-to-recommendations"
          type="button"
          onClick={onNextStep}
          className="px-4 py-2 bg-indigo-650 hover:bg-indigo-755 text-white rounded-lg text-xs font-bold shrink-0 flex items-center gap-1 shadow-xs transition-colors"
        >
          Formulate Hypothesis Tests <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
}

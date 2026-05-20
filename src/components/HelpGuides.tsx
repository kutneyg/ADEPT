/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Info, HelpCircle, ArrowUpRight, ShieldCheck, X } from "lucide-react";
import { LENS_METADATA, THRESHOLD_MAP, ThresholdScore } from "../types";

interface HelpGuidesProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HelpGuides({ isOpen, onClose }: HelpGuidesProps) {
  if (!isOpen) return null;

  return (
    <div id="help-modal-backdrop" className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div 
        id="help-modal-content" 
        className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-slate-100 animate-in fade-in zoom-in duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 text-lg">ADEPT Framework Guide & Definitions</h3>
              <p className="text-xs text-slate-500">Deconstruct finite past experiences to anchor future career hypotheses</p>
            </div>
          </div>
          <button 
            id="close-help-modal-btn"
            onClick={onClose}
            className="p-1 px-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 transition-colors text-sm flex items-center gap-1 border border-slate-100"
          >
            <X className="w-4 h-4" /> Close
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          {/* Quick Context Intro */}
          <div className="bg-indigo-50/50 rounded-xl p-5 border border-indigo-100/50 space-y-2">
            <h4 className="text-sm font-semibold text-indigo-950 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              What is the ADEPT Framework?
            </h4>
            <p className="text-xs text-indigo-900/80 leading-relaxed">
              In career counseling, a completed advising session or class helps clarify that a career is not just low-level salary matching; it is an alignment of finite past variables. Rather than choosing general fields (e.g., "Healthcare"), the ADEPT Framework suggests that analyzing <strong>Five Key Lenses</strong> of your specific lived experiences tells you which components must be present or absent in your future professional roles.
            </p>
          </div>

          {/* Section 1: The Threshold Scale */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <span className="w-1.5 h-4 bg-emerald-500 rounded-full inline-block"></span>
              The 5 Threshold Scale Scores
            </h4>
            <p className="text-xs text-slate-500">
              Every logged action, subject matter topic, or cultural trait needs to be measured strictly against this psychological scale of non-negotiable thresholds:
            </p>
            <div className="grid gap-3 sm:grid-cols-5">
              {(Object.keys(THRESHOLD_MAP) as unknown as ThresholdScore[])
                .sort((a, b) => Number(b) - Number(a))
                .map((scoreKey) => {
                  const def = THRESHOLD_MAP[scoreKey];
                  return (
                    <div 
                      key={scoreKey} 
                      className="border border-slate-100 rounded-xl p-3 space-y-2 hover:border-slate-200 transition-all flex flex-col justify-between"
                      style={{ backgroundColor: def.lightBgHex }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold uppercase py-0.5 px-2 rounded-full inline-block" style={{ backgroundColor: def.bgHex, color: def.textHex }}>
                          {def.shortLabel}
                        </span>
                        <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                      <div className="space-y-1">
                        <h5 className="font-semibold text-slate-900 text-xs">{def.label.split(" (")[0]}</h5>
                        <p className="text-[11px] text-slate-600 leading-normal">{def.description}</p>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Section 2: The Five Lenses */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <span className="w-1.5 h-4 bg-indigo-600 rounded-full inline-block"></span>
              The 5 Analytical Lenses (ADEPT)
            </h4>
            <p className="text-xs text-slate-500">
              Deconstruct your experiences using these strict boundaries:
            </p>
            <div className="space-y-4">
              {Object.values(LENS_METADATA).map((lens) => (
                <div key={lens.key} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors flex flex-col md:flex-row gap-4" id={`lens-guide-${lens.key}`}>
                  {/* Circle Indicator */}
                  <div className="flex md:flex-col items-center justify-center gap-3 md:w-24 shrink-0 border-b md:border-b-0 md:border-r border-slate-200 pb-3 md:pb-0 md:pr-4">
                    <div className="w-12 h-12 rounded-full bg-indigo-600 text-white font-mono font-black text-xl flex items-center justify-center shadow-sm">
                      {lens.letter}
                    </div>
                    <span className="text-xs font-semibold text-slate-600 bg-white px-2 py-0.5 rounded-md border border-slate-100 font-mono">
                      {lens.key.toUpperCase()}
                    </span>
                  </div>

                  {/* Descriptions and Examples */}
                  <div className="flex-1 space-y-3">
                    <div>
                      <h5 className="font-bold text-slate-900 text-sm">{lens.title}</h5>
                      <p className="text-xs text-slate-600 leading-relaxed mt-1">{lens.fullExplanation}</p>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4 pt-1">
                      {/* Placeholders */}
                      <div>
                        <h6 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Typical specific prompts:</h6>
                        <ul className="space-y-1">
                          {lens.placeholders.map((p, i) => (
                            <li key={i} className="text-[11px] text-slate-600 flex items-start gap-1">
                              <span className="text-indigo-400 mt-0.5">•</span>
                              <span>{p}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Example Rating */}
                      <div className="bg-white p-3 rounded-lg border border-slate-100">
                        <h6 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Evaluation Case Sample:</h6>
                        <div className="space-y-2">
                          {lens.examples.slice(0, 2).map((item, idx) => {
                            const mapDef = THRESHOLD_MAP[item.score];
                            return (
                              <div key={idx} className="text-[11px] space-y-0.5">
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] font-mono font-bold px-1.5 rounded" style={{ backgroundColor: mapDef.bgHex, color: mapDef.textHex }}>
                                    {mapDef.shortLabel}
                                  </span>
                                  <span className="font-medium text-slate-800 line-clamp-1">{item.text}</span>
                                </div>
                                {item.reason && (
                                  <p className="text-[10px] text-slate-500 pl-7 italic">“{item.reason}”</p>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end">
          <button 
            id="close-help-footer-btn"
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
          >
            I understand, let's evaluate!
          </button>
        </div>
      </div>
    </div>
  );
}

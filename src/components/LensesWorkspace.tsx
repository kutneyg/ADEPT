/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Briefcase, 
  MapPin, 
  UserCheck, 
  Cpu, 
  Fingerprint, 
  Plus, 
  Trash2, 
  ArrowRight, 
  ChevronRight, 
  HelpCircle, 
  Sparkles, 
  Layers,
  AlertCircle
} from "lucide-react";
import { 
  Experience, 
  LensKey, 
  LENS_METADATA, 
  THRESHOLD_MAP, 
  ThresholdScore, 
  LensItem 
} from "../types";

interface LensesWorkspaceProps {
  experience: Experience;
  onUpdateExperience: (updated: Experience) => void;
  onNextStep: () => void;
}

export default function LensesWorkspace({
  experience,
  onUpdateExperience,
  onNextStep
}: LensesWorkspaceProps) {
  const [activeLens, setActiveLens] = useState<LensKey>("actions");
  const [newItemText, setNewItemText] = useState("");

  const updateField = (key: keyof Experience, value: any) => {
    onUpdateExperience({
      ...experience,
      [key]: value
    });
  };

  const currentLensInfo = LENS_METADATA[activeLens];
  const currentItems = experience[activeLens] as LensItem[];

  const handleAddItem = (presetText?: string) => {
    const textToAdd = (presetText || newItemText).trim();
    if (!textToAdd) return;

    const newItem: LensItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      text: textToAdd,
      score: 1 // Default to preferred (+1) as a starting point
    };

    const updatedItems = [...currentItems, newItem];
    onUpdateExperience({
      ...experience,
      [activeLens]: updatedItems
    });

    if (!presetText) {
      setNewItemText("");
    }
  };

  const handleUpdateItemText = (id: string, text: string) => {
    const updatedItems = currentItems.map(item => 
      item.id === id ? { ...item, text } : item
    );
    onUpdateExperience({
      ...experience,
      [activeLens]: updatedItems
    });
  };

  const handleUpdateItemScore = (id: string, score: ThresholdScore) => {
    const updatedItems = currentItems.map(item => 
      item.id === id ? { ...item, score } : item
    );
    onUpdateExperience({
      ...experience,
      [activeLens]: updatedItems
    });
  };

  const handleDeleteItem = (id: string) => {
    const updatedItems = currentItems.filter(item => item.id !== id);
    onUpdateExperience({
      ...experience,
      [activeLens]: updatedItems
    });
  };

  const getLensIcon = (key: LensKey) => {
    switch (key) {
      case "actions": return <Cpu className="w-4 h-4" />;
      case "data": return <Layers className="w-4 h-4" />;
      case "ethos": return <Fingerprint className="w-4 h-4" />;
      case "people": return <UserCheck className="w-4 h-4" />;
      case "tangibles": return <MapPin className="w-4 h-4" />;
    }
  };

  // Check if current experience is empty across all lenses to display hints
  const totalItemsCount = 
    experience.actions.length + 
    experience.data.length + 
    experience.ethos.length + 
    experience.people.length + 
    experience.tangibles.length;

  return (
    <div id="lenses-workspace-container" className="space-y-6">
      
      {/* STEP 1: Experience setup details */}
      <div id="experience-setup-card" className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm space-y-4">
        <div className="border-b border-slate-100 pb-4">
          <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-slate-900 text-white font-mono flex items-center justify-center text-xs">1</span>
            Experience Baseline Setup
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">Specify which finite past project, job, or event you are evaluating.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Title Input */}
          <div className="md:col-span-2 space-y-1">
            <label id="lbl-experience-title" className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider">Experience Title</label>
            <input
              id="input-experience-title"
              type="text"
              value={experience.title}
              onChange={(e) => updateField("title", e.target.value)}
              placeholder="e.g. Molecular Diagnostic Bioinformatics Assistant"
              className="w-full text-sm border border-slate-200 rounded-lg px-3.5 py-2.5 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-medium text-slate-800"
            />
          </div>

          {/* Type Dropdown */}
          <div className="space-y-1">
            <label id="lbl-experience-type" className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider">Experience Type</label>
            <select
              id="select-experience-type"
              value={experience.type}
              onChange={(e) => updateField("type", e.target.value)}
              className="w-full text-sm border border-slate-200 rounded-lg px-3.5 py-2.5 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-medium text-slate-800"
            >
              <option value="Internship">Internship</option>
              <option value="Academic project">Academic Project</option>
              <option value="Paid employment">Paid Employment</option>
              <option value="Campus leadership">Campus Leadership</option>
              <option value="Volunteer">Volunteer</option>
              <option value="Personal project">Personal Project</option>
              <option value="Other">Other Experience</option>
            </select>
          </div>
        </div>

        {/* Optional Notes */}
        <div className="space-y-1 pt-1">
          <label id="lbl-experience-notes" className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider">Brief Context / Notes (Optional)</label>
          <textarea
            id="textarea-experience-notes"
            value={experience.notes || ""}
            onChange={(e) => updateField("notes", e.target.value)}
            rows={2}
            placeholder="Introduce the responsibilities, level of supervision, or goals of this experience to help anchor your memory."
            className="w-full text-xs border border-slate-200 rounded-lg px-3.5 py-2.5 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-slate-700"
          />
        </div>
      </div>

      {/* STEP 2: The 5 Lenses Workspace */}
      <div id="lenses-workspace-card" className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        
        {/* Header containing tabs */}
        <div className="border-b border-slate-100 bg-slate-50/50 p-6 pb-0">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-slate-900 text-white font-mono flex items-center justify-center text-xs">2</span>
                Apply the 5 Analytical Lenses
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Deconstruct this experience letter-by-letter to extract explicit components.</p>
            </div>
            
            <div className="flex items-center gap-1 bg-indigo-50 px-2 py-1 rounded-lg border border-indigo-100 text-xs font-semibold text-indigo-700 font-mono">
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              <span>{totalItemsCount} total items logged</span>
            </div>
          </div>

          {/* Tab buttons representing the ADEPT acronym */}
          <div className="flex overflow-x-auto gap-1 pt-4 no-scrollbar">
            {(Object.keys(LENS_METADATA) as LensKey[]).map((key) => {
              const info = LENS_METADATA[key];
              const isSelected = activeLens === key;
              const count = (experience[key] as LensItem[]).length;

              return (
                <button
                  key={key}
                  id={`tab-lens-${key}`}
                  onClick={() => {
                    setActiveLens(key);
                    setNewItemText("");
                  }}
                  className={`flex items-center gap-2 px-4 py-3 text-xs font-bold transition-all border-b-2 font-sans rounded-t-lg -mb-px shrink-0 outline-none ${
                    isSelected
                      ? "border-indigo-600 text-indigo-700 bg-white shadow-xs"
                      : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100/50"
                  }`}
                >
                  <span className={`w-5 h-5 rounded-full font-mono flex items-center justify-center text-[10px] font-black shrink-0 ${
                    isSelected ? "bg-indigo-600 text-white" : "bg-slate-200 text-slate-600"
                  }`}>
                    {info.letter}
                  </span>
                  
                  <span className="hidden sm:inline-block">{info.title.split(" (")[0]}</span>
                  <span className="sm:hidden">{info.letter} - {info.key.toUpperCase()}</span>

                  {count > 0 && (
                    <span className={`px-1.5 py-0.2 text-[10px] font-bold rounded-full font-mono ${
                      isSelected ? "bg-indigo-100 text-indigo-800" : "bg-slate-100 text-slate-500"
                    }`}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Workspace Body */}
        <div className="p-6 space-y-6">
          
          {/* Active Lens Description Widget */}
          <div className="flex flex-col md:flex-row md:items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center font-mono font-black text-lg shrink-0">
              {currentLensInfo.letter}
            </div>
            
            <div className="space-y-1">
              <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wide">
                Understanding the "{currentLensInfo.title}" Lens
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {currentLensInfo.fullExplanation}
              </p>
            </div>
          </div>

          {/* Row Addition Input */}
          <div className="space-y-2">
            <h4 className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
              Log a Specific Variable for {currentLensInfo.title.split(" (")[0]} Lens
            </h4>
            
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleAddItem();
              }}
              className="flex gap-2"
            >
              <div className="relative flex-1">
                <input
                  id="input-new-item-text"
                  type="text"
                  value={newItemText}
                  onChange={(e) => setNewItemText(e.target.value)}
                  placeholder={currentLensInfo.placeholders[0]}
                  className="w-full text-xs border border-slate-200 rounded-lg pl-3 pr-10 py-3.5 bg-slate-50/30 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-medium text-slate-800"
                />
                
                {newItemText && (
                  <button
                    type="button"
                    onClick={() => setNewItemText("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1 rounded font-bold transition-colors"
                  >
                    Clear
                  </button>
                )}
              </div>

              <button
                id="btn-add-item-to-lens"
                type="submit"
                disabled={!newItemText.trim()}
                className={`px-4 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all outline-none shrink-0 ${
                  newItemText.trim()
                    ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
                    : "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200/50"
                }`}
              >
                <Plus className="w-4 h-4 shrink-0" />
                Add Variable
              </button>
            </form>

            {/* Quick Presets / Injections */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold mr-1 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-indigo-400" /> Suggestions:
              </span>
              
              {currentLensInfo.placeholders.slice(0, 3).map((promptPlaceholder, i) => {
                const sampleText = promptPlaceholder.replace("e.g., ", "");
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      handleAddItem(sampleText);
                    }}
                    className="text-[10px] text-slate-600 bg-slate-100/50 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 border border-slate-100 px-2 py-1 rounded-md transition-all font-medium whitespace-nowrap"
                  >
                    + {sampleText.length > 30 ? sampleText.substring(0, 27) + "..." : sampleText}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Variables List Grid with Threshold Buttons */}
          <div className="space-y-3 pt-2">
            <h4 className="text-[11px] font-bold text-slate-600 uppercase tracking-wider flex items-center justify-between">
              <span>Currently Logged Variables ({currentItems.length})</span>
              <span className="text-slate-400 hover:text-slate-500 text-[10px] font-normal cursor-help" title="These items store in localStorage under this experience models">
                Local Live Autosave Enabled
              </span>
            </h4>

            {currentItems.length === 0 ? (
              <div className="border border-dashed border-slate-200 rounded-xl p-8 text-center bg-slate-50/20">
                <AlertCircle className="w-6 h-6 text-slate-300 mx-auto mb-2" />
                <p className="text-xs text-slate-500 font-medium">No variables added under this lens yet.</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Type an action or choose an interactive template cue above to populate.</p>
              </div>
            ) : (
              <div className="space-y-3" id="logged-variables-list">
                {currentItems.map((item, index) => {
                  return (
                    <div 
                      key={item.id}
                      className="flex flex-col lg:flex-row items-stretch gap-3 p-3 rounded-xl border border-slate-100 hover:border-slate-200 bg-white shadow-2xs transition-all animate-in fade-in duration-150"
                      id={`item-row-${item.id}`}
                    >
                      {/* Left: Indicator & Editable text input */}
                      <div className="flex-1 flex items-center gap-2">
                        <span className="text-[11px] font-mono font-medium text-slate-400 select-none w-5 shrink-0">
                          #{index + 1}
                        </span>
                        
                        <input
                          id={`edit-item-input-${item.id}`}
                          type="text"
                          value={item.text}
                          onChange={(e) => handleUpdateItemText(item.id, e.target.value)}
                          placeholder="Type or refine logged variable..."
                          className="w-full text-xs font-medium text-slate-850 bg-transparent border-b border-transparent hover:border-slate-200 focus:border-indigo-500 focus:outline-none focus:bg-slate-50/50 py-1 transition-all rounded px-1"
                        />
                      </div>

                      {/* Right: Scores threshold select row buttons */}
                      <div className="flex flex-wrap items-center gap-2 justify-between lg:justify-end border-t lg:border-t-0 border-slate-50 pt-2 lg:pt-0 shrink-0">
                        <span className="text-[10px] font-bold uppercase tracking-wide text-slate-400 mr-2 block lg:hidden">
                          Threshold rating:
                        </span>

                        <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200/50">
                          {([-2, -1, 0, 1, 2] as ThresholdScore[]).map((val) => {
                            const def = THRESHOLD_MAP[val];
                            const isSelected = item.score === val;

                            return (
                              <button
                                key={val}
                                type="button"
                                onClick={() => handleUpdateItemScore(item.id, val)}
                                title={`${def.label}: ${def.description}`}
                                className={`text-[11px] font-bold font-mono px-2.5 py-1.5 rounded-md transition-all outline-none cursor-pointer ${
                                  isSelected
                                    ? `${def.colorClass} scale-105 shadow-xs`
                                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-200/50"
                                }`}
                              >
                                {def.shortLabel}
                              </button>
                            );
                          })}
                        </div>

                        {/* Text explanation label under score */}
                        <div className="hidden xl:block text-[11px] text-slate-500 font-medium w-36 truncate text-center bg-slate-50 py-1.5 px-2 rounded-lg border border-slate-100">
                          {THRESHOLD_MAP[item.score].label.split(" (")[0]}
                        </div>

                        {/* Delete button */}
                        <button
                          id={`delete-item-btn-${item.id}`}
                          type="button"
                          onClick={() => handleDeleteItem(item.id)}
                          title="Delete variable"
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-slate-50 rounded-lg transition-colors border border-transparent hover:border-slate-100"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Workspace Card Footer navigation */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-[11px] text-slate-500 font-medium text-center sm:text-left">
            💡 Tip: Be as specific as possible! Change general words to concrete terms.
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Quick Tab Cycle */}
            <button
              id="btn-cycle-lenses"
              type="button"
              onClick={() => {
                const keys: LensKey[] = ["actions", "data", "ethos", "people", "tangibles"];
                const currIdx = keys.indexOf(activeLens);
                const nextIdx = (currIdx + 1) % keys.length;
                setActiveLens(keys[nextIdx]);
                setNewItemText("");
              }}
              className="w-1/2 sm:w-auto text-center px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border border-slate-200 rounded-lg text-xs font-semibold transition-colors"
            >
              Next Lens Tab
            </button>

            {/* Next Master Step */}
            <button
              id="btn-go-to-pattern-analysis"
              type="button"
              onClick={onNextStep}
              className="w-1/2 sm:w-auto text-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs transition-colors"
            >
              Analyze Dashboard <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

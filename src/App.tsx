/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  GraduationCap, 
  Layers, 
  HelpCircle, 
  Printer, 
  Download, 
  ChevronRight, 
  CheckCircle, 
  AlertCircle, 
  LifeBuoy, 
  RefreshCw,
  Trash2,
  Database,
  Plus
} from "lucide-react";
import { Experience, INITIAL_EXPERIENCES, THRESHOLD_MAP } from "./types";
import HelpGuides from "./components/HelpGuides";
import ExperienceSelector from "./components/ExperienceSelector";
import LensesWorkspace from "./components/LensesWorkspace";
import PatternAnalysis from "./components/PatternAnalysis";
import Recommendations from "./components/Recommendations";

type ActiveStep = "lenses" | "dashboard" | "recommendations";

export default function App() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [activeStep, setActiveStep] = useState<ActiveStep>("lenses");
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [advisorName, setAdvisorName] = useState("");
  const [studentName, setStudentName] = useState("");

  // Step Tracker
  const steps = [
    { key: "lenses" as ActiveStep, label: "1. Deconstruct Lenses", desc: "Log & evaluate variables" },
    { key: "dashboard" as ActiveStep, label: "2. Pattern Analysis", desc: "Review anchors & bounds" },
    { key: "recommendations" as ActiveStep, label: "3. Hypothesis Testing", desc: "Interview guides & queries" }
  ];

  // Load state from localStorage on startup
  useEffect(() => {
    try {
      const persistedExps = localStorage.getItem("adept_experiences_data");
      const persistedSelId = localStorage.getItem("adept_selected_id");
      
      if (persistedExps !== null) {
        const parsed = JSON.parse(persistedExps);
        if (Array.isArray(parsed)) {
          setExperiences(parsed);
          if (persistedSelId && parsed.some(e => e.id === persistedSelId)) {
            setSelectedId(persistedSelId);
          } else if (parsed.length > 0) {
            setSelectedId(parsed[0].id);
          } else {
            setSelectedId("");
          }
          return;
        }
      }
      
      // Fallback to presets if nothing exists
      localStorage.setItem("adept_experiences_data", JSON.stringify(INITIAL_EXPERIENCES));
      localStorage.setItem("adept_selected_id", INITIAL_EXPERIENCES[0].id);
      setExperiences(INITIAL_EXPERIENCES);
      setSelectedId(INITIAL_EXPERIENCES[0].id);
    } catch (err) {
      console.error("Failed to parse local storage state", err);
      setExperiences(INITIAL_EXPERIENCES);
      setSelectedId(INITIAL_EXPERIENCES[0].id);
    }
  }, []);

  // Sync to local storage whenever experiences change
  const handleUpdateExperienceList = (newExps: Experience[]) => {
    setExperiences(newExps);
    localStorage.setItem("adept_experiences_data", JSON.stringify(newExps));
  };

  const currentExperience = experiences.find(e => e.id === selectedId) || null;

  const handleUpdateCurrentExperience = (updated: Experience) => {
    const updatedList = experiences.map(exp => 
      exp.id === updated.id ? updated : exp
    );
    handleUpdateExperienceList(updatedList);
  };

  const handleAddNewExperience = (optTitle?: string, optType?: string) => {
    const newExp: Experience = {
      id: `m-exp-${Date.now()}`,
      title: optTitle || "New Undeclared Experience",
      type: optType || "Internship",
      notes: "",
      dateCreated: new Date().toISOString(),
      actions: [],
      data: [],
      ethos: [],
      people: [],
      tangibles: []
    };
    
    const newList = [newExp, ...experiences];
    handleUpdateExperienceList(newList);
    setSelectedId(newExp.id);
    setActiveStep("lenses");
  };

  const handleDeleteExperience = (idToDelete: string) => {
    const newList = experiences.filter(e => e.id !== idToDelete);
    handleUpdateExperienceList(newList);
    
    // Auto-select remainders
    if (newList.length > 0) {
      setSelectedId(newList[0].id);
    } else {
      setSelectedId("");
    }
  };

  const handleDuplicateExperience = (original: Experience) => {
    const cloned: Experience = {
      ...original,
      id: `clone-${Date.now()}`,
      title: `${original.title} (Copy)`,
      dateCreated: new Date().toISOString()
    };
    const newList = [cloned, ...experiences];
    handleUpdateExperienceList(newList);
    setSelectedId(cloned.id);
  };

  const handleImportJSON = (imported: Experience[]) => {
    const newList = [...imported, ...experiences];
    handleUpdateExperienceList(newList);
    setSelectedId(imported[0].id);
  };

  // Trigger browser workspace JSON download
  const handleDownloadWorkspaceJSON = () => {
    if (!currentExperience) return;
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(currentExperience, null, 2)
    )}`;
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", jsonString);
    
    const formattedFileTitle = (currentExperience.title || "adept")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-");
      
    downloadAnchor.setAttribute("download", `adept-workspace-${formattedFileTitle}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Completely empty the database (ideal for starting fresh or multi-user session changes)
  const handleWipeDatabase = () => {
    if (confirm("Are you sure you want to completely clear out all experiences? This will delete all your local evaluations to start a blank canvas. Please download your workspace as a JSON file first if you wish to keep them!")) {
      localStorage.setItem("adept_experiences_data", JSON.stringify([]));
      localStorage.removeItem("adept_selected_id");
      setExperiences([]);
      setSelectedId("");
      setStudentName("");
      setAdvisorName("");
      setActiveStep("lenses");
      alert("All experiences cleared. The digital workspace is now completely blank.");
    }
  };

  // Reset/Restore the initial benchmark demo data
  const handleRestoreDemoData = () => {
    if (confirm("This will restore the standard pre-populated ADEPT sample models (Academic Research Assistant, Engineering Internship, and Part-Time Retail roles). Any current changes will be overwritten. Do you want to continue?")) {
      localStorage.setItem("adept_experiences_data", JSON.stringify(INITIAL_EXPERIENCES));
      localStorage.setItem("adept_selected_id", INITIAL_EXPERIENCES[0].id);
      setExperiences(INITIAL_EXPERIENCES);
      setSelectedId(INITIAL_EXPERIENCES[0].id);
      setActiveStep("lenses");
      alert("Original sample data has been successfully restored.");
    }
  };

  const triggerUnifiedPrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col antialiased">
      
      {/* ==================== SCREEN SPACE VIEW (HIDDEN ON PRINT) ==================== */}
      <div className="print:hidden flex flex-col flex-grow">
        
        {/* Top University/Adhesive Navigation Navbar */}
        <header id="workspace-master-header" className="bg-slate-900 text-white shadow-md sticky top-0 z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center font-bold tracking-tight shadow-sm shrink-0">
                <GraduationCap className="text-white w-5 h-5" />
              </div>
              <div>
                <h1 className="text-sm font-semibold tracking-tight uppercase text-indigo-300 font-mono">The ADEPT Framework</h1>
                <p className="font-bold text-base leading-none text-white mt-0.5">Student Digital Advising Workspace</p>
              </div>
            </div>

            {/* Micro Toolbar actions */}
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <button
                id="header-help-trigger"
                onClick={() => setIsHelpOpen(true)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 hover:text-white text-slate-300 rounded-lg font-semibold flex items-center gap-1.5 transition-colors border border-slate-700/50"
              >
                <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
                Theory Glossary Guide
              </button>

              <button
                id="header-restore-demo-trigger"
                onClick={handleRestoreDemoData}
                className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 hover:text-indigo-200 text-slate-300 rounded-lg font-semibold flex items-center gap-1.5 transition-colors border border-slate-700/50"
                title="Load pre-populated ADEPT sample models for testing"
              >
                <RefreshCw className="w-3 h-3 text-indigo-400" />
                Load Demo Models
              </button>

              <button
                id="header-wipe-trigger"
                onClick={handleWipeDatabase}
                className="px-2.5 py-1.5 bg-red-950 hover:bg-red-900 hover:text-white text-red-200 rounded-lg font-semibold flex items-center gap-1.5 transition-colors border border-red-800/50"
                title="Completely wipe all experiences to start blank (protects privacy on shared computers)"
              >
                <Trash2 className="w-3 h-3 text-red-400" />
                Clear Current Session
              </button>
            </div>
          </div>
        </header>

        {/* Global Student Metadata input bar */}
        <section id="student-meta-identification" className="bg-white border-b border-slate-100 py-3 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs font-medium">
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-mono">Student Identifier:</span>
              <input 
                id="meta-student-name"
                type="text" 
                placeholder="Type your name..." 
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="border-b border-transparent hover:border-slate-300 focus:border-indigo-500 outline-none text-slate-800 font-semibold px-1 py-0.5 transition-all w-48 text-xs font-mono"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-mono">Assigned Career Advisor:</span>
              <input 
                id="meta-advisor-name"
                type="text" 
                placeholder="Advisor or Class name..." 
                value={advisorName}
                onChange={(e) => setAdvisorName(e.target.value)}
                className="border-b border-transparent hover:border-slate-300 focus:border-indigo-500 outline-none text-slate-800 font-semibold px-1 py-0.5 transition-all w-48 text-xs font-mono"
              />
            </div>

            <div className="text-slate-500 font-mono text-[10px] bg-slate-150 py-0.5 px-2 rounded-md">
              Evaluator Local Date: 2026-05-20
            </div>
          </div>
        </section>

        {/* Primary Container */}
        <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          
          {/* Section 1: Target Experience selector */}
          <ExperienceSelector
            experiences={experiences}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onAddNew={handleAddNewExperience}
            onDelete={handleDeleteExperience}
            onDuplicate={handleDuplicateExperience}
            onImportJSON={handleImportJSON}
            onOpenHelp={() => setIsHelpOpen(true)}
          />

          {/* Stepper Wizard timeline bar */}
          {currentExperience ? (
            <div className="space-y-6">
              <nav id="stepper-wizard-timeline" className="bg-white rounded-xl border border-slate-150 shadow-xs p-1.5 flex flex-col sm:flex-row gap-1">
                {steps.map((s, index) => {
                  const isActive = activeStep === s.key;
                  return (
                    <button
                      key={s.key}
                      id={`stepper-btn-${s.key}`}
                      onClick={() => setActiveStep(s.key)}
                      className={`flex-1 flex items-start gap-3 p-3 rounded-lg text-left transition-all outline-none ${
                        isActive
                          ? "bg-slate-900 text-white"
                          : "bg-transparent text-slate-600 hover:bg-slate-100/60"
                      }`}
                    >
                      <span className={`w-6 h-6 rounded-md font-bold text-xs flex items-center justify-center shrink-0 ${
                        isActive ? "bg-indigo-650 text-white" : "bg-slate-100 text-slate-600"
                      }`}>
                        {index + 1}
                      </span>
                      <div className="space-y-0.5">
                        <h4 className="text-xs font-bold leading-none">{s.label}</h4>
                        <p className={`text-[10px] leading-tight ${isActive ? "text-slate-300" : "text-slate-500"}`}>{s.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </nav>

              {/* Dynamic steps viewer switcher */}
              <div id="active-step-workspace-view">
                {activeStep === "lenses" && (
                  <LensesWorkspace
                    experience={currentExperience}
                    onUpdateExperience={handleUpdateCurrentExperience}
                    onNextStep={() => setActiveStep("dashboard")}
                  />
                )}

                {activeStep === "dashboard" && (
                  <PatternAnalysis
                    experience={currentExperience}
                    onNavigateToLens={(lensKey) => {
                      // Action to bounce back to lenses on a specific lens tab
                      setActiveStep("lenses");
                    }}
                    onNextStep={() => setActiveStep("recommendations")}
                  />
                )}

                {activeStep === "recommendations" && (
                  <Recommendations
                    experience={currentExperience}
                    onDownloadJSON={handleDownloadWorkspaceJSON}
                    onPrint={triggerUnifiedPrint}
                  />
                )}
              </div>
            </div>
          ) : (
            <div className="text-center p-12 bg-white rounded-xl border border-dashed border-slate-200 shadow-2xs space-y-6">
              <AlertCircle className="w-12 h-12 text-slate-350 mx-auto" />
              <div className="space-y-2 max-w-md mx-auto">
                <h3 className="font-bold text-slate-800 text-sm">No evaluation workspaces exist</h3>
                <p className="text-xs text-slate-500">
                  This work area is private to you and completely empty. You can deconstruct a brand new experience from scratch or load the standard demonstration models.
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  id="empty-state-add-experience-btn"
                  onClick={() => handleAddNewExperience("New Undeclared Experience", "Internship")}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Create Blank Experience
                </button>
                <button
                  id="empty-state-load-demo-btn"
                  onClick={handleRestoreDemoData}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg border border-slate-200 transition-colors flex items-center gap-1.5"
                >
                  <Database className="w-3.5 h-3.5 text-indigo-500" />
                  Load Sample Demo Models
                </button>
              </div>
            </div>
          )}
        </main>

        {/* Global Footer */}
        <footer className="bg-white border-t border-slate-100 py-6 mt-12 text-center text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-4 space-y-2">
            <p className="font-semibold text-slate-800">ADEPT Evaluation Framework • Digital Student Portfolio</p>
            <p className="text-[11px] text-slate-400">
              Formulated for 1-on-1 university academic counseling, career exploration advising, and finite experience deconstruction.
            </p>
          </div>
        </footer>

        {/* Global Modal Help Glossary */}
        <HelpGuides isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />

      </div>

      {/* ==================== PRINT ONLY COMPILER LAYOUT (HIDDEN ON SCREEN) ==================== */}
      {currentExperience && (
        <div className="hidden print:block bg-white p-12 text-slate-900 font-sans min-h-screen">
          <div className="max-w-4xl mx-auto space-y-8">
            
            {/* Academic Portfolio Heading Block */}
            <div className="border-b-4 border-slate-900 pb-4 text-center space-y-1">
              <h1 className="text-2xl font-bold tracking-tight uppercase">THE ADEPT EVALUATION WORKSPACE</h1>
              <h2 className="text-sm font-semibold text-slate-700 tracking-wider">OFFICIAL CAREER HYPOTHESIS PORTFOLIO</h2>
              <p className="text-[10px] text-slate-500 italic">Self-Guided Digital Deconstruction Matrix</p>
            </div>

            {/* Print metadata bar */}
            <div className="grid grid-cols-2 gap-4 text-xs font-mono bg-slate-100/60 p-4 border border-slate-200 rounded-lg">
              <div>
                <p><strong>Student Name:</strong> {studentName || "______________________________"}</p>
                <p className="mt-1"><strong>Career Advisor:</strong> {advisorName || "______________________________"}</p>
              </div>
              <div>
                <p><strong>Evaluation Date:</strong> May 20, 2026</p>
                <p className="mt-1"><strong>Evaluation Model:</strong> {currentExperience.title || "Untitled"}</p>
              </div>
            </div>

            {/* Experience baseline notes overview */}
            <div className="space-y-2 border-b border-slate-200 pb-4">
              <h3 className="text-sm font-bold uppercase tracking-wide border-l-4 border-indigo-600 pl-2">1. Experience Summary & Context</h3>
              <p className="text-sm"><strong>Title:</strong> {currentExperience.title || "Untitled"}</p>
              <p className="text-xs"><strong>Type:</strong> {currentExperience.type}</p>
              {currentExperience.notes && (
                <div className="text-xs text-slate-700 bg-slate-50 p-3 rounded border border-slate-150 leading-relaxed font-serif mt-2">
                  <strong>Notes:</strong> {currentExperience.notes}
                </div>
              )}
            </div>

            {/* Continuous Lenses table grid */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wide border-l-4 border-indigo-600 pl-2">2. The 5 Lens Variable Classifications</h3>
              <p className="text-xs text-slate-500">Detailed values scored against the Threshold Scale (+2 to -2):</p>
              
              {/* stack them vertically in print */}
              {(["actions", "data", "ethos", "people", "tangibles"] as const).map((key) => {
                const items = currentExperience[key];
                return (
                  <div key={key} className="space-y-1">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest bg-slate-100 px-2 py-1 select-none">
                      Lens: {key.toUpperCase()}
                    </h4>
                    
                    {items.length === 0 ? (
                      <p className="text-[11px] text-slate-400 italic pl-4">No items logged under this lens.</p>
                    ) : (
                      <table className="w-full text-left text-xs border border-collapse border-slate-200">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200">
                            <th className="p-1 px-2 font-bold w-16">Score</th>
                            <th className="p-1 px-2 font-bold">Classified Deconstructed Variable</th>
                          </tr>
                        </thead>
                        <tbody>
                          {items.map((it) => {
                            const def = THRESHOLD_MAP[it.score];
                            return (
                              <tr key={it.id} className="border-b border-slate-100">
                                <td className="p-1 px-2 font-mono font-bold">{def.shortLabel}</td>
                                <td className="p-1 px-2">{it.text}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Anchors vs barriers print output */}
            <div className="space-y-4 page-break-before">
              <h3 className="text-sm font-bold uppercase tracking-wide border-l-4 border-indigo-600 pl-2">3. Polar Core Coordinates</h3>
              
              <div className="grid grid-cols-2 gap-4">
                {/* Emerald Anchors */}
                <div className="border border-emerald-300 p-4 rounded bg-emerald-50/10 space-y-2">
                  <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wide border-b border-emerald-200 pb-1">Essential Anchors (+2)</h4>
                  <ul className="space-y-1.5 text-xs">
                    {([
                      ...currentExperience.actions,
                      ...currentExperience.data,
                      ...currentExperience.ethos,
                      ...currentExperience.people,
                      ...currentExperience.tangibles
                    ].filter(i => i.score === 2).map((item, idx) => (
                      <li key={idx} className="flex items-start gap-1">
                        <span>•</span>
                        <span>{item.text}</span>
                      </li>
                    )))}
                  </ul>
                </div>

                {/* Crimson deal-breakers */}
                <div className="border border-rose-300 p-4 rounded bg-rose-50/10 space-y-2">
                  <h4 className="text-xs font-bold text-rose-800 uppercase tracking-wide border-b border-rose-200 pb-1">Deal-Breaker Barriers (-2)</h4>
                  <ul className="space-y-1.5 text-xs">
                    {([
                      ...currentExperience.actions,
                      ...currentExperience.data,
                      ...currentExperience.ethos,
                      ...currentExperience.people,
                      ...currentExperience.tangibles
                    ].filter(i => i.score === -2).map((item, idx) => (
                      <li key={idx} className="flex items-start gap-1">
                        <span>•</span>
                        <span>{item.text}</span>
                      </li>
                    )))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Career Hypotheses list print sheet */}
            <div className="space-y-4 pt-4">
              <h3 className="text-sm font-bold uppercase tracking-wide border-l-4 border-indigo-600 pl-2">4. Automated Career Hypothesis Probes</h3>
              <p className="text-xs text-slate-500">Suggested active inquiry lines based on deconstructed thresholds for informational interviews:</p>
              
              <ul className="space-y-3 text-xs">
                {([
                  ...currentExperience.actions.map(it => ({ ...it, lens: "actions" as const })),
                  ...currentExperience.data.map(it => ({ ...it, lens: "data" as const })),
                  ...currentExperience.ethos.map(it => ({ ...it, lens: "ethos" as const })),
                  ...currentExperience.people.map(it => ({ ...it, lens: "people" as const })),
                  ...currentExperience.tangibles.map(it => ({ ...it, lens: "tangibles" as const }))
                ].filter(i => i.score === 2).map((item, index) => {
                  let question = "";
                  if (item.lens === "actions") question = `“To what extent will I get to actively engage in [${item.text}] in this position?”`;
                  else if (item.lens === "data") question = `“Can you describe the frequency with which the team interfaces with raw topics like [${item.text}]?”`;
                  else if (item.lens === "ethos") question = `“Regarding the workflow culture, how does the organization support elements of [${item.text}] in daily meetings?”`;
                  else if (item.lens === "people") question = `“How directly will I interact with populations like [${item.text}] in this work?”`;
                  else if (item.lens === "tangibles") question = `“What structural guidelines exist inside the workspace to support conditions like [${item.text}]?”`;

                  return (
                    <li key={index} className="p-3 bg-slate-50 border border-slate-200 rounded leading-relaxed">
                      <p className="font-bold text-slate-700 uppercase tracking-wide text-[9px]">Probe #{index + 1} ({item.lens.toUpperCase()} Anchor):</p>
                      <p className="font-semibold text-slate-800 text-[11px] mt-0.5">Focus Variable: "{item.text}"</p>
                      <p className="italic text-indigo-900 font-serif mt-1 font-medium pl-3 border-l pb-0.5">
                        {question}
                      </p>
                    </li>
                  );
                }))}
              </ul>
            </div>

            {/* Print Footer signing blocks */}
            <div className="pt-12 border-t border-dashed border-slate-300 text-xs">
              <div className="grid grid-cols-2 gap-12">
                <div>
                  <div className="border-b border-slate-400 h-8" />
                  <p className="mt-1 text-center font-bold text-slate-600">Student Signature / Date</p>
                </div>
                <div>
                  <div className="border-b border-slate-400 h-8" />
                  <p className="mt-1 text-center font-bold text-slate-600">Advisor Endorsement / Date</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

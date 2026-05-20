/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef } from "react";
import { Plus, Trash2, Copy, FileCode, Upload, HelpCircle, Archive, Check } from "lucide-react";
import { Experience, INITIAL_EXPERIENCES } from "../types";

interface ExperienceSelectorProps {
  experiences: Experience[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onAddNew: (title?: string, type?: string) => void;
  onDelete: (id: string) => void;
  onDuplicate: (experience: Experience) => void;
  onImportJSON: (imported: Experience[]) => void;
  onOpenHelp: () => void;
}

export default function ExperienceSelector({
  experiences,
  selectedId,
  onSelect,
  onAddNew,
  onDelete,
  onDuplicate,
  onImportJSON,
  onOpenHelp
}: ExperienceSelectorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleJsonUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        
        // Validation of basic integrity
        const items = Array.isArray(parsed) ? parsed : [parsed];
        const validated: Experience[] = items.map((exp: any, index) => {
          return {
            id: exp.id || `imported-${Date.now()}-${index}`,
            title: exp.title || "Imported Experience",
            type: exp.type || "Internship",
            notes: exp.notes || "",
            dateCreated: exp.dateCreated || new Date().toISOString(),
            actions: Array.isArray(exp.actions) ? exp.actions : [],
            data: Array.isArray(exp.data) ? exp.data : [],
            ethos: Array.isArray(exp.ethos) ? exp.ethos : [],
            people: Array.isArray(exp.people) ? exp.people : [],
            tangibles: Array.isArray(exp.tangibles) ? exp.tangibles : []
          };
        });

        if (validated.length > 0) {
          onImportJSON(validated);
          alert(`Successfully imported ${validated.length} experience(s).`);
        }
      } catch (err) {
        alert("Failed to parse JSON workspace. Please make sure it's a valid ADEPT Framework JSON file.");
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const selectedExp = experiences.find(e => e.id === selectedId) || null;

  return (
    <div id="experience-manager-bar" className="bg-white rounded-xl border border-slate-100 p-5 shadow-sm space-y-4">
      {/* Upper header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <Archive className="w-4 h-4 text-indigo-600" />
            Evaluation Workspaces ({experiences.length})
          </h2>
          <p className="text-xs text-slate-500">Choose a past experience or create a new model to deconstruct</p>
        </div>
        
        {/* Actions row */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Quick Info */}
          <button
            id="open-guide-btn"
            type="button"
            onClick={onOpenHelp}
            className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 rounded-lg text-xs font-medium border border-slate-100 flex items-center gap-1.5 transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5 text-indigo-500" />
            Theoretical Framework Guide
          </button>

          {/* Import JSON */}
          <button
            id="import-workspace-btn"
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 rounded-lg text-xs font-medium border border-slate-100 flex items-center gap-1.5 transition-colors"
          >
            <Upload className="w-3.5 h-3.5 text-emerald-500" />
            Import JSON
          </button>
          <input
            id="import-json-file-input"
            type="file"
            ref={fileInputRef}
            onChange={handleJsonUpload}
            accept=".json"
            className="hidden"
          />

          {/* Add New */}
          <button
            id="create-new-workspace-btn"
            type="button"
            onClick={() => onAddNew()}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            New Experience
          </button>
        </div>
      </div>

      {/* Shared Computer Privacy Notice */}
      <div className="bg-amber-50/70 border border-amber-200/50 rounded-xl p-4 text-xs text-amber-900 flex items-start gap-3">
        <div className="bg-amber-100/80 p-2 rounded-lg text-amber-800 shrink-0 select-none">
          🔒
        </div>
        <div className="space-y-1">
          <h4 className="font-bold text-amber-950 flex items-center gap-1.5">
            Device Isolation & Browser Sandbox Privacy
          </h4>
          <p className="text-amber-900/90 leading-relaxed">
            All evaluation models are stored <strong>strictly on your device's browser local memory (localStorage)</strong>. Other students or advisors using different machines or accounts won't see your work. However, if you are sharing this identical computer terminal, protect your database by clicking <strong>"Clear Current Session"</strong> in the top header bar before leaving, clearing out all active models.
          </p>
        </div>
      </div>

      {/* Selector Grid of Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {experiences.map((exp) => {
          const isSelected = exp.id === selectedId;
          const totalLogged =
            exp.actions.length +
            exp.data.length +
            exp.ethos.length +
            exp.people.length +
            exp.tangibles.length;

          return (
            <div
              key={exp.id}
              onClick={() => onSelect(exp.id)}
              className={`group relative rounded-xl p-4 border transition-all cursor-pointer flex flex-col justify-between h-[105px] ${
                isSelected
                  ? "border-indigo-600 bg-indigo-50/30 ring-1 ring-indigo-100"
                  : "border-slate-100 bg-slate-50/30 hover:bg-slate-50 hover:border-slate-200"
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between gap-1.5">
                  <span className="text-[10px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-100 px-1.5 py-0.5 rounded uppercase font-mono tracking-wide">
                    {exp.type}
                  </span>
                  
                  {isSelected && (
                    <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                      <Check className="w-2.5 h-2.5 shrink-0" /> Active Workspace
                    </span>
                  )}
                </div>
                <h3 className="font-semibold text-slate-800 text-xs line-clamp-1 group-hover:text-slate-900 transition-colors">
                  {exp.title || "Untitled Experience"}
                </h3>
              </div>

              {/* Footer statistics inside card */}
              <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium border-t border-dashed border-slate-100 pt-2 shrink-0">
                <span>{totalLogged} logged variables</span>
                
                {/* Micro Action Buttons */}
                <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity focus-within:opacity-100">
                  <button
                    id={`duplicate-exp-${exp.id}`}
                    title="Duplicate evaluation"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDuplicate(exp);
                    }}
                    className="p-1 hover:text-indigo-600 hover:bg-white rounded transition-all border border-transparent hover:border-slate-200"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                  {experiences.length > 1 && (
                    <button
                      id={`delete-exp-${exp.id}`}
                      title="Delete experience"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`Are you sure you want to delete the evaluation workspace for "${exp.title || "Untitled"}"? This cannot be undone.`)) {
                          onDelete(exp.id);
                        }
                      }}
                      className="p-1 hover:text-red-600 hover:bg-white rounded transition-all border border-transparent hover:border-slate-200"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

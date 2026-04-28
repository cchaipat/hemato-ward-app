"use client";

import { useAppStore } from "@/lib/store";
import { PatientStatus } from "@/lib/types";
import type { SortOption, FilterState } from "@/components/kanban/KanbanBoard";
import { SlidersHorizontal, ArrowUpDown, Filter } from "lucide-react";

const COLUMN_LABELS: { id: PatientStatus; label: string }[] = [
  { id: "waitlist", label: "Waitlist" },
  { id: "admitted", label: "Admitted" },
  { id: "ready_for_discharge", label: "Ready for Discharge" },
];

interface FilterSortBarProps {
  sort: SortOption;
  onSortChange: (sort: SortOption) => void;
  filter: FilterState;
  onFilterChange: (filter: FilterState) => void;
  appliedColumns: Set<PatientStatus>;
  onAppliedColumnsChange: (columns: Set<PatientStatus>) => void;
}

export function FilterSortBar({
  sort,
  onSortChange,
  filter,
  onFilterChange,
  appliedColumns,
  onAppliedColumnsChange,
}: FilterSortBarProps) {
  const { patients } = useAppStore();

  // Check if any filter or sort is actively set (not defaults)
  const isActive =
    sort !== "waitingTime" ||
    !!filter.gender ||
    !!filter.diagnosis ||
    !!filter.urgency;

  const toggleColumn = (colId: PatientStatus) => {
    const next = new Set(appliedColumns);
    if (next.has(colId)) {
      next.delete(colId);
    } else {
      next.add(colId);
    }
    onAppliedColumnsChange(next);
  };

  // Get all unique diagnoses across all patients for the dropdown
  const allDiagnoses = Array.from(
    new Set(patients.map((p) => p.diagnosis || "Unknown"))
  ).sort();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 md:p-5 w-full">
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        {/* Label */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
            <SlidersHorizontal className="h-4 w-4" />
          </div>
          <span className="text-sm font-semibold text-slate-700">
            Filter &amp; Sort
          </span>
        </div>

        {/* Sort dropdown */}
        <div className="flex items-center gap-1.5 shrink-0">
          <ArrowUpDown className="h-3.5 w-3.5 text-slate-400" />
          <select
            className="text-xs border border-slate-200 rounded-lg p-1.5 text-slate-600 bg-white shadow-sm outline-none focus:border-blue-400 cursor-pointer"
            value={sort}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
          >
            <option value="waitingTime">Sort: Waiting Time</option>
            <option value="gender">Sort: Gender</option>
            <option value="diagnosis">Sort: Diagnosis</option>
            <option value="urgency">Sort: Urgency</option>
          </select>
        </div>

        {/* Filter dropdowns */}
        <div className="flex items-center gap-1.5 shrink-0">
          <Filter className="h-3.5 w-3.5 text-slate-400" />
          <div className="flex flex-wrap gap-2">
            <select
              className="text-xs border border-slate-200 rounded-lg p-1.5 text-slate-600 bg-white shadow-sm outline-none focus:border-blue-400 cursor-pointer"
              value={filter.gender || ""}
              onChange={(e) =>
                onFilterChange({ ...filter, gender: e.target.value })
              }
            >
              <option value="">All Genders</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            <select
              className="text-xs border border-slate-200 rounded-lg p-1.5 text-slate-600 bg-white shadow-sm outline-none focus:border-blue-400 cursor-pointer"
              value={filter.urgency || ""}
              onChange={(e) =>
                onFilterChange({ ...filter, urgency: e.target.value })
              }
            >
              <option value="">All Urgencies</option>
              <option value="urgent">Urgent</option>
              <option value="normal">Normal</option>
            </select>
            <select
              className="text-xs border border-slate-200 rounded-lg p-1.5 text-slate-600 bg-white shadow-sm outline-none focus:border-blue-400 cursor-pointer"
              value={filter.diagnosis || ""}
              onChange={(e) =>
                onFilterChange({ ...filter, diagnosis: e.target.value })
              }
            >
              <option value="">All Diagnoses</option>
              {allDiagnoses.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Divider */}
        <div className="hidden md:block w-px h-8 bg-slate-200 mx-1" />

        {/* Apply-to checkboxes */}
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
            Apply to:
          </span>
          {COLUMN_LABELS.map((col) => (
            <label
              key={col.id}
              className={`flex items-center gap-1.5 cursor-pointer select-none group transition-opacity ${
                !isActive ? "opacity-40 pointer-events-none" : "opacity-100"
              }`}
            >
              <input
                type="checkbox"
                checked={appliedColumns.has(col.id)}
                onChange={() => toggleColumn(col.id)}
                disabled={!isActive}
                className="w-3.5 h-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer accent-blue-600"
              />
              <span className="text-xs text-slate-600 group-hover:text-slate-900 transition-colors">
                {col.label}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

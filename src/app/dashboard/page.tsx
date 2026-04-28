"use client";

import { useState, useEffect, useCallback } from "react";
import { KanbanBoard, SortOption, FilterState } from "@/components/kanban/KanbanBoard";
import { BedCapacity } from "@/components/BedCapacity";
import { FilterSortBar } from "@/components/FilterSortBar";
import { PatientStatus } from "@/lib/types";

export default function Home() {
  const [sort, setSort] = useState<SortOption>("waitingTime");
  const [filter, setFilter] = useState<FilterState>({});
  const [appliedColumns, setAppliedColumns] = useState<Set<PatientStatus>>(
    new Set(["waitlist"])
  );

  // Check if any filter or sort is actively set (not defaults)
  const isActive =
    sort !== "waitingTime" ||
    !!filter.gender ||
    !!filter.diagnosis ||
    !!filter.urgency;

  // Auto-check waitlist whenever filter/sort becomes active
  const handleSortChange = useCallback((newSort: SortOption) => {
    setSort(newSort);
    if (newSort !== "waitingTime") {
      setAppliedColumns((prev) => {
        const next = new Set(prev);
        next.add("waitlist");
        return next;
      });
    }
  }, []);

  const handleFilterChange = useCallback((newFilter: FilterState) => {
    setFilter(newFilter);
    const willBeActive =
      !!newFilter.gender || !!newFilter.diagnosis || !!newFilter.urgency;
    if (willBeActive) {
      setAppliedColumns((prev) => {
        const next = new Set(prev);
        next.add("waitlist");
        return next;
      });
    }
  }, []);

  return (
    <div className="p-6 max-w-screen-2xl mx-auto space-y-6">
      
      {/* Top Section: Dashboard Header & Stats */}
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Ward Overview</h2>
          <p className="text-slate-500 mt-1">Manage admissions, priority waitlists, and bed assignments.</p>
        </div>
        
        <BedCapacity />
      </div>

      {/* Filter & Sort Bar */}
      <FilterSortBar
        sort={sort}
        onSortChange={handleSortChange}
        filter={filter}
        onFilterChange={handleFilterChange}
        appliedColumns={appliedColumns}
        onAppliedColumnsChange={setAppliedColumns}
      />

      {/* Main Kanban Board */}
      <div>
        <KanbanBoard
          sort={sort}
          filter={filter}
          appliedColumns={appliedColumns}
        />
      </div>

    </div>
  );
}

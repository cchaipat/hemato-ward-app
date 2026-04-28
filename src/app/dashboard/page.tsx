import { KanbanBoard } from "@/components/kanban/KanbanBoard";
import { BedCapacity } from "@/components/BedCapacity";

export default function Home() {
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

      {/* Main Kanban Board */}
      <div className="mt-8">
        <KanbanBoard />
      </div>

    </div>
  );
}

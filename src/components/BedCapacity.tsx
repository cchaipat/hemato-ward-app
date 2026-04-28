"use client";

import { useAppStore } from "@/lib/store";
import { BedDouble, CheckCircle2 } from "lucide-react";

export function BedCapacity() {
  const { beds } = useAppStore();

  const totalBeds = beds.length;
  const occupiedBeds = beds.filter(b => b.isOccupied).length;
  const availableBeds = totalBeds - occupiedBeds;

  const vipAvailable = beds.filter(b => b.type === 'VIP' && !b.isOccupied).length;
  const hepaAvailable = beds.filter(b => b.type === 'Intensive CMT (HEPA)' && !b.isOccupied).length;
  const genAvailable = beds.filter(b => b.type === 'General CMT' && !b.isOccupied).length;
  const isoAvailable = beds.filter(b => b.type === 'Isolation' && !b.isOccupied).length;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 w-full flex flex-col md:flex-row items-center gap-6">
      
      {/* Primary Stat */}
      <div className="flex items-center gap-4 pr-6 border-r border-slate-200">
        <div className={`p-3 rounded-xl ${availableBeds > 0 ? 'bg-blue-50 text-blue-600' : 'bg-red-50 text-red-600'}`}>
          <BedDouble className="h-6 w-6" />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-500">Available Beds</p>
          <p className="text-2xl font-bold text-slate-900">
            {availableBeds} <span className="text-lg font-medium text-slate-400">/ {totalBeds}</span>
          </p>
        </div>
      </div>

      {/* Secondary Stats */}
      <div className="flex flex-1 items-center gap-6 overflow-x-auto whitespace-nowrap">
        <StatItem label="Intensive (HEPA)" count={hepaAvailable} total={beds.filter(b => b.type === 'Intensive CMT (HEPA)').length} />
        <StatItem label="General CMT" count={genAvailable} total={beds.filter(b => b.type === 'General CMT').length} />
        <StatItem label="VIP Room" count={vipAvailable} total={beds.filter(b => b.type === 'VIP').length} />
        <StatItem label="Isolation" count={isoAvailable} total={beds.filter(b => b.type === 'Isolation').length} />
      </div>

    </div>
  );
}

function StatItem({ label, count, total }: { label: string, count: number, total: number }) {
  const isFull = count === 0;

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-1.5">
        <div className={`w-2 h-2 rounded-full ${isFull ? 'bg-slate-300' : 'bg-green-500'}`} />
        <span className="text-sm font-medium text-slate-700">{label}</span>
      </div>
      <span className="text-xs text-slate-500 font-medium pl-3.5 mt-0.5">
        {count} vacant (of {total})
      </span>
    </div>
  );
}

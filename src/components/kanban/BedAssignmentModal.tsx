"use client";

import { Bed } from "@/lib/types";
import { X } from "lucide-react";

interface BedAssignmentModalProps {
  beds: Bed[];
  onAssign: (bedId: string) => void;
  onClose: () => void;
}

export function BedAssignmentModal({ beds, onAssign, onClose }: BedAssignmentModalProps) {
  const availableBeds = beds.filter(b => !b.isOccupied);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        <div className="flex justify-between items-center p-5 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800">Assign a Bed</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-5">
          {availableBeds.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <p>No beds currently available.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {availableBeds.map(bed => (
                <button
                  key={bed.id}
                  onClick={() => onAssign(bed.id)}
                  className="flex flex-col items-start p-3 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition-all text-left group"
                >
                  <span className="font-bold text-slate-700 group-hover:text-blue-700">{bed.name}</span>
                  <span className="text-xs font-medium text-slate-500 mt-1">{bed.type}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="p-5 border-t border-slate-100 bg-slate-50">
          <p className="text-xs text-slate-500 text-center">Select an available bed to confirm patient admission.</p>
        </div>
      </div>
    </div>
  );
}

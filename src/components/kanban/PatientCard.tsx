"use client";

import { useState } from "react";

import { Draggable } from "@hello-pangea/dnd";
import { Patient, PatientStatus } from "@/lib/types";
import { cn } from "@/lib/utils";
import { AlertCircle, Calendar, BedDouble, User, Pencil, ChevronRight, ChevronLeft, LogOut } from "lucide-react";
import { format } from "date-fns";
import { useAppStore } from "@/lib/store";
import { MessageSquareText } from "lucide-react";

interface PatientCardProps {
  patient: Patient;
  index: number;
  isDragDisabled: boolean;
  onEdit?: (patient: Patient) => void;
  onReassignBed?: (patient: Patient) => void;
  onMove?: (patient: Patient, newStatus: PatientStatus) => void;
}

export function PatientCard({ patient, index, isDragDisabled, onEdit, onReassignBed, onMove }: PatientCardProps) {
  const isWaitlist = patient.status === 'waitlist';
  const beds = useAppStore(state => state.beds);
  const [showConfirm, setShowConfirm] = useState(false);
  
  const assignedBed = patient.assignedBedId ? beds.find(b => b.id === patient.assignedBedId) : null;
  const bedName = assignedBed ? assignedBed.name : 'Unknown Bed';

  return (
    <Draggable draggableId={patient.id} index={index} isDragDisabled={isDragDisabled}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={cn(
            "bg-white p-4 rounded-xl shadow-sm border border-slate-200 transition-all mb-3 text-left w-full group",
            patient.sex === 'Male' ? "border-l-4 border-l-blue-400" : "border-l-4 border-l-pink-400",
            snapshot.isDragging && "shadow-lg border-blue-400 rotate-2 scale-105 z-50",
            !isDragDisabled && !showConfirm && "hover:border-blue-300 cursor-grab active:cursor-grabbing",
            (isDragDisabled || showConfirm) && "cursor-default"
          )}
        >
          {showConfirm ? (
            <div className="flex flex-col items-center justify-center py-2 text-center space-y-3 animate-in fade-in zoom-in duration-200">
              <LogOut className="h-8 w-8 text-slate-400 mb-1" />
              <div>
                <p className="font-bold text-slate-800">Archive Patient?</p>
                <p className="text-xs text-slate-500 mt-1 px-2">This will remove {patient.name} from the board.</p>
              </div>
              <div className="flex gap-2 mt-2 w-full">
                <button 
                  onClick={(e) => { e.stopPropagation(); setShowConfirm(false); }} 
                  className="flex-1 py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    if (onMove) onMove(patient, 'discharged'); 
                  }} 
                  className="flex-1 py-1.5 px-3 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  Confirm D/C
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Header Row */}
              <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-bold text-slate-800 flex items-center gap-1.5">
                {patient.isUrgent && <AlertCircle className="h-4 w-4 text-red-500 fill-red-500" />}
                {patient.patientTitle ? `${patient.patientTitle} ` : ""}{patient.name}
              </h3>
              <p className="text-xs text-slate-500 font-medium">HN: {patient.hn} • {patient.sex}</p>
            </div>
            
            <div className="flex items-center gap-2">
              {isWaitlist && patient.priorityScore > 0 && (
                <div className={cn(
                  "px-2 py-0.5 rounded text-xs font-bold",
                  patient.isUrgent || patient.priorityScore >= 8 ? "bg-red-100 text-red-700" :
                  patient.priorityScore >= 5 ? "bg-orange-100 text-orange-700" :
                  "bg-blue-100 text-blue-700"
                )}>
                  P-{patient.priorityScore}
                </div>
              )}
              
              {!isDragDisabled && onEdit && (
                <button 
                  onClick={(e) => { e.stopPropagation(); onEdit(patient); }}
                  className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                  title="Edit Patient"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Clinical Info */}
          <div className="space-y-1.5 mt-3">
            <p className="text-sm font-medium text-slate-700 truncate">
              {patient.diagnosis}
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                {patient.regimen} {patient.cycle > 0 ? `(C${patient.cycle})` : ''}
              </span>
              {patient.isInduction && (
                <span className="bg-purple-100 text-purple-700 font-medium px-1.5 py-0.5 rounded border border-purple-200">
                  Induction
                </span>
              )}
            </div>
            {patient.remark && (
              <div className="flex items-start gap-1.5 text-xs text-slate-500 bg-slate-50 p-1.5 rounded-md border border-slate-100 mt-1">
                <MessageSquareText className="h-3.5 w-3.5 shrink-0 mt-0.5 text-slate-400" />
                <span className="line-clamp-2">{patient.remark}</span>
              </div>
            )}
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
             <div className="flex items-center gap-1">
                <User className="h-3.5 w-3.5" />
                <span className="truncate max-w-[80px]">{patient.clinician}</span>
             </div>
             
             {isWaitlist && patient.expectedCmtDate ? (
               <div className="flex items-center gap-1 text-slate-600">
                 <Calendar className="h-3.5 w-3.5" />
                 <span>{format(new Date(patient.expectedCmtDate), 'MMM d, yyyy')}</span>
               </div>
             ) : patient.assignedBedId ? (
               <div 
                 onClick={(e) => { 
                   if (!isDragDisabled && onReassignBed) {
                     e.stopPropagation(); 
                     onReassignBed(patient); 
                   }
                 }}
                 className={cn(
                   "flex items-center gap-1 font-medium px-2 py-0.5 rounded",
                   !isDragDisabled && onReassignBed ? "text-blue-700 bg-blue-100 hover:bg-blue-200 cursor-pointer transition-colors" : "text-blue-600 bg-blue-50"
                 )}
                 title={!isDragDisabled ? "Click to reassign bed" : undefined}
               >
                 <BedDouble className="h-3.5 w-3.5" />
                 <span>{bedName}</span>
               </div>
             ) : <div />}

             {!isDragDisabled && onMove && (
               <div className="flex items-center gap-1">
                 <button 
                   onClick={(e) => {
                     e.stopPropagation();
                     const order: PatientStatus[] = ['waitlist', 'admitted', 'ready_for_discharge'];
                     const idx = order.indexOf(patient.status);
                     if (idx > 0) onMove(patient, order[idx - 1]);
                   }}
                   disabled={patient.status === 'waitlist'}
                   className="p-1 rounded bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                   title="Move to previous stage"
                 >
                   <ChevronLeft className="h-4 w-4" />
                 </button>
                 
                 {patient.status === 'ready_for_discharge' ? (
                   <button 
                     onClick={(e) => {
                       e.stopPropagation();
                       setShowConfirm(true);
                     }}
                     className="p-1 rounded bg-green-100 text-green-700 hover:bg-green-200 transition-colors flex items-center gap-1 pl-1 pr-2 font-medium"
                     title="Discharge Patient (Archive)"
                   >
                     <LogOut className="h-4 w-4" />
                     <span>D/C</span>
                   </button>
                 ) : (
                   <button 
                     onClick={(e) => {
                       e.stopPropagation();
                       const order: PatientStatus[] = ['waitlist', 'admitted', 'ready_for_discharge'];
                       const idx = order.indexOf(patient.status);
                       if (idx < order.length - 1) onMove(patient, order[idx + 1]);
                     }}
                     className="p-1 rounded bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                     title="Move to next stage"
                   >
                     <ChevronRight className="h-4 w-4" />
                   </button>
                 )}
               </div>
             )}
          </div>
          </>
        )}
        </div>
      )}
    </Draggable>
  );
}

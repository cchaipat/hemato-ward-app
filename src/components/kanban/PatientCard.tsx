"use client";

import { Draggable } from "@hello-pangea/dnd";
import { Patient } from "@/lib/types";
import { cn } from "@/lib/utils";
import { AlertCircle, Calendar, BedDouble, User, Pencil } from "lucide-react";
import { format } from "date-fns";

interface PatientCardProps {
  patient: Patient;
  index: number;
  isDragDisabled: boolean;
  onEdit?: (patient: Patient) => void;
}

export function PatientCard({ patient, index, isDragDisabled, onEdit }: PatientCardProps) {
  const isWaitlist = patient.status === 'waitlist';
  
  return (
    <Draggable draggableId={patient.id} index={index} isDragDisabled={isDragDisabled}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={cn(
            "bg-white p-4 rounded-xl shadow-sm border border-slate-200 transition-all mb-3 text-left w-full group",
            snapshot.isDragging && "shadow-lg border-blue-400 rotate-2 scale-105 z-50",
            !isDragDisabled && "hover:border-blue-300 cursor-grab active:cursor-grabbing",
            isDragDisabled && "cursor-default"
          )}
        >
          {/* Header Row */}
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-bold text-slate-800 flex items-center gap-1.5">
                {patient.isUrgent && <AlertCircle className="h-4 w-4 text-red-500 fill-red-500" />}
                {patient.name}
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
               <div className="flex items-center gap-1 font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                 <BedDouble className="h-3.5 w-3.5" />
                 <span>Bed Assigned</span>
                 {/* Note: We would ideally join the string "VIP-1" here but we have the ID only in patient. 
                     We can lookup in the KanbanBoard or pass it in via props later if needed */}
               </div>
             ) : null}
          </div>
        </div>
      )}
    </Draggable>
  );
}

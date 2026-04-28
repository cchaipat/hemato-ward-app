"use client";

import { useEffect, useState } from "react";
import { DragDropContext, Droppable, DropResult } from "@hello-pangea/dnd";
import { useAppStore } from "@/lib/store";
import { PatientStatus, Bed, Patient } from "@/lib/types";
import { PatientCard } from "./PatientCard";
import { BedAssignmentModal } from "./BedAssignmentModal";
import { AddPatientModal } from "./AddPatientModal";
import { EditPatientModal } from "./EditPatientModal";
import { ExportRecordsModal } from "./ExportRecordsModal";
import { Plus, Download } from "lucide-react";
import * as XLSX from "xlsx";
import { isWithinInterval, startOfDay, endOfDay } from "date-fns";

export type SortOption = 'waitingTime' | 'gender' | 'diagnosis' | 'urgency';
export type FilterState = { gender?: string; diagnosis?: string; urgency?: string };

const COLUMNS: { id: PatientStatus; title: string; color: string }[] = [
  { id: 'waitlist', title: 'Waitlist', color: 'bg-slate-50 border-slate-200' },
  { id: 'admitted', title: 'Admitted', color: 'bg-blue-50/50 border-blue-100' },
  { id: 'ready_for_discharge', title: 'Ready for Discharge', color: 'bg-orange-50/50 border-orange-100' },
];

interface KanbanBoardProps {
  sort: SortOption;
  filter: FilterState;
  appliedColumns: Set<PatientStatus>;
}

export function KanbanBoard({ sort, filter, appliedColumns }: KanbanBoardProps) {
  const { patients, beds, userRole, movePatient } = useAppStore();
  const [mounted, setMounted] = useState(false);
  
  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [pendingMove, setPendingMove] = useState<{ patientId: string; destinationStatus: PatientStatus } | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    
    const patientId = result.draggableId;
    const patientObj = patients.find(p => p.id === patientId);
    const sourceStatus = result.source.droppableId as PatientStatus;
    const destinationStatus = result.destination.droppableId as PatientStatus;

    if (!patientObj || sourceStatus === destinationStatus) return;

    // Prevent direct move from waitlist to ready_for_discharge or discharged
    if (sourceStatus === 'waitlist' && (destinationStatus === 'ready_for_discharge' || destinationStatus === 'discharged')) {
      return; 
    }

    // Modal case: Dropping into Admitted column and they don't currently have a bed
    if (destinationStatus === 'admitted' && !patientObj.assignedBedId) {
      setPendingMove({ patientId, destinationStatus });
      setModalOpen(true);
      return;
    }

    // Otherwise, move immediately
    movePatient(patientId, destinationStatus);
  };

  const handleBedAssigned = (bedId: string) => {
    if (pendingMove) {
      movePatient(pendingMove.patientId, pendingMove.destinationStatus, bedId);
    }
    setModalOpen(false);
    setPendingMove(null);
  };

  if (!mounted) return <div className="h-96 flex items-center justify-center">Loading board...</div>;

  const isDragDisabled = userRole === 'viewer';

  const handleExport = (startDateStr: string, endDateStr: string) => {
    const start = startOfDay(new Date(startDateStr));
    const end = endOfDay(new Date(endDateStr));

    const filterByDate = (p: Patient) => {
      // If addedAt doesn't exist, we fallback to a 0 epoch date so it can be filtered out
      const pDate = new Date(p.addedAt || 0);
      return isWithinInterval(pDate, { start, end });
    };

    const formatPatient = (p: Patient) => ({
      "Date Added": p.addedAt ? p.addedAt.split('T')[0] : 'Unknown',
      "HN": p.hn,
      "Title": p.patientTitle || '',
      "Name": p.name,
      "Sex": p.sex,
      "Diagnosis": p.diagnosis,
      "Regimen": p.regimen,
      "Cycle": p.cycle,
      "Induction": p.isInduction ? 'Yes' : 'No',
      "Expected Date": p.expectedCmtDate || '',
      "Intention": p.treatmentIntention,
      "Priority Score": p.priorityScore,
      "Clinician": p.clinician,
      "Remark": p.remark || '',
      "Bed": p.assignedBedId ? beds.find(b => b.id === p.assignedBedId)?.name : '',
      "Urgent": p.isUrgent ? 'Yes' : 'No',
    });

    const waitlist = patients.filter(p => p.status === 'waitlist' && filterByDate(p)).map(formatPatient);
    const admitted = patients.filter(p => p.status === 'admitted' && filterByDate(p)).map(formatPatient);
    const ready = patients.filter(p => p.status === 'ready_for_discharge' && filterByDate(p)).map(formatPatient);
    const discharged = patients.filter(p => p.status === 'discharged' && filterByDate(p)).map(formatPatient);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(waitlist), "Waitlist");
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(admitted), "Admitted");
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(ready), "Ready for Discharge");
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(discharged), "Discharged (Archive)");

    XLSX.writeFile(wb, `Hemato_Ward_Export_${startDateStr}_to_${endDateStr}.xlsx`);
    setExportModalOpen(false);
  };

  // Sort and filter patients based on applied columns
  const getSortedPatients = (status: PatientStatus) => {
    let filtered = patients.filter((p) => p.status === status);
    
    if (appliedColumns.has(status)) {
      // Filter
      if (filter.gender) {
        filtered = filtered.filter(p => p.sex === filter.gender);
      }
      if (filter.diagnosis) {
        filtered = filtered.filter(p => p.diagnosis === filter.diagnosis);
      }
      if (filter.urgency) {
        if (filter.urgency === 'urgent') {
          filtered = filtered.filter(p => p.isUrgent);
        } else {
          filtered = filtered.filter(p => !p.isUrgent);
        }
      }

      // Sort
      filtered.sort((a, b) => {
        if (sort === 'waitingTime') {
          const dateA = new Date(a.addedAt || a.expectedCmtDate || 0).getTime();
          const dateB = new Date(b.addedAt || b.expectedCmtDate || 0).getTime();
          return dateA - dateB;
        } else if (sort === 'gender') {
          return (a.sex || '').localeCompare(b.sex || '');
        } else if (sort === 'diagnosis') {
          return (a.diagnosis || '').localeCompare(b.diagnosis || '');
        } else if (sort === 'urgency') {
          if (a.isUrgent && !b.isUrgent) return -1;
          if (!a.isUrgent && b.isUrgent) return 1;
          return b.priorityScore - a.priorityScore;
        }
        return 0;
      });
    }
    return filtered;
  };

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex overflow-x-auto md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 h-[calc(100vh-230px)] snap-x snap-mandatory pb-4 md:pb-0">
          {COLUMNS.map((column) => {
            const columnPatients = getSortedPatients(column.id);
            return (
              <div key={column.id} className="flex flex-col h-full min-w-[85vw] md:min-w-0 snap-center">
                <div className="flex items-center justify-between mb-3 px-1">
                  <h2 className="font-semibold text-slate-700">{column.title}</h2>
                  <div className="flex items-center gap-2">
                    {column.id === 'waitlist' && (
                      <>
                        <button onClick={() => setExportModalOpen(true)} className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-1 rounded-md transition-colors border border-slate-300" title="Export Records">
                          <Download className="h-4 w-4" />
                        </button>
                        <button onClick={() => setAddModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white p-1 rounded-md transition-colors" title="Add Patient">
                          <Plus className="h-4 w-4" />
                        </button>
                      </>
                    )}
                    <span className="bg-slate-200 text-slate-600 text-xs font-bold px-2 py-0.5 rounded-full">
                      {columnPatients.length}
                    </span>
                  </div>
                </div>
                
                <Droppable droppableId={column.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex-1 rounded-xl border p-3 md:p-4 overflow-y-auto transition-colors ${column.color} ${snapshot.isDraggingOver ? 'ring-2 ring-blue-400 ring-opacity-50' : ''}`}
                    >
                      {columnPatients.map((patient, index) => (
                        <PatientCard 
                          key={patient.id} 
                          patient={patient} 
                          index={index} 
                          isDragDisabled={isDragDisabled} 
                          onEdit={setEditingPatient}
                          onReassignBed={(p) => {
                            setPendingMove({ patientId: p.id, destinationStatus: p.status });
                            setModalOpen(true);
                          }}
                          onMove={(p, newStatus) => {
                            // If trying to move to a status that's not on the board anymore, ignore (handled in PatientCard)
                            if (!COLUMNS.find(c => c.id === newStatus) && newStatus !== 'discharged') return;
                            
                            if (newStatus === 'admitted' && p.status !== 'ready_for_discharge') {
                              setPendingMove({ patientId: p.id, destinationStatus: newStatus });
                              setModalOpen(true);
                            } else {
                              movePatient(p.id, newStatus);
                            }
                          }}
                        />
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>

      {modalOpen && (
        <BedAssignmentModal 
          beds={beds}
          onAssign={handleBedAssigned} 
          onClose={() => {
            setModalOpen(false);
            setPendingMove(null);
          }} 
        />
      )}

      {addModalOpen && (
        <AddPatientModal onClose={() => setAddModalOpen(false)} />
      )}

      {exportModalOpen && (
        <ExportRecordsModal onClose={() => setExportModalOpen(false)} onExport={handleExport} />
      )}

      {editingPatient && (
        <EditPatientModal patient={editingPatient} onClose={() => setEditingPatient(null)} />
      )}
    </>
  );
}

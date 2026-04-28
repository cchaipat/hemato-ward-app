"use client";

import { useEffect, useState } from "react";
import { DragDropContext, Droppable, DropResult } from "@hello-pangea/dnd";
import { useAppStore } from "@/lib/store";
import { PatientStatus, Bed } from "@/lib/types";
import { PatientCard } from "./PatientCard";
import { BedAssignmentModal } from "./BedAssignmentModal";
import { AddPatientModal } from "./AddPatientModal";
import { EditPatientModal } from "./EditPatientModal";
import { Plus } from "lucide-react";

const COLUMNS: { id: PatientStatus; title: string; color: string }[] = [
  { id: 'waitlist', title: 'Waitlist', color: 'bg-slate-50 border-slate-200' },
  { id: 'admitted', title: 'Admitted', color: 'bg-blue-50/50 border-blue-100' },
  { id: 'ready_for_discharge', title: 'Ready for Discharge', color: 'bg-orange-50/50 border-orange-100' },
  { id: 'discharged', title: 'Discharged', color: 'bg-green-50/50 border-green-100' },
];

export function KanbanBoard() {
  const { patients, beds, userRole, movePatient } = useAppStore();
  const [mounted, setMounted] = useState(false);
  
  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [pendingMove, setPendingMove] = useState<{ patientId: string; destinationStatus: PatientStatus } | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    
    const patientId = result.draggableId;
    const sourceStatus = result.source.droppableId as PatientStatus;
    const destinationStatus = result.destination.droppableId as PatientStatus;

    if (sourceStatus === destinationStatus) return;

    // Special case: Dropping into Admitted column
    if (destinationStatus === 'admitted' && sourceStatus !== 'ready_for_discharge') {
      // Need bed assignment
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

  // Sort waitlist by priority
  const getSortedPatients = (status: PatientStatus) => {
    let filtered = patients.filter((p) => p.status === status);
    if (status === 'waitlist') {
      filtered.sort((a, b) => b.priorityScore - a.priorityScore);
    }
    return filtered;
  };

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex overflow-x-auto md:grid md:grid-cols-2 lg:grid-cols-4 gap-6 h-[calc(100vh-230px)] snap-x snap-mandatory pb-4 md:pb-0">
          {COLUMNS.map((column) => {
            const columnPatients = getSortedPatients(column.id);
            return (
              <div key={column.id} className="flex flex-col h-full min-w-[85vw] md:min-w-0 snap-center">
                <div className="flex items-center justify-between mb-3 px-1">
                  <h2 className="font-semibold text-slate-700">{column.title}</h2>
                  <div className="flex items-center gap-2">
                    {column.id === 'waitlist' && (
                      <button onClick={() => setAddModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white p-1 rounded-md transition-colors" title="Add Patient">
                        <Plus className="h-4 w-4" />
                      </button>
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

      {editingPatient && (
        <EditPatientModal patient={editingPatient} onClose={() => setEditingPatient(null)} />
      )}
    </>
  );
}

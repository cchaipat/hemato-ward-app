import { create } from 'zustand';
import { Patient, Bed, PatientStatus, UserRole } from './types';
import { mockBeds, mockPatients } from './mockData';
import { calculatePriorityScore } from './utils';

interface AppState {
  // Auth/Role
  userRole: UserRole;
  toggleRole: () => void;

  // Data
  patients: Patient[];
  beds: Bed[];

  // Actions
  movePatient: (patientId: string, newStatus: PatientStatus, newBedId?: string | null) => void;
  updateBedOccupancy: () => void;
  addPatient: (patientData: Omit<Patient, "id" | "status" | "priorityScore">) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  userRole: 'editor',
  toggleRole: () => set((state) => ({ userRole: state.userRole === 'editor' ? 'viewer' : 'editor' })),

  patients: mockPatients,
  // Ensure beds are initially occupied if mock data assigns a patient to a bed
  beds: mockBeds.map(bed => {
    const occupant = mockPatients.find(p => p.assignedBedId === bed.id && p.status === 'admitted');
    return {
      ...bed,
      isOccupied: !!occupant,
      occupantId: occupant ? occupant.id : null
    };
  }),

  // Actions
  movePatient: (patientId, newStatus, newBedId = null) => {
    set((state) => {
      // Find patient
      const patientIndex = state.patients.findIndex(p => p.id === patientId);
      if (patientIndex === -1) return state;

      const patient = state.patients[patientIndex];
      const previousBedId = patient.assignedBedId;

      // Ensure if dropping in admitted, a bed must be assigned
      // If dropping in waitlist or discharged, bed must be null
      const finalBedId = newStatus === 'admitted' ? (newBedId || previousBedId) : null;
      // If dropping in ready_for_discharge, they keep their bed. Wait, do they?
      // "Ready for discharge" still occupies the physical bed until they are "Discharged".
      const assignedBed = (newStatus === 'ready_for_discharge' || newStatus === 'admitted') ? (newBedId || previousBedId) : null;

      const updatedPatients = [...state.patients];
      updatedPatients[patientIndex] = {
        ...patient,
        status: newStatus,
        assignedBedId: assignedBed
      };

      // Recalculate beds
      const updatedBeds = state.beds.map(bed => {
        const occupant = updatedPatients.find(p => p.assignedBedId === bed.id && (p.status === 'admitted' || p.status === 'ready_for_discharge'));
        return {
          ...bed,
          isOccupied: !!occupant,
          occupantId: occupant ? occupant.id : null
        };
      });

      return {
        ...state,
        patients: updatedPatients,
        beds: updatedBeds
      };
    });
  },

  updateBedOccupancy: () => {
    set((state) => {
      const updatedBeds = state.beds.map(bed => {
        const occupant = state.patients.find(p => p.assignedBedId === bed.id && (p.status === 'admitted' || p.status === 'ready_for_discharge'));
        return {
          ...bed,
          isOccupied: !!occupant,
          occupantId: occupant ? occupant.id : null
        };
      });
      return { ...state, beds: updatedBeds };
    });
  },

  addPatient: (patientData) => {
    set((state) => {
      // Inline import to avoid circular dep if we needed utils here, but calculatePriorityScore is better to just be called after importing
      // Wait, we need calculatePriorityScore. I will let utils handle it.
      const newId = `p-${Date.now()}`;
      
      const newPatient: Patient = {
        ...patientData,
        id: newId,
        status: 'waitlist',
        priorityScore: calculatePriorityScore(patientData.clinicalIndications, patientData.isUrgent), 
      };

      return {
        ...state,
        patients: [...state.patients, newPatient]
      };
    });
  }
}));

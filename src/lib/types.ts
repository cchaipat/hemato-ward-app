export type BedType = 'VIP' | 'General CMT' | 'Intensive CMT (HEPA)' | 'Isolation';

export interface Bed {
  id: string;
  name: string; // e.g., "VIP-1", "Intensive-A1"
  type: BedType;
  isOccupied: boolean;
  occupantId?: string | null;
}

export type PatientStatus = 'waitlist' | 'admitted' | 'ready_for_discharge' | 'discharged';

export type ClinicalIndication = 
  | 'Stem cell mobilization and collection'
  | 'Patients enrolled in clinical trials'
  | 'Acute promyelocytic leukemia'
  | 'Leukemia/lymphoma with emergency conditions'
  | 'Hodgkin lymphoma'
  | 'First cycle of bispecific antibody therapy'
  | 'Aggressive lymphoma'
  | 'Relapsed aggressive lymphoma eligible for BMT'
  | 'Relapsed multiple myeloma'
  | 'Other';

export interface Patient {
  id: string;
  hn: string;
  name: string;
  patientTitle?: string;
  sex: 'Male' | 'Female';
  diagnosis: string;
  regimen: string;
  isInduction: boolean;
  cycle: number;
  expectedCmtDate?: string;
  treatmentIntention: '0 - Exact date' | '1 - Curative' | '2 - Palliative';
  clinician: string;
  remark?: string;
  status: PatientStatus;
  
  // Priority System
  clinicalIndications: ClinicalIndication[];
  isUrgent: boolean;    // Manual override
  priorityScore: number; // Calculated by auto-system (higher is higher priority)
  
  // Assignment
  assignedBedId?: string | null; 
  
  // Timestamps
  addedAt?: string; // ISO date string
}

export type UserRole = 'editor' | 'viewer';

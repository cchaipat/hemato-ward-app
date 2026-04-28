import { Bed, Patient, ClinicalIndication } from './types';
import { calculatePriorityScore } from './utils';

export const mockBeds: Bed[] = [
  { id: 'bed-1', name: 'VIP-1', type: 'VIP', isOccupied: false },
  
  // 2 four-bed rooms General CMT
  { id: 'bed-2', name: 'Gen-1A', type: 'General CMT', isOccupied: false },
  { id: 'bed-3', name: 'Gen-1B', type: 'General CMT', isOccupied: false },
  { id: 'bed-4', name: 'Gen-1C', type: 'General CMT', isOccupied: false },
  { id: 'bed-5', name: 'Gen-1D', type: 'General CMT', isOccupied: false },
  { id: 'bed-6', name: 'Gen-2A', type: 'General CMT', isOccupied: false },
  { id: 'bed-7', name: 'Gen-2B', type: 'General CMT', isOccupied: false },
  { id: 'bed-8', name: 'Gen-2C', type: 'General CMT', isOccupied: false },
  { id: 'bed-9', name: 'Gen-2D', type: 'General CMT', isOccupied: false },

  // 4 two-bed rooms Intensive CMT (HEPA)
  { id: 'bed-10', name: 'HEPA-1A', type: 'Intensive CMT (HEPA)', isOccupied: false },
  { id: 'bed-11', name: 'HEPA-1B', type: 'Intensive CMT (HEPA)', isOccupied: false },
  { id: 'bed-12', name: 'HEPA-2A', type: 'Intensive CMT (HEPA)', isOccupied: false },
  { id: 'bed-13', name: 'HEPA-2B', type: 'Intensive CMT (HEPA)', isOccupied: false },
  { id: 'bed-14', name: 'HEPA-3A', type: 'Intensive CMT (HEPA)', isOccupied: false },
  { id: 'bed-15', name: 'HEPA-3B', type: 'Intensive CMT (HEPA)', isOccupied: false },
  { id: 'bed-16', name: 'HEPA-4A', type: 'Intensive CMT (HEPA)', isOccupied: false },
  { id: 'bed-17', name: 'HEPA-4B', type: 'Intensive CMT (HEPA)', isOccupied: false },

  // 1 two-bed room without HEPA
  { id: 'bed-18', name: 'Int-NoHEPA-A', type: 'General CMT', isOccupied: false },
  { id: 'bed-19', name: 'Int-NoHEPA-B', type: 'General CMT', isOccupied: false },

  // 1 single-bed room (isolation)
  { id: 'bed-20', name: 'Iso-1', type: 'Isolation', isOccupied: false },
];

const createPatient = (
  id: string, name: string, hn: string, sex: 'Male' | 'Female', diagnosis: string, regimen: string, 
  isInduction: boolean, cycle: number, expectedCmtDate: string, intention: 'Curative' | 'Palliative' | 'Other', clinician: string,
  indications: ClinicalIndication[], isUrgent: boolean, status: Patient['status'], assignedBedId?: string | null
): Patient => ({
  id, name, hn, sex, diagnosis, regimen, isInduction, cycle, expectedCmtDate, treatmentIntention: intention, clinician,
  clinicalIndications: indications, isUrgent, priorityScore: calculatePriorityScore(indications, isUrgent),
  status, assignedBedId
});

export const mockPatients: Patient[] = [
  createPatient('p1', 'Somchai Jaidee', 'HN-100234', 'Male', 'Multiple Myeloma', 'VRd', false, 3, '2026-05-10', 'Palliative', 'Dr. A. Smith', ['Relapsed multiple myeloma'], false, 'waitlist'),
  createPatient('p2', 'Somsri Rakthai', 'HN-100551', 'Female', 'Diffuse Large B-Cell Lymphoma', 'R-CHOP', true, 1, '2026-04-30', 'Curative', 'Dr. B. Jones', ['Aggressive lymphoma'], false, 'waitlist'),
  createPatient('p3', 'Niran Sookjai', 'HN-101092', 'Male', 'Acute Myeloid Leukemia', '7+3', true, 1, '2026-05-02', 'Curative', 'Dr. A. Smith', ['Other'], true, 'waitlist'), // Urgent!
  createPatient('p4', 'Kanya Thongkum', 'HN-102948', 'Female', 'Hodgkin Lymphoma', 'ABVD', false, 4, '2026-05-15', 'Curative', 'Dr. C. Davis', ['Hodgkin lymphoma'], false, 'waitlist'),
  createPatient('p5', 'Vipa Wong', 'HN-109483', 'Female', 'APL', 'ATRA + ATO', true, 1, '2026-05-05', 'Curative', 'Dr. A. Smith', ['Acute promyelocytic leukemia'], false, 'waitlist'),
  createPatient('p6', 'Polipat P.', 'HN-105382', 'Male', 'Relapsed DLBCL', 'R-ICE', false, 2, '2026-05-01', 'Curative', 'Dr. B. Jones', ['Relapsed aggressive lymphoma eligible for BMT', 'Stem cell mobilization and collection'], false, 'waitlist'),
  createPatient('p7', 'Wanchai M.', 'HN-107743', 'Male', 'Follicular Lymphoma', 'Clinical Trial Drug X', false, 1, '2026-05-03', 'Palliative', 'Dr. C. Davis', ['Patients enrolled in clinical trials'], false, 'waitlist'),
  
  // Already admitted patients
  createPatient('p8', 'Manee R.', 'HN-108832', 'Female', 'AML', 'HiDAC', false, 2, '2026-04-10', 'Curative', 'Dr. A. Smith', ['Other'], false, 'admitted', 'bed-10'),
  createPatient('p9', 'Prasert T.', 'HN-104443', 'Male', 'Multiple Myeloma', 'D-VTd', true, 1, '2026-04-12', 'Curative', 'Dr. C. Davis', ['Other'], false, 'admitted', 'bed-1'),
  
  // Ready for discharge
  createPatient('p10', 'Anong N.', 'HN-100010', 'Female', 'DLBCL', 'R-CHOP', false, 6, '2026-04-01', 'Curative', 'Dr. B. Jones', ['Aggressive lymphoma'], false, 'ready_for_discharge', 'bed-2'),
  
  // Discharged historical
  createPatient('p11', 'Kasem J.', 'HN-101111', 'Male', 'ALL', 'HyperCVAD', true, 1, '2026-03-25', 'Curative', 'Dr. A. Smith', ['Other'], false, 'discharged', null),
];

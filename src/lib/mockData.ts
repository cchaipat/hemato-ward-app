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
  id: string, name: string, patientTitle: string | undefined, hn: string, sex: 'Male' | 'Female', diagnosis: string, regimen: string, 
  isInduction: boolean, cycle: number, expectedCmtDate: string, intention: '0 - Exact date' | '1 - Curative' | '2 - Palliative', clinician: string,
  indications: ClinicalIndication[], isUrgent: boolean, status: Patient['status'], assignedBedId?: string | null, addedAt?: string, remark?: string
): Patient => ({
  id, name, patientTitle, hn, sex, diagnosis, regimen, isInduction, cycle, expectedCmtDate, treatmentIntention: intention, clinician,
  clinicalIndications: indications, isUrgent, priorityScore: calculatePriorityScore(indications, isUrgent),
  status, assignedBedId, addedAt: addedAt || '2026-04-28T00:00:00Z', remark
});

export const mockPatients: Patient[] = [
  createPatient('p1', 'Somchai Jaidee', 'นาย', 'HN-100234', 'Male', 'MM', '01. 7+3', false, 3, '2026-05-10', '2 - Palliative', 'Dr. A. Smith', ['Relapsed multiple myeloma'], false, 'waitlist', null, '2026-04-20T10:00:00Z', 'Needs special care'),
  createPatient('p2', 'Somsri Rakthai', 'นาง', 'HN-100551', 'Female', 'NHL', '33. R-ICE', true, 1, '2026-04-30', '1 - Curative', 'Dr. B. Jones', ['Aggressive lymphoma'], false, 'waitlist', null, '2026-04-22T09:30:00Z'),
  createPatient('p3', 'Niran Sookjai', 'นาย', 'HN-101092', 'Male', 'AML', '01. 7+3', true, 1, '2026-05-02', '1 - Curative', 'Dr. A. Smith', ['Other'], true, 'waitlist', null, '2026-04-25T14:15:00Z'), // Urgent!
  createPatient('p4', 'Kanya Thongkum', 'น.ส.', 'HN-102948', 'Female', 'HL', '23. Escalated BEACOPDac', false, 4, '2026-05-15', '1 - Curative', 'Dr. C. Davis', ['Hodgkin lymphoma'], false, 'waitlist', null, '2026-04-18T11:20:00Z'),
  createPatient('p5', 'Vipa Wong', 'นาง', 'HN-109483', 'Female', 'APL', '11. ATO + ATRA induction', true, 1, '2026-05-05', '1 - Curative', 'Dr. A. Smith', ['Acute promyelocytic leukemia'], false, 'waitlist', null, '2026-04-27T08:45:00Z'),
  createPatient('p6', 'Polipat P.', 'นาย', 'HN-105382', 'Male', 'NHL', '33. R-ICE', false, 2, '2026-05-01', '1 - Curative', 'Dr. B. Jones', ['Relapsed aggressive lymphoma eligible for BMT', 'Stem cell mobilization and collection'], false, 'waitlist', null, '2026-04-26T16:00:00Z'),
  createPatient('p7', 'Wanchai M.', 'นาย', 'HN-107743', 'Male', 'NHL', 'อื่นๆ', false, 1, '2026-05-03', '2 - Palliative', 'Dr. C. Davis', ['Patients enrolled in clinical trials'], false, 'waitlist', null, '2026-04-21T13:10:00Z'),
  
  // Already admitted patients
  createPatient('p8', 'Manee R.', 'นาง', 'HN-108832', 'Female', 'AML', '02. HiDAC', false, 2, '2026-04-10', '1 - Curative', 'Dr. A. Smith', ['Other'], false, 'admitted', 'bed-10'),
  createPatient('p9', 'Prasert T.', 'นาย', 'HN-104443', 'Male', 'MM', '22. DCEP', true, 1, '2026-04-12', '1 - Curative', 'Dr. C. Davis', ['Other'], false, 'admitted', 'bed-1'),
  
  // Ready for discharge
  createPatient('p10', 'Anong N.', 'นาง', 'HN-100010', 'Female', 'NHL', '33. R-ICE', false, 6, '2026-04-01', '1 - Curative', 'Dr. B. Jones', ['Aggressive lymphoma'], false, 'ready_for_discharge', 'bed-2'),
  
  // Discharged historical
  createPatient('p11', 'Kasem J.', 'นาย', 'HN-101111', 'Male', 'ALL', '53. Hyper CVAD (course 1,3,5,7)', true, 1, '2026-03-25', '1 - Curative', 'Dr. A. Smith', ['Other'], false, 'discharged', null),
];

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ClinicalIndication } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Priority Rules
// Lower returned index means *higher* priority (e.g. index 0 is most important).
// If multiple, we take the highest priority indication.
export const PRIORITY_RANKING: ClinicalIndication[] = [
  'Stem cell mobilization and collection',
  'Patients enrolled in clinical trials',
  'Acute promyelocytic leukemia',
  'Leukemia/lymphoma with emergency conditions',
  'Hodgkin lymphoma',
  'First cycle of bispecific antibody therapy',
  'Aggressive lymphoma',
  'Relapsed aggressive lymphoma eligible for BMT',
  'Relapsed multiple myeloma',
  'Other'
];

export function calculatePriorityScore(indications: ClinicalIndication[], isUrgent: boolean): number {
  if (isUrgent) return 100; // Urgent override gets highest score

  let highestPriority = -1;
  const maxScore = PRIORITY_RANKING.length;

  indications.forEach(ind => {
    const index = PRIORITY_RANKING.indexOf(ind);
    if (index !== -1) {
       // invert index so 0 gets maxScore, 1 gets maxScore - 1, etc.
       const score = maxScore - index;
       if (score > highestPriority) {
         highestPriority = score;
       }
    }
  });

  return highestPriority === -1 ? 0 : highestPriority;
}

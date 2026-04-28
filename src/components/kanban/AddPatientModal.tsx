"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { ClinicalIndication, Patient } from "@/lib/types";
import { PRIORITY_RANKING } from "@/lib/utils";

interface AddPatientModalProps {
  onClose: () => void;
}

export function AddPatientModal({ onClose }: AddPatientModalProps) {
  const { addPatient } = useAppStore();

  const [formData, setFormData] = useState({
    name: "",
    hn: "",
    sex: "Male" as "Male" | "Female",
    diagnosis: "",
    regimen: "",
    isInduction: false,
    cycle: 1,
    expectedCmtDate: "",
    treatmentIntention: "Curative" as "Curative" | "Palliative" | "Other",
    clinician: "",
    clinicalIndication: "Other" as ClinicalIndication,
    isUrgent: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    setFormData((prev) => ({ ...prev, [name]: val }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addPatient({
      name: formData.name,
      hn: formData.hn,
      sex: formData.sex,
      diagnosis: formData.diagnosis,
      regimen: formData.regimen,
      isInduction: formData.isInduction,
      cycle: Number(formData.cycle),
      expectedCmtDate: formData.expectedCmtDate,
      treatmentIntention: formData.treatmentIntention,
      clinician: formData.clinician,
      clinicalIndications: [formData.clinicalIndication],
      isUrgent: formData.isUrgent,
      assignedBedId: null
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        <div className="flex justify-between items-center p-5 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800">Add New Patient</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 max-h-[75vh] overflow-y-auto space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
              <input required name="name" value={formData.name} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. Somchai" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Hospital Number (HN)</label>
              <input required name="hn" value={formData.hn} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="HN-XXXXX" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Sex</label>
              <select name="sex" value={formData.sex} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Primary Clinician</label>
              <input required name="clinician" value={formData.clinician} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Dr. XYZ" />
            </div>
          </div>

          <div className="border-t border-slate-200 my-4"></div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Diagnosis</label>
              <input required name="diagnosis" value={formData.diagnosis} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Primary Indication (Priority rules)</label>
              <select name="clinicalIndication" value={formData.clinicalIndication} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                {PRIORITY_RANKING.map(ind => (
                  <option key={ind} value={ind}>{ind}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">CMT Regimen</label>
              <input required name="regimen" value={formData.regimen} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. R-CHOP" />
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-700 mb-1">Cycle</label>
                <input required type="number" name="cycle" min={1} value={formData.cycle} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-700 mb-1">Expected Date</label>
                <input required type="date" name="expectedCmtDate" value={formData.expectedCmtDate} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Treatment Intention</label>
              <select name="treatmentIntention" value={formData.treatmentIntention} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="Curative">Curative</option>
                <option value="Palliative">Palliative</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-6 mt-4">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer">
              <input type="checkbox" name="isInduction" checked={formData.isInduction} onChange={handleChange} className="w-4 h-4 text-blue-600 rounded" />
              Induction Therapy
            </label>
            <label className="flex items-center gap-2 text-sm font-medium text-red-700 cursor-pointer bg-red-50 px-3 py-1.5 rounded-lg border border-red-200">
              <input type="checkbox" name="isUrgent" checked={formData.isUrgent} onChange={handleChange} className="w-4 h-4 text-red-600 rounded" />
              Flag as URGENT (Bypasses rules)
            </label>
          </div>

          <div className="flex justify-end pt-5 border-t border-slate-100 gap-3">
             <button type="button" onClick={onClose} className="px-5 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition-colors">
               Cancel
             </button>
             <button type="submit" className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
               Add to Waitlist
             </button>
          </div>
        </form>

      </div>
    </div>
  );
}

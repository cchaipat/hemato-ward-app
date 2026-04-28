"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { ClinicalIndication, Patient } from "@/lib/types";
import { PRIORITY_RANKING } from "@/lib/utils";
import { TITLES, DIAGNOSES, REGIMENS } from "@/lib/constants";

interface EditPatientModalProps {
  patient: Patient;
  onClose: () => void;
}

export function EditPatientModal({ patient, onClose }: EditPatientModalProps) {
  const { updatePatient } = useAppStore();

  const [formData, setFormData] = useState({
    patientTitle: (patient.patientTitle && TITLES.includes(patient.patientTitle)) ? patient.patientTitle : (patient.patientTitle ? "อื่นๆ" : TITLES[0]),
    customTitle: (patient.patientTitle && !TITLES.includes(patient.patientTitle)) ? patient.patientTitle : "",
    name: patient.name,
    hn: patient.hn,
    sex: patient.sex,
    diagnosis: DIAGNOSES.includes(patient.diagnosis) ? patient.diagnosis : "อื่นๆ",
    customDiagnosis: !DIAGNOSES.includes(patient.diagnosis) ? patient.diagnosis : "",
    regimen: REGIMENS.includes(patient.regimen) ? patient.regimen : "อื่นๆ",
    customRegimen: !REGIMENS.includes(patient.regimen) ? patient.regimen : "",
    isInduction: patient.isInduction,
    cycle: patient.cycle,
    expectedCmtDate: patient.expectedCmtDate || "",
    treatmentIntention: patient.treatmentIntention,
    clinician: patient.clinician,
    remark: patient.remark || "",
    clinicalIndication: (patient.clinicalIndications[0] || "Other") as ClinicalIndication,
    isUrgent: patient.isUrgent,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    setFormData((prev) => ({ ...prev, [name]: val }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updatePatient(patient.id, {
      patientTitle: formData.patientTitle === "อื่นๆ" ? formData.customTitle : formData.patientTitle,
      name: formData.name,
      hn: formData.hn,
      sex: formData.sex,
      diagnosis: formData.diagnosis === "อื่นๆ" ? formData.customDiagnosis : formData.diagnosis,
      regimen: formData.regimen === "อื่นๆ" ? formData.customRegimen : formData.regimen,
      isInduction: formData.isInduction,
      cycle: Number(formData.cycle),
      expectedCmtDate: formData.expectedCmtDate,
      treatmentIntention: formData.treatmentIntention,
      clinician: formData.clinician,
      remark: formData.remark,
      clinicalIndications: [formData.clinicalIndication],
      isUrgent: formData.isUrgent,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        <div className="flex justify-between items-center p-5 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800">Edit Patient Details</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 max-h-[75vh] overflow-y-auto space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 md:col-span-1">
              <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
              <div className="flex gap-2">
                <select name="patientTitle" value={formData.patientTitle} onChange={handleChange} className="w-1/3 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {TITLES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                {formData.patientTitle === "อื่นๆ" && (
                  <input required name="customTitle" value={formData.customTitle} onChange={handleChange} className="w-2/3 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Specify title" />
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
              <input required name="name" value={formData.name} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Hospital Number (HN)</label>
              <input required name="hn" value={formData.hn} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Sex</label>
              <select name="sex" value={formData.sex} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Primary Clinician (ผู้ขอ)</label>
              <input required name="clinician" value={formData.clinician} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          <div className="border-t border-slate-200 my-4"></div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Diagnosis</label>
              <select name="diagnosis" value={formData.diagnosis} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                {DIAGNOSES.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              {formData.diagnosis === "อื่นๆ" && (
                <input required name="customDiagnosis" value={formData.customDiagnosis} onChange={handleChange} className="w-full mt-2 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Specify diagnosis" />
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Primary Indication</label>
              <select name="clinicalIndication" value={formData.clinicalIndication} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                {PRIORITY_RANKING.map(ind => (
                  <option key={ind} value={ind}>{ind}</option>
                ))}
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">CMT Regimen</label>
              <select name="regimen" value={formData.regimen} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                {REGIMENS.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
              {formData.regimen === "อื่นๆ" && (
                <input required name="customRegimen" value={formData.customRegimen} onChange={handleChange} className="w-full mt-2 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Specify regimen" />
              )}
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
              <label className="block text-sm font-medium text-slate-700 mb-1">Rx Intention</label>
              <select name="treatmentIntention" value={formData.treatmentIntention} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="0 - Exact date">0 - Exact date</option>
                <option value="1 - Curative">1 - Curative</option>
                <option value="2 - Palliative">2 - Palliative</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Remark</label>
              <input name="remark" value={formData.remark} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Optional notes" />
            </div>
          </div>

          <div className="flex items-center gap-6 mt-4">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer">
              <input type="checkbox" name="isInduction" checked={formData.isInduction} onChange={handleChange} className="w-4 h-4 text-blue-600 rounded" />
              Induction Therapy
            </label>
            <label className="flex items-center gap-2 text-sm font-medium text-red-700 cursor-pointer bg-red-50 px-3 py-1.5 rounded-lg border border-red-200">
              <input type="checkbox" name="isUrgent" checked={formData.isUrgent} onChange={handleChange} className="w-4 h-4 text-red-600 rounded" />
              Flag as URGENT
            </label>
          </div>

          <div className="flex justify-end pt-5 border-t border-slate-100 gap-3">
             <button type="button" onClick={onClose} className="px-5 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition-colors">
               Cancel
             </button>
             <button type="submit" className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
               Save Changes
             </button>
          </div>
        </form>

      </div>
    </div>
  );
}

import { useState } from "react";
import { X, Calendar } from "lucide-react";
import { format, startOfMonth, endOfMonth } from "date-fns";

interface ExportRecordsModalProps {
  onClose: () => void;
  onExport: (startDate: string, endDate: string) => void;
}

export function ExportRecordsModal({ onClose, onExport }: ExportRecordsModalProps) {
  const [startDate, setStartDate] = useState(format(startOfMonth(new Date()), "yyyy-MM-dd"));
  const [endDate, setEndDate] = useState(format(endOfMonth(new Date()), "yyyy-MM-dd"));

  const handleExport = (e: React.FormEvent) => {
    e.preventDefault();
    onExport(startDate, endDate);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        <div className="flex justify-between items-center p-5 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-500" />
            Export Records
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleExport} className="p-5 space-y-4">
          <p className="text-sm text-slate-500 mb-4">
            Select the date range to export. This will filter patients based on the date they were <strong>added to the system</strong>.
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Start Date</label>
              <input 
                required 
                type="date" 
                value={startDate} 
                onChange={(e) => setStartDate(e.target.value)} 
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">End Date</label>
              <input 
                required 
                type="date" 
                value={endDate} 
                onChange={(e) => setEndDate(e.target.value)} 
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
              />
            </div>
          </div>

          <div className="flex justify-end pt-5 mt-2 gap-3">
             <button type="button" onClick={onClose} className="px-5 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition-colors">
               Cancel
             </button>
             <button type="submit" className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
               Download Excel
             </button>
          </div>
        </form>

      </div>
    </div>
  );
}

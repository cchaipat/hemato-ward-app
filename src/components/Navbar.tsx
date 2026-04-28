"use client";

import { useAppStore } from "@/lib/store";
import { Activity, Shield, User } from "lucide-react";

export function Navbar() {
  const { userRole, toggleRole } = useAppStore();

  return (
    <nav className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm">
      <div className="flex items-center space-x-3">
        <div className="bg-blue-600 p-2 rounded-lg">
          <Activity className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">HematoWard<span className="text-blue-600">Pro</span></h1>
          <p className="text-xs text-slate-500 font-medium">Hematology Bed Management System</p>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {/* Role Toggle for Prototype */}
        <div className="flex items-center bg-slate-100 rounded-full p-1 border border-slate-200">
          <button
            onClick={() => userRole !== 'editor' && toggleRole()}
            className={`flex items-center space-x-2 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              userRole === 'editor' 
                ? 'bg-white shadow-sm text-blue-700' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Shield className="h-4 w-4" />
            <span>Chief (Editor)</span>
          </button>
          <button
            onClick={() => userRole !== 'viewer' && toggleRole()}
            className={`flex items-center space-x-2 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              userRole === 'viewer' 
                ? 'bg-white shadow-sm text-slate-800' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <User className="h-4 w-4" />
            <span>Staff (View)</span>
          </button>
        </div>
      </div>
    </nav>
  );
}

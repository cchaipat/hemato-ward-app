"use client";

import { useAppStore } from "@/lib/store";
import { Activity, Shield, User, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export function Navbar() {
  const { userRole, logout } = useAppStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.replace("/");
  };

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
        <div className="flex items-center bg-slate-100 rounded-full py-1.5 px-4 border border-slate-200 md:min-w-48 justify-between">
          
          <div className="flex items-center space-x-2 text-sm font-bold text-slate-700">
            {userRole === 'editor' ? (
              <><Shield className="h-4 w-4 text-blue-600" /> <span className="text-blue-700">Chief Resident</span></>
            ) : (
              <><User className="h-4 w-4 text-slate-500" /> <span>Staff (Viewer)</span></>
            )}
          </div>

          <button
            onClick={handleLogout}
            className="ml-4 text-slate-400 hover:text-red-500 transition-colors"
            title="Log Out"
          >
            <LogOut className="h-4 w-4" />
          </button>
          
        </div>
      </div>
    </nav>
  );
}

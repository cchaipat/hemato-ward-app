"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { Activity, Shield, User, ArrowRight, Lock } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login, userRole } = useAppStore();
  const [mounted, setMounted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (userRole !== null) {
      router.replace("/dashboard");
    }
  }, [userRole, router]);

  if (!mounted || userRole !== null) return null;

  const handleViewerLogin = () => {
    login("viewer");
    router.push("/dashboard");
  };

  const handleEditorLoginAttempt = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "hemato2026") {
      login("editor");
      router.push("/dashboard");
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50 via-slate-50 to-white">
      
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
        
        {/* Branding Header */}
        <div className="p-8 text-center bg-gradient-to-b from-blue-50/50 to-white">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-200">
            <Activity className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">HematoWard<span className="text-blue-600">Pro</span></h1>
          <p className="text-sm font-medium text-slate-500 mt-2">Hematology Bed Management Prototype</p>
        </div>

        {/* Action Panel */}
        <div className="p-8 pt-4">
          
          {!showPassword ? (
            <div className="space-y-4">
              <button 
                onClick={handleViewerLogin}
                className="w-full flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-slate-100 p-3 rounded-lg text-slate-600 group-hover:bg-slate-200 transition-colors">
                    <User className="h-5 w-5" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-slate-800">Staff / Doctor</p>
                    <p className="text-xs font-medium text-slate-500">View-only access to ward data</p>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-slate-300 group-hover:text-slate-500 transition-colors" />
              </button>

              <button 
                onClick={() => setShowPassword(true)}
                className="w-full flex items-center justify-between p-4 rounded-xl border-2 border-blue-100 hover:border-blue-500 hover:bg-blue-50/50 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-blue-100 p-3 rounded-lg text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Shield className="h-5 w-5" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-slate-800 group-hover:text-blue-900 transition-colors">Chief Resident</p>
                    <p className="text-xs font-medium text-slate-500 group-hover:text-blue-600/70 transition-colors">Manage beds & drag-and-drop</p>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-blue-300 group-hover:text-blue-500 transition-colors" />
              </button>
            </div>
          ) : (
            <form onSubmit={handleEditorLoginAttempt} className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-slate-800">Enter Access Passcode</h3>
                <button 
                  type="button" 
                  onClick={() => setShowPassword(false)}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-800"
                >
                  Back
                </button>
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input 
                  type="password" 
                  autoFocus
                  placeholder="Master Passcode"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border outline-none transition-all ${
                    error ? 'border-red-300 ring-4 ring-red-100' : 'border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100'
                  }`}
                />
              </div>
              
              {error && <p className="text-xs font-bold text-red-500 text-center animate-in shake">Incorrect passcode. Try again.</p>}

              <button 
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all shadow-md shadow-blue-200"
              >
                Access Dashboard
              </button>

              <div className="pt-2 text-center text-xs text-slate-400">
                <p>Prototype Passcode: <b>hemato2026</b></p>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}

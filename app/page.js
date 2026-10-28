"use client";
import React, { useState, useEffect, useMemo } from "react";
import { 
  Phone, MessageSquare, User, Lock, LogOut, RefreshCw, 
  X, BellRing, PlusCircle, CheckCircle2, ArrowRight
} from "lucide-react";

const FOLLOWUP_FLOW = [
  { stage: "Day 1", days: 1, noteCol: "Day_1_Note" },
  { stage: "Day 3", days: 3, noteCol: "Day_3_Note" },
  { stage: "Day 5", days: 5, noteCol: "Day_5_Note" },
  { stage: "Day 7", days: 7, noteCol: "Day_7_Note" },
  { stage: "Day 11", days: 11, noteCol: "Day_11_Note" },
  { stage: "Day 15", days: 15, noteCol: "Day_15_Note" },
  { stage: "Day 21", days: 21, noteCol: "Day_21_Note" },
];

const CALLER_PROFILES = {
  piyush: {
    id: "piyush",
    name: "Piyush",
    password: process.env.NEXT_PUBLIC_PIYUSH_PASS || "piyush123",
    sheetApiUrl: process.env.NEXT_PUBLIC_PIYUSH_SHEET_URL,
    formUrl: "https://forms.gle/RW2wP2eHhpZ8Zihh7",
  },
  garv: {
    id: "garv",
    name: "Garv",
    password: process.env.NEXT_PUBLIC_GARV_PASS || "garv123",
    sheetApiUrl: process.env.NEXT_PUBLIC_GARV_SHEET_URL,
    formUrl: process.env.NEXT_PUBLIC_GARV_FORM_URL || "https://docs.google.com/forms",
  }
};

export default function KhushaliCallerCRM() {
  const [selectedProfile, setSelectedProfile] = useState("piyush");
  const [password, setPassword] = useState("");
  const [loggedInCaller, setLoggedInCaller] = useState(null);
  const [loginError, setLoginError] = useState("");

  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState("today");

  const [smartPopupLead, setSmartPopupLead] = useState(null);
  const [showSmartPopup, setShowSmartPopup] = useState(false);
  const [activeLeadModal, setActiveLeadModal] = useState(null);
  const [callStatusInput, setCallStatusInput] = useState("Interested");
  const [callNoteInput, setCallNoteInput] = useState("");
  const [saving, setSaving] = useState(false);

  const todayDate = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const saved = sessionStorage.getItem("khushali_active_caller");
    if (saved && CALLER_PROFILES[saved]) {
      setLoggedInCaller(CALLER_PROFILES[saved]);
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    const profile = CALLER_PROFILES[selectedProfile];
    if (profile && password === profile.password) {
      setLoggedInCaller(profile);
      setLoginError("");
      setPassword("");
      sessionStorage.setItem("khushali_active_caller", profile.id);
    } else {
      setLoginError("Password galat hai! Sahi password dalein.");
    }
  };

  const handleLogout = () => {
    setLoggedInCaller(null);
    setLeads([]);
    setSmartPopupLead(null);
    sessionStorage.removeItem("khushali_active_caller");
  };

  const fetchCallerSheet = async () => {
    if (!loggedInCaller || !loggedInCaller.sheetApiUrl) return;
    setLoading(true);
    try {
      const res = await fetch(loggedInCaller.sheetApiUrl);
      const data = await res.json();
      if (data.status === "success") {
        setLeads(data.leads || []);
      }
    } catch (err) {
      console.error("Sheet fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (loggedInCaller) {
      fetchCallerSheet();
    }
  }, [loggedInCaller]);

  useEffect(() => {
    if (!loggedInCaller || leads.length === 0) return;

    const findUrgentCall = () => {
      const pendingList = leads.filter((l) => {
        const status = l["Call_Status"] || "New";
        if (status === "Order Confirmed" || status === "Not Interested") return false;
        const nextDate = l["Next_Call_Date"] ? String(l["Next_Call_Date"]).split("T")[0] : "";
        return !nextDate || nextDate <= todayDate;
      });

      if (pendingList.length > 0) {
        setSmartPopupLead(pendingList[0]);
        setShowSmartPopup(true);
      } else {
        setSmartPopupLead(null);
        setShowSmartPopup(false);
      }
    };

    findUrgentCall();
    const interval = setInterval(findUrgentCall, 90000);
    return () => clearInterval(interval);
  }, [leads, loggedInCaller, todayDate]);

  const calculateNextFollowUp = (lead) => {
    const currentStage = lead["Current_Stage"] || "Day 1";
    const baseDateStr = lead["Day_1_Date"] || lead["Timestamp"] || todayDate;
    const baseDate = new Date(baseDateStr);

    const idx = FOLLOWUP_FLOW.findIndex((f) => f.stage === currentStage);
    const currentObj = idx !== -1 ? FOLLOWUP_FLOW[idx] : FOLLOWUP_FLOW[0];

    if (idx === FOLLOWUP_FLOW.length - 1) {
      return { nextStage: "Completed", nextDate: "CLOSED", noteCol: currentObj.noteCol };
    }

    const nextObj = idx !== -1 ? FOLLOWUP_FLOW[idx + 1] : FOLLOWUP_FLOW[1];
    const targetDate = new Date(baseDate);
    targetDate.setDate(targetDate.getDate() + (nextObj.days - 1));

    const todayObj = new Date(todayDate);
    if (targetDate <= todayObj) {
      const diffFromPrev = nextObj.days - currentObj.days;
      todayObj.setDate(todayObj.getDate() + diffFromPrev);
      return {
        nextStage: nextObj.stage,
        nextDate: todayObj.toISOString().split("T")[0],
        noteCol: currentObj.noteCol,
      };
    }

    return {
      nextStage: nextObj.stage,
      nextDate: targetDate.toISOString().split("T")[0],
      noteCol: currentObj.noteCol,
    };
  };

  const handleSaveFollowUp = async () => {
    if (!activeLeadModal || !loggedInCaller) return;
    setSaving(true);

    const currentStage = activeLeadModal["Current_Stage"] || "Day 1";
    const stepInfo = calculateNextFollowUp(activeLeadModal);

    let nextStageVal = stepInfo.nextStage;
    let nextDateVal = stepInfo.nextDate;

    if (callStatusInput === "Busy / Call Tomorrow") {
      nextStageVal = currentStage;
      const tmw = new Date();
      tmw.setDate(tmw.getDate() + 1);
      nextDateVal = tmw.toISOString().split("T")[0];
    } else if (callStatusInput === "Order Confirmed" || callStatusInput === "Not Interested") {
      nextStageVal = "CLOSED";
      nextDateVal = "CLOSED";
    }

    const payload = {
      rowIndex: activeLeadModal.rowIndex,
      nextStage: nextStageVal,
      nextCallDate: nextDateVal,
      lastCallDate: todayDate,
      callStatus: callStatusInput,
      stageNoteColumn: stepInfo.noteCol,
      note: callNoteInput,
    };

    try {
      await fetch(loggedInCaller.sheetApiUrl, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      setLeads((prev) =>
        prev.map((item) =>
          item.rowIndex === activeLeadModal.rowIndex
            ? {
                ...item,
                Current_Stage: nextStageVal,
                Next_Call_Date: nextDateVal,
                Last_Call_Date: todayDate,
                Call_Status: callStatusInput,
                [stepInfo.noteCol]: `[${todayDate}] ${callNoteInput}`,
              }
            : item
        )
      );

      setActiveLeadModal(null);
      setShowSmartPopup(false);
      setCallNoteInput("");
    } catch (e) {
      alert("Sheet update karne mein dikkat aayi!");
    } finally {
      setSaving(false);
    }
  };

  const filteredLeads = useMemo(() => {
    return leads.filter((l) => {
      const status = l["Call_Status"] || "New";
      const isClosed = status === "Order Confirmed" || status === "Not Interested";
      const nextDate = l["Next_Call_Date"] ? String(l["Next_Call_Date"]).split("T")[0] : "";

      if (activeFilter === "today") {
        return !isClosed && (!nextDate || nextDate === todayDate);
      }
      if (activeFilter === "overdue") {
        return !isClosed && nextDate && nextDate < todayDate;
      }
      if (activeFilter === "upcoming") {
        return !isClosed && nextDate && nextDate > todayDate;
      }
      return true;
    });
  }, [leads, activeFilter, todayDate]);

  if (!loggedInCaller) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
          <div className="text-center mb-6">
            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full text-xs font-bold uppercase">
              Khushali Chemicals
            </span>
            <h1 className="text-2xl font-extrabold text-white mt-3">Caller Login Portal</h1>
            <p className="text-xs text-slate-400 mt-1">Apna Profile chunein</p>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            {Object.values(CALLER_PROFILES).map((prof) => {
              const isSelected = selectedProfile === prof.id;
              return (
                <button
                  key={prof.id}
                  type="button"
                  onClick={() => {
                    setSelectedProfile(prof.id);
                    setLoginError("");
                  }}
                  className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                    isSelected
                      ? "bg-emerald-500/15 border-emerald-500 shadow-lg shadow-emerald-500/10"
                      : "bg-slate-950/60 border-slate-800 opacity-70"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm ${
                      isSelected ? "bg-emerald-500 text-slate-950" : "bg-slate-800 text-slate-300"
                    }`}>
                      {prof.name[0]}
                    </div>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                  </div>
                  <div>
                    <div className="font-bold text-white text-base">{prof.name}</div>
                  </div>
                </button>
              );
            })}
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1.5">
                {CALLER_PROFILES[selectedProfile].name} Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  placeholder="Password dalein..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>
            </div>

            {loginError && (
              <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs p-2.5 rounded-xl text-center">
                {loginError}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3.5 rounded-xl transition flex items-center justify-center gap-2"
            >
              Login to {CALLER_PROFILES[selectedProfile].name} CRM <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
            <h1 className="text-xl md:text-2xl font-extrabold text-white">
              {loggedInCaller.name.toUpperCase()} CRM PANEL
            </h1>
            <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs px-2.5 py-0.5 rounded-full font-semibold">
              Live Web App
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">1-3-5-7-11-15-21 Automated Cadence</p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <a
            href={loggedInCaller.formUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-3.5 py-2 rounded-xl text-xs transition"
          >
            <PlusCircle className="w-4 h-4" /> Open Google Form
          </a>

          {smartPopupLead && !showSmartPopup && (
            <button
              onClick={() => setShowSmartPopup(true)}
              className="flex items-center gap-1.5 bg-amber-500/20 border border-amber-500/40 text-amber-300 px-3 py-2 rounded-xl text-xs font-bold animate-pulse"
            >
              <BellRing className="w-3.5 h-3.5" /> Call Popup
            </button>
          )}

          <button
            onClick={fetchCallerSheet}
            className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-3 py-2 rounded-xl text-xs text-slate-300"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} /> Sync
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 px-3 py-2 rounded-xl text-xs font-semibold"
          >
            <LogOut className="w-3.5 h-3.5" /> Logout
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 my-6">
        {[
          { id: "today", label: "Aaj Ki Calls (Due Today)" },
          { id: "overdue", label: "Overdue Calls" },
          { id: "upcoming", label: "Upcoming Calls" },
          { id: "all", label: `All Leads (${leads.length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeFilter === tab.id
                ? "bg-emerald-500 text-slate-950"
                : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-slate-900 text-slate-400 border-b border-slate-800 text-[11px] uppercase">
                <th className="p-3.5">Customer Name & Number</th>
                <th className="p-3.5">City & Business</th>
                <th className="p-3.5">Budget</th>
                <th className="p-3.5">Chemicals</th>
                <th className="p-3.5">Stage</th>
                <th className="p-3.5">Next Call</th>
                <th className="p-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-10 text-center text-slate-500 text-xs">
                    Koi pending lead nahi hai.
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead, index) => {
                  const stage = lead["Current_Stage"] || "Day 1";
                  const nextDate = lead["Next_Call_Date"] ? String(lead["Next_Call_Date"]).split("T")[0] : "Today";
                  return (
                    <tr key={index} className="hover:bg-slate-800/40 transition">
                      <td className="p-3.5">
                        <div className="font-bold text-white">{lead["Name"] || "—"}</div>
                        <div className="text-xs text-emerald-400 font-mono">{lead["Number"] || lead["Contact Number"]}</div>
                      </td>
                      <td className="p-3.5">
                        <div className="text-slate-200">{lead["City"] || "—"}</div>
                      </td>
                      <td className="p-3.5">
                        <div className="text-slate-200 font-semibold">₹{lead["सर आपका बजट कितना है?"] || "—"}</div>
                      </td>
                      <td className="p-3.5 max-w-xs">
                        <div className="text-xs text-slate-300 truncate">{lead["आपको कौन कौनसे chemical चाहिए?"] || "—"}</div>
                      </td>
                      <td className="p-3.5">
                        <span className="bg-blue-500/15 text-blue-400 text-xs px-2.5 py-1 rounded-md font-mono font-bold">
                          {stage}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <span className="text-xs font-mono text-slate-300">{nextDate}</span>
                      </td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => setActiveLeadModal(lead)}
                          className="bg-emerald-500/15 hover:bg-emerald-500 text-emerald-400 hover:text-slate-950 border border-emerald-500/30 px-3 py-1.5 rounded-xl text-xs font-bold transition"
                        >
                          Update Call
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showSmartPopup && smartPopupLead && !activeLeadModal && (
        <div className="fixed bottom-5 right-5 left-5 md:left-auto md:w-[440px] bg-slate-900 border-2 border-emerald-500 rounded-3xl p-5 shadow-2xl z-40">
          <div className="flex justify-between items-start mb-3">
            <span className="bg-emerald-500 text-slate-950 text-[10px] font-black px-2.5 py-1 rounded-full uppercase flex items-center gap-1">
              <BellRing className="w-3 h-3" /> Call Now Popup
            </span>
            <button onClick={() => setShowSmartPopup(false)} className="text-slate-400 text-xs bg-slate-800 px-2 py-1 rounded-lg">
              Snooze
            </button>
          </div>

          <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-3.5 mb-4 space-y-1.5">
            <h3 className="text-lg font-extrabold text-white">{smartPopupLead["Name"] || "Customer"}</h3>
            <p className="text-sm font-mono text-emerald-400">{smartPopupLead["Number"] || smartPopupLead["Contact Number"]}</p>
            <div className="text-xs text-slate-300">
              <strong>Chemicals:</strong> {smartPopupLead["आपको कौन कौनसे chemical चाहिए?"] || "—"}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <a
              href={`tel:${smartPopupLead["Number"] || smartPopupLead["Contact Number"]}`}
              className="flex items-center justify-center gap-1.5 bg-emerald-500 text-slate-950 font-bold py-2.5 rounded-xl text-xs"
            >
              <Phone className="w-3.5 h-3.5" /> Call
            </a>
            <a
              href={`https://wa.me/91${smartPopupLead["Number"] || smartPopupLead["Contact Number"]}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-1.5 bg-emerald-950 border border-emerald-700 text-emerald-300 py-2.5 rounded-xl text-xs"
            >
              <MessageSquare className="w-3.5 h-3.5" /> WhatsApp
            </a>
            <button
              onClick={() => setActiveLeadModal(smartPopupLead)}
              className="bg-slate-800 text-white font-bold py-2.5 rounded-xl text-xs border border-slate-700"
            >
              Update
            </button>
          </div>
        </div>
      )}

      {activeLeadModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 relative shadow-2xl">
            <button onClick={() => setActiveLeadModal(null)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-white mb-2">{activeLeadModal["Name"]}</h3>
            <p className="text-xs text-slate-400 mb-4">{activeLeadModal["Number"] || activeLeadModal["Contact Number"]}</p>

            <div className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Call Status</label>
                <select
                  value={callStatusInput}
                  onChange={(e) => setCallStatusInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white"
                >
                  <option value="Interested">Interested (Next Stage)</option>
                  <option value="Busy / Call Tomorrow">Busy / Call Tomorrow</option>
                  <option value="Order Confirmed">Order Confirmed 🎉</option>
                  <option value="Not Interested">Not Interested</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Follow-Up Notes</label>
                <textarea
                  rows={3}
                  value={callNoteInput}
                  onChange={(e) => setCallNoteInput(e.target.value)}
                  placeholder="Baat-cheet ki details..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white"
                />
              </div>

              <button
                disabled={saving}
                onClick={handleSaveFollowUp}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold py-3 rounded-xl transition"
              >
                {saving ? "Saving..." : "Save & Schedule Next"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

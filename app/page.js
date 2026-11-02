"use client";
import React, { useState, useEffect, useMemo } from "react";
import { 
  Phone, MessageSquare, Lock, LogOut, RefreshCw, 
  X, BellRing, PlusCircle, CheckCircle2, ArrowRight,
  Target, TrendingUp, Award, IndianRupee, CalendarCheck, Clock
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
    whatsappLine: "WhatsApp SIM 1",
    dailyTargetRevenue: 13500,
    dailyTargetCalls: 40,
    dailyTargetOrders: 2,
    password: process.env.NEXT_PUBLIC_PIYUSH_PASS || "piyush123",
    sheetApiUrl: process.env.NEXT_PUBLIC_PIYUSH_SHEET_URL,
    formUrl: "https://forms.gle/RW2wP2eHhpZ8Zihh7",
  },
  garv: {
    id: "garv",
    name: "Garv",
    whatsappLine: "WhatsApp SIM 2",
    dailyTargetRevenue: 13500,
    dailyTargetCalls: 40,
    dailyTargetOrders: 2,
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
  
  // Modal Inputs
  const [callStatusInput, setCallStatusInput] = useState("Interested");
  const [orderAmountInput, setOrderAmountInput] = useState("");
  const [orderDetailsInput, setOrderDetailsInput] = useState("");
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

  // LIVE DAILY STATS CALCULATION
  const todayPerformance = useMemo(() => {
    let callsCount = 0;
    let ordersCount = 0;
    let revenue = 0;

    leads.forEach((l) => {
      const lastCall = l["Last_Call_Date"] ? String(l["Last_Call_Date"]).split("T")[0] : "";
      if (lastCall === todayDate) {
        callsCount += 1;
        if (l["Call_Status"] === "Order Confirmed") {
          ordersCount += 1;
          const amt = parseFloat(l["Order_Amount"] || l["Amount"] || 0);
          revenue += amt;
        }
      }
    });

    const targetRev = loggedInCaller?.dailyTargetRevenue || 13500;
    const revProgress = Math.min(100, Math.round((revenue / targetRev) * 100));

    return { callsCount, ordersCount, revenue, revProgress };
  }, [leads, todayDate, loggedInCaller]);

  // Urgent Call Popup Selector
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

  const handleOpenModal = (lead) => {
    setActiveLeadModal(lead);
    setCallStatusInput("Interested");
    setOrderAmountInput("");
    setOrderDetailsInput("");
    setCallNoteInput("");
  };

  const handleSaveFollowUp = async () => {
    if (!activeLeadModal || !loggedInCaller) return;
    setSaving(true);

    const currentStage = activeLeadModal["Current_Stage"] || "Day 1";
    const stepInfo = calculateNextFollowUp(activeLeadModal);

    let nextStageVal = stepInfo.nextStage;
    let nextDateVal = stepInfo.nextDate;

    if (callStatusInput === "Busy / Call Tomorrow" || callStatusInput === "Ringing / Not Picked") {
      nextStageVal = currentStage;
      const tmw = new Date();
      tmw.setDate(tmw.getDate() + 1);
      nextDateVal = tmw.toISOString().split("T")[0];
    } else if (callStatusInput === "Order Confirmed" || callStatusInput === "Not Interested") {
      nextStageVal = "CLOSED";
      nextDateVal = "CLOSED";
    }

    const finalAmt = callStatusInput === "Order Confirmed" ? (parseFloat(orderAmountInput) || 0) : 0;
    const finalRemark = callStatusInput === "Order Confirmed" 
      ? `[ORDER: ₹${finalAmt}] ${orderDetailsInput} | Note: ${callNoteInput}`
      : callNoteInput;

    const payload = {
      rowIndex: activeLeadModal.rowIndex,
      nextStage: nextStageVal,
      nextCallDate: nextDateVal,
      lastCallDate: todayDate,
      callStatus: callStatusInput,
      orderAmount: finalAmt,
      stageNoteColumn: stepInfo.noteCol,
      note: finalRemark,
    };

    try {
      await fetch(loggedInCaller.sheetApiUrl, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // Update Local State with Order Amount and Dates
      setLeads((prev) =>
        prev.map((item) =>
          item.rowIndex === activeLeadModal.rowIndex
            ? {
                ...item,
                Current_Stage: nextStageVal,
                Next_Call_Date: nextDateVal,
                Last_Call_Date: todayDate,
                Call_Status: callStatusInput,
                Order_Amount: finalAmt,
                [stepInfo.noteCol]: `[${todayDate}] ${finalRemark}`,
              }
            : item
        )
      );

      setActiveLeadModal(null);
      setShowSmartPopup(false);
      setCallNoteInput("");
      setOrderAmountInput("");
      setOrderDetailsInput("");
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
      const lastCall = l["Last_Call_Date"] ? String(l["Last_Call_Date"]).split("T")[0] : "";

      if (activeFilter === "today") {
        return !isClosed && (!nextDate || nextDate === todayDate);
      }
      if (activeFilter === "called_today") {
        return lastCall === todayDate;
      }
      if (activeFilter === "orders_today") {
        return lastCall === todayDate && status === "Order Confirmed";
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
            <p className="text-xs text-slate-400 mt-1">Apna Calling Profile chunein</p>
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
                    <div className="text-[10px] text-emerald-400 font-medium mt-0.5">{prof.whatsappLine}</div>
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
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 space-y-6">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
            <h1 className="text-xl md:text-2xl font-extrabold text-white">
              {loggedInCaller.name.toUpperCase()} CRM PANEL
            </h1>
            <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs px-2.5 py-0.5 rounded-full font-semibold">
              {loggedInCaller.whatsappLine}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">10 Lakh Target Engine • Daily Quota & Order Tracker</p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <a
            href={loggedInCaller.formUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-3.5 py-2 rounded-xl text-xs transition shadow-md shadow-emerald-500/20"
          >
            <PlusCircle className="w-4 h-4" /> Nayi Lead Add Karein
          </a>

          {smartPopupLead && !showSmartPopup && (
            <button
              onClick={() => setShowSmartPopup(true)}
              className="flex items-center gap-1.5 bg-amber-500/20 border border-amber-500/40 text-amber-300 px-3 py-2 rounded-xl text-xs font-bold animate-pulse"
            >
              <BellRing className="w-3.5 h-3.5" /> Next Call Popup
            </button>
          )}

          <button
            onClick={fetchCallerSheet}
            className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-3 py-2 rounded-xl text-xs text-slate-300 hover:bg-slate-800 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} /> Sync Sheet
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 px-3 py-2 rounded-xl text-xs font-semibold hover:bg-rose-500/20 transition"
          >
            <LogOut className="w-3.5 h-3.5" /> Logout
          </button>
        </div>
      </div>

      {/* 🚀 LIVE DAILY PERFORMANCE SCORECARD (10 LAKH ENGINE) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        
        {/* Metric 1: Calls Logged Today */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex justify-between items-center text-xs text-slate-400 font-semibold">
            <span>Calls Made Today</span>
            <Phone className="w-4 h-4 text-sky-400" />
          </div>
          <div className="my-2">
            <span className="text-2xl font-black text-white">{todayPerformance.callsCount}</span>
            <span className="text-xs text-slate-500 font-medium"> / {loggedInCaller.dailyTargetCalls} Target</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-sky-500 h-1.5 rounded-full transition-all duration-500" 
              style={{ width: `${Math.min(100, (todayPerformance.callsCount / loggedInCaller.dailyTargetCalls) * 100)}%` }}
            />
          </div>
        </div>

        {/* Metric 2: Orders Closed Today */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex justify-between items-center text-xs text-slate-400 font-semibold">
            <span>Orders Won Today</span>
            <Award className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="my-2">
            <span className="text-2xl font-black text-emerald-400">{todayPerformance.ordersCount}</span>
            <span className="text-xs text-slate-500 font-medium"> / {loggedInCaller.dailyTargetOrders} Target</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500" 
              style={{ width: `${Math.min(100, (todayPerformance.ordersCount / loggedInCaller.dailyTargetOrders) * 100)}%` }}
            />
          </div>
        </div>

        {/* Metric 3: Today's Revenue */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex justify-between items-center text-xs text-slate-400 font-semibold">
            <span>Today's Sales Value</span>
            <IndianRupee className="w-4 h-4 text-amber-400" />
          </div>
          <div className="my-2">
            <span className="text-2xl font-black text-amber-400">₹{todayPerformance.revenue.toLocaleString('en-IN')}</span>
            <span className="text-xs text-slate-500 font-medium"> / ₹{loggedInCaller.dailyTargetRevenue.toLocaleString('en-IN')}</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-amber-500 h-1.5 rounded-full transition-all duration-500" 
              style={{ width: `${todayPerformance.revProgress}%` }}
            />
          </div>
        </div>

        {/* Metric 4: Daily Goal Status */}
        <div className="bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/30 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex justify-between items-center text-xs text-emerald-400 font-bold">
            <span>Daily Goal Target</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="my-1">
            <div className="text-lg font-black text-white">{todayPerformance.revProgress}% Achieved</div>
            <p className="text-[11px] text-slate-400">
              {todayPerformance.revenue >= loggedInCaller.dailyTargetRevenue 
                ? "🎉 Target Complete! Bonus Achieved." 
                : `₹${(loggedInCaller.dailyTargetRevenue - todayPerformance.revenue).toLocaleString('en-IN')} baaki hai`}
            </p>
          </div>
          <div className="text-[10px] text-emerald-500/80 font-mono font-semibold uppercase">
            Khushali 10L Mission
          </div>
        </div>

      </div>

      {/* FILTER TABS */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: "today", label: "Aaj Ki Calls (Due Today)" },
          { id: "called_today", label: `Aaj Hui Calls (${todayPerformance.callsCount})` },
          { id: "orders_today", label: `Aaj Ke Orders (${todayPerformance.ordersCount}) 🏆` },
          { id: "overdue", label: "Overdue Calls" },
          { id: "upcoming", label: "Upcoming Calls" },
          { id: "all", label: `All Leads (${leads.length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeFilter === tab.id
                ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20"
                : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* MAIN LEADS TABLE */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-slate-900 text-slate-400 border-b border-slate-800 text-[11px] uppercase tracking-wider">
                <th className="p-3.5">Customer & Contact</th>
                <th className="p-3.5">City & Requirement</th>
                <th className="p-3.5">Status / Stage</th>
                <th className="p-3.5">Last Call</th>
                <th className="p-3.5">Next Call</th>
                <th className="p-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-10 text-center text-slate-500 text-xs">
                    Is filter me koi lead nahi hai.
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead, index) => {
                  const stage = lead["Current_Stage"] || "Day 1";
                  const status = lead["Call_Status"] || "New";
                  const nextDate = lead["Next_Call_Date"] ? String(lead["Next_Call_Date"]).split("T")[0] : "Today";
                  const lastDate = lead["Last_Call_Date"] ? String(lead["Last_Call_Date"]).split("T")[0] : "—";
                  const phoneNum = lead["Number"] || lead["Contact Number"];

                  const waText = encodeURIComponent(`Namaste ${lead["Name"] || ""} ji, Khushali Chemicals (Jaipur) se ${loggedInCaller.name} baat kar raha hoon. Aapki chemical concentrate requirement ke regarding quotation share kiya tha. Kripya batayein trial pack kab dispatch karwayein?`);

                  return (
                    <tr key={index} className="hover:bg-slate-800/40 transition">
                      <td className="p-3.5">
                        <div className="font-bold text-white flex items-center gap-1.5">
                          {lead["Name"] || "—"}
                          {status === "Order Confirmed" && <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-black">₹{lead["Order_Amount"] || ""}</span>}
                        </div>
                        <div className="text-xs text-emerald-400 font-mono mt-0.5">{phoneNum}</div>
                      </td>
                      <td className="p-3.5">
                        <div className="text-slate-200 text-xs font-semibold">{lead["City"] || "—"}</div>
                        <div className="text-[11px] text-slate-400 truncate max-w-xs">{lead["आपको कौन कौनसे chemical चाहिए?"] || "—"}</div>
                      </td>
                      <td className="p-3.5">
                        <div className="flex items-center gap-1.5">
                          <span className="bg-blue-500/15 text-blue-400 text-xs px-2 py-0.5 rounded font-mono font-bold">
                            {stage}
                          </span>
                          <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                            status === "Order Confirmed" ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" :
                            status === "Busy / Call Tomorrow" ? "bg-amber-500/20 text-amber-400" :
                            "bg-slate-800 text-slate-300"
                          }`}>
                            {status}
                          </span>
                        </div>
                      </td>
                      <td className="p-3.5 text-xs text-slate-400 font-mono">
                        {lastDate}
                      </td>
                      <td className="p-3.5">
                        <span className="text-xs font-mono font-semibold text-amber-300">{nextDate}</span>
                      </td>
                      <td className="p-3.5 text-right whitespace-nowrap space-x-1.5">
                        <a
                          href={`tel:${phoneNum}`}
                          className="inline-block p-1.5 rounded-lg bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white border border-blue-500/30 transition text-xs"
                          title="Call"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                        <a
                          href={`https://wa.me/91${phoneNum}?text=${waText}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-block p-1.5 rounded-lg bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white border border-emerald-500/30 transition text-xs"
                          title="WhatsApp"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                        </a>
                        <button
                          onClick={() => handleOpenModal(lead)}
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

      {/* POPUP: SMART CALL NOW NOTIFICATION */}
      {showSmartPopup && smartPopupLead && !activeLeadModal && (
        <div className="fixed bottom-5 right-5 left-5 md:left-auto md:w-[440px] bg-slate-900 border-2 border-emerald-500 rounded-3xl p-5 shadow-2xl z-40 animate-fade-in">
          <div className="flex justify-between items-start mb-3">
            <span className="bg-emerald-500 text-slate-950 text-[10px] font-black px-2.5 py-1 rounded-full uppercase flex items-center gap-1">
              <BellRing className="w-3 h-3" /> Next Due Call
            </span>
            <button onClick={() => setShowSmartPopup(false)} className="text-slate-400 text-xs bg-slate-800 hover:text-white px-2 py-1 rounded-lg">
              Snooze
            </button>
          </div>

          <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-3.5 mb-4 space-y-1.5">
            <h3 className="text-lg font-extrabold text-white">{smartPopupLead["Name"] || "Customer"}</h3>
            <p className="text-sm font-mono text-emerald-400">{smartPopupLead["Number"] || smartPopupLead["Contact Number"]}</p>
            <div className="text-xs text-slate-300">
              <strong>Requirement:</strong> {smartPopupLead["आपको कौन कौनसे chemical चाहिए?"] || "—"}
            </div>
            {smartPopupLead["City"] && (
              <div className="text-xs text-slate-400"><strong>City:</strong> {smartPopupLead["City"]}</div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-2">
            <a
              href={`tel:${smartPopupLead["Number"] || smartPopupLead["Contact Number"]}`}
              className="flex items-center justify-center gap-1.5 bg-emerald-500 text-slate-950 font-bold py-2.5 rounded-xl text-xs"
            >
              <Phone className="w-3.5 h-3.5" /> Call
            </a>
            <a
              href={`https://wa.me/91${smartPopupLead["Number"] || smartPopupLead["Contact Number"]}?text=${encodeURIComponent(`Namaste ${smartPopupLead["Name"] || ""} ji, Khushali Chemicals se ${loggedInCaller.name} baat kar raha hoon...`)}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-1.5 bg-emerald-950 border border-emerald-700 text-emerald-300 py-2.5 rounded-xl text-xs"
            >
              <MessageSquare className="w-3.5 h-3.5" /> WhatsApp
            </a>
            <button
              onClick={() => handleOpenModal(smartPopupLead)}
              className="bg-slate-800 hover:bg-slate-700 text-white font-bold py-2.5 rounded-xl text-xs border border-slate-700"
            >
              Update
            </button>
          </div>
        </div>
      )}

      {/* POPUP: UPDATE CALL MODAL WITH ORDER CONFIRMATION & AMOUNT */}
      {activeLeadModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 relative shadow-2xl space-y-4">
            <button onClick={() => setActiveLeadModal(null)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Call Logging</span>
              <h3 className="text-xl font-black text-white">{activeLeadModal["Name"]}</h3>
              <p className="text-xs text-slate-400 font-mono mt-0.5">{activeLeadModal["Number"] || activeLeadModal["Contact Number"]}</p>
            </div>

            <div className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Call Outcome / Status *</label>
                <select
                  value={callStatusInput}
                  onChange={(e) => setCallStatusInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 font-medium"
                >
                  <option value="Interested">Connected - Interested (Next Cadence)</option>
                  <option value="Busy / Call Tomorrow">Connected - Busy / Call Tomorrow</option>
                  <option value="Ringing / Not Picked">Ringing / Phone Nahi Uthaya</option>
                  <option value="Order Confirmed">🎉 Order Confirmed (Booking)</option>
                  <option value="Not Interested">Not Interested / Closed</option>
                </select>
              </div>

              {/* DYNAMIC FIELD: ORDER AMOUNT & PRODUCT DETAILS (IF WON) */}
              {callStatusInput === "Order Confirmed" && (
                <div className="p-3.5 bg-emerald-950/40 border border-emerald-500/40 rounded-2xl space-y-3 animate-fade-in">
                  <div>
                    <label className="text-[11px] font-bold text-emerald-400 block mb-1">
                      Order Amount (₹) *
                    </label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 8500"
                      value={orderAmountInput}
                      onChange={(e) => setOrderAmountInput(e.target.value)}
                      className="w-full bg-slate-950 border border-emerald-500/60 rounded-xl px-3 py-2 text-sm text-emerald-300 font-black focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">
                      Ordered Products / Quantity (Kg)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 50kg Phenyl + 20kg Handwash"
                      value={orderDetailsInput}
                      onChange={(e) => setOrderDetailsInput(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Baat-cheet ka Remark / Notes</label>
                <textarea
                  rows={3}
                  value={callNoteInput}
                  onChange={(e) => setCallNoteInput(e.target.value)}
                  placeholder="Customer ne kya kaha? Sample manga ya rate issue tha..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <button
                disabled={saving}
                onClick={handleSaveFollowUp}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-3 rounded-xl transition shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
              >
                {saving ? "Saving to Sheet..." : "Save Call & Update Target"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

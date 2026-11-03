"use client";
import React, { useState, useEffect, useMemo } from "react";
import { 
  Phone, MessageSquare, Lock, LogOut, RefreshCw, 
  X, BellRing, PlusCircle, CheckCircle2, ArrowRight,
  TrendingUp, Award, IndianRupee, CalendarCheck, Clock,
  Calendar, Edit3, History, Save, AlertCircle, User
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

  // Popups & Modals
  const [smartPopupLead, setSmartPopupLead] = useState(null);
  const [showSmartPopup, setShowSmartPopup] = useState(false);
  const [activeLeadModal, setActiveLeadModal] = useState(null);
  const [historyModalLead, setHistoryModalLead] = useState(null);
  const [newCustomerModalOpen, setNewCustomerModalOpen] = useState(false);
  const [editCustomerModalOpen, setEditCustomerModalOpen] = useState(false);
  
  // Call Update Inputs
  const [callStatusInput, setCallStatusInput] = useState("Interested");
  const [orderAmountInput, setOrderAmountInput] = useState("");
  const [orderDetailsInput, setOrderDetailsInput] = useState("");
  const [callNoteInput, setCallNoteInput] = useState("");
  const [customDateTimeEnabled, setCustomDateTimeEnabled] = useState(false);
  const [customDateInput, setCustomDateInput] = useState("");
  const [customTimeInput, setCustomTimeInput] = useState("");
  const [saving, setSaving] = useState(false);

  // New Customer Form State
  const [newLeadForm, setNewLeadForm] = useState({
    name: "",
    number: "",
    city: "",
    budget: "",
    chemicals: "",
    note: ""
  });

  // Edit Customer Form State
  const [editLeadForm, setEditLeadForm] = useState({
    rowIndex: null,
    name: "",
    number: "",
    city: "",
    budget: "",
    chemicals: ""
  });

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
    setShowSmartPopup(false);
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

  // ALL TAB COUNTS
  const tabCounts = useMemo(() => {
    let today = 0;
    let calledToday = 0;
    let ordersToday = 0;
    let overdue = 0;
    let upcoming = 0;

    leads.forEach((l) => {
      const status = l["Call_Status"] || "New";
      const isClosed = status === "Order Confirmed" || status === "Not Interested";
      const nextDate = l["Next_Call_Date"] ? String(l["Next_Call_Date"]).split("T")[0] : "";
      const lastCall = l["Last_Call_Date"] ? String(l["Last_Call_Date"]).split("T")[0] : "";

      if (lastCall === todayDate) {
        calledToday += 1;
        if (status === "Order Confirmed") ordersToday += 1;
      }

      if (!isClosed) {
        if (!nextDate || nextDate === todayDate) today += 1;
        else if (nextDate < todayDate) overdue += 1;
        else if (nextDate > todayDate) upcoming += 1;
      }
    });

    return { today, calledToday, ordersToday, overdue, upcoming, all: leads.length };
  }, [leads, todayDate]);

  // LIVE TIME-BASED CALL SCHEDULER POPUP & NORMAL URGENT CHECKER
  useEffect(() => {
    if (!loggedInCaller || leads.length === 0) return;

    const checkScheduledAndUrgentCalls = () => {
      const now = new Date();
      const currentTimeStr = now.toTimeString().slice(0, 5); // HH:MM

      // 1. Time-matched scheduled call
      const exactTimeLead = leads.find((l) => {
        const status = l["Call_Status"] || "New";
        if (status === "Order Confirmed" || status === "Not Interested") return false;
        const nextDate = l["Next_Call_Date"] ? String(l["Next_Call_Date"]).split("T")[0] : "";
        const nextTime = l["Next_Call_Time"] || "";
        return nextDate === todayDate && nextTime && nextTime <= currentTimeStr;
      });

      if (exactTimeLead) {
        setSmartPopupLead(exactTimeLead);
        setShowSmartPopup(true);
        return;
      }

      // 2. Normal Pending/Overdue Call
      const pendingList = leads.filter((l) => {
        const status = l["Call_Status"] || "New";
        if (status === "Order Confirmed" || status === "Not Interested") return false;
        const nextDate = l["Next_Call_Date"] ? String(l["Next_Call_Date"]).split("T")[0] : "";
        return !nextDate || nextDate <= todayDate;
      });

      if (pendingList.length > 0 && !showSmartPopup) {
        setSmartPopupLead(pendingList[0]);
        setShowSmartPopup(true);
      }
    };

    checkScheduledAndUrgentCalls();
    const timer = setInterval(checkScheduledAndUrgentCalls, 15000); // Check every 15 seconds
    return () => clearInterval(timer);
  }, [leads, loggedInCaller, todayDate, showSmartPopup]);

  // SNOOZE FEATURE: PUSH NUMBER TO LAST IN LIST
  const handleSnooze = () => {
    if (!smartPopupLead) return;
    setLeads((prev) => {
      const withoutCurrent = prev.filter((l) => l.rowIndex !== smartPopupLead.rowIndex);
      return [...withoutCurrent, smartPopupLead];
    });
    setShowSmartPopup(false);
    setSmartPopupLead(null);
  };

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

  const handleOpenUpdateModal = (lead) => {
    setActiveLeadModal(lead);
    setCallStatusInput("Interested");
    setOrderAmountInput("");
    setOrderDetailsInput("");
    setCallNoteInput("");
    setCustomDateTimeEnabled(false);
    setCustomDateInput("");
    setCustomTimeInput("");
  };

  const handleSaveFollowUp = async () => {
    if (!activeLeadModal || !loggedInCaller) return;
    setSaving(true);

    const currentStage = activeLeadModal["Current_Stage"] || "Day 1";
    const stepInfo = calculateNextFollowUp(activeLeadModal);

    let nextStageVal = stepInfo.nextStage;
    let nextDateVal = stepInfo.nextDate;
    let nextTimeVal = "";

    if (customDateTimeEnabled && customDateInput) {
      nextDateVal = customDateInput;
      nextTimeVal = customTimeInput || "";
    } else if (callStatusInput === "Busy / Call Tomorrow" || callStatusInput === "Ringing / Not Picked") {
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
      : (customTimeInput ? `[Scheduled: ${nextDateVal} @ ${nextTimeVal}] ${callNoteInput}` : callNoteInput);

    const payload = {
      action: "update_call",
      rowIndex: activeLeadModal.rowIndex,
      nextStage: nextStageVal,
      nextCallDate: nextDateVal,
      nextCallTime: nextTimeVal,
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

      setLeads((prev) =>
        prev.map((item) =>
          item.rowIndex === activeLeadModal.rowIndex
            ? {
                ...item,
                Current_Stage: nextStageVal,
                Next_Call_Date: nextDateVal,
                Next_Call_Time: nextTimeVal,
                Last_Call_Date: todayDate,
                Call_Status: callStatusInput,
                Order_Amount: finalAmt,
                [stepInfo.noteCol]: `[${todayDate}${nextTimeVal ? " " + nextTimeVal : ""}] ${finalRemark}`,
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

  // NEW CUSTOMER IN-APP SUBMIT (No Google Form needed)
  const handleAddNewCustomer = async (e) => {
    e.preventDefault();
    if (!loggedInCaller) return;
    setSaving(true);

    const newRowIndex = leads.length > 0 ? Math.max(...leads.map(l => l.rowIndex || 0)) + 1 : 2;
    const newEntry = {
      rowIndex: newRowIndex,
      Timestamp: new Date().toISOString(),
      Day_1_Date: todayDate,
      Name: newLeadForm.name.trim(),
      Number: newLeadForm.number.trim(),
      "Contact Number": newLeadForm.number.trim(),
      City: newLeadForm.city.trim(),
      "सर आपका बजट कितना है?": newLeadForm.budget.trim(),
      "आपको कौन कौनसे chemical चाहिए?": newLeadForm.chemicals.trim(),
      Current_Stage: "Day 1",
      Next_Call_Date: todayDate,
      Next_Call_Time: "",
      Call_Status: "New",
      Day_1_Note: newLeadForm.note ? `[${todayDate}] ${newLeadForm.note}` : ""
    };

    try {
      await fetch(loggedInCaller.sheetApiUrl, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "add_lead", ...newEntry }),
      });

      setLeads((prev) => [newEntry, ...prev]);
      setNewCustomerModalOpen(false);
      setNewLeadForm({ name: "", number: "", city: "", budget: "", chemicals: "", note: "" });
    } catch (err) {
      alert("Naya customer add karne me dikkat aayi!");
    } finally {
      setSaving(false);
    }
  };

  // EDIT CUSTOMER DIRECTLY IN CRM
  const handleOpenEditCustomer = (lead) => {
    setEditLeadForm({
      rowIndex: lead.rowIndex,
      name: lead["Name"] || "",
      number: lead["Number"] || lead["Contact Number"] || "",
      city: lead["City"] || "",
      budget: lead["सर आपका बजट कितना है?"] || "",
      chemicals: lead["आपको कौन कौनसे chemical चाहिए?"] || ""
    });
    setEditCustomerModalOpen(true);
  };

  const handleSaveCustomerEdit = async (e) => {
    e.preventDefault();
    if (!loggedInCaller) return;
    setSaving(true);

    const payload = {
      action: "edit_lead",
      rowIndex: editLeadForm.rowIndex,
      name: editLeadForm.name.trim(),
      number: editLeadForm.number.trim(),
      city: editLeadForm.city.trim(),
      budget: editLeadForm.budget.trim(),
      chemicals: editLeadForm.chemicals.trim()
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
          item.rowIndex === editLeadForm.rowIndex
            ? {
                ...item,
                Name: editLeadForm.name,
                Number: editLeadForm.number,
                "Contact Number": editLeadForm.number,
                City: editLeadForm.city,
                "सर आपका बजट कितना है?": editLeadForm.budget,
                "आपको कौन कौनसे chemical चाहिए?": editLeadForm.chemicals,
              }
            : item
        )
      );

      // If active inside history modal, update it too
      if (historyModalLead && historyModalLead.rowIndex === editLeadForm.rowIndex) {
        setHistoryModalLead((prev) => ({
          ...prev,
          Name: editLeadForm.name,
          Number: editLeadForm.number,
          "Contact Number": editLeadForm.number,
          City: editLeadForm.city,
          "सर आपका बजट कितना है?": editLeadForm.budget,
          "आपको कौन कौनसे chemical चाहिए?": editLeadForm.chemicals,
        }));
      }

      setEditCustomerModalOpen(false);
    } catch (err) {
      alert("Customer details update karne me error aaya!");
    } finally {
      setSaving(false);
    }
  };

  // FILTER LOGIC
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
            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
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
      
      {/* TOP HEADER */}
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
          <p className="text-xs text-slate-400 mt-1">10 Lakh Target Engine • Automated Cadence & Schedule Reminders</p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* IN-APP ADD CUSTOMER BUTTON */}
          <button
            onClick={() => setNewCustomerModalOpen(true)}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-3.5 py-2 rounded-xl text-xs transition shadow-md shadow-emerald-500/20"
          >
            <PlusCircle className="w-4 h-4" /> Naya Customer Jodein
          </button>

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

      {/* 🚀 LIVE DAILY PERFORMANCE SCORECARD */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
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

      {/* FILTER TABS WITH DYNAMIC LIVE COUNTS */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: "today", label: `Aaj Ki Calls (Due Today)`, count: tabCounts.today, color: "text-emerald-400" },
          { id: "called_today", label: `Aaj Hui Calls`, count: tabCounts.calledToday, color: "text-sky-400" },
          { id: "orders_today", label: `Aaj Ke Orders 🏆`, count: tabCounts.ordersToday, color: "text-amber-400" },
          { id: "overdue", label: `Overdue Calls`, count: tabCounts.overdue, color: "text-rose-400" },
          { id: "upcoming", label: `Upcoming Calls`, count: tabCounts.upcoming, color: "text-purple-400" },
          { id: "all", label: `All Leads`, count: tabCounts.all, color: "text-slate-300" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeFilter === tab.id
                ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20"
                : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-white"
            }`}
          >
            <span>{tab.label}</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
              activeFilter === tab.id ? "bg-slate-950 text-emerald-400" : "bg-slate-800 " + tab.color
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* MAIN LEADS TABLE */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-slate-900 text-slate-400 border-b border-slate-800 text-[11px] uppercase tracking-wider">
                <th className="p-3.5">Customer & Contact (Click Name for History)</th>
                <th className="p-3.5">City & Requirement</th>
                <th className="p-3.5">Status / Stage</th>
                <th className="p-3.5">Last Call</th>
                <th className="p-3.5">Next Call & Time</th>
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
                  const nextTime = lead["Next_Call_Time"] || "";
                  const lastDate = lead["Last_Call_Date"] ? String(lead["Last_Call_Date"]).split("T")[0] : "—";
                  const phoneNum = lead["Number"] || lead["Contact Number"];

                  const waText = encodeURIComponent(`Namaste ${lead["Name"] || ""} ji, Khushali Chemicals (Jaipur) se ${loggedInCaller.name} baat kar raha hoon. Aapki chemical concentrate requirement ke regarding quotation share kiya tha. Kripya batayein trial pack kab dispatch karwayein?`);

                  return (
                    <tr key={index} className="hover:bg-slate-800/40 transition group">
                      <td className="p-3.5">
                        {/* 1. CLICK NAME TO OPEN REMARKS & DETAILS HISTORY */}
                        <div 
                          onClick={() => setHistoryModalLead(lead)} 
                          className="font-bold text-white group-hover:text-emerald-400 transition cursor-pointer flex items-center gap-1.5"
                          title="Click to view complete discussion history & remarks"
                        >
                          <span className="underline decoration-dotted underline-offset-4">{lead["Name"] || "—"}</span>
                          <History className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 text-emerald-400" />
                          {status === "Order Confirmed" && (
                            <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-black">
                              ₹{lead["Order_Amount"] || ""}
                            </span>
                          )}
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
                            status === "Ringing / Not Picked" ? "bg-purple-500/20 text-purple-400" :
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
                        <div className="text-xs font-mono font-semibold text-amber-300 flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-amber-400" />
                          {nextDate}
                        </div>
                        {nextTime && (
                          <div className="text-[11px] font-mono text-emerald-400 font-bold flex items-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3" />
                            {nextTime}
                          </div>
                        )}
                      </td>
                      <td className="p-3.5 text-right whitespace-nowrap space-x-1.5">
                        <button
                          onClick={() => handleOpenEditCustomer(lead)}
                          className="inline-block p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition text-xs"
                          title="Edit Customer Info Directly"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
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
                          onClick={() => handleOpenUpdateModal(lead)}
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

      {/* 🔔 3. SMART CALL NOW POPUP WITH SNOOZE TO LAST POSITION */}
      {showSmartPopup && smartPopupLead && !activeLeadModal && !historyModalLead && (
        <div className="fixed bottom-5 right-5 left-5 md:left-auto md:w-[440px] bg-slate-900 border-2 border-emerald-500 rounded-3xl p-5 shadow-2xl z-40 animate-fade-in">
          <div className="flex justify-between items-start mb-3">
            <span className="bg-emerald-500 text-slate-950 text-[10px] font-black px-2.5 py-1 rounded-full uppercase flex items-center gap-1">
              <BellRing className="w-3 h-3" /> 
              {smartPopupLead["Next_Call_Time"] ? `Scheduled Call Time: ${smartPopupLead["Next_Call_Time"]}` : "Next Due Call"}
            </span>
            {/* SNOOZE PUSHES TO LAST */}
            <button 
              onClick={handleSnooze} 
              className="text-amber-400 hover:text-amber-300 text-xs bg-amber-950/60 border border-amber-800/60 px-2.5 py-1 rounded-lg font-bold transition"
              title="Number list ke last me bhej do"
            >
              Snooze (Last me daalo)
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
              onClick={() => handleOpenUpdateModal(smartPopupLead)}
              className="bg-slate-800 hover:bg-slate-700 text-white font-bold py-2.5 rounded-xl text-xs border border-slate-700"
            >
              Update
            </button>
          </div>
        </div>
      )}

      {/* 📝 1. REMARKS & COMPLETE DISCUSSION HISTORY MODAL */}
      {historyModalLead && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 relative shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <button onClick={() => setHistoryModalLead(null)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>

            <div className="flex justify-between items-start border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                  <History className="w-3 h-3" /> Discussion History & Notes
                </span>
                <h3 className="text-xl font-black text-white mt-1">{historyModalLead["Name"]}</h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">{historyModalLead["Number"] || historyModalLead["Contact Number"]}</p>
              </div>
              <button
                onClick={() => {
                  handleOpenEditCustomer(historyModalLead);
                }}
                className="flex items-center gap-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-1.5 rounded-xl font-bold transition"
              >
                <Edit3 className="w-3.5 h-3.5 text-emerald-400" /> Edit Details
              </button>
            </div>

            {/* Quick Profile Summary */}
            <div className="grid grid-cols-2 gap-2 text-xs bg-slate-950 p-3 rounded-2xl border border-slate-800">
              <div><span className="text-slate-500">City:</span> <span className="font-semibold text-slate-200">{historyModalLead["City"] || "—"}</span></div>
              <div><span className="text-slate-500">Budget:</span> <span className="font-semibold text-emerald-400">₹{historyModalLead["सर आपका बजट कितना है?"] || "—"}</span></div>
              <div className="col-span-2 mt-1"><span className="text-slate-500">Requirement:</span> <span className="font-medium text-slate-300">{historyModalLead["आपको कौन कौनसे chemical चाहिए?"] || "—"}</span></div>
              <div className="col-span-2 mt-1"><span className="text-slate-500">Current Status:</span> <span className="font-bold text-amber-400">{historyModalLead["Call_Status"] || "New"} ({historyModalLead["Current_Stage"] || "Day 1"})</span></div>
            </div>

            {/* Stage-wise Remarks Timeline */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                <CalendarCheck className="w-4 h-4 text-emerald-400" /> Cadence Remarks Timeline
              </h4>
              <div className="space-y-2.5">
                {FOLLOWUP_FLOW.map((f, i) => {
                  const noteContent = historyModalLead[f.noteCol];
                  if (!noteContent) return null;
                  return (
                    <div key={i} className="p-3 bg-slate-950/80 rounded-xl border border-slate-800/80 space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] uppercase font-bold bg-blue-500/15 text-blue-400 px-2 py-0.5 rounded font-mono">
                          {f.stage}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1 whitespace-pre-wrap leading-relaxed">{noteContent}</p>
                    </div>
                  );
                })}

                {/* If no cadence notes are filled yet */}
                {!FOLLOWUP_FLOW.some(f => historyModalLead[f.noteCol]) && (
                  <div className="p-6 text-center text-xs text-slate-500 bg-slate-950 rounded-xl border border-slate-800">
                    Abhi tak is customer ka koi previous remark note record nahi hua hai.
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => {
                  setHistoryModalLead(null);
                  handleOpenUpdateModal(historyModalLead);
                }}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-2.5 rounded-xl text-xs transition"
              >
                Log New Call / Update Status
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ⏰ 2. UPDATE CALL MODAL WITH OPTIONAL CUSTOM DATE & TIME */}
      {activeLeadModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 relative shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
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
                  <option value="Interested">Connected - Interested (Cadence Flow)</option>
                  <option value="Busy / Call Tomorrow">Connected - Busy / Call Tomorrow</option>
                  <option value="Ringing / Not Picked">Ringing / Phone Nahi Uthaya</option>
                  <option value="Order Confirmed">🎉 Order Confirmed (Booking)</option>
                  <option value="Not Interested">Not Interested / Closed</option>
                </select>
              </div>

              {/* OPTIONAL CUSTOM DATE & TIME SCHEDULER */}
              {callStatusInput !== "Order Confirmed" && callStatusInput !== "Not Interested" && (
                <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-2.5">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-300">
                    <input
                      type="checkbox"
                      checked={customDateTimeEnabled}
                      onChange={(e) => setCustomDateTimeEnabled(e.target.checked)}
                      className="w-4 h-4 rounded text-emerald-500 bg-slate-900 border-slate-700 focus:ring-0"
                    />
                    <span>Schedule Custom Next Call Date & Time</span>
                  </label>

                  {customDateTimeEnabled && (
                    <div className="grid grid-cols-2 gap-2 pt-1 animate-fade-in">
                      <div>
                        <span className="text-[10px] font-semibold text-slate-400 block mb-1">Next Date *</span>
                        <input
                          type="date"
                          required
                          value={customDateInput}
                          onChange={(e) => setCustomDateInput(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-xs text-white focus:outline-none"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] font-semibold text-slate-400 block mb-1">Exact Time (Popup Alert)</span>
                        <input
                          type="time"
                          value={customTimeInput}
                          onChange={(e) => setCustomTimeInput(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-xs text-emerald-400 font-mono focus:outline-none"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* DYNAMIC FIELD: ORDER AMOUNT & DETAILS */}
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
                {saving ? "Saving to Sheet..." : "Save Call & Schedule"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ➕ 5. IN-APP NEW CUSTOMER CREATION MODAL */}
      {newCustomerModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 relative shadow-2xl space-y-4">
            <button onClick={() => setNewCustomerModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Direct Entry</span>
              <h3 className="text-xl font-black text-white">Naya Customer Jodein</h3>
              <p className="text-xs text-slate-400 mt-0.5">Google Form kholne ki zaroorat nahi hai, yahan se direct save karein.</p>
            </div>

            <form onSubmit={handleAddNewCustomer} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Customer Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Sharma"
                  value={newLeadForm.name}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Mobile Number (10 Digits) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 9876543210"
                  value={newLeadForm.number}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, number: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-emerald-400 font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">City / Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Sikar, Kota"
                    value={newLeadForm.city}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, city: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Budget (₹)</label>
                  <input
                    type="text"
                    placeholder="e.g. 10000"
                    value={newLeadForm.budget}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, budget: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Required Chemicals / Products</label>
                <input
                  type="text"
                  placeholder="e.g. White Phenyl, Toilet Cleaner, Handwash"
                  value={newLeadForm.chemicals}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, chemicals: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Initial Discussion / Remark</label>
                <textarea
                  rows={2}
                  placeholder="Initial inquiry details..."
                  value={newLeadForm.note}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, note: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3 rounded-xl transition shadow-lg shadow-emerald-500/20"
              >
                {saving ? "Saving..." : "Customer Add Karein"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ✏️ 5. IN-APP DIRECT EDIT CUSTOMER INFO MODAL */}
      {editCustomerModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 relative shadow-2xl space-y-4">
            <button onClick={() => setEditCustomerModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">Edit Mode</span>
              <h3 className="text-xl font-black text-white">Customer Details Edit Karein</h3>
            </div>

            <form onSubmit={handleSaveCustomerEdit} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Customer Name *</label>
                <input
                  type="text"
                  required
                  value={editLeadForm.name}
                  onChange={(e) => setEditLeadForm({ ...editLeadForm, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Mobile Number *</label>
                <input
                  type="text"
                  required
                  value={editLeadForm.number}
                  onChange={(e) => setEditLeadForm({ ...editLeadForm, number: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-emerald-400 font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">City</label>
                  <input
                    type="text"
                    value={editLeadForm.city}
                    onChange={(e) => setEditLeadForm({ ...editLeadForm, city: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Budget (₹)</label>
                  <input
                    type="text"
                    value={editLeadForm.budget}
                    onChange={(e) => setEditLeadForm({ ...editLeadForm, budget: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Required Chemicals</label>
                <input
                  type="text"
                  value={editLeadForm.chemicals}
                  onChange={(e) => setEditLeadForm({ ...editLeadForm, chemicals: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3 rounded-xl transition shadow-lg shadow-amber-500/20"
              >
                {saving ? "Updating..." : "Save Updated Details"}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

"use client";
import React, { useState, useEffect, useMemo } from "react";
import { 
  Phone, MessageSquare, Lock, LogOut, RefreshCw, 
  X, BellRing, PlusCircle, CheckCircle2, ArrowRight,
  TrendingUp, Award, IndianRupee, CalendarCheck, Clock,
  Calendar, Edit3, History, Maximize2, Minimize2, Search, 
  Contact, Building2, Zap, BookOpen, ShieldAlert, 
  Copy, Check, Sparkles, FlaskConical, BarChart3, 
  ChevronDown, ChevronUp, GitMerge, AlertTriangle,
  Package, Trash2, Send
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
    role: "caller",
    whatsappLine: "WhatsApp SIM 1",
    dailyTargetRevenue: 15000,
    dailyTargetCalls: 60,
    dailyTargetOrders: 4,
    password: process.env.NEXT_PUBLIC_PIYUSH_PASS || "piyush123",
    sheetApiUrl: process.env.NEXT_PUBLIC_PIYUSH_SHEET_URL,
    formUrl: "https://forms.gle/RW2wP2eHhpZ8Zihh7",
  },
  garv: {
    id: "garv",
    name: "Garv",
    role: "caller",
    whatsappLine: "WhatsApp SIM 2",
    dailyTargetRevenue: 15000,
    dailyTargetCalls: 60,
    dailyTargetOrders: 4,
    password: process.env.NEXT_PUBLIC_GARV_PASS || "garv123",
    sheetApiUrl: process.env.NEXT_PUBLIC_GARV_SHEET_URL,
    formUrl: process.env.NEXT_PUBLIC_GARV_FORM_URL || "https://docs.google.com/forms",
  },
  admin: {
    id: "admin",
    name: "Admin (Trainer)",
    role: "admin",
    whatsappLine: "All Lines (Master View)",
    dailyTargetRevenue: 30000,
    dailyTargetCalls: 120,
    dailyTargetOrders: 8,
    monthlyTargetRevenue: 1000000,
    password: process.env.NEXT_PUBLIC_ADMIN_PASS || "admin123",
  }
};

// 📚 OFFICIAL KHUSHALI CHEMICALS CATALOG & FORMULATION DATA
const PRODUCT_CATALOG = [
  {
    name: "White Phenyl Raw Material",
    rates: { tier5: 255, tier25: 250, tier50: 245 },
    slabs: "5Kg: ₹255/kg | 25Kg: ₹250/kg | 50Kg: ₹245/kg",
    ratio: "1:30 (1 Kg Concentrate + 30 Kg Water)",
    instructions: "TDS 150-250 वाला पानी धीरे-धीरे डालें और अच्छी तरह मिलाएँ।"
  },
  {
    name: "Colour Phenyl (Rose)",
    rates: { tier5: 265, tier25: 260, tier50: 255 },
    slabs: "5Kg: ₹265/kg | 25Kg: ₹260/kg | 50Kg: ₹255/kg",
    ratio: "1:30 (1 Kg Concentrate + 30 Kg Water)",
    instructions: "TDS 150-250 वाला पानी धीरे-धीरे डालें और अच्छी तरह मिलाएँ।"
  },
  {
    name: "Black Phenyl Raw Material",
    rates: { tier5: 175, tier25: 170, tier50: 165 },
    slabs: "5Kg: ₹175/kg | 25Kg: ₹170/kg | 50Kg: ₹165/kg",
    ratio: "1:6 से 1:9 (1 Kg Concentrate + 6-9 Kg Water)",
    instructions: "RO पानी (< 70 TDS) का उपयोग करें और अच्छी तरह मिक्स करें।"
  },
  {
    name: "Toilet Cleaner Raw Material",
    rates: { tier5: 125, tier25: 120, tier50: 115 },
    slabs: "5Kg: ₹125/kg | 15Kg: ₹120/kg | 50Kg: ₹115/kg",
    ratio: "1:7 (1 Kg Concentrate + 7 Kg Water)",
    instructions: "RO पानी (< 70 TDS) का उपयोग करें और अच्छी तरह मिक्स करें।"
  },
  {
    name: "Bathroom Cleaner Raw Material",
    rates: { tier5: 145, tier25: 140, tier50: 135 },
    slabs: "5Kg: ₹145/kg | 25Kg: ₹140/kg | 50Kg: ₹135/kg",
    ratio: "1:4 से 1:8 (1 Kg Concentrate + 4-8 Kg Water)",
    instructions: "RO पानी (< 70 TDS) मिलाकर 2-3 घंटे छोड़ दें।"
  },
  {
    name: "Floor Cleaner Raw Material",
    rates: { tier5: 820, tier25: 810, tier50: 800 },
    slabs: "5Kg: ₹820/kg | 25Kg: ₹810/kg | 50Kg: ₹800/kg",
    ratio: "1:40 से 1:60 (1 Kg Concentrate + 40-60 Kg Water)",
    instructions: "कम लागत में हाई-क्वालिटी फ्लोर क्लीनर।"
  },
  {
    name: "Hand Wash (Rose) Raw Material",
    rates: { tier5: 350, tier25: 345, tier50: 340 },
    slabs: "5Kg: ₹350/kg | 25Kg: ₹345/kg | 50Kg: ₹340/kg",
    ratio: "1:9 (1 Kg Concentrate + 8.5 Kg Water + 500g Salt)",
    instructions: "पहले पानी में 500g नमक घोलें, फिर कंसन्ट्रेट डालें। 24 घंटे (1 दिन) स्थिर छोड़ दें ताकि झाग खत्म हो और पारदर्शी दिखे।"
  },
  {
    name: "Dishwash Raw Material",
    rates: { tier5: 350, tier25: 345, tier50: 340 },
    slabs: "5Kg: ₹350/kg | 25Kg: ₹345/kg | 50Kg: ₹340/kg",
    ratio: "1:9 (1 Kg Concentrate + 8.5 Kg Water + 500g Salt)",
    instructions: "पानी में 500g नमक और 500-1000g पॉवर बूस्टर मिलाएँ। 1 दिन (24 घंटे) रखें।"
  },
  {
    name: "Fabric Wash Raw Material",
    rates: { tier5: 350, tier25: 345, tier50: 340 },
    slabs: "5Kg: ₹350/kg | 25Kg: ₹345/kg | 50Kg: ₹340/kg",
    ratio: "1:9 (1 Kg Concentrate + 8.5 Kg Water + 500g Salt)",
    instructions: "पहले पानी में 500g नमक घोलें। मिक्स करके 1 दिन के लिए रख दें।"
  },
  {
    name: "Glass Cleaner Raw Material",
    rates: { tier5: 160, tier25: 155, tier50: 150 },
    slabs: "5Kg: ₹160/kg | 25Kg: ₹155/kg | 50Kg: ₹150/kg",
    ratio: "1:80 से 1:100 (1 Kg Concentrate + 80-100 Kg Water)",
    instructions: "सादा RO पानी न लें। हमेशा 0 TDS (Battery/DM Water) ही उपयोग करें ताकि कांच पर निशान न पड़ें।"
  },
  {
    name: "Car Wash Raw Material",
    rates: { tier5: 350, tier25: 345, tier50: 340 },
    slabs: "5Kg: ₹350/kg | 25Kg: ₹345/kg | 50Kg: ₹340/kg",
    ratio: "1:9 (1 Kg Concentrate + 8.5 Kg Water + 500g Salt)",
    instructions: "पहले पानी में 500g नमक मिलाएँ, फिर कंसन्ट्रेट मिक्स करें।"
  },
  {
    name: "Room Freshener (Rose, Jasmine, Mogra)",
    rates: { tier5: 1220, tier25: 1210, tier50: 1210 },
    slabs: "5Kg: ₹1220/kg | 10Kg: ₹1210/kg",
    ratio: "1:20 (1 Kg Concentrate + 15 Kg Water)",
    instructions: "RO पानी (< 70 TDS) में मिलाएं और बोतल में चेक करें।"
  }
];

// 🧴 BOTTLES, CANS, PUMPS & CAPS CATALOG (OCTOBER BOTTLE CATALOG - 18% GST INCLUDED)
const BOTTLE_CATALOG = [
  { name: "500ml Floor Cleaner Bottle", rate: 15, moq: 100, unit: "pcs" },
  { name: "500ml Dishwash Bottle", rate: 12, moq: 100, unit: "pcs" },
  { name: "500ml Handwash Bottle", rate: 18, moq: 100, unit: "pcs" },
  { name: "500ml Toilet Cleaner Bottle (60 gm)", rate: 15, moq: 300, unit: "pcs" },
  { name: "1000ml Toilet Cleaner Bottle (60 gm)", rate: 22, moq: 150, unit: "pcs" },
  { name: "5L HDPE Can (170 gm)", rate: 48, moq: 12, unit: "pcs" },
  { name: "500ml Glass Cleaner Bottle", rate: 22.5, moq: 100, unit: "pcs" },
  { name: "500ml Red Bottle", rate: 12.8, moq: 100, unit: "pcs" },
  { name: "Glass Cleaner Pump", rate: 10, moq: 100, unit: "pcs" },
  { name: "Push Pull Cap", rate: 2.5, moq: 10, unit: "pcs" },
  { name: "Handwash Pump", rate: 8, moq: 10, unit: "pcs" }
];

// 🛡️ OFFICIAL 12 OBJECTION HANDLING SCRIPTS
const OBJECTION_SCRIPTS = [
  {
    id: 1,
    title: "1. Price बहुत ज्यादा है",
    customer: "भाई, आपका price बहुत ज्यादा है।",
    reply: "सर, मैं आपकी बात समझ सकता हूँ। अगर मैं आपकी जगह होता तो मैं भी सबसे पहले price compare करता। लेकिन एक बात पूछूँ? क्या आप सबसे सस्ता solution चाहते हैं... या ऐसा solution जो बार-बार पैसा खर्च होने से बचाए? हमारा focus सिर्फ product बेचना नहीं, result देना है। इसी वजह से हमारे existing customers आज भी हमारे साथ जुड़े हुए हैं।"
  },
  {
    id: 2,
    title: "2. सोचकर बताऊँगा",
    customer: "मैं सोचकर बताऊँगा।",
    reply: "बिलकुल सर, सोचना चाहिए। लेकिन अगर आप allow करें तो सिर्फ एक सवाल पूछूँ? आपको किस बात पर सबसे ज़्यादा doubt है? Price? Quality? Trust? या Timing? ताकि मैं वही clear कर दूँ।"
  },
  {
    id: 3,
    title: "3. Budget नहीं है",
    customer: "अभी budget नहीं है।",
    reply: "समझ सकता हूँ सर। लेकिन क्या issue budget का है... या अभी investment करने का confidence नहीं बन रहा? अगर सिर्फ budget की बात है, तो हम उसके हिसाब से छोटा Trial / Sample Kit option भी discuss कर सकते हैं।"
  },
  {
    id: 4,
    title: "4. दूसरी Company सस्ता दे रही है",
    customer: "दूसरी company इससे सस्ता दे रही है।",
    reply: "हो सकता है सर। लेकिन क्या मैं पूछ सकता हूँ... क्या आपने सिर्फ price compare किया है... या dilution ratio, quality और after-sales support भी? क्योंकि सस्ता खरीदना आसान है... लेकिन बाद में batch खराब होने पर regret करना महंगा पड़ता है।"
  },
  {
    id: 5,
    title: "5. Online Trust नहीं है",
    customer: "मुझे online भरोसा नहीं है।",
    reply: "सर, आजकल trust होना बहुत जरूरी है। इसीलिए हम पहले सारी details share करते हैं — GST (08PBDPS5444B1ZD), Jaipur Factory/Office Details, Founder @rohitsam.0 की 20+ states की dispatch journey और Previous Client Proof, उसके बाद ही आगे बढ़ते हैं। हम चाहते हैं कि decision trust से हो, pressure से नहीं।"
  },
  {
    id: 6,
    title: "6. Partner से पूछना पड़ेगा",
    customer: "Partner से पूछना पड़ेगा।",
    reply: "बिलकुल सर। Final decision हमेशा discuss करके लेना चाहिए। बस एक request है... जब आप उनसे बात करें, तो अगर चाहें मैं दोनों को एक साथ conference call पर सारी formulation और margin details समझा देता हूँ ताकि कोई confusion न रहे।"
  },
  {
    id: 7,
    title: "7. अभी जरूरत नहीं है",
    customer: "अभी जरूरत नहीं है।",
    reply: "समझ सकता हूँ सर। बस एक सवाल... अगर आज जरूरत नहीं है, तो आपको कब लगेगा कि सही time आ गया है? मैं इसलिए पूछ रहा हूँ ताकि सही समय पर ही आपको contact करूँ।"
  },
  {
    id: 8,
    title: "8. अभी Busy हूँ",
    customer: "अभी busy हूँ।",
    reply: "कोई बात नहीं सर। मैं आपका सिर्फ 20 second लूँगा। अगर लगे useful नहीं है, मैं खुद call disconnect कर दूँगा।"
  },
  {
    id: 9,
    title: "9. WhatsApp कर दो",
    customer: "WhatsApp कर दो।",
    reply: "ज़रूर सर। लेकिन एक experience share करूँ? अधिकतर लोग message save करके भूल जाते हैं। मैं अभी catalog और sample details भेज देता हूँ। क्या मैं शाम को सिर्फ 2 minute follow-up call कर सकता हूँ?"
  },
  {
    id: 10,
    title: "10. मुझे जल्दी नहीं है / पहले सोचूँगा",
    customer: "मुझे जल्दी नहीं है।",
    reply: "बिलकुल सर। Decision बिना समझे नहीं लेना चाहिए। बस मैं ये जानना चाहता हूँ... अगर आपको आज decision नहीं लेना, तो उसकी सबसे बड़ी वजह क्या है?"
  },
  {
    id: 11,
    title: "11. Guarantee क्या है?",
    customer: "अगर result नहीं मिला तो?",
    reply: "बहुत अच्छा सवाल है। कोई भी genuine customer यही पूछता है। हम कभी हवा में बात नहीं करते—हम ready-to-mix compound देते हैं जिसमें 4-5 अलग केमिकल्स का झंझट ही नहीं है, साथ में पूरा mixing chart और video guidance देते हैं जिससे हर बार सेम गाढ़ापन और रिजल्ट आता है।"
  },
  {
    id: 12,
    title: "12. पहले किसी ने Fraud किया है",
    customer: "पहले मेरे साथ fraud हो चुका है।",
    reply: "सर, इसलिए आपका doubt बिल्कुल genuine है। इसी वजह से हम पहले Live Video Call, GST Verification (08PBDPS5444B1ZD), Client Bilty Proofs देते हैं, या आप सीधा हमारे जयपुर ऑफिस आकर भी माल ले सकते हैं। Trust कमाया जाता है, मांगा नहीं जाता।"
  }
];

const GOLDEN_CLOSING_LINES = [
  "सर, Decision आपका होगा, मेरा काम सिर्फ सही जानकारी देना है।",
  "अगर आपको लगे कि value नहीं है, तो बिल्कुल मत लीजिए।",
  "हम sale से पहले relationship बनाना पसंद करते हैं।",
  "मैं pressure नहीं डालूँगा, बस confusion दूर करना चाहता हूँ।",
  "हम product नहीं, customer का trust जीतने आए हैं।"
];

const playNotificationChime = () => {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(587.33, ctx.currentTime + 0.25);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.4);
  } catch (e) {}
};

const getISTTodayDate = () => {
  try {
    return new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
  } catch (e) {
    return new Date().toISOString().split("T")[0];
  }
};

const normalizePhone10 = (raw) => {
  const digits = String(raw || "").replace(/[^0-9]/g, "");
  return digits.length >= 10 ? digits.slice(-10) : digits;
};

const formatMonthLabel = (ym) => {
  if (!ym || ym.length < 7) return ym;
  const [y, m] = ym.split("-");
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const mIdx = parseInt(m, 10) - 1;
  return `${months[mIdx] || m} ${y}`;
};

const buildWhatsAppTemplate = (type, lead, callerName) => {
  const name = lead?.["Name"] || "Sir";
  const reqChem = lead?.["आपको कौन कौनसे chemical चाहिए?"] || "Cleaning Raw Materials";
  const nextDate = lead?.["Next_Call_Date"] ? String(lead["Next_Call_Date"]).split("T")[0] : "जल्द";
  const nextTime = lead?.["Next_Call_Time"] || "";

  if (type === "sample_kit") {
    return `नमस्ते ${name} जी! 🙏\n*Khushali Chemicals (Jaipur)* से ${callerName} बात कर रहा हूँ।\n\nअगर आप बड़ा ऑर्डर करने से पहले हमारी *Quality, Thickness और Fragrance* खुद टेस्ट करना चाहते हैं, तो आप हमारा *Business Starter Sample / Trial Kit* मंगवा सकते हैं:\n\n🧪 *Trial Kit के फायदे:*\n✅ *Ready-to-Mix Formula:* 4-5 अलग केमिकल्स मिलाने की झंझट खत्म, सिर्फ पानी मिलाएं और प्रोडक्ट तैयार!\n✅ *High Dilution Ratio:*\n• White/Rose Phenyl (1:30)\n• Handwash / Dishwash / Car Wash (1:9)\n• Toilet Cleaner (1:7)\n• Glass Cleaner (1:100)\n✅ *Complete Mixing Guide:* हर प्रोडक्ट की सटीक रेसिपी और वीडियो सपोर्ट साथ मिलेगा।\n\n📦 आज शाम की गाड़ी में आपका ट्रायल पैक या 5Kg कैन डिस्पैच करवा दें? कृपया अपना Pincode भेजें! 🚚`;
  }

  if (type === "price_list") {
    return `नमस्ते ${name} जी! 🙏\n*KHUSHALI CHEMICALS (Jaipur)*\n*(All Rates Per Kg - Including 18% GST)*\n\n🔹 *White Phenyl Conc (1:30):* ₹255 (5Kg) | ₹245 (50Kg)\n🔹 *Rose Phenyl Conc (1:30):* ₹265 (5Kg) | ₹255 (50Kg)\n🔹 *Black Phenyl Conc (1:9):* ₹175 (5Kg) | ₹165 (50Kg)\n🔹 *Toilet Cleaner Conc (1:7):* ₹125 (5Kg) | ₹115 (50Kg)\n🔹 *Bathroom Cleaner (1:8):* ₹145 (5Kg) | ₹135 (50Kg)\n🔹 *Handwash / Dishwash / Fabric / Car Wash (1:9):* ₹350 (5Kg) | ₹340 (50Kg)\n🔹 *Glass Cleaner Conc (1:100):* ₹160 (5Kg) | ₹150 (50Kg)\n🔹 *Floor Cleaner Conc (1:60):* ₹820 (5Kg) | ₹800 (50Kg)\n🔹 *Room Freshener (1:20):* ₹1220 (5Kg)\n\n📋 *GST:* 08PBDPS5444B1ZD\n🌐 *Web:* khushalichemicals.com\n\nबताइए सर, इसमें से कौन-कौन से आइटम का कोटेशन या सैंपल पैक फाइनल करें?`;
  }

  if (type === "office_visit") {
    return `नमस्ते ${name} जी! 🙏\n*Khushali Chemicals (Jaipur)* के ऑफिस विजिट के लिए आपका स्वागत है।\n\n📅 *Scheduled Visit:* ${nextDate}${nextTime ? " को " + nextTime + " बजे" : ""}\n📍 *Location:* Jaipur, Rajasthan\n🏢 *GST:* 08PBDPS5444B1ZD\n📞 *Contact:* 8905878950\n\nआप यहाँ आकर हमारे सभी Raw Material Compounds की लाइव मिक्सिंग और क्वालिटी चेक कर सकते हैं। जयपुर पहुँचने से पहले एक बार कॉल ज़रूर कीजियेगा!`;
  }

  if (type === "trust_proof") {
    return `नमस्ते ${name} जी! 🙏\n*Khushali Chemicals (Jaipur)* भारत के 20+ राज्यों में क्लीनिंग रॉ मटेरियल सप्लाई कर रहा है।\n\n✨ *हमारी पहचान:*\n• *Founder:* Rohit Sambhawani (@rohitsam.0 on Instagram)\n• *Registered GST:* 08PBDPS5444B1ZD\n• *Website:* khushalichemicals.com\n• *1-Compound Technology:* बिना किसी कॉम्प्लेक्स प्रोसेस के सीधे पानी मिलाकर मार्केट-रेडी प्रोडक्ट बनाएं।\n\nहम प्रोडक्ट बेचने से पहले कस्टमर का भरोसा जीतने में विश्वास रखते हैं। आपकी *${reqChem}* की रिक्वायरमेंट के लिए कॉल पर बात करें?`;
  }

  return `नमस्ते ${name} जी! 🙏 Khushali Chemicals (Jaipur) से ${callerName} बात कर रहा हूँ। आपकी *${reqChem}* की रिक्वायरमेंट के रिगार्डिंग हमने कोटेशन शेयर किया था। कृपया बताएं ट्रायल पैक या ऑर्डर कब डिस्पैच करवाएं?`;
};

export default function KhushaliCallerCRM() {
  const todayDate = getISTTodayDate();

  const [selectedProfile, setSelectedProfile] = useState("piyush");
  const [password, setPassword] = useState("");
  const [loggedInCaller, setLoggedInCaller] = useState(null);
  const [loginError, setLoginError] = useState("");

  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [merging, setMerging] = useState(false);
  const [activeFilter, setActiveFilter] = useState("today");
  const [adminCallerFilter, setAdminCallerFilter] = useState("all");
  const [selectedMonth, setSelectedMonth] = useState(todayDate.slice(0, 7));
  const [showDailyBreakdown, setShowDailyBreakdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [autoDialerActive, setAutoDialerActive] = useState(false);

  // Popups & Modals State
  const [smartPopupLead, setSmartPopupLead] = useState(null);
  const [showSmartPopup, setShowSmartPopup] = useState(false);
  const [isPopupMinimized, setIsPopupMinimized] = useState(false);
  const [activeLeadModal, setActiveLeadModal] = useState(null);
  const [historyModalLead, setHistoryModalLead] = useState(null);
  const [newCustomerModalOpen, setNewCustomerModalOpen] = useState(false);
  const [editCustomerModalOpen, setEditCustomerModalOpen] = useState(false);
  const [knowledgeModalTab, setKnowledgeModalTab] = useState(null);
  const [waTemplateModalLead, setWaTemplateModalLead] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  // 📲 WHATSAPP QUOTATION BUILDER MODAL STATE (Moved here from App.jsx + Editable Price While Selecting)
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [quoteCustomerName, setQuoteCustomerName] = useState("");
  const [quoteCustomerPhone, setQuoteCustomerPhone] = useState("");
  const [quoteCustomerCity, setQuoteCustomerCity] = useState("Jaipur, Rajasthan");
  const [quoteItems, setQuoteItems] = useState([
    { id: 1, itemType: "CHEMICAL", productName: PRODUCT_CATALOG[3].name, tier: "tier25", qty: 25, unit: "kg", customPrice: 120 },
    { id: 2, itemType: "BOTTLE", productName: BOTTLE_CATALOG[0].name, tier: "pcs", qty: 100, unit: "pcs", customPrice: 15 }
  ]);

  // Call Update Inputs
  const [callStatusInput, setCallStatusInput] = useState("Interested");
  const [leadPriorityInput, setLeadPriorityInput] = useState("WARM");
  const [orderAmountInput, setOrderAmountInput] = useState("");
  const [orderDetailsInput, setOrderDetailsInput] = useState("");
  const [visitDateInput, setVisitDateInput] = useState("");
  const [visitTimeInput, setVisitTimeInput] = useState("11:00");
  const [callNoteInput, setCallNoteInput] = useState("");
  const [customDateTimeEnabled, setCustomDateTimeEnabled] = useState(false);
  const [customDateInput, setCustomDateInput] = useState("");
  const [customTimeInput, setCustomTimeInput] = useState("");
  const [modalHelperTab, setModalHelperTab] = useState("history");
  const [saving, setSaving] = useState(false);

  // New Customer Form State
  const [newLeadForm, setNewLeadForm] = useState({
    name: "",
    number: "",
    city: "",
    budget: "",
    chemicals: "",
    priority: "HOT",
    note: "",
    targetCaller: "piyush"
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
    setIsPopupMinimized(false);
    setAutoDialerActive(false);
    sessionStorage.removeItem("khushali_active_caller");
  };

  const getLeadPriority = (lead) => {
    const status = lead["Call_Status"] || "";
    const allNotes = FOLLOWUP_FLOW.map(f => lead[f.noteCol] || "").join(" ");
    if (allNotes.includes("[🔥 HOT]") || status === "Planning to Visit Office") return "HOT";
    if (allNotes.includes("[🔵 COLD]")) return "COLD";
    if (allNotes.includes("[🟡 WARM]")) return "WARM";
    const budgetNum = parseFloat(String(lead["सर आपका बजट कितना है?"] || "").replace(/[^0-9]/g, "")) || 0;
    if (budgetNum >= 15000) return "HOT";
    return "WARM";
  };

  const getLeadRemarksList = (lead) => {
    if (!lead) return [];
    const list = [];
    FOLLOWUP_FLOW.forEach((f) => {
      if (lead[f.noteCol] && String(lead[f.noteCol]).trim() !== "") {
        list.push({
          stage: f.stage,
          note: String(lead[f.noteCol]).trim()
        });
      }
    });
    return list;
  };

  const getLeadCallDates = (lead) => {
    const dates = [];
    const allNotes = FOLLOWUP_FLOW.map(f => String(lead[f.noteCol] || "")).join(" ");
    const matches = allNotes.match(/\[(\d{4}-\d{2}-\d{2})/g);
    if (matches && matches.length > 0) {
      matches.forEach((m) => dates.push(m.replace("[", "")));
    }
    const lastCall = lead["Last_Call_Date"] ? String(lead["Last_Call_Date"]).split("T")[0] : "";
    if (lastCall && !dates.includes(lastCall)) {
      dates.push(lastCall);
    }
    return dates;
  };

  const liveDuplicateLead = useMemo(() => {
    const typedNorm = normalizePhone10(newLeadForm.number);
    if (typedNorm.length < 8) return null;
    return leads.find((l) => {
      const existingNorm = normalizePhone10(l["Number"] || l["Contact Number"]);
      return existingNorm === typedNorm;
    }) || null;
  }, [newLeadForm.number, leads]);

  const fetchCallerSheet = async () => {
    if (!loggedInCaller) return;
    setLoading(true);
    try {
      if (loggedInCaller.role === "admin") {
        const urls = [
          { id: "piyush", name: "Piyush", url: CALLER_PROFILES.piyush.sheetApiUrl },
          { id: "garv", name: "Garv", url: CALLER_PROFILES.garv.sheetApiUrl }
        ];
        const combined = [];
        await Promise.all(
          urls.map(async (u) => {
            if (!u.url) return;
            try {
              const res = await fetch(u.url);
              const data = await res.json();
              if (data.status === "success" && Array.isArray(data.leads)) {
                data.leads.forEach((l) => {
                  combined.push({
                    ...l,
                    _callerId: u.id,
                    _callerName: u.name,
                    _sheetUrl: u.url,
                    _uniqueKey: `${u.id}_${l.rowIndex}`
                  });
                });
              }
            } catch (e) {
              console.error(`Error fetching ${u.name}:`, e);
            }
          })
        );
        setLeads(combined);
      } else {
        if (!loggedInCaller.sheetApiUrl) return;
        const res = await fetch(loggedInCaller.sheetApiUrl);
        const data = await res.json();
        if (data.status === "success") {
          const tagged = (data.leads || []).map((l) => ({
            ...l,
            _callerId: loggedInCaller.id,
            _callerName: loggedInCaller.name,
            _sheetUrl: loggedInCaller.sheetApiUrl,
            _uniqueKey: `${loggedInCaller.id}_${l.rowIndex}`
          }));
          setLeads(tagged);
        }
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

  const handleMergeDuplicatesNow = async () => {
    if (!loggedInCaller) return;
    setMerging(true);
    try {
      const urlsToMerge = loggedInCaller.role === "admin"
        ? [CALLER_PROFILES.piyush.sheetApiUrl, CALLER_PROFILES.garv.sheetApiUrl].filter(Boolean)
        : [loggedInCaller.sheetApiUrl].filter(Boolean);

      await Promise.all(
        urlsToMerge.map((url) =>
          fetch(url, {
            method: "POST",
            mode: "no-cors",
            headers: { "Content-Type": "text/plain;charset=utf-8" },
            body: JSON.stringify({ action: "merge_duplicates" }),
          })
        )
      );

      setTimeout(async () => {
        await fetchCallerSheet();
        setMerging(false);
        alert("✅ Sabhi duplicate numbers merge ho gaye hain aur sheet clean ho gayi hai!");
      }, 1500);
    } catch (err) {
      setMerging(false);
      alert("Merge karne me error aaya: " + err.message);
    }
  };

  // --- WHATSAPP QUOTATION BUILDER HELPERS ---
  const openQuotationForLead = (lead = null) => {
    if (lead) {
      setQuoteCustomerName(lead["Name"] || "Valued Buyer");
      setQuoteCustomerPhone(String(lead["Number"] || lead["Contact Number"] || "").replace(/[^0-9]/g, ""));
      setQuoteCustomerCity(lead["City"] || "India");
    } else {
      setQuoteCustomerName("Wholesale Buyer");
      setQuoteCustomerPhone("");
      setQuoteCustomerCity("Jaipur, Rajasthan");
    }
    setQuoteModalOpen(true);
  };

  const addQuoteRow = (type = "CHEMICAL") => {
    if (type === "BOTTLE") {
      const b = BOTTLE_CATALOG[0];
      setQuoteItems(prev => [
        ...prev,
        { id: Date.now() + Math.random(), itemType: "BOTTLE", productName: b.name, tier: "pcs", qty: b.moq, unit: "pcs", customPrice: b.rate }
      ]);
    } else {
      const p = PRODUCT_CATALOG[0];
      setQuoteItems(prev => [
        ...prev,
        { id: Date.now() + Math.random(), itemType: "CHEMICAL", productName: p.name, tier: "tier25", qty: 25, unit: "kg", customPrice: p.rates.tier25 }
      ]);
    }
  };

  const updateQuoteRow = (rowId, patch) => {
    setQuoteItems(prev => prev.map(row => {
      if (row.id !== rowId) return row;
      const updated = { ...row, ...patch };

      if (patch.productName) {
        if (updated.itemType === "BOTTLE") {
          const foundB = BOTTLE_CATALOG.find(b => b.name === patch.productName) || BOTTLE_CATALOG[0];
          updated.customPrice = foundB.rate;
          updated.unit = "pcs";
        } else {
          const foundP = PRODUCT_CATALOG.find(p => p.name === patch.productName) || PRODUCT_CATALOG[0];
          updated.customPrice = foundP.rates[updated.tier] || foundP.rates.tier25;
          updated.unit = "kg";
        }
      }

      if (patch.tier && updated.itemType === "CHEMICAL") {
        const foundP = PRODUCT_CATALOG.find(p => p.name === updated.productName) || PRODUCT_CATALOG[0];
        updated.customPrice = foundP.rates[patch.tier] || foundP.rates.tier25;
      }

      return updated;
    }));
  };

  const removeQuoteRow = (rowId) => {
    setQuoteItems(prev => prev.filter(r => r.id !== rowId));
  };

  const quoteSummary = useMemo(() => {
    let totalAmount = 0;
    const rows = quoteItems.map(item => {
      const qty = Number(item.qty) || 0;
      const price = Number(item.customPrice) || 0;
      const lineTotal = Math.round(qty * price);
      totalAmount += lineTotal;
      return { ...item, qty, price, lineTotal };
    });
    const gstIncluded = Math.round((totalAmount * 18) / 118);
    const taxableBase = totalAmount - gstIncluded;
    return { rows, totalAmount, gstIncluded, taxableBase };
  }, [quoteItems]);

  const buildQuotationWhatsAppText = () => {
    const lines = [
      "*KHUSHALI CHEMICALS - QUOTATION*",
      "📍 Jaipur, Rajasthan | 📞 +91 8905878950",
      "GST: 08PBDPS5444B1ZD | Web: khushalichemicals.com",
      "------------------------------------------",
      `*Client:* ${quoteCustomerName || "Valued Buyer"} (${quoteCustomerCity || "India"})`,
      `*Date:* ${new Date().toLocaleDateString("en-IN")}`,
      "------------------------------------------",
      "*ITEMS SUMMARY (18% GST Included):*"
    ];

    quoteSummary.rows.forEach((r, idx) => {
      lines.push(`${idx + 1}. *${r.productName}*`);
      lines.push(`   Qty: ${r.qty} ${r.unit} @ ₹${r.price}/${r.unit} = *₹${r.lineTotal.toLocaleString("en-IN")}*`);
    });

    lines.push("------------------------------------------");
    lines.push(`💰 *TOTAL PAYABLE: ₹${quoteSummary.totalAmount.toLocaleString("en-IN")}*`);
    lines.push(`(Incl. 18% GST: ₹${quoteSummary.gstIncluded.toLocaleString("en-IN")})`);
    lines.push(`\nPrepared by ${loggedInCaller?.name || "Sales Team"} • Reply to confirm order.`);

    return lines.join("\n");
  };

  const availableMonths = useMemo(() => {
    const monthSet = new Set([todayDate.slice(0, 7)]);
    leads.forEach((l) => {
      const d1 = l["Day_1_Date"] ? String(l["Day_1_Date"]).slice(0, 7) : "";
      const lc = l["Last_Call_Date"] ? String(l["Last_Call_Date"]).slice(0, 7) : "";
      const ts = l["Timestamp"] ? String(l["Timestamp"]).slice(0, 7) : "";
      if (/^\d{4}-\d{2}$/.test(d1)) monthSet.add(d1);
      if (/^\d{4}-\d{2}$/.test(lc)) monthSet.add(lc);
      if (/^\d{4}-\d{2}$/.test(ts)) monthSet.add(ts);
    });
    return Array.from(monthSet).sort((a, b) => b.localeCompare(a));
  }, [leads, todayDate]);

  const performanceStats = useMemo(() => {
    const calcForList = (list, targetRev = 15000) => {
      let callsCount = 0;
      let ordersCount = 0;
      let revenue = 0;
      let officeVisits = 0;
      let overdueCount = 0;
      let hotCount = 0;

      let monthlyCalls = 0;
      let monthlyUniqueLeads = 0;
      let monthlyNewLeads = 0;
      let monthlyOrders = 0;
      let monthlyRevenue = 0;
      let monthlyOfficeVisits = 0;

      list.forEach((l) => {
        const status = l["Call_Status"] || "New";
        const isClosed = status === "Order Confirmed" || status === "Not Interested";
        const lastCall = l["Last_Call_Date"] ? String(l["Last_Call_Date"]).split("T")[0] : "";
        const nextDate = l["Next_Call_Date"] ? String(l["Next_Call_Date"]).split("T")[0] : "";
        const day1Date = l["Day_1_Date"] ? String(l["Day_1_Date"]).split("T")[0] : "";
        const tsDate = l["Timestamp"] ? String(l["Timestamp"]).split("T")[0] : "";

        if (lastCall === todayDate) {
          callsCount += 1;
          if (status === "Order Confirmed") {
            ordersCount += 1;
            revenue += parseFloat(l["Order_Amount"] || l["Amount"] || 0);
          }
        }
        if (!isClosed && status === "Planning to Visit Office") officeVisits += 1;
        if (!isClosed && nextDate && nextDate < todayDate) overdueCount += 1;
        if (!isClosed && getLeadPriority(l) === "HOT") hotCount += 1;

        const callDates = getLeadCallDates(l);
        const callsInMonth = callDates.filter((d) => d.startsWith(selectedMonth)).length;
        if (callsInMonth > 0) {
          monthlyCalls += callsInMonth;
          monthlyUniqueLeads += 1;
        }

        const createdDate = day1Date || tsDate;
        if (createdDate && createdDate.startsWith(selectedMonth)) {
          monthlyNewLeads += 1;
        }

        const orderDate = lastCall || day1Date || tsDate;
        if (status === "Order Confirmed" && orderDate && orderDate.startsWith(selectedMonth)) {
          monthlyOrders += 1;
          monthlyRevenue += parseFloat(l["Order_Amount"] || l["Amount"] || 0);
        }

        const allNotes = FOLLOWUP_FLOW.map((f) => String(l[f.noteCol] || "")).join(" ");
        if (
          (status === "Planning to Visit Office" && (nextDate.startsWith(selectedMonth) || lastCall.startsWith(selectedMonth))) ||
          allNotes.includes(`OFFICE VISIT: ${selectedMonth}`)
        ) {
          monthlyOfficeVisits += 1;
        }
      });

      const revProgress = Math.min(100, Math.round((revenue / targetRev) * 100));
      const monthlyConversionRate = monthlyUniqueLeads > 0 ? Math.round((monthlyOrders / monthlyUniqueLeads) * 100) : 0;

      return {
        callsCount,
        ordersCount,
        revenue,
        revProgress,
        officeVisits,
        overdueCount,
        hotCount,
        totalLeads: list.length,
        monthlyCalls,
        monthlyUniqueLeads,
        monthlyNewLeads,
        monthlyOrders,
        monthlyRevenue,
        monthlyOfficeVisits,
        monthlyConversionRate
      };
    };

    const overall = calcForList(leads, loggedInCaller?.dailyTargetRevenue || 15000);
    const piyushStats = calcForList(leads.filter((l) => l._callerId === "piyush"), 15000);
    const garvStats = calcForList(leads.filter((l) => l._callerId === "garv"), 15000);

    const dailyMap = {};
    leads.forEach((l) => {
      const caller = l._callerId || "piyush";
      const status = l["Call_Status"] || "New";
      const lastCall = l["Last_Call_Date"] ? String(l["Last_Call_Date"]).split("T")[0] : "";
      const callDates = getLeadCallDates(l);

      callDates.forEach((d) => {
        if (!d.startsWith(selectedMonth)) return;
        if (!dailyMap[d]) {
          dailyMap[d] = { date: d, piyushCalls: 0, garvCalls: 0, orders: 0, revenue: 0 };
        }
        if (caller === "piyush") dailyMap[d].piyushCalls += 1;
        if (caller === "garv") dailyMap[d].garvCalls += 1;
      });

      if (status === "Order Confirmed" && lastCall && lastCall.startsWith(selectedMonth)) {
        if (!dailyMap[lastCall]) {
          dailyMap[lastCall] = { date: lastCall, piyushCalls: 0, garvCalls: 0, orders: 0, revenue: 0 };
        }
        dailyMap[lastCall].orders += 1;
        dailyMap[lastCall].revenue += parseFloat(l["Order_Amount"] || l["Amount"] || 0);
      }
    });

    const dailyBreakdownList = Object.values(dailyMap).sort((a, b) => b.date.localeCompare(a.date));
    const monthlyMissionProgress = Math.min(100, Math.round((overall.monthlyRevenue / 1000000) * 100));

    return { overall, piyushStats, garvStats, dailyBreakdownList, monthlyMissionProgress };
  }, [leads, todayDate, loggedInCaller, selectedMonth]);

  const tabCounts = useMemo(() => {
    let today = 0;
    let calledToday = 0;
    let ordersToday = 0;
    let officeVisit = 0;
    let hotLeads = 0;
    let overdue = 0;
    let upcoming = 0;

    const baseList = loggedInCaller?.role === "admin" && adminCallerFilter !== "all"
      ? leads.filter(l => l._callerId === adminCallerFilter)
      : leads;

    baseList.forEach((l) => {
      const status = l["Call_Status"] || "New";
      const isClosed = status === "Order Confirmed" || status === "Not Interested";
      const nextDate = l["Next_Call_Date"] ? String(l["Next_Call_Date"]).split("T")[0] : "";
      const lastCall = l["Last_Call_Date"] ? String(l["Last_Call_Date"]).split("T")[0] : "";

      if (lastCall === todayDate) {
        calledToday += 1;
        if (status === "Order Confirmed") ordersToday += 1;
      }

      if (!isClosed) {
        if (status === "Planning to Visit Office") officeVisit += 1;
        if (getLeadPriority(l) === "HOT") hotLeads += 1;

        if (!nextDate || nextDate === todayDate) today += 1;
        else if (nextDate < todayDate) overdue += 1;
        else if (nextDate > todayDate) upcoming += 1;
      }
    });

    return { today, calledToday, ordersToday, officeVisit, hotLeads, overdue, upcoming, all: baseList.length };
  }, [leads, todayDate, loggedInCaller, adminCallerFilter]);

  useEffect(() => {
    if (!loggedInCaller || leads.length === 0) return;

    const checkScheduledAndUrgentCalls = () => {
      const now = new Date();
      const currentTimeStr = now.toTimeString().slice(0, 5);

      const exactTimeLead = leads.find((l) => {
        const status = l["Call_Status"] || "New";
        if (status === "Order Confirmed" || status === "Not Interested") return false;
        const nextDate = l["Next_Call_Date"] ? String(l["Next_Call_Date"]).split("T")[0] : "";
        const nextTime = l["Next_Call_Time"] || "";
        return nextDate === todayDate && nextTime && nextTime <= currentTimeStr;
      });

      if (exactTimeLead) {
        if (!smartPopupLead || smartPopupLead._uniqueKey !== exactTimeLead._uniqueKey) {
          playNotificationChime();
        }
        setSmartPopupLead(exactTimeLead);
        setShowSmartPopup(true);
        setIsPopupMinimized(false);
        return;
      }

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
    const timer = setInterval(checkScheduledAndUrgentCalls, 15000);
    return () => clearInterval(timer);
  }, [leads, loggedInCaller, todayDate, showSmartPopup, smartPopupLead]);

  const handleSnooze = () => {
    if (!smartPopupLead) return;
    setLeads((prev) => {
      const withoutCurrent = prev.filter((l) => l._uniqueKey !== smartPopupLead._uniqueKey);
      return [...withoutCurrent, smartPopupLead];
    });
    setIsPopupMinimized(true);
  };

  const calculateNextFollowUp = (lead, forceSameDay = false) => {
    const currentStage = lead["Current_Stage"] || "Day 1";
    const lastCallDate = lead["Last_Call_Date"] ? String(lead["Last_Call_Date"]).split("T")[0] : "";
    const idx = FOLLOWUP_FLOW.findIndex((f) => f.stage === currentStage);
    const currentObj = idx !== -1 ? FOLLOWUP_FLOW[idx] : FOLLOWUP_FLOW[0];

    const isSameDayRepeat = forceSameDay || (lastCallDate === todayDate);

    if (isSameDayRepeat) {
      return {
        nextStage: currentStage,
        nextDate: lead["Next_Call_Date"] ? String(lead["Next_Call_Date"]).split("T")[0] : todayDate,
        noteCol: currentObj.noteCol,
        isSameDayRepeat: true
      };
    }

    if (idx === FOLLOWUP_FLOW.length - 1) {
      return { nextStage: "Completed", nextDate: "CLOSED", noteCol: currentObj.noteCol, isSameDayRepeat: false };
    }

    const nextObj = idx !== -1 ? FOLLOWUP_FLOW[idx + 1] : FOLLOWUP_FLOW[1];
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + (nextObj.days - currentObj.days));

    return {
      nextStage: nextObj.stage,
      nextDate: targetDate.toISOString().split("T")[0],
      noteCol: nextObj.noteCol,
      isSameDayRepeat: false
    };
  };

  const handleOpenUpdateModal = (lead) => {
    setActiveLeadModal(lead);
    setCallStatusInput(lead["Call_Status"] === "Planning to Visit Office" ? "Planning to Visit Office" : "Interested");
    setLeadPriorityInput(getLeadPriority(lead));
    setOrderAmountInput("");
    setOrderDetailsInput("");
    setVisitDateInput(todayDate);
    setVisitTimeInput("11:00");
    setCallNoteInput("");
    setCustomDateTimeEnabled(false);
    setCustomDateInput("");
    setCustomTimeInput("");

    const existingRemarks = getLeadRemarksList(lead);
    setModalHelperTab(existingRemarks.length > 0 ? "history" : "objections");
  };

  const handleSaveFollowUp = async () => {
    if (!activeLeadModal || !loggedInCaller) return;
    setSaving(true);

    try {
      const currentStage = activeLeadModal["Current_Stage"] || "Day 1";
      const isSameDayForce = callStatusInput === "Same Day Follow-up" || callStatusInput === "Planning to Visit Office";
      const stepInfo = calculateNextFollowUp(activeLeadModal, isSameDayForce);

      let nextStageVal = stepInfo.nextStage;
      let nextDateVal = stepInfo.nextDate;
      let nextTimeVal = "";

      if (callStatusInput === "Planning to Visit Office") {
        nextStageVal = currentStage;
        nextDateVal = visitDateInput || todayDate;
        nextTimeVal = visitTimeInput || "";
      } else if (customDateTimeEnabled && customDateInput) {
        nextDateVal = customDateInput;
        nextTimeVal = customTimeInput || "";
      } else if (callStatusInput === "Same Day Follow-up" || stepInfo.isSameDayRepeat) {
        nextStageVal = currentStage;
      } else if (callStatusInput === "Busy / Call Tomorrow" || callStatusInput === "Ringing / Not Picked") {
        nextStageVal = currentStage;
        const tmw = new Date();
        tmw.setDate(tmw.getDate() + 1);
        nextDateVal = tmw.toISOString().split("T")[0];
      } else if (callStatusInput === "Order Confirmed" || callStatusInput === "Not Interested") {
        nextStageVal = "CLOSED";
        nextDateVal = "CLOSED";
      }

      const nowTime = new Date().toTimeString().slice(0, 5);
      const finalAmt = callStatusInput === "Order Confirmed" ? (parseFloat(orderAmountInput) || 0) : 0;
      const priorityTag = leadPriorityInput === "HOT" ? "[🔥 HOT]" : leadPriorityInput === "COLD" ? "[🔵 COLD]" : "[🟡 WARM]";
      
      const noteTimestamp = `[${todayDate} ${nowTime}] ${priorityTag}`;
      let finalRemark = "";
      if (callStatusInput === "Order Confirmed") {
        finalRemark = `${noteTimestamp} [ORDER: ₹${finalAmt}] ${orderDetailsInput} | Note: ${callNoteInput}`;
      } else if (callStatusInput === "Planning to Visit Office") {
        finalRemark = `${noteTimestamp} [🏢 OFFICE VISIT: ${nextDateVal}${nextTimeVal ? " @ " + nextTimeVal : ""}] ${callNoteInput}`;
      } else if (customTimeInput) {
        finalRemark = `${noteTimestamp} [Scheduled: ${nextDateVal} @ ${nextTimeVal}] ${callNoteInput}`;
      } else {
        finalRemark = `${noteTimestamp} ${callNoteInput}`;
      }

      const targetSheetUrl = activeLeadModal._sheetUrl || loggedInCaller.sheetApiUrl;

      const payload = {
        action: "update_call",
        rowIndex: Number(activeLeadModal.rowIndex),
        nextStage: nextStageVal,
        nextCallDate: nextDateVal,
        nextCallTime: nextTimeVal,
        lastCallDate: todayDate,
        callStatus: callStatusInput,
        orderAmount: finalAmt,
        stageNoteColumn: stepInfo.noteCol,
        note: finalRemark,
      };

      await fetch(targetSheetUrl, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload),
      });

      const currentUniqueKey = activeLeadModal._uniqueKey;

      const updatedLeads = leads.map((item) =>
        item._uniqueKey === currentUniqueKey
          ? {
              ...item,
              Current_Stage: nextStageVal,
              Next_Call_Date: nextDateVal,
              Next_Call_Time: nextTimeVal,
              Last_Call_Date: todayDate,
              Call_Status: callStatusInput,
              Order_Amount: finalAmt,
              [stepInfo.noteCol]: item[stepInfo.noteCol] 
                ? `${item[stepInfo.noteCol]} | ${finalRemark}` 
                : finalRemark,
            }
          : item
      );

      setLeads(updatedLeads);
      setActiveLeadModal(null);
      setShowSmartPopup(false);
      setIsPopupMinimized(false);
      setCallNoteInput("");
      setOrderAmountInput("");
      setOrderDetailsInput("");

      if (autoDialerActive) {
        const nextDueLead = updatedLeads.find((l) => {
          if (l._uniqueKey === currentUniqueKey) return false;
          const st = l["Call_Status"] || "New";
          if (st === "Order Confirmed" || st === "Not Interested") return false;
          const nd = l["Next_Call_Date"] ? String(l["Next_Call_Date"]).split("T")[0] : "";
          const lc = l["Last_Call_Date"] ? String(l["Last_Call_Date"]).split("T")[0] : "";
          return (!nd || nd <= todayDate) && lc !== todayDate;
        });

        if (nextDueLead) {
          setTimeout(() => {
            handleOpenUpdateModal(nextDueLead);
          }, 350);
        } else {
          setAutoDialerActive(false);
          alert("🎉 Aaj ke sabhi due calls complete ho gaye! Auto-Dialer finished.");
        }
      }
    } catch (e) {
      alert("Sheet update karne mein dikkat aayi: " + e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleAddNewCustomer = async (e) => {
    e.preventDefault();
    if (!loggedInCaller) return;

    const cleanName = String(newLeadForm.name || "").trim();
    const cleanNumber = String(newLeadForm.number || "").trim();
    const normNewPhone = normalizePhone10(cleanNumber);

    const existingLead = leads.find((l) => {
      const existingNorm = normalizePhone10(l["Number"] || l["Contact Number"]);
      return normNewPhone.length >= 8 && existingNorm === normNewPhone;
    });

    if (existingLead) {
      alert(
        `⚠️ Ye Lead Already Exists Karti Hai! Dubara Save Nahi Hogi.\n\n` +
        `👤 Customer Name: ${existingLead["Name"] || "Unknown"}\n` +
        `📞 Mobile Number: ${existingLead["Number"] || existingLead["Contact Number"]}\n` +
        `🎧 Assigned Caller: ${existingLead._callerName || loggedInCaller.name}\n` +
        `📊 Current Status: ${existingLead["Call_Status"] || "New"} (${existingLead["Current_Stage"] || "Day 1"})`
      );
      return;
    }

    try {
      setSaving(true);
      const targetCallerObj = loggedInCaller.role === "admin" 
        ? CALLER_PROFILES[newLeadForm.targetCaller || "piyush"] 
        : loggedInCaller;

      const callerLeads = leads.filter(l => l._callerId === targetCallerObj.id);
      const newRowIndex = callerLeads.length > 0 ? Math.max(...callerLeads.map(l => Number(l.rowIndex) || 0)) + 1 : 2;

      const cleanCity = String(newLeadForm.city || "").trim();
      const cleanBudget = String(newLeadForm.budget || "").trim();
      const cleanChemicals = String(newLeadForm.chemicals || "").trim();
      const priorityTag = newLeadForm.priority === "HOT" ? "[🔥 HOT]" : newLeadForm.priority === "COLD" ? "[🔵 COLD]" : "[🟡 WARM]";

      const newEntry = {
        rowIndex: newRowIndex,
        _callerId: targetCallerObj.id,
        _callerName: targetCallerObj.name,
        _sheetUrl: targetCallerObj.sheetApiUrl,
        _uniqueKey: `${targetCallerObj.id}_${newRowIndex}`,
        Timestamp: new Date().toISOString(),
        Day_1_Date: todayDate,
        Name: cleanName,
        Number: cleanNumber,
        "Contact Number": cleanNumber,
        City: cleanCity,
        "सर आपका बजट कितना है?": cleanBudget,
        "आपको कौन कौनसे chemical चाहिए?": cleanChemicals,
        Current_Stage: "Day 1",
        Next_Call_Date: todayDate,
        Next_Call_Time: "",
        Call_Status: "New",
        Day_1_Note: `[${todayDate}] ${priorityTag} ${newLeadForm.note || "Direct CRM Entry"}`
      };

      await fetch(targetCallerObj.sheetApiUrl, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({ action: "add_lead", ...newEntry }),
      });

      setLeads((prev) => [newEntry, ...prev]);
      setNewCustomerModalOpen(false);
      setNewLeadForm({ name: "", number: "", city: "", budget: "", chemicals: "", priority: "HOT", note: "", targetCaller: "piyush" });
    } catch (err) {
      alert("Naya customer add karne me dikkat aayi: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleOpenEditCustomer = (lead) => {
    setEditLeadForm({
      rowIndex: lead.rowIndex,
      _uniqueKey: lead._uniqueKey,
      _sheetUrl: lead._sheetUrl || loggedInCaller.sheetApiUrl,
      name: String(lead["Name"] || ""),
      number: String(lead["Number"] || lead["Contact Number"] || ""),
      city: String(lead["City"] || ""),
      budget: String(lead["सर आपका बजट कितना है?"] || ""),
      chemicals: String(lead["आपको कौन कौनसे chemical चाहिए?"] || "")
    });
    setEditCustomerModalOpen(true);
  };

  const handleSaveCustomerEdit = async (e) => {
    e.preventDefault();
    if (!loggedInCaller) return;

    try {
      setSaving(true);

      const cleanName = String(editLeadForm.name || "").trim();
      const cleanNumber = String(editLeadForm.number || "").trim();
      const cleanCity = String(editLeadForm.city || "").trim();
      const cleanBudget = String(editLeadForm.budget || "").trim();
      const cleanChemicals = String(editLeadForm.chemicals || "").trim();

      const payload = {
        action: "edit_lead",
        rowIndex: Number(editLeadForm.rowIndex),
        name: cleanName,
        number: cleanNumber,
        city: cleanCity,
        budget: cleanBudget,
        chemicals: cleanChemicals
      };

      await fetch(editLeadForm._sheetUrl || loggedInCaller.sheetApiUrl, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload),
      });

      setLeads((prev) =>
        prev.map((item) =>
          item._uniqueKey === editLeadForm._uniqueKey
            ? {
                ...item,
                Name: cleanName,
                Number: cleanNumber,
                "Contact Number": cleanNumber,
                City: cleanCity,
                "सर आपका बजट कितना है?": cleanBudget,
                "आपको कौन कौनसे chemical चाहिए?": cleanChemicals,
              }
            : item
        )
      );

      if (historyModalLead && historyModalLead._uniqueKey === editLeadForm._uniqueKey) {
        setHistoryModalLead((prev) => ({
          ...prev,
          Name: cleanName,
          Number: cleanNumber,
          "Contact Number": cleanNumber,
          City: cleanCity,
          "सर आपका बजट कितना है?": cleanBudget,
          "आपको कौन कौनसे chemical चाहिए?": cleanChemicals,
        }));
      }

      setEditCustomerModalOpen(false);
    } catch (err) {
      alert("Customer details update karne me error aaya: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCopyText = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const filteredLeads = useMemo(() => {
    return leads.filter((l) => {
      if (loggedInCaller?.role === "admin" && adminCallerFilter !== "all") {
        if (l._callerId !== adminCallerFilter) return false;
      }

      const status = l["Call_Status"] || "New";
      const isClosed = status === "Order Confirmed" || status === "Not Interested";
      const nextDate = l["Next_Call_Date"] ? String(l["Next_Call_Date"]).split("T")[0] : "";
      const lastCall = l["Last_Call_Date"] ? String(l["Last_Call_Date"]).split("T")[0] : "";

      let matchesTab = true;
      if (activeFilter === "today") {
        matchesTab = !isClosed && (!nextDate || nextDate === todayDate);
      } else if (activeFilter === "called_today") {
        matchesTab = lastCall === todayDate;
      } else if (activeFilter === "orders_today") {
        matchesTab = lastCall === todayDate && status === "Order Confirmed";
      } else if (activeFilter === "office_visit") {
        matchesTab = !isClosed && status === "Planning to Visit Office";
      } else if (activeFilter === "hot_leads") {
        matchesTab = !isClosed && getLeadPriority(l) === "HOT";
      } else if (activeFilter === "overdue") {
        matchesTab = !isClosed && nextDate && nextDate < todayDate;
      } else if (activeFilter === "upcoming") {
        matchesTab = !isClosed && nextDate && nextDate > todayDate;
      }

      if (!matchesTab) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const name = String(l["Name"] || "").toLowerCase();
        const num = String(l["Number"] || l["Contact Number"] || "").toLowerCase();
        const city = String(l["City"] || "").toLowerCase();
        const chem = String(l["आपको कौन कौनसे chemical चाहिए?"] || "").toLowerCase();
        return name.includes(q) || num.includes(q) || city.includes(q) || chem.includes(q);
      }

      return true;
    });
  }, [leads, activeFilter, todayDate, searchQuery, loggedInCaller, adminCallerFilter]);

  const startAutoDialerSession = () => {
    const firstDue = filteredLeads.find((l) => {
      const st = l["Call_Status"] || "New";
      return st !== "Order Confirmed" && st !== "Not Interested";
    });
    if (!firstDue) {
      alert("Is list me koi pending lead nahi hai!");
      return;
    }
    setAutoDialerActive(true);
    handleOpenUpdateModal(firstDue);
  };

  if (!loggedInCaller) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
        <div className="max-w-lg w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
          <div className="text-center mb-6">
            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              Khushali Chemicals • 10L Sales Engine
            </span>
            <h1 className="text-2xl font-extrabold text-white mt-3">CRM & Admin Login Portal</h1>
            <p className="text-xs text-slate-400 mt-1">Apna Calling Profile ya Admin Dashboard chunein</p>
          </div>

          <div className="grid grid-cols-3 gap-2.5 mb-6">
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
                  className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                    isSelected
                      ? prof.role === "admin"
                        ? "bg-amber-500/15 border-amber-500 shadow-lg shadow-amber-500/10"
                        : "bg-emerald-500/15 border-emerald-500 shadow-lg shadow-emerald-500/10"
                      : "bg-slate-950/60 border-slate-800 opacity-70"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                      isSelected 
                        ? prof.role === "admin" ? "bg-amber-500 text-slate-950" : "bg-emerald-500 text-slate-950" 
                        : "bg-slate-800 text-slate-300"
                    }`}>
                      {prof.name[0]}
                    </div>
                    {isSelected && <CheckCircle2 className={`w-4 h-4 ${prof.role === "admin" ? "text-amber-400" : "text-emerald-400"}`} />}
                  </div>
                  <div>
                    <div className="font-bold text-white text-sm leading-tight">{prof.name}</div>
                    <div className={`text-[10px] font-medium mt-0.5 ${prof.role === "admin" ? "text-amber-400" : "text-emerald-400"}`}>
                      {prof.whatsappLine}
                    </div>
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
              className={`w-full font-bold py-3.5 rounded-xl transition flex items-center justify-center gap-2 ${
                selectedProfile === "admin"
                  ? "bg-amber-500 hover:bg-amber-400 text-slate-950"
                  : "bg-emerald-500 hover:bg-emerald-400 text-slate-950"
              }`}
            >
              Login to {CALLER_PROFILES[selectedProfile].name} <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 space-y-6">
      
      {/* TOP HEADER */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
            <h1 className="text-xl md:text-2xl font-extrabold text-white">
              {loggedInCaller.name.toUpperCase()} {loggedInCaller.role === "admin" ? "MASTER REPORT & CRM" : "CRM PANEL"}
            </h1>
            <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs px-2.5 py-0.5 rounded-full font-semibold">
              {loggedInCaller.whatsappLine}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Khushali Chemicals (GST: 08PBDPS5444B1ZD) • Daily Target: 60 Calls | 4 Orders | ₹15,000/Caller
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* WhatsApp Quotation Maker Trigger (Moved from App.jsx to page.js) */}
          <button
            onClick={() => openQuotationForLead(null)}
            className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black px-3.5 py-2 rounded-xl text-xs transition shadow-md shadow-emerald-500/20"
          >
            <MessageSquare className="w-3.5 h-3.5" /> WhatsApp Quotation
          </button>

          <button
            onClick={() => {
              if (autoDialerActive) setAutoDialerActive(false);
              else startAutoDialerSession();
            }}
            className={`flex items-center gap-1.5 font-bold px-3.5 py-2 rounded-xl text-xs transition shadow-md ${
              autoDialerActive
                ? "bg-rose-500 text-white"
                : "bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20"
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            {autoDialerActive ? "Stop Auto-Dialer" : "Start Power Dialer"}
          </button>

          <button
            onClick={() => setKnowledgeModalTab("catalog")}
            className="flex items-center gap-1.5 bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/40 text-indigo-300 px-3 py-2 rounded-xl text-xs font-bold transition"
          >
            <BookOpen className="w-3.5 h-3.5" /> Price & Bottles
          </button>

          <button
            onClick={() => setKnowledgeModalTab("objections")}
            className="flex items-center gap-1.5 bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/40 text-purple-300 px-3 py-2 rounded-xl text-xs font-bold transition"
          >
            <ShieldAlert className="w-3.5 h-3.5" /> 12 Objection Scripts
          </button>

          <button
            onClick={() => setNewCustomerModalOpen(true)}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold px-3.5 py-2 rounded-xl text-xs transition"
          >
            <PlusCircle className="w-4 h-4 text-emerald-400" /> Naya Customer
          </button>

          <button
            disabled={merging}
            onClick={handleMergeDuplicatesNow}
            className="flex items-center gap-1.5 bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/40 text-cyan-300 px-3 py-2 rounded-xl text-xs font-bold transition"
          >
            <GitMerge className={`w-3.5 h-3.5 ${merging ? "animate-spin" : ""}`} />
            {merging ? "Merging..." : "Merge Duplicates"}
          </button>

          <button
            onClick={fetchCallerSheet}
            className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-3 py-2 rounded-xl text-xs text-slate-300 hover:bg-slate-800 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} /> Sync
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 px-3 py-2 rounded-xl text-xs font-semibold hover:bg-rose-500/20 transition"
          >
            <LogOut className="w-3.5 h-3.5" /> Logout
          </button>
        </div>
      </div>

      {/* ADMIN FULL PROGRESS REPORT */}
      {loggedInCaller.role === "admin" && (
        <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 border border-amber-500/30 rounded-3xl p-5 space-y-5 shadow-2xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-black text-white uppercase tracking-wider">
                  Complete Sales & Calling Progress Report
                </h2>
                <p className="text-[11px] text-slate-400">
                  Daily Quota (60 Calls / 4 Orders / ₹15k per caller) + Monthly Performance ({formatMonthLabel(selectedMonth)})
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-xl">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer"
                >
                  {availableMonths.map((m) => (
                    <option key={m} value={m} className="bg-slate-900 text-white">
                      {formatMonthLabel(m)} ({m})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 p-1 rounded-xl">
                {[
                  { id: "all", label: "Both" },
                  { id: "piyush", label: "Piyush" },
                  { id: "garv", label: "Garv" }
                ].map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setAdminCallerFilter(c.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                      adminCallerFilter === c.id
                        ? "bg-amber-500 text-slate-950"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-slate-950/90 border border-emerald-500/30 rounded-2xl p-4 space-y-3">
            <div className="flex flex-wrap justify-between items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4" /> Team Monthly Report — {formatMonthLabel(selectedMonth)}
              </span>
              <span className="text-xs font-bold text-amber-400">
                10L Mission: ₹{performanceStats.overall.monthlyRevenue.toLocaleString("en-IN")} / ₹10,00,000 ({performanceStats.monthlyMissionProgress}%)
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 text-center">
              <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
                <div className="text-[10px] text-slate-400 uppercase">Monthly Calls</div>
                <div className="text-xl font-black text-sky-400 mt-0.5">{performanceStats.overall.monthlyCalls}</div>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
                <div className="text-[10px] text-slate-400 uppercase">Monthly Orders</div>
                <div className="text-xl font-black text-emerald-400 mt-0.5">{performanceStats.overall.monthlyOrders}</div>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
                <div className="text-[10px] text-slate-400 uppercase">Monthly Sales</div>
                <div className="text-xl font-black text-amber-400 mt-0.5">₹{performanceStats.overall.monthlyRevenue.toLocaleString("en-IN")}</div>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
                <div className="text-[10px] text-slate-400 uppercase">New Leads</div>
                <div className="text-xl font-black text-white mt-0.5">{performanceStats.overall.monthlyNewLeads}</div>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
                <div className="text-[10px] text-slate-400 uppercase">Office Visits</div>
                <div className="text-xl font-black text-indigo-400 mt-0.5">{performanceStats.overall.monthlyOfficeVisits}</div>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
                <div className="text-[10px] text-slate-400 uppercase">Overdue</div>
                <div className="text-xl font-black text-rose-400 mt-0.5">{performanceStats.overall.overdueCount}</div>
              </div>
            </div>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl overflow-hidden">
            <button
              type="button"
              onClick={() => setShowDailyBreakdown(!showDailyBreakdown)}
              className="w-full px-4 py-3 flex justify-between items-center text-xs font-bold text-slate-300 hover:bg-slate-900/60"
            >
              <span className="flex items-center gap-2">
                <CalendarCheck className="w-4 h-4 text-emerald-400" />
                <span>Date-wise Breakdown ({formatMonthLabel(selectedMonth)})</span>
              </span>
              {showDailyBreakdown ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            {showDailyBreakdown && (
              <div className="overflow-x-auto border-t border-slate-800 max-h-60 overflow-y-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900 text-slate-400 uppercase text-[10px]">
                    <tr>
                      <th className="p-3">Date</th>
                      <th className="p-3 text-center">Piyush</th>
                      <th className="p-3 text-center">Garv</th>
                      <th className="p-3 text-center">Orders</th>
                      <th className="p-3 text-right">Sales (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {performanceStats.dailyBreakdownList.map((day) => (
                      <tr key={day.date}>
                        <td className="p-3 font-mono font-bold text-white">{day.date}</td>
                        <td className="p-3 text-center text-emerald-400 font-bold">{day.piyushCalls}</td>
                        <td className="p-3 text-center text-sky-400 font-bold">{day.garvCalls}</td>
                        <td className="p-3 text-center font-bold text-emerald-300">{day.orders}</td>
                        <td className="p-3 text-right font-black text-amber-400">₹{day.revenue.toLocaleString("en-IN")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* LIVE DAILY SCORECARD */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4">
          <div className="flex justify-between items-center text-xs text-slate-400 font-semibold">
            <span>Calls Made Today</span>
            <Phone className="w-4 h-4 text-sky-400" />
          </div>
          <div className="my-2">
            <span className="text-2xl font-black text-white">{performanceStats.overall.callsCount}</span>
            <span className="text-xs text-slate-500"> / {loggedInCaller.dailyTargetCalls}</span>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4">
          <div className="flex justify-between items-center text-xs text-slate-400 font-semibold">
            <span>Orders Won Today</span>
            <Award className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="my-2">
            <span className="text-2xl font-black text-emerald-400">{performanceStats.overall.ordersCount}</span>
            <span className="text-xs text-slate-500"> / {loggedInCaller.dailyTargetOrders}</span>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4">
          <div className="flex justify-between items-center text-xs text-slate-400 font-semibold">
            <span>Today's Sales Value</span>
            <IndianRupee className="w-4 h-4 text-amber-400" />
          </div>
          <div className="my-2">
            <span className="text-2xl font-black text-amber-400">₹{performanceStats.overall.revenue.toLocaleString('en-IN')}</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/30 rounded-2xl p-4">
          <div className="flex justify-between items-center text-xs text-emerald-400 font-bold">
            <span>Daily Goal Target</span>
            <TrendingUp className="w-4 h-4" />
          </div>
          <div className="my-1">
            <div className="text-lg font-black text-white">{performanceStats.overall.revProgress}% Achieved</div>
          </div>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Search karein: Customer Name, Mobile Number, City ya Chemicals..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-10 py-2.5 text-xs md:text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="absolute right-3 top-3 text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* FILTER TABS */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: "today", label: "Aaj Ki Calls", count: tabCounts.today, color: "text-emerald-400" },
          { id: "hot_leads", label: "🔥 Hot Leads", count: tabCounts.hotLeads, color: "text-rose-400" },
          { id: "office_visit", label: "Office Visits 🏢", count: tabCounts.officeVisit, color: "text-indigo-400" },
          { id: "called_today", label: "Aaj Hui Calls", count: tabCounts.calledToday, color: "text-sky-400" },
          { id: "orders_today", label: "Aaj Ke Orders 🏆", count: tabCounts.ordersToday, color: "text-amber-400" },
          { id: "overdue", label: "Overdue Calls", count: tabCounts.overdue, color: "text-rose-400" },
          { id: "upcoming", label: "Upcoming Calls", count: tabCounts.upcoming, color: "text-purple-400" },
          { id: "all", label: "All Leads", count: tabCounts.all, color: "text-slate-300" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeFilter === tab.id
                ? "bg-emerald-500 text-slate-950"
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
                <th className="p-3.5">Customer & Priority</th>
                <th className="p-3.5">City, Budget & Requirement</th>
                <th className="p-3.5">Status / Stage</th>
                <th className="p-3.5">Last Call</th>
                <th className="p-3.5">Next Call</th>
                <th className="p-3.5 text-right">Quick Actions</th>
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
                  const priority = getLeadPriority(lead);
                  const nextDate = lead["Next_Call_Date"] ? String(lead["Next_Call_Date"]).split("T")[0] : "Today";
                  const nextTime = lead["Next_Call_Time"] || "";
                  const lastDate = lead["Last_Call_Date"] ? String(lead["Last_Call_Date"]).split("T")[0] : "—";
                  const phoneNum = lead["Number"] || lead["Contact Number"];

                  return (
                    <tr key={lead._uniqueKey || index} className="hover:bg-slate-800/40 transition group">
                      <td className="p-3.5">
                        <div 
                          onClick={() => setHistoryModalLead(lead)} 
                          className="font-bold text-white group-hover:text-emerald-400 transition cursor-pointer flex items-center gap-1.5 flex-wrap"
                        >
                          <span className="underline decoration-dotted underline-offset-4">{lead["Name"] || "—"}</span>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded font-black uppercase ${
                            priority === "HOT" ? "bg-rose-500/20 text-rose-400" :
                            priority === "COLD" ? "bg-blue-500/20 text-blue-400" :
                            "bg-amber-500/20 text-amber-300"
                          }`}>
                            {priority === "HOT" ? "🔥 HOT" : priority}
                          </span>
                        </div>
                        <div className="text-xs text-emerald-400 font-mono mt-0.5">{phoneNum}</div>
                      </td>
                      <td className="p-3.5">
                        <div className="text-slate-200 text-xs font-semibold">{lead["City"] || "—"}</div>
                        <div className="text-[11px] text-slate-400 truncate max-w-xs mt-0.5">
                          {lead["आपको कौन कौनसे chemical चाहिए?"] || "—"}
                        </div>
                      </td>
                      <td className="p-3.5">
                        <span className="bg-blue-500/15 text-blue-400 text-xs px-2 py-0.5 rounded font-mono font-bold mr-1">
                          {stage}
                        </span>
                        <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-bold">
                          {status}
                        </span>
                      </td>
                      <td className="p-3.5 text-xs text-slate-400 font-mono">{lastDate}</td>
                      <td className="p-3.5">
                        <div className="text-xs font-mono font-semibold text-amber-300">{nextDate}</div>
                        {nextTime && <div className="text-[11px] font-mono text-emerald-400">{nextTime}</div>}
                      </td>
                      <td className="p-3.5 text-right whitespace-nowrap space-x-1.5">
                        <button
                          onClick={() => handleOpenEditCustomer(lead)}
                          className="inline-block p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
                          title="Edit Details"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <a
                          href={`tel:${phoneNum}`}
                          className="inline-block p-1.5 rounded-lg bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white border border-blue-500/30"
                          title="Call Now"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                        <button
                          onClick={() => openQuotationForLead(lead)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-teal-600/20 text-teal-300 hover:bg-teal-600 hover:text-white border border-teal-500/30 text-xs font-bold"
                          title="Create WhatsApp Quotation for this lead"
                        >
                          Quote
                        </button>
                        <button
                          onClick={() => setWaTemplateModalLead(lead)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white border border-emerald-500/30 text-xs font-bold"
                        >
                          <MessageSquare className="w-3.5 h-3.5" /> WA
                        </button>
                        <button
                          onClick={() => handleOpenUpdateModal(lead)}
                          className="bg-emerald-500/15 hover:bg-emerald-500 text-emerald-400 hover:text-slate-950 border border-emerald-500/30 px-3 py-1.5 rounded-xl text-xs font-bold"
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

      {/* 💬 WHATSAPP QUOTATION MAKER MODAL (MOVED FROM App.jsx + LIVE PRICE EDIT ON SELECTION) */}
      {quoteModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full p-6 relative shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
            <button onClick={() => setQuoteModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-slate-800 pb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                <MessageSquare className="w-3.5 h-3.5" /> WhatsApp Quotation Generator (Chemicals + Bottles)
              </span>
              <h3 className="text-xl font-black text-white mt-0.5">Create & Send Quotation</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Client Name</label>
                <input
                  type="text"
                  value={quoteCustomerName}
                  onChange={(e) => setQuoteCustomerName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">WhatsApp Number (10 digits)</label>
                <input
                  type="text"
                  value={quoteCustomerPhone}
                  onChange={(e) => setQuoteCustomerPhone(e.target.value.replace(/[^0-9]/g, ""))}
                  placeholder="9876543210"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-emerald-400 font-mono"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">City</label>
                <input
                  type="text"
                  value={quoteCustomerCity}
                  onChange={(e) => setQuoteCustomerCity(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => addQuoteRow("CHEMICAL")}
                className="px-3 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-blue-300 text-xs font-bold"
              >
                + Add Chemical (kg)
              </button>
              <button
                type="button"
                onClick={() => addQuoteRow("BOTTLE")}
                className="px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 text-xs font-bold"
              >
                + Add Bottle / Can / Cap (pcs)
              </button>
            </div>

            <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
              {quoteSummary.rows.map((row) => (
                <div key={row.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-3 grid grid-cols-1 sm:grid-cols-12 gap-2 items-center text-xs">
                  <div className="sm:col-span-5">
                    <select
                      value={row.productName}
                      onChange={(e) => updateQuoteRow(row.id, { productName: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-2 text-white text-xs"
                    >
                      {row.itemType === "BOTTLE"
                        ? BOTTLE_CATALOG.map(b => <option key={b.name} value={b.name}>{b.name} (₹{b.rate})</option>)
                        : PRODUCT_CATALOG.map(p => <option key={p.name} value={p.name}>{p.name}</option>)}
                    </select>
                  </div>

                  {row.itemType === "CHEMICAL" ? (
                    <div className="sm:col-span-2">
                      <select
                        value={row.tier}
                        onChange={(e) => updateQuoteRow(row.id, { tier: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-2 text-cyan-300 text-xs font-mono"
                      >
                        <option value="tier5">5kg Slab</option>
                        <option value="tier25">25kg Slab</option>
                        <option value="tier50">50kg Slab</option>
                      </select>
                    </div>
                  ) : (
                    <div className="sm:col-span-2 text-center text-[10px] text-indigo-300 font-mono">
                      Bottle / Cap
                    </div>
                  )}

                  <div className="sm:col-span-2">
                    <input
                      type="number"
                      min="1"
                      value={row.qty}
                      onChange={(e) => updateQuoteRow(row.id, { qty: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-2 text-white font-mono text-center"
                      title="Quantity"
                    />
                  </div>

                  {/* EDITABLE PRICE RIGHT WHILE SELECTING */}
                  <div className="sm:col-span-2">
                    <input
                      type="number"
                      step="any"
                      value={row.customPrice}
                      onChange={(e) => updateQuoteRow(row.id, { customPrice: e.target.value })}
                      className="w-full bg-slate-900 border border-emerald-600/70 rounded-lg px-2 py-2 text-emerald-400 font-mono font-bold text-right"
                      title="Change price directly while selecting"
                    />
                  </div>

                  <div className="sm:col-span-1 flex items-center justify-end gap-1">
                    <button
                      type="button"
                      onClick={() => removeQuoteRow(row.id)}
                      className="p-1.5 text-rose-400 hover:bg-rose-950/60 rounded-lg"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-wrap justify-between items-center gap-3">
              <div className="text-xs text-slate-400">
                Incl. 18% GST: <span className="font-mono text-slate-200">₹{quoteSummary.gstIncluded.toLocaleString("en-IN")}</span>
              </div>
              <div className="text-lg font-black text-emerald-400 font-mono">
                Total: ₹{quoteSummary.totalAmount.toLocaleString("en-IN")}
              </div>
            </div>

            <div className="flex flex-wrap justify-end gap-2">
              <button
                type="button"
                onClick={() => handleCopyText(buildQuotationWhatsAppText(), "quote_copy")}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-1.5"
              >
                {copiedId === "quote_copy" ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                {copiedId === "quote_copy" ? "Copied!" : "Copy Quote"}
              </button>
              <a
                href={`https://wa.me/${quoteCustomerPhone.length === 10 ? "91" + quoteCustomerPhone : quoteCustomerPhone}?text=${encodeURIComponent(buildQuotationWhatsAppText())}`}
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black flex items-center gap-1.5 shadow-lg shadow-emerald-500/20"
              >
                <Send className="w-4 h-4" /> Send on WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}

      {/* WHATSAPP TEMPLATES MODAL */}
      {waTemplateModalLead && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 relative shadow-2xl space-y-4">
            <button onClick={() => setWaTemplateModalLead(null)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> 1-Click WhatsApp Templates
              </span>
              <h3 className="text-xl font-black text-white mt-0.5">{waTemplateModalLead["Name"]}</h3>
            </div>
            <div className="space-y-2.5 max-h-[65vh] overflow-y-auto pr-1">
              {[
                { id: "sample_kit", title: "📦 Sample / Trial Kit Pitch", desc: "Ready-to-mix compound + dilution ratios" },
                { id: "price_list", title: "💰 Full Catalog Price List", desc: "All rates per kg incl. 18% GST" },
                { id: "office_visit", title: "🏢 Jaipur Office Visit Details", desc: "Scheduled visit & address" },
                { id: "trust_proof", title: "🛡️ Trust & Founder Proof", desc: "20+ states dispatch & GST details" },
                { id: "followup", title: "📞 Follow-up Reminder", desc: "Polite quotation follow-up" }
              ].map((tpl) => {
                const phone = String(waTemplateModalLead["Number"] || waTemplateModalLead["Contact Number"] || "").replace(/[^0-9]/g, "");
                const msg = buildWhatsAppTemplate(tpl.id, waTemplateModalLead, loggedInCaller.name);
                return (
                  <div key={tpl.id} className="p-3.5 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-between gap-2">
                    <div>
                      <div className="text-xs font-extrabold text-white">{tpl.title}</div>
                      <div className="text-[11px] text-slate-400">{tpl.desc}</div>
                    </div>
                    <a
                      href={`https://wa.me/91${phone}?text=${encodeURIComponent(msg)}`}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => setWaTemplateModalLead(null)}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-[11px] font-black"
                    >
                      Send
                    </a>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* KNOWLEDGE BASE MODAL (CHEMICALS + BOTTLES + 12 OBJECTIONS) */}
      {knowledgeModalTab && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-4xl w-full p-6 relative shadow-2xl space-y-4 max-h-[90vh] flex flex-col">
            <button onClick={() => setKnowledgeModalTab(null)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
            <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
              <button
                onClick={() => setKnowledgeModalTab("catalog")}
                className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 ${
                  knowledgeModalTab === "catalog" ? "bg-indigo-500 text-white" : "bg-slate-950 text-slate-400"
                }`}
              >
                <FlaskConical className="w-4 h-4" /> Chemicals & Bottles Catalog
              </button>
              <button
                onClick={() => setKnowledgeModalTab("objections")}
                className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 ${
                  knowledgeModalTab === "objections" ? "bg-purple-500 text-white" : "bg-slate-950 text-slate-400"
                }`}
              >
                <ShieldAlert className="w-4 h-4" /> 12 Objection Scripts
              </button>
            </div>
            <div className="overflow-y-auto flex-1 pr-1 space-y-4">
              {knowledgeModalTab === "catalog" ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {PRODUCT_CATALOG.map((prod, i) => (
                      <div key={i} className="bg-slate-950 border border-slate-800 p-3.5 rounded-2xl space-y-1">
                        <div className="font-extrabold text-white text-sm">{prod.name}</div>
                        <div className="text-xs font-mono text-amber-400">{prod.slabs}</div>
                        <div className="text-[11px] text-emerald-400 font-mono">{prod.ratio}</div>
                      </div>
                    ))}
                  </div>
                  <div className="pt-2">
                    <h4 className="text-xs font-black uppercase text-indigo-400 mb-2 flex items-center gap-1.5">
                      <Package className="w-4 h-4" /> Bottles, Cans, Pumps & Caps (18% GST Included)
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                      {BOTTLE_CATALOG.map((b, idx) => (
                        <div key={idx} className="bg-slate-950 border border-slate-800 p-3 rounded-xl">
                          <div className="text-xs font-bold text-white">{b.name}</div>
                          <div className="text-xs font-mono text-emerald-400 mt-1">₹{b.rate} / pc • MOQ {b.moq}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {OBJECTION_SCRIPTS.map((obj) => (
                    <div key={obj.id} className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-1.5">
                      <div className="text-xs font-black text-purple-400">{obj.title}</div>
                      <p className="text-xs text-emerald-300 leading-relaxed">"{obj.reply}"</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SMART POPUP */}
      {showSmartPopup && smartPopupLead && !activeLeadModal && !historyModalLead && !quoteModalOpen && (
        isPopupMinimized ? (
          <div
            onClick={() => setIsPopupMinimized(false)}
            className="fixed bottom-5 right-5 bg-slate-900 border-2 border-emerald-500/80 rounded-2xl px-4 py-3 shadow-2xl z-40 flex items-center gap-3 cursor-pointer"
          >
            <BellRing className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold text-white">{smartPopupLead["Name"] || "Next Lead"}</span>
            <Maximize2 className="w-3.5 h-3.5 text-emerald-400" />
          </div>
        ) : (
          <div className="fixed bottom-5 right-5 left-5 md:left-auto md:w-[420px] bg-slate-900 border-2 border-emerald-500 rounded-3xl p-5 shadow-2xl z-40">
            <div className="flex justify-between items-center mb-3">
              <span className="text-[10px] font-black px-2.5 py-1 rounded-full uppercase bg-emerald-500 text-slate-950 flex items-center gap-1">
                <BellRing className="w-3 h-3" /> Next Due Call
              </span>
              <div className="flex gap-1.5">
                <button onClick={() => setIsPopupMinimized(true)} className="text-xs bg-slate-800 px-2.5 py-1 rounded-lg">Minimize</button>
                <button onClick={handleSnooze} className="text-xs bg-amber-950 text-amber-400 px-2.5 py-1 rounded-lg font-bold">Snooze</button>
              </div>
            </div>
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3.5 mb-4">
              <h3 className="text-lg font-extrabold text-white">{smartPopupLead["Name"] || "Customer"}</h3>
              <p className="text-sm font-mono text-emerald-400">{smartPopupLead["Number"] || smartPopupLead["Contact Number"]}</p>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <a href={`tel:${smartPopupLead["Number"] || smartPopupLead["Contact Number"]}`} className="flex items-center justify-center gap-1 bg-emerald-500 text-slate-950 font-bold py-2.5 rounded-xl text-xs">
                <Phone className="w-3.5 h-3.5" /> Call
              </a>
              <button onClick={() => openQuotationForLead(smartPopupLead)} className="bg-teal-900/60 border border-teal-700 text-teal-200 font-bold py-2.5 rounded-xl text-xs">
                Quote
              </button>
              <button onClick={() => handleOpenUpdateModal(smartPopupLead)} className="bg-slate-800 text-white font-bold py-2.5 rounded-xl text-xs">
                Update
              </button>
            </div>
          </div>
        )
      )}

      {/* HISTORY MODAL */}
      {historyModalLead && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 relative shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <button onClick={() => setHistoryModalLead(null)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-black text-white">{historyModalLead["Name"]}</h3>
            <div className="space-y-2">
              {getLeadRemarksList(historyModalLead).map((r, i) => (
                <div key={i} className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs">
                  <span className="font-mono text-emerald-400 font-bold">{r.stage}: </span>
                  <span className="text-slate-200">{r.note}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* UPDATE CALL MODAL */}
      {activeLeadModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-4xl w-full p-6 relative shadow-2xl max-h-[92vh] overflow-y-auto">
            <button onClick={() => setActiveLeadModal(null)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-black text-white mb-4">{activeLeadModal["Name"]}</h3>
            <div className="space-y-3">
              <select
                value={callStatusInput}
                onChange={(e) => setCallStatusInput(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white"
              >
                <option value="Interested">Connected - Interested</option>
                <option value="Planning to Visit Office">🏢 Planning to Visit Office</option>
                <option value="Same Day Follow-up">Same Day Follow-up</option>
                <option value="Busy / Call Tomorrow">Busy / Call Tomorrow</option>
                <option value="Ringing / Not Picked">Ringing / Not Picked</option>
                <option value="Order Confirmed">🎉 Order Confirmed</option>
                <option value="Not Interested">Not Interested</option>
              </select>
              {callStatusInput === "Order Confirmed" && (
                <input
                  type="number"
                  placeholder="Order Amount (₹)"
                  value={orderAmountInput}
                  onChange={(e) => setOrderAmountInput(e.target.value)}
                  className="w-full bg-slate-950 border border-emerald-500 rounded-xl px-3 py-2 text-sm text-emerald-300 font-bold"
                />
              )}
              <textarea
                rows={3}
                value={callNoteInput}
                onChange={(e) => setCallNoteInput(e.target.value)}
                placeholder="Call notes..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white"
              />
              <button
                disabled={saving}
                onClick={handleSaveFollowUp}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-3 rounded-xl"
              >
                {saving ? "Saving..." : "Save Call & Schedule"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NEW CUSTOMER MODAL */}
      {newCustomerModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 relative shadow-2xl space-y-4">
            <button onClick={() => setNewCustomerModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-black text-white">Naya Customer Jodein</h3>
            <form onSubmit={handleAddNewCustomer} className="space-y-3">
              <input
                type="text"
                required
                placeholder="Customer Name *"
                value={newLeadForm.name}
                onChange={(e) => setNewLeadForm({ ...newLeadForm, name: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white"
              />
              <input
                type="text"
                required
                placeholder="Mobile Number *"
                value={newLeadForm.number}
                onChange={(e) => setNewLeadForm({ ...newLeadForm, number: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-emerald-400 font-mono"
              />
              {liveDuplicateLead && (
                <div className="p-2.5 bg-rose-950/60 border border-rose-500/50 rounded-xl text-xs text-rose-300 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>Already Exists: {liveDuplicateLead["Name"]}</span>
                </div>
              )}
              <input
                type="text"
                placeholder="City"
                value={newLeadForm.city}
                onChange={(e) => setNewLeadForm({ ...newLeadForm, city: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
              />
              <input
                type="text"
                placeholder="Required Chemicals"
                value={newLeadForm.chemicals}
                onChange={(e) => setNewLeadForm({ ...newLeadForm, chemicals: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
              />
              <button
                type="submit"
                disabled={saving || Boolean(liveDuplicateLead)}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3 rounded-xl"
              >
                {liveDuplicateLead ? "Duplicate Blocked" : saving ? "Saving..." : "Customer Add Karein"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* EDIT CUSTOMER MODAL */}
      {editCustomerModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 relative shadow-2xl space-y-4">
            <button onClick={() => setEditCustomerModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-black text-white">Customer Details Edit Karein</h3>
            <form onSubmit={handleSaveCustomerEdit} className="space-y-3">
              <input
                type="text"
                required
                value={editLeadForm.name}
                onChange={(e) => setEditLeadForm({ ...editLeadForm, name: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white"
              />
              <input
                type="text"
                required
                value={editLeadForm.number}
                onChange={(e) => setEditLeadForm({ ...editLeadForm, number: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-emerald-400 font-mono"
              />
              <input
                type="text"
                value={editLeadForm.city}
                onChange={(e) => setEditLeadForm({ ...editLeadForm, city: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
              />
              <input
                type="text"
                value={editLeadForm.chemicals}
                onChange={(e) => setEditLeadForm({ ...editLeadForm, chemicals: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
              />
              <button
                type="submit"
                disabled={saving}
                className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3 rounded-xl"
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

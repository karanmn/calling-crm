"use client";
import React, { useState, useEffect, useMemo } from "react";
import { 
  Phone, MessageSquare, Lock, LogOut, RefreshCw, 
  X, BellRing, PlusCircle, CheckCircle2, ArrowRight,
  TrendingUp, Award, IndianRupee, CalendarCheck, Clock,
  Calendar, Edit3, History, Maximize2, Minimize2, Search, 
  Contact, Building2, Zap, BookOpen, ShieldAlert, 
  Users, Copy, Check, Sparkles, FlaskConical, BarChart3, 
  ChevronDown, ChevronUp, GitMerge, AlertTriangle,
  Package, Trash2, Send, Download
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

// 📚 OFFICIAL KHUSHALI CHEMICALS CATALOG & FORMULATION DATA (12 Unified SKUs + Flavours)
const PRODUCT_CATALOG = [
  {
    name: "White Phenyl Raw Material",
    flavours: ["Standard"],
    rates: { tier5: 255, tier25: 250, tier50: 245 },
    slabs: "5Kg: ₹255/kg | 25Kg: ₹250/kg | 50Kg: ₹245/kg",
    ratio: "1:30 (1 Kg Concentrate + 30 Kg Water)",
    instructions: "TDS 150-250 वाला पानी धीरे-धीरे डालें और अच्छी तरह मिलाएँ।"
  },
  {
    name: "Colour Phenyl Raw Material",
    flavours: ["Rose", "Lemon", "Mogra", "Lavender", "Citronella", "Lemongrass", "Sandal", "Neem"],
    rates: { tier5: 265, tier25: 260, tier50: 255 },
    slabs: "5Kg: ₹265/kg | 25Kg: ₹260/kg | 50Kg: ₹255/kg",
    ratio: "1:30 (1 Kg Concentrate + 30 Kg Water)",
    instructions: "TDS 150-250 वाला पानी धीरे-धीरे डालें और अच्छी तरह मिलाएँ।"
  },
  {
    name: "Black Phenyl Raw Material",
    flavours: ["Standard"],
    rates: { tier5: 175, tier25: 170, tier50: 165 },
    slabs: "5Kg: ₹175/kg | 25Kg: ₹170/kg | 50Kg: ₹165/kg",
    ratio: "1:6 से 1:9 (1 Kg Concentrate + 6-9 Kg Water)",
    instructions: "RO पानी (< 70 TDS) का उपयोग करें और अच्छी तरह मिक्स करें।"
  },
  {
    name: "Toilet Cleaner Raw Material",
    flavours: ["Standard Blue"],
    rates: { tier5: 125, tier25: 120, tier50: 115 },
    slabs: "5Kg: ₹125/kg | 25Kg: ₹120/kg | 50Kg: ₹115/kg",
    ratio: "1:7 (1 Kg Concentrate + 7 Kg Water)",
    instructions: "RO पानी (< 70 TDS) का उपयोग करें और अच्छी तरह मिक्स करें।"
  },
  {
    name: "Bathroom Cleaner Raw Material (R1)",
    flavours: ["Standard Red"],
    rates: { tier5: 145, tier25: 140, tier50: 135 },
    slabs: "5Kg: ₹145/kg | 25Kg: ₹140/kg | 50Kg: ₹135/kg",
    ratio: "1:4 से 1:8 (1 Kg Concentrate + 4-8 Kg Water)",
    instructions: "RO पानी (< 70 TDS) मिलाकर 2-3 घंटे छोड़ दें।"
  },
  {
    name: "Floor Cleaner Raw Material",
    flavours: ["Lemon", "Rose", "Lavender", "Jasmine", "Mogra", "Orange", "Green Apple", "Rajnigandha", "Bela"],
    rates: { tier5: 820, tier25: 810, tier50: 800 },
    slabs: "5Kg: ₹820/kg | 25Kg: ₹810/kg | 50Kg: ₹800/kg",
    ratio: "1:40 से 1:60 (1 Kg Concentrate + 40-60 Kg Water)",
    instructions: "कम लागत में हाई-क्वालिटी फ्लोर क्लीनर।"
  },
  {
    name: "Hand Wash Raw Material",
    flavours: ["Rose", "Lavender", "Dettol", "Lemon", "Green Apple", "Lifebuoy", "Tulsi", "Neem", "Jasmine", "Strawberry", "Sandal"],
    rates: { tier5: 350, tier25: 345, tier50: 340 },
    slabs: "5Kg: ₹350/kg | 25Kg: ₹345/kg | 50Kg: ₹340/kg",
    ratio: "1:9 (1 Kg Concentrate + 8.5 Kg Water + 500g Salt)",
    instructions: "पहले पानी में 500g नमक घोलें, फिर कंसन्ट्रेट डालें। 24 घंटे (1 दिन) स्थिर छोड़ दें ताकि झाग खत्म हो और पारदर्शी दिखे।"
  },
  {
    name: "Dishwash Raw Material",
    flavours: ["Lemon"],
    rates: { tier5: 350, tier25: 345, tier50: 340 },
    slabs: "5Kg: ₹350/kg | 25Kg: ₹345/kg | 50Kg: ₹340/kg",
    ratio: "1:9 (1 Kg Concentrate + 8.5 Kg Water + 500g Salt)",
    instructions: "पानी में 500g नमक और 500-1000g पॉवर बूस्टर मिलाएँ। 1 दिन (24 घंटे) रखें।"
  },
  {
    name: "Fabric Wash Raw Material",
    flavours: ["Standard"],
    rates: { tier5: 350, tier25: 345, tier50: 340 },
    slabs: "5Kg: ₹350/kg | 25Kg: ₹345/kg | 50Kg: ₹340/kg",
    ratio: "1:9 (1 Kg Concentrate + 8.5 Kg Water + 500g Salt)",
    instructions: "पहले पानी में 500g नमक घोलें। मिक्स करके 1 दिन के लिए रख दें।"
  },
  {
    name: "Glass Cleaner Raw Material",
    flavours: ["Standard Blue"],
    rates: { tier5: 160, tier25: 155, tier50: 150 },
    slabs: "5Kg: ₹160/kg | 25Kg: ₹155/kg | 50Kg: ₹150/kg",
    ratio: "1:80 से 1:100 (1 Kg Concentrate + 80-100 Kg Water)",
    instructions: "सादा RO पानी न लें। हमेशा 0 TDS (Battery/DM Water) ही उपयोग करें ताकि कांच पर निशान न पड़ें।"
  },
  {
    name: "Car Wash Raw Material",
    flavours: ["Standard"],
    rates: { tier5: 350, tier25: 345, tier50: 340 },
    slabs: "5Kg: ₹350/kg | 25Kg: ₹345/kg | 50Kg: ₹340/kg",
    ratio: "1:9 (1 Kg Concentrate + 8.5 Kg Water + 500g Salt)",
    instructions: "पहले पानी में 500g नमक मिलाएँ, फिर कंसन्ट्रेट मिक्स करें।"
  },
  {
    name: "Room Freshener Raw Material",
    flavours: ["Lavender", "Seven Wonder", "London Love", "Rose", "Mogra", "Chandan", "Jasmine", "Aroglobal", "Punch"],
    rates: { tier5: 1220, tier25: 1210, tier50: 1210 },
    slabs: "5Kg: ₹1220/kg | 10Kg: ₹1210/kg",
    ratio: "1:20 (1 Kg Concentrate + 15 Kg Water)",
    instructions: "RO पानी (< 70 TDS) में मिलाएं और बोतल में चेक करें।"
  }
];

// 🧴 BOTTLES, CANS, PUMPS & CAPS CATALOG (18% GST INCLUDED)
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

// Gentle Audio Chime for Scheduled Call Alarms
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

// IST Safe Date Helper (YYYY-MM-DD)
const getISTTodayDate = () => {
  try {
    return new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
  } catch (e) {
    return new Date().toISOString().split("T")[0];
  }
};

// Normalize Indian phone numbers to last 10 digits
const normalizePhone10 = (raw) => {
  const digits = String(raw || "").replace(/[^0-9]/g, "");
  return digits.length >= 10 ? digits.slice(-10) : digits;
};

// Normalize Google Sheet dates (ISO, YYYY-MM-DD, DD/MM/YYYY, DD-MM-YYYY) to YYYY-MM-DD
const normalizeSheetDate = (raw) => {
  if (!raw) return "";
  const s = String(raw).trim();
  if (!s || s === "CLOSED") return s;
  const isoPart = s.split("T")[0];
  if (/^\d{4}-\d{2}-\d{2}$/.test(isoPart)) return isoPart;
  const dmy = s.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/);
  if (dmy) {
    const [, dd, mm, yyyy] = dmy;
    return `${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`;
  }
  return isoPart;
};

// Safe WhatsApp URL Builder (Prevents 9191 double country code)
const buildWhatsAppUrl = (rawPhone, text = "") => {
  const digits = String(rawPhone || "").replace(/[^0-9]/g, "");
  if (!digits) return `https://wa.me/?text=${encodeURIComponent(text)}`;
  const formatted = digits.length === 10 ? `91${digits}` : digits;
  return `https://wa.me/${formatted}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
};

// Format YYYY-MM to readable Month Year
const formatMonthLabel = (ym) => {
  if (!ym || ym.length < 7) return ym;
  const [y, m] = ym.split("-");
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const mIdx = parseInt(m, 10) - 1;
  return `${months[mIdx] || m} ${y}`;
};

// 📲 WHATSAPP TEMPLATE GENERATOR (5 HIGH-CONVERTING TEMPLATES)
const buildWhatsAppTemplate = (type, lead, callerName) => {
  const name = lead?.["Name"] || "Sir";
  const reqChem = lead?.["आपको कौन कौनसे chemical चाहिए?"] || "Cleaning Raw Materials";
  const nextDate = lead?.["Next_Call_Date"] ? String(lead["Next_Call_Date"]).split("T")[0] : "जल्द";
  const nextTime = lead?.["Next_Call_Time"] || "";

  if (type === "sample_kit") {
    return `नमस्ते ${name} जी! 🙏\n*Khushali Chemicals (Jaipur)* से ${callerName} बात कर रहा हूँ।\n\nअगर आप बड़ा ऑर्डर करने से पहले हमारी *Quality, Thickness और Fragrance* खुद टेस्ट करना चाहते हैं, तो आप हमारा *Business Starter Sample / Trial Kit* मंगवा सकते हैं:\n\n🧪 *Trial Kit के फायदे:*\n✅ *Ready-to-Mix Formula:* 4-5 अलग केमिकल्स मिलाने की झंझट खत्म, सिर्फ पानी मिलाएं और प्रोडक्ट तैयार!\n✅ *High Dilution Ratio:*\n• White/Rose Phenyl (1:30)\n• Handwash / Dishwash / Car Wash (1:9)\n• Toilet Cleaner (1:7)\n• Glass Cleaner (1:100)\n✅ *Complete Mixing Guide:* हर प्रोडक्ट की सटीक रेसिपी और वीडियो सपोर्ट साथ मिलेगा।\n\n📦 आज शाम की गाड़ी में आपका ट्रायल पैक या 5Kg कैन डिस्पैच करवा दें? कृपया अपना Pincode भेजें! 🚚`;
  }

  if (type === "price_list") {
    const catalogLines = PRODUCT_CATALOG.map(p => {
      const ratioShort = (p.ratio || "").split(" ")[0];
      return `🔹 *${p.name} (${ratioShort}):* ${p.slabs}`;
    }).join("\n");
    return `नमस्ते ${name} जी! 🙏\n*KHUSHALI CHEMICALS (Jaipur)*\n*(All Rates Per Kg - Including 18% GST)*\n\n${catalogLines}\n\n📋 *GST:* 08PBDPS5444B1ZD\n🌐 *Web:* khushalichemical.com\n\nबताइए सर, इसमें से कौन-कौन से आइटम का कोटेशन या सैंपल पैक फाइनल करें?`;
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
  const [allTeamLeads, setAllTeamLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [merging, setMerging] = useState(false);
  const [activeFilter, setActiveFilter] = useState("today");
  const [adminCallerFilter, setAdminCallerFilter] = useState("all");
  const [selectedMonth, setSelectedMonth] = useState(todayDate.slice(0, 7));
  const [showDailyBreakdown, setShowDailyBreakdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Power Auto-Dialer State
  const [autoDialerActive, setAutoDialerActive] = useState(false);

  // Popups & Modals State
  const [smartPopupLead, setSmartPopupLead] = useState(null);
  const [showSmartPopup, setShowSmartPopup] = useState(false);
  const [isPopupMinimized, setIsPopupMinimized] = useState(false);
  const [popupDismissed, setPopupDismissed] = useState(false);
  const [snoozedKeys, setSnoozedKeys] = useState([]);
  const [activeLeadModal, setActiveLeadModal] = useState(null);
  const [historyModalLead, setHistoryModalLead] = useState(null);
  const [newCustomerModalOpen, setNewCustomerModalOpen] = useState(false);
  const [editCustomerModalOpen, setEditCustomerModalOpen] = useState(false);
  const [knowledgeModalTab, setKnowledgeModalTab] = useState(null);
  const [waTemplateModalLead, setWaTemplateModalLead] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  // 💬 WHATSAPP QUOTATION MAKER MODAL STATE (Chemicals + Bottles + Editable Rate)
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [quoteCustomerName, setQuoteCustomerName] = useState("Wholesale Buyer");
  const [quoteCustomerPhone, setQuoteCustomerPhone] = useState("");
  const [quoteCustomerCity, setQuoteCustomerCity] = useState("Jaipur, Rajasthan");
  const [quoteTaxMode, setQuoteTaxMode] = useState("AUTO");
  const [quoteItems, setQuoteItems] = useState([
    { id: 1, itemType: "CHEMICAL", productName: PRODUCT_CATALOG[3].name, flavour: PRODUCT_CATALOG[3].flavours[0], tier: "tier25", qty: 25, unit: "kg", customPrice: 120 },
    { id: 2, itemType: "CHEMICAL", productName: PRODUCT_CATALOG[0].name, flavour: PRODUCT_CATALOG[0].flavours[0], tier: "tier25", qty: 25, unit: "kg", customPrice: 250 }
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
    _uniqueKey: "",
    _sheetUrl: "",
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
      setPopupDismissed(false);
      setSnoozedKeys([]);
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
    setPopupDismissed(false);
    setSnoozedKeys([]);
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
    const uniqueDates = new Set();
    const allNotes = FOLLOWUP_FLOW.map(f => String(lead[f.noteCol] || "")).join(" ");
    const matches = allNotes.match(/\[(\d{4}-\d{2}-\d{2})/g);
    if (matches && matches.length > 0) {
      matches.forEach((m) => uniqueDates.add(m.replace("[", "")));
    }
    const lastCall = lead["Last_Call_Date"] ? String(lead["Last_Call_Date"]).split("T")[0] : "";
    if (lastCall && /^\d{4}-\d{2}-\d{2}$/.test(lastCall)) {
      uniqueDates.add(lastCall);
    }
    return Array.from(uniqueDates);
  };

  // Extract locked Order Date from [ORDER: ₹...] note so later follow-ups don't shift revenue date
  const getLeadOrderDate = (lead) => {
    const allNotes = FOLLOWUP_FLOW.map((f) => String(lead[f.noteCol] || "")).join(" | ");
    const m = allNotes.match(/\[(\d{4}-\d{2}-\d{2})[^\]]*\]\s*(?:\[[^\]]+\]\s*)?\[ORDER:/);
    if (m && m[1]) return m[1];
    return normalizeSheetDate(lead["Last_Call_Date"]) || normalizeSheetDate(lead["Day_1_Date"]) || normalizeSheetDate(lead["Timestamp"]);
  };

  // Helper to select the next actionable due lead (respects scheduled times & snoozed queue)
  const findNextActionableLead = (leadList, currentSnoozed = [], excludeKey = null) => {
    const now = new Date();
    const currentTimeStr = now.toTimeString().slice(0, 5); // HH:MM

    const openLeads = leadList.filter((l) => {
      if (excludeKey && l._uniqueKey === excludeKey) return false;
      const status = l["Call_Status"] || "New";
      return status !== "Order Confirmed" && status !== "Not Interested";
    });

    // 1. Exact scheduled alarm due now (respects snoozedKeys so Snooze actually works)
    const exactAlarm = openLeads.find((l) => {
      if (currentSnoozed.includes(l._uniqueKey)) return false;
      const nextDate = normalizeSheetDate(l["Next_Call_Date"]);
      const nextTime = l["Next_Call_Time"] ? String(l["Next_Call_Time"]).trim() : "";
      return nextDate === todayDate && nextTime && nextTime <= currentTimeStr;
    });
    if (exactAlarm) return { lead: exactAlarm, isAlarm: true };

    // 2. Due leads (not scheduled for a future time later today)
    const dueLeads = openLeads.filter((l) => {
      const nextDate = normalizeSheetDate(l["Next_Call_Date"]);
      const nextTime = l["Next_Call_Time"] ? String(l["Next_Call_Time"]).trim() : "";
      if (!nextDate) return true;
      if (nextDate < todayDate) return true;
      if (nextDate === todayDate) {
        return !nextTime || nextTime <= currentTimeStr;
      }
      return false;
    });

    if (dueLeads.length === 0) return { lead: null, isAlarm: false };

    // Prefer leads NOT called today & NOT snoozed first
    const freshDue = dueLeads.filter((l) => {
      const lc = l["Last_Call_Date"] ? String(l["Last_Call_Date"]).split("T")[0] : "";
      return lc !== todayDate && !currentSnoozed.includes(l._uniqueKey);
    });
    if (freshDue.length > 0) return { lead: freshDue[0], isAlarm: false };

    // Next: not snoozed (even if called earlier today)
    const nonSnoozed = dueLeads.filter((l) => !currentSnoozed.includes(l._uniqueKey));
    if (nonSnoozed.length > 0) return { lead: nonSnoozed[0], isAlarm: false };

    // Fallback: snoozed leads in snoozed order
    const sortedSnoozed = [...dueLeads].sort(
      (a, b) => currentSnoozed.indexOf(a._uniqueKey) - currentSnoozed.indexOf(b._uniqueKey)
    );
    return { lead: sortedSnoozed[0], isAlarm: false };
  };

  // Live cross-caller duplicate detector (checks BOTH Piyush & Garv lists)
  const liveDuplicateLead = useMemo(() => {
    const typedNorm = normalizePhone10(newLeadForm.number);
    if (typedNorm.length < 8) return null;
    const pool = allTeamLeads.length > 0 ? allTeamLeads : leads;
    return pool.find((l) => {
      const existingNorm = normalizePhone10(l["Number"] || l["Contact Number"]);
      return existingNorm === typedNorm;
    }) || null;
  }, [newLeadForm.number, allTeamLeads, leads]);

  // FETCH BOTH CALLERS FOR CROSS-CALLER DUPLICATE CHECK + SCOPE VIEW BY ROLE
  const fetchCallerSheet = async () => {
    if (!loggedInCaller) return;
    setLoading(true);
    try {
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
      setAllTeamLeads(combined);
      if (loggedInCaller.role === "admin") {
        setLeads(combined);
      } else {
        setLeads(combined.filter((l) => l._callerId === loggedInCaller.id));
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

  // 🔄 TRIGGER MERGE DUPLICATES IN BOTH GOOGLE SHEETS & SYNC BOTH LISTS
  const handleMergeDuplicatesNow = async () => {
    if (!loggedInCaller) return;
    if (typeof navigator !== "undefined" && !navigator.onLine) {
      alert("⚠️ Internet disconnected hai. Kripya connection check karke dobara try karein.");
      return;
    }
    setMerging(true);
    try {
      const urlsToMerge = [
        CALLER_PROFILES.piyush.sheetApiUrl,
        CALLER_PROFILES.garv.sheetApiUrl
      ].filter(Boolean);

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
        alert("✅ Piyush aur Garv dono ki sheets me duplicate numbers merge ho gaye hain aur dono lists sync ho gayi hain!");
      }, 1500);
    } catch (err) {
      setMerging(false);
      alert("Merge karne me error aaya: " + err.message);
    }
  };

  // 💬 WHATSAPP QUOTATION HELPERS
  const openQuotationModal = (lead = null) => {
    if (lead) {
      setQuoteCustomerName(lead["Name"] || "Valued Buyer");
      setQuoteCustomerPhone(String(lead["Number"] || lead["Contact Number"] || "").replace(/[^0-9]/g, ""));
      setQuoteCustomerCity(lead["City"] || "India");
    } else {
      setQuoteCustomerName("Wholesale Buyer");
      setQuoteCustomerPhone("");
      setQuoteCustomerCity("Jaipur, Rajasthan");
    }
    setQuoteTaxMode("AUTO");
    setQuoteModalOpen(true);
  };

  const addQuoteRow = (type = "CHEMICAL") => {
    if (type === "BOTTLE") {
      const b = BOTTLE_CATALOG[0];
      setQuoteItems(prev => [
        ...prev,
        { id: Date.now() + Math.random(), itemType: "BOTTLE", productName: b.name, flavour: "", tier: "pcs", qty: b.moq, unit: "pcs", customPrice: b.rate }
      ]);
    } else {
      const p = PRODUCT_CATALOG[0];
      setQuoteItems(prev => [
        ...prev,
        { id: Date.now() + Math.random(), itemType: "CHEMICAL", productName: p.name, flavour: p.flavours[0] || "Standard", tier: "tier25", qty: 25, unit: "kg", customPrice: p.rates.tier25 }
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
          updated.flavour = "";
        } else {
          const foundP = PRODUCT_CATALOG.find(p => p.name === patch.productName) || PRODUCT_CATALOG[0];
          updated.customPrice = foundP.rates[updated.tier] || foundP.rates.tier25;
          updated.unit = "kg";
          updated.flavour = (foundP.flavours && foundP.flavours[0]) || "Standard";
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

  const generateQuotationWhatsAppMessage = () => {
    const lines = [
      "*KHUSHALI CHEMICALS - QUOTATION*",
      "📍 Jaipur, Rajasthan | 📞 +91 8905878950",
      "GST: 08PBDPS5444B1ZD | Web: khushalichemical.com",
      "------------------------------------------",
      `*Client:* ${quoteCustomerName || "Valued Buyer"} (${quoteCustomerCity || "India"})`,
      `*Date:* ${new Date().toLocaleDateString("en-IN")}`,
      "------------------------------------------",
      "*ORDER SUMMARY (18% GST Included):*"
    ];

    quoteSummary.rows.forEach((r, idx) => {
      const flavLabel = r.flavour && !r.flavour.startsWith("Standard") ? ` (${r.flavour})` : "";
      lines.push(`${idx + 1}. *${r.productName}${flavLabel}*`);
      lines.push(`   📦 Qty: ${r.qty} ${r.unit} @ Rs.${r.price}/${r.unit}`);
      lines.push(`   👉 *Total: Rs.${r.lineTotal.toLocaleString("en-IN")}*`);
    });

    lines.push("------------------------------------------");
    lines.push(`💰 *TOTAL INVOICE VALUE: Rs.${quoteSummary.totalAmount.toLocaleString("en-IN")}*`);
    lines.push(`(18% GST included: Rs.${quoteSummary.gstIncluded.toLocaleString("en-IN")})`);
    lines.push("\nTo confirm this order, kindly reply to this message or call 8905878950.");

    return lines.join("\n");
  };

  // Convert number to Indian Rupees words (for Quotation PDF)
  const numberToIndianWords = (num) => {
    const n = Math.round(Number(num) || 0);
    if (n === 0) return "Zero Rupees only";
    const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
      "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
    const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seven" + "ty", "Eighty", "Ninety"];
    const twoDigits = (x) => (x < 20 ? ones[x] : tens[Math.floor(x / 10)] + (x % 10 ? " " + ones[x % 10] : ""));
    const threeDigits = (x) => {
      if (x === 0) return "";
      const h = Math.floor(x / 100);
      const r = x % 100;
      return (h ? ones[h] + " Hundred" + (r ? " " : "") : "") + (r ? twoDigits(r) : "");
    };
    let res = "";
    const crore = Math.floor(n / 10000000);
    const lakh = Math.floor((n % 10000000) / 100000);
    const thousand = Math.floor((n % 100000) / 1000);
    const rest = n % 1000;
    if (crore) res += twoDigits(crore) + " Crore ";
    if (lakh) res += twoDigits(lakh) + " Lakh ";
    if (thousand) res += twoDigits(thousand) + " Thousand ";
    if (rest) res += threeDigits(rest);
    return res.trim() + " Rupees only";
  };

  const [downloadingPdf, setDownloadingPdf] = useState(false);

  const handleDownloadQuotationPDF = async () => {
    setDownloadingPdf(true);
    const quoteNo = "QT-" + Date.now().toString().slice(-4);
    const nowObj = new Date();
    const dateStr = `${String(nowObj.getDate()).padStart(2, "0")}-${String(nowObj.getMonth() + 1).padStart(2, "0")}-${nowObj.getFullYear()}`;
    const totalQty = quoteSummary.rows.reduce((s, r) => s + (Number(r.qty) || 0), 0);
    const autoIsRajasthan = /rajasthan|jaipur|chaksu|sikar|kota|jodhpur|udaipur|ajmer|alwar|bikaner|bhilwara|bharatpur|nagaur|jhunjhunu|tonk|pali|churu|barmer|jaisalmer|hanumangarh|ganganagar|bundi|baran|jhalawar|dausa|karauli|sawai|dholpur|chittorgarh|banswara|dungarpur|pratapgarh|sirohi|jalore|rajsamand|beawar|kishangarh|bhiwadi|neem ka thana|didwana|ratangarh|niwai|rj|08/i.test(quoteCustomerCity || "");
    const isRajasthan = quoteTaxMode === "AUTO" ? autoIsRajasthan : quoteTaxMode === "INTRA_RJ";
    const fmt = (n) => Number(n || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const halfGst = quoteSummary.gstIncluded / 2;
    const safeName = (quoteCustomerName || "Buyer").replace(/[^a-zA-Z0-9_-]/g, "_");
    const upiId = "khushalichemical@idfcbank";
    const upiAmount = Number(quoteSummary.totalAmount || 0).toFixed(2);
    const upiUrl = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent("M/S KHUSHALI CHEMICAL")}&am=${upiAmount}&cu=INR&tn=${encodeURIComponent("Quotation" + quoteNo)}`;

    const loadScript = (src) =>
      new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) return resolve();
        const s = document.createElement("script");
        s.src = src;
        s.onload = resolve;
        s.onerror = reject;
        document.head.appendChild(s);
      });

    try {
      await loadScript("https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js");
      await loadScript("https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.2/jspdf.plugin.autotable.min.js");

      const { jsPDF } = window.jspdf;
      const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pageW = doc.internal.pageSize.getWidth();
      const margin = 10;
      const contentW = pageW - margin * 2;
      let y = 12;

      // Title
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.setTextColor(15, 23, 42);
      doc.text("Quotation / Estimate", pageW / 2, y, { align: "center" });
      y += 4;

      // Header & Quote To Box
      doc.autoTable({
        startY: y,
        margin: { left: margin, right: margin },
        theme: "grid",
        styles: { font: "helvetica", fontSize: 8.5, textColor: [15, 23, 42], lineColor: [51, 65, 85], lineWidth: 0.25, cellPadding: 2.5 },
        body: [
          [
            {
              content: "KHUSHALI CHEMICAL\nPhone no.: 9216273399 / 8905878950\nEmail: Rohitsambhawani@gmail.com\nGSTIN: 08PBDPS5444B1ZD\nState: 08-Rajasthan",
              rowSpan: 2,
              styles: { fontStyle: "bold", valign: "top", cellWidth: contentW * 0.58 }
            },
            {
              content: `Quotation No.
${quoteNo}`,
              styles: { valign: "top", cellWidth: contentW * 0.21 }
            },
            {
              content: `Date
${dateStr}`,
              styles: { valign: "top", cellWidth: contentW * 0.21 }
            }
          ],
          [
            {
              content: `GST Mode
${isRajasthan ? "Rajasthan (CGST+SGST)" : "Out of RJ (IGST 18%)"}`,
              colSpan: 2,
              styles: { valign: "top" }
            }
          ],
          [
            {
              content: `Quote To:
${quoteCustomerName || "Valued Buyer"}
City / State: ${quoteCustomerCity || "India"}${quoteCustomerPhone ? `
Contact No.: ${quoteCustomerPhone}` : ""}`,
              colSpan: 3,
              styles: { fontStyle: "bold" }
            }
          ]
        ]
      });

      y = doc.lastAutoTable.finalY;

      // Items Table
      const itemBody = quoteSummary.rows.map((r, idx) => {
        const flavLabel = r.flavour && !r.flavour.startsWith("Standard") ? ` (${r.flavour})` : "";
        const baseUnitPrice = r.price / 1.18;
        const rowTaxable = r.lineTotal / 1.18;
        const rowGst = r.lineTotal - rowTaxable;
        return [
          String(idx + 1),
          `${r.productName}${flavLabel}`,
          String(r.qty),
          r.unit === "kg" ? "Kg" : "Pcs",
          `Rs. ${fmt(baseUnitPrice)}`,
          `Rs. ${fmt(rowGst)} (18%)`,
          `Rs. ${fmt(r.lineTotal)}`
        ];
      });

      itemBody.push([
        { content: "Total", colSpan: 2, styles: { fontStyle: "bold" } },
        { content: String(totalQty), styles: { fontStyle: "bold", halign: "right" } },
        "",
        "",
        { content: `Rs. ${fmt(quoteSummary.gstIncluded)}`, styles: { fontStyle: "bold", halign: "right" } },
        { content: `Rs. ${fmt(quoteSummary.totalAmount)}`, styles: { fontStyle: "bold", halign: "right" } }
      ]);

      doc.autoTable({
        startY: y,
        margin: { left: margin, right: margin },
        theme: "grid",
        headStyles: { fillColor: [241, 245, 249], textColor: [15, 23, 42], fontStyle: "bold", fontSize: 8, lineColor: [51, 65, 85], lineWidth: 0.25 },
        styles: { font: "helvetica", fontSize: 8, textColor: [15, 23, 42], lineColor: [51, 65, 85], lineWidth: 0.25, cellPadding: 2 },
        columnStyles: {
          0: { halign: "center", cellWidth: 9 },
          1: { halign: "left", cellWidth: contentW - 103 },
          2: { halign: "right", cellWidth: 14 },
          3: { halign: "center", cellWidth: 12 },
          4: { halign: "right", cellWidth: 22 },
          5: { halign: "right", cellWidth: 24 },
          6: { halign: "right", cellWidth: 22 }
        },
        head: [["#", "Item Name", "Qty", "Unit", "Price/Unit", "GST (18%)", "Amount"]],
        body: itemBody
      });

      y = doc.lastAutoTable.finalY;

      // Words & Amounts Summary
      const taxBreakdownText = isRajasthan
        ? `Taxable Sub Total: Rs. ${fmt(quoteSummary.taxableBase)}
CGST (9%): Rs. ${fmt(halfGst)}
SGST (9%): Rs. ${fmt(halfGst)}
Total Payable: Rs. ${fmt(quoteSummary.totalAmount)}`
        : `Taxable Sub Total: Rs. ${fmt(quoteSummary.taxableBase)}
IGST (18%): Rs. ${fmt(quoteSummary.gstIncluded)}
Total Payable: Rs. ${fmt(quoteSummary.totalAmount)}`;

      doc.autoTable({
        startY: y,
        margin: { left: margin, right: margin },
        theme: "grid",
        styles: { font: "helvetica", fontSize: 8.5, textColor: [15, 23, 42], lineColor: [51, 65, 85], lineWidth: 0.25, cellPadding: 2.5 },
        body: [
          [
            {
              content: `Estimate Amount In Words:
${numberToIndianWords(quoteSummary.totalAmount)}`,
              styles: { cellWidth: contentW * 0.52, fontStyle: "bold", valign: "top" }
            },
            {
              content: taxBreakdownText,
              styles: { cellWidth: contentW * 0.48, halign: "right", fontStyle: "bold", valign: "top" }
            }
          ]
        ]
      });

      y = doc.lastAutoTable.finalY;

      // GST Summary Table
      const gstRow = isRajasthan
        ? [`Rs. ${fmt(quoteSummary.taxableBase)}`, "-", "-", "9.0%", `Rs. ${fmt(halfGst)}`, "9.0%", `Rs. ${fmt(halfGst)}`, `Rs. ${fmt(quoteSummary.gstIncluded)}`]
        : [`Rs. ${fmt(quoteSummary.taxableBase)}`, "18.0%", `Rs. ${fmt(quoteSummary.gstIncluded)}`, "-", "-", "-", "-", `Rs. ${fmt(quoteSummary.gstIncluded)}`];

      doc.autoTable({
        startY: y,
        margin: { left: margin, right: margin },
        theme: "grid",
        headStyles: { fillColor: [241, 245, 249], textColor: [15, 23, 42], fontStyle: "bold", fontSize: 7.5, halign: "center", lineColor: [51, 65, 85], lineWidth: 0.25 },
        styles: { font: "helvetica", fontSize: 7.5, textColor: [15, 23, 42], lineColor: [51, 65, 85], lineWidth: 0.25, cellPadding: 1.8, halign: "right" },
        head: [["Taxable Amt", "IGST %", "IGST Amt", "CGST %", "CGST Amt", "SGST %", "SGST Amt", "Total Tax"]],
        body: [gstRow]
      });

      y = doc.lastAutoTable.finalY;

      // Bank Details, Terms & Signatory
      doc.autoTable({
        startY: y,
        margin: { left: margin, right: margin },
        theme: "grid",
        styles: { font: "helvetica", fontSize: 8, textColor: [15, 23, 42], lineColor: [51, 65, 85], lineWidth: 0.25, cellPadding: 2.5 },
        body: [
          [
            {
              content: "Bank Details:\nName: M/S KHUSHALI CHEMICAL\nBank Name: IDFC FIRST\nBranch: JAIPUR - JOHARI BAZAR BRANCH\nAccount No.: 79610970195\nIFSC: IDFB0043415\nSWIFT Code: IDFBINBBMUM\nUPI ID: khushalichemical@idfcbank",
              styles: { cellWidth: contentW * 0.42, valign: "top" }
            },
            {
              content: "Terms and conditions:\nThank you for doing business with us.\nAll rates are inclusive of 18% GST.",
              styles: { cellWidth: contentW * 0.32, valign: "top" }
            },
            {
              content: "For: KHUSHALI CHEMICAL\n\n\nAuthorized Signatory",
              styles: { cellWidth: contentW * 0.26, halign: "center", valign: "bottom", fontStyle: "bold" }
            }
          ]
        ]
      });

      y = doc.lastAutoTable.finalY + 5;
      const btnH = 11;
      doc.setFillColor(16, 185, 129);
      doc.roundedRect(margin, y, contentW, btnH, 2, 2, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(255, 255, 255);
      doc.text(`CLICK HERE TO PAY RS. ${fmt(quoteSummary.totalAmount)} VIA UPI (${upiId})`, pageW / 2, y + 7, { align: "center" });
      doc.link(margin, y, contentW, btnH, { url: upiUrl });

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(37, 99, 235);
      doc.textWithLink(`Direct UPI Link: ${upiUrl}`, margin, y + 16, { url: upiUrl });

      doc.save(`Quotation_${safeName}_${dateStr}.pdf`);
    } catch (err) {
      // Fallback: Clean hidden iframe Print-to-PDF (no popup blocker, no oklch crash)
      const iframe = document.createElement("iframe");
      iframe.style.position = "fixed";
      iframe.style.right = "0";
      iframe.style.bottom = "0";
      iframe.style.width = "0";
      iframe.style.height = "0";
      iframe.style.border = "0";
      document.body.appendChild(iframe);

      const fallbackHtml = `
        <html><head><title>Quotation_${safeName}_${dateStr}</title>
        <style>
          @page { size: A4; margin: 10mm; }
          body { font-family: Arial, sans-serif; color: #0f172a; font-size: 11px; margin: 0; }
          table { width: 100%; border-collapse: collapse; margin-top: -1px; }
          th, td { border: 1px solid #334155; padding: 5px; }
          th { background: #f1f5f9; }
        </style></head><body>
        <h3 style="text-align:center;margin:0 0 8px 0;">Quotation / Estimate</h3>
        <table>
          <tr>
            <td style="width:58%;"><b>KHUSHALI CHEMICAL</b><br/>Phone: 9216273399 / 8905878950<br/>Email: Rohitsambhawani@gmail.com<br/>GSTIN: 08PBDPS5444B1ZD | State: 08-Rajasthan</td>
            <td style="width:21%;">Quotation No.<br/><b>${quoteNo}</b></td>
            <td style="width:21%;">Date<br/><b>${dateStr}</b></td>
          </tr>
          <tr><td colspan="3"><b>Quote To:</b> ${quoteCustomerName || "Valued Buyer"} (${quoteCustomerCity || "India"})${quoteCustomerPhone ? ` • ${quoteCustomerPhone}` : ""}</td></tr>
        </table>
        <table>
          <thead><tr><th>#</th><th>Item Name</th><th>Qty</th><th>Unit</th><th>Price/Unit</th><th>GST (18%)</th><th>Amount</th></tr></thead>
          <tbody>
            ${quoteSummary.rows.map((r, i) => `<tr><td style="text-align:center;">${i+1}</td><td>${r.productName}${r.flavour && !r.flavour.startsWith("Standard") ? ` (${r.flavour})` : ""}</td><td style="text-align:right;">${r.qty}</td><td style="text-align:center;">${r.unit}</td><td style="text-align:right;">₹ ${fmt(r.price/1.18)}</td><td style="text-align:right;">₹ ${fmt(r.lineTotal - r.lineTotal/1.18)}</td><td style="text-align:right;"><b>₹ ${fmt(r.lineTotal)}</b></td></tr>`).join("")}
            <tr><td colspan="2"><b>Total</b></td><td style="text-align:right;"><b>${totalQty}</b></td><td></td><td></td><td style="text-align:right;"><b>₹ ${fmt(quoteSummary.gstIncluded)}</b></td><td style="text-align:right;"><b>₹ ${fmt(quoteSummary.totalAmount)}</b></td></tr>
          </tbody>
        </table>
        <table>
          <tr>
            <td style="width:50%;"><b>In Words:</b> ${numberToIndianWords(quoteSummary.totalAmount)}</td>
            <td style="width:50%;text-align:right;">Taxable: ₹ ${fmt(quoteSummary.taxableBase)}<br/>${isRajasthan ? `CGST (9%): ₹ ${fmt(halfGst)}<br/>SGST (9%): ₹ ${fmt(halfGst)}` : `IGST (18%): ₹ ${fmt(quoteSummary.gstIncluded)}`}<br/><b>Total: ₹ ${fmt(quoteSummary.totalAmount)}</b></td>
          </tr>
        </table>
        <table>
          <tr>
            <td style="width:42%;"><b>Bank Details:</b><br/>Name: M/S KHUSHALI CHEMICAL<br/>Bank: IDFC FIRST (Jaipur - Johari Bazar)<br/>A/c: 79610970195 | IFSC: IDFB0043415<br/>SWIFT: IDFBINBBMUM<br/>UPI: <b>khushalichemical@idfcbank</b><br/><a href="${upiUrl}" style="display:inline-block;margin-top:5px;padding:5px 10px;background:#10b981;color:#fff;text-decoration:none;font-weight:700;border-radius:4px;">Pay ₹ ${fmt(quoteSummary.totalAmount)} via UPI</a></td>
            <td style="width:32%;"><b>Terms:</b><br/>Thank you for doing business with us.</td>
            <td style="width:26%;text-align:center;vertical-align:bottom;"><b>For: KHUSHALI CHEMICAL</b><br/><br/>Authorized Signatory</td>
          </tr>
        </table>
        </body></html>`;

      const docWin = iframe.contentWindow;
      docWin.document.open();
      docWin.document.write(fallbackHtml);
      docWin.document.close();
      setTimeout(() => {
        docWin.focus();
        docWin.print();
        setTimeout(() => document.body.removeChild(iframe), 1000);
      }, 250);
    } finally {
      setDownloadingPdf(false);
    }
  };

  // Available Months Dropdown List
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

  // 📊 DAILY + MONTHLY PERFORMANCE & DATE-WISE BREAKDOWN
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
        const lastCall = normalizeSheetDate(l["Last_Call_Date"]);
        const nextDate = normalizeSheetDate(l["Next_Call_Date"]);
        const day1Date = normalizeSheetDate(l["Day_1_Date"]);
        const tsDate = normalizeSheetDate(l["Timestamp"]);
        const callDates = getLeadCallDates(l);
        const orderDate = getLeadOrderDate(l);

        // Today's Calls & Orders (1 Unique Customer = 1 Call Today; order revenue locked to orderDate)
        if (lastCall === todayDate) {
          callsCount += 1;
        }
        if (status === "Order Confirmed" && orderDate === todayDate) {
          ordersCount += 1;
          revenue += parseFloat(l["Order_Amount"] || l["Amount"] || 0);
        }

        if (!isClosed && status === "Planning to Visit Office") officeVisits += 1;
        if (!isClosed && nextDate && nextDate < todayDate) overdueCount += 1;
        if (!isClosed && getLeadPriority(l) === "HOT") hotCount += 1;

        // Monthly Stats
        const callsInMonth = callDates.filter((d) => d.startsWith(selectedMonth)).length;
        if (callsInMonth > 0) {
          monthlyCalls += callsInMonth;
          monthlyUniqueLeads += 1;
        }

        const createdDate = day1Date || tsDate;
        if (createdDate && createdDate.startsWith(selectedMonth)) {
          monthlyNewLeads += 1;
        }

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

      const lockedOrderDate = getLeadOrderDate(l);
      if (status === "Order Confirmed" && lockedOrderDate && lockedOrderDate.startsWith(selectedMonth)) {
        if (!dailyMap[lockedOrderDate]) {
          dailyMap[lockedOrderDate] = { date: lockedOrderDate, piyushCalls: 0, garvCalls: 0, orders: 0, revenue: 0 };
        }
        dailyMap[lockedOrderDate].orders += 1;
        dailyMap[lockedOrderDate].revenue += parseFloat(l["Order_Amount"] || l["Amount"] || 0);
      }
    });

    const dailyBreakdownList = Object.values(dailyMap).sort((a, b) => b.date.localeCompare(a.date));
    const monthlyMissionProgress = Math.min(100, Math.round((overall.monthlyRevenue / 1000000) * 100));

    return { overall, piyushStats, garvStats, dailyBreakdownList, monthlyMissionProgress };
  }, [leads, todayDate, loggedInCaller, selectedMonth]);

  // ALL TABS LIVE BADGE COUNTS
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
      const nextDate = normalizeSheetDate(l["Next_Call_Date"]);
      const lastCall = normalizeSheetDate(l["Last_Call_Date"]);

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

  // 🔔 TIME-BASED CALL POPUP ALARM + NEXT DUE CALL CHECKER
  useEffect(() => {
    if (!loggedInCaller || leads.length === 0) return;

    const checkScheduledAndUrgentCalls = () => {
      const { lead: nextLead, isAlarm } = findNextActionableLead(leads, snoozedKeys);

      if (!nextLead) {
        setSmartPopupLead(null);
        setShowSmartPopup(false);
        return;
      }

      // Exact scheduled time alarm always overrides dismiss & minimized state
      if (isAlarm) {
        if (!smartPopupLead || smartPopupLead._uniqueKey !== nextLead._uniqueKey || !showSmartPopup) {
          playNotificationChime();
          setSmartPopupLead(nextLead);
          setShowSmartPopup(true);
          setIsPopupMinimized(false);
          setPopupDismissed(false);
        }
        return;
      }

      // Keep smartPopupLead up to date if current popup lead is no longer due
      const currentStillDue = smartPopupLead && leads.some((l) => {
        if (l._uniqueKey !== smartPopupLead._uniqueKey) return false;
        const st = l["Call_Status"] || "New";
        if (st === "Order Confirmed" || st === "Not Interested") return false;
        const nd = l["Next_Call_Date"] ? String(l["Next_Call_Date"]).split("T")[0] : "";
        return !nd || nd <= todayDate;
      });

      if (!currentStillDue) {
        setSmartPopupLead(nextLead);
        if (!popupDismissed) {
          setShowSmartPopup(true);
        }
      } else if (!showSmartPopup && !popupDismissed) {
        setShowSmartPopup(true);
      }
    };

    checkScheduledAndUrgentCalls();
    const timer = setInterval(checkScheduledAndUrgentCalls, 15000);
    return () => clearInterval(timer);
  }, [leads, loggedInCaller, todayDate, showSmartPopup, smartPopupLead, popupDismissed, snoozedKeys]);

  // SNOOZE ACTION: MOVE TO LAST IN QUEUE & MINIMIZE POPUP
  const handleSnooze = () => {
    if (!smartPopupLead) return;
    const snoozedKey = smartPopupLead._uniqueKey;
    const updatedSnoozed = [...snoozedKeys.filter((k) => k !== snoozedKey), snoozedKey];
    setSnoozedKeys(updatedSnoozed);

    const updatedList = [
      ...leads.filter((l) => l._uniqueKey !== snoozedKey),
      smartPopupLead
    ];
    setLeads(updatedList);

    const { lead: nextAfterSnooze } = findNextActionableLead(updatedList, updatedSnoozed, snoozedKey);
    if (nextAfterSnooze) {
      setSmartPopupLead(nextAfterSnooze);
    }
    setIsPopupMinimized(true);
  };

    const calculateNextFollowUp = (lead, forceSameDay = false) => {
    const currentStage = lead["Current_Stage"] || "Day 1";
    const lastCallDate = lead["Last_Call_Date"] ? String(lead["Last_Call_Date"]).split("T")[0] : "";
    const existingNextDate = lead["Next_Call_Date"] ? String(lead["Next_Call_Date"]).split("T")[0] : "";
    
    const idx = FOLLOWUP_FLOW.findIndex((f) => f.stage === currentStage);
    const currentObj = idx !== -1 ? FOLLOWUP_FLOW[idx] : FOLLOWUP_FLOW[0];

    const isSameDayRepeat = forceSameDay || (lastCallDate === todayDate);

    if (isSameDayRepeat) {
      const safeNextDate = (!existingNextDate || existingNextDate < todayDate) ? todayDate : existingNextDate;
      return {
        nextStage: currentStage,
        nextDate: safeNextDate,
        noteCol: currentObj.noteCol,
        isSameDayRepeat: true
      };
    }

    if (idx === FOLLOWUP_FLOW.length - 1) {
      return { nextStage: "Completed", nextDate: "CLOSED", noteCol: currentObj.noteCol, isSameDayRepeat: false };
    }

    const nextObj = idx !== -1 ? FOLLOWUP_FLOW[idx + 1] : FOLLOWUP_FLOW[1];
    
    const targetDate = new Date(todayDate + "T00:00:00");
    const gapDays = Math.max(1, nextObj.days - currentObj.days);
    targetDate.setDate(targetDate.getDate() + gapDays);

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
    
    const existingNextDate = lead["Next_Call_Date"] && lead["Next_Call_Date"] !== "CLOSED" 
      ? String(lead["Next_Call_Date"]).split("T")[0] 
      : todayDate;
    const existingNextTime = lead["Next_Call_Time"] ? String(lead["Next_Call_Time"]).trim() : "";

    setVisitDateInput(existingNextDate);
    setVisitTimeInput(existingNextTime || "11:00");
    setCallNoteInput("");
    
    // Reset custom date/time inputs cleanly every time modal opens
    setCustomDateTimeEnabled(false);
    setCustomDateInput(existingNextDate);
    setCustomTimeInput(existingNextTime);

    const existingRemarks = getLeadRemarksList(lead);
    setModalHelperTab(existingRemarks.length > 0 ? "history" : "objections");
  };

     const handleSaveFollowUp = async () => {
    if (!activeLeadModal || !loggedInCaller) return;

    if (callStatusInput === "Order Confirmed") {
      const parsedAmt = parseFloat(orderAmountInput);
      if (!orderAmountInput || isNaN(parsedAmt) || parsedAmt <= 0) {
        alert("Kripya valid Order Amount (₹) dalein!");
        return;
      }
    }
    if (callStatusInput === "Planning to Visit Office" && !visitDateInput) {
      alert("Kripya Office Visit Date select karein!");
      return;
    }
    if (customDateTimeEnabled && !customDateInput) {
      alert("Kripya Custom Next Call Date select karein!");
      return;
    }
    if (typeof navigator !== "undefined" && !navigator.onLine) {
      alert("⚠️ Internet disconnected hai. Call update save karne ke liye internet connect karein.");
      return;
    }

    setSaving(true);

    try {
      const currentStage = activeLeadModal["Current_Stage"] || "Day 1";
      const isSameDayForce = callStatusInput === "Same Day Follow-up" || callStatusInput === "Planning to Visit Office";
      const stepInfo = calculateNextFollowUp(activeLeadModal, isSameDayForce);

      let nextStageVal = stepInfo.nextStage;
      let nextDateVal = stepInfo.nextDate;
      let nextTimeVal = "";

      // 1. Highest Priority: Custom Date & Time Checkbox
      if (customDateTimeEnabled && customDateInput) {
        nextDateVal = String(customDateInput).trim();
        nextTimeVal = customTimeInput ? String(customTimeInput).trim() : "";
        if (callStatusInput === "Same Day Follow-up" || stepInfo.isSameDayRepeat) {
          nextStageVal = currentStage;
        }
      } else if (callStatusInput === "Planning to Visit Office") {
        nextStageVal = currentStage;
        nextDateVal = visitDateInput ? String(visitDateInput).trim() : todayDate;
        nextTimeVal = visitTimeInput ? String(visitTimeInput).trim() : "";
      } else if (callStatusInput === "Busy / Call Tomorrow" || callStatusInput === "Ringing / Not Picked") {
        nextStageVal = currentStage;
        const [y, m, d] = todayDate.split("-").map(Number);
        const tomorrowObj = new Date(Date.UTC(y, m - 1, d + 1));
        nextDateVal = tomorrowObj.toISOString().split("T")[0];
        nextTimeVal = "";
      } else if (callStatusInput === "Order Confirmed" || callStatusInput === "Not Interested") {
        nextStageVal = "CLOSED";
        nextDateVal = "CLOSED";
        nextTimeVal = "";
      } else if (callStatusInput === "Same Day Follow-up" || stepInfo.isSameDayRepeat) {
        nextStageVal = currentStage;
      }

      if (nextDateVal !== "CLOSED" && nextDateVal < todayDate) {
        nextDateVal = todayDate;
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
      } else if (customDateTimeEnabled && customDateInput) {
        finalRemark = `${noteTimestamp} [Scheduled: ${nextDateVal}${nextTimeVal ? " @ " + nextTimeVal : ""}] ${callNoteInput}`;
      } else {
        finalRemark = `${noteTimestamp} ${callNoteInput}`;
      }

      const targetSheetUrl = activeLeadModal._sheetUrl || loggedInCaller.sheetApiUrl;
      if (!targetSheetUrl) {
        alert(`⚠️ ${activeLeadModal._callerName || loggedInCaller.name} ki Google Sheet API URL missing hai! Env variable check karein.`);
        setSaving(false);
        return;
      }
      if (!activeLeadModal.rowIndex || isNaN(Number(activeLeadModal.rowIndex))) {
        alert("⚠️ Is lead ka rowIndex missing hai! Kripya upar Sync button dabakar dobara try karein.");
        setSaving(false);
        return;
      }

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
      setAllTeamLeads((prev) =>
        prev.map((item) =>
          item._uniqueKey === currentUniqueKey
            ? updatedLeads.find((u) => u._uniqueKey === currentUniqueKey) || item
            : item
        )
      );
      setActiveLeadModal(null);
      setCustomDateTimeEnabled(false);
      setCustomDateInput("");
      setCustomTimeInput("");
      setCallNoteInput("");
      setOrderAmountInput("");
      setOrderDetailsInput("");

      const { lead: nextDueLead } = findNextActionableLead(updatedLeads, snoozedKeys, currentUniqueKey);

      if (autoDialerActive) {
        if (nextDueLead) {
          setTimeout(() => {
            handleOpenUpdateModal(nextDueLead);
          }, 300);
        } else {
          setAutoDialerActive(false);
          setSmartPopupLead(null);
          setShowSmartPopup(false);
          alert("🎉 Aaj ke sabhi due calls complete ho gaye! Auto-Dialer finished.");
        }
      } else {
        if (nextDueLead) {
          setSmartPopupLead(nextDueLead);
          setShowSmartPopup(true);
          setIsPopupMinimized(false);
          setPopupDismissed(false);
        } else {
          setSmartPopupLead(null);
          setShowSmartPopup(false);
        }
      }
    } catch (e) {
      alert("Sheet update karne mein dikkat aayi: " + e.message);
    } finally {
      setSaving(false);
    }
  };

  // 🚫 IN-APP NEW CUSTOMER SUBMIT WITH DUPLICATE BLOCK
  const handleAddNewCustomer = async (e) => {
    e.preventDefault();
    if (!loggedInCaller) return;

    const cleanName = String(newLeadForm.name || "").trim();
    const cleanNumber = String(newLeadForm.number || "").trim();
    const normNewPhone = normalizePhone10(cleanNumber);

    if (typeof navigator !== "undefined" && !navigator.onLine) {
      alert("⚠️ Internet disconnected hai. Save karne ke liye internet connect karein.");
      return;
    }

    const searchPool = allTeamLeads.length > 0 ? allTeamLeads : leads;
    const existingLead = searchPool.find((l) => {
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

      setAllTeamLeads((prev) => [newEntry, ...prev]);
      if (loggedInCaller.role === "admin" || targetCallerObj.id === loggedInCaller.id) {
        setLeads((prev) => [newEntry, ...prev]);
      }
      setNewCustomerModalOpen(false);
      setNewLeadForm({ name: "", number: "", city: "", budget: "", chemicals: "", priority: "HOT", note: "", targetCaller: "piyush" });
      // Sync real rowIndex from Google Sheet in background to prevent rowIndex mismatch
      setTimeout(() => { fetchCallerSheet(); }, 1200);
    } catch (err) {
      alert("Naya customer add karne me dikkat aayi: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  // IN-APP EDIT CUSTOMER INFO
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

    const cleanName = String(editLeadForm.name || "").trim();
    const cleanNumber = String(editLeadForm.number || "").trim();
    const normEditedPhone = normalizePhone10(cleanNumber);

    if (typeof navigator !== "undefined" && !navigator.onLine) {
      alert("⚠️ Internet disconnected hai. Update karne ke liye internet connect karein.");
      return;
    }
    // Check if edited phone collides with another existing lead across BOTH callers
    const editPool = allTeamLeads.length > 0 ? allTeamLeads : leads;
    const duplicateOther = editPool.find((l) => {
      if (l._uniqueKey === editLeadForm._uniqueKey) return false;
      return normEditedPhone.length >= 8 && normalizePhone10(l["Number"] || l["Contact Number"]) === normEditedPhone;
    });

    if (duplicateOther) {
      alert(`⚠️ Ye mobile number pehle se "${duplicateOther["Name"] || "Another Customer"}" ke naam par saved hai! Merge Duplicates button use karein.`);
      return;
    }

    try {
      setSaving(true);

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

      setAllTeamLeads((prev) =>
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

      if (activeLeadModal && activeLeadModal._uniqueKey === editLeadForm._uniqueKey) {
        setActiveLeadModal((prev) => ({
          ...prev,
          Name: cleanName,
          Number: cleanNumber,
          "Contact Number": cleanNumber,
          City: cleanCity,
          "सर आपका बजट कितना है?": cleanBudget,
          "आपको कौन कौनसे chemical चाहिए?": cleanChemicals,
        }));
      }

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

  // FILTERED LEADS FOR CURRENT TAB, CALLER FILTER & SEARCH QUERY
  const filteredLeads = useMemo(() => {
    return leads.filter((l) => {
      if (loggedInCaller?.role === "admin" && adminCallerFilter !== "all") {
        if (l._callerId !== adminCallerFilter) return false;
      }

      const status = l["Call_Status"] || "New";
      const isClosed = status === "Order Confirmed" || status === "Not Interested";
      const nextDate = normalizeSheetDate(l["Next_Call_Date"]);
      const lastCall = normalizeSheetDate(l["Last_Call_Date"]);

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
            {autoDialerActive && (
              <span className="bg-amber-500 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase flex items-center gap-1 animate-pulse">
                <Zap className="w-3 h-3" /> Auto-Dialer Active
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Khushali Chemicals (GST: 08PBDPS5444B1ZD) • Daily Target: 60 Calls | 4 Orders | ₹15,000/Caller
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* 💬 WHATSAPP QUOTATION MAKER BUTTON */}
          <button
            onClick={() => openQuotationModal(null)}
            className="flex items-center gap-1.5 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-black px-3.5 py-2 rounded-xl text-xs transition shadow-md shadow-emerald-500/20"
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

          {smartPopupLead && !showSmartPopup && (
            <button
              onClick={() => {
                setShowSmartPopup(true);
                setIsPopupMinimized(false);
                setPopupDismissed(false);
              }}
              className="flex items-center gap-1.5 bg-amber-500/20 border border-amber-500/40 text-amber-300 px-3 py-2 rounded-xl text-xs font-bold animate-pulse"
            >
              <BellRing className="w-3.5 h-3.5" /> Next Call Popup
            </button>
          )}

          <button
            onClick={() => setKnowledgeModalTab("catalog")}
            className="flex items-center gap-1.5 bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/40 text-indigo-300 px-3 py-2 rounded-xl text-xs font-bold transition"
          >
            <BookOpen className="w-3.5 h-3.5" /> Price & Formula
          </button>

          <button
            onClick={() => setKnowledgeModalTab("objections")}
            className="flex items-center gap-1.5 bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/40 text-purple-300 px-3 py-2 rounded-xl text-xs font-bold transition"
          >
            <ShieldAlert className="w-3.5 h-3.5" /> 12 Objection Scripts
          </button>

          <button
            onClick={() => setNewCustomerModalOpen(true)}
            className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-3.5 py-2 rounded-xl text-xs transition shadow-md shadow-emerald-500/20"
          >
            <PlusCircle className="w-4 h-4" /> Naya Customer
          </button>

          <button
            disabled={merging}
            onClick={handleMergeDuplicatesNow}
            className="flex items-center gap-1.5 bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/40 text-cyan-300 px-3 py-2 rounded-xl text-xs font-bold transition"
            title="Sheet me maujood duplicate numbers ko ek row me merge karein"
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

      {/* 👑 ADMIN FULL PROGRESS REPORT (MONTHLY + DAILY + CALLER LEADERBOARD) */}
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
                <span className="text-[11px] text-slate-400 font-semibold">Month:</span>
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
                10L Mission Progress: ₹{performanceStats.overall.monthlyRevenue.toLocaleString("en-IN")} / ₹10,00,000 ({performanceStats.monthlyMissionProgress}%)
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 text-center">
              <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
                <div className="text-[10px] text-slate-400 font-semibold uppercase">Monthly Calls</div>
                <div className="text-xl font-black text-sky-400 mt-0.5">{performanceStats.overall.monthlyCalls}</div>
                <div className="text-[10px] text-slate-500">{performanceStats.overall.monthlyUniqueLeads} Unique Leads</div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
                <div className="text-[10px] text-slate-400 font-semibold uppercase">Monthly Orders</div>
                <div className="text-xl font-black text-emerald-400 mt-0.5">{performanceStats.overall.monthlyOrders}</div>
                <div className="text-[10px] text-slate-500">Conv: {performanceStats.overall.monthlyConversionRate}%</div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
                <div className="text-[10px] text-slate-400 font-semibold uppercase">Monthly Sales</div>
                <div className="text-xl font-black text-amber-400 mt-0.5">₹{performanceStats.overall.monthlyRevenue.toLocaleString("en-IN")}</div>
                <div className="text-[10px] text-slate-500">
                  Avg: ₹{performanceStats.overall.monthlyOrders > 0 ? Math.round(performanceStats.overall.monthlyRevenue / performanceStats.overall.monthlyOrders).toLocaleString("en-IN") : 0}
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
                <div className="text-[10px] text-slate-400 font-semibold uppercase">New Leads Added</div>
                <div className="text-xl font-black text-white mt-0.5">{performanceStats.overall.monthlyNewLeads}</div>
                <div className="text-[10px] text-slate-500">In {formatMonthLabel(selectedMonth)}</div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
                <div className="text-[10px] text-slate-400 font-semibold uppercase">Office Visits</div>
                <div className="text-xl font-black text-indigo-400 mt-0.5">{performanceStats.overall.monthlyOfficeVisits}</div>
                <div className="text-[10px] text-slate-500">Scheduled/Active</div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
                <div className="text-[10px] text-slate-400 font-semibold uppercase">Total Overdue</div>
                <div className="text-xl font-black text-rose-400 mt-0.5">{performanceStats.overall.overdueCount}</div>
                <div className="text-[10px] text-slate-500">Needs Follow-up</div>
              </div>
            </div>

            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-500 to-amber-400 h-2 rounded-full transition-all duration-500"
                style={{ width: `${performanceStats.monthlyMissionProgress}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {[
              { name: "Piyush (WhatsApp SIM 1)", stats: performanceStats.piyushStats, badgeColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30" },
              { name: "Garv (WhatsApp SIM 2)", stats: performanceStats.garvStats, badgeColor: "text-sky-400 bg-sky-500/10 border-sky-500/30" }
            ].map((caller, idx) => (
              <div key={idx} className="bg-slate-950/90 border border-slate-800 rounded-2xl p-4 space-y-3.5">
                <div className="flex flex-wrap justify-between items-center gap-2 border-b border-slate-800/80 pb-2.5">
                  <span className={`text-xs font-black px-2.5 py-1 rounded-lg border ${caller.badgeColor}`}>
                    {caller.name}
                  </span>
                  <span className="text-xs font-bold text-slate-300">
                    Total Database: <b className="text-white">{caller.stats.totalLeads}</b> Leads
                  </span>
                </div>

                <div>
                  <div className="flex justify-between items-center text-[11px] mb-1.5">
                    <span className="font-bold text-slate-400 uppercase tracking-wider">Today's Performance</span>
                    <span className="font-bold text-amber-400">
                      ₹{caller.stats.revenue.toLocaleString("en-IN")} / ₹15,000 ({caller.stats.revProgress}%)
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-center bg-slate-900 p-2.5 rounded-xl border border-slate-800/80">
                    <div>
                      <div className="text-[10px] text-slate-400">Calls Today</div>
                      <div className="text-sm font-black text-white">{caller.stats.callsCount}/60</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400">Orders Won</div>
                      <div className="text-sm font-black text-emerald-400">{caller.stats.ordersCount}/4</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400">Office Visits</div>
                      <div className="text-sm font-black text-indigo-400">{caller.stats.officeVisits}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400">Overdue</div>
                      <div className="text-sm font-black text-rose-400">{caller.stats.overdueCount}</div>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center text-[11px] mb-1.5">
                    <span className="font-bold text-emerald-400 uppercase tracking-wider">
                      {formatMonthLabel(selectedMonth)} Total Report
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Conversion: <b className="text-white">{caller.stats.monthlyConversionRate}%</b>
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center bg-emerald-950/20 p-2.5 rounded-xl border border-emerald-500/20">
                    <div>
                      <div className="text-[10px] text-slate-400">Monthly Calls</div>
                      <div className="text-base font-black text-sky-400">{caller.stats.monthlyCalls}</div>
                      <div className="text-[9px] text-slate-500">{caller.stats.monthlyUniqueLeads} Leads</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400">Monthly Orders</div>
                      <div className="text-base font-black text-emerald-400">{caller.stats.monthlyOrders}</div>
                      <div className="text-[9px] text-slate-500">Closed Deals</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400">Monthly Sales</div>
                      <div className="text-base font-black text-amber-400">₹{caller.stats.monthlyRevenue.toLocaleString("en-IN")}</div>
                      <div className="text-[9px] text-slate-500">Total Revenue</div>
                    </div>
                  </div>
                </div>

                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${caller.stats.revProgress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl overflow-hidden">
            <button
              type="button"
              onClick={() => setShowDailyBreakdown(!showDailyBreakdown)}
              className="w-full px-4 py-3 flex justify-between items-center text-xs font-bold text-slate-300 hover:bg-slate-900/60 transition"
            >
              <span className="flex items-center gap-2">
                <CalendarCheck className="w-4 h-4 text-emerald-400" />
                <span>Date-wise Calling & Sales Breakdown ({formatMonthLabel(selectedMonth)} — {performanceStats.dailyBreakdownList.length} Active Days)</span>
              </span>
              <span className="flex items-center gap-1 text-amber-400">
                {showDailyBreakdown ? "Hide Table" : "View Day-by-Day Table"}
                {showDailyBreakdown ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </span>
            </button>

            {showDailyBreakdown && (
              <div className="overflow-x-auto border-t border-slate-800 max-h-64 overflow-y-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900 text-slate-400 uppercase text-[10px] sticky top-0">
                    <tr>
                      <th className="p-3">Date</th>
                      <th className="p-3 text-center">Piyush Calls</th>
                      <th className="p-3 text-center">Garv Calls</th>
                      <th className="p-3 text-center">Total Team Calls</th>
                      <th className="p-3 text-center">Orders Won</th>
                      <th className="p-3 text-right">Sales Value (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {performanceStats.dailyBreakdownList.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-6 text-center text-slate-500">
                          Is mahine me abhi tak koi call activity record nahi hui hai.
                        </td>
                      </tr>
                    ) : (
                      performanceStats.dailyBreakdownList.map((day) => (
                        <tr key={day.date} className="hover:bg-slate-900/50">
                          <td className="p-3 font-mono font-bold text-white">{day.date}</td>
                          <td className="p-3 text-center text-emerald-400 font-bold">{day.piyushCalls}</td>
                          <td className="p-3 text-center text-sky-400 font-bold">{day.garvCalls}</td>
                          <td className="p-3 text-center font-black text-white">{day.piyushCalls + day.garvCalls}</td>
                          <td className="p-3 text-center font-bold text-emerald-300">{day.orders}</td>
                          <td className="p-3 text-right font-black text-amber-400">₹{day.revenue.toLocaleString("en-IN")}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 🚀 LIVE DAILY SCORECARD */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex justify-between items-center text-xs text-slate-400 font-semibold">
            <span>Calls Made Today</span>
            <Phone className="w-4 h-4 text-sky-400" />
          </div>
          <div className="my-2">
            <span className="text-2xl font-black text-white">{performanceStats.overall.callsCount}</span>
            <span className="text-xs text-slate-500 font-medium"> / {loggedInCaller.dailyTargetCalls} Target</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-sky-500 h-1.5 rounded-full transition-all duration-500" 
              style={{ width: `${Math.min(100, (performanceStats.overall.callsCount / loggedInCaller.dailyTargetCalls) * 100)}%` }}
            />
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex justify-between items-center text-xs text-slate-400 font-semibold">
            <span>Orders Won Today</span>
            <Award className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="my-2">
            <span className="text-2xl font-black text-emerald-400">{performanceStats.overall.ordersCount}</span>
            <span className="text-xs text-slate-500 font-medium"> / {loggedInCaller.dailyTargetOrders} Target</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500" 
              style={{ width: `${Math.min(100, (performanceStats.overall.ordersCount / loggedInCaller.dailyTargetOrders) * 100)}%` }}
            />
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex justify-between items-center text-xs text-slate-400 font-semibold">
            <span>Today's Sales Value</span>
            <IndianRupee className="w-4 h-4 text-amber-400" />
          </div>
          <div className="my-2">
            <span className="text-2xl font-black text-amber-400">₹{performanceStats.overall.revenue.toLocaleString('en-IN')}</span>
            <span className="text-xs text-slate-500 font-medium"> / ₹{loggedInCaller.dailyTargetRevenue.toLocaleString('en-IN')}</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-amber-500 h-1.5 rounded-full transition-all duration-500" 
              style={{ width: `${performanceStats.overall.revProgress}%` }}
            />
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/30 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex justify-between items-center text-xs text-emerald-400 font-bold">
            <span>Daily Goal Target</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="my-1">
            <div className="text-lg font-black text-white">{performanceStats.overall.revProgress}% Achieved</div>
            <p className="text-[11px] text-slate-400">
              {performanceStats.overall.revenue >= loggedInCaller.dailyTargetRevenue 
                ? "🎉 Target Complete! Bonus Achieved." 
                : `₹${(loggedInCaller.dailyTargetRevenue - performanceStats.overall.revenue).toLocaleString('en-IN')} baaki hai`}
            </p>
          </div>
          <div className="text-[10px] text-emerald-500/80 font-mono font-semibold uppercase">
            Khushali 10L Mission
          </div>
        </div>
      </div>

      {/* 🔍 REAL-TIME SEARCH BAR */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-lg">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Search karein: Customer Name, Mobile Number, City ya Chemicals..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-10 py-2.5 text-xs md:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-3 text-slate-400 hover:text-white"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        {searchQuery && (
          <div className="text-xs text-emerald-400 font-semibold px-2 whitespace-nowrap">
            Showing {filteredLeads.length} matching leads
          </div>
        )}
      </div>

      {/* FILTER TABS WITH DYNAMIC LIVE COUNTS */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: "today", label: `Aaj Ki Calls (Due Today)`, count: tabCounts.today, color: "text-emerald-400" },
          { id: "hot_leads", label: `🔥 Hot Leads`, count: tabCounts.hotLeads, color: "text-rose-400" },
          { id: "office_visit", label: `Office Visits 🏢`, count: tabCounts.officeVisit, color: "text-indigo-400" },
          { id: "called_today", label: `Aaj Hui Calls`, count: tabCounts.calledToday, color: "text-sky-400" },
          { id: "orders_today", label: `Aaj Ke Orders 🏆`, count: tabCounts.ordersToday, color: "text-amber-400" },
          { id: "overdue", label: `Overdue Calls`, count: tabCounts.overdue, color: "text-rose-400" },
          { id: "upcoming", label: `Upcoming Calls`, count: tabCounts.upcoming, color: "text-purple-400" },
          { id: "all", label: `All Leads`, count: tabCounts.all, color: "text-slate-300" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
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
                <th className="p-3.5">Customer & Priority (Click Name for History)</th>
                <th className="p-3.5">City, Budget & Requirement</th>
                <th className="p-3.5">Status / Stage</th>
                <th className="p-3.5">Last Call</th>
                <th className="p-3.5">Next Call / Visit Time</th>
                <th className="p-3.5 text-right">Quick Actions & Templates</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-10 text-center text-slate-500 text-xs">
                    {searchQuery ? `"${searchQuery}" ke liye koi result nahi mila.` : "Is filter me koi lead nahi hai."}
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
                          title="Click to view complete discussion history & remarks"
                        >
                          <span className="underline decoration-dotted underline-offset-4">{lead["Name"] || "—"}</span>
                          <History className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 text-emerald-400" />
                          <span className={`text-[9px] px-1.5 py-0.5 rounded font-black uppercase ${
                            priority === "HOT" ? "bg-rose-500/20 text-rose-400 border border-rose-500/30" :
                            priority === "COLD" ? "bg-blue-500/20 text-blue-400" :
                            "bg-amber-500/20 text-amber-300"
                          }`}>
                            {priority === "HOT" ? "🔥 HOT" : priority}
                          </span>
                          {loggedInCaller.role === "admin" && (
                            <span className="text-[9px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded border border-slate-700">
                              {lead._callerName}
                            </span>
                          )}
                          {status === "Order Confirmed" && (
                            <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-black">
                              ₹{lead["Order_Amount"] || ""}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-emerald-400 font-mono mt-0.5">{phoneNum}</div>
                      </td>
                      <td className="p-3.5">
                        <div className="text-slate-200 text-xs font-semibold flex items-center gap-2">
                          <span>{lead["City"] || "—"}</span>
                          {lead["सर आपका बजट कितना है?"] && (
                            <span className="text-[10px] text-amber-400 bg-amber-950/60 px-1.5 py-0.5 rounded">
                              Budget: ₹{lead["सर आपका बजट कितना है?"]}
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate max-w-xs mt-0.5">
                          {lead["आपको कौन कौनसे chemical चाहिए?"] || "—"}
                        </div>
                      </td>
                      <td className="p-3.5">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="bg-blue-500/15 text-blue-400 text-xs px-2 py-0.5 rounded font-mono font-bold">
                            {stage}
                          </span>
                          <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                            status === "Order Confirmed" ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" :
                            status === "Planning to Visit Office" ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/40" :
                            status === "Busy / Call Tomorrow" ? "bg-amber-500/20 text-amber-400" :
                            status === "Ringing / Not Picked" ? "bg-purple-500/20 text-purple-400" :
                            status === "Same Day Follow-up" ? "bg-sky-500/20 text-sky-400" :
                            "bg-slate-800 text-slate-300"
                          }`}>
                            {status === "Planning to Visit Office" ? "🏢 Office Visit" : status}
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
                          title="Edit Customer Details"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <a
                          href={`tel:${phoneNum}`}
                          className="inline-block p-1.5 rounded-lg bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white border border-blue-500/30 transition text-xs"
                          title="Call Now"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                        <button
                          onClick={() => openQuotationModal(lead)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-teal-600/20 text-teal-300 hover:bg-teal-600 hover:text-white border border-teal-500/30 transition text-xs font-bold"
                          title="Create Custom WhatsApp Quotation (Chemicals + Bottles)"
                        >
                          Quote
                        </button>
                        <button
                          onClick={() => setWaTemplateModalLead(lead)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white border border-emerald-500/30 transition text-xs font-bold"
                          title="Send Sample Kit, Price List or Office Location on WhatsApp"
                        >
                          <MessageSquare className="w-3.5 h-3.5" /> WA Templates
                        </button>
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

      {/* 💬 WHATSAPP QUOTATION MAKER MODAL (CHEMICALS + BOTTLES + CHANGE PRICE ON SELECTION) */}
      {quoteModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-[60] animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full p-6 relative shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
            <button onClick={() => setQuoteModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-slate-800 pb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                <MessageSquare className="w-3.5 h-3.5" /> WhatsApp Quotation & GST Maker (18% Inc.)
              </span>
              <h3 className="text-xl font-black text-white mt-0.5">Create & Send Quotation</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Buyer / Business Name</label>
                <input
                  type="text"
                  value={quoteCustomerName}
                  onChange={(e) => setQuoteCustomerName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">WhatsApp Number (Optional)</label>
                <input
                  type="text"
                  value={quoteCustomerPhone}
                  onChange={(e) => setQuoteCustomerPhone(e.target.value.replace(/[^0-9]/g, ""))}
                  placeholder="9876543210"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-emerald-400 font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">City & State</label>
                <input
                  type="text"
                  value={quoteCustomerCity}
                  onChange={(e) => setQuoteCustomerCity(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">GST Type (PDF)</label>
                <select
                  value={quoteTaxMode}
                  onChange={(e) => setQuoteTaxMode(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-amber-300 font-semibold focus:outline-none focus:border-emerald-500"
                >
                  <option value="AUTO">Auto (By City/State)</option>
                  <option value="INTRA_RJ">Rajasthan (CGST 9% + SGST 9%)</option>
                  <option value="INTER_IGST">Out of Rajasthan (IGST 18%)</option>
                </select>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2">
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
              <span className="text-[11px] text-cyan-400">Tip: Price box me rate direct change kar sakte hain</span>
            </div>

            <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
              {quoteSummary.rows.map((row) => (
                <div key={row.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-3 grid grid-cols-1 sm:grid-cols-12 gap-2 items-center text-xs">
                  <div className="sm:col-span-5 space-y-1.5">
                    <div>
                      <label className="block text-[9px] text-slate-500 mb-0.5">Select Item</label>
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
                    {row.itemType === "CHEMICAL" && (() => {
                      const prodDef = PRODUCT_CATALOG.find(p => p.name === row.productName);
                      const flavs = prodDef?.flavours || [];
                      if (flavs.length <= 1) return null;
                      return (
                        <select
                          value={row.flavour || flavs[0]}
                          onChange={(e) => updateQuoteRow(row.id, { flavour: e.target.value })}
                          className="w-full bg-slate-900 border border-cyan-700/60 rounded-lg px-2.5 py-1.5 text-cyan-300 text-[11px] font-semibold"
                        >
                          {flavs.map(f => <option key={f} value={f}>Flavour: {f}</option>)}
                        </select>
                      );
                    })()}
                  </div>

                  {row.itemType === "CHEMICAL" ? (
                    <div className="sm:col-span-2">
                      <label className="block text-[9px] text-slate-500 mb-0.5">Price Slab</label>
                      <select
                        value={row.tier}
                        onChange={(e) => updateQuoteRow(row.id, { tier: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-2 text-cyan-300 text-xs font-mono"
                      >
                        <option value="tier5">5kg Rate</option>
                        <option value="tier25">{row.productName.includes("Room Freshener") ? "10kg Rate" : "25kg Rate"}</option>
                        <option value="tier50">50kg Rate</option>
                      </select>
                    </div>
                  ) : (
                    <div className="sm:col-span-2 text-center text-[10px] text-indigo-300 font-mono pt-3">
                      Bottle / Cap
                    </div>
                  )}

                  <div className="sm:col-span-2">
                    <label className="block text-[9px] text-slate-500 mb-0.5">Qty ({row.unit})</label>
                    <input
                      type="number"
                      min="1"
                      value={row.qty}
                      onChange={(e) => updateQuoteRow(row.id, { qty: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-2 text-white font-mono text-center"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[9px] text-emerald-400 mb-0.5">Rate (₹/{row.unit})</label>
                    <input
                      type="number"
                      step="any"
                      value={row.customPrice}
                      onChange={(e) => updateQuoteRow(row.id, { customPrice: e.target.value })}
                      className="w-full bg-slate-900 border border-emerald-600/80 rounded-lg px-2 py-2 text-emerald-400 font-mono font-bold text-right"
                      title="Change price directly while selecting"
                    />
                  </div>

                  <div className="sm:col-span-1 flex items-center justify-end pt-3">
                    {quoteSummary.rows.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeQuoteRow(row.id)}
                        className="p-1.5 text-rose-400 hover:bg-rose-950/60 rounded-lg"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Base Taxable Amount:</span>
                <span className="font-mono">Rs.{quoteSummary.taxableBase.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>GST (18% included in rates):</span>
                <span className="font-mono">Rs.{quoteSummary.gstIncluded.toLocaleString("en-IN")}</span>
              </div>
              <div className="pt-2 border-t border-slate-800 flex justify-between items-baseline text-sm font-bold text-white">
                <span>Total Payable:</span>
                <span className="text-xl font-black text-emerald-400 font-mono">
                  Rs.{quoteSummary.totalAmount.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
              <a
                href={buildWhatsAppUrl(quoteCustomerPhone, generateQuotationWhatsAppMessage())}
                target="_blank"
                rel="noreferrer"
                className="py-3 px-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl shadow-lg shadow-emerald-500/20 transition flex items-center justify-center gap-2 text-xs"
              >
                <Send className="w-4 h-4" /> Send on WhatsApp
              </a>
              <button
                type="button"
                disabled={downloadingPdf}
                onClick={handleDownloadQuotationPDF}
                className="py-3 px-3 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-xl shadow-lg shadow-indigo-600/20 transition flex items-center justify-center gap-2 text-xs"
              >
                <Download className="w-4 h-4" /> {downloadingPdf ? "Generating PDF..." : "Download PDF"}
              </button>
              <button
                type="button"
                onClick={() => handleCopyText(generateQuotationWhatsAppMessage(), "quote_copy")}
                className="py-3 px-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl border border-slate-700 transition flex items-center justify-center gap-2 text-xs"
              >
                {copiedId === "quote_copy" ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                {copiedId === "quote_copy" ? "Quotation Copied!" : "Copy Quotation Text"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 📲 1-CLICK WHATSAPP MULTI-TEMPLATE DRAWER MODAL */}
      {waTemplateModalLead && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-[60] animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 relative shadow-2xl space-y-4">
            <button onClick={() => setWaTemplateModalLead(null)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> 1-Click WhatsApp Templates
              </span>
              <h3 className="text-xl font-black text-white mt-0.5">{waTemplateModalLead["Name"]}</h3>
              <p className="text-xs text-slate-400 font-mono">{waTemplateModalLead["Number"] || waTemplateModalLead["Contact Number"]}</p>
            </div>

            <div className="space-y-2.5 max-h-[65vh] overflow-y-auto pr-1">
              {[
                {
                  id: "sample_kit",
                  title: "📦 Sample / Trial Kit Pitch (High Converting)",
                  desc: "Ready-to-mix compound pitch + dilution ratios + trial kit dispatch offer",
                  badge: "Best for New/Doubtful Leads"
                },
                {
                  id: "price_list",
                  title: "💰 Full Catalog Price List & Ratios (Per Kg Incl. GST)",
                  desc: "All 12 products (5Kg / 25Kg / 50Kg slabs) + GST 08PBDPS5444B1ZD",
                  badge: "Official Rate Card"
                },
                {
                  id: "office_visit",
                  title: "🏢 Jaipur Office Visit Invitation & Details",
                  desc: "Scheduled date/time confirmation + Jaipur office address & contact",
                  badge: "Office Visit"
                },
                {
                  id: "trust_proof",
                  title: "🛡️ Company Verification & Founder Story (@rohitsam.0)",
                  desc: "20+ states supply proof, GST details & 1-compound technology trust builder",
                  badge: "Overcome Trust Issue"
                },
                {
                  id: "followup",
                  title: "📞 Standard Follow-up & Order Dispatch Reminder",
                  desc: "Quick polite follow-up for quotation shared earlier",
                  badge: "Quick Reminder"
                }
              ].map((tpl) => {
                const rawPhone = waTemplateModalLead["Number"] || waTemplateModalLead["Contact Number"] || "";
                const msg = buildWhatsAppTemplate(tpl.id, waTemplateModalLead, loggedInCaller.name);
                return (
                  <div key={tpl.id} className="p-3.5 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col gap-2 hover:border-emerald-500/40 transition">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <div className="text-xs font-extrabold text-white">{tpl.title}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{tpl.desc}</div>
                      </div>
                      <span className="text-[9px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded font-bold whitespace-nowrap">
                        {tpl.badge}
                      </span>
                    </div>
                    <div className="flex items-center justify-end gap-2 pt-1">
                      <button
                        onClick={() => handleCopyText(msg, tpl.id)}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-bold flex items-center gap-1"
                      >
                        {copiedId === tpl.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        {copiedId === tpl.id ? "Copied" : "Copy Text"}
                      </button>
                      <a
                        href={buildWhatsAppUrl(rawPhone, msg)}
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => setWaTemplateModalLead(null)}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-[11px] font-black flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
                      >
                        <MessageSquare className="w-3.5 h-3.5" /> Send on WhatsApp
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 📖 KNOWLEDGE BASE MODAL: PRICE CATALOG + BOTTLES + 12 OBJECTION SCRIPTS */}
      {knowledgeModalTab && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-4xl w-full p-6 relative shadow-2xl space-y-4 max-h-[90vh] flex flex-col">
            <button onClick={() => setKnowledgeModalTab(null)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setKnowledgeModalTab("catalog")}
                  className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition ${
                    knowledgeModalTab === "catalog"
                      ? "bg-indigo-500 text-white"
                      : "bg-slate-950 text-slate-400 border border-slate-800"
                  }`}
                >
                  <FlaskConical className="w-4 h-4" /> Price List & Formulation Ratios (12 Products + Bottles)
                </button>
                <button
                  onClick={() => setKnowledgeModalTab("objections")}
                  className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition ${
                    knowledgeModalTab === "objections"
                      ? "bg-purple-500 text-white"
                      : "bg-slate-950 text-slate-400 border border-slate-800"
                  }`}
                >
                  <ShieldAlert className="w-4 h-4" /> 12 Objection Scripts & Closing Psychology
                </button>
              </div>
            </div>

            <div className="overflow-y-auto flex-1 pr-1 space-y-4">
              {knowledgeModalTab === "catalog" ? (
                <div className="space-y-4">
                  <div className="bg-indigo-950/40 border border-indigo-500/30 p-3.5 rounded-2xl flex flex-wrap justify-between items-center gap-2 text-xs">
                    <div>
                      <span className="font-bold text-indigo-300">Khushali Chemicals Official Catalog:</span>{" "}
                      <span className="text-slate-300">All rates are PER KG and INCLUDING 18% GST.</span>
                    </div>
                    <span className="font-mono text-emerald-400 font-bold">GST: 08PBDPS5444B1ZD | Contact: 8905878950</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {PRODUCT_CATALOG.map((prod, i) => (
                      <div key={i} className="bg-slate-950 border border-slate-800 p-3.5 rounded-2xl space-y-1.5">
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="font-extrabold text-white text-sm">{prod.name}</h4>
                          <span className="text-[10px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded font-mono font-bold">
                            {prod.ratio}
                          </span>
                        </div>
                        <div className="text-xs font-mono text-amber-400 font-bold">{prod.slabs}</div>
                        <p className="text-[11px] text-slate-400 leading-relaxed">{prod.instructions}</p>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2">
                    <h4 className="text-xs font-black uppercase tracking-wider text-indigo-400 mb-2.5 flex items-center gap-1.5">
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

                  <div className="bg-amber-950/30 border border-amber-500/30 p-4 rounded-2xl space-y-1.5 text-xs">
                    <div className="font-black text-amber-400 uppercase tracking-wider">⚠️ महत्वपूर्ण फॉर्मूलेशन सुझाव (Important Mixing Rules):</div>
                    <p className="text-slate-300">• <b>नमक का उपयोग (Industrial Salt):</b> गाढ़ापन लाने के लिए नमक को हमेशा पहले पानी में पूरी तरह घोल लें, उसके बाद ही कंसन्ट्रेट डालें।</p>
                    <p className="text-slate-300">• <b>विश्राम अवधि (24 Hours Resting):</b> हैंडवाश, डिशवॉश और फैब्रिक वॉश को बनाने के तुरंत बाद पैक न करें। कम से कम 24 घंटे स्थिर छोड़ दें ताकि झाग खत्म हो जाए और उत्पाद पारदर्शी (Clear) दिखे।</p>
                    <p className="text-slate-300">• <b>ग्लास क्लीनर (0 TDS Water):</b> ग्लास क्लीनर के लिए सादा RO पानी उपयोग न करें (कांच पर निशान पड़ सकते हैं)। हमेशा 0 TDS वाला बैटरी/DM पानी ही लें।</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="bg-rose-950/30 border border-rose-500/30 p-3.5 rounded-2xl text-xs space-y-1">
                      <div className="font-black text-rose-400 uppercase">❌ कभी मत बोलो (Never Say):</div>
                      <p className="text-slate-300">• "Sir Buy कर लो" / "Offer खत्म हो जाएगा"</p>
                      <p className="text-slate-300">• "जल्दी Decision लो" / "Trust कर लो"</p>
                      <div className="font-black text-emerald-400 uppercase pt-2">✅ हमेशा बोलो (Always Say):</div>
                      <p className="text-slate-300">• "आपकी बात बिल्कुल सही है। अगर मैं आपकी जगह होता तो शायद मैं भी यही सोचता।"</p>
                      <p className="text-slate-300">• "मैं आपको convince नहीं, clarify करना चाहता हूँ।"</p>
                    </div>
                    <div className="bg-amber-950/30 border border-amber-500/30 p-3.5 rounded-2xl text-xs space-y-1">
                      <div className="font-black text-amber-400 uppercase">🏆 5 Golden Closing Lines:</div>
                      {GOLDEN_CLOSING_LINES.map((line, idx) => (
                        <p key={idx} className="text-slate-200 font-medium">• "{line}"</p>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {OBJECTION_SCRIPTS.map((obj) => (
                      <div key={obj.id} className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-black text-purple-400">{obj.title}</span>
                          <button
                            onClick={() => handleCopyText(obj.reply, `obj_${obj.id}`)}
                            className="text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded flex items-center gap-1"
                          >
                            {copiedId === `obj_${obj.id}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                            Copy
                          </button>
                        </div>
                        <div className="text-[11px] text-rose-300 bg-rose-950/30 px-2.5 py-1 rounded-lg border border-rose-800/30">
                          <b>Customer:</b> "{obj.customer}"
                        </div>
                        <p className="text-xs text-emerald-300 leading-relaxed font-medium">
                          <b>Caller Reply:</b> "{obj.reply}"
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SMART CALL POPUP (SNOOZE TO LAST & SLEEK MINIMIZE BAR) */}
      {showSmartPopup && smartPopupLead && !activeLeadModal && !historyModalLead && !quoteModalOpen && (
        isPopupMinimized ? (
          <div
            onClick={() => setIsPopupMinimized(false)}
            className="fixed bottom-5 right-5 bg-slate-900/95 border-2 border-emerald-500/80 rounded-2xl px-4 py-3 shadow-2xl z-40 flex items-center gap-3 cursor-pointer hover:bg-slate-800 hover:border-emerald-400 transition animate-pulse"
            title="Click to expand popup"
          >
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <div className="flex items-center gap-2">
              <BellRing className="w-4 h-4 text-amber-400" />
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>Call Minimized: {smartPopupLead["Name"] || "Next Lead"}</span>
                </div>
                <div className="text-[10px] text-emerald-400 font-mono">
                  {smartPopupLead["Number"] || smartPopupLead["Contact Number"]}
                </div>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsPopupMinimized(false);
              }}
              className="ml-2 bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-slate-950 px-2.5 py-1 rounded-lg text-[10px] font-bold transition flex items-center gap-1"
            >
              <Maximize2 className="w-3 h-3" /> Expand
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowSmartPopup(false);
                setIsPopupMinimized(false);
                setPopupDismissed(true);
              }}
              className="text-slate-400 hover:text-white p-1 rounded-lg"
              title="Close"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="fixed bottom-5 right-5 left-5 md:left-auto md:w-[440px] bg-slate-900 border-2 border-emerald-500 rounded-3xl p-5 shadow-2xl z-40 animate-fade-in">
            <div className="flex justify-between items-center mb-3 gap-1.5">
              <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase flex items-center gap-1 ${
                smartPopupLead["Call_Status"] === "Planning to Visit Office"
                  ? "bg-indigo-500 text-white"
                  : "bg-emerald-500 text-slate-950"
              }`}>
                <BellRing className="w-3 h-3" /> 
                {smartPopupLead["Call_Status"] === "Planning to Visit Office"
                  ? `🏢 Office Visit${smartPopupLead["Next_Call_Time"] ? " @ " + smartPopupLead["Next_Call_Time"] : ""}`
                  : smartPopupLead["Next_Call_Time"] ? `Alarm: ${smartPopupLead["Next_Call_Time"]}` : "Next Due Call"}
              </span>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => setIsPopupMinimized(true)} 
                  className="text-slate-300 hover:text-white text-[11px] bg-slate-800 hover:bg-slate-700 px-2 py-1 rounded-lg flex items-center gap-1 transition"
                >
                  <Minimize2 className="w-3 h-3" /> Minimize
                </button>
                <button 
                  onClick={handleSnooze} 
                  className="text-amber-400 hover:text-amber-300 text-[11px] bg-amber-950/60 border border-amber-800/60 px-2 py-1 rounded-lg font-bold transition"
                >
                  Snooze
                </button>
                <button
                  onClick={() => {
                    setShowSmartPopup(false);
                    setIsPopupMinimized(false);
                    setPopupDismissed(true);
                  }}
                  className="text-slate-400 hover:text-white p-1 rounded-lg"
                  title="Close Popup"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-3.5 mb-4 space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-lg font-extrabold text-white">{smartPopupLead["Name"] || "Customer"}</h3>
                {loggedInCaller.role === "admin" && smartPopupLead._callerName && (
                  <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-bold">
                    {smartPopupLead._callerName}
                  </span>
                )}
              </div>
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
              <button
                onClick={() => openQuotationModal(smartPopupLead)}
                className="flex items-center justify-center gap-1.5 bg-teal-950 border border-teal-700 text-teal-300 py-2.5 rounded-xl text-xs font-bold"
              >
                <MessageSquare className="w-3.5 h-3.5" /> Quote
              </button>
              <button
                onClick={() => handleOpenUpdateModal(smartPopupLead)}
                className="bg-slate-800 hover:bg-slate-700 text-white font-bold py-2.5 rounded-xl text-xs border border-slate-700"
              >
                Update
              </button>
            </div>
          </div>
        )
      )}

      {/* REMARKS & TIMELINE DISCUSSION HISTORY MODAL */}
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
                onClick={() => handleOpenEditCustomer(historyModalLead)}
                className="flex items-center gap-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-1.5 rounded-xl font-bold transition"
              >
                <Edit3 className="w-3.5 h-3.5 text-emerald-400" /> Edit Details
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs bg-slate-950 p-3 rounded-2xl border border-slate-800">
              <div><span className="text-slate-500">City:</span> <span className="font-semibold text-slate-200">{historyModalLead["City"] || "—"}</span></div>
              <div><span className="text-slate-500">Budget:</span> <span className="font-semibold text-emerald-400">₹{historyModalLead["सर आपका बजट कितना है?"] || "—"}</span></div>
              <div className="col-span-2 mt-1"><span className="text-slate-500">Requirement:</span> <span className="font-medium text-slate-300">{historyModalLead["आपको कौन कौनसे chemical चाहिए?"] || "—"}</span></div>
              <div className="col-span-2 mt-1"><span className="text-slate-500">Current Status:</span> <span className="font-bold text-amber-400">{historyModalLead["Call_Status"] || "New"} ({historyModalLead["Current_Stage"] || "Day 1"})</span></div>
            </div>

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

                {!FOLLOWUP_FLOW.some(f => historyModalLead[f.noteCol]) && (
                  <div className="p-6 text-center text-xs text-slate-500 bg-slate-950 rounded-xl border border-slate-800">
                    Abhi tak is customer ka koi previous cadence remark record nahi hua hai.
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

      {/* ⏰ UPDATE CALL MODAL (POWER DIALER) WITH PAST REMARKS + OBJECTIONS + RATES ASSISTANT */}
      {activeLeadModal && (() => {
        const customerPastRemarks = getLeadRemarksList(activeLeadModal);
        return (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-5xl w-full p-6 relative shadow-2xl max-h-[92vh] overflow-y-auto">
              <button onClick={() => setActiveLeadModal(null)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* LEFT COLUMN: CALL OUTCOME LOGGING */}
                <div className="lg:col-span-6 space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                        {autoDialerActive ? "⚡ Power Auto-Dialer Session" : "Call Logging"}
                      </span>
                      <h3 className="text-xl font-black text-white">{activeLeadModal["Name"]}</h3>
                      <p className="text-xs text-slate-400 font-mono mt-0.5">
                        {activeLeadModal["Number"] || activeLeadModal["Contact Number"]} • {activeLeadModal["City"] || "India"}
                      </p>
                    </div>
                    <div className="flex gap-1.5">
                      <a
                        href={`tel:${activeLeadModal["Number"] || activeLeadModal["Contact Number"]}`}
                        className="px-3 py-2 rounded-xl bg-emerald-500 text-slate-950 font-black text-xs flex items-center gap-1"
                      >
                        <Phone className="w-3.5 h-3.5" /> Dial
                      </a>
                      <button
                        type="button"
                        onClick={() => handleOpenEditCustomer(activeLeadModal)}
                        className="px-2.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold text-xs border border-amber-500/40 flex items-center gap-1"
                        title="Edit Customer Details"
                      >
                        <Edit3 className="w-3.5 h-3.5" /> Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => openQuotationModal(activeLeadModal)}
                        className="px-3 py-2 rounded-xl bg-teal-950 hover:bg-teal-900 text-teal-300 font-bold text-xs border border-teal-700 flex items-center gap-1"
                      >
                        Quote
                      </button>
                      <button
                        type="button"
                        onClick={() => setWaTemplateModalLead(activeLeadModal)}
                        className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 font-bold text-xs border border-slate-700 flex items-center gap-1"
                      >
                        <MessageSquare className="w-3.5 h-3.5" /> Templates
                      </button>
                    </div>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 text-xs flex flex-wrap justify-between gap-2">
                    <div><span className="text-slate-500">Requirement:</span> <span className="text-emerald-400 font-bold">{activeLeadModal["आपको कौन कौनसे chemical चाहिए?"] || "—"}</span></div>
                    <div><span className="text-slate-500">Budget:</span> <span className="text-amber-400 font-bold">₹{activeLeadModal["सर आपका बजट कितना है?"] || "—"}</span></div>
                  </div>

                  {/* PRIORITY SELECTOR */}
                  <div>
                    <label className="text-xs font-semibold text-slate-400 block mb-1.5">Lead Priority Tag</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: "HOT", label: "🔥 HOT (High Intent)", activeCls: "bg-rose-500/20 border-rose-500 text-rose-300" },
                        { id: "WARM", label: "🟡 WARM (Follow-up)", activeCls: "bg-amber-500/20 border-amber-500 text-amber-300" },
                        { id: "COLD", label: "🔵 COLD (Low Priority)", activeCls: "bg-blue-500/20 border-blue-500 text-blue-300" },
                      ].map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => setLeadPriorityInput(p.id)}
                          className={`py-2 px-2.5 rounded-xl border text-xs font-bold transition ${
                            leadPriorityInput === p.id
                              ? p.activeCls
                              : "bg-slate-950 border-slate-800 text-slate-400"
                          }`}
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-400 block mb-1">Call Outcome / Status *</label>
                    <select
                      value={callStatusInput}
                      onChange={(e) => setCallStatusInput(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 font-medium"
                    >
                      <option value="Interested">Connected - Interested (Cadence Flow)</option>
                      <option value="Planning to Visit Office">🏢 Planning to Visit Office</option>
                      <option value="Same Day Follow-up">Connected - Same Day Follow-up (Keep Current Stage)</option>
                      <option value="Busy / Call Tomorrow">Connected - Busy / Call Tomorrow</option>
                      <option value="Ringing / Not Picked">Ringing / Phone Nahi Uthaya</option>
                      <option value="Order Confirmed">🎉 Order Confirmed (Booking)</option>
                      <option value="Not Interested">Not Interested / Closed</option>
                    </select>
                  </div>

                  {callStatusInput === "Planning to Visit Office" && (
                    <div className="p-3.5 bg-indigo-950/40 border border-indigo-500/40 rounded-2xl space-y-3">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-300">
                        <Building2 className="w-4 h-4 text-indigo-400" />
                        <span>Office Visit Date & Reminder Time</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <span className="text-[10px] font-semibold text-slate-300 block mb-1">Visit Date *</span>
                          <input
                            type="date"
                            required
                            value={visitDateInput}
                            onChange={(e) => setVisitDateInput(e.target.value)}
                            className="w-full bg-slate-950 border border-indigo-500/40 rounded-xl p-2 text-xs text-white"
                          />
                        </div>
                        <div>
                          <span className="text-[10px] font-semibold text-slate-300 block mb-1">Reminder Time</span>
                          <input
                            type="time"
                            value={visitTimeInput}
                            onChange={(e) => setVisitTimeInput(e.target.value)}
                            className="w-full bg-slate-950 border border-indigo-500/40 rounded-xl p-2 text-xs text-indigo-300 font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {callStatusInput !== "Order Confirmed" && callStatusInput !== "Not Interested" && callStatusInput !== "Planning to Visit Office" && (
                    <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-2.5">
                      <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-300">
                        <input
                          type="checkbox"
                          checked={customDateTimeEnabled}
                          onChange={(e) => setCustomDateTimeEnabled(e.target.checked)}
                          className="w-4 h-4 rounded text-emerald-500 bg-slate-900 border-slate-700"
                        />
                        <span>Schedule Custom Next Call Date & Time</span>
                      </label>

                      {customDateTimeEnabled && (
                        <div className="grid grid-cols-2 gap-2 pt-1">
                          <div>
                            <span className="text-[10px] font-semibold text-slate-400 block mb-1">Next Date *</span>
                            <input
                              type="date"
                              required
                              value={customDateInput}
                              onChange={(e) => setCustomDateInput(e.target.value)}
                              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-xs text-white"
                            />
                          </div>
                          <div>
                            <span className="text-[10px] font-semibold text-slate-400 block mb-1">Exact Time (Popup Alert)</span>
                            <input
                              type="time"
                              value={customTimeInput}
                              onChange={(e) => setCustomTimeInput(e.target.value)}
                              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-xs text-emerald-400 font-mono"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {callStatusInput === "Order Confirmed" && (
                    <div className="p-3.5 bg-emerald-950/40 border border-emerald-500/40 rounded-2xl space-y-3">
                      <div>
                        <label className="text-[11px] font-bold text-emerald-400 block mb-1">Order Amount (₹) *</label>
                        <input
                          type="number"
                          required
                          placeholder="e.g. 8500"
                          value={orderAmountInput}
                          onChange={(e) => setOrderAmountInput(e.target.value)}
                          className="w-full bg-slate-950 border border-emerald-500/60 rounded-xl px-3 py-2 text-sm text-emerald-300 font-black"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-300 block mb-1">Ordered Products / Quantity (Kg)</label>
                        <input
                          type="text"
                          placeholder="e.g. 50kg White Phenyl + 25kg Handwash"
                          value={orderDetailsInput}
                          onChange={(e) => setOrderDetailsInput(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="text-xs font-semibold text-slate-400 block mb-1">Baat-cheet ka Naya Remark / Notes</label>
                    <textarea
                      rows={3}
                      value={callNoteInput}
                      onChange={(e) => setCallNoteInput(e.target.value)}
                      placeholder="Customer ne kya kaha? Sample kit bhejna hai ya rate discuss hua..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <button
                    type="button"
                    disabled={saving}
                    onClick={handleSaveFollowUp}
                    className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-3 rounded-xl transition shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                  >
                    {saving
                      ? "Saving to Sheet..."
                      : autoDialerActive
                      ? "Save & Load Next Call ⚡"
                      : "Save Call & Schedule"}
                  </button>
                </div>

                {/* RIGHT COLUMN: LIVE PITCH ASSISTANT (PAST REMARKS + OBJECTIONS + RATES) */}
                <div className="lg:col-span-6 bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col max-h-[78vh]">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800">
                    <span className="text-xs font-black uppercase text-amber-400">Live Pitch Assistant</span>
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        type="button"
                        onClick={() => setModalHelperTab("history")}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition ${
                          modalHelperTab === "history"
                            ? "bg-emerald-500 text-slate-950"
                            : "bg-slate-900 text-slate-300 border border-slate-800 hover:text-white"
                        }`}
                      >
                        <History className="w-3 h-3" />
                        <span>Remarks ({customerPastRemarks.length})</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setModalHelperTab("objections")}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition ${
                          modalHelperTab === "objections"
                            ? "bg-purple-500 text-white"
                            : "bg-slate-900 text-slate-300 border border-slate-800 hover:text-white"
                        }`}
                      >
                        Objections (12)
                      </button>
                      <button
                        type="button"
                        onClick={() => setModalHelperTab("catalog")}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition ${
                          modalHelperTab === "catalog"
                            ? "bg-indigo-500 text-white"
                            : "bg-slate-900 text-slate-300 border border-slate-800 hover:text-white"
                        }`}
                      >
                        Rates & Ratios
                      </button>
                    </div>
                  </div>

                  <div className="overflow-y-auto flex-1 space-y-2.5 pt-3 pr-1">
                    {modalHelperTab === "history" ? (
                      <div className="space-y-3">
                        <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 text-xs space-y-1.5">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                              Customer Profile & Stage
                            </span>
                            <span className="text-[10px] font-mono bg-blue-500/15 text-blue-400 px-2 py-0.5 rounded font-bold">
                              {activeLeadModal["Current_Stage"] || "Day 1"} • {activeLeadModal["Call_Status"] || "New"}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-1 text-[11px] text-slate-300 pt-1">
                            <div><span className="text-slate-500">City:</span> {activeLeadModal["City"] || "—"}</div>
                            <div><span className="text-slate-500">Budget:</span> ₹{activeLeadModal["सर आपका बजट कितना है?"] || "—"}</div>
                            <div className="col-span-2">
                              <span className="text-slate-500">Chemicals:</span> {activeLeadModal["आपको कौन कौनसे chemical चाहिए?"] || "—"}
                            </div>
                          </div>
                        </div>

                        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 pt-1">
                          <CalendarCheck className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Puraani Baat-Cheet (Previous Remarks)</span>
                        </div>

                        {customerPastRemarks.length > 0 ? (
                          customerPastRemarks.map((rem, idx) => (
                            <div key={idx} className="p-3 bg-slate-900 rounded-xl border border-emerald-500/20 space-y-1">
                              <div className="flex justify-between items-center">
                                <span className="text-[10px] font-black uppercase bg-emerald-500/15 text-emerald-400 px-2 py-0.5 rounded font-mono">
                                  {rem.stage}
                                </span>
                              </div>
                              <p className="text-xs text-slate-200 whitespace-pre-wrap leading-relaxed pt-1">
                                {rem.note}
                              </p>
                            </div>
                          ))
                        ) : (
                          <div className="p-6 text-center bg-slate-900/60 rounded-2xl border border-slate-800 space-y-1.5">
                            <p className="text-xs font-bold text-slate-300">Fresh Lead — Koi Purana Remark Nahi Hai</p>
                            <p className="text-[11px] text-slate-500">
                              Is customer se abhi tak koi call log nahi hui hai. Upar "Objections (12)" ya "Rates & Ratios" dekh kar baat shuru karein.
                            </p>
                          </div>
                        )}
                      </div>
                    ) : modalHelperTab === "catalog" ? (
                      PRODUCT_CATALOG.map((p, idx) => (
                        <div key={idx} className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-white">{p.name}</span>
                            <span className="text-[10px] text-emerald-400 font-mono">{p.ratio}</span>
                          </div>
                          <div className="text-[11px] text-amber-400 font-mono font-bold">{p.slabs}</div>
                          <div className="text-[10px] text-slate-400">{p.instructions}</div>
                        </div>
                      ))
                    ) : (
                      OBJECTION_SCRIPTS.map((obj) => (
                        <div key={obj.id} className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                          <div className="text-xs font-bold text-purple-300">{obj.title}</div>
                          <p className="text-[11px] text-slate-200 leading-relaxed">"{obj.reply}"</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ➕ IN-APP NEW CUSTOMER CREATION MODAL (WITH DUPLICATE DETECTION & BLOCK) */}
      {newCustomerModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 relative shadow-2xl space-y-4">
            <button onClick={() => setNewCustomerModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                <Contact className="w-3.5 h-3.5" /> Direct Entry & Google Contacts
              </span>
              <h3 className="text-xl font-black text-white mt-0.5">Naya Customer Jodein</h3>
              <p className="text-xs text-slate-400 mt-0.5">Google Contacts me automatically <b>'CX' suffix</b> ke sath save hoga.</p>
            </div>

            <form onSubmit={handleAddNewCustomer} className="space-y-3">
              {loggedInCaller.role === "admin" && (
                <div>
                  <label className="text-xs font-semibold text-amber-400 block mb-1">Assign Lead to Caller *</label>
                  <select
                    value={newLeadForm.targetCaller}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, targetCaller: e.target.value })}
                    className="w-full bg-slate-950 border border-amber-500/40 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="piyush">Piyush (SIM 1 Sheet)</option>
                    <option value="garv">Garv (SIM 2 Sheet)</option>
                  </select>
                </div>
              )}

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

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Mobile Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 9876543210"
                    value={newLeadForm.number}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, number: e.target.value })}
                    className={`w-full bg-slate-950 border rounded-xl px-3 py-2 text-sm font-mono focus:outline-none ${
                      liveDuplicateLead
                        ? "border-rose-500 text-rose-400"
                        : "border-slate-800 text-emerald-400 focus:border-emerald-500"
                    }`}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Priority</label>
                  <select
                    value={newLeadForm.priority}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, priority: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="HOT">🔥 HOT</option>
                    <option value="WARM">🟡 WARM</option>
                    <option value="COLD">🔵 COLD</option>
                  </select>
                </div>
              </div>

              {liveDuplicateLead && (
                <div className="p-3 bg-rose-950/60 border border-rose-500/50 rounded-2xl text-xs space-y-1 animate-fade-in">
                  <div className="font-black text-rose-400 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Already Exists! Ye Lead Pehle Se Save Hai</span>
                  </div>
                  <div className="text-slate-200">
                    <b>Name:</b> {liveDuplicateLead["Name"] || "—"} ({liveDuplicateLead._callerName || loggedInCaller.name})
                  </div>
                  <div className="text-slate-300">
                    <b>Status:</b> {liveDuplicateLead["Call_Status"] || "New"} ({liveDuplicateLead["Current_Stage"] || "Day 1"})
                  </div>
                </div>
              )}

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
                    placeholder="e.g. 15000"
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
                  placeholder="Inquiry notes..."
                  value={newLeadForm.note}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, note: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <button
                type="submit"
                disabled={saving || Boolean(liveDuplicateLead)}
                className={`w-full font-bold py-3 rounded-xl transition shadow-lg ${
                  liveDuplicateLead
                    ? "bg-rose-500/20 border border-rose-500/40 text-rose-300 cursor-not-allowed"
                    : "bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20"
                }`}
              >
                {liveDuplicateLead
                  ? "⚠️ Duplicate Number — Save Blocked"
                  : saving
                  ? "Saving & Syncing to Contacts..."
                  : "Customer Add Karein"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ✏️ IN-APP DIRECT EDIT CUSTOMER INFO MODAL */}
      {editCustomerModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-[60] animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 relative shadow-2xl space-y-4">
            <button onClick={() => setEditCustomerModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">Edit Mode</span>
              <h3 className="text-xl font-black text-white">Customer Details Edit Karein</h3>
              <p className="text-xs text-slate-400 mt-0.5">Updated details sheet aur Google Contacts dono me sync ho jayegi.</p>
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
                {saving ? "Updating Sheet & Contacts..." : "Save Updated Details"}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

/*************************************************
 * Task Management System
 * Version : 2.0
 * Developer : Syahrul Syaputra
 *************************************************/

//==================================================
// APPLICATION CONFIG
//==================================================

const CONFIG = {
  APP_NAME: "Task Management System",

  VERSION: "2.0",

  DEVELOPER: "Syahrul Syaputra",

  SHEET_NAME: "Task",

  STATUS: ["Done", "In Progress", "To Do"],

  PROJECT: [
    "AIRPORT",
    "CFD ATPM R2 - HONDA",
    "CFD ATPM R4 - HYUNDAI",
    "CFD ATPM R4 - MAHINDRA",
    "CFD ATPM R4 - MPM",
    "CFD ATPM R4 - TAM",
    "CFD BPKB",
    "CFD STNK",
    "CFD REVITALISASI ERI",
    "HIKVISION",
    "KIOSK",
    "LMS BAC SENTUL",
    "LMS BAC YOGYA",
    "MDM",
    "M'KOSTEL",
    "OFFICE",
    "SMART CABINET",
    "UJI KESELAMATAN",
  ],

  TASK: [
    "Daily Rekap Billing",
    "Daily QC RFID Tag",
    "Daily Scan Reject",
    "Daily Scan Retag",
    "Registrasi Linen",
    "Hardware Checklist",
    "Daily Generate Blanko CFD TAM",
    "Daily Rekap BPKB v1 dan v3",
    "Daily Rekap STNK v1",
    "Lainnya",
  ],

  USER: [
    "Angga Ramadhani Putra",
    "Eriansyah",
    "Febrianta Maulana Denansyah Pratama",
    "Florentinus Okky Setyo Nugroho",
    "Hagi Nirwansyah Putra",
    "Muhamad Fadilah",
    "Muhamad Sahrul",
    "Rizqy Fadhlurrahman Akbar, S.M",
    "Saddam",
    "Septa Mulya",
    "Syahrul Syaputra",
    "Sutrisno",
    "Wildan Firmansyah",
  ],
};

//==================================================
// WEB APP
//==================================================

function doGet() {
  return HtmlService.createTemplateFromFile("Index")
    .evaluate()
    .setTitle(CONFIG.APP_NAME)
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

//==================================================
// INCLUDE HTML
//==================================================

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

//==================================================
// ROUTER
//==================================================

function getDashboardPage() {
  return include("Dashboard");
}

function getInputTaskPage() {
  return include("InputTask");
}

function getReportPage() {
  return include("Report");
}

//==================================================
// MASTER CONFIG
//==================================================

function getConfig() {
  return {
    status: CONFIG.STATUS,

    project: CONFIG.PROJECT,

    task: CONFIG.TASK,

    user: CONFIG.USER,
  };
}

//==================================================
// APPLICATION INFO
//==================================================

function getAppInfo() {
  return {
    appName: CONFIG.APP_NAME,

    version: CONFIG.VERSION,

    developer: CONFIG.DEVELOPER,

    year: new Date().getFullYear(),
  };
}

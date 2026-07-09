/*************************************************
 * DATABASE
 * Version : 2.0
 * Developer : Syahrul Syaputra
 *************************************************/

const SS_ID = "1Xsi8u4KpklHcduLf7xOt7KByLMMMxSIlyDPB7ksQq3I";

//==================================================
// OPEN SPREADSHEET
//==================================================

function getSheet() {

  return SpreadsheetApp
    .openById(SS_ID)
    .getSheetByName(CONFIG.SHEET_NAME);

}

//==================================================
// GENERATE TASK ID
//==================================================

function generateID() {

  const sheet = getSheet();

  const lastRow = sheet.getLastRow();

  if (lastRow <= 1) {

    return "TASK-000001";

  }

  const lastID = sheet.getRange(lastRow, 1).getValue();

  const number = Number(lastID.replace("TASK-", "")) + 1;

  return "TASK-" + Utilities.formatString("%06d", number);

}

//==================================================
// SAVE TASK
//==================================================

function saveTask(data) {

  const sheet = getSheet();

  let taskName = data.task;

  if (data.task === "Lainnya") {

    taskName = data.customTask;

  }

  sheet.appendRow([

    generateID(),

    new Date(data.tanggal),

    data.nama,

    data.project,

    taskName,

    data.status,

    data.hasil,

    new Date()

  ]);

  return {

    success: true,

    message: "Task berhasil disimpan."

  };

}

//==================================================
// UPDATE TASK
//==================================================

function updateTask(id, data) {

  const sheet = getSheet();

  const values = sheet.getDataRange().getValues();

  for (let i = 1; i < values.length; i++) {

    if (values[i][0] == id) {

      let taskName = data.task;

      if (data.task == "Lainnya") {

        taskName = data.customTask;

      }

      sheet.getRange(i + 1, 2, 1, 6).setValues([[

        new Date(data.tanggal),

        data.nama,

        data.project,

        taskName,

        data.status,

        data.hasil

      ]]);

      return true;

    }

  }

  return false;

}

//==================================================
// DELETE TASK
//==================================================

function deleteTask(id) {

  const sheet = getSheet();

  const values = sheet.getDataRange().getValues();

  for (let i = 1; i < values.length; i++) {

    if (values[i][0] == id) {

      sheet.deleteRow(i + 1);

      return true;

    }

  }

  return false;

}

//==================================================
// GET ALL DATA
//==================================================

function getAllData() {

  const sheet = getSheet();

  const lastRow = sheet.getLastRow();

  if (lastRow <= 1) {

    return [];

  }

  const values = sheet.getRange(2, 1, lastRow - 1, 8).getValues();

  return values.map(function (row) {

    return {

      id: row[0],

      tanggal: new Date(row[1]),

      nama: row[2],

      project: row[3],

      task: row[4],

      status: row[5],

      hasil: row[6],

      timestamp: new Date(row[7])

    };

  });

}

//==================================================
// DASHBOARD
//==================================================

function getDashboard() {

  const data = getAllData();

  const now = new Date();

  //---------------------------------------
  // TODAY = YESTERDAY
  //---------------------------------------

  const yesterday = new Date(now);

  yesterday.setDate(now.getDate() - 1);

  yesterday.setHours(0, 0, 0, 0);

  //---------------------------------------
  // WEEK
  //---------------------------------------

  const monday = new Date(now);

  const day = monday.getDay() === 0 ? 7 : monday.getDay();

  monday.setDate(now.getDate() - day + 1);

  monday.setHours(0, 0, 0, 0);

  const saturday = new Date(monday);

  saturday.setDate(monday.getDate() + 5);

  saturday.setHours(23, 59, 59, 999);

  //---------------------------------------
  // MONTH
  //---------------------------------------

  const firstMonth = new Date(

    now.getFullYear(),

    now.getMonth(),

    1

  );

  firstMonth.setHours(0, 0, 0, 0);

  const lastMonth = new Date(

    now.getFullYear(),

    now.getMonth() + 1,

    0

  );

  lastMonth.setHours(23, 59, 59, 999);

  //---------------------------------------

  let today = 0;

  let week = 0;

  let month = 0;

  data.forEach(function (item) {

    const d = new Date(item.tanggal);

    d.setHours(0, 0, 0, 0);

    if (d.getTime() === yesterday.getTime()) {

      today++;

    }

    if (d >= monday && d <= saturday) {

      week++;

    }

    if (d >= firstMonth && d <= lastMonth) {

      month++;

    }

  });

  //---------------------------------------
  // RECENT
  //---------------------------------------

  const recent = data

    .sort(function (a, b) {

      return b.timestamp - a.timestamp;

    })

    .slice(0, 10)

    .map(function (item) {

      return {

        tanggal: Utilities.formatDate(

          item.tanggal,

          Session.getScriptTimeZone(),

          "dd/MM/yyyy"

        ),

        nama: item.nama,

        project: item.project,

        task: item.task,

        status: item.status

      };

    });

  //---------------------------------------

  return {

    today: today,

    week: week,

    month: month,

    recent: recent

  };

}

//==================================================
// REPORT
//==================================================

function getReport(type) {

  const data = getAllData();

  const now = new Date();

  let start;
  let end;

  //---------------------------------------
  // TODAY = YESTERDAY
  //---------------------------------------

  if (type === "today") {

    start = new Date(now);

    start.setDate(now.getDate() - 1);

    end = new Date(start);

  }

  //---------------------------------------
  // WEEKLY (MONDAY - SATURDAY)
  //---------------------------------------

  if (type === "weekly") {

    start = new Date(now);

    const day = start.getDay() === 0 ? 7 : start.getDay();

    start.setDate(now.getDate() - day + 1);

    end = new Date(start);

    end.setDate(start.getDate() + 5);

  }

  //---------------------------------------
  // MONTHLY
  //---------------------------------------

  if (type === "monthly") {

    start = new Date(

      now.getFullYear(),

      now.getMonth(),

      1

    );

    end = new Date(

      now.getFullYear(),

      now.getMonth() + 1,

      0

    );

  }

  start.setHours(0, 0, 0, 0);

  end.setHours(23, 59, 59, 999);

  //---------------------------------------

  const result = data.filter(function(item){

    const d = new Date(item.tanggal);

    d.setHours(0,0,0,0);

    return d >= start && d <= end;

  });

  //---------------------------------------
  // GROUP BY PROJECT
  //---------------------------------------

  const group = {};

  result.forEach(function(item){

    if(!group[item.project]){

      group[item.project] = [];

    }

    group[item.project].push({

      tanggal: Utilities.formatDate(

        item.tanggal,

        Session.getScriptTimeZone(),

        "dd/MM/yyyy"

      ),

      task: item.task,

      status: item.status,

      hasil: item.hasil

    });

  });

  return group;

}

//==================================================
// MASTER DATA
//==================================================

function getMasterData(){

  return {

    user: CONFIG.USER,

    project: CONFIG.PROJECT,

    task: CONFIG.TASK,

    status: CONFIG.STATUS

  };

}

//==================================================
// UTILITY
//==================================================

function formatDate(date){

  return Utilities.formatDate(

    new Date(date),

    Session.getScriptTimeZone(),

    "dd/MM/yyyy"

  );

}

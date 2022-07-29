// Add Library
// 1uBj9pQlzO2m_06HcdeAyMMd1MXj6__3Os59p4YYdFau1K2DUOR_eAQQx

function doGet(e) {
  initialSetup()
}

function initialSetup() {
  /* Ask for API key */
  let apiKey = GetApiKey();
  /* Create Spreadsheets with Format */
  getFlightplan(apiKey);
  var sheet = newSheet("Welcome 👋");
  Logger.log("If you have any questions please [join our Discord at https://discord.gg/ufostart](https://discord.gg/ufostart)");
}

function GetApiKey() {
  // Display a dialog box with a message, input field, and an "OK" button. The user can also
  // close the dialog by clicking the close button in its title bar.
  const ui = SpreadsheetApp.getUi();
  var response = ui.prompt('Just tell me your API key?');

  // Process the user's response.
  if (response.getSelectedButton() == ui.Button.OK) {
    Logger.log('The user\'s key is %s.', response.getResponseText());
    return response.getResponseText();
  } else {
    Logger.log('The user clicked the close button in the dialog\'s title bar.');
  }
}

function getFlightplan(apiKey) {
  /* CALL USER DATA FOR FLIGHTPLAN API */
  /* https://handbook.ufostart.com/reference/get_users-current */
  var options = {
    "async": true,
    "crossDomain": true,
    "method" : "GET",
    "mode": "cors",
    "headers" : {
      "origin": "*",
      "X-API-KEY": apiKey,
      "cache-control": "no-cache"
    }
  };
  var response = UrlFetchApp.fetch('https://api.ufostart.com/users/current',options);
  var json = response.getContentText(); // get the response content as text
  var uJSON = JSON.parse(json); // parse text into json

  let SpaceshipID = uJSON.spaceship_id;
  Logger.log(`Hi 👋 ${uJSON.full_name}`);
  Logger.log(`Requesting UFOstart API with your key: ${apiKey}.`);
  Logger.log(`...`);

  /* GET ACTIVE GOAL FOR SPACESHIP */
  /* https://handbook.ufostart.com/reference/get_spaceships-spaceshipid-goals-1 */
  var gReq = UrlFetchApp.fetch('https://api.ufostart.com/spaceships/'+SpaceshipID+'/goals?limit=5&offset=0', {
      "method": 'GET',
      "mode": "cors",
      "headers": {
        "origin": "*",
        'X-API-KEY': apiKey
      }
  });
  var gResponse = gReq.getContentText(); // get the response content as text
  var gJSON = JSON.parse(gResponse); // parse text into json
  var GoalsID = gJSON.records[0].id;
  Logger.log("Configuration " + SpaceshipID + " / " + GoalsID);

  /* CALL FLIGHTPLAN API */
  /* https://handbook.ufostart.com/reference/get-flightplan-1 */
  Logger.log("Calling Flightplan API for Spaceship " + SpaceshipID + " 🚀");
  let fURL = 'https://api.ufostart.com/spaceships/'+SpaceshipID+'/goals/'+GoalsID+'/results?limit=200&offset=0';
  let fReq = UrlFetchApp.fetch(fURL, {
      "method": 'GET',
      "mode": "cors",
      "headers": {
          "origin": "*",
          'X-API-KEY': apiKey
      }
  });
  var fResponse = fReq.getContentText(); // get the response content as text
  var fJSON = JSON.parse(fResponse); // parse text into json

  /* WRITE DATA INTO SPREADSHEET */
  Logger.log("Writing all results into the table 📝");
  ['START','GROWTH/SCALE','PROFESSIONALIZE'].forEach(function(phasePhase) {
      var phaseSheet = newSheet(phasePhase);
      for (var i = 0; i < fJSON.records.phase[phasePhase].topics.length; i++) {
          for (var a = 0; a < fJSON.records.phase[phasePhase].topics[i].actions.length; a++) {
              var status = (fJSON.records.phase[phasePhase].topics[i].actions[a].status == 'done') ? true : false;
              let recordId = phaseSheet.appendRow([
                  fJSON.records.phase[phasePhase].topics[i].actions[a].name,
                  fJSON.records.phase[phasePhase].topics[i].actions[a].description,
                  fJSON.records.phase[phasePhase].topics[i].actions[a].priority,
                  status,
                  phasePhase
              ])
          }
      }
  })
  Logger.log("Done 🎉");

  Logger.log("⚠️ _Notice: Have in mind that the results are just saved temporary in this table! If you like to keep the results for later, please copy this table in your own account or just copy and paste the data._");
}

function newSheet(name) {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet(),
      sheet = spreadsheet.getSheetByName(name);
  if (sheet != null) {
    spreadsheet.deleteSheet(sheet);
  }
  spreadsheet.insertSheet(name, spreadsheet.getSheets().length);

  var as = SpreadsheetApp.getActiveSpreadsheet(); //get active spreadsheet
  var sheet = as.getSheetByName(name); //get sheet by name from active SpreadsheetApp

  return sheet;
}
# UFOstart flightplan for Google Sheets
This guide explains how to receive your flightplan from the UFOstart API into Google Sheets.

## 1 Sign up and get access
1. [Sign up](https://form.jotform.com/221392336964057) and submit the requested information on your project to create your flightplan.
2. Once your flightplan is ready, you will receive an email with an API key. This API key gives you access to your flightplan.

## 2 Receive your flightplan
1. Log in to your Google Sheets account and create a new sheet.
2. In your newly created Sheet open `Apps Script` (via `Extensions` -> `Apps Script`).
3. Copy the source code from the `flighplan.js` into your file `.gs` in `Apps Script` and save.
4. Next to the `Debug` button select the function `initialSetup`.
5. Hit the `run` button and give the script permission to edit your spreadsheet. Then switch back to your Google sheet.
6. Wait until a popup shows up in your sheet. It will ask your for your API key. Copy and paste the API key from your email and submit the popup.
7. Your flightplan will be requested and shows up in your sheet after a few moments.

## Join the UFOstart community
UFOstart is a community of marketing experts and software engineers aiming to revolutionize the marketing space. You can join the UFOstart community on [Discord]().

## Bugs and issues
If you experience any bugs and issues, please create an issue or report these in the [UFOstart Discord]()
const { google } = require('googleapis');

const rootPrefix = '..',
  coreConstants = require(rootPrefix + '/config/coreConstants');

const credentials = coreConstants.GOOGLE_AUTH_CREDS;

const auth = new google.auth.GoogleAuth({
  credentials: credentials,

  scopes: ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/drive'] // SCOPES
});

const sheets = google.sheets({ version: 'v4', auth });

class CreateSpreadSheet {
  constructor() {
    const oThis = this;
  }

  /**
   * Create spreadsheet with title and headers
   *
   * @param title
   * @param headers
   * @returns {Promise<*>}
   */
  async createSpreadSheet(title, headers) {
    const sheets = google.sheets({ version: 'v4', auth });
    const resource = {
      properties: {
        title
      },
      sheets: [
        {
          properties: {
            title: title
          },
          data: [
            {
              startRow: 0,
              startColumn: 0,
              rowData: {
                values: headers.map((header) => ({
                  userEnteredValue: { stringValue: header }
                }))
              }
            }
          ]
        }
      ]
    };

    try {
      const response = await sheets.spreadsheets.create({ resource });
      console.log(`* Spreadsheet created with ID: ${response.data.spreadsheetId}`);
      console.log(`* Spreadsheet created with Title: ${response.data.properties.title}`);

      const resp = {
        id: response.data.spreadsheetId,
        title: response.data.properties.title
      };

      return resp;
    } catch (error) {
      console.error(`* Error creating spreadsheet: ${error}`);
    }
  }

  /**
   *  Get spreadsheet url
   *
   * @param spreadsheetId
   * @returns {Promise<string>}
   */
  async getSpreadsheetUrl(spreadsheetId) {
    const sheets = google.sheets({ version: 'v4', auth });
    const request = {
      spreadsheetId
    };
    try {
      const response = await sheets.spreadsheets.get(request);
      const spreadsheetUrl = response.data.spreadsheetUrl;
      console.log(`* Spreadsheet URL: ${spreadsheetUrl}`);

      return spreadsheetUrl;
    } catch (error) {
      console.error(`* Error getting spreadsheet URL: ${error}`);
    }
  }

  /**
   * Grant access to spreadsheet
   *
   * @param spreadsheetId
   * @returns {Promise<void>}
   */
  async grantAccessToSpreadsheet(spreadsheetId) {
    const drive = google.drive({ version: 'v3', auth });
    const writeRequest = {
      fileId: spreadsheetId,
      supportsAllDrives: true,
      requestBody: {
        role: 'writer',
        type: 'user',
        emailAddress: credentials.client_email
      }
    };

    const viewRequest = {
      fileId: spreadsheetId,
      supportsAllDrives: true,
      requestBody: {
        role: 'reader', // Grant view access to anyone
        type: 'anyone'
      }
    };
    try {
      await drive.permissions.create(writeRequest);
      await drive.permissions.create(viewRequest);

      console.log(`* Access granted to spreadsheet with ID: ${spreadsheetId}`);
    } catch (error) {
      console.error(`* Error granting access to spreadsheet: ${error}`);
    }
  }

  /**
   * Create spread sheet, Give access permission and return url
   *
   * @param spreadsheetTitle
   * @param headers
   * @returns {Promise<{spreadsheetUrl: string}>}
   */
  async createSpreadSheetAndGetUrl(spreadsheetTitle, headers) {
    const oThis = this;

    const resp = await oThis.createSpreadSheet(spreadsheetTitle, headers);
    const spreadsheetId = resp.id;
    const spreadsheetUrl = await oThis.getSpreadsheetUrl(spreadsheetId);
    await oThis.grantAccessToSpreadsheet(spreadsheetId);

    console.log(`* Spreadsheet created with ID: ${spreadsheetId}`);
    console.log(`* Spreadsheet created with URL: ${spreadsheetUrl}`);

    return {
      spreadsheetUrl: spreadsheetUrl,
      spreadsheetId: spreadsheetId,
      spreadsheetTitle: resp.title
    };
  }

  /**
   * Append rows into spreadsheet
   *
   * @param spreadsheetId
   * @param sheetName
   * @param valuesArray <array<array<strings>>>
   * @returns {Promise<void>}
   */
  async appendRows(spreadsheetId, sheetName, valuesArray) {
    const range = sheetName; // specify the sheet name only, not a range

    const request = {
      auth: auth,
      spreadsheetId: spreadsheetId,
      range: range,
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS', // insert values in a new row each time
      resource: {
        values: valuesArray
      }
    };

    await sheets.spreadsheets.values.append(request, (err, res) => {
      if (err) {
        console.error('* Error while appending to sheet:', err);
      }
    });
  }
}

module.exports = CreateSpreadSheet;

// Usage
// a = require('./lib/spreadSheet');
// new a().createSpreadSheetAndGetUrl('Master', ['API', 'Request', 'Response Status', 'CSRF/Major', 'Vector']);
// new a().appendRows('1LRvZKwoQTkqsxhgAquk9ilM4ywWvYpNMwApDCUIbbTo', 'abc', [['1', '2', '3'], ['4', '5', '6']])

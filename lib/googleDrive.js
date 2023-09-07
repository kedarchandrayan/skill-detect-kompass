const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { google } = require('googleapis');

const rootPrefix = '..',
  coreConstants = require(rootPrefix + '/config/coreConstants');

const auth = new google.auth.GoogleAuth({
  credentials: coreConstants.GOOGLE_AUTH_CREDS,

  scopes: ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/drive'] // SCOPES
});

const drive = google.drive({ version: 'v3', auth });

async function extractFolderIdFromUrl(googleDriveUrl) {
  const match = googleDriveUrl.match(/\/folders\/([^/]+)/);
  if (match && match[1]) {
    return match[1];
  }
  return null; // Folder ID not found in the URL
}

async function getFilesFromDrive(googleDriveUrl) {
  try {
    const folderId = await extractFolderIdFromUrl(googleDriveUrl);
    console.log('FolderId: ', folderId);
    const res = await drive.files.list({
      q: `'${folderId}' in parents`,
      fields: 'files(id, name)'
    });

    console.log('data files:  ', res.data.files);

    return res.data.files;
  } catch (error) {
    throw new Error(`Error listing files: ${error}`);
  }
}

async function downloadFromGoogleDrive(fileId, downloadFolder) {
  const uuid = uuidv4();
  const downloadFileName = `${uuid}.pdf`;

  const drive = google.drive({ version: 'v3', auth });

  return new Promise(function(onResolve, onReject) {
    drive.files.get({ fileId, alt: 'media' }, { responseType: 'stream' }, (err, { data }) => {
      if (err) {
        console.error('Error downloading file:', err);
        return onReject(err);
      }

      const filePath = path.join(downloadFolder, downloadFileName);

      const writeStream = fs.createWriteStream(filePath);
      data
        .on('end', () => {
          console.log(`Downloaded file to ${filePath}`);
        })
        .on('error', (err) => {
          console.error('Error downloading file:', err);
          return onReject(err);
        })
        .pipe(writeStream);

      writeStream.on('finish', () => {
        onResolve(filePath); // Resolve the promise when the write stream finishes
      });
    });
  });
}

module.exports = { getFilesFromDrive, downloadFromGoogleDrive };

// How to use this file:
// const googleDrive = require('./lib/googleDrive');
// googleDrive.getFilesFromDrive('https://drive.google.com/drive/u/0/folders/1TpMSNMqfjodQmh6Vkp-Hf9k-rYkDcZU4');
//googleDrive.downloadFromGoogleDrive('1155BXIDW4bJUpl9_egOSHMcVsXIFD_El', '/Users/shraddha/git/hackthon23/talent-rover-be')

const fs = require('fs');
const pdf = require('pdf-parse');

function extractTextFromPDF(pdfPath) {
  // Read the PDF file
  const dataBuffer = fs.readFileSync(pdfPath);

  // Parse the PDF data
  return pdf(dataBuffer)
    .then((data) => {
      // Extracted text will be available in the 'text' property of the 'data' object
      return data.text;
    })
    .catch((error) => {
      throw new Error('Error reading PDF: ' + error);
    });
}

module.exports = { extractTextFromPDF };

// How to use this file:
// const pdfParser = require('./lib/pdfParser');
// pdfParser.extractTextFromPDF('3.pdf').then((text) => {
//   console.log(text);
// });

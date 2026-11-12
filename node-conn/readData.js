import fs from 'fs';
import * as xlsx from 'xlsx';

// Read the file as a buffer using Node's native file system
const fileBuffer = fs.readFileSync('./sample_data.xlsx');

// Parse the buffer using the xlsx library
const workbook = xlsx.read(fileBuffer, { type: 'buffer' });

// Target the first sheet
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];

// Convert it to JSON
const parsedData = xlsx.utils.sheet_to_json(sheet);
console.log(parsedData);
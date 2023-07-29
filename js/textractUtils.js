const {TextractClient, AnalyzeDocumentCommand, 
  StartDocumentAnalysisCommand, GetDocumentAnalysisCommand} = require("@aws-sdk/client-textract");
const { PutObjectCommand, DeleteObjectCommand, S3Client } = require("@aws-sdk/client-s3");
const _ = require("lodash");
const fuzzysort = require('fuzzysort');
const { readFileSync, writeFileSync } = require ("fs");


const deleteFile = async (key, s3Client = null) => {
// function to delete a file with the given key name in the `ocr-scanning-storage` bucket
const bucketParams = { Bucket: "ocr-scanned-invoices", Key: key };
 
try {
   const data = await s3Client.send(new DeleteObjectCommand(bucketParams));
   console.log("Success. Object deleted.");
   return data; 
} catch (err) {
   console.log("Error", err);
   return null
}
}

// Async textract analysis
const wait = (msec) => new Promise((resolve, _) => {
// use this function to wait for the try loop
setTimeout(resolve, msec);
});

async function getAsyncAnalysis(key, textractClient) {   

// Initialise params, create command object
const params = {
DocumentLocation: {

 "S3Object":{
       "Bucket":"ocr-scanned-invoices",
       "Name":key
 } 
},
FeatureTypes: ["FORMS", "TABLES"]
};

const startCommand = new StartDocumentAnalysisCommand(params);


// run StartDocumentAnalysis
const startCommandResult = await textractClient.send(startCommand);
const jobid = startCommandResult.JobId; // read the jobid so we can read the results later
// console.log(startCommandResult)

// initialise params and command for GetDocumentAnalysis
const getCommand = new GetDocumentAnalysisCommand( { "JobId": jobid} );

// run loop to check for GetDocumentAnalysis
var finished = false;
var data;

while (!finished) {
   // set timer for the while loop
   await wait(1500);
   data =  await textractClient.send(getCommand);
   if (data.JobStatus !== "IN_PROGRESS") {
       // once finished analysis, break out of the loop'
       finished = true;
   }
}

// check for failure of analysis:
if (data.JobStatus === "FAILED") {
   console.log("Analysis Failed : ( ");
   return (null);
}
return data;
}

// START of Form Parser
const getText = (result, blocksMap) => {
let text = "";

if (_.has(result, "Relationships")) {
result.Relationships.forEach(relationship => {
 if (relationship.Type === "CHILD") {
   relationship.Ids.forEach(childId => {
     const word = blocksMap[childId];
     if (word.BlockType === "WORD") {
       text += `${word.Text} `;
     }
     if (word.BlockType === "SELECTION_ELEMENT") {
       if (word.SelectionStatus === "SELECTED") {
         text += `X `;
       }
     }
   });
 }
});
}

return text.trim();
};

const findValueBlock = (keyBlock, valueMap) => {
let valueBlock;
keyBlock.Relationships.forEach(relationship => {
if (relationship.Type === "VALUE") {
 // eslint-disable-next-line array-callback-return
 relationship.Ids.every(valueId => {
   if (_.has(valueMap, valueId)) {
     valueBlock = valueMap[valueId];
     return false;
   }
 });
}
});

return valueBlock;
};

const getKeyValueRelationship = (keyMap, valueMap, blockMap) => {
const keyValues = {};

const keyMapValues = _.values(keyMap);

keyMapValues.forEach(keyMapValue => {
const valueBlock = findValueBlock(keyMapValue, valueMap);
const key = getText(keyMapValue, blockMap).toLowerCase().replace(/\W*$/, "");
const value = getText(valueBlock, blockMap);
keyValues[key] = value;
});

return keyValues;
};

const getKeyValueMap = blocks => {
const keyMap = {};
const valueMap = {};
const blockMap = {};

let blockId;
blocks.forEach(block => {
blockId = block.Id;
blockMap[blockId] = block;

if (block.BlockType === "KEY_VALUE_SET") {
 if (_.includes(block.EntityTypes, "KEY")) {
   keyMap[blockId] = block;
 } else {
   valueMap[blockId] = block;
 }
}
});

return { keyMap, valueMap, blockMap };
};



const fixFormHeaders = (obj, dict) => {
// autocorrect and match the keys in obj to the values of dict
currentHeaders = Object.keys(obj);
correctHeaders = Object.keys(dict.mapping); // autocorrect to these values
headerList = [...dict.headers]; // list of headers we want in the output
outobj = {}; // result

maxLength = 0; // record the maximum length of the lists
              // in the object, so we can fill up space later 

for (const header of currentHeaders) {
   // do an autocorrect; get the 'nearest' correct header
   searchRes = fuzzysort.go(header, correctHeaders)

   // if there is a result, take the first one,
   // then put it in the new object
   if (searchRes.length > 0) {
       corrected = dict.mapping[searchRes[0].target];
       // this is the header for the output object
       
       // remove the header that we found from the list
       // of correct headers
       
       if (! (corrected in outobj)) {
           // if the header is NOT in the output object...
           // remove it from the list of headers
           headerList.splice(headerList.indexOf(corrected), 1);
           // and add it to the output object
           outobj[corrected] = obj[header];
       }
       
       // see if the length is greater than the maximum
       if (obj[header].length > maxLength) {
           maxLength = obj[header].length;
       } 
   }
}

// after getting the headers that we have into the 
// output, time to clean it up

// fill missing headers with blanks
if (headerList.length > 0) {
   for (const header of headerList) {
       // fill missing headers with empty strings
       outobj[header] = '';
       
   }
}

return outobj;
}

// END of Form Parser
//

// START of Table Parser

const getTableResults = (data) => {

blocks=data['Blocks'];

blocks_map = {};
table_blocks = [];

// make blocks_map, and list down which blocks are table
for (const block of blocks) {
   id = block['Id'];
   blocks_map[id] = block;
   
   if (block['BlockType'] === "TABLE") {
       table_blocks.push(block);
   }
}

// check if there are no tables
if (table_blocks.length <= 0) {
   console.log('No tables found!!!!');
   return [];
}

csv = []
for (const table of table_blocks) {
   // for each table found, add an entry into the `csv` array
   //csv.push( generateTableCsv( table, blocks_map, i+1 ) );
   csv.push( getRowsColumnsMap(table, blocks_map) );
   
}


return csv
}


const getRowsColumnsMap = (table_result, blocks_map) => {
cols = {};
headers = [];
for (const relationship of table_result['Relationships']) {
   if (relationship['Type'] === 'CHILD') {
       for (const child_id of relationship['Ids']) {
           cell = blocks_map[child_id];
           if (cell['BlockType'] === 'CELL') {
               row_index = parseInt(cell['RowIndex']) - 1;
               col_index = parseInt(cell['ColumnIndex']) - 1;

               if (! (col_index in cols) ) {

                   // create new column
                   cols[col_index] = [];
               }
               // get the text value
               text = getText(cell, blocks_map);
               //rows[col_index][row_index] = text;
               if (row_index === 0) {
                   headers[col_index] = text.toLowerCase().replace(/\W*$/, ""); 
                   // if row index is 0, it is a header so store it for processing later
               } else {

                   cols[col_index][row_index-1] = text;
               }
           }
       }
   }
}

output_table = {}; // This is the final output
for (col_index in headers) {
   // given the column index, assign the header to the column in the new object
   output_table[headers[col_index]] = cols[col_index];
} 
//     return rows;
return output_table;
}

const mergeTables = (obj1, obj2) => { // function to merge objects based on header names
// objects must have only arrays as values
// assume that obj1's keys are absolutely correct
const keys = Object.keys(obj1);
var out = {};
for (const key of keys) {
    out[key] = Array.prototype.concat(obj1[key], obj2[key]);
}
return out;
}


const fixTableHeaders = (obj, dict) => {
// autocorrect and match the keys in obj to the values of dict
currentHeaders = Object.keys(obj);
correctHeaders = Object.keys(dict.mapping); // autocorrect to these values
headerList = [...dict.headers]; // list of headers we want in the output
outobj = {}; // result

maxLength = 0; // record the maximum length of the lists
              // in the object, so we can fill up space later 

for (const header of currentHeaders) {
   // do an autocorrect; get the 'nearest' correct header
   searchRes = fuzzysort.go(header, correctHeaders)

   // if there is a result, take the first one,
   // then put it in the new object
   if (searchRes.length > 0) {
       corrected = dict.mapping[searchRes[0].target];
       // this is the header for the output object
       
       // remove the header that we found from the list
       // of correct headers
       
       if (! (corrected in outobj)) {
           // if the header is NOT in the output object...
           // remove it from the list of headers
           headerList.splice(headerList.indexOf(corrected), 1);
           // and add it to the output object
           outobj[corrected] = obj[header];
       }
       
       // see if the length is greater than the maximum
       if (obj[header].length > maxLength) {
           maxLength = obj[header].length;
       } 
   }
}
// after getting the headers that we have into the 
// output, time to clean it up

// make sure that all lengths are the same
// idt we'll ever have to use this but good to have i think
for (const header of Object.keys(outobj)) {
   if (outobj[header].length < maxLength) {
       // fill up with extra spaces
       extra = Array(maxLength - outobj[header].length).fill('');
       outobj[header] = outobj[header].concat(extra);
   }
}
// if there are empty headers, fill them up with empty slots
if (headerList.length > 0) {
   for (const header of headerList) {
       // fill missing headers with empty strings
       outobj[header] = Array(maxLength).fill('');
   }
}
return outobj;
}

//
const getTextractAnalysis = async (filepath) => { // #### EXPORT this function
// function to get the textract raw json data
// This function does 3 things
// 1. Upload file onto the `ocr-scanned-invoices` bucket
// 2. Run textract analysis on the uploaded file
// 3. Delete the file in the bucket

// set up clients to be used
const s3Client = new S3Client();
const textractClient = new TextractClient();

// upload to bucket
const key = await uploadFile(filepath, s3Client);
console.log('uploaded ' + key);

// textract analysis
const data = await getAsyncAnalysis(key, textractClient)
console.log('analysis done')

// delete the file
await deleteFile(key, s3Client);
console.log('deleted the file');

return data;


}


const extractForms = (data, dict) => { // #### EXPORT this function
// takes in raw textract response, and dictionary mapping for required fields
if (data && data.Blocks) {
   const {keyMap, valueMap, blockMap} = getKeyValueMap(data.Blocks);
   const keyValues = getKeyValueRelationship(keyMap, valueMap, blockMap);
   const fixedKeyValues = fixFormHeaders(keyValues, dict);
   return fixedKeyValues;
};

return undefined; 
// if no key-values are found, return undefined, then deal with it later
}




const extractTables = (data, dict) => { // #### EXPORT this function
// do the normal extract tables
// for each table obtained, fix the headers
// then merge the fixed header tables
if (data && data.Blocks) {
   // do the normal extract tables
   const tables = getTableResults(data); // this is a list of table objects with dirty header names
   // for each table obtained, fix the headers
   // then merge the fixed header tables
   var outputTable = {}; // this is the output table
   const headers = dict.headers;
   for (const header of headers) { // populate it with the headers we want first so we can easily concatenate
       outputTable[header] = [];
   }
   
   for (const table of tables) { // for each table we obtained, clean the headers and merge it
       const fixedTable = fixTableHeaders(table, dict);
      outputTable = mergeTables(outputTable, fixedTable)
   }
}
return outputTable;
}

module.exports = { getTextractAnalysis,  extractForms, extractTables  }









// START of orignal code
// const _ = require("lodash");
// const aws = require("aws-sdk");
// const config = require("./config");

// aws.config.update({
//   accessKeyId: config.awsAccesskeyID,
//   secretAccessKey: config.awsSecretAccessKey,
//   region: config.awsRegion
// });

// const textract = new aws.Textract();

// // Start of form parser
// const getText = (result, blocksMap) => {
//   let text = "";

//   if (_.has(result, "Relationships")) {
//     result.Relationships.forEach(relationship => {
//       if (relationship.Type === "CHILD") {
//         relationship.Ids.forEach(childId => {
//           const word = blocksMap[childId];
//           if (word.BlockType === "WORD") {
//             text += `${word.Text} `;
//           }
//           if (word.BlockType === "SELECTION_ELEMENT") {
//             if (word.SelectionStatus === "SELECTED") {
//               text += `X `;
//             }
//           }
//         });
//       }
//     });
//   }

//   return text.trim();
// };

// const findValueBlock = (keyBlock, valueMap) => {
//   let valueBlock;
//   keyBlock.Relationships.forEach(relationship => {
//     if (relationship.Type === "VALUE") {
//       // eslint-disable-next-line array-callback-return
//       relationship.Ids.every(valueId => {
//         if (_.has(valueMap, valueId)) {
//           valueBlock = valueMap[valueId];
//           return false;
//         }
//       });
//     }
//   });

//   return valueBlock;
// };

// const getKeyValueRelationship = (keyMap, valueMap, blockMap) => {
//   const keyValues = {};

//   const keyMapValues = _.values(keyMap);

//   keyMapValues.forEach(keyMapValue => {
//     const valueBlock = findValueBlock(keyMapValue, valueMap);
//     const key = getText(keyMapValue, blockMap);
//     const value = getText(valueBlock, blockMap);
//     keyValues[key] = value;
//   });

//   return keyValues;
// };

// const getKeyValueMap = blocks => {
//   const keyMap = {};
//   const valueMap = {};
//   const blockMap = {};

//   let blockId;
//   blocks.forEach(block => {
//     blockId = block.Id;
//     blockMap[blockId] = block;

//     if (block.BlockType === "KEY_VALUE_SET") {
//       if (_.includes(block.EntityTypes, "KEY")) {
//         keyMap[blockId] = block;
//       } else {
//         valueMap[blockId] = block;
//       }
//     }
//   });

//   return { keyMap, valueMap, blockMap };
// };

// module.exports = async buffer => {
//   const params = {
//     Document: {
//       /* required */
//       Bytes: buffer
//     },
//     FeatureTypes: ["FORMS"]
//   };

//   const request = textract.analyzeDocument(params);
//   const data = await request.promise();

//   if (data && data.Blocks) {
//     const { keyMap, valueMap, blockMap } = getKeyValueMap(data.Blocks);
//     const keyValues = getKeyValueRelationship(keyMap, valueMap, blockMap);

//     return keyValues;
//   }

//   // in case no blocks are found return undefined
//   return undefined;
// };

export function DummyFunction(){
  console.log("Dummy Function");
}
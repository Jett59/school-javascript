// https://stackoverflow.com/questions/6156501/read-a-file-one-line-at-a-time-in-node-js#:~:text=Here's%20the%20easiest%20way%20to,')%3B%20const%20rl%20%3D%20readline.
const fs = require('fs');
const readline = require('readline');

async function processLineByLine() {
  let result = '';
  const fileStream = fs.createReadStream('game.js');

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });
  // Note: we use the crlfDelay option to recognize all instances of CR LF
  // ('\r\n') in input.txt as a single line break.

  for await (const line of rl) {
    // Each line in input.txt will be successively available here as `line`.
    result += line.replace(/^\s*[0-9]+[\.|:]/, '') + '\n';
  }
  fs.writeFile('out', result, () => console.log('done'));
}

processLineByLine();
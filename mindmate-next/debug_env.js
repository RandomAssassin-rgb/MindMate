const fs = require('fs');
const path = require('path');

const envPath = path.resolve(__dirname, '.env.local');
console.log('Checking path:', envPath);

if (!fs.existsSync(envPath)) {
  console.log('Error: .env.local does not exist!');
  process.exit(1);
}

const content = fs.readFileSync(envPath, 'utf8');
console.log('File length:', content.length);

const lines = content.split('\n');
let found = false;
for (const line of lines) {
  if (line.includes('OPENROUTER_API_KEY')) {
    console.log('Found line:', line.split('=')[0]);
    const val = line.split('=')[1]?.trim();
    console.log('Value starts with:', val?.substring(0, 10));
    console.log('Value length:', val?.length);
    found = true;
  }
}

if (!found) {
  console.log('OPENROUTER_API_KEY NOT FOUND in file.');
}

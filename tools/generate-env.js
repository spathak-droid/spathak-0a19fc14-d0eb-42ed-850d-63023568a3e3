const fs = require('fs');
require('dotenv').config();

console.log("Generating Angular environment.ts from .env...");

const envFile = `
export const environment = {
  apiUrl: '${process.env.API_URL}'
};
`;

const outputPath = 'apps/dashboard/src/environments/environment.ts';

// Ensure directory exists
fs.mkdirSync('apps/dashboard/src/environments', { recursive: true });

// Write the env file
fs.writeFileSync(outputPath, envFile);

console.log('✔ Angular environment.ts generated at:', outputPath);

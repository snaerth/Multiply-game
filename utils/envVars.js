const path = require('path');
const dotenv = require('dotenv');
const process = require('process');

const nodeEnv = process.env.NODE_ENV || 'development';

/**
 * Registers environment file to environment variables
 */
function registerEnvFile() {
  const envFileName = `.env.${nodeEnv}`;
  // Env file path
  const envFilePath = path.resolve(process.cwd(), envFileName);
  const { error, parsed: localEnv } = dotenv.config({ path: envFilePath });

  if (error) {
    console.error('Project is missing .env file');
    throw new Error(error);
  } else {
    console.log(`✓  Registering environment variables from: ${envFileName}`);
    return localEnv;
  }
}

module.exports = registerEnvFile;

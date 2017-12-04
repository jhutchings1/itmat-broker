const fs = require('fs');

const ApiServer = require('./api-server');

const environmentConfigVariable = 'ITMAT_CONFIG';
if (!process.env[environmentConfigVariable]) {
  throw Error(`The ${environmentConfigVariable} environment variable must be set to your config file`);
}

const configFile = fs.readFileSync(process.env[environmentConfigVariable]);
const config = JSON.parse(configFile);

const server = new ApiServer(config);
server.start();

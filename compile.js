const path = require('path');
const solc = require('solc');
const fs = require('fs-extra');

//Delete build folder
const buildPath = path.resolve(__dirname, 'build');
fs.removeSync(buildPath);

//Read in campaign.sol readFileSync
const campaignPath = path.resolve(__dirname, 'contracts', 'Campaign.sol');
const source = fs.readFileSync(campaignPath, 'utf8');
const output = solc.compile(source, 1).contracts;

//Create build directory again
fs.ensureDirSync(buildPath);

//Loop over output var and save each contracts code to a seperate file
//console.log(output);

for (let contract in output) {
  fs.outputJsonSync(
    path.resolve(buildPath, contract.replace(':', '') + '.json'),
    output[contract]
  );
}

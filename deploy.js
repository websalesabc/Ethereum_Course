const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require ('web3');
//const { interface, bytecode} = require('./compile');//fix this
const compiledFactory = require('./build/CampaignFactory.json');

const provider = new HDWalletProvider(
  'wrap surface daughter sail allow dress frog base faint fitness noodle decide',
  'https://rinkeby.infura.io/lzzQ0VXMcOdtQcYn44Of '
 //'https://rinkeby.infura.io/orDImgKRzwNrVCDrAk5Q'
);

const web3 = new Web3(provider);

const deploy = async() => {
  const accounts = await web3.eth.getAccounts();

  console.log('Attempting to deploy from account', accounts[0])

  const result = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
  .deploy({ data: compiledFactory.bytecode })
  .send({ gas: '1000000', from: accounts[0] });

  console.log('Contract deployed to', result.options.address);
};
deploy();

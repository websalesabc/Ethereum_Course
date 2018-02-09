const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
// Will change when deploying on other networks
//const web3 = new Web3(ganache.provider()); //L39
//LATEST UPDATES
const provider = ganache.provider();
const web3 = new Web3(provider);
const{ interface, bytecode } = require('../compile');

let accounts;
let inbox;

beforeEach(async()=>{
  //Get a list of all accounts
accounts = await web3.eth.getAccounts();
  //Use one of these accounts to deploy the contract
inbox = await new web3.eth.Contract(JSON.parse(interface))
  .deploy({ data: bytecode, arguments: ['Hi there!']})
  .send({ from: accounts[0], gas: '1000000'});

  //NEW LINE
  inbox.setProvider(provider);
});

describe('Inbox', () =>{
  it('deployes a contract', () =>{
  assert.ok(inbox.options.address);
  //console.log(inbox);
  });

  it('has a default message', async () => {
    const message = await inbox.methods.message().call(); //This does the following
        //creates a const variable called setMessage
        //async await syntax
        //the variable references the contract inbox,
        //The contract has a property called methods. methods is a object that contains all the diffirent public functions in our contract.

    assert.equal(message, 'Hi there!');
  });

  it('can change the message', async()=> {
    await inbox.methods.setMessage('bye').send({from: accounts[0]});// This is a .send function and not a call.
    //whenever we send a transaction we need to specify who is sending the transaction "account"
    const message = await inbox.methods.message().call();
    assert.equal(message, 'bye');
    //const.equal(message,'buy');
  });
});

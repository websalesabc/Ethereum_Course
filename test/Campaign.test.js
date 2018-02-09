const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
//const web3 = new Web3(ganache.provider());
//LATEST UPDATES
const provider = ganache.provider();
const web3 = new Web3(provider);

const compiledFactory = require('../ethereum/build/CampaignFactory.json');
const compiledCampaign = require('../ethereum/build/Campaign.json');

//const { interface, bytecode} = require('../compile');
let accounts; // create variable to hold all accounts created by ganache
let factory;
let campaignAddress;
let campaign;
// DEFAULT TEMPLATES
beforeEach (async() => {
  accounts = await web3.eth.getAccounts();

  factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
  .deploy({data: compiledFactory.bytecode})
  .send({from: accounts[0], gas: '1000000'})

//NEW LINE KEEP HERE ------------
 factory.setProvider(provider); //Edit lottery to new contract name
//-------------------------------

//**** Prevents us from having to include the script in every 'it' block
  await factory.methods.createCampaign('100').send({
    from: accounts[0],
    gas: '1000000'
  });

  [campaignAddress] = await factory.methods.getDeployedCampaigns().call();
  campaign = await new web3.eth.Contract(
    JSON.parse(compiledCampaign.interface),
    campaignAddress
  );
//*************************************
});
//START TEST SCRIPTS
describe('Campaigns', () => {
  it('deploys a factory and a campaign', () => {
    assert.ok(factory.options.address);
    assert.ok(campaign.options.address);
  });
//Test 2 Test that person who created the campaign is the manager
  it('marks caller as the manager', async () => {
    const manager = await campaign.methods.manager().call();
    assert.equal(accounts[0], manager);
  });
//Test 3: Test that someone can donate money
  it('allows people to contribute money and marks them as approvers', async () => {
    await campaign.methods.contribute().send({
      value: '200',
      from: accounts[1]
    });
    const isContributor = await campaign.methods.approvers(accounts[1]).call();
    assert(isContributor);
  });
//Test 4: 4.	Verify that a campaign has a minimum contribution tied to it.
  it('verifies that the campaign has a minimum contribution tied to it', async () => {
    try {
      await campaign.method.contribute().send({
        value: '5',
        from: accounts[1]
      });
      asseret(false);
    } catch (err) {
      assert(err);
    }
  });
//Test 5: Test asserts that a manager has the ability to make a payment request.
  it('asserts that a manager has the ability to make a payment request', async () => {
    await campaign.methods.createRequest('Buy batteries', '100', accounts[1]).send({
      from: accounts[0],
      gas:'1000000'
    });
    const request = await campaign.methods.requests(0).call();

    assert.equal('Buy batteries', request.description);
  });
//Test 6: End to End test
//Contribute and mark accounts[0] as the contributor
  it('processes requests', async () => {
    await campaign.methods.contribute().send({
      from: accounts[0],
      value: web3.utils.toWei('10', 'ether')
    });
//Create a request and atempt to send some of the Eth to another accounts
  await campaign.methods
  .createRequest('A', web3.utils.toWei('5', 'ether'), accounts[1]).send({
    from: accounts[0],
    gas: '1000000'
  });

  await campaign.methods.approveRequest(0).send({
    from: accounts[0],
    gas: '1000000'
  });

  await campaign.methods.finalizeRequest(0).send({
    from: accounts[0],
    gas: '1000000'
  });

  let balance = await web3.eth.getBalance(accounts[1]);
  balance = web3.utils.fromWei(balance, 'ether');
  balance = parseFloat(balance);
  console.log(balance);
  assert(balance > 103)
  });
});

import Web3 from 'web3';

let web3;

if (typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {
  //we are in the browser AND MetaMask is running
  web3 = new Web3(window.web3.currentProvider);
} else {
  // We are on the server or the user is not running MetaMask
  const provider = new Web3.providers.HttpProvider(
    'https://rinkeby.infura.io/lzzQ0VXMcOdtQcYn44Of '
  );
  web3 = new Web3(provider);
}

export default web3;

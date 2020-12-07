const UlaToken = artifacts.require("UlaToken");
const UlaTokenSale = artifacts.require("UlaTokenSale");
let ulaToken
let ulaTokenSale

module.exports = function(deployer) {
  deployer.deploy(UlaToken, 1000000).then(function(instance) {
    ulaToken = instance;
    // Token price is 0.001 Ether
    var tokenPrice = 1000000000000000;
    return deployer.deploy(UlaTokenSale, UlaToken.address, tokenPrice);
  })/*.then(function(instance) {
    ulaTokenSale = instance;
    return ulaToken.transfer(ulaTokenSale.address, 500000)
  })*/
  //deployer.deploy(UlaToken, '1000000');
  //const ulaToken = await UlaToken.deployed()
  
  //var tokenPrice = 1000000000000000;
  //deployer.deploy(UlaTokenSale, ulaToken.address, tokenPrice)
  //const ulaTokenSale = await UlaTokenSale.deployed()
  //await ulaToken.transfer(ulaTokenSale.address, 750000, {gas: 500000})
  //var balance = await ulaToken.balanceOf(ulaTokenSale.address)
  //console.log(balance.toNumber())
};

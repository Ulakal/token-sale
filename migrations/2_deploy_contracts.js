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
  }).then(function(instance) {
    ulaTokenSale = instance;
    return ulaToken.transfer(ulaTokenSale.address, 500000)
  })
};

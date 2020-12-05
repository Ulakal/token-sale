const UlaToken = artifacts.require("UlaToken");
const UlaTokenSale = artifacts.require("UlaTokenSale");

module.exports = function(deployer) {
  deployer.deploy(UlaToken, '1000000');
  var tokenPrice = 1000000000000000;
  deployer.deploy(UlaTokenSale, UlaToken.address, tokenPrice)
};

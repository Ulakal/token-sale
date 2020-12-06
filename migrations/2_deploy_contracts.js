const UlaToken = artifacts.require("UlaToken");
const UlaTokenSale = artifacts.require("UlaTokenSale");

module.exports = async function(deployer) {
  deployer.deploy(UlaToken, '1000000');
  const ulaToken = await UlaToken.deployed()
  
  var tokenPrice = 1000000000000000;
  deployer.deploy(UlaTokenSale, ulaToken.address, tokenPrice)
};

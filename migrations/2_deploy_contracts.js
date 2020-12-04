const UlaToken = artifacts.require("UlaToken");

module.exports = function(deployer) {
  deployer.deploy(UlaToken, '1000000');
};

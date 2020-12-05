const { assert } = require("chai");
const truffleAssert = require('truffle-assertions');

const UlaToken = artifacts.require("UlaToken");
const UlaTokenSale = artifacts.require("UlaTokenSale");

contract('UlaTokenSale', (accounts) => {
    let ulaToken
    let ulaTokenSale
    let tokensAvailable = 750000
    const tokenPrice = 1000000000000000

    before(async() => {
        ulaToken = await UlaToken.deployed()
        ulaTokenSale = await UlaTokenSale.deployed()
        await ulaToken.transfer(ulaTokenSale.address, tokensAvailable)
    })

    it('initializes contract with correct values', async() => {
        const address = await ulaTokenSale.address
        assert.notEqual(address, 0x0, 'contract has address')

        const tokenAddress = await ulaTokenSale.tokenContract()
        assert.notEqual(tokenAddress, 0x0, 'contract has token address')

        const price = await ulaTokenSale.tokenPrice()
        assert.equal(price, '1000000000000000', 'contract has correct token price')
    })
    it('handles buy tokens functions correctly', async() => {
        
})
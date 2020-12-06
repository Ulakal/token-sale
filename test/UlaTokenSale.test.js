const { assert } = require("chai");
const truffleAssert = require('truffle-assertions');

const UlaToken = artifacts.require("UlaToken");
const UlaTokenSale = artifacts.require("UlaTokenSale");

contract('UlaTokenSale', (accounts) => {
    let ulaToken
    let ulaTokenSale
    let tokensAvailable = 750000
    const tokenPrice = web3.utils.toWei('0.001', 'ether')

    before(async() => {
        ulaToken = await UlaToken.new(1000000)
        ulaTokenSale = await UlaTokenSale.new(ulaToken.address, 1000000000000000)
        await ulaToken.transfer(ulaTokenSale.address, tokensAvailable)
    })

    it('initializes contract with correct values', async() => {
        const address = await ulaTokenSale.address
        assert.notEqual(address, 0x0, 'contract has address')

        const tokenAddress = await ulaTokenSale.tokenContract()
        assert.notEqual(tokenAddress, 0x0, 'contract has token address')

        const price = await ulaTokenSale.tokenPrice()
        assert.equal(price, '1000000000000000', 'contract has correct token price')

        const tokenBalance = await ulaToken.balanceOf(ulaTokenSale.address)
        assert.equal(tokenBalance, 750000)
    })
    it('handles buy tokens function correctly', async() => {
        //buyer cannot buy tokens for not enough ether
        await truffleAssert.fails(ulaTokenSale.buyTokens(1000, {from: accounts[1], value: 1})), truffleAssert.ErrorType.REVERT, 'buyer cannot buy tokens for not enough ether'
        //buyer cannot buy more tokens than there are in the contract
        await truffleAssert.fails(ulaTokenSale.buyTokens(751000, {from: accounts[1], value: 751000*tokenPrice})), truffleAssert.ErrorType.REVERT, 'buyer cannot buy more tokens than there are in the contract'
        
        await ulaTokenSale.buyTokens(1000, {from: accounts[1], value: 1000 * tokenPrice})
        const buyerBalance = await ulaToken.balanceOf(accounts[1])
        const contractBalance = await ulaToken.balanceOf(ulaTokenSale.address)
        assert.equal(buyerBalance, 1000)
        assert.equal(contractBalance, 749000)

        const tokensSold = await ulaTokenSale.tokensSold()
        assert.equal(tokensSold, 1000)
    })
    it('emits sell event correctly', async() => {
        const result = await ulaTokenSale.buyTokens(1000, {from: accounts[1], value: 1000*tokenPrice})
        const event = result.logs[0].args
        assert.equal(event.buyer, accounts[1])
        assert.equal(event.amount, '1000')
    })
    it('checks if only admin can end the sale', async() => {
        await truffleAssert.fails(ulaTokenSale.endSale({from: accounts[1]}))
        await truffleAssert.passes(ulaTokenSale.endSale({from: accounts[0]}))
    })
    it('assures that destroyed contract tokens were sent to admin', async() => {
        let adminTokens = await ulaToken.balanceOf(accounts[0])
        assert.equal(adminTokens.toNumber(), 998000)
    })
        
})
//const { assert } = require("console");
const { assert } = require("chai");
const truffleAssert = require('truffle-assertions');

const UlaToken = artifacts.require("UlaToken");

contract('UlaToken', (accounts) => {
    let ulaToken 

    before(async() => {
        ulaToken = await UlaToken.deployed()
    })
    it('initializes contract with correct values', async() => {
        const name = await ulaToken.name()
        assert.equal(name, 'Ula Token', 'contract has correct name')
        
        const symbol = await ulaToken.symbol()
        assert.equal(symbol, 'ULA', 'contract has correct symbol')

        const totalSupply = await ulaToken.totalSupply()
        assert.equal(totalSupply, '1000000', 'contract has correct total supply')
    })
    it('allocates the initial supply to the owner', async() => {
        const ownerBalance = await ulaToken.balanceOf(accounts[0])
        assert.equal(ownerBalance, '1000000')
    })
    it('transfers token ownership correctly', async() => {
        await ulaToken.transfer(accounts[1], 250000)
        const receiverBalance = await ulaToken.balanceOf(accounts[1])
        const senderBalance = await ulaToken.balanceOf(accounts[0])
        assert.equal(receiverBalance, '250000', 'receiver receives tokens correctly')
        assert.equal(senderBalance, '750000', 'sender has correct balance after sending tokens')
    })
    it('cannot send more tokens than sender owns', async() => {
        await truffleAssert.fails(ulaToken.transfer(accounts[1], 10000000)), truffleAssert.ErrorType.REVERT
    })
    it('checks if the event is correct', async() => {
        const result = await ulaToken.transfer(accounts[1], 100)
        const event = result.logs[0].args
        assert.equal(event.from, accounts[0])
        assert.equal(event.to, accounts[1])
        assert.equal(event.value, '100')
    })
})


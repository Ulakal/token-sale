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
    it('checks if Transfer event is correct', async() => {
        const result = await ulaToken.transfer(accounts[1], 100)
        const event = result.logs[0].args
        assert.equal(event.from, accounts[0])
        assert.equal(event.to, accounts[1])
        assert.equal(event.value, '100')
    })
    it('approves tokens for delegated transfer', async() => {
        await ulaToken.approve(accounts[1], '100', {from: accounts[0]})
        const allowance = await ulaToken.allowance(accounts[0], accounts[1])
        assert.equal(allowance, 100, 'approves allowance value correctly')
    })
    it('checks if Approval event is correct', async() => {
        const result = await ulaToken.approve(accounts[1], '200', {from: accounts[0]})
        const event = result.logs[0].args
        assert.equal(event.from, accounts[0])
        assert.equal(event.to, accounts[1])
        assert.equal(event.value, '200')
    })
    it('handles delegated token transfers', async() => {
        //cannot transfer more tokens than owners balance
        await truffleAssert.fails(ulaToken.transferFrom(accounts[0], accounts[2], '1000', {from: accounts[1]})), truffleAssert.ErrorType.REVERT, 'cannot transfer more tokens than owners balance'
        //cannot transfer more tokens than allowance
        let allowance = await ulaToken.allowance(accounts[0], accounts[1])
        allowance = allowance.toNumber()
        await truffleAssert.fails(ulaToken.transferFrom(accounts[0], accounts[2], allowance + 1, {from: accounts[1]})), truffleAssert.ErrorType.REVERT, 'cannot transfer more tokens than allowance'
        //not approved account cannot transfer on behalf owner
        await truffleAssert.fails(ulaToken.transferFrom(accounts[0], accounts[1], '100', {from: accounts[2]})), truffleAssert.ErrorType.REVERT, 'not approved account cannot transfer on behalf owner'
        //balances are updated correctly
        let ownerBalanceBefore = await ulaToken.balanceOf(accounts[0])
        let receiverBalanceBefore = await ulaToken.balanceOf(accounts[2])
        let allowanceBefore = await ulaToken.allowance(accounts[0], accounts[1])
        const result = await ulaToken.transferFrom(accounts[0], accounts[2], '20', {from: accounts[1]})
        let ownerBalanceAfter = await ulaToken.balanceOf(accounts[0])
        let receiverBalanceAfter = await ulaToken.balanceOf(accounts[2])
        let allowanceAfter = await ulaToken.allowance(accounts[0], accounts[1])
        
        //balance after is lower than balance before
        assert(ownerBalanceBefore.toNumber() > ownerBalanceAfter.toNumber(), 'balance after is lower than balance before')
        //owner balance is updated correctly
        assert.equal(ownerBalanceAfter.toNumber() + 20, ownerBalanceBefore.toNumber(), 'owner balance is updated correctly')
        //receiver balance is updated
        assert.equal(receiverBalanceAfter.toNumber(), receiverBalanceBefore.toNumber() + 20, 'receiver balance is updated')
        //deducts allowance correctly
        assert.equal(allowanceBefore.toNumber() - 20, allowanceAfter.toNumber(), 'deducts allowance correctly' )
    })
    it('checks if Transfer event on transferFrom() is correct', async() => {
        const result = await ulaToken.transferFrom(accounts[0], accounts[2], '30', {from: accounts[1]})
        const event = result.logs[0].args
        assert.equal(event.from, accounts[0])
        assert.equal(event.to, accounts[2])
        assert.equal(event.value, '30')
    })
})


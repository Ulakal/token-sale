pragma solidity ^0.5.0;
import "./UlaToken.sol";

contract UlaTokenSale {

    address admin;
    UlaToken public tokenContract;
    uint256 public tokenPrice;

    event Sell(address buyer, uint256 amount);

    constructor(UlaToken _tokenContract, uint256 _tokenPrice) public {
        admin = msg.sender;
        tokenContract = _tokenContract;
        tokenPrice = _tokenPrice;
    }

    function buyTokens(uint256 _numberOfTokens) public payable {
        require(msg.value >= _numberOfTokens*tokenPrice);
        require(_numberOfTokens <= tokenContract.balanceOf(address(this)));
        tokenContract.transfer(msg.sender, _numberOfTokens);
        
        emit Sell(msg.sender, _numberOfTokens);
    }
}
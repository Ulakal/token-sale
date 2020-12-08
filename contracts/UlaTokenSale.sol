pragma solidity ^0.5.0;
import "./UlaToken.sol";
import "./SafeMath.sol";

contract UlaTokenSale {
    using SafeMath for uint256;

    address admin;
    UlaToken public tokenContract;
    uint256 public tokenPrice;
    uint256 public tokensSold;

    event Sell(address buyer, uint256 amount);

    constructor(UlaToken _tokenContract, uint256 _tokenPrice) public {
        admin = msg.sender;
        tokenContract = _tokenContract;
        tokenPrice = _tokenPrice;
    }

    function buyTokens(uint256 _numberOfTokens) public payable {
        require(msg.value >= _numberOfTokens * tokenPrice);
        require(tokenContract.balanceOf(address(this)) >= _numberOfTokens);
        require(tokenContract.transfer(msg.sender, _numberOfTokens));

        tokensSold = SafeMath.add(tokensSold, _numberOfTokens);
        
        emit Sell(msg.sender, _numberOfTokens);
    }

    function endSale() public {
        require(msg.sender == admin);
        require(tokenContract.transfer(admin, tokenContract.balanceOf(address(this))));

        selfdestruct(msg.sender);
    }
}
pragma solidity ^0.8.4;

// This Contract implements the wallet of CryptoIn project.
contract Wallet {

    // Map the addresses of users to their balances
    mapping(address => uint) public balances;

    // Receive the ethers from caller and add the caller's balance
    function deposit() public payable {
        balances[msg.sender] += msg.value; 
    }
    
    // Withdraw ethers and reduce the balance
    function withdraw(uint _amount) public {
        require(balances[msg.sender]>= _amount, "Not enough ethers");
        balances[msg.sender] -= _amount;
        (bool sent,) = msg.sender.call{value: _amount}("Sent");
        require(sent, "failed to send ETH");
    }

    function getBalance() public view returns(uint) {
        return balances[msg.sender];
    }

    // Implement the tip feature of CryptoIN
    function tip(address payable _receiver, uint _amount) public {
        require(balances[msg.sender]>= _amount, "Not enough ethers");
        balances[msg.sender] -= _amount;
        _receiver.transfer(_amount);
    }

}
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./IERC20Token.sol";
import "./Loan.sol";

contract LoanRequest {
    address payable public borrower = payable(msg.sender);
    IERC20Token public token;
    uint256 public collateralAmount;
    uint256 public loanAmount;
    uint256 public payoffAmount;
    uint256 public loanDuration;

    event LoanRequestAccepted(address loan);

    constructor(
        IERC20Token _token,
        uint256 _collateralAmount,
        uint256 _loanAmount,
        uint256 _payoffAmount,
        uint256 _loanDuration
    )
    {
        token = _token;
        collateralAmount = _collateralAmount;
        loanAmount = _loanAmount;
        payoffAmount = _payoffAmount;
        loanDuration = _loanDuration;
    }

    Loan public loan;

    function lendEther() public payable {
        // Check if the provided loan amount is correct.
        require(msg.value == loanAmount, "Incorrect loan amount");

        // Create a new Loan contract.
        loan = new Loan(
            payable(msg.sender),
            borrower,
            token,
            collateralAmount,
            payoffAmount,
            loanDuration
        );
        
        // Transfer the collateral amount from the borrower to the Loan contract.
        require(token.transferFrom(borrower, address(loan), collateralAmount), "Transfer failed");
        // Transfer the loan amount to the borrower.
        borrower.transfer(loanAmount);
        // Emit the LoanRequestAccpted event.
        emit LoanRequestAccepted(address(loan));
    }
}

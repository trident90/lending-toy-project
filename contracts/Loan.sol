// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./IERC20Token.sol";

contract Loan {
    address payable public lender;
    address public borrower;
    IERC20Token public token;
    uint256 public collateralAmount;
    uint256 public payoffAmount;
    uint256 public dueDate;

    event LoanPaid();

    constructor(
        address payable _lender,
        address _borrower,
        IERC20Token _token,
        uint256 _collateralAmount,
        uint256 _payoffAmount,
        uint256 loanDuration
    )
    {
        lender = _lender;
        borrower = _borrower;
        token = _token;
        collateralAmount = _collateralAmount;
        payoffAmount = _payoffAmount;
        dueDate = block.timestamp + loanDuration;
    }

    /**
     * @dev Function to pay off the loan and retrieve the collateral.
     */
    function payLoan() public payable {
        // Check if the loan is not overdue
        require(block.timestamp <= dueDate, "Loan is overdue");
        // Check if the provided payoff amount is correct
        require(msg.value == payoffAmount, "Incorrect payoff amount");

        // Transfer the collateral back to the borrower
        require(token.transfer(borrower, collateralAmount), "Transfer failed");
        // Emit the LoanPaid event
        emit LoanPaid();
        // Destroy the contract and transfer remaining balance to the lender
        selfdestruct(lender);
    }

    /**
     * @dev Function to repossess the collateral if the loan is overdue.
     */
    function repossess() public {
        // Check if the loan is overdue
        require(block.timestamp > dueDate, "Loan is not yet overdue");

        // Transfer the collateral to the lender
        require(token.transfer(lender, collateralAmount), "Transfer failed");
        // Destroy the contract and transfer remaining balance to the lender
        selfdestruct(lender);
    }
}

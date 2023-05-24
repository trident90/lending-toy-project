const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("Test Repossess", function () {

  let loanRequest, loan;
  let collateralToken;

  let accounts;
  let borrower;
  let lender;

  const collateralAmount = "200"+"0".repeat(18);
  const loanAmount = "80"+"0".repeat(18);
  const payoffAmount = "82"+"0".repeat(18);
  const loanDuration = 0;

  before(async () => {
    accounts = await ethers.getSigners();
    borrower = accounts[0];
    lender = accounts[1];

    // deploy token contract
    const Token = await ethers.getContractFactory("TestToken", borrower);
    collateralToken = await Token.deploy();
    await collateralToken.deployed();
    console.log("collateralToken: ", collateralToken.address);

    // deploy loanRequest contract
    const LoanRequest = await ethers.getContractFactory("LoanRequest", borrower);
    loanRequest = await LoanRequest.deploy(
      collateralToken.address,
      collateralAmount,
      loanAmount,
      payoffAmount,
      loanDuration
    );
    await loanRequest.deployed();
    console.log("loanRequest: ", loanRequest.address);
  })

  it("borrower: approve token", async () => {
    await collateralToken.connect(borrower).approve(
      loanRequest.address,
      collateralAmount,
    );
  })

  it("lender: deposit ETH", async () => {
    const prevTokenBalance1 = await collateralToken.balanceOf(borrower.address);
    const prevTokenBalance2 = await collateralToken.balanceOf(lender.address);
    const prevTokenBalance3 = await ethers.provider.getBalance(borrower.address);
    const prevTokenBalance4 = await ethers.provider.getBalance(lender.address);
    
    await loanRequest.connect(lender).lendEther({value: loanAmount});
    
    const currTokenBalance1 = await collateralToken.balanceOf(borrower.address);
    const currTokenBalance2 = await collateralToken.balanceOf(lender.address);
    const currTokenBalance3 = await ethers.provider.getBalance(borrower.address);
    const currTokenBalance4 = await ethers.provider.getBalance(lender.address);

    console.log("previous borrower's token balance is", prevTokenBalance1/1e18);
    console.log(" current borrower's token balance is", currTokenBalance1/1e18);
    console.log("previous lender's token balance is", prevTokenBalance2/1e18);
    console.log(" current lender's token balance is", currTokenBalance2/1e18);
    console.log("previous borrower's ETH balance is", prevTokenBalance3/1e18);
    console.log(" current borrower's ETH balance is", currTokenBalance3/1e18);
    console.log("previous lender's ETH balance is", prevTokenBalance4/1e18);
    console.log(" current lender's ETH balance is", currTokenBalance4/1e18);

    expect(prevTokenBalance1.sub(currTokenBalance1)).to.be.equal(collateralAmount);
  })

  it("get loan contract", async () => {
    const loanAddress = await loanRequest.loan();
    loan = await ethers.getContractAt("Loan", loanAddress);

    console.log("loan: ", loan.address);
  })

  it("lender: liquidate borrower's token", async () => {
    const prevTokenBalance1 = await collateralToken.balanceOf(borrower.address);
    const prevTokenBalance2 = await collateralToken.balanceOf(lender.address);
    const prevTokenBalance3 = await ethers.provider.getBalance(borrower.address);
    const prevTokenBalance4 = await ethers.provider.getBalance(lender.address);
    
    await loan.connect(lender).repossess();
    
    const currTokenBalance1 = await collateralToken.balanceOf(borrower.address);
    const currTokenBalance2 = await collateralToken.balanceOf(lender.address);
    const currTokenBalance3 = await ethers.provider.getBalance(borrower.address);
    const currTokenBalance4 = await ethers.provider.getBalance(lender.address);

    console.log("previous borrower's token balance is", prevTokenBalance1/1e18);
    console.log(" current borrower's token balance is", currTokenBalance1/1e18);
    console.log("previous lender's token balance is", prevTokenBalance2/1e18);
    console.log(" current lender's token balance is", currTokenBalance2/1e18);
    console.log("previous borrower's ETH balance is", prevTokenBalance3/1e18);
    console.log(" current borrower's ETH balance is", currTokenBalance3/1e18);
    console.log("previous lender's ETH balance is", prevTokenBalance4/1e18);
    console.log(" current lender's ETH balance is", currTokenBalance4/1e18);
  })
});

const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("Test LoanRequest", function () {

  let loanRequest, loan;
  let collateralToken;

  let accounts;
  let borrower;
  let lender;

  const collateralAmount = "10"+"0".repeat(18);
  const loanAmount = "1"+"0".repeat(18);
  const payoffAmount = "2"+"0".repeat(18);
  const loanDuration = 10000000;

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
  })

  it("lender: deposit ether", async () => {
  })

  it("get loan contract", async () => {
  })

  it("borrower: repay ether", async () => {
  })
});

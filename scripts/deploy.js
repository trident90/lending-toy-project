// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const fs = require('fs');
const hre = require('hardhat');

async function main() {
  // Read prvate key from file
  const privateKey = fs.readFileSync('./.privKey.txt', 'utf-8').trim();
  // Create a new signer with the private key
  const signer = new hre.ethers.Wallet(privateKey, hre.ethers.provider);

  // Specify the gas price in Gwei
  const gasPrice =  hre.ethers.utils.parseUnits('80', 'gwei');

  console.log("Deploying the conact with account:", signer.address);

  const currentTimestampInSeconds = Math.round(Date.now() / 1000);

  const CPL_TOKEN = '0x3a0E8F86ff584B5784d0FC783990863e756369Af';
  const loanDuration = currentTimestampInSeconds + (24*60*60);

  const collateralAmount = hre.ethers.utils.parseEther("10");
  const loanAmount = hre.ethers.utils.parseEther("5");
  const payoffAmount = hre.ethers.utils.parseEther("0.1");

  const LoanRequest = await hre.ethers.getContractFactory("LoanRequest", signer);
  const loanrequest = await LoanRequest.deploy(CPL_TOKEN, collateralAmount, loanAmount, payoffAmount, loanDuration, {gasPrice: gasPrice});

  await loanrequest.deployed();

  console.log(
    `LoanRequest with collateralAmount ${ethers.utils.formatEther(collateralAmount)}ETH and Loan Duration ${loanDuration} deployed to ${loanrequest.address}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

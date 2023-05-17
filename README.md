# lending-toy-project

## after cloning
- install packages (if node is not installed, install node package first.)

  `npm install`
  
- compile contract

  `npx hardhat compile`
  
## for deploying contracts
- create account
- get test Meta (https://testnetfaucet.metadium.com/)
- write .privKey.txt

  `npx hardhat run scripts/deploy.js --network metadium_testnet`

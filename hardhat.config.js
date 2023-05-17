require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.10",
  networks: {
    metadium_testnet: {
      url: "https://api.metadium.com/dev",
      gasPrice: 80000000000
    },
    metadium_mainnet: {
      url: "https://api.metadium.com/prod",
      gasPrice: 80000000000
    },
  },
};

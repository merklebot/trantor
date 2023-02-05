require("hardhat-deploy")
require("hardhat-deploy-ethers")

const { networkConfig } = require("../helper-hardhat-config")


const private_key = network.config.accounts[0]
const wallet = new ethers.Wallet(private_key, ethers.provider)

module.exports = async ({ deployments }) => {
    console.log("Wallet Ethereum Address:", wallet.address)
    const chainId = network.config.chainId
    const tokensToBeMinted = networkConfig[chainId]["tokensToBeMinted"]

    //deploy Trantor
    const Trantor = await ethers.getContractFactory('Trantor', wallet);
    console.log('Deploying Trantor...');
    const trantor = await Trantor.deploy();
    await trantor.deployed()
    console.log('Trantor deployed to:', trantor.address);
}
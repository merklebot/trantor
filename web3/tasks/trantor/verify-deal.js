const CID = require("cids");
task(
    "verify-deal",
    "Adds object to Trantor bucket"
)
    .addParam("contract", "The address of the Trantor contract")
    .addParam("dealid", "Ipfs cid of data you want to store")
    .setAction(async (taskArgs) => {
        //store taskargs as useable variables
        const contractAddr = taskArgs.contract
        const dealId = taskArgs.dealid

        const networkId = network.name
        console.log("Using Trantor on network", networkId)

        //create a new wallet instance
        const wallet = new ethers.Wallet(network.config.accounts[0], ethers.provider)

        //create a Trantor contract factory
        const Trantor = await ethers.getContractFactory("Trantor", wallet)
        //create a Trantor contract instance
        //this is what you will call to interact with the deployed contract
        const trantor = await Trantor.attach(contractAddr)


        //send transaction to call verifyDeal() method
        transaction = await trantor.verifyDeal(dealId)
        const receipt = await transaction.wait()
        console.log(receipt)
        console.log("Complete!")
    })
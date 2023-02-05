task(
    "get-info",
    "Gets contract variables"
)
    .addParam("contract", "The address of the FilecoinMarketConsumer contract")
    .setAction(async (taskArgs) => {
        //store taskargs as useable variables
        const contractAddr = taskArgs.contract
        const networkId = network.name
        console.log("Reading contract data", networkId)

        //create a new wallet instance
        const wallet = new ethers.Wallet(network.config.accounts[0], ethers.provider)

        //create a FilecoinMarketConsumer contract factory
        const FilecoinMarketConsumer = await ethers.getContractFactory("FilecoinMarketConsumer", wallet)
        //create a FilecoinMarketConsumer contract instance
        //this is what you will call to interact with the deployed contract
        const filecoinMarketConsumer = await FilecoinMarketConsumer.attach(contractAddr)

        // //send transaction to call storeAll() method
        // transaction = await filecoinMarketConsumer.storeAll(dealID)
        // const receipt = await transaction.wait()

        let data = await filecoinMarketConsumer.dealCommitment();
        console.log(data)
        console.log("Complete!")
    })
const CID = require("cids");
task(
    "get-object",
    "Adds object to Trantor bucket"
)
    .addParam("contract", "The address of the Trantor contract")
    .addParam("ipfscid", "Ipfs cid of data you want to store")
    .setAction(async (taskArgs) => {
        //store taskargs as useable variables
        const contractAddr = taskArgs.contract
        const ipfsCid = taskArgs.ipfscid

        const networkId = network.name
        console.log("Using Trantor on network", networkId)

        //create a new wallet instance
        const wallet = new ethers.Wallet(network.config.accounts[0], ethers.provider)

        //create a Trantor contract factory
        const Trantor = await ethers.getContractFactory("Trantor", wallet)
        //create a Trantor contract instance
        //this is what you will call to interact with the deployed contract
        const trantor = await Trantor.attach(contractAddr)

        //convert piece CID string to hex bytes
        const cidHexRaw = new CID(ipfsCid).toString('base16').substring(1)
        const cidHex = "0x00" + cidHexRaw
        console.log("Adding object with ipfsCid", ipfsCid)
        console.log("Hex bytes of ipfsCid are:", cidHex)


        //send transaction to call addObject() method
        const object = await trantor.objects(cidHex);
        console.log('Got object data')
        console.log(object)
        const providers = await trantor.getActiveProviders(cidHex);
        console.log(providers)
        const dealsList = await trantor.getObjectDealsList(cidHex);
        console.log('Got object deals')
        console.log(dealsList)
        console.log(object.deals)
        console.log("Complete!")
    })
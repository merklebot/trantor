const CID = require("cids");
task(
    "add-object",
    "Adds object to Trantor bucket"
)
    .addParam("contract", "The address of the Trantor contract")
    .addParam("ipfscid", "Ipfs cid of data you want to store")
    .addParam("filesize", "Filesize of the data")
    .addParam("iscar", "Is data a car archive")
    .addParam("original", "Public available web2 url of the data")
    .addParam("filename", "Filename to easier identify you objects")
    .setAction(async (taskArgs) => {
        //store taskargs as useable variables
        const contractAddr = taskArgs.contract
        const ipfsCid = taskArgs.ipfscid
        const filesize = taskArgs.filesize
        const isCar = taskArgs.iscar
        const originalUrl = taskArgs.original
        const filename = taskArgs.filename

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
        transaction = await trantor.addObject(cidHex, filesize, isCar, originalUrl, filename)
        const receipt = await transaction.wait()
        console.log("Complete!")
    })
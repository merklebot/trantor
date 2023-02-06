export const CONTRACT_JSON = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [
            {
                "internalType": "bytes",
                "name": "ipfsCid",
                "type": "bytes"
            },
            {
                "internalType": "uint64",
                "name": "filesize",
                "type": "uint64"
            },
            {
                "internalType": "bool",
                "name": "isCar",
                "type": "bool"
            },
            {
                "internalType": "string",
                "name": "originalUrl",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "filename",
                "type": "string"
            }
        ],
        "name": "addObject",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint64",
                "name": "",
                "type": "uint64"
            }
        ],
        "name": "deals",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "int64",
                        "name": "start",
                        "type": "int64"
                    },
                    {
                        "internalType": "int64",
                        "name": "end",
                        "type": "int64"
                    }
                ],
                "internalType": "struct MarketTypes.GetDealTermReturn",
                "name": "dealTerm",
                "type": "tuple"
            },
            {
                "internalType": "uint64",
                "name": "providerId",
                "type": "uint64"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes",
                "name": "ipfsCid",
                "type": "bytes"
            }
        ],
        "name": "getActiveProviders",
        "outputs": [
            {
                "internalType": "uint64[]",
                "name": "",
                "type": "uint64[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes",
                "name": "ipfsCid",
                "type": "bytes"
            }
        ],
        "name": "getObjectDealsList",
        "outputs": [
            {
                "internalType": "uint64[]",
                "name": "deals",
                "type": "uint64[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "maxPrice",
        "outputs": [
            {
                "internalType": "uint64",
                "name": "",
                "type": "uint64"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes",
                "name": "",
                "type": "bytes"
            }
        ],
        "name": "objects",
        "outputs": [
            {
                "internalType": "uint64",
                "name": "filesize",
                "type": "uint64"
            },
            {
                "internalType": "string",
                "name": "originalUrl",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "filename",
                "type": "string"
            },
            {
                "internalType": "bool",
                "name": "isCar",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "objectsList",
        "outputs": [
            {
                "internalType": "bytes",
                "name": "",
                "type": "bytes"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "replicasNumber",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint64",
                "name": "newMaxPrice",
                "type": "uint64"
            },
            {
                "internalType": "uint256",
                "name": "newReplicasNumber",
                "type": "uint256"
            }
        ],
        "name": "setStoringRules",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint64",
                "name": "dealId",
                "type": "uint64"
            }
        ],
        "name": "verifyDeal",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
]
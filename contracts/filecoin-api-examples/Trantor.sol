pragma solidity ^0.8.0;

import {MarketAPI} from "@zondax/filecoin-solidity/contracts/v0.8/MarketAPI.sol";
import {MarketTypes} from "@zondax/filecoin-solidity/contracts/v0.8/types/MarketTypes.sol";


// expected storage deal duration is 180 days | replicationNumber is 6
contract Trantor {

    struct Deal {
        MarketTypes.GetDealTermReturn dealTerm;
        uint64 providerId;
    }


    struct Object {
        uint64[] dealsList; // dealId => Deal
        uint64 filesize;
        string originalUrl;
        string filename;
        bool isCar;

    }

    address public owner;

    // Storage rules
    uint64 public maxPrice;
    uint public replicasNumber;

    // Storage objects info
    bytes[] public objectsList;
    mapping(bytes => Object) public objects; // ipfsCid => Object
    mapping(uint64 => Deal) public deals; // dealId => Deal


    constructor() {
        owner = msg.sender;
        replicasNumber = 6;
    }

    modifier onlyByOwner() {
        require(
            msg.sender == owner,
            "Sender is not owner."
        );
        _;
    }

    function setStoringRules(uint64 newMaxPrice, uint newReplicasNumber) public onlyByOwner() {
        maxPrice = newMaxPrice;
        replicasNumber = newReplicasNumber;
    }


    function addObject(bytes calldata ipfsCid, uint64 filesize, bool isCar, string calldata originalUrl, string calldata filename) public onlyByOwner() {
        Object memory object = Object({dealsList:new uint64[](0), filesize: filesize, originalUrl: originalUrl, filename: filename, isCar: isCar});
        objects[ipfsCid] = object;
        objectsList.push(ipfsCid);

    }

    function getActiveProviders(bytes memory ipfsCid) public view returns (uint64[] memory){
        uint64[] memory providers = new uint64[](replicasNumber);
        uint lastP = 0;
        for (uint i = 0; i < objects[ipfsCid].dealsList.length; i++) {
            Deal memory deal = deals[objects[ipfsCid].dealsList[i]];
            providers[lastP] = deal.providerId;
            lastP++;
        }
        return providers;
    }


    function verifyDeal(uint64 dealId) public {
        MarketTypes.GetDealDataCommitmentReturn memory commitmentRet = MarketAPI.getDealDataCommitment(dealId);

        Object memory object = objects[commitmentRet.data];

        require(commitmentRet.size == object.filesize, 'Object filesize and deal filesize are not same');
        require(deals[dealId].providerId!=0, 'Deal already verified');
        MarketTypes.GetDealTermReturn memory dealTerm = MarketAPI.getDealTerm(dealId);
        uint64 dealProviderActorId = MarketAPI.getDealProvider(dealId).provider;

        deals[dealId] = Deal(dealTerm, dealProviderActorId);
        objects[commitmentRet.data].dealsList.push(dealId);
    }


}
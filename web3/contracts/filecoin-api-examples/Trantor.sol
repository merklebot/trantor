pragma solidity ^0.8.0;

import {MarketAPI} from "@zondax/filecoin-solidity/contracts/v0.8/MarketAPI.sol";
import {MarketTypes} from "@zondax/filecoin-solidity/contracts/v0.8/types/MarketTypes.sol";
import { Actor, HyperActor } from "../lib/filecoin-solidity/contracts/v0.8/utils/Actor.sol";
import { Misc } from "../lib/filecoin-solidity/contracts/v0.8/utils/Misc.sol";


// expected storage deal duration is 180 days | replicationNumber is 6
contract Trantor {

    address constant CALL_ACTOR_ID = 0xfe00000000000000000000000000000000000005;
    uint64 constant DEFAULT_FLAG = 0x00000000;
    uint64 constant METHOD_SEND = 0;

    function call_actor_id(uint64 method, uint256 value, uint64 flags, uint64 codec, bytes memory params, uint64 id) public returns (bool, int256, uint64, bytes memory) {
        (bool success, bytes memory data) = address(CALL_ACTOR_ID).delegatecall(abi.encode(method, value, flags, codec, params, id));
        (int256 exit, uint64 return_codec, bytes memory return_value) = abi.decode(data, (int256, uint64, bytes));
        return (success, exit, return_codec, return_value);
    }

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
    uint64 public tip;
    uint public replicasNumber;

    // Storage objects info
    bytes[] public objectsList;
    mapping(bytes => Object) public objects; // ipfsCid => Object
    mapping(uint64 => Deal) public deals; // dealId => Deal


    constructor() {
        owner = msg.sender;
        replicasNumber = 6;
        tip = 50000000000000000;
        // 0.05 FIL
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

    function filesizeToGibs(uint64 filesize) public view returns (uint) {
        return (filesize / 1073741824 + (((filesize % 1073741824) != 0) ? 1 : 0));
    }

    function getObjectDealsList(bytes calldata ipfsCid) public view returns (uint64[] memory deals){
        return objects[ipfsCid].dealsList;
    }

    function addObject(bytes calldata ipfsCid, uint64 filesize, bool isCar, string calldata originalUrl, string calldata filename) public onlyByOwner() {
        if (objects[ipfsCid].filesize > 0) {
            return;
        }
        Object memory object = Object({dealsList : new uint64[](0), filesize : filesize, originalUrl : originalUrl, filename : filename, isCar : isCar});

        objects[ipfsCid] = object;
        objectsList.push(ipfsCid);


    }

    function getActiveProviders(bytes memory ipfsCid) public view returns (uint64[] memory){
        //TODO check using current block number
        uint64[] memory providers = new uint64[](replicasNumber);
        uint lastP = 0;
        for (uint i = 0; i < objects[ipfsCid].dealsList.length; i++) {
            Deal memory deal = deals[objects[ipfsCid].dealsList[i]];
            providers[lastP] = deal.providerId;
            lastP++;
        }
        return providers;
    }
    function bytesToUint(bytes memory b) internal pure returns (uint256){
        uint256 number;
        for(uint i=0;i<b.length;i++){
            number = number + uint(uint8(b[i]))*(2**(8*(b.length-(i+1))));
        }
    return number;
}



    function verifyDeal(uint64 dealId) public {
        MarketTypes.GetDealDataCommitmentReturn memory commitmentRet = MarketAPI.getDealDataCommitment(dealId);
        uint64[] memory activeProviders = getActiveProviders(commitmentRet.data);
        MarketTypes.GetDealTermReturn memory dealTerm = MarketAPI.getDealTerm(dealId);

        uint256 dealPricePerEpoch = bytesToUint(MarketAPI.getDealTotalPrice(dealId).price_per_epoch.val);
        uint64 dealClient = MarketAPI.getDealClient(dealId).client;

        uint64 dealProviderActorId = MarketAPI.getDealProvider(dealId).provider;
        uint activeProvidersNum = 0;
        for (uint i = 0; i < activeProviders.length; i++) {
            if (activeProviders[i] != 0) {
                activeProvidersNum++;
            }
            if (dealProviderActorId == activeProviders[i]) {
                return;
            }
        }
        if (activeProvidersNum >= replicasNumber) {
            return;
        }


        deals[dealId] = Deal(dealTerm, dealProviderActorId);
        objects[commitmentRet.data].dealsList.push(dealId);


        uint256 gibsize = filesizeToGibs(commitmentRet.size);
        uint64 dealDuration = uint64(dealTerm.end - dealTerm.start);
        uint256 paymentAmount = dealDuration * dealPricePerEpoch * gibsize + tip * gibsize;

        bytes memory emptyParams = "";
        delete emptyParams;

        HyperActor.call_actor_id(METHOD_SEND, paymentAmount, DEFAULT_FLAG, Misc.NONE_CODEC, emptyParams, dealClient);


    }


}
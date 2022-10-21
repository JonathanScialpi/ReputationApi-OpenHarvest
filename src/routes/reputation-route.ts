import express from "express";
import { AwsKmsSigner } from "../web3/AwsKmsSigner";
import { gnosisConnection } from "../web3/authentication-functions";
import { ColonyNetwork } from '@colony/sdk';

const router = express.Router();
const dotenv = require('dotenv');
dotenv.config({ path: '../.env' });

// connect to Gnosis network
const ethers = require('ethers');
const provider = gnosisConnection();
const openHarvestSigner = new AwsKmsSigner(process.env.OPEN_HARVEST_KEY_ID!, provider);

// connect OH account to Heifer colony
const colonyNetwork = new ColonyNetwork(openHarvestSigner);

/// @notice Rest endpoint responsible for paying 
/// @param amount (STRING) the total amount of reputation tokens to be sent to the farmer's address
/// @param farmerEthereumAddress (STRING)  the address we are sending the reputation payment to
/// @returns {payment_status : STRING}
router.post('/pay', async(req,res) => {
    try{
        const colony = await colonyNetwork.getColony(process.env.HEIFER_COLONY_CONTRACT_ADDRESS!);
        await colony.pay(req.body.farmerEthereumAddress, ethers.utils.parseUnits(req.body.amount));
        res.status(200).json({payment_status : "success"});
    }catch(e){
        res.status(400).json({error: e})
    }
});

/// @notice Rest endpoint responsible for paying 
/// @param farmerEthereumAddress (STRING)  the address we are sending the reputation payment to
/// @returns { colony_balance : STRING, ethereum_address: STRING, reputation : STRING }
router.post('/balance', async(req,res) => {
    try{
        const colony = await colonyNetwork.getColony(process.env.HEIFER_COLONY_CONTRACT_ADDRESS!);
        const balance = await colony.getBalance();
        const reputation = await colony.getReputation(req.body.farmerEthereumAddress);
        res.status(200).json({
            colony_balance : balance.toString(),
            ethereum_address: req.body.farmerEthereumAddress,
            reputation : reputation.toString()
        });
    }catch(e){
        res.status(400).json({error : e.toString()});
    }
});

module.exports = router;
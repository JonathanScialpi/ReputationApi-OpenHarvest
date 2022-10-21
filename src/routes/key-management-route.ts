import express from "express";
import { kmsAuth } from '../web3/authentication-functions';
import { AwsKmsSigner } from '../web3/AwsKmsSigner';

const router = express.Router();
const dotenv = require('dotenv');
dotenv.config({ path: '../.env' });
const kms = kmsAuth();

router.post('/createEthAccount', async(req,res) => {
    console.log("req: ", req.body.farmerId)
    try{
        //Create Key
        const cmk = await kms.createKey({
            KeyUsage : 'SIGN_VERIFY',
            KeySpec : 'ECC_SECG_P256K1',
        }).promise();

        // Assign farmerId as alias of created key
        const keyId = cmk.KeyMetadata.KeyId;
        await kms.createAlias({
            AliasName : "alias/" + req.body.farmerId,
            TargetKeyId : keyId
        }).promise();

        //Grant the application user IAM role permissions on the new key
        await kms.createGrant({
            KeyId : keyId,
            GranteePrincipal : process.env.OPEN_HARVEST_APPLICATION_USER_ARN,
            Operations : ['GetPublicKey', 'Sign']
        }).promise();
        
        const farmerSigner = new AwsKmsSigner(keyId);
        const ethAddress = await farmerSigner.getAddress();
        res.status(200).json({ethereumAddress : ethAddress}); 
    }catch(e){
        res.status(400).json({error: e.toString()});
    }
});

module.exports = router;
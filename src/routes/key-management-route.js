const express = require('express');
const router = express.Router();
const dotenv = require('dotenv');
dotenv.config({ path: '../.env' });

router.post('/createEthAccount', async(req,res) => {
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

        const ethAddress = kms.getEthereumAddress(kms.getPublicKey(keyId));
        res.status(200).json({ethereumAddress : ethAddress}); 
    }catch(e){
        res.status(500).json(e);
    }
});

module.exports = router;
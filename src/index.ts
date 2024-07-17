import { Api, JsonRpc } from 'eosjs';
import { JsSignatureProvider, PrivateKey, PublicKey } from 'eosjs/dist/eosjs-jssig';  // DEVELOPMENT ONLY, THIS IS INSECURE!!! https://developers.eos.io/manuals/eosjs/latest/faq/what-is-a-signature-provider
import dotenv from 'dotenv';
import { generate, decrypt } from '@greymass/keycert'
import { hexToUint8Array } from 'eosjs/dist/eosjs-serialize';
import { TransactionBuilder } from 'eosjs/dist/eosjs-api';
const ecc = require('eosjs-ecc');

dotenv.config();

const privateKey = process.env.PRIVATE_KEY
console.log(privateKey);

const privateKeys = [process.env.PRIVATE_KEY as string];
const accountName = process.env.ACCOUNT_NAME as string;

const signatureProvider = new JsSignatureProvider(privateKeys);
const jungleUrl = 'https://jungle4.cryptolions.io:443';
const mainnetUrl = 'https://eos.greymass.com/';
const rpc = new JsonRpc(jungleUrl); //required to read blockchain state
const api = new Api({ rpc, signatureProvider }); //required to submit transactions

(async () => {
  // const delegatebwActions = [{
  //   account: 'eosio',
  //   name: 'delegatebw',
  //   authorization: [{
  //     actor: accountName,
  //     permission: 'owner',
  //   }],
  //   data: {
  //     from: accountName,
  //     receiver: accountName,
  //     stake_net_quantity: '1.0000 EOS',
  //     stake_cpu_quantity: '1.0000 EOS',
  //     transfer: false,
  //   }
  // }]
  const buyRamAction = {
    account: 'eosio',
    name: 'buyrambytes',
    authorization: [{
      actor: accountName,
      permission: 'active',
    }],
    data: {
      payer: accountName,
      receiver: accountName,
      bytes: 8192,
    },
  }
  const buyRamActions = [buyRamAction];

  const newAccountName = 'wquwb24l5bms';
  const newAccountActiveKey = 'EOS68yq6S171iqQWxwXBe4HmE63TLY5C6ubp6sZTHD4PmN6cMQuh5'
  const newAccountOwnerKey = 'EOS5qzfPpijq9LNvWytqxjb5CXNsmwdzrZqqm2LUcYsdkZDzuFBtm'

  const createAccountActions = [
    {
      account: 'eosio',
      name: 'newaccount',
      authorization: [{
        actor: accountName,
        permission: 'active',
      }],
      data: {
        creator: accountName,
        name: newAccountName,
        owner: {
          threshold: 1,
          keys: [{
            key: newAccountOwnerKey,
            weight: 1
          }],
          accounts: [],
          waits: []
        },
        active: {
          threshold: 1,
          keys: [{
            key: newAccountActiveKey,
            weight: 1
          }],
          accounts: [],
          waits: []
        },
      }
    },
    //   {
    //     account: 'eosio',
    //     name: 'ramtransfer',
    //     authorization: [{
    //       actor: accountName,
    //       permission: 'active',
    //     }],
    //     data: {
    //       bytes: 4096,
    //       from: accountName,
    //       memo: "",
    //       to: newAccountName
    //     },
    //   },
    // }
    {
      account: 'eosio',
      name: 'buyrambytes',
      authorization: [{
        actor: accountName,
        permission: 'active',
      }],
      data: {
        payer: accountName,
        receiver: newAccountName,
        bytes: 2965,
      },
    },
    // {
    //   account: 'eosio',
    //   name: 'delegatebw',
    //   authorization: [{
    //     actor: accountName,
    //     permission: 'active',
    //   }],
    //   data: {
    //     from: accountName,
    //     receiver: newAccountName,
    //     stake_net_quantity: '1.0000 SYS',
    //     stake_cpu_quantity: '1.0000 SYS',
    //     transfer: false,
    //   }
    // }
  ]

  // const ramReceiver = 'ekrieidovkdk';
  // const ramTransferActions = [{
  //   account: 'eosio',
  //   name: 'ramtransfer',
  //   authorization: [{
  //     actor: accountName,
  //     permission: 'active',
  //   }],
  //   data: {
  //     bytes: 4096,
  //     from: accountName,
  //     memo: "",
  //     to: ramReceiver
  //   },
  // }]

  const sendTokenAction = {
    account: 'eosio.token',
    name: 'transfer',
    authorization: [{
      actor: accountName,
      permission: 'active',
    }],
    data: {
      from: accountName,
      to: 'mangalaprovn',
      quantity: '0.5000 EOS',
      memo: 'some memo'
    }
  }

  const sendTokenActions = [sendTokenAction]

  const powerUpActions = [{
    account: 'eosio',
    name: 'powerup',
    authorization: [{
      actor: accountName,
      permission: 'active',
    }],
    data: {
      payer: accountName,
      receiver: accountName,
      days: 1,
      net_frac: 20000000000,
      cpu_frac: 80000000000,
      max_payment: '10.0000 EOS',
    }
  }]

  const rexActions = [{
    account: 'eosio',
    name: 'deposit',
    authorization: [{
      actor: accountName,
      permission: 'active',
    }],
    data: {
      owner: accountName,
      amount: '10.0000 EOS',
    }
  }, {
    account: 'eosio',
    name: 'rentcpu', // Can either be rentcpu or rentrex
    authorization: [{
      actor: accountName,
      permission: 'active',
    }],
    data: {
      from: accountName,
      receiver: accountName,
      loan_payment: '10.0000 EOS',
      loan_fund: '0.0000 EOS',
    },
  }]

  // const serializedTransaction = api.serializeTransaction({
  //   actions: rexActions,
  //   expiration: '2024-07-05T15:19:28.000',
  //   ref_block_num: 58891,
  //   ref_block_prefix: 1148260653,
  // })
  // console.log(serializedTransaction);
  

  const test = hexToUint8Array('1cd397664335b18ccbe500000000010000735802ea305500000040615ae9ad0110c255335f53113200000000a8ed32323110c255335f531132000000204873bd3e0210c255335f53113200000000a8ed323220c255335f53113200000000a8ed323200')
  console.log(test);
  const deserializedTransaction = api.deserializeTransaction(test);
  console.log(deserializedTransaction);
  // console.log(deserializedTransaction.actions[0].authorization);
  // console.log(hexToUint8Array(deserializedTransaction.actions[0].data))

  // const serializedTransaction = api.serializeTransaction(deserializedTransaction);
  // console.log(serializedTransaction);

  const cosign_noop = {
    account: 'greymassnoop',
    name: 'noop',
    authorization: [
      {
        actor: 'greymassfuel',
        permission: 'cosign',
      }
    ],
    data: {}
  }
  
  const actionsList = [cosign_noop, sendTokenAction]

  // const transaction = await api.transact({
  //   actions: actionsList
  // }, {
  //   blocksBehind: 3,
  //   expireSeconds: 30,
  // });
  // console.log(transaction);

  // const accountDetails = await rpc.get_account('hamsterchain')
  // console.log(accountDetails);
  // console.log(accountDetails.permissions[0].required_auth);
  // console.log(accountDetails.permissions[1].required_auth);

  // const randomKey = await ecc.unsafeRandomKey()
  // console.log(randomKey);

  // // const input = randomKey.toString()
  // const input = 'PVT_K1_6XHWTx1hGCifFRfJxS9aGDtqctnPc8sG6T2EwhRrgVyLnHwha'
  // const inputPublic = 'PUB_K1_6BcojHgkD4Ayitvci5Upgx9LT48KWqxGmmPaWkoyRMT2ZNx2cs'

  // const publicKey = PublicKey.fromString(inputPublic)
  // const publicKeyLegacy = publicKey.toLegacyString()
  // console.log(publicKeyLegacy);


  // const privateKey = PrivateKey.fromString(input)
  // const privateKeyK1Format = privateKey.toString()
  // const publicKey = privateKey.getPublicKey();
  // console.log(`Public Key: ${publicKey.toString()}`);
  // console.log(`Legacy Public Key: ${publicKey.toLegacyString()}`);
  // console.log(`Standard Private Key: ${randomKey}`);
  // console.log(`PVT_K1_ Private Key: ${privateKeyK1Format}`);

  // const privateKey = 'PVT_R1_27ngUUNx1U9ct6waqbE3yAfvv1THmouAh3NjU2iAzA4BeYxK3G'
  // const privKey = PrivateKey.fromString(privateKey)
  // const privKeyLegacy = privKey.toLegacyString()
  // const publicKey = privKey.getPublicKey().toLegacyString()
  // console.log(publicKey);
  // console.log(privKeyLegacy);

  // const privateKeys = [
  //   'PVT_R1_27ngUUNx1U9ct6waqbE3yAfvv1THmouAh3NjU2iAzA4BeYxK3G',
  //   'PVT_R1_XfrbXUYupNxBNZR1Sfquea1kJEYE1Zb6CBqkEd4eBBgy2r9zV',
  //   'PVT_R1_28vuqoJByptvX3MemauTi8xhkQydz1bfER9v6vBfvLB4Y9CCmz',
  //   'PVT_R1_2tjqJ5mQ8YjT8ZVTJrKSFSbdAHTeEumxsdfnyn1nGKPqrUT7Y1',
  //   'PVT_R1_bt1FUeqnEMTq9UJKXn6AdCBPkXKjrWx8ZfxS18g89Drsahod3',
  //   'PVT_R1_2pqadvm79FR2PfLgjeBEXipmspZg3ECv4YvBE7rwxheY937MSs',
  //   'PVT_R1_TVJVMF5SoXBUsKxwh8Jtv3wZyYsmYAwAN9RS7MxPLajG1dncb'
  // ];

  // privateKeys.forEach(privateKey => {
  //   const privKey = PrivateKey.fromString(privateKey);
  //   const privKeyLegacy = privKey.toLegacyString();
  //   const publicKey = privKey.getPublicKey();
  //   const publicKeyLegacy = publicKey.toLegacyString();

  //   console.log(`Private Key: ${privateKey}`);
  //   console.log(`Legacy Private Key: ${privKeyLegacy}`);
  //   console.log(`Public Key: ${publicKey.toString()}`);
  //   console.log(`Legacy Public Key: ${publicKeyLegacy}`);
  //   console.log('---');
  // });

  // const publicKey = 'PUB_K1_7L2JAxku6J4Xsgjs1pV4ihMp6wNsxfpZJUArqstNbzZHFwpZna'
  // const pubKey = PublicKey.fromString(publicKey)
  // const pubKeyLegacy = pubKey.toLegacyString()
  // console.log(pubKeyLegacy);

  // const getAbi = await rpc.get_abi('eosio')
  // console.log(getAbi.abi?.actions);
  // console.log(getAbi.abi?.tables.map(table => table.name));

  // const result = await rpc.get_table_rows({
  //   json: true,               // Get the response as json
  //   code: 'eosio',      // Contract that we target
  //   scope: 'eosio',         // Account that owns the data
  //   table: 'rammarket',        // Table name
  //   limit: 10,                // Maximum number of rows that we want to get
  //   reverse: false,           // Optional: Get reversed data
  //   show_payer: false          // Optional: Show ram payer
  // });
  // console.log(result.rows[0].base);
  // console.log(result.rows[0].quote);

  // const decryptResult = await decrypt(
  //   'anchorcert:KgKgBT5ajPc6VroP2hHk2S4COKSiqnT8z0bVqRB0aEAAAAAAXHMoXQAAAACAqyanACTh3X6hzLZx-dGsO0swCpi2WDg_Xd8mSK-C2kY_gygHpHe8jNk',
  //   ['number', 'arrow', 'twenty', 'permit', 'much', 'caution']
  // )
  // console.log(decryptResult);

})();

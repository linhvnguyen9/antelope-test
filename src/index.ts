import { Api, JsonRpc } from 'eosjs';
import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig';  // DEVELOPMENT ONLY, THIS IS INSECURE!!! https://developers.eos.io/manuals/eosjs/latest/faq/what-is-a-signature-provider
import dotenv from 'dotenv';

dotenv.config();

const privateKey = process.env.PRIVATE_KEY
console.log(privateKey);

const privateKeys = [process.env.PRIVATE_KEY as string];
const accountName = process.env.ACCOUNT_NAME as string;

const signatureProvider = new JsSignatureProvider(privateKeys);
const rpc = new JsonRpc('https://jungle4.cryptolions.io:443'); //required to read blockchain state
const api = new Api({ rpc, signatureProvider }); //required to submit transactions

(async () => {
  const buyRamActions = [{
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
  }];

  const newAccountName = 'erdoxlwldoro';
  const newAccountOwnerKey = 'EOS6EVrDX2TDGybJNXuHyzz6SpRwmSsL4yC75u5gYnkozeDJav4ok'
  const newAccountActiveKey = 'EOS7tvPWbq3Q6vRjeaYhHs3iLatmyn2ZZU6GcKNkj77LzJJUBgDqB'

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
    {
      account: 'eosio',
      name: 'ramtransfer',
      authorization: [{
        actor: accountName,
        permission: 'active',
      }],
      data: {
        bytes: 4096,
        from: accountName,
        memo: "",
        to: newAccountName
      },
    },
    // }
    // {
    //   account: 'eosio',
    //   name: 'buyrambytes',
    //   authorization: [{
    //     actor: accountName,
    //     permission: 'active',
    //   }],
    //   data: {
    //     payer: accountName,
    //     receiver: newAccountName,
    //     bytes: 2965,
    //   },
    // },
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

  const ramReceiver = 'ekrieidovkdk';
  const ramTransferActions = [{
    account: 'eosio',
    name: 'ramtransfer',
    authorization: [{
      actor: accountName,
      permission: 'active',
    }],
    data: {
      bytes: 4096,
      from: accountName,
      memo: "",
      to: ramReceiver
    },
  }]

  // const transaction = await api.transact({
  //   actions: createAccountActions
  // }, {
  //   blocksBehind: 3,
  //   expireSeconds: 30,
  // });
  // console.log(transaction);
  const accountDetails = await rpc.get_account('erdoxlwldoro')
  console.log(accountDetails);
  console.log(accountDetails.permissions[0].required_auth.keys[0].key);
  console.log(accountDetails.permissions[1].required_auth.keys[0].key);
})();

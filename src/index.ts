import { Api, JsonRpc } from 'eosjs';
import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig';  // development only
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
  const transaction = await api.transact({
    actions: [{
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
    }]
  }, {
    blocksBehind: 3,
    expireSeconds: 30,
  });
  console.log(transaction);
})();

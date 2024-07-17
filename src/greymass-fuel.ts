import { Api, JsonRpc } from "eosjs";
import { AuthorityProvider, AuthorityProviderArgs } from "eosjs/dist/eosjs-api-interfaces";
import { JsSignatureProvider } from "eosjs/dist/eosjs-jssig";
import { convertLegacyPublicKeys } from "eosjs/dist/eosjs-numeric";
import { Action, Authorization } from "eosjs/dist/eosjs-serialize";
import dotenv from 'dotenv';

const rpc = new JsonRpc('http://jungle.greymass.com', { fetch });

dotenv.config();

const privateKey = process.env.PRIVATE_KEY
console.log(privateKey);
const privateKeys = [process.env.PRIVATE_KEY as string];
const accountName = process.env.ACCOUNT_NAME as string;

// The cosigner account expected to sign this transaction
const cosignerAccount = 'greymassfuel';

// The cosigner permission expected to sign this transaction
const cosignerPermission = 'cosign';

// The user account performing the transaction
const userAccount = accountName;

// The user account permission performing the transaction
const userPermission = 'active';

// The signature provider + private key for the user account to partially sign
const signatureProvider = new JsSignatureProvider(privateKeys);

// A custom cosigner AuthorityProvider for EOSJS v2
// This provider overrides the checks on all keys,
// allowing a partially signed transaction to be
// broadcast to the API node.
class CosignAuthorityProvider implements AuthorityProvider {
  async getRequiredKeys(args: AuthorityProviderArgs) {
    const { transaction } = args;
    // Iterate over the actions and authorizations
    transaction.actions.forEach((action: Action, ti: number) => {
        action.authorization.forEach((auth: Authorization, ai: number) => {
        // If the authorization matches the expected cosigner
        // then remove it from the transaction while checking
        // for what public keys are required
        if ( auth.actor === cosignerAccount && auth.permission === cosignerPermission ) {
            console.log('Removing cosigner authorization', transaction.actions[ti]);
            
            transaction.actions[ti].authorization.splice(ai, 1)
            // transaction.actions[ti].authorization = transaction.actions[ti].authorization.splice(ai, 1)
        }
      })
    });
    console.log('Available keys', args.availableKeys)
    console.log('Transaciton', JSON.stringify(transaction))

    const requiredKeysResponse = await rpc.fetch('/v1/chain/get_required_keys', {
        transaction,
        available_keys: args.availableKeys,
      })
    console.log(requiredKeysResponse);
    const requiredKeys = requiredKeysResponse.required_keys;
    console.log('Required keys', requiredKeys)
    return convertLegacyPublicKeys(requiredKeys);
  }
}

// Pass in new authorityProvider
const api = new Api({
  authorityProvider: new CosignAuthorityProvider(),
  rpc,
  signatureProvider,
  textDecoder: new TextDecoder(),
  textEncoder: new TextEncoder()
});

async function main() {
  // Sign and broadcast the transaction, with two actions
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

  const result = await api.transact({
    actions: [
      // The first action in the transaction must be a blank `greymassnoop:noop`
      {
        // The authorization for the noop only needs to include the cosigner.
        // This action and its authorization are what pay the resource costs for the
        // entire transaction and all its actions.
        authorization: [{
          actor: cosignerAccount,
          permission: cosignerPermission,
        }],
        account: 'greymassnoop',
        name: 'noop',
        data: {}
      },
      // The second (or third, fourth...) action in the transaction can be anything
      buyRamAction
    //   {
    //     // The only authorization required is that of the user
    //     authorization: [{
    //       actor: userAccount,
    //       permission: userPermission,
    //     }],
    //     account: 'eosio',
    //     name: 'voteproducer',
    //     data: {
    //       voter: userAccount,
    //       proxy: 'greymassvote',
    //       producers: []
    //     },
    //   }
    ]
  }, {
    blocksBehind: 3,
    expireSeconds: 30,
  });

  console.log(result)
}

main();

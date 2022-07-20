import { logError } from './logger';
import { CTransactionSegWit } from '@defichain/jellyfish-transaction';
import { Prevout } from '@defichain/jellyfish-transaction-builder/dist/provider';
import { MnemonicStorage } from './encryption';
import { Network, MainNet, TestNet } from '@defichain/jellyfish-network';

/**
 * Checks if a certain String is null or empty
 *
 * @param value the text to be checked
 * @returns true or false
 */
const isStringNullOrEmpty = (value: string | string[]): boolean => {
  return value === undefined || value.length === 0;
};

/**
 * Creating a Prevout Object from a transactionObject
 *
 * @param tx transaction to convert to prevout
 * @returns prevout Object
 */
function prevOutFromTx(tx: CTransactionSegWit): Prevout {
  return {
    txid: tx.txId,
    vout: 1,
    value: tx.vout[1].value,
    script: tx.vout[1].script,
    tokenId: tx.vout[1].tokenId
  };
}

/**
 * Returns the seed unencrypted.
 *
 * @param seed The encrypted seed
 * @param passphrase the passphrase to decrypt
 * @returns the seed as string array
 */
async function getSeed(seed: string, passphrase: string): Promise<string[]> {
  let decryptedSeed: string[] = [];
  if (!isStringNullOrEmpty(seed))
    return await MnemonicStorage.decrypt(seed, passphrase);
  return decryptedSeed;
}

// returns the network as Network from the Jellyfish API
const getDFINetwork = (network: string): Network =>
  network === 'mainnet' ? MainNet : TestNet;

const checkPasswords = (pass1: string, pass2: string): boolean => {
  return (
    !isStringNullOrEmpty(pass1) &&
    !isStringNullOrEmpty(pass2) &&
    pass1 == pass2 &&
    pass1.length > 5
  );
};

export {
  isStringNullOrEmpty,
  prevOutFromTx,
  getSeed,
  getDFINetwork,
  checkPasswords
};

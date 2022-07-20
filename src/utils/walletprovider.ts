import { WalletClassic } from '@defichain/jellyfish-wallet-classic';
import {
  WhaleWalletAccount,
  WhaleWalletAccountProvider
} from '@defichain/whale-api-wallet';
import { JellyfishWallet } from '@defichain/jellyfish-wallet';
import {
  Bip32Options,
  MnemonicHdNodeProvider
} from '@defichain/jellyfish-wallet-mnemonic';
import { Network } from '@defichain/jellyfish-network';
import { WhaleApiClient } from '@defichain/whale-api-client';
import { getDFIChainConfig } from '../config/configuration';
import { Wallet } from '../interfaces';

const SEED_PHRASE_LENGTH = 24;
/**
 * Provides the correct wallet based on the seed structure
 */
class WalletProvider {
  private readonly client: WhaleApiClient;
  constructor() {
    this.client = new WhaleApiClient(getDFIChainConfig());
  }

  getClient(): WhaleApiClient {
    return this.client;
  }

  getWallet(seed: string[], network: Network): Wallet {
    if (seed && seed.length === SEED_PHRASE_LENGTH) {
      return {
        wallet: new JellyfishWallet(
          MnemonicHdNodeProvider.fromWords(
            seed,
            WalletProvider.bip32Options(network),
            true
          ),
          new WhaleWalletAccountProvider(this.client, network)
        )
      };
    } else {
      throw new Error(
        `Please check your seedphrase (length: ${seed?.length}). It does not seem to be valid!`
      );
    }
  }

  private static bip32Options(network: Network): Bip32Options {
    return {
      bip32: {
        public: network.bip32.publicPrefix,
        private: network.bip32.privatePrefix
      },
      wif: network.wifPrefix
    };
  }
}

export { WalletProvider };

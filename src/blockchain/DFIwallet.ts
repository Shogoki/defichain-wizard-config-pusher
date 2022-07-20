import { WalletProvider } from '../utils/walletprovider';
import { Wallet } from '../interfaces';
import { logDebug, logError, logInfo, logWarn } from '../utils/logger';
import { WhaleWalletAccount } from '@defichain/whale-api-wallet';
import { JellyfishWallet, WalletHdNode } from '@defichain/jellyfish-wallet';
import { BigNumber } from '@defichain/jellyfish-api-core';
import { AddressToken } from '@defichain/whale-api-client/dist/api/address';
import { WhaleApiClient } from '@defichain/whale-api-client';
import { Vault } from './Vault';
import { PoolPairData } from '@defichain/whale-api-client/dist/api/poolpairs';
import { TransactionHelper } from './TransactionHelper';
import { TokenData } from '@defichain/whale-api-client/dist/api/tokens';
import { LoanVaultActive } from '@defichain/whale-api-client/dist/api/loan';
import { Network } from '@defichain/jellyfish-network';

/**
 * The DFI Wallet that offers all operations on the wallet.
 */
class DFIWallet {
  private readonly client: WhaleApiClient;
  private readonly walletProvider: WalletProvider;
  private readonly wallet: Wallet;
  private vault: Vault;
  constructor(seed: string[], network: Network) {
    try {
      logInfo('Initializing wallet.');
      this.walletProvider = new WalletProvider();
      this.client = this.walletProvider.getClient();
      this.vault = new Vault(this.client);
      this.wallet = new WalletProvider().getWallet(seed, network);
      logInfo('Wallet successfully initialized!');
    } catch (e) {
      logWarn('Wallet initialization failed!');
      throw e;
    }
  }
  public getClient() {
    return this.client;
  }
  /**
   * Checks whether an address exists on the blockchain.
   *
   * @param address The address to check
   * @returns true, if the address exists on the blockchain
   */
  static async checkAddress(address: string): Promise<boolean> {
    try {
      await new WalletProvider().getClient().address.getBalance(address);
    } catch (e) {
      return false;
    }
    return true;
  }

  /**
   * Checks whether a seed for a wallet is correct.
   *
   * @param seed The seed to check
   * @param network The network to use
   * @returns true, if the seed is correct
   */
  static checkSeed(seed: string[], network: Network): boolean {
    try {
      new WalletProvider().getWallet(seed, network);
    } catch (e) {
      return false;
    }
    return true;
  }

  /**
   * Returns the account for a certain wallet address.
   *
   * @param walletAddress The address to check
   * @returns The account type (e.g. Desktop Wallet or Jellyfish)
   */
  async getAccount(
    walletAddress: string
  ): Promise<WhaleWalletAccount | undefined> {
    logDebug(`Trying to fetch wallet address: ${walletAddress}`);
    const DFIwallet = this.wallet.wallet as JellyfishWallet<
      WhaleWalletAccount,
      WalletHdNode
    >;

    const accounts = await DFIwallet.discover();
    if (accounts.length === 0) {
      throw new Error(
        'No accounts found for the given account. Please check your seed phrase or make sure you have at least one transaction in that wallet.'
      );
    } else {
      logInfo(`Wallets found: ${accounts.length}`);
    }
    this.wallet.account = undefined;
    for (let i = 0; i < accounts.length; i++) {
      const account = accounts[i];
      const address = await account.getAddress();
      if (address === walletAddress) {
        this.wallet.account = account;
        break;
      }
    }
    if (!this.wallet.account) {
      throw new Error(
        `Your given address (${walletAddress}) was not found on the wallet. Please check your config.`
      );
    }
    return this.wallet.account;
  }

  // returns the wallet address for the manager
  async getAddress(): Promise<string> {
    logInfo('getting address');
    return this.wallet.account?.getAddress() ?? '';
  }

  /**
   * Returns the current balance of a wallet.
   * @returns UTXOBalance A map containing the list of tokens available in the wallet.
   */
  async getUTXOBalance(): Promise<BigNumber> {
    return new BigNumber(
      await this.client.address.getBalance(await this.getAddress())
    );
  }

  /**
   * Returns a list of all tokens in the wallet.
   * @returns tokenbalance A map containing the list of tokens available in the wallet.
   */
  async getTokenBalances(): Promise<Map<string, AddressToken>> {
    const address = await this.getAddress();
    logDebug(`Address is ${address}`);
    const tokens = await this.client.address.listToken(address, 100);

    return new Map(tokens.map((token) => [token.symbol, token]));
  }

  /**
   * Returns a certain token balance.
   * @param symbol the token to get
   * @returns tokenbalance A map containing the list of tokens available in the wallet.
   */
  async getTokenBalance(symbol: string): Promise<AddressToken | undefined> {
    // TODO: Re-use getTokenBalances() call to not have redundant code.
    const tokens = await this.client.address.listToken(
      await this.getAddress(),
      100
    );

    return tokens.find((token) => {
      return token.isDAT && token.symbol === symbol;
    });
  }

  /**
   * Returns the current Blockhain from the Blockchain.
   */
  async getBlockHeight(): Promise<number> {
    return (await this.client.stats.get()).count.blocks;
  }

  /**
   * Returns a given pool pair.
   *
   * @param poolId The ID of the pool that should be returned.
   * @returns The Poolpair data or undefined if nothing was found.
   */
  async getPoolPair(poolId: string): Promise<PoolPairData | undefined> {
    const respose = await this.client.poolpairs.list(1000);
    return respose.find((pool) => {
      return pool.symbol == poolId;
    });
  }

  /**
   * Returns some information about a certain token.
   * @param token The token to get the info for.
   * @returns The info for the requested token.
   */
  async getToken(token: string): Promise<TokenData | undefined> {
    const tokens = (await this.client.tokens.list(999)).filter(
      (t) => t.symbolKey == token
    );
    if (tokens.length == 1) {
      return tokens[0];
    } else {
      logError(`Did find ${tokens.length} Tokens for Symbol ${token}`);
    }
  }

  async getTransactionHelper(address: string): Promise<TransactionHelper> {
    logInfo(`Getting transaction helper for ${address}`);
    const account = await this.getAccount(address);
    return new TransactionHelper(this.client, account!);
  }
}

export { DFIWallet };

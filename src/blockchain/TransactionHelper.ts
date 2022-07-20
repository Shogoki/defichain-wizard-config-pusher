import { WhaleApiClient } from '@defichain/whale-api-client';
import {
  CTransactionSegWit,
  DeFiTransactionConstants,
  TransactionSegWit,
  Transaction,
  Script,
  Vout,
  OP_PUSHDATA,
  OP_CODES
} from '@defichain/jellyfish-transaction';
import { Prevout } from '@defichain/jellyfish-transaction-builder/dist/provider';
import { calculateFeeP2WPKH } from '@defichain/jellyfish-transaction-builder/dist/txn/txn_fee';
import { BigNumber } from '@defichain/jellyfish-api-core';
import { WhaleWalletAccount } from '@defichain/whale-api-wallet';
import { logDebug, logError, logInfo, logWarn } from '../utils/logger';
import {
  P2WPKHTransactionBuilder,
  P2WPKHTxnBuilder
} from '@defichain/jellyfish-transaction-builder/dist';
import {
  WhaleFeeRateProvider,
  WhalePrevoutProvider
} from '@defichain/whale-api-wallet';
import { Network } from '@defichain/jellyfish-network';

export class TransactionHelper {
  private readonly client: WhaleApiClient;
  private readonly account: WhaleWalletAccount;
  constructor(client: WhaleApiClient, account: WhaleWalletAccount) {
    this.client = client;
    this.account = account;
  }

  /**
   * Sending a transaction allowing to add a PrevOut from previous transaction
   * @param txn The transaction to send
   * @param txn THe Prevout Object from the previous transaction
   * @param address The address to use for signing the transaction
   * @returns Transaction.
   */
  async sendTransactionWithPrevout(
    txn: TransactionSegWit,
    prevout: Prevout | undefined
  ): Promise<CTransactionSegWit> {
    if (prevout) {
      const customTx: Transaction = {
        version: DeFiTransactionConstants.Version,
        vin: [
          {
            txid: prevout.txid,
            index: prevout.vout,
            script: { stack: [] },
            sequence: 0xffffffff
          }
        ],
        vout: txn.vout,
        lockTime: 0x00000000
      };
      const fee = calculateFeeP2WPKH(
        new BigNumber(await this.client.fee.estimate(10)),
        customTx
      );
      customTx.vout[1].value = prevout.value.minus(fee);
      let signed = await this.account.signTx(customTx, [prevout]);
      if (!signed) {
        throw new Error('cannot sign custom transaction');
      }
      txn = signed;
    }
    return this.sendTransaction(txn, prevout ? 2000 : 0); //initial wait time when depending on other tx
  }
  /**
   * Sending a raw transaction
   * @param txn The transaction to send
   * @param initialWaitTime Time to wait before seinding the transaction
   * @param waitTime Time to wait for the transaction to finish
   * @param retries number of retries in case the transaction does not go through in time
   * @returns Transaction
   */
  async sendTransaction(
    txn: TransactionSegWit,
    initialWaitTime: number = 0,
    waitTime: number = 5000,
    retries: number = 3
  ): Promise<CTransactionSegWit> {
    const ctx = new CTransactionSegWit(txn);
    const hex: string = ctx.toHex();
    logDebug(`Sending Transaction RAW: ${hex}`);
    logInfo(`Sending transaction: ${ctx.txId}`);
    let start = initialWaitTime;
    //TODO: Maybe we can make this code more readable. As clever as it is, might be hard to understand
    await new Promise((resolve, error) => {
      let intervalID: NodeJS.Timeout;
      const send = (): void => {
        this.client.rawtx
          .send({ hex: hex })
          .then((txId) => {
            if (intervalID !== undefined) {
              clearInterval(intervalID);
            }
            resolve(txId);
          })
          .catch((e) => {
            if (start >= waitTime * retries) {
              if (intervalID !== undefined) {
                clearInterval(intervalID);
              }
              logError(
                'failed to send tx even after after multiple retries (' +
                  e.error.message +
                  ')'
              );
              error(e);
            } else {
              logWarn(
                'error sending tx (' +
                  e.error.message +
                  ') (' +
                  JSON.stringify(e) +
                  '). retrying after 5 seconds'
              );
            }
          });
      };
      setTimeout(() => {
        send();
        intervalID = setInterval(() => {
          start += waitTime;
          send();
        }, waitTime);
      }, initialWaitTime);
    });
    return ctx;
  }
  async getAccountScript(): Promise<Script> {
    return await this.account.getScript();
  }
  getTransactionBuilder(): P2WPKHTransactionBuilder {
    return this.account.withTransactionBuilder();
  }

  async sendCustomTransactionWithData(
    data: string,
    network: Network,
    changeScript: Script
  ): Promise<CTransactionSegWit> {
    logInfo(
      `Building custom transaction. Network: ${network.name} data: ${data}`
    );
    const feeRateProvider = new WhaleFeeRateProvider(this.client);
    const prevoutProvider = new WhalePrevoutProvider(this.account, 200);
    const builder = new CustomTXBuilder(
      feeRateProvider,
      prevoutProvider,
      {
        get: (_) => this.account
      },
      network
    );
    const tx = await builder.getCustomTx(data, changeScript);
    return await this.sendTransaction(tx, 2000); //prevout is added by CustomTX Builder
  }
}

class CustomTXBuilder extends P2WPKHTxnBuilder {
  async getCustomTx(data: string, changeScript: Script) {
    const { prevouts, vin, total } = await this.allPrevouts();
    const buf = Buffer.from(data);
    const op = new OP_PUSHDATA(buf, 'little');
    const deFiOut: Vout = {
      value: new BigNumber(0),
      script: {
        // stack: [op]
        stack: [OP_CODES.OP_RETURN, OP_CODES.OP_0, op] // We need to add the OP_0 for some reason, otherwise our transaction is always rejected...
      },
      tokenId: 0x00
    };

    const change: Vout = {
      value: total,
      script: changeScript,
      tokenId: 0x00
    };

    const txn: Transaction = {
      version: DeFiTransactionConstants.Version,
      vin: vin,
      vout: [deFiOut, change],
      lockTime: 0x00000000
    };

    const fee = await this.calculateFee(txn);
    change.value = total.minus(fee);

    return await this.sign(txn, prevouts);
  }
}

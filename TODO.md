# TODOs

- Display Auth PIN (or fingerprint?) to use as passphrase for localstorage encryption
- Add form to enter Seed Phrase and privKey
- Add form to enter wallet address
  - Get Vault ID from wallet (let user choose)
- Implement en-/decryption for Desktop Wallet
- Display standard values from current wallet/vault
  - Portfolio Value
  - Ratio
  - Chosen strategy
- Show statistics due to bot config
  - Ratio over time
  - Profit due to bot (e.g. more $ due to lower ratio)
  - Last transactions
- multilanguage (en-US, de-De first)

Code for sending custom TX

const sendCustomTransaction = async () => {
logInfo('Sending custom transaction');
let wallet = new DFIWallet(
await getSeed(seed, 'test1234'),
getDFINetwork(network)
);
const transactionHelper = await wallet.getTransactionHelper(address);
transactionHelper.sendCustomTransactionWithData(
'Sending greetings from the DefiChain Wizard app!',
getDFINetwork(network),
await transactionHelper.getAccountScript()
);
};

    <Alert severity="info">
            Your seedphrase will be <b>encrypted</b> and stored{' '}
            <b>on your device only</b>. Please make sure that you are alone when
            entering your seedphrase.
          </Alert>

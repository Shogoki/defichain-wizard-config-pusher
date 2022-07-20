@defichainwizard/custom-transactions / [Exports](modules.md)

# DeFiChain Wizard Custom Transaction Library

This library can be used to send and retrieve custom (RAW) transactions from the DeFiChain.

# Installation

```
npm i @defichainwizard/custom-transactions
```

# Basic Usage

You can import the objects to use like this:

```ts
import {
  Transaction,
  TransactionConfig,
  CustomMessage,
} from "@defichainwizard/custom-transactions";
```

## Create a transaction object

We will use this object in the next examples.

```ts
// The object properties are mandatory and enforced by typescript
const config: TransactionConfig = {
  client: this.client, // your whale api client
  account: this.account // your whale wallet account
  network: this.network, // the chosen network (e.g. mainnet)
  passphrase: this.passphrase // the passphrase as string array
};

// Create the transaction (it will automatically compress and encrypt the message)
const transaction = new Transaction(config);
```

## Send a custom transaction

The message to send must be of type `CustomMessage`.

```ts
// Create your message to be sent
const message: CustomMessage = {
  version: "1.0",
  vaultId: "dsafasdfasdfasdfasd",
  pause: 0,
  compounding: {
    threshold: 1,
    mode: 1,
    token: "DFI",
  },
  poolpairs: {},
  rules: { keepMaxRatio: 150, keepMinRatio: 160 },
  telegram: { receiver: "rest", key: "1" },
};

// Send the transaction
const txId = await transaction.send(message);
```

If you want to see the custom (RAW) transaction just use the following page and enter either the returned transaction ID or search for your wallet address:

https://chainz.cryptoid.info/dfi/

## Send a version message to the blockchain

In order to allow the frontend to see what version is installed on the backend, the backend must send a version message to the blockchain every time it starts up.

```ts
// Create your message to be sent
const versionMessage: Version = {
  version: "1.0"
};

// Send the transaction
const txId = await transaction.send(message);
```

## Convert the extracted message from the transaction

This is needed if you have received a transaction from the blockchain. You can easily pass the extracted string to this function and it will return the `CustomMessage` object (decompressed and decrypted).

The compressed and encrypted message pretty much looks like this:

```
WzTxU2FsdGVkX193BZ6NqtpjOSJP4GTQDYEDHSUmbbMdhQNfcV9NQCjrzoGWL2QF8mW6D+NR9sKDpqu3K/BhE4kPuvnEeA5RSJ8+kgvCL8TVxtVgGC0tHr1DTBlccpk4BSV6Iv5d0g84TAvKqD9VKfaygY39R9umrHxxGTQ1MIj8yMxpbsKigGNarch9TzJuqLoPF5zJD2+y5dDBZgCPOsVqxKTrqjQe8KDwE0ibgXhPtDstYsGNw1DeLhWK2RG+i2U2zof1zTvvQMKb/+bs3yyH1qhvpdRDQNAiDDCii5XZir75588bUIlo4OkIbMuPiCtb8vLU79dc5O5/xG76vWw0dQzLyFq6MeJk6pNhC7vCRfuas/ENr58Rq4AHCADl2DJy
```

```ts
// get the CustomMessage from the passed string.
const customMessage = transaction.getCustomMessage(theStringFromAbove);
```

/**
 * Configuration utility in order to provide some helper functions for some config settings.
 */

import { Network, MainNet, TestNet } from '@defichain/jellyfish-network';

let configData: {
  url: 'https://ocean.defichain.com';
  version: 'v0';
  network: 'mainnet';
};

const getDFIChainConfig = () => {
  return configData;
};

// returns the network as Network from the Jellyfish API
const getDFINetwork = (): Network =>
  getDFIChainConfig().network === 'mainnet' ? MainNet : TestNet;

export { getDFIChainConfig, getDFINetwork };

import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect
} from 'react';
import { MnemonicStorage } from './encryption';
import { MainNet } from '@defichain/jellyfish-network';
import { logWarn } from './logger';
import { isStringNullOrEmpty } from './helpers';

type walletContextType = {
  seed: string;
  address: string;
  vault: string;
  network: string;
  storeSeed: (seed: string[], passphrase: string) => void;
  storeVault: (vaultId: string) => void;
  storeAddress: (address: string) => void;
  storeNetwork: (network: string) => void;
  removeSeed: () => void;
};

const walletContextDefaultValues: walletContextType = {
  seed: '',
  address: '',
  vault: '',
  network: MainNet.name,
  storeSeed: () => '',
  storeAddress: () => '',
  storeVault: () => '',
  storeNetwork: () => MainNet.name,
  removeSeed: (): void => {}
};

const WalletContext = createContext<walletContextType>(
  walletContextDefaultValues
);

export function useWallet() {
  return useContext(WalletContext);
}

type Props = {
  children: ReactNode;
};

export function WalletProvider({ children }: Props) {
  const [seed, setSeed] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [vault, setVault] = useState<string>('');
  const [network, setNetwork] = useState<string>(MainNet.name);

  const storeSeed = (seed: string[], passphrase: string) => {
    if (!isStringNullOrEmpty(seed.join())) {
      MnemonicStorage.encrypt(seed, passphrase)
        .then((result) => {
          setSeed(result);
        })
        .catch((e) => logWarn(e));
    }
  };

  const storeAddress = (address: string) => {
    if (!isStringNullOrEmpty(address)) {
      setAddress(address);
    }
  };

  const storeVault = (vaultId: string) => {
    if (!isStringNullOrEmpty(vaultId)) {
      setVault(vaultId);
    }
  };

  const storeNetwork = (network: string) => {
    setNetwork(network);
  };

  const removeSeed = async () => {
    setSeed('');
  };

  const value = {
    seed,
    address,
    vault,
    network,
    storeSeed,
    storeAddress,
    storeVault,
    storeNetwork,
    removeSeed
  };

  /** Load data if it's already there. */
  useEffect(() => {
    const savedSeed = localStorage.getItem('seed');
    const savedVault = localStorage.getItem('vault');
    const savedAddress = localStorage.getItem('address');
    const savedNetwork = localStorage.getItem('network');

    if (savedSeed) {
      setSeed(savedSeed);
    }

    if (savedAddress) {
      setAddress(savedAddress);
    }

    if (savedVault) {
      setVault(savedVault);
    }

    if (savedNetwork) {
      setNetwork(savedNetwork);
    }
  }, []);

  /** Store data in localstorage */
  useEffect(() => {
    localStorage.setItem('seed', seed);
    localStorage.setItem('vault', vault);
    localStorage.setItem('address', address);
    localStorage.setItem('network', network);
  }, [seed, vault, address, network]);

  return (
    <>
      <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
    </>
  );
}

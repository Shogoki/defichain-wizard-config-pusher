import { EmotionCache } from '@emotion/react';
import { AppProps } from 'next/app';
import { WhaleApiClientOptions } from '@defichain/whale-api-client';
import { WalletClassic } from '@defichain/jellyfish-wallet-classic';
import { WhaleWalletAccount } from '@defichain/whale-api-wallet';
import { JellyfishWallet, WalletHdNode } from '@defichain/jellyfish-wallet';
import { OutlinedInputProps } from '@mui/material';

export interface DropDownProps {
  label: string;
  labels: Array<string>;
  values: Array<string>;
  context: string;
  onChanged: (value: string) => void;
}

export interface TextFieldProps {
  label: string;
  text: string;
  inputProps?: OutlinedInputProps;
  onChanged?: (value: string) => void;
}

export interface PageLayoutProps {
  title: string;
  children?: React.ReactNode;
}
export interface MenuBarTitleProps {
  title: string;
}

export interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

/**
 * When using the Desktop wallet, an account is needed in order to get the address. Jellyfish can get the account via wallet.
 *
 * Both wallets can be returned by the WalletProvider. Therefore an interface is needed.
 *
 * Therefore `account` is optional.
 */
export interface Wallet {
  wallet: WalletClassic | JellyfishWallet<WhaleWalletAccount, WalletHdNode>;
  account?: WhaleWalletAccount;
}

/**
 *  The interface for the general bot configuration
 */
export interface DfiVaultBotConfig {
  bot: GeneralBotConfig;
  transaction: TransactionConfig;
  dfichain: WhaleApiClientOptions;
  telegram: TelegramBotConfig;
}

/**
 *  The interface for the basic bot configuration.
 */
export interface GeneralBotConfig {
  name: string;
  interval: number;
  address: string;
  vault: string;
}

/**
 *  The interface for the bot's transaction configuration.
 */
export interface TransactionConfig {
  interval: number;
}
/**
 *  The interface for the Telegram bot configuration
 */
export interface TelegramBotConfig {
  chatid: string;
  token: string;
  notify_on_error: boolean;
}

export type CollateralToken = 'DFI' | 'DUSD' | 'BTC' | 'ETH';

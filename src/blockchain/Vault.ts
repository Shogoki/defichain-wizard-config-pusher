import { WhaleApiClient } from '@defichain/whale-api-client';
import {
  LoanVaultActive,
  LoanVaultLiquidated
} from '@defichain/whale-api-client/dist/api/loan';
/**
 * The Vault implementation that offers all operations on the vault.
 */
class Vault {
  private readonly client: WhaleApiClient;
  constructor(client: WhaleApiClient) {
    this.client = client;
  }

  /**
   * Checks if the vault is in ACTIVE state.
   *
   * Some values of the vault are only avavailable if the vault is in ACTIVE state.
   *
   * @param vault the vault to check
   * @returns true if the vault is in ACTIVE state
   */
  isVaultActive(
    vault: LoanVaultActive | LoanVaultLiquidated
  ): vault is LoanVaultActive {
    return vault.state === 'ACTIVE';
  }
}
export { Vault };

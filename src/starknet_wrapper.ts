// Need to be very explicit about imports to avoid the Ledger js library.
export type { Account } from 'starknet/account/default';
export type { AccountInterface } from 'starknet/account/interface';
export { Contract } from 'starknet/contract/default';
export { Provider } from 'starknet/provider/default';
export { Signer } from 'starknet/signer/default';
export { toBN, toHex } from 'starknet/utils/number';
export { getSelectorFromName } from 'starknet/utils/hash';
export { computeHashOnElements } from 'starknet/utils/hash';

export { connect, disconnect } from 'get-starknet-wallet';
export type { IStarknetWindowObject } from 'get-starknet-wallet';

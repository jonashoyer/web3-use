import { useContract } from './useContract';
import { XOR } from './types';
import { Contract, ContractInterface } from '@ethersproject/contracts';
import { useWeb3AsyncRetry } from './useWeb3AsyncRetry';

export interface CommonUseAllowanceOptions {
  accountAddress?: string;
  contractAddress: string;

  disableRefetchOnNetworkChange?: boolean;
  skip?: boolean;
}

export type UseAllowanceOptions<T> = {
  contractInterface: ContractInterface;
  allowanceFn: (contract: Contract, account: string, contractAddress: string) => Promise<T>;
} & CommonUseAllowanceOptions
& XOR<{ tokenAddress: string }, { tokenContract: Contract }>;

export const useAllowance = <T,>({ tokenAddress, tokenContract, contractAddress, accountAddress, contractInterface, allowanceFn, ...rest }: UseAllowanceOptions<T>) => {

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const contract = tokenContract ?? useContract({ address: tokenAddress, contractInterface });

  const { retry: refetch, error, loading, value: allowance } = useWeb3AsyncRetry(async ({ signer }) => {
    if (!signer && !accountAddress) return;
    const account = accountAddress ?? (await signer!.getAddress());
    return allowanceFn(contract, account, contractAddress);
  },
    [accountAddress, allowanceFn, contract, contractAddress],
    rest,
  );
  
  return {
    contract,
    allowance,
    loading,
    error,
    refetch,
  }
}
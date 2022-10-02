import { XOR } from '../types';
import { Contract } from '@ethersproject/contracts';
import { useAllowance } from '../common/useAllowance';
import { abiERC721 } from '../abis';

export type UseERC721AllowanceOptions = XOR<{ tokenAddress: string }, { tokenContract: Contract }> & {
  accountAddress?: string;
  contractAddress: string;

  approvalForAll?: boolean;
}

const allowanceFn = (approvalForAll?: boolean) => async (contract: Contract, account: string, contractAddress: string) => {
  if (approvalForAll) return contract.isApprovedForAll(contractAddress, true);
  return (await contract.getApproved(account)) === contractAddress;
}

export const useERC721Allowance = ({ approvalForAll, ...options}: UseERC721AllowanceOptions) => {
  return useAllowance<boolean>({
    ...options,
    abi: abiERC721,
    allowanceFn: allowanceFn(approvalForAll),
  });
}
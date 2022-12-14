import { createAsyncThunk } from '@reduxjs/toolkit';
import { BalanceQuery } from '@consensys/star-fox-sdk';
import { getDelegationsByAddress } from 'packages/frontend/api/cosmos';
import { Pagination } from 'packages/frontend/api/pagination';
import { updateStakes } from '../../slices/chain.slice';
import { BigNumber } from 'bignumber.js';

export const getStakesAction = createAsyncThunk(
  'actions/chains/getStakes',
  async (balanceQuery: BalanceQuery, thunkAPI) => {
    const { chainId, address } = balanceQuery;
    console.debug(`[getStakesAction] Getting stakes for ${chainId} ${address}`);

    const delegations = await getDelegationsByAddress(
      chainId,
      address, //'osmo1qc99y4t293llhaukk6lq74cq8ul38e9djqyrlu',
      {} as Pagination
    );

    const totalStake = delegations.delegation_responses
      .reduce((total, delegation) => {
        return total.plus(delegation.balance.amount);
      }, new BigNumber(0))
      .toString();

    thunkAPI.dispatch(
      updateStakes({
        chainId,
        stakes: delegations.delegation_responses,
        totalStake,
      })
    );

    console.debug(`[getStakesAction] Completed`, delegations);

    return delegations;
  }
);

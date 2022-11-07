import { pubkeyToAddress } from '@cosmjs/amino';
import { chains } from 'chain-registry';
import { FormattedChainWithAddress, SnapNetworks } from '../../types';
import { formatChain } from './formatChain';
import { getChain } from './networkChecker';

export const getAllNetworks = (base64PublicKey: string): SnapNetworks => {
  const snapNetworks: SnapNetworks = {};
  for (let i = 0; i < chains.length; i++) {
    try {
      snapNetworks[chains[i].chain_name] = generateChainWithAddress(
        chains[i].chain_name,
        base64PublicKey
      );
    } catch (e) {
      console.debug(
        `[getAllNetworks] Unable to get chain ${chains[i].chain_name}`
      );
    }
  }

  return snapNetworks;
};

const generateChainWithAddress = (
  chainName: string,
  base64PublicKey: string
): FormattedChainWithAddress => {
  const chain = formatChain(getChain(chainName));
  const address = pubkeyToAddress(
    {
      type: 'tendermint/PubKeySecp256k1',
      value: base64PublicKey,
    },
    chain.bech32_prefix
  );

  const chainWithAddress = { ...chain, address };

  return chainWithAddress;
};
export enum ActionTypes {
  SELECT_ACTION,
  SWAP,
  ADD_LIQUIDITY,
  REMOVE_LIQUIDITY,
  APPROVE,
  TRANSFER,
  WITHDRAW,
}

export enum ProtocolNames {
  SELECT_PROTOCOL,
  STONFI,
  DEDUST,
}

export const PROTOCOLS: { [key in keyof typeof ProtocolNames]?: any} = {
  [ProtocolNames.SELECT_PROTOCOL]: {
    name: 'Select Protocol',
    address: '0x818e6fecd516ecc3849daf6845e3ec868087b755',
    abi: []
  },
  [ProtocolNames.STONFI]: {
    name: 'STONFI',
    address: '0x818e6fecd516ecc3849daf6845e3ec868087b755',
    abi: []
  },
  [ProtocolNames.DEDUST]: {
    name: 'DEDUST',
    address: '0x818e6fecd516ecc3849daf6845e3ec868087b755',
    abi: []
  },
}


export const ACTIONS: { [key in keyof typeof ActionTypes]?: any} = {
  [ActionTypes.SELECT_ACTION]: {
    type: ActionTypes.SELECT_ACTION,
    name: 'Select Action',
    availableProtocols: [
      ProtocolNames.STONFI,
      ProtocolNames.DEDUST
    ],
  },
  [ActionTypes.SWAP]: {
    type: ActionTypes.SWAP,
    name: 'Swap',
    availableProtocols: [
      ProtocolNames.STONFI,
      ProtocolNames.DEDUST
    ],
  },
  [ActionTypes.ADD_LIQUIDITY]: {
    type: ActionTypes.ADD_LIQUIDITY,
    name: 'Add Liquidity',
    availableProtocols: [
      ProtocolNames.STONFI,
      ProtocolNames.DEDUST
    ],
  },
  [ActionTypes.REMOVE_LIQUIDITY]: {
    type: ActionTypes.REMOVE_LIQUIDITY,
    name: 'Remove Liquidity',
    availableProtocols: [
      ProtocolNames.STONFI,
      ProtocolNames.DEDUST
    ],
  },
  [ActionTypes.APPROVE]: {
    type: ActionTypes.APPROVE,
    name: 'Approve',
    availableProtocols: [
      ProtocolNames.STONFI,
      ProtocolNames.DEDUST
    ],
  },
  [ActionTypes.TRANSFER]: {
    type: ActionTypes.TRANSFER,
    name: 'Transfer',
    availableProtocols: [
    ],
  },
  [ActionTypes.WITHDRAW]: {
    type: ActionTypes.WITHDRAW,
    name: 'Withdraw',
    availableProtocols: [
      ProtocolNames.STONFI,
      ProtocolNames.DEDUST
    ],
  },
};

export const SELECTABLE_TOKENS = [
  {
    name: 'BTC',
    address: '',
    decimals: 18,
    symbol: 'BTC',
  },
  {
    name: 'USDT',
    address: '',
    decimals: 18,
    symbol: 'USDT',
  },
  {
    name: 'USDC',
    address: '',
    decimals: 6,
    symbol: 'USDC',
  },
  {
    name: 'ETH',
    address: '',
    decimals: 18,
    symbol: 'ETH',
  },
];

export const AVNU_TOKENS = [
  {
    name: 'ETH',
    address: '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7',
    decimals: 18,
    symbol: 'ETH',
  },
  {
    name: 'USDC',
    address: '0x005a643907b9a4bc6a55e9069c4fd5fd1f5c79a22470690f75556c4736e34426',
    decimals: 6,
    symbol: 'USDC',
  },
  {
    name: 'DAI',
    address: '0x03e85bfbb8e2a42b7bead9e88e9a1b19dbccf661471061807292120462396ec9',
    decimals: 18,
    symbol: 'DAI',
  },
  {
    name: 'Wrapped BTC',
    address: '0x12d537dc323c439dc65c976fad242d5610d27cfb5f31689a0a319b8be7f3d56',
    decimals: 8,
    symbol: 'wBTC',
  }
];

export const MY_SWAP_ROUTER_ADDRESS = '0x071faa7d6c3ddb081395574c5a6904f4458ff648b66e2123b877555d9ae0260e';
export const JEDI_FACTORY_ADDRESS = '0x06b4115fa43c48118d3f79fbc500c75917c8a28d0f867479acb81893ea1e036c';
export const JEDI_REGISTRY_ADDRESS = '0x0413ba8d51ec05be863eb82314f0cf0ffceff949e76c87cae0a4bd7f89cfc2b1'

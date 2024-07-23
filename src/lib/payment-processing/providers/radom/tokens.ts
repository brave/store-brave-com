import type { Network, Radom } from "./types";

type Tokens = {
  [key in Network]?: Record<string, string>
}

const TestnetTokens: Tokens = {
  SepoliaTestnet: {
    BAT: "0x5D684d37922dAf7Aa2013E65A22880a11C475e25",
    USDC: "0xa4fCE8264370437e718aE207805b4e6233638b9E",
    USDT: "0xE50d86c6dE38F9754f6777d2925377564Bf79482",
  },
  PolygonTestnet: {
    BAT: "0xd445cAAbb9eA6685D3A512439256866563a16E93",
    USDC: "0x8f8b1972eea072C3C228EbE8f9FEADe03927D70F",
    USDT: "0x70BE8802e2F3C6652B7e0814B478f66Ec52d9d88",
  },
  // Only USDC is available currently on SolanaDevnet
  SolanaDevnet: {
    USDC: "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU",
  },
};

const MainnetTokens: Tokens = {
  Ethereum: {
    BAT: "0x0d8775f648430679a709e98d2b0cb6250d2887ef",
    USDC: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
    USDT: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
  },
  BNB: {
    BAT: "0x101d82428437127bf1608f699cd651e6abf9766e",
    USDC: "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d",
    USDT: "0x55d398326f99059ff775485246999027b3197955",
  },
  Polygon: {
    BAT: "0x3cef98bb43d732e2f285ee605a8158cde967d219",
    USDC: "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
    USDT: "0xc2132d05d31c914a87c6611c10748aeb04b58e8f",
  },
  Solana: {
    BAT: "EPeUFDgHRxs9xxEPVaL6kfGQvCon7jmAWKVUHuux1Tpz",
    USDC: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    USDT: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
  },
};

function networkTokens(tokenObj: Tokens, discount: number): Radom.GatewayMethod[] {
  const tokenObjEntries = Object.entries(tokenObj) as [keyof Tokens, Record<string, string>][];
  return tokenObjEntries.flatMap(([network, tokens]) => {
    return Object.entries(tokens).map(([name, token]) => {
      let method: Radom.GatewayMethod = {
        network,
        token,
      };

      if (name === "BAT") {
        method = { ...method, discountPercentOff: discount };
      }

      return method;
    });
  });
}

export function testnetTokens(discount: number): Radom.GatewayMethod[] {
  return networkTokens(TestnetTokens, discount);
}

export function mainnetTokens(discount: number): Radom.GatewayMethod[] {
  return [...networkTokens(MainnetTokens, discount), { network: "Solana" }];
}

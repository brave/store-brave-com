// prettier-ignore
const networks = ['Bitcoin', 'BitcoinTestnet', 'Litecoin', 'LitecoinTestnet', 'Cardano', 'Monero', 'Dash', 'Dogecoin', 'Solana', 'SolanaTestnet', 'SolanaDevnet', 'Ethereum', 'SepoliaTestnet', 'Polygon', 'PolygonTestnet', 'BNB', 'BNBTestnet', 'Arbitrum', 'ArbitrumTestnet', 'Zcash', 'ZcashTestnet', 'Polkadot', 'PolkadotTestnet', 'Tron', 'TronTestnet', 'Avalanche', 'AvalancheTestnet', 'Base', 'BaseTestnet', 'Optimism', 'OptimismTestnet'] as const;
export type Network = (typeof networks)[number];

// prettier-ignore
const currencies = ['USD', 'CAD', 'GBP', 'EUR', 'AED', 'INR', 'SEK', 'BRL', 'NZD', 'AUD', 'HKD', 'NOK', 'DKK', 'JPY', 'CNY', 'CHF', 'SGD', 'PLN', 'MXN', 'CZK', 'HUF', 'ZAR', 'SAR', 'RUB', 'TRY', 'ILS', 'USDC', 'USDT', 'BTC', 'ETH'] as const;
export type Currency = (typeof currencies)[number];

export namespace Radom {
  export type GatewayMethod = {
    network: Network;
    token?: string;
    discountPercentOff?: number;
  };

  export type ItemData = {
    name: string;
    description?: string;
    chargingIntervalSeconds?: number;
    price: number;
    imageUrl?: string;
    isMetered?: boolean;
    currency: Currency;
    sendSubscriptionEmails?: boolean;
  };

  export type LineItem =
    | {
        productId: string;
        itemData?: never;
      }
    | {
        productId?: never;
        itemData: ItemData;
      };

  export type CreateCheckoutSession = (
    | {
        lineItems: Array<LineItem>;
        total?: never;
      }
    | {
        lineItems?: never;
        total: number;
      }
  ) & {
    currency: Currency;
    gateway: {
      managed: {
        methods: Array<GatewayMethod>;
      };
    };
    successUrl: string;
    cancelUrl?: string;
    metadata?: Array<{
      key: string;
      value: string;
    }>;
    expiresAt?: number;
    customizations?: {
      leftPanelColor?: string;
      primaryButtonColor?: string;
      slantedEdge?: boolean;
      allowDiscountCodes?: boolean;
    };
    chargeCustomerNetworkFee?: boolean;
  };

  export type CheckoutSession = {
    url: string;
    id: string;
  };
}

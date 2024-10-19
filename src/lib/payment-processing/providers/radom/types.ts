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

  export namespace Checkout {
    export type SessionStatus = 'pending' | 'success' | 'cancelled' | 'expired' | 'refunded';

    export type Session = {
      id: string;
      sessionStatus: SessionStatus;
      organizationId: string;
      products?: Product[];
      items?: ItemData[];
      total?: number;
      currency?: Currency;
      gateway: Gateway;
      successUrl: string;
      cancelUrl?: string;
      metadata?: Metadata[];
      expiresAt: string;
      createdAt?: string;
      updatedAt?: string;
      customizations?: Customizations;
      payment: Payment;
      refunds: Refund[];
      chargeCustomerNetworkFee: boolean;
    };

    export type SessionCreateParams = (
      | {
          lineItems: LineItem[];
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
          methods: GatewayMethod[];
        };
      };
      successUrl: string;
      cancelUrl?: string;
      metadata?: Metadata[];
      expiresAt?: number;
      customizations?: Customizations;
      chargeCustomerNetworkFee?: boolean;
    };
  }

  type Product = {
    id: string;
    organizationId: string;
    name: string;
    description: string;
    chargingIntervalSeconds: number;
    currency: Currency;
    price: number;
    imageUrl: string;
    createdAt: string;
    updatedAt: string;
    isArchived?: boolean;
    sendSubscriptionEmails?: boolean;
    productType?: {
      Presale: {
        Token: {
          ticker: string;
          decimals: number;
        };
      };
    };
  };

  type Gateway = {
    managed: {
      methods: GatewayMethod[];
    };
  };

  type Metadata = {
    key: string;
    value: string;
  };

  type Customizations = {
    leftPanelColor?: string;
    primaryButtonColor?: string;
    slantedEdge?: boolean;
    allowDiscountCodes?: boolean;
  };

  type Payment = {
    managed: {
      id: string;
      paymentEventId: string;
      network: Network;
      token?: string;
      amount: number;
      networkFee: number;
      transactions: Transaction[];
      conversionRates: ConversionRate[];
    };
  };

  type Transaction = {
    network: Network;
    transactionHash: string;
    token: string;
    amount: number;
    blockTimestamp: string;
    ticker: string;
    senderAddresses: Array<{
      address: string;
    }>;
  };

  type ConversionRate = {
    from: string;
    to: string;
    rate: number;
  };

  type Refund = {
    status: 'pending' | 'success' | 'cancelled' | 'failed';
    network: Network;
    token?: string;
    amount?: number;
    chargeCustomerNetworkFee: boolean;
    recipientAddress: string;
    transactionHash?: string;
    createdAt: string;
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

  export type PaymentEvent = {
    id: string;
    webhookId: string;
    eventType: 'managedPayment';
    eventData: {
      managedPayment: {
        paymentMethod: {
          network: Network;
          token: string | null;
        };
        amount: number;
        transactions: Transaction[];
      };
    };
    radomData:
      | {
          checkoutSession?: never;
          paymentLink: {
            paymentLinkId: string;
            paymentLinkOrderId: string;
            inputData: {
              label: string;
              value: string;
            }[];
          };
        }
      | {
          paymentLink?: never;
          checkoutSession: {
            checkoutSessionId: string;
            metadata: Metadata[];
          };
        };
  }
}

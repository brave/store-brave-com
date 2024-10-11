import { PUBLIC_ASSETS_PATH } from '$env/static/public';
import { describe, expect, test } from 'vitest';
import { CreateCheckoutSessionError, formatCheckoutSessionParams } from './checkoutSession';
import { radomAdapter } from './providers/radom';
import { stripeAdapter } from './providers/stripe';

const requestBody = {
  items: [
    { id: 'clwsmtxpp0000zo6dwkmvu76n', quantity: '1' },
    { id: 'clwsmtxrj0004zo6dsqvo4b7t', quantity: '1' }
  ],
  shippingAddress: {
    name: 'Jacob Lamont',
    address1: '333 Elm Circle',
    city: 'Villa Rica',
    zip: '30180',
    country_code: 'US',
    state_code: 'GA',
    calling_code: 'US+1',
    phone: ''
  }
};

test('Fails when no order items are included in request body', async () => {
  const improperRequestBody = structuredClone(requestBody);
  improperRequestBody.items = [];

  await expect(async () =>
    formatCheckoutSessionParams(improperRequestBody, stripeAdapter)
  ).rejects.toThrowError(CreateCheckoutSessionError.EMPTY_CART);
});

test('Fails when shipping data is malformed', async () => {
  const improperRequestBody = structuredClone(requestBody) as any;
  delete improperRequestBody.shippingAddress.address1;

  await expect(async () =>
    formatCheckoutSessionParams(improperRequestBody, stripeAdapter)
  ).rejects.toThrowError(CreateCheckoutSessionError.INVALID_SHIPPING_ADDRESS);
});

describe('Stripe', () => {
  const expectedStripeCheckoutSessionData = {
    line_items: [
      {
        price_data: {
          currency: 'USD',
          product_data: {
            name: 'Brave | BAT Desk Mat',
            images: [
              `${PUBLIC_ASSETS_PATH}/b2847030ab3d174e3788ebf17ebc9e90ef26db4bbba6730b91039912666d078a.png`
            ],
            metadata: { printfulVariantId: '3826891072', baseVariantId: 14942 }
          },
          unit_amount: 3500
        },
        quantity: 1
      },
      {
        price_data: {
          currency: 'USD',
          product_data: {
            name: 'Brave Lion Fleece Zip Up Hoodie / 2XL',
            images: [
              `${PUBLIC_ASSETS_PATH}/a996ac2653c1f945483cb2bdabb72e232de591b913148aa708107d4ac9d44053.png`
            ],
            metadata: { printfulVariantId: '3576357951', baseVariantId: 15042 }
          },
          unit_amount: 4595
        },
        quantity: 1
      }
    ],
    mode: 'payment',
    success_url: 'http://localhost:5173/success/{CHECKOUT_SESSION_ID}/',
    cancel_url: 'http://localhost:5173/cart/?session_id={CHECKOUT_SESSION_ID}',
    allow_promotion_codes: true,
    shipping_options: [
      {
        shipping_rate_data: {
          display_name: 'Standard (Estimated delivery: Jul 24-Jul 29)',
          type: 'fixed_amount',
          metadata: { printful_shipping_rate_id: 'STANDARD' },
          fixed_amount: { amount: 399, currency: 'USD' },
          delivery_estimate: {
            minimum: { unit: 'day', value: 4 },
            maximum: { unit: 'day', value: 7 }
          }
        }
      }
    ],
    invoice_creation: { enabled: true }
  };

  test('Converts request body to Stripe checkout session data', async () => {
    expect(await formatCheckoutSessionParams(requestBody, stripeAdapter)).toMatchObject(
      expectedStripeCheckoutSessionData
    );
  });
});

describe('Radom', () => {
  const expectedRadomCheckoutSessionData = {
    lineItems: [
      {
        itemData: {
          name: 'Brave | BAT Desk Mat',
          description: 'Quantity: 1',
          price: 35,
          imageUrl:
            'https://cdn.store.bravesoftware.com/b2847030ab3d174e3788ebf17ebc9e90ef26db4bbba6730b91039912666d078a.png',
          currency: 'USD'
        }
      },
      {
        itemData: {
          name: 'Brave Lion Fleece Zip Up Hoodie / 2XL',
          description: 'Quantity: 1',
          price: 45.95,
          imageUrl:
            'https://cdn.store.bravesoftware.com/a996ac2653c1f945483cb2bdabb72e232de591b913148aa708107d4ac9d44053.png',
          currency: 'USD'
        }
      },
      {
        itemData: {
          name: 'Standard (Estimated delivery: Jul 24-Jul 29)',
          price: 3.99,
          currency: 'USD'
        }
      }
    ],
    currency: 'USD',
    gateway: {
      managed: {
        methods: [
          {
            network: 'SepoliaTestnet',
            token: '0x5D684d37922dAf7Aa2013E65A22880a11C475e25',
            discountPercentOff: 0.2
          },
          { network: 'SepoliaTestnet', token: '0xa4fCE8264370437e718aE207805b4e6233638b9E' },
          { network: 'SepoliaTestnet', token: '0xE50d86c6dE38F9754f6777d2925377564Bf79482' },
          {
            network: 'PolygonTestnet',
            token: '0xd445cAAbb9eA6685D3A512439256866563a16E93',
            discountPercentOff: 0.2
          },
          { network: 'PolygonTestnet', token: '0x8f8b1972eea072C3C228EbE8f9FEADe03927D70F' },
          { network: 'PolygonTestnet', token: '0x70BE8802e2F3C6652B7e0814B478f66Ec52d9d88' },
          { network: 'SolanaDevnet', token: '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU' }
        ]
      }
    },
    successUrl: 'http://localhost:5173/success/{CHECKOUT_SESSION_ID}/',
    cancelUrl: 'http://localhost:5173/cart/?session_id={CHECKOUT_SESSION_ID}',
    chargeCustomerNetworkFee: true,
    customizations: { allowDiscountCodes: true }
  };

  test('Converts request body to Radom checkout session data', async () => {
    expect(await formatCheckoutSessionParams(requestBody, radomAdapter)).toMatchObject(
      expectedRadomCheckoutSessionData
    );
  });
});

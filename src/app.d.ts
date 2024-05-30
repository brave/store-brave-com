/// <reference types="@sveltejs/kit" />

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare namespace App {
  interface PageData {
    title: string;
  }

  interface CartItem {
    variant: import('$lib/graphql/types').Variant;
    product: import('$lib/graphql/types').Product;
    quantity: number;
  }

  interface Recipient {
    name: string | null | undefined;
    email: string | null | undefined;
    address1: string | null | undefined;
    address2: string | null | undefined;
    city: string | null | undefined;
    state_code?: string | null | undefined;
    zip: string | null | undefined;
    country_code: string | null | undefined;
    phone?: string | null | undefined;
  }

  interface OrderItem {
    quantity: number;
    sync_variant_id: number;
  }

  interface Order {
    recipient: Recipient;
    external_id: string | undefined | null;
    items: Array<OrderItem> | undefined;
  }
}

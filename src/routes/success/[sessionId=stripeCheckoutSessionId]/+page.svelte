<script lang="ts">
  import { getContext } from 'svelte';
  import { contextKey } from '$lib/cartStore';
    import { browser } from '$app/environment';

  // @ts-ignore
  const { emptyCart } = getContext(contextKey);

  export let data: import('./$types').PageData;
  $: ({ purchaseItems } = data);

  // Clear cart after successful checkout
  $: browser && Array.isArray(purchaseItems) && purchaseItems.length > 0 && emptyCart();
</script>

<div class="max-w-xl mx-auto">
  <h1 class="text-[50px] sm:text-[80px] font-semibold pb-2">Congrats!</h1>
  <p class="text-[22px] font-medium pb-12">Your order should be shipping soon!</p>

  <h2 class="text-[22px] font-medium pb-4">Your order</h2>
  <ul class="flex flex-col gap-y-8 text-center sm:text-left">
    {#each purchaseItems ?? [] as item}
      <li class="flex flex-col sm:flex-row gap-5 items-center">
        <img class="rounded-8 w-full max-w-sm sm:max-w-[150px] shadow-gray-20 shadow-04" src={item.product?.details.files.at(-1).preview_url} alt="Thumbnail for {item.product?.details.name}" />
        <p class="text-large-regular font-medium">
          <span class="block pb-2 sm:pb-4">{item.product?.details.name}</span>
          <span class="block"><span class="font-semibold">Quantity:</span> {item.quantity}</span>
        </p>
      </li>
    {/each}
  </ul>
</div>
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
  <h1 class="text-[50px] sm:text-[80px] font-semibold pb-m [view-transition-name:page-name]">Congrats!</h1>
  <p class="text-[22px] font-medium pb-5xl">Your order should be shipping soon!</p>

  <h2 class="text-[22px] font-medium pb-xl">Your order</h2>
  <ul class="flex flex-col gap-y-3xl text-center sm:text-left">
    {#each purchaseItems ?? [] as item}
      <li class="flex flex-col sm:flex-row gap-[20px] items-center">
        <img class="rounded-m w-full max-w-sm sm:max-w-[150px] shadow-gray-20 shadow-04" src={item.product?.details.files.at(-1).preview_url} alt="Thumbnail for {item.product?.details.name}" />
        <p class="text-large-regular font-medium">
          <span class="block pb-m sm:pb-xl">{item.product?.details.name}</span>
          <span class="block"><span class="font-semibold">Quantity:</span> {item.quantity}</span>
        </p>
      </li>
    {/each}
  </ul>
</div>
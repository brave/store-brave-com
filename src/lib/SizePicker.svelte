<script lang="ts">
  import type { Variant } from '$lib/graphql/types';

  export let sizeVariants: Array<Variant> = [];
  export let activeSize: string = '';
  export let shouldPreloadImages = true;
  export let shouldClickReplaceState = false;

  const sortSizes = (a: Variant, b: Variant) => {
    const sizeOrder = [
      '11oz',
      '15oz',
      '3″×3″',
      '4″×4″',
      '5.5″×5.5″',
      '18″×18″',
      '22″×22″',
      '"S/M"',
      '"M/"',
      'Samsung Galaxy S10e',
      'Samsung Galaxy S10',
      'Samsung Galaxy S10+',
      'iPhone 7/8',
      'iPhone 7 Plus/8 Plus',
      'iPhone XR',
      'iPhone X/XS',
      'iPhone XS Max',
      'iPhone 11 Pro',
      'iPhone 11 Pro Max',
      '3-6M',
      '6-12M',
      '18-24M',
      '12-18M',
      'XS',
      'S',
      'M',
      'L',
      'XL',
      '2XL',
      '3XL',
      '4XL',
      '5XL'
    ];

    const aSizeOrder = sizeOrder.indexOf(a.details.size.toUpperCase());
    const bSizeOrder = sizeOrder.indexOf(b.details.size.toUpperCase());

    return aSizeOrder - bSizeOrder;
  };

  $: sizeVariants?.sort(sortSizes);
</script>

<svelte:head>
  {#if shouldPreloadImages}
    {#each sizeVariants as sizeVariant}
      <link rel="preload" href="{sizeVariant.details?.files.at(-1).preview_url}" as="image">
    {/each}
  {/if}
</svelte:head>

<ul class="flex flex-wrap gap-2">
  {#each sizeVariants as sizeVariant}
    <li>
      <a
        href={sizeVariant.permalink}
        data-sveltekit-replacestate
        class="border-dashed border rounded-8 p-2 min-w-[40px] inline-block text-center"
        class:active-option={sizeVariant.details.size === activeSize}
      >
        {sizeVariant.details.size}
      </a>
    </li>
  {/each}
</ul>

<style lang="scss">
  .active-option {
    border-color: theme('colors.yellow.30');
    border-style: solid;
  }
</style>

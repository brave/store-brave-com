<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { Variant } from '$lib/graphql/types';
  type Color = {
    name: string;
    primary: string;
    secondary: string;
  };
  type Size = 'small' | 'default';

  const dispatch = createEventDispatcher();

  export let colors: Array<Color> = [];
  export let colorVariants: Array<Variant> = [];
  export let activeColor: string = '';
  export let size: Size = 'default';
  export let shouldPreloadImages = true;
  export let shouldClickReplaceState = false;

  const sortColors = (a: Color, b: Color) => {
    return parseInt(b.primary.slice(1), 16) - parseInt(a.primary.slice(1), 16);
  };

  $: colors = colors.sort(sortColors);

  const getColorBg = (color: Color) => {
    if (color.secondary) {
      return `linear-gradient(135deg, ${color.primary} 50%, ${color.secondary} 50%)`;
    } else {
      return color.primary;
    }
  };

  const getColorVariantFromColor = (color: string): Variant | undefined => {
    return colorVariants?.find((v: Variant) => color === v.details.color);
  };
</script>

<svelte:head>
  {#if shouldPreloadImages}
    {#each colorVariants as colorVariant}
      <link rel="preload" href={colorVariant.details?.files.at(-1).preview_url} as="image" />
    {/each}
  {/if}
</svelte:head>

<ul
  class="color-container flex flex-wrap max-w-max"
  class:is-small={size === 'small'}
  on:mouseleave={() => dispatch('mouseleave')}
>
  {#each colors as color}
    {@const colorVariant = getColorVariantFromColor(color.name)}
    <li>
      <a
        class="color-link border border-gray-30 block overflow-hidden"
        class:active-option={activeColor === color.name}
        href={colorVariant?.permalink}
        data-sveltekit-replacestate={shouldClickReplaceState ? '' : 'off'}
        on:mouseenter={() => dispatch('mouseenter', { colorVariant })}
        title={color.name}
      >
        <span class="color-swatch block" style="background: {getColorBg(color)}" />
      </a>
    </li>
  {/each}
</ul>

<style lang="scss">
  .active-option {
    border-color: theme('colors.yellow.30');
    border-style: solid;
  }

  .color-container {
    gap: theme('gap.m');
  }
  .color-link {
    border-radius: theme('borderRadius.m');
  }

  .color-swatch {
    height: theme('height.3xl');
    width: theme('width.3xl');
  }

  .is-small {
    &.color-container {
      gap: theme('gap.s');
    }

    .color-link {
      border-radius: theme('borderRadius.s');
    }

    .color-swatch {
      height: theme('height.xl');
      width: theme('width.xl');
    }
  }
</style>

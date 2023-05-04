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

<ul class="flex flex-wrap gap-2 max-w-max" on:mouseleave={() => dispatch('mouseleave')}>
  {#each colors as color}
    {@const colorVariant = getColorVariantFromColor(color.name)}
    <li class:is-small={size === 'small'}>
      <a
        class="color-link border border-gray-30 block overflow-hidden"
        class:active-option={activeColor === color.name}
        href={colorVariant?.permalink}
        on:click={(e) => {
          e.preventDefault();
          dispatch('click', { colorVariant });
        }}
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

  .color-link {
    border-radius: theme('borderRadius.8');
  }

  .color-swatch {
    height: theme('height.8');
    width: theme('width.8');
  }

  .is-small {
    .color-link {
      border-radius: theme('borderRadius.4');
    }

    .color-swatch {
      height: theme('height.4');
      width: theme('width.4');
    }
  }
</style>

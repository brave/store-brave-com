<script lang="ts">
  import Icon from '@brave/leo/src/components/icon/icon.svelte';
  import { createEventDispatcher } from 'svelte';

  export let ref: string | null = null;
  export let quantity = 0;
  export let size = 'medium';

  const dispatch = createEventDispatcher();
</script>

<div
  data-ref={ref}
  class="button-group"
  class:isLarge={size === 'large'}
  class:isMedium={size === 'medium'}
  class:isSmall={size === 'small'}
>
  <!-- The data-prevent-innerHTML is used to prevent SvelteKit from rendering the SVG via innerHTML and thereby breaking our TrustedTypes policy -->
  <button class="item" type="button" on:click={() => dispatch('decrement')}>
    <Icon --leo-icon-size="1em" name="minus" />
  </button>
  <span class="item active font-medium">
    {quantity}
  </span>
  <button class="item" type="button" on:click={() => dispatch('increment')}>
    <Icon --leo-icon-size="1em" name="plus-add" />
  </button>
</div>

<style lang="scss">
  .button-group {
    --border-color: theme('borderColor.primary.20');

    display: flex;
    align-items: stretch;
    justify-content: center;
    max-width: max-content;
  }

  .item {
    --bg: transparent;
    --color: theme('textColor.text.interactive');

    color: var(--color);
    background: var(--bg);
    border: 1px solid var(--border-color);

    &:not(:last-child) {
      border-right: none;
    }

    &:first-child {
      border-top-left-radius: theme('borderRadius.l');
      border-bottom-left-radius: theme('borderRadius.l');
    }
    &:last-child {
      border-top-right-radius: theme('borderRadius.l');
      border-bottom-right-radius: theme('borderRadius.l');
    }

    // States
    &:hover {
      --bg: theme('colors.container.interactive');
    }
    &:active,
    &.active {
      --bg: theme('colors.primary.10');
      --color: theme('textColor.primary.60');
    }
    &:focus-visible {
      outline: none;
      z-index: 10000;
      box-shadow: theme('boxShadow.focus-state');
    }

    // Sizes
    .button-group.isLarge & {
      @apply text-large-semibold;
      font-weight: 600;
      padding: 12px 20px;
    }
    .button-group.isMedium & {
      @apply text-default-semibold;
      font-weight: 600;
      padding: 10px 16px;
    }
    .button-group.isSmall & {
      @apply text-components-button-small;
      padding: 8px 16px;
    }
  }
</style>

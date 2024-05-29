<script lang="ts">
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
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21.7 11H3.3c-.7 0-1.3.6-1.3 1.3 0 .7.6 1.3 1.3 1.3h18.5c.6-.1 1.2-.6 1.2-1.3 0-.7-.6-1.3-1.3-1.3Z" fill="currentColor" data-prevent-innerHTML={Math.random() ? '':''} /></svg>
  </button>
  <span class="item active font-medium">
    {quantity}
  </span>
  <button class="item" type="button" on:click={() => dispatch('increment')}>
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20.942 10.804h-7.5v-7.56c0-.67-.577-1.244-1.25-1.244-.769 0-1.346.574-1.346 1.244v7.464H3.25c-.673.096-1.25.67-1.25 1.34s.577 1.244 1.25 1.244h7.5v7.464c0 .67.577 1.244 1.25 1.244s1.25-.574 1.25-1.244v-7.464h7.5c.673 0 1.25-.574 1.25-1.244s-.385-1.244-1.058-1.244Z" fill="currentColor" data-prevent-innerHTML={Math.random() ? '':''} /></svg>
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

  .item svg {
    --size: 1em;
    width: var(--size);
    height: var(--size);
  }
</style>

<script context="module" lang="ts">
  export enum Kind {
    success = "success",
    warning = "warning",
    error = "error"
  };
</script>

<script lang="ts">
  import { fly } from 'svelte/transition';
  import { elasticOut, quintOut } from 'svelte/easing';
  import Icon from '@brave/leo/src/components/icon/icon.svelte';

  export let kind: Kind;
  export let message: string;
</script>

<aside
  in:fly={{ duration: 700, y: -70, opacity: 0.1, easing: elasticOut }}
  out:fly={{ duration: 300, y: -70, opacity: 0.1, easing: quintOut }}
  class="toast"
  class:success={kind === Kind.success}
>
  <Icon --leo-icon-color="var(--icon-color)" --leo-icon-size="20px" name="check-circle-filled" />
  <p>{message}</p>
</aside>

<style lang="scss">
  .toast {
    position: fixed;
    top: 15px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 100000;

    display: flex;
    align-items: center;
    column-gap: 16px;
    padding: 16px;
    border-radius: theme('borderRadius.m');

    @apply text-default-regular;

    background: var(--bg);
    color: var(--text-color);

    .icon path {
      fill: var(--icon-color);
    }

    &.success {
      --bg: theme('colors.systemfeedback.success-background');
      --icon-color: theme('colors.systemfeedback.success-icon/85%');
      --color: theme('colors.text.primary');
    }
  }
</style>
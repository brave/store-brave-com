<script context="module" lang="ts">
  export enum Kind {
    success = "success",
    warning = "warning",
    error = "error"
  };
</script>

<script lang="ts">
  import { fly } from "svelte/transition";
  import { elasticOut, quintOut } from "svelte/easing";

  export let kind: Kind;
  export let message: string;
</script>

<aside in:fly={{duration: 700, y: -70, opacity: 0.1, easing: elasticOut}} out:fly={{duration: 300, y: -70, opacity: 0.1, easing: quintOut}} class="toast" class:success={kind === Kind.success}>
  <svg class="icon shrink-0" width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M1.667 10a8.333 8.333 0 1 1 16.666 0 8.333 8.333 0 0 1-16.666 0Zm11.419-1.55a.641.641 0 1 0-1.043-.746l-2.766 3.872-1.388-1.388a.64.64 0 1 0-.906.906l1.923 1.923a.641.641 0 0 0 .975-.08l3.205-4.487Z" opacity=".5" /></svg>
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
      --icon-color: theme('colors.systemfeedback.success-icon');
      --color: theme('colors.text.primary');
    }
  }
</style>
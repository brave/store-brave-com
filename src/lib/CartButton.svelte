<script lang="ts">
  import Icon from '@brave/leo/src/components/icon/icon.svelte';
  export let ref: string | null = null;
  export let itemCount: number = 0;
</script>

<div data-ref={ref} class="notification-badge relative">
  <a href="/cart/">
    <Icon name="cart" title="Cart" />
  </a>

  {#if itemCount > 0}
    <span
      class="rounded-full flex items-center justify-center w-xl h-xl text-components-label text-white bg-primary-50 absolute -top-[0.45rem] right-s"
      >{itemCount}</span
    >
  {/if}
</div>

<style>
  .notification-badge > a {
    padding-right: 16px;
    padding-left: 8px;
  }
</style>

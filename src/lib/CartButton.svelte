<script lang="ts">
  export let ref: string | null = null;
  export let itemCount: number = 0;
</script>

<div data-ref={ref} class="notification-badge relative">
  <a href="/cart/">
    <svg
      aria-label="Cart"
      focusable="false"
      width="20"
      height="20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      ><path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="m19.964 6.907-2.516 8.334a.832.832 0 0 1-.798.592h-7.8a.814.814 0 0 1-.296-.06c-.032-.012-.059-.03-.089-.046a.828.828 0 0 1-.162-.11.823.823 0 0 1-.23-.342c-.007-.02-.02-.035-.026-.056L4.633 2.66c-.142-.52-.76-.993-1.3-.993h-2.5A.833.833 0 1 1 .833 0h2.5c1.292 0 2.57.977 2.908 2.223l.982 3.61h11.944a.833.833 0 0 1 .797 1.074ZM7.675 7.5l1.813 6.667h6.544L18.045 7.5H7.675ZM10 16.667c.92 0 1.667.747 1.667 1.666a1.668 1.668 0 0 1-3.334 0c0-.919.748-1.666 1.667-1.666Zm5.833 0a1.668 1.668 0 0 1 0 3.333 1.669 1.669 0 0 1-1.666-1.667c0-.919.748-1.666 1.666-1.666Z"
        fill="currentColor"
      /></svg
    >
  </a>

  {#if itemCount > 0}
    <span
      class="rounded-full flex items-center justify-center w-4 text-x-small-semibold text-white bg-light-primary-50 absolute -top-[0.45rem] right-1"
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

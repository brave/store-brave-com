<script lang="ts">
  export let crumbs: Array<{ label: string, link?: string }> = [];
  export let ref: string | undefined = undefined;
</script>

<aside data-ref={ref} class="text-small-regular flex items-center gap-x-2 pb-2 sm:pb-6 md:pb-8">
  {#each crumbs as crumb, i}
    {#if crumb.link}
      <a class="text-text-secondary hover:text-text-primary transition-colors duration-300" href={crumb.link}>{crumb.label}</a>
    {:else}
      <span class="text-text-secondary">{crumb.label}</span>
    {/if}
    {#if i < (crumbs.length - 1)}
      <span class="text-divider-strong"> / </span>
    {/if}
  {/each}
</aside>
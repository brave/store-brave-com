<script lang="ts">
  import type { PageData } from './$types';

  export let data: PageData;
</script>

<article class="page max-w-screen-lg mx-auto">
  <h1 class="text-display-display1 mb-6">{data.title}</h1>

  {@html data.sanitizedBody}
</article>

<style>
  article.page :global(p) {
    margin-bottom: 1rem;
  }
</style>
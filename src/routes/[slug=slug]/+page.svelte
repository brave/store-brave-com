<script lang="ts">
  import DOMPurify from 'isomorphic-dompurify';
  import type { PageData } from './$types';

  export let data: PageData;

  const sanitizedBody = DOMPurify.sanitize(data.body, { RETURN_TRUSTED_TYPE: true });
</script>

<article class="page max-w-screen-lg mx-auto">
  <h1 class="text-display-display1 mb-6">{data.title}</h1>

  {@html sanitizedBody}
</article>

<style>
  article.page :global(p) {
    margin-bottom: 1rem;
  }
</style>
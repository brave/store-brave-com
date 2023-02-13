<script lang="ts">
  import SizeChart from './SizeChart.svelte';

  export let heading: string;
  export let details: any;
</script>

<h3 class="text-h1">{heading}</h3>

{#if details.image_url}
  <img class="py-6 h-[150px]" src={details.image_url} alt="product sizing graphic" />
{/if}

<div class="w-full overflow-x-auto">
  <SizeChart measurements={details.measurements} unit={details.unit} />
</div>

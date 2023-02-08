<script lang="ts">
  const unitSymbols: Record<string, string> = {
    inches: '"'
  };

  export let unit = 'inches';
  export let measurements: Array<any> = [];

  const labels = ['Size', ...measurements.map((m) => m.type_label)];
  const rows = measurements.reduce((rows, m) => {
    m.values.forEach((v: any, i: number) => {
      rows[i] = rows[i] ?? [v.size];

      const value = v.min_value && v.max_value ? `${v.min_value}-${v.max_value}` : v.value;

      rows[i].push(`${value}${unitSymbols[unit]}`);
    });

    return rows;
  }, []);
</script>

<table class="table-auto text-justify w-full max-w-[700px]">
  <thead>
    <tr class="bg-gray-20">
      {#each labels as label}
        <th class="font-semibold py-3 px-4">{label}</th>
      {/each}
    </tr>
  </thead>
  <tbody>
    {#each rows as row}
      <tr class="even:bg-gray-10">
        {#each row as cell}
          <td class="py-3 px-4">{cell}</td>
        {/each}
      </tr>
    {/each}
  </tbody>
</table>

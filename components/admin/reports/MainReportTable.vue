<template>
  <section>
    <XTable size="small" class="report-table">
      <thead>
        <tr>
          <th>Fecha y hora transf.</th>
          <th>Producto origen</th>
          <th>Banco origen</th>
          <th>Producto destino</th>
          <th>Banco destino</th>
          <th>Moneda</th>
          <th>Importe</th>
          <th>Tipo transf.</th>
          <th>Estado</th>
          <th>Detalles</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>00/00/000 00:00:00</td>
          <td>0000000000000</td>
          <td>BNB</td>
          <td>0000000000000</td>
          <td>BCP</td>
          <td>Bs.</td>
          <td>000000</td>
          <td>QR</td>
          <td>Rechazado</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td>00/00/000 00:00:00</td>
          <td>0000000000000</td>
          <td>BNB</td>
          <td>0000000000000</td>
          <td>BCP</td>
          <td>Bs.</td>
          <td>000000</td>
          <td>QR</td>
          <td>Rechazado</td>
          <td>&nbsp;</td>
        </tr>
      </tbody>
    </XTable>

    <XPaginator class="mt-7" />
  </section>
</template>

<style lang="postcss" scoped>
  .report-table {
    --spacing-table-row: calc(8 * (2 / 14) * 1rem);

    thead>tr>th,
    tbody>tr>td {
      @apply !px-10;
    }

    thead>tr>th { @apply !py-7; }
    thead>tr>td { @apply !py-5; }
  }
</style>

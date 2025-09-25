<template>
  <section>
    <div class="flex justify-between mb-5">
      <div class="text-gray-700 text-xl">Transferencias encontradas: <span class="text-primary font-semibold">{{ props.transfersList.length }}</span></div>
    </div>

    <XTable size="small" class="report-table overflow-x-auto whitespace-nowrap block">
      <thead>
        <tr>
          <th>Fecha y hora transf.</th>
          <th>Producto origen</th>
          <th>
            <AdminReportsFilterMainReportTableFilter
              v-model="originatorParticipantAcronymFilter"
              label="Banco origen"
              :options="props.transfersList"
              option-key="originatorParticipantAcronym"
            />
          </th>
          <th>Producto destino</th>
          <th>
            <AdminReportsFilterMainReportTableFilter
              v-model="receiverParticipantAcronymFilter"
              label="Banco destino"
              :options="props.transfersList"
              option-key="receiverParticipantAcronym"
            />
          </th>
          <th>
            <AdminReportsFilterMainReportTableFilter
              v-model="currencyDisplayNameFilter"
              label="Moneda"
              :options="props.transfersList"
              option-key="currencyDisplayName"
            />
          </th>
          <th>Importe</th>
          <th>
            <AdminReportsFilterMainReportTableFilter
              v-model="transactionDisplayNameFilter"
              label="Tipo transf."
              :options="props.transfersList"
              option-key="transactionDisplayName"
            />
          </th>
          <th>
            <AdminReportsFilterMainReportTableFilter
              v-model="statusDisplayNameFilter"
              label="Estado"
              :options="props.transfersList"
              option-key="statusDisplayName"
            />
          </th>
          <th>Detalles</th>
        </tr>
      </thead>
      <tbody v-if="props.transfersList.length == 0">
        <tr>
          <td colspan="10" class="text-center">- No se encontraron transferencias con los criterios de búsqueda indicados -</td>
        </tr>
      </tbody>
      <tbody v-else>
        <tr
          v-for="(transfer, index) in transfersListFiltered.slice(pageIndex, pageIndex + pageRows)"
          :key="index"
        >
          <td>{{ transfer.formattedDate }} {{ transfer.formattedHour }}</td>
          <td>{{ transfer.originatorAccountNumber }}</td>
          <td>{{ transfer.originatorParticipantAcronym }}</td>
          <td>{{ transfer.receiverAccountNumber }}</td>
          <td>{{ transfer.receiverParticipantAcronym }}</td>
          <td>{{ transfer.currencyDisplayName }}</td>
          <td>{{ transfer.amount }}</td>
          <td>{{ transfer.transactionDisplayName }}</td>
          <td>
            <XTag v-if="transfer.statusDisplayName == 'Pendiente'" severity="warn" value="Pendiente" />
            <XTag v-else-if="transfer.statusDisplayName == 'Procesado'" severity="success" value="Procesado" />
            <XTag v-else-if="transfer.statusDisplayName == 'Aceptado'" severity="success" value="Aceptado" />
            <XTag v-else-if="transfer.statusDisplayName == 'Rechazado'" severity="danger" value="Rechazado" />
            <XTag v-else value="-" />
          </td>
          <td class="flex items-center">
            <XButton v-tooltip.bottom="'Ver mensajes de orden'" variant="outlined">
              <Icon name="x:code" class="w-[14px] h-[14px] text-gray-800" />
            </XButton>
            <XButton class="ml-3 font-medium px-6">Ver</XButton>
          </td>
        </tr>
      </tbody>
    </XTable>

    <XPaginator
      v-model:first="pageIndex"
      v-model:rows="pageRows"
      :total-records="transfersListFiltered.length"
      :rows-per-page-options="[10, 20, 30]"
      class="mt-7"
    />
  </section>
</template>

<script setup lang="ts">
  import type { Transfers } from "~/features/reports/types";

  const props = defineProps<{
    transfersList: Transfers[];
  }>();

  // Filter
  const originatorParticipantAcronymFilter = ref([]);
  const receiverParticipantAcronymFilter = ref([]);
  const currencyDisplayNameFilter = ref([]);
  const transactionDisplayNameFilter = ref([]);
  const statusDisplayNameFilter = ref([]);

  const transfersListFiltered = computed(() => {
    let filteredList = props.transfersList;

    if (originatorParticipantAcronymFilter.value.length > 1)
      filteredList = filteredList.filter(fL => originatorParticipantAcronymFilter.value.includes(fL.originatorParticipantAcronym));

    if (receiverParticipantAcronymFilter.value.length > 1)
      filteredList = filteredList.filter(fL => receiverParticipantAcronymFilter.value.includes(fL.receiverParticipantAcronym));

    if (currencyDisplayNameFilter.value.length > 1)
      filteredList = filteredList.filter(fL => currencyDisplayNameFilter.value.includes(fL.currencyDisplayName));

    if (transactionDisplayNameFilter.value.length > 1)
      filteredList = filteredList.filter(fL => transactionDisplayNameFilter.value.includes(fL.transactionDisplayName));

    if (statusDisplayNameFilter.value.length > 1)
      filteredList = filteredList.filter(fL => statusDisplayNameFilter.value.includes(fL.statusDisplayName));

    return filteredList;
  });


  // Paginator
  const pageIndex = ref(0);
  const pageRows = ref(10);
</script>

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

<template>
  <KeepAlive>
    <div>
      <XHeader
        title="Consulta de transferencias interbancarias"
        :breadcrumb-items="[
          { label: 'Inicio', url: '/' },
          { label: 'Monitoreo', url: '/transferencias' },
          { label: 'Reporte' },
        ]"
        :show-breadcrumb="true"
      >
        <template #description>
          <p>
            Consulta las transferencias interbancarias aplicando filtros en función a los criterios de búsqueda disponibles.
          </p>
        </template>
      </XHeader>
      
      <p class="flex justify-between gap-4 mt-9">
        Selecciona un tipo de movimiento y llena los campos necesarios para realizar la búsqueda.
      </p>

      <div class="flex justify-start my-9">
        <AdminReportsMovementTypeSelector v-model="movementType" />
      </div>

      <div class="flex gap-6 w-full justify-between items-start">
        <AdminReportsFilterClientDetails
          v-model:customer-identifier="customerIdentifier"
          v-model:customer-identifier-code="customerIdentifierCode"
          :options-filters="optionsFilters"
        />
        <AdminReportsFilterTransferDetails
          v-model:formatted-date-object="formattedDateObject"
          v-model:transaction-code-string="transactionCodeString"
          v-model:currency-code-string="currencyCodeString"
          :options-filters="optionsFilters"
        />
        <AdminReportsFilterDestinationDetails
          v-model:account-number="accountNumber"
          v-model:external-participant-code="externalParticipantCode"
          :options-filters="optionsFilters"
          :movement-type="movementType"
        />
      </div>

      <div class="mt-7">
        <XSnackBar class="flex items-center" variant="info">
          <p class="text-gray-700 ml-5">
            Recuerda que al seleccionar la opción
            <span class="font-bold">"Más criterios de búsqueda"</span>, se
            habilitarán campos adicionales que te permitirán realizar la consulta
            de manera más específica.
          </p>
        </XSnackBar>
      </div>

      <div class="flex justify-end gap-8 mt-7">
        <XButton variant="text" @click="setFilterDefaultValues">
          <div class="font-medium flex items-center px-3">
            <Icon name="x:clean" />
            <span class="ml-3">Limpiar</span>
          </div>
        </XButton>

        <XButton :disabled="!isAbleToFilter" @click="searchTransfers">
          <div class="font-medium flex items-center px-3">
            <Icon name="x:search" />
            <span class="ml-3">Buscar</span>
          </div>
        </XButton>
      </div>

      <AdminReportsMainReportTable
        v-if="searched"
        class="mt-9"
        :transfers-list="transfersList"
      />

      <div class="mb-30" />
    </div>
  </KeepAlive>
</template>

<script setup lang="ts">
  import dayjs from "dayjs";
  import { reportsService } from "~/services/reportsService";
  import type { Filters, Transfers } from "~/features/reports/types";
  
  const movementType = ref<string>("SENT");

  const optionsFilters = ref<Filters>({});

  onMounted(async () => {
    optionsFilters.value = (await reportsService.getOptions()).Filters;
    setFilterDefaultValues();
  });

  // Filters
  // Client Details
  const customerIdentifierCode = ref("ACCOUNT");
  const customerIdentifier = ref("");

  // Transaction Details
  const formattedDateObject = ref<Date | null>(null);
  const transactionCodeString = ref("");
  const currencyCodeString = ref("");

  // Destination Details
  const accountNumber = ref("");
  const externalParticipantCode = ref("");
  

  // Empty filters method
  function setFilterDefaultValues() {
    customerIdentifierCode.value = "ACCOUNT";
    customerIdentifier.value = null;

    formattedDateObject.value = null;
    transactionCodeString.value = "ALL";
    currencyCodeString.value = "ALL";

    accountNumber.value = null;
    externalParticipantCode.value = "ALL";

    transfersList.value = [];

    searched.value = false;
  }


  const isAbleToFilter = computed(() => customerIdentifier.value && formattedDateObject.value && accountNumber.value);



  // Search methods
  const searched = ref(false);
  const transfersList = ref<Transfers[]>([]);

  async function searchTransfers() {
    const transfersResponse = await reportsService.postRequestTransactional({
      isInbound: ["RECEIVED", "BOTH"].includes(movementType.value),
      isOutbound: ["SENT", "BOTH"].includes(movementType.value),
      formattedDate: dayjs(formattedDateObject.value).format(),
      customerIdentifierCode: customerIdentifierCode.value,
      customerIdentifier: customerIdentifier.value,
      currencyCodes: currencyCodeString.value == "ALL"
                      ? optionsFilters.value.currencies.map((c: Record<string, string>) => c.code)
                      : [currencyCodeString.value],
      transactionCodes: transactionCodeString.value == "ALL"
                          ? optionsFilters.value.transactions.map((c: Record<string, string>) => c.code)
                          : [transactionCodeString.value],
      accountNumber: accountNumber.value,
      externalParticipantCode: externalParticipantCode.value == "ALL" ? "" : externalParticipantCode.value,
    });

    transfersList.value = transfersResponse.transfers;
    searched.value = true;
  }

</script>

<template>
  <div>
    <XHeader
      title="Consulta de transferencias interbancarias"
      :breadcrumb-items="itemsBreadParameters"
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
      v{{ accountNumber }}a
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

      <XButton :disabled="!isAbleToFilter">
        <div class="font-medium flex items-center px-3">
          <Icon name="x:search" />
          <span class="ml-3">Buscar</span>
        </div>
      </XButton>
    </div>

    <AdminReportsMainReportTable class="mt-9 mb-24" />
  </div>
</template>

<script setup lang="ts">
  import { reportsService } from "~/services/reportsService";
  import type { Filters } from "~/features/reports/types";
  
  // Datos del breadcrumb
  const itemsBreadParameters = [
    { label: "Inicio", url: "/" },
    { label: "Monitoreo", url: "/transferencias" },
    { label: "Reporte" },
  ];



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
    customerIdentifier.value = "";

    formattedDateObject.value = null;
    transactionCodeString.value = "ALL";
    currencyCodeString.value = "ALL";

    accountNumber.value = "";
    externalParticipantCode.value = "ALL";
  }


  const isAbleToFilter = computed(() => customerIdentifier.value && formattedDate.value && accountNumber.value);
























// ✅ FUNCIÓN CORREGIDA PARA NUXT
const verDetalle = async (row: any) => {
  console.log("Navegando a detalle con datos:", row);

  try {
    // Usar navigateTo (función global de Nuxt)
    await navigateTo({
      path: "/admin/reports/detalle-transferencia",
      query: {
        banco: row.bancoOrigen,
        fecha: row.fechaHoraTransferencia,
        importe: row.importe.toString(),
        moneda: row.moneda,
      },
    });
  } catch (error) {
    console.error("Error de navegación:", error);
    // Fallback con window.location
    const params = new URLSearchParams({
      banco: row.bancoOrigen,
      fecha: row.fechaHoraTransferencia,
      importe: row.importe.toString(),
      moneda: row.moneda,
    });
    window.location.href = `/admin/reports/detalle-transferencia?${params.toString()}`;
  }
};
</script>

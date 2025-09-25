<template>
  <div class="w-1/3 max-w-[450px] p-9 bg-white border border-gray-500 rounded-2xl">
    <h3 class="font-semibold text-xl text-[#2A303A] mb-5">
      Detalles de la transferencia
    </h3>

    <XDatePicker
      v-model="formattedDateObject"
      name="formattedDateObject"
      label="Fecha"
      label-required
    />

    <!-- Trigger centrado -->
    <div class="flex justify-center mt-4">
      <h3
        class="text-primary font-normal text-[12px] m-0 cursor-pointer hover:underline flex items-center gap-1"
        @click="showFilters = !showFilters"
      >
        {{ showFilters ? "Ocultar criterios de búsqueda" : "Más criterios de búsqueda" }}
        <Icon name="x:thik-nav-arrow-down" class="ml-3 transition-all" :class="[ showFilters && 'rotate-180' ]" />
      </h3>
    </div>

    <!-- Sección desplegable centrada -->
    <transition name="fade">
      <div v-show="showFilters" class="mt-8 mx-5">
        <!-- Subtítulo alineado a la izquierda -->
        <h3 class="text-gray-700 font-medium text-base">Tipo de Transferencia</h3>

        <AdminReportsFilterTransferDetailsSelector
          v-model="transactionCodeString"
          :options="props.optionsFilters?.transactions ?? []"
        />

        <h3 class="text-gray-700 font-medium text-base mt-8">Moneda</h3>

        <AdminReportsFilterTransferDetailsSelector
          v-model="currencyCodeString"
          :options="props.optionsFilters?.currencies ?? []"
        />
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
  import type { Filters } from "~/features/reports/types";

  const props = defineProps<{
    optionsFilters: Filters;
  }>();

  // Define models
  const transactionCodeString = defineModel<string>("transaction-code-string");
  const currencyCodeString = defineModel<string>("currency-code-string");
  const formattedDateObject = defineModel<Date | null>("formatted-date-object");


  // Show/hide subpanel
  const showFilters = ref(false);
</script>

<style scoped>
  /* Animación simple para desplegar */
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s ease;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
</style>


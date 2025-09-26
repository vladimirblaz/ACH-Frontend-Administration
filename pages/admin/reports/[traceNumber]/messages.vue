<template>
  <div>
    <XHeader
      title="Ver Mensajes de orden"
      :breadcrumb-items="[
        { label: 'Inicio', url: '/' },
        { label: 'Monitoreo', url: '/transferencias' },
        { label: 'Reporte', url: '/admin/reports' },
        { label: `Mensajes de transferencia [${traceNumber}]` },
      ]"
      :show-breadcrumb="true"
      @back-click="goBack"
    />
    
    <p class="flex justify-between gap-4 mt-9 mb-10">
      Realice el seguimiento a los mensajes de petición y respuesta, verificando sus estados,
      archivos XML, así como la fecha y hora correspondientes.
    </p>
    


    <XTable size="small" class="report-table overflow-x-auto whitespace-nowrap block">
      <thead>
        <tr>
          <th>Tipo Mensaje</th>
          <th>Fecha de procesamiento</th>
          <th>Inicio envío</th>
          <th>Fin envío</th>
          <th>
            <AdminReportsFilterMainReportTableFilter
              v-model="statusDescriptionFilter"
              label="Etapa"
              :options="messagesList"
              option-key="statusDescription"
            />
          </th>
          <th>Intento</th>
          <th>Detalles</th>
        </tr>
      </thead>
      <tbody v-if="messagesList.length == 0">
        <tr>
          <td colspan="10" class="text-center">- No se encontraron transferencias con los criterios de búsqueda indicados -</td>
        </tr>
      </tbody>
      <tbody v-else>
        <tr
          v-for="(message, index) in messagesList"
          :key="index"
        >
          <td>{{ message.messageCode }}</td>
          <td>NO HAY</td>
          <td>{{ message.createdFormattedDateTime }}</td>
          <td>{{ message.updatedFormattedDateTime }}</td>
          <td>
            <XTag v-if="message.statusDescription == 'PENDING'" severity="warn" :value="message.statusDescription" />
            <XTag v-else-if="message.statusDescription == 'PROCESSED'" severity="success" :value="message.statusDescription" />
            <XTag v-else-if="message.statusDescription == 'REJECTED'" severity="danger" :value="message.statusDescription" />
            <XTag v-else value="-" />
          </td>
          <td>{{ message.returnCode }}</td>
          <td class="flex items-center">
            <XButton class="ml-3 font-medium px-6" @click="() => showXML(traceNumber, message.messageCode, message.attemptNumber)">Detalle XML</XButton>
          </td>
        </tr>
      </tbody>
    </XTable>

    <div class="mb-30" />

    <!-- XML Modal -->
    <XDialog v-model:visible="showXMLModal" :show-header="false" modal :closable="false" class="w-full max-w-[800px]">
      <section class="text-gray-800">
        <h2 class="mt-10 text-2xl font-semibold mb-10">XML del mensaje</h2>

        <div class="flex mx-10">
          <div class="w-1/2">
            <h3 class="text-lg font-semibold mb-5">Orden:</h3>

            <div>
              <span class="font-medium">Nro. de orden originante: </span>
              <span>NO HAY</span>
            </div>
            <div>
              <span class="font-medium">Nro. de orden destinatario: </span>
              <span>NO HAY</span>
            </div>
            <div>
              <span class="font-medium">Nro. de orden cámara: </span>
              <span>NO HAY</span>
            </div>
            <div>
              <span class="font-medium">Monto: </span>
              <span>NO HAY</span>
            </div>
          </div>
          <div class="w-1/2">
            <h3 class="text-lg font-semibold mb-5">Mensaje:</h3>

            <div>
              <span class="font-medium">Tipo mensaje: </span>
              <span>NO HAY</span>
            </div>
            <div>
              <span class="font-medium">Fecha procesamiento: </span>
              <span>NO HAY</span>
            </div>
          </div>
        </div>

        <div class="flex justify-end mt-10">
          <XButton variant="text" @click="downloadXML">
            <div class="font-medium flex items-center px-3">
              <Icon name="x:download" />
              <span class="ml-3">Descargar XML</span>
            </div>
          </XButton>
          <XButton variant="text" @click="copyXML">
            <div class="font-medium flex items-center px-3">
              <Icon name="x:paste-clipboard" />
              <span class="ml-3">Copiar contenido</span>
            </div>
          </XButton>
        </div>

        <pre class="language-xml rounded-lg max-h-[400px]"><code ref="xmlCode">{{ formatXml(xmlContent) }}</code></pre>

        <div class="mt-10 border-t pt-10 text-right">
          <XButton class="font-medium flex items-center px-3" @click="showXMLModal = false">Cerrar</XButton>
        </div>

      </section>
    </XDialog>

    <Toast />
  </div>
</template>

<script setup lang="ts">
  import type { Messages } from "~/features/reports/types";
  import { reportsService } from "~/services/reportsService";
  
  import Prism from "prismjs";
  import "prismjs/components/prism-markup.js";
  import "prismjs/themes/prism-tomorrow.css";

  import downloadjs from "downloadjs";

  const route = useRoute();

  const traceNumber = ref("");

  const statusDescriptionFilter = ref([]);

  const messagesList = ref<Messages>([]);

  const clipboard = useClipboard();
  const toast = useToast();

  onMounted(async () => {
    traceNumber.value = route.params.traceNumber;

    const messagesResponse = await reportsService.getIndividualTransactionMessages(traceNumber.value);

    messagesList.value = messagesResponse.messages;
  });


  function goBack() {
    useRouter().push("/admin/reports");
  }


  // Show XML
  const showXMLModal = ref(false);
  const xmlContent = ref("");
  const xmlCode = ref(null);

  const currentMessageCode = ref("");
  const currentAttemptNumber = ref("");

  async function showXML(traceNumber: string, messageCode: string, attemptNumber: string) {
    const XMLResponse = await reportsService.getIndividualTransactionMessagesXML(traceNumber, messageCode, attemptNumber);

    currentMessageCode.value = messageCode;
    currentAttemptNumber.value = attemptNumber;
    showXMLModal.value = true;

    xmlContent.value = XMLResponse.content;
    nextTick(() => { Prism.highlightElement(xmlCode.value) });
  }


  function formatXml(xml: string): string {
    const PADDING = "  ";
    const reg = /(>)(<)(\/*)/g;
    let xmlFormatted = "";
    let pad = 0;

    xml = xml.replace(reg, "$1\r\n$2$3");
    xml.split("\r\n").forEach((node: string) => {
      let indent = 0;
      if (node.match(/.+<\/\w[^>]*>$/)) {
        indent = 0;
      } else if (node.match(/^<\/\w/)) {
        if (pad !== 0) pad -= 1;
      } else if (node.match(/^<\w[^>]*[^/]>.*$/)) {
        indent = 1;
      } else {
        indent = 0;
      }

      xmlFormatted += PADDING.repeat(pad) + node + "\r\n";
      pad += indent;
    });

    return xmlFormatted;
  }


  // Actions
  function copyXML() {
    clipboard.copy(xmlContent.value);
    toast.add({ severity: 'info', detail: '¡XML copiado!', life: 3000 });
  }

  function downloadXML() {
    downloadjs(xmlContent.value, `${traceNumber.value}-${currentMessageCode.value}-${currentAttemptNumber.value}.xml`, "text/xml");
  }
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


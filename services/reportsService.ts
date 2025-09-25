import { API_CONFIG } from "~/config/api";
import type {
  OptionsResponse,
  RequestTransactionalRequest,
  RequestTransactionalResponse,
  IndividualTransactionResponse
} from './../features/reports/types';
import { useLoading } from "~/componsables/useLoading";


class ReportsService {
  private baseURL = API_CONFIG.BASE_URL;

  private async request<T>(endpoint: string, options: Record<string, string | unknown> = {}, message: string = ""): Promise<T> {
    const loading = useLoading();
    
    loading.showLoading(message);

    try {
      const url = `${this.baseURL}/${endpoint}`;

      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...(options.headers as Record<string, string>)
        }
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error en la solicitud:', error);
      throw error;
    } finally {
      loading.hideLoading();
    }
  }




  async getOptions(): Promise<OptionsResponse> {
    return this.request<OptionsResponse>(`analytics/options`);
  }

  async postRequestTransactional(request: RequestTransactionalRequest): Promise<RequestTransactionalResponse> {
    return this.request<RequestTransactionalResponse>(`analytics/reports/transactional`, { body: JSON.stringify(request), method: "POST" }, "Estamos procesando tu búsqueda");
  }

  async getIndividualTransaction(traceNumber: string): Promise<IndividualTransactionResponse> {
    return this.request<IndividualTransactionResponse>(`analytics/reports/transactional/${encodeURIComponent(traceNumber)}`);
  }
}

export const reportsService = new ReportsService();

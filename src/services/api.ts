/**
 * api.ts — Cliente HTTP base da aplicação
 *
 * Responsabilidade única: realizar requisições HTTP autenticadas ou públicas
 * contra a API REST do backend (Spring Boot), tratando erros e variações de
 * corpo de resposta de forma centralizada.
 *
 * Uso:
 *   import { apiFetch } from '@/services/api';
 *   const data = await apiFetch<MinhaInterface>('/endpoint', { method: 'POST', body: ... });
 *
 * Variáveis de ambiente necessárias:
 *   VITE_API_BASE_URL — URL base da API (ex.: http://localhost:8080)
 *                       Se omitida, as requisições usam caminho relativo,
 *                       compatível com o proxy configurado no vite.config.ts.
 */
const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

/**
 * apiFetch — wrapper tipado sobre a Fetch API nativa.
 *
 * @param path    Caminho relativo ao BASE_URL (ex.: '/auth/login')
 * @param options Opções nativas do fetch (method, headers, body, etc.)
 * @returns       Promise resolvida com o corpo JSON deserializado como T,
 *                ou `undefined` para respostas sem corpo (204 No Content).
 * @throws        Error com a mensagem retornada pelo servidor, ou mensagem
 *                genérica caso o corpo de erro não seja parseável.
 *
 * Comportamento de resposta:
 *  - 2xx com corpo JSON  → deserializa e retorna como T
 *  - 204 / corpo vazio   → retorna undefined (sem tentar .json())
 *  - 4xx / 5xx           → lança Error com mensagem do servidor
 */
export async function apiFetch<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(
      (errorBody as { message?: string })?.message ?? "Erro na requisição",
    );
  }

  if (
    response.status === 204 ||
    response.headers.get("Content-Length") === "0"
  ) {
    return undefined as T;
  }

  const text = await response.text();
  return text ? (JSON.parse(text) as T) : (undefined as T);
}

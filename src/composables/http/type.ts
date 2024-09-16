import type {SearchParameters} from "ofetch";

export interface RefreshTokenResponse {
  code: number
  message: string
  data: {
    token: string
    refresh_token: string
  };
}

export interface FetchApiFn {
  get: <T>(url: string, params?: SearchParameters) => Promise<T>
  post: <T>(url: string, body?: SearchParameters) => Promise<T>
  put: <T>(url: string, body?: SearchParameters) => Promise<T>
  delete: <T>(url: string, body?: SearchParameters) => Promise<T>
}
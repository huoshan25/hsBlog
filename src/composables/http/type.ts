import type { SearchParameters } from "ofetch";
import type { HttpRes } from "~/api/type";

export interface RefreshTokenResponse {
  token: string;
  refresh_token: string;
}

export interface FetchApiFn {
  get: <T>(url: string, params?: SearchParameters) => Promise<HttpRes<T>>;
  post: <T>(url: string, body?: SearchParameters) => Promise<HttpRes<T>>;
  put: <T>(url: string, body?: SearchParameters) => Promise<HttpRes<T>>;
  delete: <T>(url: string, body?: SearchParameters) => Promise<HttpRes<T>>;
}

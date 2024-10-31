export interface AnalyzeCodeReq {
  code: string;
  language: string;
  signal?: AbortSignal;
}
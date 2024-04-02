interface Options {
  method: string;
  headers?: HeadersInit;
  body?: object;
}

export type ApiPath = 'garage' | 'engine' | 'winners';

export const API_URL = 'http://127.0.0.1:3000';

export abstract class ApiService {
  constructor(private path: ApiPath) {}

  protected async request(endpoint: string, options: Options) {
    try {
      const defaultHeaders = { 'Content-Type': 'application/json' };
      const config = {
        method: options.method,
        headers: {
          ...defaultHeaders,
          ...options.headers,
        },
        body: JSON.stringify(options.body),
      };

      const response = await fetch(`${API_URL}/${this.path}/${endpoint}`, config);
      if (!response.ok) throw new Error('failed to patch data');
      return response;
    } catch (error) {
      throw new Error(`failed to patch data ${error}`);
    }
  }
}

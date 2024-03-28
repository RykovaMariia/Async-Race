interface Options {
  method: string;
  headers?: HeadersInit;
  body?: object;
}

export abstract class ApiService {
  constructor(private baseUrl: string) {}

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

      const response = await fetch(`${this.baseUrl}/${endpoint}`, config);
      if (!response.ok) throw new Error('failed to patch data');
      return await response.json();
    } catch (error) {
      throw new Error(`failed to patch data ${error}`);
    }
  }
}

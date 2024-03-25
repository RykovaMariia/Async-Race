interface Options {
  method: string;
  headers?: HeadersInit;
  body?: object;
}

const BASE_URL = 'http://127.0.0.1:3000';

class ApiService {
  constructor(private baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async getResponse(endpoint: string, options: Options) {
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

  public async getCars() {
    return this.getResponse('/garage', { method: 'GET' });
  }
}

export const apiService = new ApiService(BASE_URL);

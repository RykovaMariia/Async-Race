import { ApiService } from './api-service';

const BASE_URL = 'http://127.0.0.1:3000/garage';

class ApiGarageService extends ApiService {
  async getCars() {
    return await this.response('', { method: 'GET' });
  }

  async getCar(id: number) {
    return await this.response(`${id}`, { method: 'GET' });
  }

  async createCar({ name, color }: { name: string; color: string }) {
    return await this.response('', { method: 'POST', body: { name, color } });
  }

  async deleteCar(id: number) {
    return await this.response(`${id}`, { method: 'DELETE' });
  }

  async updateCar(id: number, update: { name: string; color: string }) {
    return await this.response(`${id}`, { method: 'PUT', body: update });
  }
}

export const apiGarageService = new ApiGarageService(BASE_URL);

import { ApiService } from './api-service';

const BASE_URL = 'http://127.0.0.1:3000/garage';

class ApiGarageService extends ApiService {
  async getCars() {
    return await this.response('', { method: 'GET' });
  }

  async getCar(id: number) {
    return await this.response(`${id}`, { method: 'GET' });
  }

  async createCar({ nameCar, carColor: colorCar }: { nameCar: string; carColor: string }) {
    return await this.response('', { method: 'POST', body: { nameCar, colorCar } });
  }

  async deleteCar(id: number) {
    return await this.response(`${id}`, { method: 'DELETE' });
  }

  async updateCar(id: number, update: { nameCar: string; carColor: string }) {
    return await this.response(`${id}`, { method: 'PUT', body: update });
  }
}

export const apiGarageService = new ApiGarageService(BASE_URL);

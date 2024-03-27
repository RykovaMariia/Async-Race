import { ApiService } from './api-service';

const BASE_URL = 'http://127.0.0.1:3000/engine';

class ApiEngineService extends ApiService {
  async starCarsEngine(id: number) {
    return await this.response(`?id=${id}&status=started`, { method: 'PATCH' });
  }

  async stopCarsEngine(id: number) {
    return await this.response(`?id=${id}&status=stopped`, { method: 'PATCH' });
  }

  async driveCarsEngine(id: number) {
    return await this.response(`?id=${id}&status=drive`, { method: 'PATCH' });
  }
}

export const apiEngineService = new ApiEngineService(BASE_URL);

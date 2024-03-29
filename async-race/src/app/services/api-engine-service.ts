import { ApiService } from './api-service';

export type Status = 'started' | 'stopped' | 'drive';

class ApiEngineService extends ApiService {
  private requestEngine(id: number, status: Status) {
    return this.request(`?id=${id}&status=${status}`, { method: 'PATCH' });
  }

  starCarsEngine(id: number) {
    return this.requestEngine(id, 'started');
  }

  stopCarsEngine(id: number) {
    return this.requestEngine(id, 'stopped');
  }

  driveCarsEngine(id: number) {
    return this.requestEngine(id, 'drive');
  }
}

export const apiEngineService = new ApiEngineService('engine');

import { BaseComponent } from '../components/base-component';

export interface Route {
  path: string;
  component: () => Promise<BaseComponent>;
}

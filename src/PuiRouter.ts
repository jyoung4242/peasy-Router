export interface PuiRoute {
  component: PuiComponent;
  hash: string;
  props?: Array<any>;
  default?: boolean;
}

export interface PuiComponent {
  name: string;
  create: () => void;
  template: string;
  active: boolean;
}

export class PuiRouter {
  private _updateHandler: number;

  constructor(host: HTMLElement | string, routes: Array<PuiRoute>, private updateTime: number = 1000 / 16) {
    this._updateHandler = setInterval(() => this._update(), updateTime);
  }

  addRoute(newRoute: PuiRoute) {}

  private _update() {}
}

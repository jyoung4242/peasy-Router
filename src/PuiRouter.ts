import { UI, UIView } from "@peasy-lib/peasy-ui";

export interface PuiRoute {
  component: PuiRoutingComponent;
  hash: string;
  props?: Array<Record<string, any>>;
  default?: boolean;
}

export interface PuiRoutingComponent {
  name: string;
  create: () => void;
  template: string;
  loadParams: (params: Array<any>) => void;
  loadProps: (props: Array<any>) => void;
}

/**
 * Default 404 route in case of bad path
 */
class FourOhFour {
  name: string = "404";
  create: () => void = () => {};
  template: string = `
    <div> 404: Page Not Found </div>
  `;
  active: boolean = false;
  loadParams: (params: Array<any>) => void = () => {};
  loadProps: (props: Array<any>) => void = () => {};
}

/**
 * PuiRouter
 *
 * Router for PUI components
 * @param _host HTML element or ID of element
 * @param routes Array of PuiRoutes
 * @param badPath Custom 404 route
 * @param updateTime Time in milliseconds between updates
 */

export class PuiRouter {
  defaultComponent: PuiRoutingComponent;
  defaultTemplate: string;
  view: UIView | undefined;
  oldPath: string = "";
  oldParams: Record<string, string> = {};

  constructor(
    private _host: HTMLElement | string,
    private _routes: Array<PuiRoute>,
    private _badPath: PuiRoutingComponent = new FourOhFour(),
    private _updateTime: number = 1000 / 16
  ) {
    if (typeof this._host === "string") {
      this._host = document.getElementById(this._host) as HTMLElement;
    }
    setInterval(() => this._update(), _updateTime);

    const tempRoute = this._routes.find(route => route.default)!.component;
    tempRoute ? (this.defaultComponent = tempRoute) : (this.defaultComponent = this._badPath);
    this.defaultTemplate = this.defaultComponent.template;
  }

  async initialize() {
    (this.view as UIView) = UI.create(this._host, this.defaultComponent, this.defaultComponent.template);
    await (this.view as UIView).attached;
    console.log("PuiRouter initialized", this.view);
  }

  addRoute(newRoute: PuiRoute) {
    this._routes.push(newRoute);
  }

  getRoutes() {
    return this._routes;
  }

  set404(badPath: PuiRoutingComponent) {
    this._badPath = badPath;
  }

  get404() {
    return this._badPath;
  }

  private async _update() {
    const currentPath = window.location.hash;
    const currentParams = getParams(currentPath);

    if (currentPath !== this.oldPath || JSON.stringify(currentParams) !== JSON.stringify(this.oldParams)) {
      this.oldPath = currentPath;
      this.oldParams = currentParams;

      let currentHash = currentPath.slice(1).split("?")[0];
      const route = this._routes.find(route => route.hash === currentHash);

      let nextComponent: PuiRoutingComponent | undefined;
      let nextTemplate: string | undefined;

      if (route) {
        nextComponent = route.component;
        nextTemplate = nextComponent!.template;
      } else {
        nextComponent = this._badPath;
        nextTemplate = nextComponent!.template;
      }

      if (this.view instanceof UIView) {
        this.view?.destroy();
        await this.view?.detached;
      }

      (this.view as UIView) = UI.create(this._host, nextComponent, nextTemplate);
      await (this.view as UIView).attached;

      if (route?.props) {
        route.component.loadProps?.(route.props);
      }

      const urlparams = new URLSearchParams(currentPath.split("?")[1]);
      if (urlparams.toString()) {
        // deal with params
        const paramArray: Array<any> = [];

        urlparams.forEach((value, key) => {
          paramArray.push({ key, value });
        });

        if (nextComponent && typeof nextComponent.loadParams === "function") {
          nextComponent.loadParams(paramArray);
        }
      }

      if (nextComponent === this._badPath) throw new Error("404 Route not found");
    }
  }
}

function getParams(url: string): Record<string, string> {
  const params = new URLSearchParams(url.split("?")[1]);
  const result: Record<string, string> = {};
  params.forEach((value, key) => {
    result[key] = value;
  });
  return result;
}

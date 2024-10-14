import { UI, UIView } from "@peasy-lib/peasy-ui";

export interface PuiRoute {
  component: PuiComponent;
  hash: string;
  props?: Array<Record<string, any>>;
  default?: boolean;
}

export interface PuiComponent {
  name: string;
  create: () => void;
  template: string;
  loadParams: (params: Array<any>) => void;
}

class FourOhFour {
  name: string = "404";
  create: () => void = () => {};
  template: string = `
    <div> 404: Page Not Found </div>
  `;
  active: boolean = false;
  loadParams: (params: Array<any>) => void = () => {};
}

export class PuiRouter {
  private _updateHandler: number;
  defaultComponent: PuiComponent;
  defaultTemplate: string;
  view: UIView | undefined;
  oldPath: string = "";
  oldParams: Record<string, string> = {};

  badPath: PuiComponent = new FourOhFour();

  constructor(
    private host: HTMLElement | string,
    private routes: Array<PuiRoute>,
    badPath: PuiComponent = new FourOhFour(),
    private updateTime: number = 1000 / 16
  ) {
    if (typeof this.host === "string") {
      this.host = document.getElementById(this.host) as HTMLElement;
    } else {
      this.host = this.host as HTMLElement;
    }

    this._updateHandler = setInterval(() => this._update(), updateTime);
    const tempRoute = routes.find(route => route.default)?.component;
    console.log(tempRoute);
    console.log(this.host);

    if (badPath) {
      this.badPath = badPath;
    }

    if (tempRoute) {
      this.defaultComponent = tempRoute;
      this.defaultTemplate = tempRoute.template;
    } else {
      this.defaultComponent = this.badPath;
      this.defaultTemplate = this.defaultComponent.template;
    }

    console.log(this.defaultComponent);
  }

  async initialize() {
    (this.view as UIView) = UI.create(this.host, this.defaultComponent, this.defaultComponent.template);
    await (this.view as UIView).attached;
    console.log("PuiRouter initialized", this.view);
  }

  addRoute(newRoute: PuiRoute) {
    this.routes.push(newRoute);
  }

  getRoutes() {
    return this.routes;
  }

  set404(badPath: PuiComponent) {
    this.badPath = badPath;
  }

  get404() {
    return this.badPath;
  }

  private async _update() {
    const currentPath = window.location.hash;
    const currentParams = getParams(currentPath);

    if (currentPath !== this.oldPath || JSON.stringify(currentParams) !== JSON.stringify(this.oldParams)) {
      this.oldPath = currentPath;
      this.oldParams = currentParams;

      console.log(currentPath);
      console.log(currentParams);

      let currentHash = currentPath.slice(1).split("?")[0];
      const route = this.routes.find(route => route.hash === currentHash);

      let nextComponent: PuiComponent | undefined;
      let nextTemplate: string | undefined;

      if (route) {
        nextComponent = route.component;
        nextTemplate = nextComponent!.template;
      } else {
        nextComponent = this.badPath;
        nextTemplate = nextComponent!.template;
      }

      this.view?.destroy();
      await this.view?.detached;
      (this.view as UIView) = UI.create(this.host, nextComponent, nextTemplate);
      await (this.view as UIView).attached;

      if (route?.props) {
        route.component.loadParams?.(route.props);
      }

      const urlparams = new URLSearchParams(currentPath.split("?")[1]);
      if (urlparams.toString()) {
        // deal with params
        const paramArray: Array<any> = [];

        urlparams.forEach((value, key) => {
          paramArray.push({ key, value });
        });

        if (nextComponent && typeof nextComponent.loadParams === "function") {
          console.log(nextComponent);
          nextComponent.loadParams(paramArray);
        }
      }

      if (nextComponent === this.badPath) throw new Error("404 Route not found");
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

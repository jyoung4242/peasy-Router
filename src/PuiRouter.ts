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
  updatecount = 0;
  defaultComponent: PuiRoutingComponent;
  defaultTemplate: string;
  view: UIView | undefined;
  oldPath: string = "";
  oldParams: Record<string, string> = {};

  /**
   * @param _host HTML element or ID of element
   * @param _routes Array of PuiRoutes
   * @param _badPath Custom 404 route
   * @param _updateTime Time in milliseconds between updates
   *
   * Constructor for PuiRouter
   *
   * Sets up the PuiRouter class
   *
   */
  constructor(
    private _host: HTMLElement | string,
    private _routes: Array<PuiRoute>,
    private _badPath: PuiRoutingComponent = new FourOhFour(),
    private _updateTime: number = 1000 / 16
  ) {
    if (typeof this._host === "string") {
      this._host = document.getElementById(this._host) as HTMLElement;
    }

    const tempRoute = this._routes.find(route => route.default)?.component;
    tempRoute ? (this.defaultComponent = tempRoute) : (this.defaultComponent = this._badPath);
    this.defaultTemplate = this.defaultComponent.template;
  }

  /**
   * Initializes the router
   *
   * Creates the default route and sets the current view to it
   *
   * @throws Error if no default route is found
   */
  async initialize() {
    (this.view as UIView) = UI.create(this._host, this.defaultComponent, this.defaultComponent.template);
    await (this.view as UIView).attached;
    window.location.hash = `#${this.defaultComponent.name}`;
    this.oldPath = window.location.hash;
    this.oldParams = getParams(this.oldPath);
    setInterval(() => this.update(), this._updateTime);
    if (this.defaultComponent === this._badPath) throw new Error("404 Route not found");
  }

  addRoute(newRoute: PuiRoute) {
    this._routes.push(newRoute);
  }

  getRoutes() {
    return this._routes;
  }

  getCount() {
    return this.updatecount;
  }

  getDefaultRoute() {
    return this.defaultComponent;
  }

  set404(badPath: PuiRoutingComponent) {
    this._badPath = badPath;
  }

  get404() {
    return this._badPath;
  }

  getCurrentPath() {
    return window.location.hash;
  }

  /**
   * Updates the current view based on the current hash and parameters in the URL
   *
   * Gets the current path and parameters from the URL, and compares them to the previous values
   * If they are different, it updates the current view with the new values
   *
   * If no route is found for the current hash, it throws an error
   *
   * @private
   * @async
   */
  public async update() {
    const currentPath = window.location.hash;
    const currentParams = getParams(currentPath);

    if (currentPath !== this.oldPath || JSON.stringify(currentParams) !== JSON.stringify(this.oldParams)) {
      this.updatecount++;
      this.oldPath = currentPath;
      this.oldParams = currentParams;

      let currentHash = currentPath.slice(1).split("?")[0];
      const route = this._routes.find(route => route.hash === currentHash);

      let nextComponent: PuiRoutingComponent | undefined;
      let nextTemplate: string | undefined;

      route ? (nextComponent = route.component) : (nextComponent = this._badPath);
      nextTemplate = nextComponent!.template;

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

        urlparams.forEach((value, key) => paramArray.push({ key, value }));

        if (nextComponent && typeof nextComponent.loadParams === "function") {
          nextComponent.loadParams(paramArray);
        }
      }

      if (nextComponent === this._badPath) throw new Error("404 Route not found");
    }
  }
}

/**
 * Extracts parameters from a URL and returns them as an object
 *
 * @param url The URL to extract parameters from
 * @returns An object with parameter names as keys and parameter values as values
 */
function getParams(url: string): Record<string, string> {
  const params = new URLSearchParams(url.split("?")[1]);
  const result: Record<string, string> = {};
  params.forEach((value, key) => {
    result[key] = value;
  });
  return result;
}

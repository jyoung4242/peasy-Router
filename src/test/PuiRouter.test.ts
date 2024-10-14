import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { PuiRoute, PuiRouter } from "../PuiRouter";

describe("A PuiRouter", () => {
  class Home {
    public static name = "Home";
    public static create: () => {};
    public static template: "<div>Home</div>";
    public static loadParams: (params: Array<any>) => {};
    public static loadProps: (props: Array<any>) => {};
  }

  class Custom404 {
    name = "404";
    public static create: () => {};
    public static template: "<div>TEST 404</div>";
    public static loadParams: (params: Array<any>) => {};
    public static loadProps: (props: Array<any>) => {};
  }

  class TestRoute {
    public static name = "Test";
    public static template = "<div>Test</div>";
    public static loadParams = (params: Array<any>) => {};
    public static loadProps = (props: Array<any>) => {};
    public static create = () => {};
  }

  class TestRouteWithProps {
    public static name = "testWithProps";
    public static foo = "";
    public static template = "<div>testRouteWithProps</div>";
    public static loadParams = (params: Array<any>) => {};
    public static loadProps = (props: Array<any>) => {
      console.log("props", props);
      TestRouteWithProps.foo = props[0].value;
    };
    public static create = () => {};

    public static getFoo() {
      return TestRouteWithProps.foo;
    }
  }

  class TestRouteWithParams {
    public static name = "testRouteWithParams";
    public static foo = "";
    public static template = "<div>testRouteWithParams</div>";
    public static loadParams = (params: Array<any>) => {
      TestRouteWithParams.foo = params[0].value;
    };
    public static loadProps = (props: Array<any>) => {};
    public static create = () => {};
  }

  beforeEach(() => {
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it("should initialize with default route", async () => {
    let mainElement = document.createElement("div");
    let router = new PuiRouter(mainElement, [{ component: Home, hash: "home", default: true }]);
    await router.initialize();
    expect(router.getDefaultRoute()).toBe(Home);
  });

  it("should throw error if no default route is found", async () => {
    let mainElement = document.createElement("div");
    let router = new PuiRouter(mainElement, [{ component: Home, hash: "home" }]);
    await expect(router.initialize()).rejects.toThrowError("404 Route not found");
  });

  it("should add route to routes array", () => {
    let mainElement = document.createElement("div");
    let router = new PuiRouter(mainElement, [{ component: Home, hash: "home" }]);
    const newRoute = { component: TestRoute, hash: "test" };
    router.addRoute(newRoute);
    expect(router.getRoutes()).toContain(newRoute);
  });

  it("should get 404 route", async () => {
    let mainElement = document.createElement("div");
    let router = new PuiRouter(mainElement, [{ component: Home, hash: "home" }], Custom404);
    expect(router.getDefaultRoute()).toBe(Custom404);
    await expect(router.initialize()).rejects.toThrowError("404 Route not found");
  });

  it("should set 404 route", () => {
    let mainElement = document.createElement("div");
    let router = new PuiRouter(mainElement, [{ component: Home, hash: "home", default: true }]);
    router.set404(Custom404);
    expect(router.get404()).toBe(Custom404);
  });

  it("should update view on hash change", async () => {
    vi.useFakeTimers(); // Enable fake timers
    let mainElement = document.createElement("div");

    const anchorTest = document.createElement("a");
    anchorTest.href = "#test";
    anchorTest.textContent = "Click me";

    document.body.appendChild(anchorTest);
    document.body.appendChild(mainElement);

    let router = new PuiRouter(mainElement, [
      { component: Home, hash: "home", default: true },
      { component: TestRoute, hash: "test" },
    ]);

    await router.initialize();
    vi.advanceTimersByTime(100);
    expect(router.getCount()).toBe(0);
    expect(router.getCurrentPath()).toBe("#Home");

    anchorTest.click();
    vi.advanceTimersByTime(100);
    expect(router.getCount()).toBe(1);
    expect(router.getCurrentPath()).toBe("#test");
    vi.useRealTimers();
  });

  it("should accept a string id for the router host", async () => {
    let mainElement = document.createElement("div");
    mainElement.id = "main";
    document.body.appendChild(mainElement);
    let router = new PuiRouter("main", [{ component: Home, hash: "home", default: true }]);
    expect(router.getDefaultRoute()).toBe(Home);
  });

  it("should accept an array of routes", async () => {
    let mainElement = document.createElement("div");
    let routes: PuiRoute[] = [
      { component: Home, hash: "home", default: true },
      { component: TestRoute, hash: "test" },
      { component: TestRouteWithParams, hash: "testWithParams" },
      { component: TestRouteWithProps, hash: "testWithProps" },
    ];

    let router = new PuiRouter(mainElement, routes);
    expect(router.getRoutes()).toEqual(routes);
  });
});

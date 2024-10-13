import "./style.css";
import { UI } from "@peasy-lib/peasy-ui";
import { Header } from "./components/header";
import { Navbar } from "./components/navbar";
import { Footer } from "./components/footer";
import { PuiRoute, PuiRouter } from "./PUI_Router";
import { Home } from "./components/Home";
import { About } from "./components/About";
import { Contact } from "./components/Contact";

const model = {
  Header,
  Navbar,
  Footer,
  PuiRouter,
  RouterState: {
    default: "Home",
    routes: [
      { component: Home, name: "Home", state: {} },
      { component: About, name: "About", state: {} },
      { component: Contact, name: "Contact", state: {} },
    ] as Array<PuiRoute>,
  },
};

const template = `
<div>  
    <\${Header ===}>
    <\${Navbar ===}>
    <\${Footer ===}>
    <\${PuiRouter === RouterState}>
</div>`;

//Setup Routes

await UI.create(document.body, model, template).attached;

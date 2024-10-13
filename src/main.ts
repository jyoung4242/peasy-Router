import "./style.css";
import { UI } from "@peasy-lib/peasy-ui";
import { Header } from "./components/header";
import { Navbar } from "./components/navbar";
import { Footer } from "./components/footer";
import { PuiRouter } from "./PuiRouter";
import { Home } from "./components/Home";
import { About } from "./components/About";
import { Contact } from "./components/Contact";

const model = {
  Header,
  Navbar,
  Footer,
};

const template = `
<div>  
    <\${Header ===}>
    <\${Navbar ===}>
    <\${Footer ===}>
    <main></main>
</div>`;

//Setup Routes

await UI.create(document.body, model, template).attached;

const myRouter = new PuiRouter(document.getElementsByTagName("main")[0], [
  { component: Home, hash: "Home", default: true },
  { component: About, hash: "About" },
  { component: Contact, hash: "Contact" },
]);

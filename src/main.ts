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
    <main id="main"></main>
</div>`;

//Setup Routes

await UI.create(document.body, model, template).attached;

const myRouter = new PuiRouter("main", [
  { component: Home, hash: "Home", default: true },
  { component: About, hash: "About", props: [{ username: "Mookie" }] },
  { component: Contact, hash: "Contact" },
]);

/*test out 404 override */
class Custom404 {
  name: string = "404";
  create: () => void = () => {};
  template: string = `
      <div> 404: Page Not Found </div>
      <a href="#Home">Return to Home</a>
    `;
  active: boolean = false;
  loadParams: (params: Array<any>) => void = () => {};
  loadProps: (props: Array<any>) => void = () => {};
}

myRouter.set404(new Custom404());

myRouter.initialize();

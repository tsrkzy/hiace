import App from "./App.svelte";
import "./util/firebaseApp";
import "./util/firestore";
import "./scss/index.scss";

const app = new App({
  target: document.getElementById("app") as Element,
});

export default app;

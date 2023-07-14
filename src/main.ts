import './app.css'
import App from './App.svelte'
import "./util/firebaseApp";


const app = new App({
  target: document.getElementById('app'),
})

export default app

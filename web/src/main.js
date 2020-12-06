import App from "./App.svelte";
import "aframe"
import "./lib/aframe-keyboard.min.js";

const app = new App({
	target: document.body,
	props: {}
});

export default app;

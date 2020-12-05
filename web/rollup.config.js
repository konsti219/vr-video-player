// rollup.config.js
import svelte from "rollup-plugin-svelte";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import css from "rollup-plugin-css-only";
import { terser } from "rollup-plugin-terser";
import dotenv from "dotenv"
dotenv.config({ path: "../.env" });

export default {
  input: "src/main.js",
  output: {
    sourcemap: process.env.NODE_ENV == "development",
    format: "iife",
    name: "vr_video_player_web",
    file: "public/build/bundle.js",
  },
  plugins: [
    svelte({
      compilerOptions: {
        dev: false,
      },
    }),
    css({ output: "bundle.css" }),

    resolve({
      browser: true,
      dedupe: ["svelte"],
    }),
    commonjs(),
    terser()
  ],
  watch: {
    clearScreen: false,
  },
};

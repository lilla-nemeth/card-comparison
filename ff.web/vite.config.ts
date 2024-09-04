import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import tsconfigPaths from "vite-tsconfig-paths";
import svgr from "vite-plugin-svgr";
import "dotenv/config";

const env = loadEnv("", process.cwd());

// Let's not import all the environment variables autimatically but bring them
// in by hand just to be sure we don't leak sensitive information by accident

// https://vitejs.dev/config/

// Docker-compose env vars takes privilege over .env files
// WHen running a single service from it's directory, the .env file is used
// When running all services, the .env file is used but overriden by the docker-compose env vars
// In production env vars have to be brouught in through the Dockerfile as ARGS

const PORT = parseInt(process.env.VITE_FFWEB_PORT as string) ?? 3000;
const BASE_URL = process.env.VITE_FFWEB_BASE_URL ?? "/";
const API_URL = process.env.VITE_FFAPI_URL ?? "http://localhost:6307";

export default () => {
  return defineConfig({
    base: BASE_URL,
    define: {
      API_URL: JSON.stringify(API_URL),
    },
    server: {
      port: PORT,
    },
    preview: {
      port: PORT,
    },
    plugins: [tsconfigPaths(), react(), svgr()],
  });
};

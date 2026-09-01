// vite.config.js
import { defineConfig, loadEnv } from "file:///D:/Mon%20travail/meybeauty/node_modules/vite/dist/node/index.js";
import react from "file:///D:/Mon%20travail/meybeauty/node_modules/@vitejs/plugin-react/dist/index.js";
import Stripe from "file:///D:/Mon%20travail/meybeauty/node_modules/stripe/esm/stripe.esm.node.js";
import { z } from "file:///D:/Mon%20travail/meybeauty/node_modules/zod/index.js";
import path from "path";
import { fileURLToPath } from "url";
var __vite_injected_original_import_meta_url = "file:///D:/Mon%20travail/meybeauty/vite.config.js";
var __dirname = path.dirname(fileURLToPath(__vite_injected_original_import_meta_url));
var stripeBackendPlugin = (env) => ({
  name: "stripe-backend",
  configureServer(server) {
    server.middlewares.use("/api/stripe-payment", async (req, res, next) => {
      if (req.method === "OPTIONS") {
        res.writeHead(200, {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Content-Type": "application/json"
        });
        res.end();
        return;
      }
      if (req.method !== "POST") {
        res.writeHead(405, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Method not allowed" }));
        return;
      }
      try {
        const body = await new Promise((resolve, reject) => {
          let data = "";
          req.on("data", (chunk) => data += chunk);
          req.on("end", () => {
            try {
              resolve(JSON.parse(data));
            } catch (e) {
              reject(e);
            }
          });
        });
        const secretKey = env.VITE_STRIPE_SECRET_KEY || process.env.VITE_STRIPE_SECRET_KEY;
        if (!secretKey) {
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Stripe secret key not configured" }));
          return;
        }
        const stripe = new Stripe(secretKey, {
          apiVersion: "2024-06-20"
        });
        const { amount, currency, paymentMethodId, description } = body;
        const paymentIntent = await stripe.paymentIntents.create({
          amount: Math.round(amount),
          currency: currency || "eur",
          payment_method: paymentMethodId,
          confirmation_method: "manual",
          confirm: true,
          return_url: "http://localhost:5173/cart",
          description: description || "Commande Mey Beauty",
          metadata: {
            order_id: `MEY-${Date.now()}`,
            store: "Mey Beauty"
          }
        });
        res.writeHead(200, {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        });
        if (paymentIntent.status === "requires_action") {
          res.end(JSON.stringify({
            success: false,
            requiresAction: true,
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id
          }));
        } else if (paymentIntent.status === "succeeded") {
          res.end(JSON.stringify({
            success: true,
            paymentIntentId: paymentIntent.id,
            amount: paymentIntent.amount,
            currency: paymentIntent.currency
          }));
        } else {
          res.end(JSON.stringify({
            success: false,
            status: paymentIntent.status
          }));
        }
      } catch (error) {
        console.error("[STRIPE BACKEND ERROR]", error);
        res.writeHead(400, {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        });
        res.end(JSON.stringify({
          error: "stripe_error",
          message: error.message || "Payment failed"
        }));
      }
    });
  }
});
var vite_config_default = defineConfig(({ mode }) => {
  const env = loadEnv(mode, __dirname, "");
  return {
    base: "./",
    plugins: [react(), stripeBackendPlugin(env)],
    server: {
      port: 5173
    },
    build: {
      // Optimisations pour la performance
      target: "es2020",
      minify: "esbuild",
      rollupOptions: {
        output: {
          // Code splitting manuel pour réduire le bundle initial
          manualChunks: {
            "vendor-react": ["react", "react-dom"],
            "vendor-router": ["react-helmet-async"],
            "vendor-stripe": ["@stripe/stripe-js", "@stripe/react-stripe-js"],
            "vendor-firebase": ["firebase/app", "firebase/firestore", "firebase/auth", "firebase/storage"]
          }
        }
      },
      // Compression des assets
      assetsInlineLimit: 4096,
      chunkSizeWarningLimit: 1e3,
      // Préchargement des modules critiques
      modulePreload: {
        polyfill: true
      }
    },
    // Optimisations pour le développement
    optimizeDeps: {
      include: ["react", "react-dom", "firebase/app", "firebase/firestore"]
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxNb24gdHJhdmFpbFxcXFxtZXliZWF1dHlcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXE1vbiB0cmF2YWlsXFxcXG1leWJlYXV0eVxcXFx2aXRlLmNvbmZpZy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovTW9uJTIwdHJhdmFpbC9tZXliZWF1dHkvdml0ZS5jb25maWcuanNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcsIGxvYWRFbnYgfSBmcm9tICd2aXRlJztcclxuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0JztcclxuaW1wb3J0IFN0cmlwZSBmcm9tICdzdHJpcGUnO1xyXG5pbXBvcnQgeyB6IH0gZnJvbSAnem9kJztcclxuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XHJcbmltcG9ydCB7IGZpbGVVUkxUb1BhdGggfSBmcm9tICd1cmwnO1xyXG5cclxuY29uc3QgX19kaXJuYW1lID0gcGF0aC5kaXJuYW1lKGZpbGVVUkxUb1BhdGgoaW1wb3J0Lm1ldGEudXJsKSk7XHJcblxyXG4vLyBTaW1wbGUgYmFja2VuZCBwbHVnaW4gZm9yIGxvY2FsIGRldmVsb3BtZW50XHJcbmNvbnN0IHN0cmlwZUJhY2tlbmRQbHVnaW4gPSAoZW52KSA9PiAoe1xyXG4gIG5hbWU6ICdzdHJpcGUtYmFja2VuZCcsXHJcbiAgY29uZmlndXJlU2VydmVyKHNlcnZlcikge1xyXG4gICAgc2VydmVyLm1pZGRsZXdhcmVzLnVzZSgnL2FwaS9zdHJpcGUtcGF5bWVudCcsIGFzeW5jIChyZXEsIHJlcywgbmV4dCkgPT4ge1xyXG4gICAgICBpZiAocmVxLm1ldGhvZCA9PT0gJ09QVElPTlMnKSB7XHJcbiAgICAgICAgcmVzLndyaXRlSGVhZCgyMDAsIHtcclxuICAgICAgICAgICdBY2Nlc3MtQ29udHJvbC1BbGxvdy1PcmlnaW4nOiAnKicsXHJcbiAgICAgICAgICAnQWNjZXNzLUNvbnRyb2wtQWxsb3ctSGVhZGVycyc6ICdDb250ZW50LVR5cGUnLFxyXG4gICAgICAgICAgJ0FjY2Vzcy1Db250cm9sLUFsbG93LU1ldGhvZHMnOiAnUE9TVCwgT1BUSU9OUycsXHJcbiAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmVzLmVuZCgpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHJlcS5tZXRob2QgIT09ICdQT1NUJykge1xyXG4gICAgICAgIHJlcy53cml0ZUhlYWQoNDA1LCB7ICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicgfSk7XHJcbiAgICAgICAgcmVzLmVuZChKU09OLnN0cmluZ2lmeSh7IGVycm9yOiAnTWV0aG9kIG5vdCBhbGxvd2VkJyB9KSk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB0cnkge1xyXG4gICAgICAgIGNvbnN0IGJvZHkgPSBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICBsZXQgZGF0YSA9ICcnO1xyXG4gICAgICAgICAgcmVxLm9uKCdkYXRhJywgY2h1bmsgPT4gZGF0YSArPSBjaHVuayk7XHJcbiAgICAgICAgICByZXEub24oJ2VuZCcsICgpID0+IHtcclxuICAgICAgICAgICAgdHJ5IHsgcmVzb2x2ZShKU09OLnBhcnNlKGRhdGEpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH1cclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBjb25zdCBzZWNyZXRLZXkgPSBlbnYuVklURV9TVFJJUEVfU0VDUkVUX0tFWSB8fCBwcm9jZXNzLmVudi5WSVRFX1NUUklQRV9TRUNSRVRfS0VZO1xyXG4gICAgICAgIGlmICghc2VjcmV0S2V5KSB7XHJcbiAgICAgICAgICByZXMud3JpdGVIZWFkKDUwMCwgeyAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nIH0pO1xyXG4gICAgICAgICAgcmVzLmVuZChKU09OLnN0cmluZ2lmeSh7IGVycm9yOiAnU3RyaXBlIHNlY3JldCBrZXkgbm90IGNvbmZpZ3VyZWQnIH0pKTtcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgY29uc3Qgc3RyaXBlID0gbmV3IFN0cmlwZShzZWNyZXRLZXksIHtcclxuICAgICAgICAgIGFwaVZlcnNpb246ICcyMDI0LTA2LTIwJ1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBjb25zdCB7IGFtb3VudCwgY3VycmVuY3ksIHBheW1lbnRNZXRob2RJZCwgZGVzY3JpcHRpb24gfSA9IGJvZHk7XHJcblxyXG4gICAgICAgIGNvbnN0IHBheW1lbnRJbnRlbnQgPSBhd2FpdCBzdHJpcGUucGF5bWVudEludGVudHMuY3JlYXRlKHtcclxuICAgICAgICAgIGFtb3VudDogTWF0aC5yb3VuZChhbW91bnQpLFxyXG4gICAgICAgICAgY3VycmVuY3k6IGN1cnJlbmN5IHx8ICdldXInLFxyXG4gICAgICAgICAgcGF5bWVudF9tZXRob2Q6IHBheW1lbnRNZXRob2RJZCxcclxuICAgICAgICAgIGNvbmZpcm1hdGlvbl9tZXRob2Q6ICdtYW51YWwnLFxyXG4gICAgICAgICAgY29uZmlybTogdHJ1ZSxcclxuICAgICAgICAgIHJldHVybl91cmw6ICdodHRwOi8vbG9jYWxob3N0OjUxNzMvY2FydCcsXHJcbiAgICAgICAgICBkZXNjcmlwdGlvbjogZGVzY3JpcHRpb24gfHwgJ0NvbW1hbmRlIE1leSBCZWF1dHknLFxyXG4gICAgICAgICAgbWV0YWRhdGE6IHtcclxuICAgICAgICAgICAgb3JkZXJfaWQ6IGBNRVktJHtEYXRlLm5vdygpfWAsXHJcbiAgICAgICAgICAgIHN0b3JlOiAnTWV5IEJlYXV0eSdcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmVzLndyaXRlSGVhZCgyMDAsIHtcclxuICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicsXHJcbiAgICAgICAgICAnQWNjZXNzLUNvbnRyb2wtQWxsb3ctT3JpZ2luJzogJyonXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGlmIChwYXltZW50SW50ZW50LnN0YXR1cyA9PT0gJ3JlcXVpcmVzX2FjdGlvbicpIHtcclxuICAgICAgICAgIHJlcy5lbmQoSlNPTi5zdHJpbmdpZnkoe1xyXG4gICAgICAgICAgICBzdWNjZXNzOiBmYWxzZSxcclxuICAgICAgICAgICAgcmVxdWlyZXNBY3Rpb246IHRydWUsXHJcbiAgICAgICAgICAgIGNsaWVudFNlY3JldDogcGF5bWVudEludGVudC5jbGllbnRfc2VjcmV0LFxyXG4gICAgICAgICAgICBwYXltZW50SW50ZW50SWQ6IHBheW1lbnRJbnRlbnQuaWRcclxuICAgICAgICAgIH0pKTtcclxuICAgICAgICB9IGVsc2UgaWYgKHBheW1lbnRJbnRlbnQuc3RhdHVzID09PSAnc3VjY2VlZGVkJykge1xyXG4gICAgICAgICAgcmVzLmVuZChKU09OLnN0cmluZ2lmeSh7XHJcbiAgICAgICAgICAgIHN1Y2Nlc3M6IHRydWUsXHJcbiAgICAgICAgICAgIHBheW1lbnRJbnRlbnRJZDogcGF5bWVudEludGVudC5pZCxcclxuICAgICAgICAgICAgYW1vdW50OiBwYXltZW50SW50ZW50LmFtb3VudCxcclxuICAgICAgICAgICAgY3VycmVuY3k6IHBheW1lbnRJbnRlbnQuY3VycmVuY3lcclxuICAgICAgICAgIH0pKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgcmVzLmVuZChKU09OLnN0cmluZ2lmeSh7XHJcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZhbHNlLFxyXG4gICAgICAgICAgICBzdGF0dXM6IHBheW1lbnRJbnRlbnQuc3RhdHVzXHJcbiAgICAgICAgICB9KSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICBjb25zb2xlLmVycm9yKCdbU1RSSVBFIEJBQ0tFTkQgRVJST1JdJywgZXJyb3IpO1xyXG4gICAgICAgIHJlcy53cml0ZUhlYWQoNDAwLCB7XHJcbiAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLFxyXG4gICAgICAgICAgJ0FjY2Vzcy1Db250cm9sLUFsbG93LU9yaWdpbic6ICcqJ1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJlcy5lbmQoSlNPTi5zdHJpbmdpZnkoe1xyXG4gICAgICAgICAgZXJyb3I6ICdzdHJpcGVfZXJyb3InLFxyXG4gICAgICAgICAgbWVzc2FnZTogZXJyb3IubWVzc2FnZSB8fCAnUGF5bWVudCBmYWlsZWQnXHJcbiAgICAgICAgfSkpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcbn0pO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKCh7IG1vZGUgfSkgPT4ge1xyXG4gIGNvbnN0IGVudiA9IGxvYWRFbnYobW9kZSwgX19kaXJuYW1lLCAnJyk7XHJcbiAgXHJcbiAgcmV0dXJuIHtcclxuICAgIGJhc2U6ICcuLycsXHJcbiAgICBwbHVnaW5zOiBbcmVhY3QoKSwgc3RyaXBlQmFja2VuZFBsdWdpbihlbnYpXSxcclxuICAgIHNlcnZlcjoge1xyXG4gICAgICBwb3J0OiA1MTczXHJcbiAgICB9LFxyXG4gICAgYnVpbGQ6IHtcclxuICAgICAgLy8gT3B0aW1pc2F0aW9ucyBwb3VyIGxhIHBlcmZvcm1hbmNlXHJcbiAgICAgIHRhcmdldDogJ2VzMjAyMCcsXHJcbiAgICAgIG1pbmlmeTogJ2VzYnVpbGQnLFxyXG4gICAgICByb2xsdXBPcHRpb25zOiB7XHJcbiAgICAgICAgb3V0cHV0OiB7XHJcbiAgICAgICAgICAvLyBDb2RlIHNwbGl0dGluZyBtYW51ZWwgcG91ciByXHUwMEU5ZHVpcmUgbGUgYnVuZGxlIGluaXRpYWxcclxuICAgICAgICAgIG1hbnVhbENodW5rczoge1xyXG4gICAgICAgICAgICAndmVuZG9yLXJlYWN0JzogWydyZWFjdCcsICdyZWFjdC1kb20nXSxcclxuICAgICAgICAgICAgJ3ZlbmRvci1yb3V0ZXInOiBbJ3JlYWN0LWhlbG1ldC1hc3luYyddLFxyXG4gICAgICAgICAgICAndmVuZG9yLXN0cmlwZSc6IFsnQHN0cmlwZS9zdHJpcGUtanMnLCAnQHN0cmlwZS9yZWFjdC1zdHJpcGUtanMnXSxcclxuICAgICAgICAgICAgJ3ZlbmRvci1maXJlYmFzZSc6IFsnZmlyZWJhc2UvYXBwJywgJ2ZpcmViYXNlL2ZpcmVzdG9yZScsICdmaXJlYmFzZS9hdXRoJywgJ2ZpcmViYXNlL3N0b3JhZ2UnXVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuICAgICAgLy8gQ29tcHJlc3Npb24gZGVzIGFzc2V0c1xyXG4gICAgICBhc3NldHNJbmxpbmVMaW1pdDogNDA5NixcclxuICAgICAgY2h1bmtTaXplV2FybmluZ0xpbWl0OiAxMDAwLFxyXG4gICAgICAvLyBQclx1MDBFOWNoYXJnZW1lbnQgZGVzIG1vZHVsZXMgY3JpdGlxdWVzXHJcbiAgICAgIG1vZHVsZVByZWxvYWQ6IHtcclxuICAgICAgICBwb2x5ZmlsbDogdHJ1ZVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgLy8gT3B0aW1pc2F0aW9ucyBwb3VyIGxlIGRcdTAwRTl2ZWxvcHBlbWVudFxyXG4gICAgb3B0aW1pemVEZXBzOiB7XHJcbiAgICAgIGluY2x1ZGU6IFsncmVhY3QnLCAncmVhY3QtZG9tJywgJ2ZpcmViYXNlL2FwcCcsICdmaXJlYmFzZS9maXJlc3RvcmUnXVxyXG4gICAgfVxyXG4gIH07XHJcbn0pO1xyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQWtRLFNB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

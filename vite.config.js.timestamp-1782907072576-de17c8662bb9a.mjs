// vite.config.js
import { defineConfig, loadEnv } from "file:///C:/Users/Junel/Downloads/mey%20beauty/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/Junel/Downloads/mey%20beauty/node_modules/@vitejs/plugin-react/dist/index.js";
import Stripe from "file:///C:/Users/Junel/Downloads/mey%20beauty/node_modules/stripe/esm/stripe.esm.node.js";
import { z } from "file:///C:/Users/Junel/Downloads/mey%20beauty/node_modules/zod/index.js";
import path from "path";
import { fileURLToPath } from "url";
var __vite_injected_original_import_meta_url = "file:///C:/Users/Junel/Downloads/mey%20beauty/vite.config.js";
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxKdW5lbFxcXFxEb3dubG9hZHNcXFxcbWV5IGJlYXV0eVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcSnVuZWxcXFxcRG93bmxvYWRzXFxcXG1leSBiZWF1dHlcXFxcdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL0p1bmVsL0Rvd25sb2Fkcy9tZXklMjBiZWF1dHkvdml0ZS5jb25maWcuanNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcsIGxvYWRFbnYgfSBmcm9tICd2aXRlJztcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XG5pbXBvcnQgU3RyaXBlIGZyb20gJ3N0cmlwZSc7XG5pbXBvcnQgeyB6IH0gZnJvbSAnem9kJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgZmlsZVVSTFRvUGF0aCB9IGZyb20gJ3VybCc7XG5cbmNvbnN0IF9fZGlybmFtZSA9IHBhdGguZGlybmFtZShmaWxlVVJMVG9QYXRoKGltcG9ydC5tZXRhLnVybCkpO1xuXG4vLyBTaW1wbGUgYmFja2VuZCBwbHVnaW4gZm9yIGxvY2FsIGRldmVsb3BtZW50XG5jb25zdCBzdHJpcGVCYWNrZW5kUGx1Z2luID0gKGVudikgPT4gKHtcbiAgbmFtZTogJ3N0cmlwZS1iYWNrZW5kJyxcbiAgY29uZmlndXJlU2VydmVyKHNlcnZlcikge1xuICAgIHNlcnZlci5taWRkbGV3YXJlcy51c2UoJy9hcGkvc3RyaXBlLXBheW1lbnQnLCBhc3luYyAocmVxLCByZXMsIG5leHQpID0+IHtcbiAgICAgIGlmIChyZXEubWV0aG9kID09PSAnT1BUSU9OUycpIHtcbiAgICAgICAgcmVzLndyaXRlSGVhZCgyMDAsIHtcbiAgICAgICAgICAnQWNjZXNzLUNvbnRyb2wtQWxsb3ctT3JpZ2luJzogJyonLFxuICAgICAgICAgICdBY2Nlc3MtQ29udHJvbC1BbGxvdy1IZWFkZXJzJzogJ0NvbnRlbnQtVHlwZScsXG4gICAgICAgICAgJ0FjY2Vzcy1Db250cm9sLUFsbG93LU1ldGhvZHMnOiAnUE9TVCwgT1BUSU9OUycsXG4gICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ1xuICAgICAgICB9KTtcbiAgICAgICAgcmVzLmVuZCgpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmIChyZXEubWV0aG9kICE9PSAnUE9TVCcpIHtcbiAgICAgICAgcmVzLndyaXRlSGVhZCg0MDUsIHsgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyB9KTtcbiAgICAgICAgcmVzLmVuZChKU09OLnN0cmluZ2lmeSh7IGVycm9yOiAnTWV0aG9kIG5vdCBhbGxvd2VkJyB9KSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgYm9keSA9IGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICBsZXQgZGF0YSA9ICcnO1xuICAgICAgICAgIHJlcS5vbignZGF0YScsIGNodW5rID0+IGRhdGEgKz0gY2h1bmspO1xuICAgICAgICAgIHJlcS5vbignZW5kJywgKCkgPT4ge1xuICAgICAgICAgICAgdHJ5IHsgcmVzb2x2ZShKU09OLnBhcnNlKGRhdGEpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgY29uc3Qgc2VjcmV0S2V5ID0gZW52LlZJVEVfU1RSSVBFX1NFQ1JFVF9LRVkgfHwgcHJvY2Vzcy5lbnYuVklURV9TVFJJUEVfU0VDUkVUX0tFWTtcbiAgICAgICAgaWYgKCFzZWNyZXRLZXkpIHtcbiAgICAgICAgICByZXMud3JpdGVIZWFkKDUwMCwgeyAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nIH0pO1xuICAgICAgICAgIHJlcy5lbmQoSlNPTi5zdHJpbmdpZnkoeyBlcnJvcjogJ1N0cmlwZSBzZWNyZXQga2V5IG5vdCBjb25maWd1cmVkJyB9KSk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBjb25zdCBzdHJpcGUgPSBuZXcgU3RyaXBlKHNlY3JldEtleSwge1xuICAgICAgICAgIGFwaVZlcnNpb246ICcyMDI0LTA2LTIwJ1xuICAgICAgICB9KTtcblxuICAgICAgICBjb25zdCB7IGFtb3VudCwgY3VycmVuY3ksIHBheW1lbnRNZXRob2RJZCwgZGVzY3JpcHRpb24gfSA9IGJvZHk7XG5cbiAgICAgICAgY29uc3QgcGF5bWVudEludGVudCA9IGF3YWl0IHN0cmlwZS5wYXltZW50SW50ZW50cy5jcmVhdGUoe1xuICAgICAgICAgIGFtb3VudDogTWF0aC5yb3VuZChhbW91bnQpLFxuICAgICAgICAgIGN1cnJlbmN5OiBjdXJyZW5jeSB8fCAnZXVyJyxcbiAgICAgICAgICBwYXltZW50X21ldGhvZDogcGF5bWVudE1ldGhvZElkLFxuICAgICAgICAgIGNvbmZpcm1hdGlvbl9tZXRob2Q6ICdtYW51YWwnLFxuICAgICAgICAgIGNvbmZpcm06IHRydWUsXG4gICAgICAgICAgcmV0dXJuX3VybDogJ2h0dHA6Ly9sb2NhbGhvc3Q6NTE3My9jYXJ0JyxcbiAgICAgICAgICBkZXNjcmlwdGlvbjogZGVzY3JpcHRpb24gfHwgJ0NvbW1hbmRlIE1leSBCZWF1dHknLFxuICAgICAgICAgIG1ldGFkYXRhOiB7XG4gICAgICAgICAgICBvcmRlcl9pZDogYE1FWS0ke0RhdGUubm93KCl9YCxcbiAgICAgICAgICAgIHN0b3JlOiAnTWV5IEJlYXV0eSdcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJlcy53cml0ZUhlYWQoMjAwLCB7XG4gICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgICAgICAnQWNjZXNzLUNvbnRyb2wtQWxsb3ctT3JpZ2luJzogJyonXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmIChwYXltZW50SW50ZW50LnN0YXR1cyA9PT0gJ3JlcXVpcmVzX2FjdGlvbicpIHtcbiAgICAgICAgICByZXMuZW5kKEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZhbHNlLFxuICAgICAgICAgICAgcmVxdWlyZXNBY3Rpb246IHRydWUsXG4gICAgICAgICAgICBjbGllbnRTZWNyZXQ6IHBheW1lbnRJbnRlbnQuY2xpZW50X3NlY3JldCxcbiAgICAgICAgICAgIHBheW1lbnRJbnRlbnRJZDogcGF5bWVudEludGVudC5pZFxuICAgICAgICAgIH0pKTtcbiAgICAgICAgfSBlbHNlIGlmIChwYXltZW50SW50ZW50LnN0YXR1cyA9PT0gJ3N1Y2NlZWRlZCcpIHtcbiAgICAgICAgICByZXMuZW5kKEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgIHN1Y2Nlc3M6IHRydWUsXG4gICAgICAgICAgICBwYXltZW50SW50ZW50SWQ6IHBheW1lbnRJbnRlbnQuaWQsXG4gICAgICAgICAgICBhbW91bnQ6IHBheW1lbnRJbnRlbnQuYW1vdW50LFxuICAgICAgICAgICAgY3VycmVuY3k6IHBheW1lbnRJbnRlbnQuY3VycmVuY3lcbiAgICAgICAgICB9KSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVzLmVuZChKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICBzdWNjZXNzOiBmYWxzZSxcbiAgICAgICAgICAgIHN0YXR1czogcGF5bWVudEludGVudC5zdGF0dXNcbiAgICAgICAgICB9KSk7XG4gICAgICAgIH1cblxuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcignW1NUUklQRSBCQUNLRU5EIEVSUk9SXScsIGVycm9yKTtcbiAgICAgICAgcmVzLndyaXRlSGVhZCg0MDAsIHtcbiAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgICAgICdBY2Nlc3MtQ29udHJvbC1BbGxvdy1PcmlnaW4nOiAnKidcbiAgICAgICAgfSk7XG4gICAgICAgIHJlcy5lbmQoSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgIGVycm9yOiAnc3RyaXBlX2Vycm9yJyxcbiAgICAgICAgICBtZXNzYWdlOiBlcnJvci5tZXNzYWdlIHx8ICdQYXltZW50IGZhaWxlZCdcbiAgICAgICAgfSkpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG59KTtcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKCh7IG1vZGUgfSkgPT4ge1xuICBjb25zdCBlbnYgPSBsb2FkRW52KG1vZGUsIF9fZGlybmFtZSwgJycpO1xuICBcbiAgcmV0dXJuIHtcbiAgICBwbHVnaW5zOiBbcmVhY3QoKSwgc3RyaXBlQmFja2VuZFBsdWdpbihlbnYpXSxcbiAgICBzZXJ2ZXI6IHtcbiAgICAgIHBvcnQ6IDUxNzNcbiAgICB9LFxuICAgIGJ1aWxkOiB7XG4gICAgICAvLyBPcHRpbWlzYXRpb25zIHBvdXIgbGEgcGVyZm9ybWFuY2VcbiAgICAgIHRhcmdldDogJ2VzMjAyMCcsXG4gICAgICBtaW5pZnk6ICdlc2J1aWxkJyxcbiAgICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgICAgb3V0cHV0OiB7XG4gICAgICAgICAgLy8gQ29kZSBzcGxpdHRpbmcgbWFudWVsIHBvdXIgclx1MDBFOWR1aXJlIGxlIGJ1bmRsZSBpbml0aWFsXG4gICAgICAgICAgbWFudWFsQ2h1bmtzOiB7XG4gICAgICAgICAgICAndmVuZG9yLXJlYWN0JzogWydyZWFjdCcsICdyZWFjdC1kb20nXSxcbiAgICAgICAgICAgICd2ZW5kb3Itcm91dGVyJzogWydyZWFjdC1oZWxtZXQtYXN5bmMnXSxcbiAgICAgICAgICAgICd2ZW5kb3Itc3RyaXBlJzogWydAc3RyaXBlL3N0cmlwZS1qcycsICdAc3RyaXBlL3JlYWN0LXN0cmlwZS1qcyddLFxuICAgICAgICAgICAgJ3ZlbmRvci1maXJlYmFzZSc6IFsnZmlyZWJhc2UvYXBwJywgJ2ZpcmViYXNlL2ZpcmVzdG9yZScsICdmaXJlYmFzZS9hdXRoJywgJ2ZpcmViYXNlL3N0b3JhZ2UnXVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIC8vIENvbXByZXNzaW9uIGRlcyBhc3NldHNcbiAgICAgIGFzc2V0c0lubGluZUxpbWl0OiA0MDk2LFxuICAgICAgY2h1bmtTaXplV2FybmluZ0xpbWl0OiAxMDAwLFxuICAgICAgLy8gUHJcdTAwRTljaGFyZ2VtZW50IGRlcyBtb2R1bGVzIGNyaXRpcXVlc1xuICAgICAgbW9kdWxlUHJlbG9hZDoge1xuICAgICAgICBwb2x5ZmlsbDogdHJ1ZVxuICAgICAgfVxuICAgIH0sXG4gICAgLy8gT3B0aW1pc2F0aW9ucyBwb3VyIGxlIGRcdTAwRTl2ZWxvcHBlbWVudFxuICAgIG9wdGltaXplRGVwczoge1xuICAgICAgaW5jbHVkZTogWydyZWFjdCcsICdyZWFjdC1kb20nLCAnZmlyZWJhc2UvYXBwJywgJ2ZpcmViYXNlL2ZpcmVzdG9yZSddXG4gICAgfVxuICB9O1xufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXVTLFNBQVMsY0FBYyxlQUFlO0FBQzdVLE9BQU8sV0FBVztBQUNsQixPQUFPLFlBQVk7QUFDbkIsU0FBUyxTQUFTO0FBQ2xCLE9BQU8sVUFBVTtBQUNqQixTQUFTLHFCQUFxQjtBQUx5SixJQUFNLDJDQUEyQztBQU94TyxJQUFNLFlBQVksS0FBSyxRQUFRLGNBQWMsd0NBQWUsQ0FBQztBQUc3RCxJQUFNLHNCQUFzQixDQUFDLFNBQVM7QUFBQSxFQUNwQyxNQUFNO0FBQUEsRUFDTixnQkFBZ0IsUUFBUTtBQUN0QixXQUFPLFlBQVksSUFBSSx1QkFBdUIsT0FBTyxLQUFLLEtBQUss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

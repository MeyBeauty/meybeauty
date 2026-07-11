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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxKdW5lbFxcXFxEb3dubG9hZHNcXFxcbWV5IGJlYXV0eVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcSnVuZWxcXFxcRG93bmxvYWRzXFxcXG1leSBiZWF1dHlcXFxcdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL0p1bmVsL0Rvd25sb2Fkcy9tZXklMjBiZWF1dHkvdml0ZS5jb25maWcuanNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcsIGxvYWRFbnYgfSBmcm9tICd2aXRlJztcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XG5pbXBvcnQgU3RyaXBlIGZyb20gJ3N0cmlwZSc7XG5pbXBvcnQgeyB6IH0gZnJvbSAnem9kJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgZmlsZVVSTFRvUGF0aCB9IGZyb20gJ3VybCc7XG5cbmNvbnN0IF9fZGlybmFtZSA9IHBhdGguZGlybmFtZShmaWxlVVJMVG9QYXRoKGltcG9ydC5tZXRhLnVybCkpO1xuXG4vLyBTaW1wbGUgYmFja2VuZCBwbHVnaW4gZm9yIGxvY2FsIGRldmVsb3BtZW50XG5jb25zdCBzdHJpcGVCYWNrZW5kUGx1Z2luID0gKGVudikgPT4gKHtcbiAgbmFtZTogJ3N0cmlwZS1iYWNrZW5kJyxcbiAgY29uZmlndXJlU2VydmVyKHNlcnZlcikge1xuICAgIHNlcnZlci5taWRkbGV3YXJlcy51c2UoJy9hcGkvc3RyaXBlLXBheW1lbnQnLCBhc3luYyAocmVxLCByZXMsIG5leHQpID0+IHtcbiAgICAgIGlmIChyZXEubWV0aG9kID09PSAnT1BUSU9OUycpIHtcbiAgICAgICAgcmVzLndyaXRlSGVhZCgyMDAsIHtcbiAgICAgICAgICAnQWNjZXNzLUNvbnRyb2wtQWxsb3ctT3JpZ2luJzogJyonLFxuICAgICAgICAgICdBY2Nlc3MtQ29udHJvbC1BbGxvdy1IZWFkZXJzJzogJ0NvbnRlbnQtVHlwZScsXG4gICAgICAgICAgJ0FjY2Vzcy1Db250cm9sLUFsbG93LU1ldGhvZHMnOiAnUE9TVCwgT1BUSU9OUycsXG4gICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ1xuICAgICAgICB9KTtcbiAgICAgICAgcmVzLmVuZCgpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmIChyZXEubWV0aG9kICE9PSAnUE9TVCcpIHtcbiAgICAgICAgcmVzLndyaXRlSGVhZCg0MDUsIHsgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyB9KTtcbiAgICAgICAgcmVzLmVuZChKU09OLnN0cmluZ2lmeSh7IGVycm9yOiAnTWV0aG9kIG5vdCBhbGxvd2VkJyB9KSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgYm9keSA9IGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICBsZXQgZGF0YSA9ICcnO1xuICAgICAgICAgIHJlcS5vbignZGF0YScsIGNodW5rID0+IGRhdGEgKz0gY2h1bmspO1xuICAgICAgICAgIHJlcS5vbignZW5kJywgKCkgPT4ge1xuICAgICAgICAgICAgdHJ5IHsgcmVzb2x2ZShKU09OLnBhcnNlKGRhdGEpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgY29uc3Qgc2VjcmV0S2V5ID0gZW52LlZJVEVfU1RSSVBFX1NFQ1JFVF9LRVkgfHwgcHJvY2Vzcy5lbnYuVklURV9TVFJJUEVfU0VDUkVUX0tFWTtcbiAgICAgICAgaWYgKCFzZWNyZXRLZXkpIHtcbiAgICAgICAgICByZXMud3JpdGVIZWFkKDUwMCwgeyAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nIH0pO1xuICAgICAgICAgIHJlcy5lbmQoSlNPTi5zdHJpbmdpZnkoeyBlcnJvcjogJ1N0cmlwZSBzZWNyZXQga2V5IG5vdCBjb25maWd1cmVkJyB9KSk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBjb25zdCBzdHJpcGUgPSBuZXcgU3RyaXBlKHNlY3JldEtleSwge1xuICAgICAgICAgIGFwaVZlcnNpb246ICcyMDI0LTA2LTIwJ1xuICAgICAgICB9KTtcblxuICAgICAgICBjb25zdCB7IGFtb3VudCwgY3VycmVuY3ksIHBheW1lbnRNZXRob2RJZCwgZGVzY3JpcHRpb24gfSA9IGJvZHk7XG5cbiAgICAgICAgY29uc3QgcGF5bWVudEludGVudCA9IGF3YWl0IHN0cmlwZS5wYXltZW50SW50ZW50cy5jcmVhdGUoe1xuICAgICAgICAgIGFtb3VudDogTWF0aC5yb3VuZChhbW91bnQpLFxuICAgICAgICAgIGN1cnJlbmN5OiBjdXJyZW5jeSB8fCAnZXVyJyxcbiAgICAgICAgICBwYXltZW50X21ldGhvZDogcGF5bWVudE1ldGhvZElkLFxuICAgICAgICAgIGNvbmZpcm1hdGlvbl9tZXRob2Q6ICdtYW51YWwnLFxuICAgICAgICAgIGNvbmZpcm06IHRydWUsXG4gICAgICAgICAgcmV0dXJuX3VybDogJ2h0dHA6Ly9sb2NhbGhvc3Q6NTE3My9jYXJ0JyxcbiAgICAgICAgICBkZXNjcmlwdGlvbjogZGVzY3JpcHRpb24gfHwgJ0NvbW1hbmRlIE1leSBCZWF1dHknLFxuICAgICAgICAgIG1ldGFkYXRhOiB7XG4gICAgICAgICAgICBvcmRlcl9pZDogYE1FWS0ke0RhdGUubm93KCl9YCxcbiAgICAgICAgICAgIHN0b3JlOiAnTWV5IEJlYXV0eSdcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJlcy53cml0ZUhlYWQoMjAwLCB7XG4gICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgICAgICAnQWNjZXNzLUNvbnRyb2wtQWxsb3ctT3JpZ2luJzogJyonXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmIChwYXltZW50SW50ZW50LnN0YXR1cyA9PT0gJ3JlcXVpcmVzX2FjdGlvbicpIHtcbiAgICAgICAgICByZXMuZW5kKEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZhbHNlLFxuICAgICAgICAgICAgcmVxdWlyZXNBY3Rpb246IHRydWUsXG4gICAgICAgICAgICBjbGllbnRTZWNyZXQ6IHBheW1lbnRJbnRlbnQuY2xpZW50X3NlY3JldCxcbiAgICAgICAgICAgIHBheW1lbnRJbnRlbnRJZDogcGF5bWVudEludGVudC5pZFxuICAgICAgICAgIH0pKTtcbiAgICAgICAgfSBlbHNlIGlmIChwYXltZW50SW50ZW50LnN0YXR1cyA9PT0gJ3N1Y2NlZWRlZCcpIHtcbiAgICAgICAgICByZXMuZW5kKEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgIHN1Y2Nlc3M6IHRydWUsXG4gICAgICAgICAgICBwYXltZW50SW50ZW50SWQ6IHBheW1lbnRJbnRlbnQuaWQsXG4gICAgICAgICAgICBhbW91bnQ6IHBheW1lbnRJbnRlbnQuYW1vdW50LFxuICAgICAgICAgICAgY3VycmVuY3k6IHBheW1lbnRJbnRlbnQuY3VycmVuY3lcbiAgICAgICAgICB9KSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVzLmVuZChKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICBzdWNjZXNzOiBmYWxzZSxcbiAgICAgICAgICAgIHN0YXR1czogcGF5bWVudEludGVudC5zdGF0dXNcbiAgICAgICAgICB9KSk7XG4gICAgICAgIH1cblxuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcignW1NUUklQRSBCQUNLRU5EIEVSUk9SXScsIGVycm9yKTtcbiAgICAgICAgcmVzLndyaXRlSGVhZCg0MDAsIHtcbiAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgICAgICdBY2Nlc3MtQ29udHJvbC1BbGxvdy1PcmlnaW4nOiAnKidcbiAgICAgICAgfSk7XG4gICAgICAgIHJlcy5lbmQoSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgIGVycm9yOiAnc3RyaXBlX2Vycm9yJyxcbiAgICAgICAgICBtZXNzYWdlOiBlcnJvci5tZXNzYWdlIHx8ICdQYXltZW50IGZhaWxlZCdcbiAgICAgICAgfSkpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG59KTtcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKCh7IG1vZGUgfSkgPT4ge1xuICBjb25zdCBlbnYgPSBsb2FkRW52KG1vZGUsIF9fZGlybmFtZSwgJycpO1xuICBcbiAgcmV0dXJuIHtcbiAgICBiYXNlOiAnLi8nLFxuICAgIHBsdWdpbnM6IFtyZWFjdCgpLCBzdHJpcGVCYWNrZW5kUGx1Z2luKGVudildLFxuICAgIHNlcnZlcjoge1xuICAgICAgcG9ydDogNTE3M1xuICAgIH0sXG4gICAgYnVpbGQ6IHtcbiAgICAgIC8vIE9wdGltaXNhdGlvbnMgcG91ciBsYSBwZXJmb3JtYW5jZVxuICAgICAgdGFyZ2V0OiAnZXMyMDIwJyxcbiAgICAgIG1pbmlmeTogJ2VzYnVpbGQnLFxuICAgICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgICBvdXRwdXQ6IHtcbiAgICAgICAgICAvLyBDb2RlIHNwbGl0dGluZyBtYW51ZWwgcG91ciByXHUwMEU5ZHVpcmUgbGUgYnVuZGxlIGluaXRpYWxcbiAgICAgICAgICBtYW51YWxDaHVua3M6IHtcbiAgICAgICAgICAgICd2ZW5kb3ItcmVhY3QnOiBbJ3JlYWN0JywgJ3JlYWN0LWRvbSddLFxuICAgICAgICAgICAgJ3ZlbmRvci1yb3V0ZXInOiBbJ3JlYWN0LWhlbG1ldC1hc3luYyddLFxuICAgICAgICAgICAgJ3ZlbmRvci1zdHJpcGUnOiBbJ0BzdHJpcGUvc3RyaXBlLWpzJywgJ0BzdHJpcGUvcmVhY3Qtc3RyaXBlLWpzJ10sXG4gICAgICAgICAgICAndmVuZG9yLWZpcmViYXNlJzogWydmaXJlYmFzZS9hcHAnLCAnZmlyZWJhc2UvZmlyZXN0b3JlJywgJ2ZpcmViYXNlL2F1dGgnLCAnZmlyZWJhc2Uvc3RvcmFnZSddXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgLy8gQ29tcHJlc3Npb24gZGVzIGFzc2V0c1xuICAgICAgYXNzZXRzSW5saW5lTGltaXQ6IDQwOTYsXG4gICAgICBjaHVua1NpemVXYXJuaW5nTGltaXQ6IDEwMDAsXG4gICAgICAvLyBQclx1MDBFOWNoYXJnZW1lbnQgZGVzIG1vZHVsZXMgY3JpdGlxdWVzXG4gICAgICBtb2R1bGVQcmVsb2FkOiB7XG4gICAgICAgIHBvbHlmaWxsOiB0cnVlXG4gICAgICB9XG4gICAgfSxcbiAgICAvLyBPcHRpbWlzYXRpb25zIHBvdXIgbGUgZFx1MDBFOXZlbG9wcGVtZW50XG4gICAgb3B0aW1pemVEZXBzOiB7XG4gICAgICBpbmNsdWRlOiBbJ3JlYWN0JywgJ3JlYWN0LWRvbScsICdmaXJlYmFzZS9hcHAnLCAnZmlyZWJhc2UvZmlyZXN0b3JlJ11cbiAgICB9XG4gIH07XG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBdVMsU0FBUyxjQUFjLGVBQWU7QUFDN1UsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sWUFBWTtBQUNuQixTQUFTLFNBQVM7QUFDbEIsT0FBTyxVQUFVO0FBQ2pCLFNBQVMscUJBQXFCO0FBTHlKLElBQU0sMkNBQTJDO0FBT3hPLElBQU0sWUFBWSxLQUFLLFFBQVEsY0FBYyx3Q0FBZSxDQUFDO0FBRzdELElBQU0sc0JBQXNCLENBQUMsU0FBUztBQUFBLEVBQ3BDLE1BQU07QUFBQSxFQUNOLGdCQUFnQixRQUFRO0FBQ3RCLFdBQU8sWUFBWSxJQUFJLHVCQUF1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

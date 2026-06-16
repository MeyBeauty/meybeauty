// vite.config.js
import { defineConfig } from "file:///C:/Users/Junel/Downloads/mey%20beauty/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/Junel/Downloads/mey%20beauty/node_modules/@vitejs/plugin-react/dist/index.js";
import Stripe from "file:///C:/Users/Junel/Downloads/mey%20beauty/node_modules/stripe/esm/stripe.esm.node.js";
import { z } from "file:///C:/Users/Junel/Downloads/mey%20beauty/node_modules/zod/index.js";
var stripeBackendPlugin = () => ({
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
        const stripe = new Stripe(process.env.VITE_STRIPE_SECRET_KEY, {
          apiVersion: "2024-06-20"
        });
        const { amount, currency, paymentMethodId, description } = body;
        const paymentIntent = await stripe.paymentIntents.create({
          amount: Math.round(amount),
          currency: currency || "eur",
          payment_method: paymentMethodId,
          confirmation_method: "manual",
          confirm: true,
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
var vite_config_default = defineConfig({
  plugins: [react(), stripeBackendPlugin()],
  server: {
    port: 5173
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxKdW5lbFxcXFxEb3dubG9hZHNcXFxcbWV5IGJlYXV0eVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcSnVuZWxcXFxcRG93bmxvYWRzXFxcXG1leSBiZWF1dHlcXFxcdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL0p1bmVsL0Rvd25sb2Fkcy9tZXklMjBiZWF1dHkvdml0ZS5jb25maWcuanNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XG5pbXBvcnQgU3RyaXBlIGZyb20gJ3N0cmlwZSc7XG5pbXBvcnQgeyB6IH0gZnJvbSAnem9kJztcblxuLy8gU2ltcGxlIGJhY2tlbmQgcGx1Z2luIGZvciBsb2NhbCBkZXZlbG9wbWVudFxuY29uc3Qgc3RyaXBlQmFja2VuZFBsdWdpbiA9ICgpID0+ICh7XG4gIG5hbWU6ICdzdHJpcGUtYmFja2VuZCcsXG4gIGNvbmZpZ3VyZVNlcnZlcihzZXJ2ZXIpIHtcbiAgICBzZXJ2ZXIubWlkZGxld2FyZXMudXNlKCcvYXBpL3N0cmlwZS1wYXltZW50JywgYXN5bmMgKHJlcSwgcmVzLCBuZXh0KSA9PiB7XG4gICAgICBpZiAocmVxLm1ldGhvZCA9PT0gJ09QVElPTlMnKSB7XG4gICAgICAgIHJlcy53cml0ZUhlYWQoMjAwLCB7XG4gICAgICAgICAgJ0FjY2Vzcy1Db250cm9sLUFsbG93LU9yaWdpbic6ICcqJyxcbiAgICAgICAgICAnQWNjZXNzLUNvbnRyb2wtQWxsb3ctSGVhZGVycyc6ICdDb250ZW50LVR5cGUnLFxuICAgICAgICAgICdBY2Nlc3MtQ29udHJvbC1BbGxvdy1NZXRob2RzJzogJ1BPU1QsIE9QVElPTlMnLFxuICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbidcbiAgICAgICAgfSk7XG4gICAgICAgIHJlcy5lbmQoKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAocmVxLm1ldGhvZCAhPT0gJ1BPU1QnKSB7XG4gICAgICAgIHJlcy53cml0ZUhlYWQoNDA1LCB7ICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicgfSk7XG4gICAgICAgIHJlcy5lbmQoSlNPTi5zdHJpbmdpZnkoeyBlcnJvcjogJ01ldGhvZCBub3QgYWxsb3dlZCcgfSkpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IGJvZHkgPSBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgbGV0IGRhdGEgPSAnJztcbiAgICAgICAgICByZXEub24oJ2RhdGEnLCBjaHVuayA9PiBkYXRhICs9IGNodW5rKTtcbiAgICAgICAgICByZXEub24oJ2VuZCcsICgpID0+IHtcbiAgICAgICAgICAgIHRyeSB7IHJlc29sdmUoSlNPTi5wYXJzZShkYXRhKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNvbnN0IHN0cmlwZSA9IG5ldyBTdHJpcGUocHJvY2Vzcy5lbnYuVklURV9TVFJJUEVfU0VDUkVUX0tFWSwge1xuICAgICAgICAgIGFwaVZlcnNpb246ICcyMDI0LTA2LTIwJ1xuICAgICAgICB9KTtcblxuICAgICAgICBjb25zdCB7IGFtb3VudCwgY3VycmVuY3ksIHBheW1lbnRNZXRob2RJZCwgZGVzY3JpcHRpb24gfSA9IGJvZHk7XG5cbiAgICAgICAgY29uc3QgcGF5bWVudEludGVudCA9IGF3YWl0IHN0cmlwZS5wYXltZW50SW50ZW50cy5jcmVhdGUoe1xuICAgICAgICAgIGFtb3VudDogTWF0aC5yb3VuZChhbW91bnQpLFxuICAgICAgICAgIGN1cnJlbmN5OiBjdXJyZW5jeSB8fCAnZXVyJyxcbiAgICAgICAgICBwYXltZW50X21ldGhvZDogcGF5bWVudE1ldGhvZElkLFxuICAgICAgICAgIGNvbmZpcm1hdGlvbl9tZXRob2Q6ICdtYW51YWwnLFxuICAgICAgICAgIGNvbmZpcm06IHRydWUsXG4gICAgICAgICAgZGVzY3JpcHRpb246IGRlc2NyaXB0aW9uIHx8ICdDb21tYW5kZSBNZXkgQmVhdXR5JyxcbiAgICAgICAgICBtZXRhZGF0YToge1xuICAgICAgICAgICAgb3JkZXJfaWQ6IGBNRVktJHtEYXRlLm5vdygpfWAsXG4gICAgICAgICAgICBzdG9yZTogJ01leSBCZWF1dHknXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICByZXMud3JpdGVIZWFkKDIwMCwge1xuICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICAgICAgJ0FjY2Vzcy1Db250cm9sLUFsbG93LU9yaWdpbic6ICcqJ1xuICAgICAgICB9KTtcblxuICAgICAgICBpZiAocGF5bWVudEludGVudC5zdGF0dXMgPT09ICdyZXF1aXJlc19hY3Rpb24nKSB7XG4gICAgICAgICAgcmVzLmVuZChKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICBzdWNjZXNzOiBmYWxzZSxcbiAgICAgICAgICAgIHJlcXVpcmVzQWN0aW9uOiB0cnVlLFxuICAgICAgICAgICAgY2xpZW50U2VjcmV0OiBwYXltZW50SW50ZW50LmNsaWVudF9zZWNyZXQsXG4gICAgICAgICAgICBwYXltZW50SW50ZW50SWQ6IHBheW1lbnRJbnRlbnQuaWRcbiAgICAgICAgICB9KSk7XG4gICAgICAgIH0gZWxzZSBpZiAocGF5bWVudEludGVudC5zdGF0dXMgPT09ICdzdWNjZWVkZWQnKSB7XG4gICAgICAgICAgcmVzLmVuZChKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICBzdWNjZXNzOiB0cnVlLFxuICAgICAgICAgICAgcGF5bWVudEludGVudElkOiBwYXltZW50SW50ZW50LmlkLFxuICAgICAgICAgICAgYW1vdW50OiBwYXltZW50SW50ZW50LmFtb3VudCxcbiAgICAgICAgICAgIGN1cnJlbmN5OiBwYXltZW50SW50ZW50LmN1cnJlbmN5XG4gICAgICAgICAgfSkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlcy5lbmQoSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgc3VjY2VzczogZmFsc2UsXG4gICAgICAgICAgICBzdGF0dXM6IHBheW1lbnRJbnRlbnQuc3RhdHVzXG4gICAgICAgICAgfSkpO1xuICAgICAgICB9XG5cbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ1tTVFJJUEUgQkFDS0VORCBFUlJPUl0nLCBlcnJvcik7XG4gICAgICAgIHJlcy53cml0ZUhlYWQoNDAwLCB7XG4gICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgICAgICAnQWNjZXNzLUNvbnRyb2wtQWxsb3ctT3JpZ2luJzogJyonXG4gICAgICAgIH0pO1xuICAgICAgICByZXMuZW5kKEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICBlcnJvcjogJ3N0cmlwZV9lcnJvcicsXG4gICAgICAgICAgbWVzc2FnZTogZXJyb3IubWVzc2FnZSB8fCAnUGF5bWVudCBmYWlsZWQnXG4gICAgICAgIH0pKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHBsdWdpbnM6IFtyZWFjdCgpLCBzdHJpcGVCYWNrZW5kUGx1Z2luKCldLFxuICBzZXJ2ZXI6IHtcbiAgICBwb3J0OiA1MTczXG4gIH1cbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUF1UyxTQUFTLG9CQUFvQjtBQUNwVSxPQUFPLFdBQVc7QUFDbEIsT0FBTyxZQUFZO0FBQ25CLFNBQVMsU0FBUztBQUdsQixJQUFNLHNCQUFzQixPQUFPO0FBQUEsRUFDakMsTUFBTTtBQUFBLEVBQ04sZ0JBQWdCLFFBQVE7QUFDdEIsV0FBTyxZQUFZLElBQUksdUJBQXVCLE9BQU8sS0FBSyxLQUFLLFNBQVM7QUFDdEUsVUFBSSxJQUFJLFdBQVcsV0FBVztBQUM1QixZQUFJLFVBQVUsS0FBSztBQUFBLFVBQ2pCLCtCQUErQjtBQUFBLFVBQy9CLGdDQUFnQztBQUFBLFVBQ2hDLGdDQUFnQztBQUFBLFVBQ2hDLGdCQUFnQjtBQUFBLFFBQ2xCLENBQUM7QUFDRCxZQUFJLElBQUk7QUFDUjtBQUFBLE1BQ0Y7QUFFQSxVQUFJLElBQUksV0FBVyxRQUFRO0FBQ3pCLFlBQUksVUFBVSxLQUFLLEVBQUUsZ0JBQWdCLG1CQUFtQixDQUFDO0FBQ3pELFlBQUksSUFBSSxLQUFLLFVBQVUsRUFBRSxPQUFPLHFCQUFxQixDQUFDLENBQUM7QUFDdkQ7QUFBQSxNQUNGO0FBRUEsVUFBSTtBQUNGLGNBQU0sT0FBTyxNQUFNLElBQUksUUFBUSxDQUFDLFNBQVMsV0FBVztBQUNsRCxjQUFJLE9BQU87QUFDWCxjQUFJLEdBQUcsUUFBUSxXQUFTLFFBQVEsS0FBSztBQUNyQyxjQUFJLEdBQUcsT0FBTyxNQUFNO0FBQ2xCLGdCQUFJO0FBQUUsc0JBQVEsS0FBSyxNQUFNLElBQUksQ0FBQztBQUFBLFlBQUcsU0FBUyxHQUFHO0FBQUUscUJBQU8sQ0FBQztBQUFBLFlBQUc7QUFBQSxVQUM1RCxDQUFDO0FBQUEsUUFDSCxDQUFDO0FBRUQsY0FBTSxTQUFTLElBQUksT0FBTyxRQUFRLElBQUksd0JBQXdCO0FBQUEsVUFDNUQsWUFBWTtBQUFBLFFBQ2QsQ0FBQztBQUVELGNBQU0sRUFBRSxRQUFRLFVBQVUsaUJBQWlCLFlBQVksSUFBSTtBQUUzRCxjQUFNLGdCQUFnQixNQUFNLE9BQU8sZUFBZSxPQUFPO0FBQUEsVUFDdkQsUUFBUSxLQUFLLE1BQU0sTUFBTTtBQUFBLFVBQ3pCLFVBQVUsWUFBWTtBQUFBLFVBQ3RCLGdCQUFnQjtBQUFBLFVBQ2hCLHFCQUFxQjtBQUFBLFVBQ3JCLFNBQVM7QUFBQSxVQUNULGFBQWEsZUFBZTtBQUFBLFVBQzVCLFVBQVU7QUFBQSxZQUNSLFVBQVUsT0FBTyxLQUFLLElBQUksQ0FBQztBQUFBLFlBQzNCLE9BQU87QUFBQSxVQUNUO0FBQUEsUUFDRixDQUFDO0FBRUQsWUFBSSxVQUFVLEtBQUs7QUFBQSxVQUNqQixnQkFBZ0I7QUFBQSxVQUNoQiwrQkFBK0I7QUFBQSxRQUNqQyxDQUFDO0FBRUQsWUFBSSxjQUFjLFdBQVcsbUJBQW1CO0FBQzlDLGNBQUksSUFBSSxLQUFLLFVBQVU7QUFBQSxZQUNyQixTQUFTO0FBQUEsWUFDVCxnQkFBZ0I7QUFBQSxZQUNoQixjQUFjLGNBQWM7QUFBQSxZQUM1QixpQkFBaUIsY0FBYztBQUFBLFVBQ2pDLENBQUMsQ0FBQztBQUFBLFFBQ0osV0FBVyxjQUFjLFdBQVcsYUFBYTtBQUMvQyxjQUFJLElBQUksS0FBSyxVQUFVO0FBQUEsWUFDckIsU0FBUztBQUFBLFlBQ1QsaUJBQWlCLGNBQWM7QUFBQSxZQUMvQixRQUFRLGNBQWM7QUFBQSxZQUN0QixVQUFVLGNBQWM7QUFBQSxVQUMxQixDQUFDLENBQUM7QUFBQSxRQUNKLE9BQU87QUFDTCxjQUFJLElBQUksS0FBSyxVQUFVO0FBQUEsWUFDckIsU0FBUztBQUFBLFlBQ1QsUUFBUSxjQUFjO0FBQUEsVUFDeEIsQ0FBQyxDQUFDO0FBQUEsUUFDSjtBQUFBLE1BRUYsU0FBUyxPQUFPO0FBQ2QsZ0JBQVEsTUFBTSwwQkFBMEIsS0FBSztBQUM3QyxZQUFJLFVBQVUsS0FBSztBQUFBLFVBQ2pCLGdCQUFnQjtBQUFBLFVBQ2hCLCtCQUErQjtBQUFBLFFBQ2pDLENBQUM7QUFDRCxZQUFJLElBQUksS0FBSyxVQUFVO0FBQUEsVUFDckIsT0FBTztBQUFBLFVBQ1AsU0FBUyxNQUFNLFdBQVc7QUFBQSxRQUM1QixDQUFDLENBQUM7QUFBQSxNQUNKO0FBQUEsSUFDRixDQUFDO0FBQUEsRUFDSDtBQUNGO0FBRUEsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUyxDQUFDLE1BQU0sR0FBRyxvQkFBb0IsQ0FBQztBQUFBLEVBQ3hDLFFBQVE7QUFBQSxJQUNOLE1BQU07QUFBQSxFQUNSO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K

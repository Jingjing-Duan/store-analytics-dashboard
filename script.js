const API_URL =
  "https://jingjing-store-analytics-func-gtesdadsccaugrds.canadacentral-01.azurewebsites.net/api/GetDashboardData";

function updateStatus(message) {
  document.getElementById("status").textContent = message;
}

function updateDashboard(data) {
  const events = Array.isArray(data) ? data : [];

  const orders = events.filter(e => e.event_type === "order_placed");
  const addToCart = events.filter(e => e.event_type === "add_to_cart");
  const cartAbandons = events.filter(e => e.event_type === "cart_abandon");

  const totalRevenue = orders.reduce((sum, order) => {
    return sum + (order.order_value || 0);
  }, 0);

  const totalOrders = orders.length;
  const addToCartCount = addToCart.length;
  const cartAbandonCount = cartAbandons.length;

  const conversionRate =
    addToCartCount > 0
      ? ((totalOrders / addToCartCount) * 100).toFixed(1) + "%"
      : "0%";

  document.getElementById("totalRevenue").textContent = "$" + totalRevenue.toFixed(2);
  document.getElementById("totalOrders").textContent = totalOrders;
  document.getElementById("addToCart").textContent = addToCartCount;
  document.getElementById("cartAbandons").textContent = cartAbandonCount;
  document.getElementById("conversionRate").textContent = conversionRate;

  document.getElementById("rawJson").textContent = JSON.stringify(data, null, 2);
}

async function loadData() {
  try {
    updateStatus("Loading data from Azure Function...");

    const response = await fetch(API_URL);
    const data = await response.json();

    if (!response.ok) {
      updateStatus(data.message || "No data available yet.");
      document.getElementById("rawJson").textContent = JSON.stringify(data, null, 2);
      return;
    }

    updateStatus("Dashboard loaded successfully.");
    updateDashboard(data);
  } catch (error) {
    updateStatus("Unable to load data from API.");
    document.getElementById("rawJson").textContent = error.message;
  }
}

loadData();
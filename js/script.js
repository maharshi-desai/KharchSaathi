// ============================
// MOCK DATA (Replace with CSV later)
// ============================
let transactions = [
  { date: "2024-03-01", merchant: "Zomato", amount: 1200, baseline: 300, frequency: 8 },
  { date: "2024-03-02", merchant: "Amazon", amount: 4500, baseline: 1000, frequency: 3 },
  { date: "2024-03-03", merchant: "Starbucks", amount: 900, baseline: 250, frequency: 10 },
  { date: "2024-03-04", merchant: "Flipkart", amount: 7000, baseline: 2000, frequency: 2 },
  { date: "2024-03-05", merchant: "Swiggy", amount: 1500, baseline: 400, frequency: 6 }
];

// ============================
// NAVIGATION
// ============================
document.querySelectorAll(".nav").forEach(btn => {
  btn.addEventListener("click", () => {
    const page = btn.dataset.page;
    switchPage(page);
  });
});

function switchPage(page) {
  document.querySelectorAll(".page").forEach(p => {
    p.classList.remove("active");
  });

  setTimeout(() => {
    document.getElementById(page).classList.add("active");
  }, 100);
}

// ============================
// CALCULATIONS
// ============================
function totalSpend() {
  return transactions.reduce((s, t) => s + t.amount, 0);
}

function detectAnomalies() {
  return transactions.filter(t => t.amount > t.baseline * 2);
}

// ============================
// RENDER DASHBOARD
// ============================
function renderDashboard() {
  document.getElementById("dashboard").innerHTML = `
  <div class="grid grid-cols-3 gap-6">

    <div class="glass p-6 rounded-xl">
      <h3>Total Spend</h3>
      <p class="text-2xl mt-2">₹${totalSpend()}</p>
    </div>

    <div class="glass p-6 rounded-xl">
      <h3>Risk Score</h3>
      <p class="text-2xl mt-2">${((detectAnomalies().length/transactions.length)*100).toFixed(1)}%</p>
    </div>

    <div class="glass p-6 rounded-xl">
      <h3>Spending Velocity</h3>
      <canvas id="velocity"></canvas>
    </div>

  </div>

  <div class="glass p-6 rounded-xl mt-6">
    <h3>Risk Heatmap</h3>
    <div id="heatmap" class="grid grid-cols-7 gap-2 mt-4"></div>
  </div>
  `;

  renderVelocity();
  renderHeatmap();
}

// ============================
// RENDER ANALYTICS
// ============================
function renderAnalytics() {
  document.getElementById("analytics").innerHTML = `
  <div class="glass p-6 rounded-xl">
    <h3>Spending vs Baseline</h3>
    <canvas id="analyticsChart"></canvas>
  </div>

  <div class="glass p-6 rounded-xl">
    <h3 class="mb-4">Transaction Risk Table</h3>
    ${renderTable()}
  </div>
  `;

  renderAnalyticsChart();
}

function renderTable() {
  return `
  <table class="w-full text-sm">
    <thead>
      <tr class="text-left text-gray-400">
        <th>Merchant</th>
        <th>Amount</th>
        <th>Comparison</th>
        <th>Trust</th>
        <th>Risk</th>
      </tr>
    </thead>
    <tbody>
      ${transactions.map(t => `
        <tr class="border-b border-gray-700">
          <td>${t.merchant}</td>
          <td>₹${t.amount}</td>

          <!-- Contextual Comparison Bar -->
          <td>
            <div class="w-32 bg-gray-700 h-2 rounded">
              <div class="bg-gray-400 h-2 rounded" style="width:${(t.baseline/t.amount)*100}%"></div>
            </div>
          </td>

          <!-- Merchant Trust Shield -->
          <td class="${t.frequency > 5 ? 'text-green-400' : 'text-red-400'}">
            🛡
          </td>

          <td>
            <span class="px-2 py-1 rounded text-xs ${
              t.amount > t.baseline*2 ? 'bg-red-500' : 'bg-green-500'
            }">
              ${t.amount > t.baseline*2 ? 'High' : 'Low'}
            </span>
          </td>

        </tr>
      `).join("")}
    </tbody>
  </table>
  `;
}

// ============================
// INSIGHTS
// ============================
function renderInsights() {
  const anomalies = detectAnomalies();

  document.getElementById("insights").innerHTML =
    anomalies.map(a => `
      <div class="glass p-6 rounded-xl">
        <h3>${a.merchant}</h3>
        <p class="text-red-400 mt-2">
          This is ${((a.amount/a.baseline)*100).toFixed(0)}% higher than your usual average.
        </p>
      </div>
    `).join("");
}

// ============================
// CHARTS
// ============================
function renderVelocity() {
  new Chart(document.getElementById("velocity"), {
    type: "line",
    data: {
      labels: transactions.map(t => t.date),
      datasets: [{
        data: transactions.map(t => t.amount),
        borderColor: "#38bdf8",
        tension: 0.4
      }]
    },
    options: { plugins: { legend: { display:false } } }
  });
}

function renderAnalyticsChart() {
  new Chart(document.getElementById("analyticsChart"), {
    type: "bar",
    data: {
      labels: transactions.map(t => t.merchant),
      datasets: [
        {
          label: "Actual",
          data: transactions.map(t => t.amount),
          backgroundColor: "#ef4444"
        },
        {
          label: "Baseline",
          data: transactions.map(t => t.baseline),
          backgroundColor: "#64748b"
        }
      ]
    }
  });
}

function renderHeatmap() {
  const heatmap = document.getElementById("heatmap");
  heatmap.innerHTML = "";
  for(let i=0;i<28;i++){
    const risk = Math.random();
    heatmap.innerHTML += `
      <div class="h-6 rounded"
        style="background: rgba(239,68,68,${risk})"></div>
    `;
  }
}

// ============================
// INIT
// ============================
renderDashboard();
renderAnalytics();
renderInsights();
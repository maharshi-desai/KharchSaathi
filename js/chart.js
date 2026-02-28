import { parseCSV } from "./parser.js";
import { analyze } from "./analyzer.js";

const fileInput = document.getElementById("csvFile");

let charts = {};

let saved = localStorage.getItem("financeData");
if(saved){
  process(JSON.parse(saved));
}

fileInput.addEventListener("change", e=>{
  const file = e.target.files[0];
  const reader = new FileReader();

  reader.onload = function(ev){
    const rows = parseCSV(ev.target.result);
    localStorage.setItem("financeData", JSON.stringify(rows));
    process(rows);
  };

  reader.readAsText(file);
});

function process(rows){
  const data = analyze(rows);

  document.getElementById("income").textContent = "₹"+data.income.toFixed(2);
  document.getElementById("expense").textContent = "₹"+data.expense.toFixed(2);
  document.getElementById("savings").textContent = "₹"+data.savings.toFixed(2);

  render("overviewChart","bar",
    ["Income","Expense"],
    [data.income,data.expense]
  );

  render("categoryChart","doughnut",
    Object.keys(data.category),
    Object.values(data.category)
  );

  render("monthlyChart","line",
    Object.keys(data.monthly),
    Object.values(data.monthly)
  );

  let top = Object.entries(data.category)
    .sort((a,b)=>b[1]-a[1])
    .slice(0,5);

  render("topExpenseChart","bar",
    top.map(t=>t[0]),
    top.map(t=>t[1])
  );
}

function render(id,type,labels,data){
  const ctx = document.getElementById(id);
  if(!ctx) return;

  if(charts[id]) charts[id].destroy();

  charts[id] = new Chart(ctx,{
    type,
    data:{
      labels,
      datasets:[{ data }]
    }
  });
}

/* Navigation */
document.querySelectorAll(".nav,.card").forEach(el=>{
  el.addEventListener("click",()=>{
    let section = el.dataset.section;
    if(!section) return;

    document.querySelectorAll(".section")
      .forEach(s=>s.classList.remove("active"));

    document.getElementById(section)
      .classList.add("active");

    document.querySelectorAll(".nav")
      .forEach(n=>n.classList.remove("active"));

    document.querySelector(`.nav[data-section="${section}"]`)
      ?.classList.add("active");
  });
});
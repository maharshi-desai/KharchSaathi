export function analyze(rows) {

  let income = 0, expense = 0;
  let category = {}, monthly = {};

  rows.slice(1).forEach(r=>{
    let date = r[0];
    let cat = r[1];
    let amt = parseFloat(r[2]);

    if(!date || !cat || isNaN(amt)) return;

    let month = date.slice(0,7);

    if(amt > 0) income += amt;
    else expense += Math.abs(amt);

    category[cat] = (category[cat] || 0) + Math.abs(amt);
    monthly[month] = (monthly[month] || 0) + Math.abs(amt);
  });

  return {
    income,
    expense,
    savings: income - expense,
    category,
    monthly
  };
}
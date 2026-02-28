class Analyser {
    /**
     * Performs statistical analysis on an array of transactions.
     * @param {Array<Object>} transactions - Parsed transaction objects.
     * @returns {Object} - Analysis results including total, anomalies, risk score.
     */
    static analyze(transactions) {
        if (!transactions || transactions.length === 0) {
            return {
                total: 0,
                count: 0,
                mean: 0,
                stdDev: 0,
                anomalies: [],
                riskScore: 0
            };
        }

        const validTxns = transactions.filter(t => !isNaN(t.numericAmount));
        const count = validTxns.length;

        if (count === 0) return { total: 0, count: 0, anomalies: [], riskScore: 0 };

        // 1. Calculate sum and mean
        const total = validTxns.reduce((sum, t) => sum + t.numericAmount, 0);
        const mean = total / count;

        // 2. Calculate standard deviation
        const varianceSum = validTxns.reduce((sum, t) => {
            const diff = t.numericAmount - mean;
            return sum + (diff * diff);
        }, 0);
        const variance = varianceSum / count;
        const stdDev = Math.sqrt(variance);

        // 3. Detect anomalies (> 2 standard deviations from mean)
        const threshold = mean + (2 * stdDev);
        const anomalies = validTxns.filter(t => t.numericAmount > threshold).map(t => {
            const ratio = (t.numericAmount / mean).toFixed(1);
            return {
                ...t,
                reason: `${ratio}x higher than average`
            };
        });

        // 4. Calculate Risk Score (0 - 100)
        // More anomalies relative to total txns -> higher risk
        // Base risk + penalty for anomalies
        let riskScore = 10; // base risk
        const anomalyRatio = anomalies.length / count;

        // Add up to 90 points based on anomaly ratio. 
        // If 10% or more transactions are anomalies, risk is maxed out.
        riskScore += Math.min(anomalyRatio * 10 * 90, 90);

        riskScore = Math.round(riskScore);

        // 5. Aggregate by Category
        const categoryTotals = {};
        validTxns.forEach(t => {
            let cat = t.category || 'Other';
            if (!categoryTotals[cat]) categoryTotals[cat] = 0;
            categoryTotals[cat] += t.numericAmount;
        });

        // Convert to array and sort by amount descending
        const categories = Object.keys(categoryTotals).map(cat => {
            return {
                name: cat,
                amount: categoryTotals[cat],
                percentage: (categoryTotals[cat] / total) * 100
            };
        }).sort((a, b) => b.amount - a.amount);

        // 6. Calculate Projected Spend
        let projectedTotal = total;
        if (validTxns.length > 1) {
            // Sort by date to find range
            const datedTxns = validTxns.filter(t => t.date && !isNaN(new Date(t.date).getTime()))
                .sort((a, b) => new Date(a.date) - new Date(b.date));

            if (datedTxns.length > 1) {
                const firstDate = new Date(datedTxns[0].date);
                const lastDate = new Date(datedTxns[datedTxns.length - 1].date);
                const diffTime = Math.abs(lastDate - firstDate);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1; // avoid / 0

                // Average daily velocity
                const dailyVelocity = total / diffDays;

                // Assume 30 days in a month for projection
                projectedTotal = Math.round(dailyVelocity * 30);
            }
        }

        // 7. Merchant Insights
        const merchantMap = {};
        validTxns.forEach(t => {
            let m = t.merchant || 'Unknown';
            if (!merchantMap[m]) {
                merchantMap[m] = { name: m, amount: 0, count: 0, history: [] };
            }
            merchantMap[m].amount += t.numericAmount;
            merchantMap[m].count += 1;
            merchantMap[m].history.push(t.numericAmount);
        });

        const merchants = Object.values(merchantMap).map(m => {
            // Determine frequency mockup
            let badge = '';
            if (m.count > 3) badge = 'Frequent';
            else if (m.amount > mean * 2) badge = 'High Value';
            else if (m.count === 1) badge = 'One-off';
            else badge = 'Occasional';

            return {
                ...m,
                badge
            };
        }).sort((a, b) => b.amount - a.amount);

        return {
            total,
            count,
            mean,
            stdDev,
            anomalies,
            riskScore,
            categories,
            projectedTotal,
            merchants
        };
    }
}

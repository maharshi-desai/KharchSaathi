/**
 * chart.js
 * Encapsulates Chart.js implementation for the Spending Over Time chart.
 */

class SpendingChart {
    constructor(canvasId) {
        this.canvasId = canvasId;
        this.chartInstance = null;
    }

    /**
     * Renders or updates a line chart with the given labels and data points.
     * @param {Array<string>} labels - X-axis labels (e.g., dates).
     * @param {Array<number>} dataPoints - Y-axis data (spending amounts).
     */
    render(labels, dataPoints) {
        const ctx = document.getElementById(this.canvasId);
        if (!ctx) return;

        if (this.chartInstance) {
            this.chartInstance.destroy(); // Clear existing chart to prevent overlap
        }

        // Apply Apple-style minimal aesthetics
        this.chartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Amount Spent (₹)',
                    data: dataPoints,
                    borderColor: '#1d1d1f', // Dark Navy
                    backgroundColor: 'rgba(29, 29, 31, 0.05)',
                    borderWidth: 2,
                    pointBackgroundColor: '#ffffff',
                    pointBorderColor: '#1d1d1f',
                    pointHoverBackgroundColor: '#1d1d1f',
                    pointHoverBorderColor: '#ffffff',
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    fill: true,
                    tension: 0.4 // Smooth bezier curves
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false // Hide legend for minimal look
                    },
                    tooltip: {
                        backgroundColor: 'rgba(29, 29, 31, 0.9)',
                        titleFont: { family: '-apple-system, sans-serif', size: 13 },
                        bodyFont: { family: '-apple-system, sans-serif', size: 14, weight: 'bold' },
                        padding: 12,
                        cornerRadius: 8,
                        displayColors: false
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false,
                            drawBorder: false
                        },
                        ticks: {
                            font: { family: '-apple-system, sans-serif' },
                            color: '#86868b'
                        }
                    },
                    y: {
                        grid: {
                            color: 'rgba(0,0,0,0.05)',
                            drawBorder: false
                        },
                        ticks: {
                            font: { family: '-apple-system, sans-serif' },
                            color: '#86868b',
                            callback: function (value) {
                                return '₹' + value;
                            }
                        },
                        beginAtZero: true
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index',
                },
            }
        });
    }
}

class RiskGauge {
    constructor(canvasId) {
        this.canvasId = canvasId;
    }

    render(score) {
        const canvas = document.getElementById(this.canvasId);
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        const centerX = width / 2;
        const centerY = height - 10; // slightly above bottom to make room for shadow/clip
        const radius = Math.min(width / 2, height) - 15;

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Draw Arc Gradient (Green -> Yellow -> Orange -> Red)
        const gradient = ctx.createLinearGradient(0, centerY, width, centerY);
        gradient.addColorStop(0, '#34c759'); // Green
        gradient.addColorStop(0.33, '#ffcc00'); // Yellow
        gradient.addColorStop(0.66, '#ff9500'); // Orange
        gradient.addColorStop(1, '#ff3b30'); // Red

        // Draw outer arc
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, Math.PI, 0, false);
        ctx.lineWidth = 14;
        ctx.strokeStyle = gradient;
        ctx.lineCap = 'round';
        ctx.stroke();

        // Calculate Indicator Angle properly for an arc sweep
        const constrainedScore = Math.max(0, Math.min(100, score));
        // Score 0 -> Angle Math.PI ... Score 100 -> Angle 2*Math.PI
        const angle = Math.PI + (constrainedScore / 100) * Math.PI;

        const indicatorX = centerX + Math.cos(angle) * radius;
        const indicatorY = centerY + Math.sin(angle) * radius;

        ctx.save();

        // Outer White Ring with shadow
        ctx.beginPath();
        ctx.arc(indicatorX, indicatorY, 12, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = 'rgba(0,0,0,0.3)';
        ctx.shadowBlur = 6;
        ctx.shadowOffsetY = 2;
        ctx.fill();

        // Inner Dark dot
        ctx.shadowColor = 'transparent'; // Remove shadow for inner drawing
        ctx.beginPath();
        ctx.arc(indicatorX, indicatorY, 5, 0, Math.PI * 2);
        ctx.fillStyle = '#1d1d1f';
        ctx.fill();

        // Add a subtle border to the outer ring
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'rgba(0,0,0,0.1)';
        ctx.stroke();

        ctx.restore();

        // Update score text.
        const scoreEl = document.getElementById('detailed-risk-score');
        if (scoreEl) {
            scoreEl.textContent = Math.round(constrainedScore);
        }
    }
}

class CategoryDonutChart {
    constructor(canvasId) {
        this.canvasId = canvasId;
        this.chartInstance = null;
    }

    render(labels, data, clickCallback) {
        const ctx = document.getElementById(this.canvasId);
        if (!ctx) return;
        if (this.chartInstance) this.chartInstance.destroy();

        this.chartInstance = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: [
                        '#32ade6', '#34c759', '#ffcc00', '#ff9500', '#ff3b30',
                        '#af52de', '#5856d6', '#007aff', '#ff2d55', '#a2845e'
                    ],
                    borderWidth: 2,
                    borderColor: '#ffffff',
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '75%',
                plugins: {
                    legend: {
                        position: 'right',
                        labels: { font: { family: '-apple-system, sans-serif' }, boxWidth: 12 }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(29, 29, 31, 0.9)',
                        titleFont: { family: '-apple-system, sans-serif', size: 13 },
                        bodyFont: { family: '-apple-system, sans-serif', size: 14, weight: 'bold' },
                        padding: 12,
                        cornerRadius: 8,
                        displayColors: true,
                        callbacks: {
                            label: function (context) {
                                let label = context.label || '';
                                if (label) { label += ': '; }
                                if (context.parsed !== null) {
                                    label += new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(context.parsed);
                                }
                                return label;
                            }
                        }
                    }
                },
                onClick: (event, elements) => {
                    if (elements && elements.length > 0) {
                        const index = elements[0].index;
                        const label = this.chartInstance.data.labels[index];
                        if (clickCallback) clickCallback(label);
                    } else {
                        if (clickCallback) clickCallback(null);
                    }
                }
            }
        });
    }
}

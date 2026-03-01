/**
 * script.js
 * Main controller to tie together parsing, analyzing, charting, and UI updates.
 */

// No dummy data, start empty
let appState = 'landing';

document.addEventListener('DOMContentLoaded', () => {
    // 0. Setup Navigation & Landing state
    setupNavigation();
    setupLandingTransition();

    // Check for existing session
    const savedSession = localStorage.getItem('kharchSaathiUser');
    if (savedSession) {
        // User was already logged in
        restoreSession(savedSession);
    }

    // 1. Initialize Charts
    const chart = new SpendingChart('spending-chart');
    window.riskGauge = new RiskGauge('risk-gauge-canvas');
    window.categoryDonut = new CategoryDonutChart('category-donut-chart');

    // Store raw transactions globally for filtering
    window.rawTransactions = [];

    // 2. Load Saved Data
    const savedData = localStorage.getItem('kharchSaathiData');
    if (savedData) {
        processCSVString(savedData);
        // Hide main upload zone and show nav button since we have data
        const mainUploadZone = document.getElementById('upload-zone');
        const navUploadZone = document.getElementById('nav-upload-zone');
        if (mainUploadZone) mainUploadZone.style.display = 'none';
        if (navUploadZone) navUploadZone.classList.remove('hidden');
    }

    // 3. Setup Drag and Drop
    setupDragAndDrop();

    // 4. Link Risk Score card to view
    document.getElementById('risk-score-card').addEventListener('click', () => {
        switchView('view-risk');
    });
});

// App State Transition Logic
function setupLandingTransition() {
    const unlockForm = document.getElementById('unlock-form');
    if (!unlockForm) return;

    unlockForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevent page reload

        const fullName = document.getElementById('full-name').value;
        if (fullName.trim() === '') return;

        // Save session
        localStorage.setItem('kharchSaathiUser', fullName.trim());

        // Perform visual transition
        transitionToDashboard(fullName.trim());
    });
}

function restoreSession(fullName) {
    // Bypass the landing page silently
    const landingView = document.getElementById('view-landing');
    if (landingView) {
        landingView.style.display = 'none';
    }
    transitionToDashboard(fullName, true);
}

function transitionToDashboard(fullName, isRestore = false) {
    const firstName = fullName.split(' ')[0];

    // Update Dashboard Greeting
    const greetingEl = document.getElementById('user-greeting');
    if (greetingEl) {
        greetingEl.innerHTML = `Welcome back, <strong style="color: var(--text-primary);">${firstName}</strong> 👋 <span style="margin: 0 0.5rem; color: var(--border-color);">|</span> <span style="color: var(--text-muted);">Because every rupee deserves attention.</span>`;
    }

    const landingView = document.getElementById('view-landing');
    const dashboardView = document.getElementById('dashboard-view');
    const btnLogout = document.getElementById('btn-logout');

    if (btnLogout) btnLogout.classList.remove('hidden');

    if (landingView && dashboardView) {
        appState = 'dashboard';

        if (!isRestore) {
            // Add fade-out class to landing
            landingView.classList.add('fade-out');
        }

        // Show dashboard with transition
        dashboardView.style.display = 'block';
        // Force reflow for transition to take effect
        void dashboardView.offsetWidth;

        dashboardView.classList.remove('hidden-fade');

        // Update indicator positions now that elements are visible
        const activeTab = document.querySelector('.nav-tab.active');
        if (activeTab) {
            const indicator = document.getElementById('nav-indicator');
            if (indicator) {
                indicator.style.width = `${activeTab.offsetWidth}px`;
                indicator.style.left = `${activeTab.offsetLeft}px`;
            }
        }

        if (!isRestore) {
            // Remove landing from DOM after animation completes (600ms)
            setTimeout(() => {
                landingView.style.display = 'none';
            }, 600);
        }
    }
}

// Setup Logout Button
document.addEventListener('DOMContentLoaded', () => {
    const btnLogout = document.getElementById('btn-logout');
    if (btnLogout) {
        btnLogout.addEventListener('click', () => {
            const confirmLogout = confirm("Are you sure you want to sign out and lock your vault?");
            if (confirmLogout) {
                // Clear session and data
                localStorage.removeItem('kharchSaathiUser');
                localStorage.removeItem('kharchSaathiData');
                window.location.reload(); // Quickest way to clean state and return to landing
            }
        });
    }
});

// View Navigation Logic
function setupNavigation() {
    const tabs = document.querySelectorAll('.nav-tab');
    const indicator = document.getElementById('nav-indicator');

    function updateIndicator(activeTab) {
        if (!activeTab || !indicator) return;
        indicator.style.width = `${activeTab.offsetWidth}px`;
        indicator.style.left = `${activeTab.offsetLeft}px`;
    }

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.getAttribute('data-target');
            switchView(target);
        });
    });

    // Initialize indicator position
    const activeTab = document.querySelector('.nav-tab.active');
    // We use a small timeout to let the fonts/layout render to get accurate widths
    setTimeout(() => updateIndicator(activeTab), 50);
    window.addEventListener('resize', () => {
        updateIndicator(document.querySelector('.nav-tab.active'));
    });
}

function switchView(viewId) {
    // Update Tabs
    const tabs = document.querySelectorAll('.nav-tab');
    let activeTab = null;
    tabs.forEach(tab => {
        if (tab.getAttribute('data-target') === viewId) {
            tab.classList.add('active');
            activeTab = tab;
        } else {
            tab.classList.remove('active');
        }
    });

    // Update Indicator
    const indicator = document.getElementById('nav-indicator');
    if (activeTab && indicator) {
        indicator.style.width = `${activeTab.offsetWidth}px`;
        indicator.style.left = `${activeTab.offsetLeft}px`;
    }

    // Toggle Views
    const views = document.querySelectorAll('.view-section');
    views.forEach(v => {
        if (v.id === viewId) {
            v.classList.remove('hidden');
        } else {
            v.classList.add('hidden');
        }
    });
}

// Main process function
function processCSVString(csvString) {
    // Parse
    const transactions = CSVParser.parse(csvString);
    if (transactions.length === 0) return;

    // Analyze
    const analysis = Analyser.analyze(transactions);

    // Update UI Cards
    updateSummaryCards(analysis);

    // Update Anomaly Feed
    updateAnomalyFeed(analysis.anomalies);

    // Update Chart
    const dates = transactions.map(t => t.date || 'Unknown');
    const amounts = transactions.map(t => t.numericAmount || 0);
    chart.render(dates, amounts);

    // Update Detailed Risk View
    if (window.riskGauge) {
        window.riskGauge.render(analysis.riskScore);
    }

    // Update Transactions View
    window.rawTransactions = transactions;
    updateTransactionsView(analysis);

    // Update Merchants View
    updateMerchantsView(analysis);
}

const chart = new SpendingChart('spending-chart');

function updateSummaryCards(analysis) {
    // Format Currency
    const formatter = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    });

    document.getElementById('val-total').textContent = formatter.format(analysis.total);
    document.getElementById('val-txns').textContent = analysis.count;
    document.getElementById('val-alerts').textContent = analysis.anomalies.length;

    // Risk Score
    const riskEl = document.getElementById('val-risk');
    let riskClass = 'safe';
    if (analysis.riskScore >= 30 && analysis.riskScore <= 70) riskClass = 'warning';
    else if (analysis.riskScore > 70) riskClass = 'danger';

    riskEl.innerHTML = `<span class="risk-indicator ${riskClass}">${analysis.riskScore}</span>`;
}

function updateAnomalyFeed(anomalies) {
    const listEl = document.getElementById('anomaly-list');
    listEl.innerHTML = '';

    if (anomalies.length === 0) {
        listEl.innerHTML = '<p style="color: var(--text-muted); padding: 1rem;">No anomalies detected.</p>';
        return;
    }

    const formatter = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    });

    anomalies.forEach(anomaly => {
        const item = document.createElement('div');
        item.className = 'anomaly-item';

        item.innerHTML = `
            <div class="anomaly-header">
                <span class="anomaly-merchant">${anomaly.merchant || 'Unknown Merchant'}</span>
                <span class="anomaly-amount">${formatter.format(anomaly.numericAmount)}</span>
            </div>
            <div class="anomaly-reason">${anomaly.reason}</div>
        `;
        listEl.appendChild(item);
    });
}

// Transactions View Logic
let currentTableFilter = { category: null, text: '', quick: 'all' };

function updateTransactionsView(analysis) {
    // 1. Render Donut Chart
    const labels = analysis.categories.map(c => c.name);
    const data = analysis.categories.map(c => c.amount);

    if (window.categoryDonut) {
        window.categoryDonut.render(labels, data, (clickedCategory) => {
            // Click to filter by category
            if (currentTableFilter.category === clickedCategory) {
                currentTableFilter.category = null; // Toggle off
            } else {
                currentTableFilter.category = clickedCategory; // Toggle on
            }
            renderTransactionsTable();
        });
    }

    // 2. Render Category Grid
    renderCategoryGrid(analysis.categories);

    // 3. Setup Table Filters once
    if (!window.filtersSetup) {
        setupTableFilters();
        window.filtersSetup = true;
    }

    // 4. Render Table
    renderTransactionsTable();
}

function renderCategoryGrid(categories) {
    const grid = document.getElementById('category-grid');
    if (!grid) return;
    grid.innerHTML = '';

    const formatter = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });

    // Simple icon mapping
    const icons = {
        'Food': '🍔', 'Shopping': '🛍️', 'Transport': '🚗',
        'Electronics': '💻', 'Entertainment': '🎬', 'Travel': '✈️',
        'Health': '💊', 'Rent': '🏠', 'Other': '📦'
    };

    categories.forEach(cat => {
        const icon = icons[cat.name] || icons['Other'];
        const card = document.createElement('div');
        card.className = 'cat-card';
        card.innerHTML = `
            <div class="cat-card-header">
                <div class="cat-title"><span>${icon}</span> ${cat.name}</div>
                <div class="cat-amount">${formatter.format(cat.amount)}</div>
            </div>
            <div class="cat-progress-bg">
                <div class="cat-progress-fill" style="width: ${cat.percentage}%"></div>
            </div>
        `;
        grid.appendChild(card);
    });
}

function setupTableFilters() {
    const searchInput = document.getElementById('txn-search');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            currentTableFilter.text = e.target.value.toLowerCase();
            renderTransactionsTable();
        });
    }

    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filterBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentTableFilter.quick = e.target.getAttribute('data-filter');
            renderTransactionsTable();
        });
    });
}

function renderTransactionsTable() {
    const tbody = document.getElementById('txn-tbody');
    const emptyState = document.getElementById('txn-empty-state');
    if (!tbody || !emptyState) return;

    let filtered = window.rawTransactions || [];

    // Filter by text
    if (currentTableFilter.text) {
        filtered = filtered.filter(t => (t.merchant || '').toLowerCase().includes(currentTableFilter.text));
    }

    // Filter by category donut click
    if (currentTableFilter.category) {
        filtered = filtered.filter(t => t.category === currentTableFilter.category);
    }

    // Filter by quick filter
    if (currentTableFilter.quick === 'high') {
        filtered = filtered.filter(t => t.numericAmount > 5000); // hardcoded threshold for demo
    } else if (currentTableFilter.quick === '7days') {
        // Since we use dummy strings, we just pick the last 3 for mockup if 'today' is unclear
        // But for exact dates we'd parse. Let's just slice the last 3 elements arbitrarily or sort by date.
        // Actually sorting proper dates:
        const sorted = [...filtered].sort((a, b) => new Date(b.date) - new Date(a.date));
        filtered = sorted.slice(0, Math.min(5, sorted.length)); // Mocking recent 5 txns
    }

    tbody.innerHTML = '';

    if (filtered.length === 0) {
        emptyState.style.display = 'block';
    } else {
        emptyState.style.display = 'none';
        const formatter = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });

        // Render rows
        filtered.forEach(t => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${t.date}</td>
                <td style="font-weight: 500;">${t.merchant}</td>
                <td><span style="background: rgba(0,0,0,0.05); padding: 2px 8px; border-radius: 999px; font-size: 0.75rem;">${t.category}</span></td>
                <td style="text-align: right; font-weight: 600;">${formatter.format(t.numericAmount)}</td>
            `;
            tbody.appendChild(tr);
        });
    }
}

// Merchant Insights Logic
function updateMerchantsView(analysis) {
    const listEl = document.getElementById('merchant-list');
    if (!listEl) return;
    listEl.innerHTML = '';

    const formatter = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });

    analysis.merchants.forEach((m, i) => {
        // Mock sparkline logic: to create a trend line, we add mock points if <5 txns
        let dataPts = [...m.history];
        if (dataPts.length < 5) {
            const avg = m.amount / m.count;
            dataPts = [avg * 0.8, avg * 1.2, avg * 0.9, avg * 1.1, ...dataPts];
        } else {
            dataPts = dataPts.slice(-5); // take last 5 for neatness
        }

        // Render SVG Sparkline inline
        const max = Math.max(...dataPts) * 1.2 || 1;
        const min = 0;
        const range = max - min;
        const width = 60, height = 30;
        const stepX = width / (dataPts.length - 1 || 1);

        const pathData = dataPts.map((val, idx) => {
            const x = idx * stepX;
            const y = height - ((val - min) / range) * height; // invert Y since canvas 0 is top
            return `${idx === 0 ? 'M' : 'L'} ${x},${y}`;
        }).join(' ');

        // Color sparkline based on trend: if last is higher than first, it's red (spending up), else green (spending down/consistent)
        const isUp = dataPts[dataPts.length - 1] > dataPts[0];
        const strokeColor = isUp ? 'var(--status-red)' : 'var(--status-green)';

        let badgeStyle = '';
        if (m.badge === 'High Value') badgeStyle = 'background: var(--status-red);';
        else if (m.badge === 'Frequent') badgeStyle = 'background: var(--accent-teal);';
        else badgeStyle = 'background: var(--text-muted);';

        const itemHtml = `
            <div class="merchant-item">
                <div class="merchant-info">
                    <div class="merchant-name">#${i + 1} ${m.name}</div>
                    <div class="merchant-badges">
                        <span class="badge" style="${badgeStyle}">${m.badge}</span>
                        <span class="badge" style="background: rgba(0,0,0,0.1); color: var(--text-primary);">${m.count}x Txns</span>
                    </div>
                </div>
                <div class="merchant-stats">
                    <div class="sparkline-container" title="Recent Spend Trend">
                        <svg width="60" height="30" viewBox="0 0 60 30">
                            <path d="${pathData}" fill="none" stroke="${strokeColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                        </svg>
                    </div>
                    <div class="merchant-amount">${formatter.format(m.amount)}</div>
                </div>
            </div>
        `;
        listEl.insertAdjacentHTML('beforeend', itemHtml);
    });
}

// Drag & Drop Handling
function setupDragAndDrop() {
    setupZone('upload-zone', 'csv-upload');
    setupZone('nav-upload-zone', 'nav-csv-upload');

    function setupZone(zoneId, inputId) {
        const dropZone = document.getElementById(zoneId);
        const fileInput = document.getElementById(inputId);
        if (!dropZone || !fileInput) return;

        // Make the entire box clickable
        dropZone.addEventListener('click', () => fileInput.click());

        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                handleFile(e.target.files[0]);
                // Reset value so same file can be selected again
                e.target.value = '';
            }
        });

        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, preventDefaults, false);
        });

        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }

        ['dragenter', 'dragover'].forEach(eventName => {
            dropZone.addEventListener(eventName, () => dropZone.classList.add('dragover'), false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, () => dropZone.classList.remove('dragover'), false);
        });

        dropZone.addEventListener('drop', (e) => {
            const dt = e.dataTransfer;
            const files = dt.files;
            if (files.length > 0) {
                handleFile(files[0]);
            }
        });
    }

    function handleFile(file) {
        if (!file.name.endsWith('.csv')) {
            alert('Please upload a valid CSV file.');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target.result;

            // Toggle Upload Zones upon actual user upload
            const mainUploadZone = document.getElementById('upload-zone');
            const navUploadZone = document.getElementById('nav-upload-zone');
            if (mainUploadZone) mainUploadZone.style.display = 'none';
            if (navUploadZone) navUploadZone.classList.remove('hidden');

            // Save to local storage for persistence across refreshes
            localStorage.setItem('kharchSaathiData', content);

            processCSVString(content);
        };
        reader.readAsText(file);
    }
}
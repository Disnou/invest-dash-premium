let myLineChart, myPieChart;
Chart.defaults.font.family = 'Inter';

function initCharts(dataRV, dataRF) {
    const pieCtx = document.getElementById('pieChart').getContext('2d');
    const lineCtx = document.getElementById('lineChart').getContext('2d');

    // Verifica qual é o tema atual para pintar as letras do gráfico
    const isLightMode = document.body.getAttribute('data-theme') === 'light';
    Chart.defaults.color = isLightMode ? '#64748b' : '#94a3b8';
    const gridColor = isLightMode ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.05)';
    const pointBgColor = isLightMode ? '#ffffff' : '#131722';

    if (myPieChart) myPieChart.destroy();
    if (myLineChart) myLineChart.destroy();

    const total = dataRV + dataRF;

    // 1. Gráfico de Rosca (Alocação)
    myPieChart = new Chart(pieCtx, {
        type: 'doughnut',
        data: {
            labels: ['Renda Variável', 'Renda Fixa'],
            datasets: [{
                data: [dataRV, dataRF],
                backgroundColor: ['#8b5cf6', '#16c784'],
                borderWidth: 0,
                hoverOffset: 4
            }]
        },
        options: { 
            responsive: true,
            maintainAspectRatio: false,
            cutout: '80%',
            plugins: {
                legend: { position: 'bottom', labels: { usePointStyle: true, padding: 20 } }
            }
        }
    });

    // 2. Gráfico de Linha (Evolução Patrimonial)
    const historico = [
        total * 0.4, total * 0.5, total * 0.55, 
        total * 0.7, total * 0.85, total
    ];

    myLineChart = new Chart(lineCtx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Atual'],
            datasets: [{
                label: 'Patrimônio (R$)',
                data: historico,
                borderColor: '#8b5cf6',
                backgroundColor: 'rgba(139, 92, 246, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: pointBgColor,
                pointBorderColor: '#8b5cf6',
                pointBorderWidth: 2,
                pointRadius: 4
            }]
        },
        options: { 
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { beginAtZero: true, grid: { color: gridColor }, border: { display: false } },
                x: { grid: { display: false }, border: { display: false } }
            }
        }
    });
}
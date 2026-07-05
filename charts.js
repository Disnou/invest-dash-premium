// Configuração global para os gráficos ficarem responsivos sem vazar
Chart.defaults.color = '#94a3b8';
Chart.defaults.font.family = 'Inter';

let lineChart, pieChart;

function initCharts() {
    const ctxLine = document.getElementById('lineChart').getContext('2d');
    const ctxPie = document.getElementById('pieChart').getContext('2d');

    // Gráfico de Linha
    lineChart = new Chart(ctxLine, {
        type: 'line',
        data: {
            labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Atual'],
            datasets: [{
                label: 'Patrimônio Total',
                data: [0, 0, 0, 0, 0, 0], // Dados de exemplo
                borderColor: '#8b5cf6',
                backgroundColor: 'rgba(139, 92, 246, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false, // OBRIGATÓRIO para mobile
            plugins: { legend: { display: false } },
            scales: {
                y: { beginAtZero: true, grid: { color: 'rgba(148, 163, 184, 0.1)' } },
                x: { grid: { display: false } }
            }
        }
    });

    // Gráfico de Pizza
    pieChart = new Chart(ctxPie, {
        type: 'doughnut',
        data: {
            labels: ['Renda Variável', 'Renda Fixa'],
            datasets: [{
                data: [50, 50], // Exemplo
                backgroundColor: ['#8b5cf6', '#10b981'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false, // OBRIGATÓRIO para mobile
            plugins: {
                legend: { position: 'bottom' }
            },
            cutout: '75%'
        }
    });
}

// Inicializa os gráficos ao carregar
document.addEventListener("DOMContentLoaded", initCharts);

// --- CONTROLE DE TEMA CLARO/ESCURO ---
const themeToggleBtn = document.getElementById('themeToggle');
const currentTheme = localStorage.getItem('theme') || 'dark';

if (currentTheme === 'light') {
    document.body.setAttribute('data-theme', 'light');
    themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i> Modo Escuro';
}

themeToggleBtn.addEventListener('click', () => {
    let theme = document.body.getAttribute('data-theme');
    if (theme === 'light') {
        document.body.removeAttribute('data-theme');
        localStorage.setItem('theme', 'dark');
        themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i> Modo Claro';
    } else {
        document.body.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
        themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i> Modo Escuro';
    }
    atualizarDashboard(); // Recarrega os gráficos com as cores novas
});

// --- CARREGAMENTO DE DADOS ---
let carteira = JSON.parse(localStorage.getItem('carteiraPremium')) || [];
let despesas = JSON.parse(localStorage.getItem('despesasPremium')) || [];
let metas = JSON.parse(localStorage.getItem('metasPremium')) || [];

// Elementos DOM Principais
const totalPatrimonyEl = document.getElementById('totalPatrimony');
const totalRVEl = document.getElementById('totalRV');
const totalRFEl = document.getElementById('totalRF');
const totalGastosEl = document.getElementById('totalGastos');
const expenseListEl = document.getElementById('expenseList');

// Formatação Moeda
const formatCurrency = (value) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

// --- GESTÃO DE MODAIS ---
function openModal(modalId) { document.getElementById(modalId).style.display = 'flex'; }
function closeModal(modalId) { document.getElementById(modalId).style.display = 'none'; }
window.onclick = function(event) {
    if (event.target.classList.contains('modal-overlay')) event.target.style.display = "none";
}

// --- LÓGICA DE INVESTIMENTOS ---
document.getElementById('assetForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const nome = document.getElementById('assetName').value.toUpperCase();
    const tipo = document.getElementById('assetType').value;
    const qtd = parseFloat(document.getElementById('assetQty').value);
    const preco = parseFloat(document.getElementById('assetPrice').value);
    const totalAporte = qtd * preco;

    const ativoExistente = carteira.find(a => a.nome === nome);
    if (ativoExistente) {
        const valorAntigo = ativoExistente.qtd * ativoExistente.precoMedio;
        ativoExistente.qtd += qtd;
        ativoExistente.precoMedio = (valorAntigo + totalAporte) / ativoExistente.qtd;
        ativoExistente.valorTotal = ativoExistente.qtd * ativoExistente.precoMedio;
    } else {
        carteira.push({ nome, tipo, qtd, precoMedio: preco, valorTotal: totalAporte });
    }
    localStorage.setItem('carteiraPremium', JSON.stringify(carteira));
    closeModal('modalAporte');
    this.reset();
    atualizarDashboard();
});

// --- LÓGICA DE GASTOS ---
document.getElementById('expenseForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const descricao = document.getElementById('expenseDesc').value;
    const categoria = document.getElementById('expenseCategory').value;
    const valor = parseFloat(document.getElementById('expenseValue').value);
    despesas.push({ descricao, categoria, valor, data: new Date().toLocaleDateString() });
    localStorage.setItem('despesasPremium', JSON.stringify(despesas));
    closeModal('modalGasto');
    this.reset();
    atualizarDashboard();
});

// --- LÓGICA DE METAS ---
document.getElementById('goalForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const nome = document.getElementById('goalName').value;
    const alvo = parseFloat(document.getElementById('goalTarget').value);
    const atual = parseFloat(document.getElementById('goalCurrent').value);
    metas.push({ nome, alvo, atual });
    localStorage.setItem('metasPremium', JSON.stringify(metas));
    closeModal('modalMeta');
    this.reset();
    atualizarDashboard();
});

// --- FUNÇÕES DE EXCLUSÃO (DELETE) ---
function removerDespesa(index) {
    if(confirm("Tem certeza que deseja apagar esta despesa?")) {
        despesas.splice(index, 1);
        localStorage.setItem('despesasPremium', JSON.stringify(despesas));
        atualizarDashboard();
    }
}
function removerMeta(index) {
    if(confirm("Tem certeza que deseja apagar esta meta?")) {
        metas.splice(index, 1);
        localStorage.setItem('metasPremium', JSON.stringify(metas));
        atualizarDashboard();
    }
}
function limparTudo() {
    if(confirm("ATENÇÃO: Deseja apagar TODOS os dados (Investimentos, Gastos e Metas)? Isso não pode ser desfeito.")) {
        localStorage.removeItem('carteiraPremium');
        localStorage.removeItem('despesasPremium');
        localStorage.removeItem('metasPremium');
        carteira = []; despesas = []; metas = [];
        atualizarDashboard();
    }
}

// --- ATUALIZAÇÃO DO DASHBOARD ---
function atualizarDashboard() {
    let rv = 0, rf = 0, gastos = 0;
    carteira.forEach(a => { a.tipo === 'RV' ? rv += a.valorTotal : rf += a.valorTotal; });
    despesas.forEach(d => gastos += d.valor);

    totalPatrimonyEl.textContent = formatCurrency(rv + rf);
    totalRVEl.textContent = formatCurrency(rv);
    totalRFEl.textContent = formatCurrency(rf);
    totalGastosEl.textContent = formatCurrency(gastos);

    renderizarLista();
    renderizarMetas();
    if (typeof initCharts === "function") initCharts(rv, rf);
}

// --- RENDERIZAR LISTAS E BARRAS ---
function renderizarLista() {
    expenseListEl.innerHTML = '';
    if(despesas.length === 0) {
        expenseListEl.innerHTML = '<p style="color: var(--muted); font-size: 14px;">Nenhuma movimentação recente.</p>';
        return;
    }
    const inicio = Math.max(0, despesas.length - 4);
    for (let i = despesas.length - 1; i >= inicio; i--) {
        const item = despesas[i];
        const li = document.createElement('li');
        li.innerHTML = `
            <div class="t-info">
                <strong>${item.descricao}</strong>
                <small>${item.categoria}</small>
            </div>
            <div style="display: flex; align-items: center;">
                <span class="t-value">- ${formatCurrency(item.valor)}</span>
                <button class="btn-delete" onclick="removerDespesa(${i})" title="Remover"><i class="fas fa-trash"></i></button>
            </div>
        `;
        expenseListEl.appendChild(li);
    }
}

function renderizarMetas() {
    const goalsListEl = document.getElementById('goalsList');
    goalsListEl.innerHTML = '';
    if (metas.length === 0) {
        goalsListEl.innerHTML = '<p style="color: var(--muted); font-size: 14px;">Nenhuma meta cadastrada.</p>';
        return;
    }
    metas.forEach((meta, index) => {
        let porcentagem = (meta.atual / meta.alvo) * 100;
        if (porcentagem > 100) porcentagem = 100; 
        const corBarra = porcentagem >= 100 ? 'var(--green)' : 'var(--purple)';

        const div = document.createElement('div');
        div.className = 'goal-item';
        div.innerHTML = `
            <div class="goal-info">
                <span>${meta.nome}</span>
                <div>
                    <span style="margin-right: 8px;">${porcentagem.toFixed(1)}%</span>
                    <button class="btn-delete" onclick="removerMeta(${index})" title="Remover"><i class="fas fa-trash"></i></button>
                </div>
            </div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${porcentagem}%; background: ${corBarra};"></div>
            </div>
        `;
        goalsListEl.appendChild(div);
    });
}

// --- SIMULADOR COM TRAVA DE BUG ---
function calcularJuros() {
    const capital = parseFloat(document.getElementById('simCapital').value);
    const aporte = parseFloat(document.getElementById('simAporte').value);
    const taxa = parseFloat(document.getElementById('simTaxa').value) / 100;
    const tempo = parseFloat(document.getElementById('simTempo').value);
    if (isNaN(capital) || isNaN(aporte) || isNaN(taxa) || isNaN(tempo)) {
        document.getElementById('simResultado').textContent = "Preencha os campos.";
        return;
    }
    let montante = capital * Math.pow(1 + taxa, tempo);
    if (aporte > 0) montante += aporte * ((Math.pow(1 + taxa, tempo) - 1) / taxa);
    document.getElementById('simResultado').textContent = `Montante Final: ${formatCurrency(montante)}`;
}

// --- EXPORTAÇÃO CSV ---
document.getElementById('exportBtn').addEventListener('click', () => {
    if (carteira.length === 0 && despesas.length === 0) return alert("Sem dados para exportar.");
    let csv = "data:text/csv;charset=utf-8,\n--- INVESTIMENTOS ---\nAtivo;Tipo;Quantidade;Preco Medio;Valor Total\n";
    carteira.forEach(r => csv += `${r.nome};${r.tipo};${r.qtd};${r.precoMedio.toFixed(2).replace('.',',')};${r.valorTotal.toFixed(2).replace('.',',')}\n`);
    csv += "\n--- GASTOS ---\nDescricao;Categoria;Valor\n";
    despesas.forEach(r => csv += `${r.descricao.replace(/;/g, '-')};${r.categoria};${r.valor.toFixed(2).replace('.',',')}\n`);

    const link = document.createElement("a");
    link.href = encodeURI(csv);
    link.download = "investdash_premium.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});

atualizarDashboard();
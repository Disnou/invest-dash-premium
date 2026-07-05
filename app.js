// Gerenciamento de Modais
function openModal(id) {
    document.getElementById(id).classList.add('active');
}

function closeModal(id) {
    document.getElementById(id).classList.remove('active');
}

// Modo Claro/Escuro
const themeToggleBtn = document.getElementById('themeToggle');
const body = document.body;

// Verifica tema salvo
if (localStorage.getItem('theme') === 'light') {
    body.setAttribute('data-theme', 'light');
    themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i> Modo Escuro';
}

themeToggleBtn.addEventListener('click', () => {
    if (body.getAttribute('data-theme') === 'light') {
        body.removeAttribute('data-theme');
        localStorage.setItem('theme', 'dark');
        themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i> Modo Claro';
    } else {
        body.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
        themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i> Modo Escuro';
    }
});

// Simulador de Juros
function calcularJuros() {
    const capital = parseFloat(document.getElementById('simCapital').value) || 0;
    const aporte = parseFloat(document.getElementById('simAporte').value) || 0;
    const taxa = parseFloat(document.getElementById('simTaxa').value) / 100 || 0;
    const tempo = parseInt(document.getElementById('simTempo').value) || 0;

    let montante = capital;
    for (let i = 0; i < tempo; i++) {
        montante = (montante + aporte) * (1 + taxa);
    }

    document.getElementById('simResultado').innerText = `Valor Acumulado: R$ ${montante.toFixed(2).replace('.', ',')}`;
}

function limparTudo() {
    if(confirm("Deseja realmente apagar todos os dados salvos?")) {
        localStorage.clear();
        location.reload();
    }
}

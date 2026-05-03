// Lógica Geral do App - Controla interações globais como Modais

// Abre a janela modal correta baseada no tipo (client ou vehicle)
function openModal(type) {
    const container = document.getElementById('modal-container');

    // Esconde todos os corpos de modal primeiro
    document.querySelectorAll('.modal-body').forEach(el => el.style.display = 'none');

    // Mostra o modal específico solicitado
    const targetModal = document.getElementById(`modal-type-${type}`);
    if (targetModal) {
        targetModal.style.display = 'block';
        container.style.display = 'flex';

        // Atualiza os ícones dentro do modal
        if (window.lucide) lucide.createIcons();

        if (type === 'vehicle') {
            carregarClientesNoSelectVeiculo();
        }
    }
}

// Fecha a janela modal
function closeModal() {
    document.getElementById('modal-container').style.display = 'none';
}

// Fecha se clicar fora da área branca do modal
window.onclick = function (event) {
    const container = document.getElementById('modal-container');
    if (event.target == container) {
        closeModal();
    }
}

// Estado global simples do app
const AppState = {
    user: { name: 'Jose Garcia', role: 'Admin' },
    orders: [],
    clients: []
};

console.log('SOS pronto para uso! 🚀');

const formClient = document.getElementById('form-client');

if (formClient) {
    formClient.addEventListener('submit', async function (event) {
        event.preventDefault();

        const formData = new FormData(formClient);

        const response = await fetch('http://localhost/Certificadora-de-Competencia-Especifica/backend/routes/cadastrar_cliente.php', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        alert(result.message);

        if (result.success) {
            formClient.reset();
            closeModal();
            renderClientsData();
        }
    });
}
async function carregarClientesNoSelectVeiculo() {
    const select = document.getElementById('vehicle-client');
    if (!select) return;

    const response = await fetch('http://localhost/Certificadora-de-Competencia-Especifica/backend/routes/clientes.php');
    const clientes = await response.json();

    select.innerHTML = '<option value="">Selecione...</option>';

    clientes.forEach(cliente => {
        select.innerHTML += `
            <option value="${cliente.id}">${cliente.nome}</option>
        `;
    });
}

const formVehicle = document.getElementById('form-vehicle');

if (formVehicle) {
    formVehicle.addEventListener('submit', async function (event) {
        event.preventDefault();

        const formData = new FormData(formVehicle);

        const response = await fetch('http://localhost/Certificadora-de-Competencia-Especifica/backend/routes/cadastrar_veiculo.php', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        alert(result.message);

        if (result.success) {
            formVehicle.reset();
            closeModal();
            renderVehiclesData();
        }
    });
}
async function carregarClientesOS() {
    const select = document.getElementById('os-client');

    if (!select) return;

    const response = await fetch('http://localhost/Certificadora-de-Competencia-Especifica/backend/routes/clientes.php');

    const clientes = await response.json();

    select.innerHTML = '<option value="">Selecione um cliente...</option>';

    clientes.forEach(cliente => {
        select.innerHTML += `
            <option value="${cliente.id}">
                ${cliente.nome}
            </option>
        `;
    });
}

async function carregarVeiculosOS() {
    const select = document.getElementById('os-vehicle');

    if (!select) return;

    const response = await fetch('http://localhost/Certificadora-de-Competencia-Especifica/backend/routes/veiculos.php');

    const veiculos = await response.json();

    select.innerHTML = '<option value="">Selecione um veículo...</option>';

    veiculos.forEach(veiculo => {
        select.innerHTML += `
            <option value="${veiculo.id}">
                ${veiculo.marca} ${veiculo.modelo} (${veiculo.placa})
            </option>
        `;
    });
}

const formOrder = document.getElementById('form-order');

if (formOrder) {

    carregarClientesOS();
    carregarVeiculosOS();

    formOrder.addEventListener('submit', async function(event) {

        event.preventDefault();

        const formData = new FormData(formOrder);

        const response = await fetch('http://localhost/Certificadora-de-Competencia-Especifica/backend/routes/cadastrar_ordem.php', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        alert(result.message);

        if (result.success) {

            formOrder.reset();

            window.location.hash = '#dashboard';

            renderDashboardData();
        }
    });
}
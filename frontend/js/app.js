// Lógica Geral do App - Modais, formulários e requisições

const API_BASE = '/Certificadora-de-Competencia-Especifica/backend/routes';

async function apiRequest(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_BASE}/${endpoint}`, options);

        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Erro na comunicação com a API:', error);
        showToast('Erro ao comunicar com o servidor.', 'error');
        return null;
    }
}

function openModal(type) {
    const container = document.getElementById('modal-container');

    document.querySelectorAll('.modal-body').forEach(el => {
        el.style.display = 'none';
    });

    const targetModal = document.getElementById(`modal-type-${type}`);

    if (targetModal) {
        targetModal.style.display = 'block';
        container.style.display = 'flex';

        if (window.lucide) lucide.createIcons();

        if (type === 'vehicle') {
            const formVehicle = document.getElementById('form-vehicle');

            if (formVehicle) {
                formVehicle.reset();

                const idInput = document.getElementById('vehicle-id');
                if (idInput) idInput.value = '';

                const title = document.querySelector('#modal-type-vehicle h2');
                if (title) title.textContent = 'Novo Veículo';

                const button = document.querySelector('#form-vehicle button[type="submit"]');
                if (button) button.textContent = 'Salvar Veículo';
            }

            carregarClientesNoSelectVeiculo();
        }

        if (type === 'order') {
            carregarClientesOS();
            carregarVeiculosOS();
        }

        if (type === 'order-edit') {
            carregarClientesNoSelectEdicaoOrdem();
            carregarVeiculosNoSelectEdicaoOrdem();
        }
    }
}

function closeModal() {
    const container = document.getElementById('modal-container');

    if (container) {
        container.style.display = 'none';
    }
}

window.onclick = function (event) {
    const container = document.getElementById('modal-container');

    if (event.target === container) {
        closeModal();
    }
};

const AppState = {
    user: null,
    orders: [],
    clients: [],
    vehicles: []
};

console.log('SOS pronto para uso! 🚀');

function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');

    if (!container) {
        alert(message);
        return;
    }

    const toast = document.createElement('div');

    toast.className = `toast toast-${type}`;
    toast.textContent = message;

    container.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}

async function carregarClientesNoSelectVeiculo() {
    const select = document.getElementById('vehicle-client');

    if (!select) return;

    const clientes = await apiRequest('clientes.php');

    if (!clientes) return;

    select.innerHTML = '<option value="">Selecione...</option>';

    clientes.forEach(cliente => {
        select.innerHTML += `
            <option value="${cliente.id}">${cliente.nome}</option>
        `;
    });
}

async function carregarClientesOS() {
    const select = document.getElementById('os-client');

    if (!select) return;

    const clientes = await apiRequest('clientes.php');

    if (!clientes) return;

    select.innerHTML = '<option value="">Selecione um cliente...</option>';

    clientes.forEach(cliente => {
        select.innerHTML += `
            <option value="${cliente.id}">
                ${cliente.nome}
            </option>
        `;
    });
}

async function carregarVeiculosOS(clienteId = '') {
    const select = document.getElementById('os-vehicle');

    if (!select) return;

    const veiculos = await apiRequest('veiculos.php');

    if (!veiculos) return;

    select.innerHTML = '<option value="">Selecione um veículo...</option>';

    const veiculosFiltrados = clienteId
        ? veiculos.filter(veiculo => String(veiculo.cliente_id) === String(clienteId))
        : [];

    veiculosFiltrados.forEach(veiculo => {
        select.innerHTML += `
            <option value="${veiculo.id}">
                ${veiculo.marca} ${veiculo.modelo} (${veiculo.placa})
            </option>
        `;
    });
}
const selectClienteOS = document.getElementById('os-client');

if (selectClienteOS) {

    selectClienteOS.addEventListener('change', async function () {

        await carregarVeiculosOS(this.value);

        document.getElementById('os-vehicle').value = '';

    });

}
// Cadastro de cliente
const formClient = document.getElementById('form-client');

if (formClient) {
    formClient.addEventListener('submit', async function (event) {
        event.preventDefault();

        const nome = formClient.querySelector('[name="nome"]')?.value.trim();

        if (!nome) {
            showToast('Informe o nome do cliente.', 'error');
            return;
        }

        const formData = new FormData(formClient);

        const clienteId = formClient.querySelector('[name="id"]')?.value;

        const endpoint = clienteId ? 'atualizar_cliente.php' : 'cadastrar_cliente.php';

        const result = await apiRequest(endpoint, {
            method: 'POST',
            body: formData
        });

        if (!result) return;

        showToast(result.message, result.success ? 'success' : 'error');

        if (result.success) {
            formClient.querySelector('[name="id"]').value = '';
            formClient.reset();
            closeModal();

            if (typeof renderClientsData === 'function') renderClientsData();
            if (typeof renderDashboardData === 'function') renderDashboardData();

            carregarClientesNoSelectVeiculo();
            carregarClientesOS();
        }
    });
}

// Cadastro de veículo
const formVehicle = document.getElementById('form-vehicle');

if (formVehicle) {
    formVehicle.addEventListener('submit', async function (event) {
        event.preventDefault();

        const placa = formVehicle.querySelector('[name="placa"]')?.value.trim();
        const modelo = formVehicle.querySelector('[name="modelo"]')?.value.trim();
        const marca = formVehicle.querySelector('[name="marca"]')?.value.trim();
        const clienteId = formVehicle.querySelector('[name="cliente_id"]')?.value;

        if (!placa || !modelo || !marca || !clienteId) {
            showToast('Preencha todos os dados do veículo.', 'error');
            return;
        }

        const formData = new FormData(formVehicle);

        const veiculoId = formVehicle.querySelector('[name="id"]')?.value;

        const endpoint = veiculoId ? 'atualizar_veiculo.php' : 'cadastrar_veiculo.php';

        const result = await apiRequest(endpoint, {
            method: 'POST',
            body: formData
        });

        if (!result) return;

        showToast(result.message, result.success ? 'success' : 'error');

        if (result.success) {
            formVehicle.querySelector('[name="id"]').value = '';
            formVehicle.reset();
            closeModal();

            if (typeof renderVehiclesData === 'function') renderVehiclesData();
            if (typeof renderDashboardData === 'function') renderDashboardData();
        }
    });
}

// Cadastro de ordem de serviço
const formOrder = document.getElementById('form-order');

if (formOrder) {
    carregarClientesOS();
    carregarVeiculosOS('');

    formOrder.addEventListener('submit', async function (event) {
        event.preventDefault();

        const clienteId = formOrder.querySelector('[name="cliente_id"]')?.value;
        const veiculoId = formOrder.querySelector('[name="veiculo_id"]')?.value;
        const descricao = formOrder.querySelector('[name="descricao"]')?.value.trim();

        if (!clienteId || !veiculoId || !descricao) {
            showToast('Preencha cliente, veículo e descrição da ordem.', 'error');
            return;
        }

        const formData = new FormData(formOrder);

        const ordemId = formOrder.querySelector('[name="id"]')?.value;

        const endpoint = ordemId ? 'atualizar_ordem.php' : 'cadastrar_ordem.php';

        const result = await apiRequest(endpoint, {
            method: 'POST',
            body: formData
        });

        if (!result) return;

        showToast(result.message, result.success ? 'success' : 'error');

        if (result.success) {
            formOrder.querySelector('[name="id"]').value = '';
            formOrder.reset();
            window.location.hash = '#orders';

            if (typeof renderDashboardData === 'function') renderDashboardData();
            if (typeof renderOrdersData === 'function') renderOrdersData();
        }
    });
}

// Cadastro de item da ordem
const formItemOrder = document.getElementById('form-item-order');

if (formItemOrder) {
    formItemOrder.addEventListener('submit', async function (event) {
        event.preventDefault();

        const descricao = formItemOrder.querySelector('[name="descricao"]')?.value.trim();
        const valor = formItemOrder.querySelector('[name="valor"]')?.value;

        if (!descricao || !valor || Number(valor) <= 0) {
            showToast('Informe descrição e valor válido para o item.', 'error');
            return;
        }

        const formData = new FormData(formItemOrder);

        const result = await apiRequest('cadastrar_item_ordem.php', {
            method: 'POST',
            body: formData
        });

        if (!result) return;

        showToast(result.message, result.success ? 'success' : 'error');

        if (result.success) {
            formItemOrder.reset();
            closeModal();

            if (typeof renderOrdersData === 'function') renderOrdersData();
            if (typeof renderDashboardData === 'function') renderDashboardData();
            if (typeof renderReportsData === 'function') renderReportsData();
        }
    });
}

// Menu mobile
const menuToggle = document.getElementById('menu-toggle');
const sidebar = document.querySelector('.sidebar');
const navLinks = document.querySelectorAll('.nav-link');

if (menuToggle && sidebar) {
    menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('active');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            sidebar.classList.remove('active');
        });
    });
}
async function carregarClientesNoSelectEdicaoOrdem() {
    const select = document.getElementById('edit-order-client');
    if (!select) return;

    const clientes = await apiRequest('clientes.php');
    if (!clientes) return;

    select.innerHTML = '<option value="">Selecione um cliente...</option>';

    clientes.forEach(cliente => {
        select.innerHTML += `
            <option value="${cliente.id}">${cliente.nome}</option>
        `;
    });
}

async function carregarVeiculosNoSelectEdicaoOrdem(clienteId = '') {
    const select = document.getElementById('edit-order-vehicle');

    if (!select) return;

    const veiculos = await apiRequest('veiculos.php');

    if (!veiculos) return;

    select.innerHTML = '<option value="">Selecione um veículo...</option>';

    const veiculosFiltrados = clienteId
        ? veiculos.filter(veiculo => String(veiculo.cliente_id) === String(clienteId))
        : [];

    veiculosFiltrados.forEach(veiculo => {
        select.innerHTML += `
            <option value="${veiculo.id}">
                ${veiculo.marca} ${veiculo.modelo} (${veiculo.placa})
            </option>
        `;
    });
}

const formOrderEdit = document.getElementById('form-order-edit');

if (formOrderEdit) {
    formOrderEdit.addEventListener('submit', async function (event) {
        event.preventDefault();

        const formData = new FormData(formOrderEdit);

        const result = await apiRequest('atualizar_ordem.php', {
            method: 'POST',
            body: formData
        });

        if (!result) return;

        showToast(result.message, result.success ? 'success' : 'error');

        if (result.success) {
            formOrderEdit.reset();
            closeModal();

            if (typeof renderOrdersData === 'function') renderOrdersData();
            if (typeof renderDashboardData === 'function') renderDashboardData();
        }
    });
}
const formSettings = document.getElementById('form-settings');

if (formSettings) {

    formSettings.addEventListener('submit', async function (event) {

        event.preventDefault();

        const formData = new FormData(formSettings);

        const result = await apiRequest('salvar_configuracoes.php', {
            method: 'POST',
            body: formData
        });

        if (!result) return;

        showToast(
            result.message,
            result.success ? 'success' : 'error'
        );
    });
}
const formUser = document.getElementById('form-user');

if (formUser) {

    formUser.addEventListener('submit', async function (event) {

        event.preventDefault();

        const formData = new FormData(formUser);

        const usuarioId = formUser.querySelector('[name="id"]')?.value;

        const endpoint = usuarioId ? 'atualizar_usuario.php' : 'cadastrar_usuario.php';

        const result = await apiRequest(endpoint, {
            method: 'POST',
            body: formData
        });

        if (!result) return;

        showToast(
            result.message,
            result.success ? 'success' : 'error'
        );

        if (result.success) {

            formUser.reset();
            formUser.querySelector('[name="id"]').value = '';

            closeModal();

            if (typeof renderSettingsData === 'function') {
                renderSettingsData();
            }
        }
    });
}
const selectClienteEdicaoOS = document.getElementById('edit-order-client');

if (selectClienteEdicaoOS) {
    selectClienteEdicaoOS.addEventListener('change', async function () {
        await carregarVeiculosNoSelectEdicaoOrdem(this.value);

        const selectVeiculo = document.getElementById('edit-order-vehicle');
        if (selectVeiculo) selectVeiculo.value = '';
    });
}
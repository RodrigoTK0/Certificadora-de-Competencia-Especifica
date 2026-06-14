// Configura as rotas e exibe as telas conforme o link (#hash)

const views = {
    'login': { title: 'Entrar - SOS', el: 'view-login', layout: false },
    'dashboard': { title: 'Dashboard - SOS', el: 'view-dashboard', layout: true },
    'clients': { title: 'Meus Clientes - SOS', el: 'view-clients', layout: true },
    'vehicles': { title: 'Veículos - SOS', el: 'view-vehicles', layout: true },
    'orders': { title: 'Ordens - SOS', el: 'view-orders', layout: true },
    'new-order': { title: 'Nova O.S. - SOS', el: 'view-new-order', layout: true },
    'reports': { title: 'Relatórios - SOS', el: 'view-reports', layout: true }

};

// Gerencia a navegação
function navigate() {
    const hash = window.location.hash.substring(1) || 'login';
    const usuarioLogado = localStorage.getItem('usuario');

    if (hash !== 'login' && !usuarioLogado) {
        window.location.hash = '#login';
        return;
    }
    const view = views[hash] || views['login'];

    document.title = view.title;

    const mainLayout = document.getElementById('main-layout');
    const loginView = document.getElementById('view-login');

    // Alterna entre login e sistema principal
    if (view.layout) {
        mainLayout.style.display = 'grid';
        loginView.style.display = 'none';
    } else {
        mainLayout.style.display = 'none';
        loginView.style.display = 'flex';
    }

    // Esconde todas as telas e mostra a selecionada
    document.querySelectorAll('.view').forEach(v => v.style.display = 'none');
    const targetEl = document.getElementById(view.el);
    if (targetEl) {
        targetEl.style.display = (view.el === 'view-login') ? 'flex' : 'block';
    }

    // Marca o link ativo no menu
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.toggle('active', link.getAttribute('data-link') === hash);
    });

    // Carrega os dados da tela
    if (hash === 'dashboard') renderDashboardData();
    if (hash === 'clients') renderClientsData();
    if (hash === 'vehicles') renderVehiclesData();
    if (hash === 'orders') renderOrdersData();
    if (hash === 'reports') renderReportsData();

    // Atualiza ícones Lucide
    if (window.lucide) lucide.createIcons();
}

// --- Funções para preencher as tabelas ---

async function renderDashboardData() {
    const tbody = document.querySelector('#table-recent-orders tbody');
    if (!tbody) return;

    try {
        const orders = await apiRequest('ordens.php');
        const dashboardData = await apiRequest('dashboard.php');

        if (!orders || !dashboardData) return;

        // Atualiza os cards do topo
        document.querySelector('#card-open-orders .card-value').textContent = dashboardData.ordens_abertas;

        document.querySelector('#card-completed-orders .card-value').textContent = dashboardData.ordens_concluidas;

        document.querySelector('#card-active-clients .card-value').textContent = dashboardData.clientes_ativos;

        tbody.innerHTML = orders.map(o => {
            let badge = 'warning';

            if (o.status === 'Em andamento') badge = 'info';
            if (o.status === 'Concluída' || o.status === 'Concluído') badge = 'success';

            return `
                <tr>
                    <td><strong>#${String(o.id).padStart(3, '0')}</strong></td>
                    <td>${o.cliente_nome}</td>
                    <td>${o.veiculo_marca} ${o.veiculo_modelo}</td>
                    <td><span class="badge badge-${badge}">${o.status}</span></td>
                    <td>R$ ${Number(o.valor_total).toFixed(2).replace('.', ',')}</td>
                    <td>
                        <button class="btn glass" style="padding: 0.4rem;">
                            <i data-lucide="eye" style="width: 16px;"></i>
                        </button>
                    </td>
                </tr>
            `;
        }).join('');

        if (window.lucide) lucide.createIcons();

    } catch (error) {
        console.error('Erro ao carregar ordens:', error);
        tbody.innerHTML = `
            <tr>
                <td colspan="6">Erro ao carregar ordens de serviço.</td>
            </tr>
        `;
    }
}

async function renderClientsData() {
    const tbody = document.querySelector('#table-clients tbody');
    if (!tbody) return;

    try {
        const clients = await apiRequest('clientes.php');

        if (!clients) return;

        tbody.innerHTML = clients.map(c => `
            <tr>
                <td><strong>${c.nome}</strong></td>
                    <td>${c.documento || '-'}</td>
                    <td>${c.telefone}</td>
                    <td>${c.email || '-'}</td>
                    <td>${c.veiculos || 'Nenhum veículo'}</td>
                <td>
                    <div style="display: flex; gap: 0.5rem;">

                       <button class="btn glass" style="padding: 0.4rem;"
                            onclick='abrirEditarCliente(${JSON.stringify(c)})'>
                             <i data-lucide="edit" style="width: 16px;"></i>
                        </button>

                        <button class="btn glass"
                            style="padding: 0.4rem; color: var(--danger);"
                            onclick="excluirCliente(${c.id})">

                            <i data-lucide="trash-2" style="width: 16px;"></i>
                        </button>

                    </div>
                </td>
            </tr>
        `).join('');

        if (window.lucide) lucide.createIcons();

    } catch (error) {
        console.error('Erro ao carregar clientes:', error);
        tbody.innerHTML = `
            <tr>
                <td colspan="5">Erro ao carregar clientes.</td>
            </tr>
        `;
    }
}

async function renderVehiclesData() {
    const tbody = document.querySelector('#table-vehicles tbody');
    if (!tbody) return;

    try {
        const vehicles = await apiRequest('veiculos.php');

        if (!vehicles) return;

        tbody.innerHTML = vehicles.map(v => `
            <tr>
                <td><strong style="background: white; color: black; padding: 2px 6px; border-radius: 4px; font-family: monospace;">${v.placa}</strong></td>
                <td>${v.modelo}</td>
                <td>${v.marca}</td>
                <td>${v.ano || '-'}</td>
                <td>${v.cliente_nome}</td>
                <td>
                    <div style="display: flex; gap: 0.5rem;">

                    <button class="btn glass" style="padding: 0.4rem;"
                        onclick='abrirEditarVeiculo(${JSON.stringify(v)})'>
                        <i data-lucide="edit" style="width: 16px;"></i>
                    </button>

                    <button class="btn glass"
                         style="padding: 0.4rem; color: var(--danger);"
                            onclick="excluirVeiculo(${v.id})">

                                <i data-lucide="trash-2" style="width: 16px;"></i>
                    </button>

</div>
                </td>
            </tr>
        `).join('');

        if (window.lucide) lucide.createIcons();

    } catch (error) {
        console.error('Erro ao carregar veículos:', error);
        tbody.innerHTML = `
            <tr>
                <td colspan="5">Erro ao carregar veículos.</td>
            </tr>
        `;
    }
}
async function renderOrdersData() {
    const tbody = document.querySelector('#table-orders tbody');
    if (!tbody) return;

    try {
        const orders = await apiRequest('ordens.php');

        if (!orders) return;

        tbody.innerHTML = orders.map(o => {
            return `
                <tr>
                    <td><strong>#${String(o.id).padStart(3, '0')}</strong></td>
                    <td>${o.cliente_nome}</td>
                    <td>${o.veiculo_marca} ${o.veiculo_modelo}</td>
                    <td>${o.descricao}</td>
                    <td>
                        <select onchange="atualizarStatus(${o.id}, this.value)">
                            <option value="Aberta" ${o.status === 'Aberta' ? 'selected' : ''}>Aberta</option>
                            <option value="Em andamento" ${o.status === 'Em andamento' ? 'selected' : ''}>Em andamento</option>
                            <option value="Concluída" ${o.status === 'Concluída' ? 'selected' : ''}>Concluída</option>
                        </select>
                    </td>
                    <td>R$ ${Number(o.valor_total).toFixed(2).replace('.', ',')}</td>
                    <td>${new Date(o.data_criacao).toLocaleDateString('pt-BR')}</td>
                    <td>
                        <button class="btn btn-primary" onclick="abrirAdicionarItem(${o.id})">
                             + Item
                        </button>

                        <button class="btn glass" onclick="abrirDetalhesOrdem(${o.id})">
                            Ver Detalhes
                        </button>
                        <button class="btn glass" style="color: var(--danger);" onclick="excluirOrdem(${o.id})">
                             Excluir
                        </button>
                    </td>
                </tr>
            `;
        }).join('');

        if (window.lucide) lucide.createIcons();

    } catch (error) {
        console.error('Erro ao carregar ordens:', error);
        tbody.innerHTML = `
            <tr>
                <td colspan="8">Erro ao carregar ordens de serviço.</td>
            </tr>
        `;
    }
}
let statusChart = null;

async function renderReportsData() {
    try {
        const data = await apiRequest('relatorios.php');

        if (!data) return;

        document.getElementById('report-clientes').textContent = data.total_clientes;
        document.getElementById('report-veiculos').textContent = data.total_veiculos;
        document.getElementById('report-abertas').textContent = data.ordens_abertas;
        document.getElementById('report-andamento').textContent = data.ordens_andamento;
        document.getElementById('report-concluidas').textContent = data.ordens_concluidas;

        document.getElementById('report-faturamento').textContent =
            `R$ ${Number(data.faturamento).toFixed(2).replace('.', ',')}`;

        const ctx = document.getElementById('chart-status-orders');

        if (ctx) {
            if (statusChart) {
                statusChart.destroy();
            }

            statusChart = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['Abertas', 'Em andamento', 'Concluídas'],
                    datasets: [{
                        data: [
                            data.ordens_abertas,
                            data.ordens_andamento,
                            data.ordens_concluidas
                        ]
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            labels: {
                                color: '#ffffff'
                            }
                        }
                    }
                }
            });
        }

    } catch (error) {
        console.error('Erro ao carregar relatórios:', error);
    }
}
// Inicializa a navegação e eventos
window.addEventListener('hashchange', navigate);

window.addEventListener('load', () => {
    const loginForm = document.getElementById('login-form');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = new FormData(loginForm);

            const result = await apiRequest('login.php', {
                method: 'POST',
                body: formData
            });

            if (!result) return;

            showToast(result.message, result.success ? 'success' : 'error');

            if (result.success) {
                localStorage.setItem('usuario', JSON.stringify(result.usuario));
                window.location.hash = '#dashboard';
            }
        });
    }

    navigate();
});
async function atualizarStatus(id, status) {

    const formData = new FormData();

    formData.append('id', id);
    formData.append('status', status);

    const result = await apiRequest('atualizar_status_ordem.php', {
        method: 'POST',
        body: formData
    });

    if (!result) return;

    if (result.success) {
        renderOrdersData();
        renderDashboardData();
    } else {
        showToast(result.message, 'error');
    }
}
function abrirAdicionarItem(ordemId) {
    document.getElementById('item-order-id').value = ordemId;
    openModal('item');
}

async function abrirDetalhesOrdem(ordemId) {
    const itens = await apiRequest(`listar_itens_ordem.php?ordem_id=${ordemId}`);

    if (!itens) return;

    const modal = document.getElementById('modal-order-details');
    const title = document.getElementById('order-details-title');
    const content = document.getElementById('order-details-content');

    title.textContent = `Detalhes da Ordem #${String(ordemId).padStart(3, '0')}`;

    if (itens.length === 0) {
        content.innerHTML = `
            <p style="color: var(--text-muted);">
                Nenhum item foi adicionado nesta ordem de serviço.
            </p>
        `;
    } else {
        let total = 0;

        content.innerHTML = `
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Tipo</th>
                            <th>Descrição</th>
                            <th>Valor</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${itens.map(item => {
            const valor = Number(item.valor);
            total += valor;

            return `
                                <tr>
                                    <td>${item.tipo}</td>
                                    <td>${item.descricao}</td>
                                    <td>R$ ${valor.toFixed(2).replace('.', ',')}</td>
                                </tr>
                            `;
        }).join('')}
                    </tbody>
                </table>
            </div>

            <div style="display: flex; justify-content: flex-end; margin-top: 1.5rem;">
                <strong style="font-size: 1.2rem; color: var(--primary);">
                    Total: R$ ${total.toFixed(2).replace('.', ',')}
                </strong>
            </div>
        `;
    }

    modal.style.display = 'flex';

    if (window.lucide) lucide.createIcons();
}

function fecharDetalhesOrdem() {
    document.getElementById('modal-order-details').style.display = 'none';
}
async function excluirOrdem(id) {
    const confirmar = confirm('Tem certeza que deseja excluir esta ordem de serviço?');

    if (!confirmar) return;

    const formData = new FormData();
    formData.append('id', id);

    const result = await apiRequest('excluir_ordem.php', {
        method: 'POST',
        body: formData
    });

    if (!result) return;

    showToast(result.message, result.success ? 'success' : 'error');

    if (result.success) {
        renderOrdersData();
        renderDashboardData();
    }
}
async function excluirCliente(id) {
    const confirmar = confirm('Deseja excluir este cliente?');

    if (!confirmar) return;

    const formData = new FormData();
    formData.append('id', id);

    const result = await apiRequest('excluir_cliente.php', {
        method: 'POST',
        body: formData
    });

    if (!result) return;

    showToast(result.message, result.success ? 'success' : 'error');

    if (result.success) {
        renderClientsData();
        renderDashboardData();
    }
}
async function excluirVeiculo(id) {

    const confirmar = confirm('Deseja excluir este veículo?');

    if (!confirmar) return;

    const formData = new FormData();

    formData.append('id', id);

    const result = await apiRequest('excluir_veiculo.php', {
        method: 'POST',
        body: formData
    });

    if (!result) return;

    showToast(result.message, result.success ? 'success' : 'error');

    if (result.success) {
        renderVehiclesData();
        renderDashboardData();
    }
}
function abrirEditarCliente(cliente) {
    openModal('client');

    document.getElementById('client-id').value = cliente.id;
    document.getElementById('client-name').value = cliente.nome || '';
    document.getElementById('client-phone').value = cliente.telefone || '';
    document.getElementById('client-email').value = cliente.email || '';

    const documentoInput = document.getElementById('client-document');
    if (documentoInput) {
        documentoInput.value = cliente.documento || '';
    }

    const enderecoInput = document.getElementById('client-address');
    if (enderecoInput) {
        enderecoInput.value = cliente.endereco || '';
    }

    const title = document.querySelector('#modal-type-client h3');
    if (title) {
        title.textContent = 'Editar Cliente';
    }

    const button = document.querySelector('#form-client button[type="submit"]');
    if (button) {
        button.textContent = 'Salvar alterações';
    }

}
async function abrirEditarVeiculo(veiculo) {
    openModal('vehicle');

    await carregarClientesNoSelectVeiculo();

    document.getElementById('vehicle-id').value = veiculo.id;
    document.getElementById('vehicle-plate').value = veiculo.placa || '';
    document.getElementById('vehicle-brand').value = veiculo.marca || '';
    document.getElementById('vehicle-model').value = veiculo.modelo || '';

    const anoInput = document.getElementById('vehicle-year');
    if (anoInput) {
        anoInput.value = veiculo.ano || '';
    }

    const clienteSelect = document.getElementById('vehicle-client');

    if (clienteSelect) {
        clienteSelect.value = String(veiculo.cliente_id);
    }

    const title = document.querySelector('#modal-type-vehicle h2');
    if (title) {
        title.textContent = 'Editar Veículo';
    }

    const button = document.querySelector('#form-vehicle button[type="submit"]');
    if (button) {
        button.textContent = 'Salvar alterações';
    }
}
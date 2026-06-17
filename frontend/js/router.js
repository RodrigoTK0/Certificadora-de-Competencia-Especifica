// Configura as rotas e exibe as telas conforme o link (#hash)

const views = {
    'login': { title: 'Entrar - SOS', el: 'view-login', layout: false },
    'dashboard': { title: 'Dashboard - SOS', el: 'view-dashboard', layout: true },
    'clients': { title: 'Meus Clientes - SOS', el: 'view-clients', layout: true },
    'vehicles': { title: 'Veículos - SOS', el: 'view-vehicles', layout: true },
    'orders': { title: 'Ordens - SOS', el: 'view-orders', layout: true },
    'new-order': { title: 'Nova O.S. - SOS', el: 'view-new-order', layout: true },
    'reports': { title: 'Relatórios - SOS', el: 'view-reports', layout: true },
    'settings': { title: 'Configurações - SOS', el: 'view-settings', layout: true }

};

// Gerencia a navegação
function navigate() {
    const hash = window.location.hash.substring(1) || 'login';
    const usuarioLogado = localStorage.getItem('usuario');
    const usuario = usuarioLogado ? JSON.parse(usuarioLogado) : null;
    const loggedUserName = document.getElementById('logged-user-name');
    const loggedUserRole = document.getElementById('logged-user-role');

    if (usuario && loggedUserName && loggedUserRole) {
        loggedUserName.textContent = usuario.nome || 'Usuário';
        loggedUserRole.textContent = usuario.tipo || 'Funcionário';
        const dashboardWelcome = document.getElementById('dashboard-welcome');

        if (usuario && dashboardWelcome) {
            dashboardWelcome.textContent = `Bem-vindo, ${usuario.nome}!`;
        }
    }

    if (hash === 'settings' && usuario?.tipo !== 'Administrador') {
        showToast('Acesso permitido apenas para administradores.', 'error');
        window.location.hash = '#dashboard';
        return;
    }

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
    const settingsLink = document.querySelector('[data-link="settings"]');

    if (settingsLink && usuario) {
        const settingsItem = settingsLink.closest('li');

        if (settingsItem) {
            settingsItem.style.display =
                usuario.tipo === 'Administrador' ? '' : 'none';
        }
    }

    // Carrega os dados da tela
    if (hash === 'dashboard') renderDashboardData();
    if (hash === 'clients') renderClientsData();
    if (hash === 'vehicles') renderVehiclesData();
    if (hash === 'orders') renderOrdersData();
    if (hash === 'reports') renderReportsData();
    if (hash === 'settings') renderSettingsData();

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

        document.querySelector('#card-vehicles .card-value').textContent =
            dashboardData.veiculos_cadastrados;

        document.querySelector('#card-waiting-parts .card-value').textContent =
            dashboardData.ordens_aguardando_pecas;

        document.querySelector('#card-revenue .card-value').textContent =
            `R$ ${Number(dashboardData.faturamento_total).toFixed(2).replace('.', ',')}`;

        document.querySelector('#card-progress-orders .card-value').textContent =
            dashboardData.ordens_andamento;

        document.querySelector('#card-ready-orders .card-value').textContent =
            dashboardData.ordens_prontas_retirada;


        tbody.innerHTML = orders.map(o => {
            let badge = 'warning';


            switch (o.status) {

                case 'Aberta':
                    badge = 'warning';
                    break;

                case 'Em andamento':
                    badge = 'info';
                    break;

                case 'Aguardando peças':
                    badge = 'orange';
                    break;

                case 'Pronta para retirada':
                    badge = 'purple';
                    break;

                case 'Concluída':
                    badge = 'success';
                    break;

                case 'Cancelada':
                    badge = 'danger';
                    break;
            }

            return `
                        <tr onclick="abrirDetalhesOrdem(${o.id})" style="cursor: pointer;">
                            <td><strong>#${String(o.id).padStart(3, '0')}</strong></td>
                            <td>${o.cliente_nome || '-'}</td>
                            <td>${o.veiculo_marca || ''} ${o.veiculo_modelo || ''}</td>
                            <td><span class="badge badge-${badge}">${o.status}</span></td>
                            <td>R$ ${Number(o.valor_total || 0).toFixed(2).replace('.', ',')}</td>
                        </tr>
                    `;
        }).join('');

        if (window.lucide) lucide.createIcons();

    } catch (error) {
        console.error('Erro ao carregar ordens:', error);
        tbody.innerHTML = `
            <tr>
                <td colspan="5">Erro ao carregar ordens de serviço.</td>
            </tr>
        `;
    }
}

let clientesCache = [];

async function renderClientsData() {
    const tbody = document.querySelector('#table-clients tbody');

    if (!tbody) return;

    try {
        const clients = await apiRequest('clientes.php');

        if (!clients) return;

        clientesCache = clients;

        renderClientsTable(clientesCache);

    } catch (error) {
        console.error('Erro ao carregar clientes:', error);

        tbody.innerHTML = `
            <tr>
                <td colspan="6">Erro ao carregar clientes.</td>
            </tr>
        `;
    }
}
function renderClientsTable(clients) {
    const tbody = document.querySelector('#table-clients tbody');

    if (!tbody) return;

    if (clients.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6">Nenhum cliente encontrado.</td>
            </tr>
        `;
        return;
    }

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

    if (window.lucide) {
        lucide.createIcons();
    }
}
let veiculosCache = [];
async function renderVehiclesData() {
    const tbody = document.querySelector('#table-vehicles tbody');

    if (!tbody) return;

    try {
        const vehicles = await apiRequest('veiculos.php');

        if (!vehicles) return;

        veiculosCache = vehicles;

        renderVehiclesTable(veiculosCache);

    } catch (error) {
        console.error('Erro ao carregar veículos:', error);

        tbody.innerHTML = `
            <tr>
                <td colspan="6">Erro ao carregar veículos.</td>
            </tr>
        `;
    }
}
function renderVehiclesTable(vehicles) {
    const tbody = document.querySelector('#table-vehicles tbody');

    if (!tbody) return;

    if (vehicles.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6">Nenhum veículo encontrado.</td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = vehicles.map(v => `
        <tr>
            <td>
                <strong style="background: white; color: black; padding: 2px 6px; border-radius: 4px; font-family: monospace;">
                    ${v.placa}
                </strong>
            </td>

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

    if (window.lucide) {
        lucide.createIcons();
    }
}
let ordensCache = [];
async function renderOrdersData() {
    const tbody = document.querySelector('#table-orders tbody');

    if (!tbody) return;

    try {
        const orders = await apiRequest('ordens.php');

        if (!orders) return;

        ordensCache = orders;

        renderOrdersTable(ordensCache);

    } catch (error) {
        console.error('Erro ao carregar ordens:', error);

        tbody.innerHTML = `
            <tr>
                <td colspan="8">Erro ao carregar ordens de serviço.</td>
            </tr>
        `;
    }
}
function renderOrdersTable(orders) {
    const tbody = document.querySelector('#table-orders tbody');

    if (!tbody) return;

    if (orders.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8">Nenhuma ordem encontrada.</td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = orders.map(o => `
        <tr>
            <td><strong>#${String(o.id).padStart(3, '0')}</strong></td>
            <td>${o.cliente_nome}</td>
            <td>${o.veiculo_marca} ${o.veiculo_modelo}</td>
            <td class="descricao-cell" title="${o.descricao}">
                ${o.descricao.length > 40
            ? o.descricao.substring(0, 40) + '...'
            : o.descricao
        }
</td>
            <td>
                <select onchange="atualizarStatus(${o.id}, this.value)">
                    <option value="Aberta" ${o.status === 'Aberta' ? 'selected' : ''}>Aberta</option>
                        <option value="Em andamento" ${o.status === 'Em andamento' ? 'selected' : ''}>Em andamento</option>
                        <option value="Aguardando peças" ${o.status === 'Aguardando peças' ? 'selected' : ''}>Aguardando peças</option>
                        <option value="Pronta para retirada" ${o.status === 'Pronta para retirada' ? 'selected' : ''}>Pronta para retirada</option>
                        <option value="Concluída" ${o.status === 'Concluída' ? 'selected' : ''}>Concluída</option>
                        <option value="Cancelada" ${o.status === 'Cancelada' ? 'selected' : ''}>Cancelada</option>
                </select>
             </td>
             <td>R$ ${Number(o.valor_total).toFixed(2).replace('.', ',')}</td>
                <td>${new Date(o.data_criacao).toLocaleDateString('pt-BR')}</td>
                
                <td>
                    <div class="action-buttons">
    
                        <button class="btn glass"
                            title="Adicionar Item"
                            onclick="abrirAdicionarItem(${o.id})">
                            <i data-lucide="plus"></i>
                        </button>

                        <button class="btn glass"
                            title="Editar Ordem"
                            onclick='abrirEditarOrdem(${JSON.stringify(o)})'>
                            <i data-lucide="square-pen"></i>
                        </button>

                        <button class="btn glass"
                            title="Ver Detalhes"
                            onclick="abrirDetalhesOrdem(${o.id})">
                            <i data-lucide="eye"></i>
                        </button>

                        <button class="btn glass"
                            title="Imprimir Ordem"
                            onclick="imprimirOrdem(${o.id})">
                            <i data-lucide="printer"></i>
                        </button>

                        <button class="btn glass delete-btn"
                            title="Excluir Ordem"
                            onclick="excluirOrdem(${o.id})">
                            <i data-lucide="trash-2"></i>
                        </button>

                    </div>
                </div>
        </td>
     </tr>
    `).join('');

    if (window.lucide) {
        lucide.createIcons();
    }
}
let statusChart = null;

async function renderReportsData() {
    try {
        const data = await apiRequest('relatorios.php');

        if (!data) return;

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
                    labels: [
                        'Abertas',
                        'Em andamento',
                        'Aguardando peças',
                        'Pronta para retirada',
                        'Concluídas',
                        'Canceladas'
                    ],
                    datasets: [{
                        data: [
                            data.ordens_abertas,
                            data.ordens_andamento,
                            data.ordens_aguardando_pecas,
                            data.ordens_prontas_retirada,
                            data.ordens_concluidas,
                            data.ordens_canceladas
                        ],

                        backgroundColor: [
                            '#f59e0b',
                            '#3b82f6',
                            '#f97316',
                            '#8b5cf6',
                            '#22c55e',
                            '#ef4444'
                        ],

                        borderColor: '#1e293b',
                        borderWidth: 2
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
                                    <td>${formatarTipoItem(item.tipo)}</td>
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
    const confirmar = await confirmarAcao('Tem certeza que deseja excluir esta ordem de serviço?');

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
    const confirmar = await confirmarAcao(
        'Tem certeza que deseja excluir este cliente?'
    );

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

    const confirmar = await confirmarAcao(
        'Tem certeza que deseja excluir este veículo?'
    );

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
document.addEventListener('input', function (event) {

    if (event.target.id === 'search-client') {

        const termo = event.target.value
            .toLowerCase()
            .trim();

        const filtrados = clientesCache.filter(cliente => {

            const nome = (cliente.nome || '')
                .toLowerCase();

            const documento = (cliente.documento || '')
                .toLowerCase();

            return nome.includes(termo)
                || documento.includes(termo);

        });

        renderClientsTable(filtrados);
    }

});
document.addEventListener('input', function (event) {

    if (event.target.id === 'search-vehicle') {

        const termo = event.target.value
            .toLowerCase()
            .trim();

        const filtrados = veiculosCache.filter(veiculo => {

            const placa = (veiculo.placa || '').toLowerCase();
            const modelo = (veiculo.modelo || '').toLowerCase();
            const marca = (veiculo.marca || '').toLowerCase();
            const proprietario = (veiculo.cliente_nome || '').toLowerCase();

            return placa.includes(termo)
                || modelo.includes(termo)
                || marca.includes(termo)
                || proprietario.includes(termo);
        });

        renderVehiclesTable(filtrados);
    }

});
document.addEventListener('input', function (event) {

    if (event.target.id === 'search-order') {

        const termo = event.target.value
            .toLowerCase()
            .trim();

        const filtrados = ordensCache.filter(ordem => {

            const numero = String(ordem.id || '').padStart(3, '0');
            const cliente = (ordem.cliente_nome || '').toLowerCase();
            const veiculo = `${ordem.veiculo_marca || ''} ${ordem.veiculo_modelo || ''}`.toLowerCase();
            const status = (ordem.status || '').toLowerCase();
            const descricao = (ordem.descricao || '').toLowerCase();

            return numero.includes(termo)
                || cliente.includes(termo)
                || veiculo.includes(termo)
                || status.includes(termo)
                || descricao.includes(termo);
        });

        renderOrdersTable(filtrados);
    }

});
async function abrirEditarOrdem(ordem) {
    openModal('order-edit');

    await carregarClientesNoSelectEdicaoOrdem();
    await carregarVeiculosNoSelectEdicaoOrdem();

    document.getElementById('edit-order-id').value = ordem.id;
    document.getElementById('edit-order-client').value = String(ordem.cliente_id);
    document.getElementById('edit-order-vehicle').value = String(ordem.veiculo_id);
    document.getElementById('edit-order-description').value = ordem.descricao || '';

    const title = document.getElementById('edit-order-title');
    if (title) {
        title.textContent = `Editar Ordem #${String(ordem.id).padStart(3, '0')}`;
    }

    if (window.lucide) lucide.createIcons();
}
async function imprimirOrdem(ordemId) {
    const ordens = await apiRequest('ordens.php');
    const itens = await apiRequest(`listar_itens_ordem.php?ordem_id=${ordemId}`);
    const config = await apiRequest('configuracoes.php');

    if (!ordens || !itens) return;

    const ordem = ordens.find(o => String(o.id) === String(ordemId));

    if (!ordem) {
        showToast('Ordem não encontrada.', 'error');
        return;
    }

    const itensHtml = itens.length > 0
        ? itens.map(item => `
            <tr>
                <td>${formatarTipoItem(item.tipo)}</td>
                <td>${item.descricao}</td>
                <td>R$ ${Number(item.valor).toFixed(2).replace('.', ',')}</td>
            </tr>
        `).join('')
        : `
            <tr>
                <td colspan="3">Nenhum item cadastrado nesta ordem.</td>
            </tr>
        `;

    const janela = window.open('', '_blank');

    janela.document.write(`
        <!DOCTYPE html>
        <html lang="pt-br">
        <head>
            <meta charset="UTF-8">
            <title>Ordem de Serviço #${String(ordem.id).padStart(3, '0')}</title>

            <style>
                body {
                    font-family: Arial, sans-serif;
                    color: #111827;
                    margin: 40px;
                }

                .header {
                    border-bottom: 2px solid #111827;
                    padding-bottom: 15px;
                    margin-bottom: 25px;
                }

                h1 {
                    margin: 0;
                    font-size: 26px;
                }

                .subtitle {
                    color: #6b7280;
                    margin-top: 5px;
                }

                .section {
                    margin-bottom: 25px;
                }

                .grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 12px;
                }

                .box {
                    border: 1px solid #d1d5db;
                    padding: 12px;
                    border-radius: 8px;
                }

                .label {
                    font-size: 12px;
                    color: #6b7280;
                    margin-bottom: 4px;
                }

                .value {
                    font-weight: bold;
                }

                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 10px;
                }

                th, td {
                    border: 1px solid #d1d5db;
                    padding: 10px;
                    text-align: left;
                }

                th {
                    background: #f3f4f6;
                }

                .total {
                    text-align: right;
                    margin-top: 20px;
                    font-size: 20px;
                    font-weight: bold;
                }

                .footer {
                    margin-top: 50px;
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 60px;
                }

                .signature {
                    border-top: 1px solid #111827;
                    text-align: center;
                    padding-top: 8px;
                    font-size: 14px;
                }

                @media print {
                    button {
                        display: none;
                    }
                }
            </style>
        </head>

        <body>
            <button onclick="window.print()" style="margin-bottom: 20px; padding: 10px 16px;">
                Imprimir
            </button>

            <div class="header">
                <h1>${config.nome_oficina || 'Sistema O.S.'}</h1>
                    <div class="subtitle">
                        ${config.telefone || ''} ${config.email ? ' | ' + config.email : ''}
                        <br>
                        ${config.endereco || ''}
                    </div>
            </div>

            <div class="section">
                <h2>Dados da Ordem</h2>

                <div class="grid">
                    <div class="box">
                        <div class="label">Número da OS</div>
                        <div class="value">#${String(ordem.id).padStart(3, '0')}</div>
                    </div>

                    <div class="box">
                        <div class="label">Status</div>
                        <div class="value">${ordem.status}</div>
                    </div>

                    <div class="box">
                        <div class="label">Data de criação</div>
                        <div class="value">${new Date(ordem.data_criacao).toLocaleDateString('pt-BR')}</div>
                    </div>

                    <div class="box">
                        <div class="label">Cliente</div>
                        <div class="value">${ordem.cliente_nome}</div>
                    </div>

                    <div class="box">
                        <div class="label">Veículo</div>
                        <div class="value">${ordem.veiculo_marca} ${ordem.veiculo_modelo}</div>
                    </div>

                    <div class="box">
                        <div class="label">Placa</div>
                        <div class="value">${ordem.veiculo_placa || '-'}</div>
                    </div>
                </div>
            </div>

            <div class="section">
                <h2>Descrição do Problema</h2>
                <div class="box">${ordem.descricao}</div>
            </div>

            <div class="section">
                <h2>Itens da Ordem</h2>

                <table>
                    <thead>
                        <tr>
                            <th>Tipo</th>
                            <th>Descrição</th>
                            <th>Valor</th>
                        </tr>
                    </thead>

                    <tbody>
                        ${itensHtml}
                    </tbody>
                </table>

                <div class="total">
                    Total: R$ ${Number(ordem.valor_total).toFixed(2).replace('.', ',')}
                </div>
            </div>

            <div class="footer">
                <div class="signature">Assinatura do Cliente</div>
                <div class="signature">Responsável da Oficina</div>
            </div>
        </body>
        </html>
    `);

    janela.document.close();
}
function confirmarAcao(mensagem) {
    return new Promise((resolve) => {
        const modal = document.createElement('div');

        modal.className = 'confirm-overlay';

        modal.innerHTML = `
            <div class="confirm-box">
                <h3>Confirmação</h3>
                <p>${mensagem}</p>

                <div class="confirm-actions">
                    <button class="btn glass" id="cancel-confirm">
                        Cancelar
                    </button>

                    <button class="btn btn-danger" id="ok-confirm">
                        Confirmar
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        document.getElementById('cancel-confirm').onclick = () => {
            modal.remove();
            resolve(false);
        };

        document.getElementById('ok-confirm').onclick = () => {
            modal.remove();
            resolve(true);
        };
    });
}
function cancelarOrdem() {
    const formOrder = document.getElementById('form-order');

    if (formOrder) {
        formOrder.reset();

        const idInput = document.getElementById('order-id');
        if (idInput) idInput.value = '';
    }

    const title = document.querySelector('#view-new-order h1');
    if (title) title.textContent = 'Nova Ordem de Serviço';

    const button = document.querySelector('#form-order button[type="submit"]');
    if (button) {
        button.innerHTML = '<i data-lucide="save"></i> Salvar Ordem';
    }

    window.location.hash = '#orders';

    if (window.lucide) lucide.createIcons();
}
async function renderSettingsData() {

    const config = await apiRequest('configuracoes.php');
    const usuarios = await apiRequest('usuarios.php');

    if (config) {
        document.getElementById('config-nome-oficina').value =
            config.nome_oficina || '';

        document.getElementById('config-telefone').value =
            config.telefone || '';

        document.getElementById('config-email').value =
            config.email || '';

        document.getElementById('config-endereco').value =
            config.endereco || '';
    }

    const tbody = document.querySelector('#table-users tbody');

    if (tbody && usuarios) {

        tbody.innerHTML = usuarios.map(usuario => `
    <tr>
        <td>${usuario.nome}</td>
        <td>${usuario.email}</td>
        <td>
            <span class="badge ${usuario.tipo === 'Administrador' ? 'badge-success' : 'badge-info'}">
                ${usuario.tipo}
            </span>
        </td>
        <td>
            <div class="action-buttons">
                <button class="btn glass"
                    title="Editar Usuário"
                    onclick='abrirEditarUsuario(${JSON.stringify(usuario)})'>
                    <i data-lucide="square-pen"></i>
                </button>
                <button class="btn glass delete-btn"
                    title="Excluir Usuário"
                    onclick="excluirUsuario(${usuario.id})">
                    <i data-lucide="trash-2"></i>
                </button>
            </div>
        </td>
    </tr>
`).join('');
    }

    if (window.lucide) {
        lucide.createIcons();
    }
}
function abrirEditarUsuario(usuario) {
    openModal('user');

    document.getElementById('user-id').value = usuario.id;
    document.getElementById('user-name').value = usuario.nome || '';
    document.getElementById('user-email').value = usuario.email || '';
    document.getElementById('user-password').value = '';
    document.getElementById('user-type').value = usuario.tipo || 'Funcionário';

    const title = document.querySelector('#modal-type-user h2');
    if (title) title.textContent = 'Editar Usuário';

    const button = document.querySelector('#form-user button[type="submit"]');
    if (button) button.textContent = 'Salvar alterações';
}
async function excluirUsuario(id) {
    const usuarioLogado = JSON.parse(localStorage.getItem('usuario'));

    if (usuarioLogado && String(usuarioLogado.id) === String(id)) {
        showToast('Você não pode excluir o próprio usuário logado.', 'error');
        return;
    }

    const confirmar = await confirmarAcao(
        'Deseja realmente excluir este usuário? Esta ação não poderá ser desfeita.'
    );

    if (!confirmar) return;

    const formData = new FormData();
    formData.append('id', id);

    const result = await apiRequest('excluir_usuario.php', {
        method: 'POST',
        body: formData
    });

    if (!result) return;

    showToast(result.message, result.success ? 'success' : 'error');

    if (result.success) {
        renderSettingsData();
    }
}
function formatarTipoItem(tipo) {
    if (tipo === 'Peca') return 'Peça';
    if (tipo === 'Mao de obra') return 'Mão de obra';
    return tipo;
}
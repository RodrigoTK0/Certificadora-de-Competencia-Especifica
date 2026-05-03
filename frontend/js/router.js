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
        const response = await fetch('http://localhost/Certificadora-de-Competencia-Especifica/backend/routes/ordens.php');
        const orders = await response.json();
        const dashboardResponse = await fetch('http://localhost/Certificadora-de-Competencia-Especifica/backend/routes/dashboard.php');
        const dashboardData = await dashboardResponse.json();

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
        const response = await fetch('http://localhost/Certificadora-de-Competencia-Especifica/backend/routes/clientes.php');
        const clients = await response.json();

        tbody.innerHTML = clients.map(c => `
            <tr>
                <td><strong>${c.nome}</strong></td>
                <td>${c.telefone}</td>
                <td>${c.email}</td>
                <td>${c.veiculos || 'Nenhum veículo'}</td>
                <td>
                    <button class="btn glass" style="padding: 0.4rem;">
                        <i data-lucide="edit" style="width: 16px;"></i>
                    </button>
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
        const response = await fetch('http://localhost/Certificadora-de-Competencia-Especifica/backend/routes/veiculos.php');
        const vehicles = await response.json();

        tbody.innerHTML = vehicles.map(v => `
            <tr>
                <td><strong style="background: white; color: black; padding: 2px 6px; border-radius: 4px; font-family: monospace;">${v.placa}</strong></td>
                <td>${v.modelo}</td>
                <td>${v.marca}</td>
                <td>${v.cliente_nome}</td>
                <td>
                    <button class="btn glass" style="padding: 0.4rem;">
                        <i data-lucide="edit" style="width: 16px;"></i>
                    </button>
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
        const response = await fetch('http://localhost/Certificadora-de-Competencia-Especifica/backend/routes/ordens.php');
        const orders = await response.json();

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

                        <button class="btn glass" onclick="verItensOrdem(${o.id})">
                            Ver Itens
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
async function renderReportsData() {

    try {

        const response = await fetch(
            'http://localhost/Certificadora-de-Competencia-Especifica/backend/routes/relatorios.php'
        );

        const data = await response.json();

        document.getElementById('report-clientes').textContent = data.total_clientes;

        document.getElementById('report-veiculos').textContent = data.total_veiculos;

        document.getElementById('report-abertas').textContent = data.ordens_abertas;

        document.getElementById('report-andamento').textContent = data.ordens_andamento;

        document.getElementById('report-concluidas').textContent = data.ordens_concluidas;

        document.getElementById('report-faturamento').textContent =
            `R$ ${Number(data.faturamento).toFixed(2).replace('.', ',')}`;

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

            const response = await fetch('http://localhost/Certificadora-de-Competencia-Especifica/backend/routes/login.php', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            alert(result.message);

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

    const response = await fetch(
        'http://localhost/Certificadora-de-Competencia-Especifica/backend/routes/atualizar_status_ordem.php',
        {
            method: 'POST',
            body: formData
        }
    );

    const result = await response.json();

    if (result.success) {
        renderOrdersData();
        renderDashboardData();
    } else {
        alert(result.message);
    }
}
async function abrirAdicionarItem(ordemId) {
    const descricao = prompt('Descrição do item:');
    if (!descricao) return;

    const tipo = prompt('Tipo do item: Peca ou Mao de obra');
    if (!tipo) return;

    const valor = prompt('Valor do item:');
    if (!valor) return;

    const formData = new FormData();
    formData.append('ordem_id', ordemId);
    formData.append('descricao', descricao);
    formData.append('tipo', tipo);
    formData.append('valor', valor.replace(',', '.'));

    const response = await fetch('http://localhost/Certificadora-de-Competencia-Especifica/backend/routes/cadastrar_item_ordem.php', {
        method: 'POST',
        body: formData
    });

    const result = await response.json();

    alert(result.message);

    if (result.success) {
        renderOrdersData();
        renderDashboardData();
    }
}
async function verItensOrdem(ordemId) {
    const response = await fetch(`http://localhost/Certificadora-de-Competencia-Especifica/backend/routes/listar_itens_ordem.php?ordem_id=${ordemId}`);
    const itens = await response.json();

    if (itens.length === 0) {
        alert('Nenhum item cadastrado nesta ordem.');
        return;
    }

    let mensagem = `Itens da Ordem #${String(ordemId).padStart(3, '0')}:\n\n`;
    let total = 0;

    itens.forEach(item => {
        const valor = Number(item.valor);
        total += valor;

        mensagem += `${item.tipo}: ${item.descricao} - R$ ${valor.toFixed(2).replace('.', ',')}\n`;
    });

    mensagem += `\nTotal dos itens: R$ ${total.toFixed(2).replace('.', ',')}`;

    alert(mensagem);
}
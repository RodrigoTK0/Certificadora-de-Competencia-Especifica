// Configura as rotas e exibe as telas conforme o link (#hash)

const views = {
    'login': { title: 'Entrar - SOS', el: 'view-login', layout: false },
    'dashboard': { title: 'Dashboard - SOS', el: 'view-dashboard', layout: true },
    'clients': { title: 'Meus Clientes - SOS', el: 'view-clients', layout: true },
    'vehicles': { title: 'Veículos - SOS', el: 'view-vehicles', layout: true },
    'orders': { title: 'Ordens - SOS', el: 'view-dashboard', layout: true },
    'new-order': { title: 'Nova O.S. - SOS', el: 'view-new-order', layout: true }
};

// Gerencia a navegação
function navigate() {
    const hash = window.location.hash.substring(1) || 'login';
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

    // Atualiza ícones Lucide
    if (window.lucide) lucide.createIcons();
}

// --- Funções para preencher as tabelas ---

function renderDashboardData() {
    const tbody = document.querySelector('#table-recent-orders tbody');
    if (!tbody) return;
    
    const orders = [
        { id: '001', client: 'João Silva', vehicle: 'Toyota Corolla', status: 'Em Aberto', badge: 'warning', price: 'R$ 450,00' },
        { id: '002', client: 'Maria Souza', vehicle: 'Honda Civic', status: 'Em Progresso', badge: 'info', price: 'R$ 1.200,00' },
        { id: '003', client: 'Carlos Lima', vehicle: 'Ford Ka', status: 'Concluído', badge: 'success', price: 'R$ 280,00' },
    ];
    
    tbody.innerHTML = orders.map(o => `
        <tr>
            <td><strong>#${o.id}</strong></td>
            <td>${o.client}</td>
            <td>${o.vehicle}</td>
            <td><span class="badge badge-${o.badge}">${o.status}</span></td>
            <td>${o.price}</td>
            <td>
                <button class="btn glass" style="padding: 0.4rem;"><i data-lucide="eye" style="width: 16px;"></i></button>
            </td>
        </tr>
    `).join('');
}

function renderClientsData() {
    const tbody = document.querySelector('#table-clients tbody');
    if (!tbody) return;
    
    const clients = [
        { name: 'João Silva', phone: '(11) 98888-7777', email: 'joao@email.com', vehicles: 1 },
        { name: 'Maria Souza', phone: '(11) 97777-6666', email: 'maria@email.com', vehicles: 2 },
        { name: 'Carlos Lima', phone: '(11) 96666-5555', email: 'carlos@email.com', vehicles: 1 },
    ];
    
    tbody.innerHTML = clients.map(c => `
        <tr>
            <td><strong>${c.name}</strong></td>
            <td>${c.phone}</td>
            <td>${c.email}</td>
            <td>${c.vehicles} veículo(s)</td>
            <td>
                <button class="btn glass" style="padding: 0.4rem;"><i data-lucide="edit" style="width: 16px;"></i></button>
            </td>
        </tr>
    `).join('');
}

function renderVehiclesData() {
    const tbody = document.querySelector('#table-vehicles tbody');
    if (!tbody) return;
    
    const vehicles = [
        { plate: 'ABC-1234', model: 'Corolla', brand: 'Toyota', owner: 'João Silva' },
        { plate: 'XYZ-9876', model: 'Civic', brand: 'Honda', owner: 'Maria Souza' },
        { plate: 'DEF-4567', model: 'Ka', brand: 'Ford', owner: 'Carlos Lima' },
    ];
    
    tbody.innerHTML = vehicles.map(v => `
        <tr>
            <td><strong style="background: white; color: black; padding: 2px 6px; border-radius: 4px; font-family: monospace;">${v.plate}</strong></td>
            <td>${v.model}</td>
            <td>${v.brand}</td>
            <td>${v.owner}</td>
            <td>
                <button class="btn glass" style="padding: 0.4rem;"><i data-lucide="edit" style="width: 16px;"></i></button>
            </td>
        </tr>
    `).join('');
}

// Inicializa a navegação e eventos
window.addEventListener('hashchange', navigate);
window.addEventListener('load', () => {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            window.location.hash = '#dashboard';
        });
    }
    navigate();
});

const routes = {
    'login': {
        title: 'Login - SOS',
        render: () => `
            <div class="auth-container">
                <div class="glass" style="width: 100%; max-width: 400px; padding: 2.5rem;">
                    <div class="brand" style="justify-content: center; margin-bottom: 2rem;">
                        <div class="brand-icon"><i data-lucide="wrench"></i></div>
                        <h1 class="brand-name" style="font-size: 1.5rem;">Sistema O.S.</h1>
                    </div>
                    <form id="login-form">
                        <div class="form-group">
                            <label>E-mail</label>
                            <input type="email" placeholder="seu@email.com" value="admin@oficina.com" required>
                        </div>
                        <div class="form-group">
                            <label>Senha</label>
                            <input type="password" placeholder="••••••••" value="123456" required>
                        </div>
                        <button type="submit" class="btn btn-primary" style="width: 100%; justify-content: center; margin-top: 1rem;">
                            Entrar
                        </button>
                    </form>
                </div>
            </div>
        `
    },
    'dashboard': {
        title: 'Dashboard - SOS',
        render: () => `
            <div class="main-layout">
                ${renderSidebar('dashboard')}
                <main class="content">
                    <div class="header-row">
                        <div>
                            <h1 style="font-size: 2rem;">Bem-vindo, Jose!</h1>
                            <p style="color: var(--text-muted);">Aqui está o resumo da sua oficina hoje.</p>
                        </div>
                        <button class="btn btn-primary" onclick="window.location.hash = '#new-order'">
                            <i data-lucide="plus"></i> Nova Ordem
                        </button>
                    </div>

                    <div class="stats-grid">
                        <div class="glass stat-card">
                            <div class="stat-icon" style="background: rgba(59, 130, 246, 0.1); color: var(--primary);">
                                <i data-lucide="clipboard-list"></i>
                            </div>
                            <div class="stat-info">
                                <h3>12</h3>
                                <p>Ordens Abertas</p>
                            </div>
                        </div>
                        <div class="glass stat-card">
                            <div class="stat-icon" style="background: rgba(34, 197, 94, 0.1); color: var(--success);">
                                <i data-lucide="check-circle"></i>
                            </div>
                            <div class="stat-info">
                                <h3>45</h3>
                                <p>Concluídas</p>
                            </div>
                        </div>
                        <div class="glass stat-card">
                            <div class="stat-icon" style="background: rgba(245, 158, 11, 0.1); color: var(--warning);">
                                <i data-lucide="users"></i>
                            </div>
                            <div class="stat-info">
                                <h3>128</h3>
                                <p>Clientes Ativos</p>
                            </div>
                        </div>
                    </div>

                    <div class="glass" style="padding: 1.5rem;">
                        <h2 style="margin-bottom: 1.5rem; font-size: 1.25rem;">Últimas Ordens de Serviço</h2>
                        <div class="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Nº OS</th>
                                        <th>Cliente</th>
                                        <th>Veículo</th>
                                        <th>Status</th>
                                        <th>Valor</th>
                                        <th>Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${renderMockOrders()}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>
        `
    },
    'clients': {
        title: 'Clientes - SOS',
        render: () => `
            <div class="main-layout">
                ${renderSidebar('clients')}
                <main class="content">
                    <div class="header-row">
                        <h1 style="font-size: 2rem;">Clientes</h1>
                        <button class="btn btn-primary" onclick="openModal('client')">
                            <i data-lucide="user-plus"></i> Novo Cliente
                        </button>
                    </div>
                    
                    <div class="glass" style="padding: 1.5rem; margin-bottom: 1.5rem;">
                        <div style="display: flex; gap: 1rem;">
                            <input type="text" placeholder="Buscar cliente por nome ou CPF..." style="flex: 1;">
                            <button class="btn glass"><i data-lucide="search"></i></button>
                        </div>
                    </div>

                    <div class="glass" style="padding: 1.5rem;">
                        <div class="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Nome</th>
                                        <th>Telefone</th>
                                        <th>E-mail</th>
                                        <th>Veículos</th>
                                        <th>Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${renderMockClients()}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>
        `
    },
    'vehicles': {
        title: 'Veículos - SOS',
        render: () => `
            <div class="main-layout">
                ${renderSidebar('vehicles')}
                <main class="content">
                    <div class="header-row">
                        <h1 style="font-size: 2rem;">Veículos</h1>
                        <button class="btn btn-primary" onclick="openModal('vehicle')">
                            <i data-lucide="plus"></i> Novo Veículo
                        </button>
                    </div>

                    <div class="glass" style="padding: 1.5rem;">
                        <div class="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Placa</th>
                                        <th>Modelo</th>
                                        <th>Marca</th>
                                        <th>Proprietário</th>
                                        <th>Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${renderMockVehicles()}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>
        `
    },
    'orders': {
        title: 'Ordens de Serviço - SOS',
        render: () => `
            <div class="main-layout">
                ${renderSidebar('orders')}
                <main class="content">
                    <div class="header-row">
                        <h1 style="font-size: 2rem;">Ordens de Serviço</h1>
                        <button class="btn btn-primary" onclick="window.location.hash = '#new-order'">
                            <i data-lucide="plus"></i> Nova Ordem
                        </button>
                    </div>
                    
                    <div class="glass" style="padding: 1.5rem;">
                        <div class="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Nº OS</th>
                                        <th>Cliente</th>
                                        <th>Veículo</th>
                                        <th>Status</th>
                                        <th>Total</th>
                                        <th>Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${renderMockOrders()}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>
        `
    },
    'new-order': {
        title: 'Nova O.S. - SOS',
        render: () => `
            <div class="main-layout">
                ${renderSidebar('orders')}
                <main class="content">
                    <div class="header-row">
                        <h1 style="font-size: 2rem;">Nova Ordem de Serviço</h1>
                        <button class="btn glass" onclick="window.location.hash = '#dashboard'">Cancelar</button>
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 400px; gap: 2rem;">
                        <div class="glass" style="padding: 2rem;">
                            <h3 style="margin-bottom: 1.5rem;">Informações Gerais</h3>
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
                                <div class="form-group">
                                    <label>Cliente</label>
                                    <select id="os-client">
                                        <option>Selecione um cliente...</option>
                                        <option>João Silva</option>
                                        <option>Maria Souza</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label>Veículo</label>
                                    <select id="os-vehicle">
                                        <option>Selecione um veículo...</option>
                                        <option>Toyota Corolla (ABC-1234)</option>
                                        <option>Honda Civic (XYZ-9876)</option>
                                    </select>
                                </div>
                            </div>
                            <div class="form-group">
                                <label>Descrição do Problema</label>
                                <textarea rows="4" placeholder="Descreva os sintomas relatados pelo cliente..."></textarea>
                            </div>

                            <h3 style="margin: 2rem 0 1.5rem;">Peças e Serviços</h3>
                            <div id="items-list" style="display: flex; flex-direction: column; gap: 1rem;">
                                <div style="display: flex; gap: 1rem; align-items: flex-end;">
                                    <div style="flex: 2;">
                                        <label style="font-size: 0.8rem; color: var(--text-muted);">Descrição</label>
                                        <input type="text" placeholder="Ex: Óleo 5W30">
                                    </div>
                                    <div style="flex: 0.5;">
                                        <label style="font-size: 0.8rem; color: var(--text-muted);">Qtd</label>
                                        <input type="number" value="1">
                                    </div>
                                    <div style="flex: 1;">
                                        <label style="font-size: 0.8rem; color: var(--text-muted);">Preço Unit.</label>
                                        <input type="text" placeholder="R$ 0,00">
                                    </div>
                                    <button class="btn btn-primary" style="padding: 0.75rem;"><i data-lucide="plus"></i></button>
                                </div>
                            </div>
                        </div>

                        <div class="glass" style="padding: 2rem; height: fit-content;">
                            <h3 style="margin-bottom: 1.5rem;">Resumo de Valores</h3>
                            <div style="display: flex; justify-content: space-between; margin-bottom: 1rem;">
                                <span color="var(--text-muted)">Total Peças:</span>
                                <span>R$ 0,00</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; margin-bottom: 1rem;">
                                <span color="var(--text-muted)">Total Mão de Obra:</span>
                                <span>R$ 0,00</span>
                            </div>
                            <hr style="border: 0; border-top: 1px solid var(--border); margin: 1rem 0;">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 2rem;">
                                <strong style="font-size: 1.25rem;">Total Geral:</strong>
                                <strong style="font-size: 1.25rem; color: var(--primary);">R$ 0,00</strong>
                            </div>
                            <button class="btn btn-primary" style="width: 100%; justify-content: center;" onclick="alert('O.S. Salva com sucesso!')">
                                <i data-lucide="save"></i> Salvar Ordem
                            </button>
                        </div>
                    </div>
                </main>
            </div>
        `
    }
};

function renderSidebar(active) {
    return `
        <aside class="sidebar">
            <div class="brand">
                <div class="brand-icon"><i data-lucide="wrench"></i></div>
                <h2 class="brand-name">Sistema O.S.</h2>
            </div>
            <nav>
                <ul class="nav-links">
                    <li><a href="#dashboard" class="nav-link ${active === 'dashboard' ? 'active' : ''}"><i data-lucide="layout-dashboard"></i> <span>Dashboard</span></a></li>
                    <li><a href="#clients" class="nav-link ${active === 'clients' ? 'active' : ''}"><i data-lucide="users"></i> <span>Clientes</span></a></li>
                    <li><a href="#vehicles" class="nav-link ${active === 'vehicles' ? 'active' : ''}"><i data-lucide="car"></i> <span>Veículos</span></a></li>
                    <li><a href="#orders" class="nav-link ${active === 'orders' ? 'active' : ''}"><i data-lucide="file-text"></i> <span>Ordens S.V.</span></a></li>
                    <li><a href="#settings" class="nav-link ${active === 'settings' ? 'active' : ''}"><i data-lucide="settings"></i> <span>Configurações</span></a></li>
                </ul>
            </nav>
            <div style="margin-top: auto;">
                <a href="#login" class="nav-link" style="color: var(--danger);"><i data-lucide="log-out"></i> <span>Sair</span></a>
            </div>
        </aside>
    `;
}

function renderMockOrders() {
    const orders = [
        { id: '001', client: 'João Silva', vehicle: 'Toyota Corolla', status: 'Em Aberto', badge: 'warning', price: 'R$ 450,00' },
        { id: '002', client: 'Maria Souza', vehicle: 'Honda Civic', status: 'Em Progresso', badge: 'info', price: 'R$ 1.200,00' },
        { id: '003', client: 'Carlos Lima', vehicle: 'Ford Ka', status: 'Concluído', badge: 'success', price: 'R$ 280,00' },
    ];
    return orders.map(o => `
        <tr>
            <td><strong>#${o.id}</strong></td>
            <td>${o.client}</td>
            <td>${o.vehicle}</td>
            <td><span class="badge badge-${o.badge}">${o.status}</span></td>
            <td>${o.price}</td>
            <td>
                <button class="btn glass" style="padding: 0.4rem;"><i data-lucide="eye" style="width: 16px;"></i></button>
                <button class="btn glass" style="padding: 0.4rem;"><i data-lucide="edit-3" style="width: 16px;"></i></button>
            </td>
        </tr>
    `).join('');
}

function renderMockClients() {
    const clients = [
        { name: 'João Silva', phone: '(11) 98888-7777', email: 'joao@email.com', vehicles: 1 },
        { name: 'Maria Souza', phone: '(11) 97777-6666', email: 'maria@email.com', vehicles: 2 },
        { name: 'Carlos Lima', phone: '(11) 96666-5555', email: 'carlos@email.com', vehicles: 1 },
    ];
    return clients.map(c => `
        <tr>
            <td><strong>${c.name}</strong></td>
            <td>${c.phone}</td>
            <td>${c.email}</td>
            <td>${c.vehicles} veículo(s)</td>
            <td>
                <button class="btn glass" style="padding: 0.4rem;"><i data-lucide="edit" style="width: 16px;"></i></button>
                <button class="btn glass" style="padding: 0.4rem; color: var(--danger);"><i data-lucide="trash-2" style="width: 16px;"></i></button>
            </td>
        </tr>
    `).join('');
}

function renderMockVehicles() {
    const vehicles = [
        { plate: 'ABC-1234', model: 'Corolla', brand: 'Toyota', owner: 'João Silva' },
        { plate: 'XYZ-9876', model: 'Civic', brand: 'Honda', owner: 'Maria Souza' },
        { plate: 'DEF-4567', model: 'Ka', brand: 'Ford', owner: 'Carlos Lima' },
    ];
    return vehicles.map(v => `
        <tr>
            <td><strong style="background: white; color: black; padding: 2px 6px; border-radius: 4px; font-family: monospace;">${v.plate}</strong></td>
            <td>${v.model}</td>
            <td>${v.brand}</td>
            <td>${v.owner}</td>
            <td>
                <button class="btn glass" style="padding: 0.4rem;"><i data-lucide="edit" style="width: 16px;"></i></button>
                <button class="btn glass" style="padding: 0.4rem; color: var(--danger);"><i data-lucide="trash-2" style="width: 16px;"></i></button>
            </td>
        </tr>
    `).join('');
}

function navigate() {
    const hash = window.location.hash.substring(1) || 'login';
    const route = routes[hash] || routes['login'];
    
    document.title = route.title;
    document.getElementById('app').innerHTML = route.render();
    
    // Re-initialize icons
    lucide.createIcons();
    
    // Bind events
    if (hash === 'login') {
        document.getElementById('login-form').addEventListener('submit', (e) => {
            e.preventDefault();
            window.location.hash = '#dashboard';
        });
    }
}

window.addEventListener('hashchange', navigate);
window.addEventListener('load', navigate);

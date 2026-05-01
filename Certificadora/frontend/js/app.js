// Global Application Logic

function openModal(type) {
    const modal = document.getElementById('modal-container');
    const content = document.getElementById('modal-content');
    
    if (type === 'client') {
        content.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
                <h2>Novo Cliente</h2>
                <button class="btn glass" onclick="closeModal()"><i data-lucide="x"></i></button>
            </div>
            <form onsubmit="event.preventDefault(); alert('Cliente cadastrado!'); closeModal();">
                <div class="form-group">
                    <label>Nome Completo</label>
                    <input type="text" required>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                    <div class="form-group">
                        <label>CPF/CNPJ</label>
                        <input type="text">
                    </div>
                    <div class="form-group">
                        <label>Telefone</label>
                        <input type="text" required>
                    </div>
                </div>
                <div class="form-group">
                    <label>E-mail</label>
                    <input type="email">
                </div>
                <div class="form-group">
                    <label>Endereço</label>
                    <input type="text">
                </div>
                <div style="display: flex; justify-content: flex-end; gap: 1rem; margin-top: 2rem;">
                    <button type="button" class="btn glass" onclick="closeModal()">Cancelar</button>
                    <button type="submit" class="btn btn-primary">Salvar Cliente</button>
                </div>
            </form>
        `;
    } else if (type === 'vehicle') {
        content.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
                <h2>Novo Veículo</h2>
                <button class="btn glass" onclick="closeModal()"><i data-lucide="x"></i></button>
            </div>
            <form onsubmit="event.preventDefault(); alert('Veículo cadastrado!'); closeModal();">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                    <div class="form-group">
                        <label>Placa</label>
                        <input type="text" placeholder="ABC-1234" required>
                    </div>
                    <div class="form-group">
                        <label>Proprietário</label>
                        <select required>
                            <option value="">Selecione...</option>
                            <option>João Silva</option>
                            <option>Maria Souza</option>
                        </select>
                    </div>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                    <div class="form-group">
                        <label>Marca</label>
                        <input type="text" placeholder="Ex: Toyota" required>
                    </div>
                    <div class="form-group">
                        <label>Modelo</label>
                        <input type="text" placeholder="Ex: Corolla" required>
                    </div>
                </div>
                <div class="form-group">
                    <label>Cor / Ano</label>
                    <input type="text" placeholder="Ex: Prata / 2020">
                </div>
                <div style="display: flex; justify-content: flex-end; gap: 1rem; margin-top: 2rem;">
                    <button type="button" class="btn glass" onclick="closeModal()">Cancelar</button>
                    <button type="submit" class="btn btn-primary">Salvar Veículo</button>
                </div>
            </form>
        `;
    }
    
    modal.style.display = 'flex';
    lucide.createIcons();
}

function closeModal() {
    document.getElementById('modal-container').style.display = 'none';
}

// Close modal on outside click
window.onclick = function(event) {
    const modal = document.getElementById('modal-container');
    if (event.target == modal) {
        closeModal();
    }
}

// Placeholder for future state management
const AppState = {
    user: {
        name: 'Jose Garcia',
        role: 'Admin'
    },
    orders: [],
    clients: []
};

console.log('SOS Application Initialized');

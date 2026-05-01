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
    }
}

// Fecha a janela modal
function closeModal() {
    document.getElementById('modal-container').style.display = 'none';
}

// Fecha se clicar fora da área branca do modal
window.onclick = function(event) {
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

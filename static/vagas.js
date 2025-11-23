document.addEventListener('DOMContentLoaded', () => {

    /* ============================================= */
    /* 1. LÓGICA DE ENVIO DO FORMULÁRIO (CRIAR VAGA) */
    /* ============================================= */
    const form = document.querySelector('form'); 
     
    const token = localStorage.getItem('token');

    if (!token) {
        alert("Você precisa estar logado!");
        window.location.href = 'login.html';
        return;
    }

    
    // Verifica se o formulário existe na página antes de adicionar o listener
    if (form) {
        form.addEventListener('submit', async (event) => {
            event.preventDefault(); 
      
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch('http://localhost:8080/vaga/criar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });

            // Ler a resposta como texto e tentar parsear JSON
            const text = await response.text();
            let responseData = {};
            try {
                responseData = text ? JSON.parse(text) : {};
            } catch (e) {
                console.warn("Resposta não é JSON:", text);
            }

            if (response.ok) {
                alert('Vaga salva com sucesso!');
                form.reset();
                window.location.href = 'http://127.0.0.1:5500/CSS/central.html';
            } else {
                // Mostra o erro do servidor se existir
                const msg = responseData.message || response.statusText || 'Erro desconhecido';
                alert(`Erro ao salvar: ${msg}`);
            }

        } catch (error) {
            console.error('Erro de rede ou servidor:', error);
            alert('Erro de conexão. Tente novamente.');
        }
    });
}

    /* ============================================= */
    /* 2. LÓGICA DO MENU COLAPSÁVEL (DROPDOWN) */
    /* ============================================= */

    const btnNavegacao = document.getElementById('btn-navegacao');
    const menuOpcoes = document.getElementById('menu-opcoes');
    // Busca o ícone de forma mais explícita e segura
    const iconeToggle = document.querySelector('#btn-navegacao .icone-toggle'); 

    // VERIFICAÇÃO: Garante que TODOS os 3 elementos existam antes de ligar a funcionalidade
    if (btnNavegacao && menuOpcoes && iconeToggle) {
        
        // Estado inicial: Garante que o menu esteja fechado
        menuOpcoes.classList.add('menu-escondido');
        iconeToggle.style.transform = 'rotate(0deg)'; // Seta para baixo

        btnNavegacao.addEventListener('click', (event) => {
            // Impede que o clique no botão se propague para o 'document'
            event.stopPropagation(); 
            
            // Alterna a classe que esconde/mostra o menu
            menuOpcoes.classList.toggle('menu-escondido');

            // Gira o ícone para indicar o estado (aberto ou fechado)
            if (menuOpcoes.classList.contains('menu-escondido')) {
                iconeToggle.style.transform = 'rotate(0deg)'; // Fechado (Seta para baixo)
            } else {
                iconeToggle.style.transform = 'rotate(180deg)'; // Aberto (Seta para cima)
            }
        });

        /* Fechar o menu se o usuário clicar em qualquer outro lugar da tela */
        document.addEventListener('click', (event) => {
            const isClickInsideButton = btnNavegacao.contains(event.target);
            const isClickInsideMenu = menuOpcoes.contains(event.target);

            // Se o clique foi fora do botão E fora do menu, e o menu NÃO está escondido...
            if (!isClickInsideButton && !isClickInsideMenu && !menuOpcoes.classList.contains('menu-escondido')) {
                // ... feche-o
                menuOpcoes.classList.add('menu-escondido');
                iconeToggle.style.transform = 'rotate(0deg)';
            }
        });
    } else {
        console.warn("AVISO: Um ou mais elementos do Menu Colapsável não foram encontrados. O menu pode não funcionar corretamente.");
    }
        });
    


    
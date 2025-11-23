document.addEventListener('DOMContentLoaded', () => {
    const btnNavegacao = document.getElementById('btn-navegacao');
    const menuOpcoes = document.getElementById('menu-opcoes');
    const iconeToggle = document.querySelector('#btn-navegacao .icone-toggle'); 

    if (btnNavegacao && menuOpcoes && iconeToggle) {
        
        // Garante que o menu está escondido e o ícone na posição inicial ao carregar
        menuOpcoes.classList.add('menu-escondido');
        iconeToggle.style.transform = 'rotate(0deg)'; 

        // 1. Listener para o clique no botão do menu
        btnNavegacao.addEventListener('click', (event) => {
            event.stopPropagation(); // Impede que o clique se propague para o document
            
            menuOpcoes.classList.toggle('menu-escondido');

            // Alterna a rotação do ícone
            if (menuOpcoes.classList.contains('menu-escondido')) {
                iconeToggle.style.transform = 'rotate(0deg)';
            } else {
                iconeToggle.style.transform = 'rotate(180deg)';
            }
        });

        // 2. Listener para fechar o menu ao clicar fora dele
        document.addEventListener('click', (event) => {
            const isClickInsideButton = btnNavegacao.contains(event.target);
            const isClickInsideMenu = menuOpcoes.contains(event.target);

            if (!isClickInsideButton && !isClickInsideMenu && !menuOpcoes.classList.contains('menu-escondido')) {
                menuOpcoes.classList.add('menu-escondido');
                iconeToggle.style.transform = 'rotate(0deg)';
            }
        });
    } else {
        console.warn("AVISO: Um ou mais elementos do Menu Colapsável não foram encontrados.");
    }
    });
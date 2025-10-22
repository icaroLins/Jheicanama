document.addEventListener('DOMContentLoaded', () => {
    const listaVagasElement = document.getElementById('lista-de-vagas');
    
    async function buscarVagas() {
        // Limpa o conteúdo inicial ("Carregando vagas...")
        listaVagasElement.innerHTML = ''; 

        try {
            // Endpoint para buscar as vagas prontas
            const response = await fetch('/buscar-vagas'); 

            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }
            const vagas = await response.json(); 
            if (vagas.length === 0) {
                listaVagasElement.innerHTML = '<p class="mensagem-alerta">Nenhuma vaga disponível no momento.</p>';
                return;
            }
            
            vagas.forEach(vaga => {
                const cardVaga = criarCardVaga(vaga);
                listaVagasElement.appendChild(cardVaga);
            });

        } catch (error) {
            console.error('Erro ao buscar as vagas:', error);
            listaVagasElement.innerHTML = '<p class="mensagem-erro">Houve um erro ao carregar as vagas. Tente novamente mais tarde.</p>';
        }
    }

    // Função que constrói o cartão de vaga
    function criarCardVaga(vaga) {
        // 1. Cria um link (<a>) que será um elemento e tornará clicável
        const linkCard = document.createElement('a');
        
        linkCard.href = `detalhes_vaga.html?id=${vaga.id}`; 
        linkCard.classList.add('card-vaga-link'); 

        // 2. Cria o conteúdo visual do cartão (div)
        const cardContent = document.createElement('div');
        cardContent.classList.add('card-vaga');

        // Formatação simples da remuneração (Apenas para exibição)
        const remuneracaoFormatada = parseFloat(vaga.wage).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 2
        });

        // 3. Define o HTML interno do cartão 
        cardContent.innerHTML = `
            <div class="info-principal">
                <h3>${vaga.title || 'Título Não Informado'}</h3>
                <p class="area-vaga">Área: ${vaga.area || 'Não Especificada'}</p>
                <p class="remuneracao-vaga">Remuneração: <strong>${remuneracaoFormatada}</strong></p>
                <p class="descricao-curta">${vaga.description ? vaga.description.substring(0, 100) + '...' : 'Descrição indisponível'}</p>
            </div>
            `;

        // Anexa o conteúdo do cartão ao link
        linkCard.appendChild(cardContent);
        return linkCard;
    }

    // Inicia a busca assim que a página é carregada
    buscarVagas();



    const btnNavegacao = document.getElementById('btn-navegacao');
    const menuOpcoes = document.getElementById('menu-opcoes');
    const iconeToggle = document.querySelector('#btn-navegacao .icone-toggle'); 

    // VERIFICAÇÃO: Garante que TODOS os 3 elementos existam antes de ligar a funcionalidade
    if (btnNavegacao && menuOpcoes && iconeToggle) {
        
        // Estado inicial: Garante que o menu esteja fechado
        menuOpcoes.classList.add('menu-escondido');
        iconeToggle.style.transform = 'rotate(0deg)'; // Seta para baixo

        btnNavegacao.addEventListener('click', (event) => {
            // Adiciona stopPropagation para evitar o "abre e fecha" instantâneo
            event.stopPropagation(); 
            
            menuOpcoes.classList.toggle('menu-escondido');

            // Gira o ícone para indicar o estado (aberto ou fechado)
            if (menuOpcoes.classList.contains('menu-escondido')) {
                iconeToggle.style.transform = 'rotate(0deg)';
            } else {
                iconeToggle.style.transform = 'rotate(180deg)';
            }
        });

        /* Fechar o menu se o usuário clicar em qualquer outro lugar da tela */
        document.addEventListener('click', (event) => {
            const isClickInsideButton = btnNavegacao.contains(event.target);
            const isClickInsideMenu = menuOpcoes.contains(event.target);

            if (!isClickInsideButton && !isClickInsideMenu && !menuOpcoes.classList.contains('menu-escondido')) {
                // Se o clique foi fora de ambos e o menu está aberto, feche-o
                menuOpcoes.classList.add('menu-escondido');
                iconeToggle.style.transform = 'rotate(0deg)';
            }
        });
    } else {
        console.warn("AVISO CRÍTICO: Um ou mais elementos do Menu Colapsável não foram encontrados.");
    }
});
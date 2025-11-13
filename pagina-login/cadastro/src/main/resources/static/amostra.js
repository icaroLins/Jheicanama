document.addEventListener('DOMContentLoaded', () => {
    const listaVagasElement = document.getElementById('lista-de-vagas');
    const CHAVE_RECUSADAS = 'vagasRecusadas';
    const userId = localStorage.getItem('userId');

    const token = localStorage.getItem("token"); // ou sessionStorage
    if (!token) {
        alert("Você precisa estar logado!");
        return;
    }

    // Função para obter as IDs das vagas recusadas
    function getVagasRecusadas() {
        const recusadas = localStorage.getItem(CHAVE_RECUSADAS);
        return recusadas ? new Set(JSON.parse(recusadas)) : new Set();
    }

    // Função para salvar as IDs das vagas recusadas
    function salvarVagasRecusadas(recusadasSet) {
        localStorage.setItem(CHAVE_RECUSADAS, JSON.stringify(Array.from(recusadasSet)));
    }


    // FUNÇÕES Dos  boTÕES
    function handleCandidatar(event, idVaga) {

        event.stopPropagation();
        event.preventDefault();

        const btnCandidatar = event.target;
        btnCandidatar.disabled = true;
        btnCandidatar.textContent = 'Enviando...';

        fetch(`http://localhost:8080/vagas/${idVaga}/candidatar`, { // Endpoint SUGERIDO: POST
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`, // Envia o token
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ vagaId: idVaga })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Falha ao registrar candidatura. Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                alert(`Candidatura para a vaga ID: ${idVaga} enviada com sucesso! Verifique seu perfil.`);

                const cardContainer = btnCandidatar.closest('.card-container');
                const cardVaga = cardContainer ? cardContainer.querySelector('.card-vaga') : null;

                if (cardContainer && cardVaga) {
                    // Se a vaga NÃO estava recusada, a remove da lista de disponíveis
                    if (!cardVaga.classList.contains('vaga-recusada')) {
                        cardContainer.remove();
                    }
                    // Se estava recusada, reverte a recusa para que ela fique "normal" na lista, mas com o botão de Candidatar desabilitado/alterado
                    else {
                        reverterRecusa(cardContainer, idVaga);
                        // Mantém o botão de candidatura no estado final de sucesso (e não de recusa revertida)
                        btnCandidatar.disabled = false;
                        btnCandidatar.textContent = 'Candidatado';
                    }
                }
            })
            .catch(error => {
                console.error('Erro ao candidatar:', error);
                alert(`Erro ao enviar candidatura: ${error.message || 'Tente novamente.'}`);
                btnCandidatar.disabled = false;
                btnCandidatar.textContent = 'Candidatar';
            });
    }

    function handleRecusar(event, idVaga) {
        event.stopPropagation();
        event.preventDefault();

        const cardContainer = event.target.closest('.card-container');
        const cardVaga = cardContainer ? cardContainer.querySelector('.card-vaga') : null;

        if (!cardVaga) return;

        if (!cardVaga.classList.contains('vaga-recusada')) {

            cardVaga.classList.add('vaga-recusada');
            listaVagasElement.appendChild(cardContainer);

            const recusadas = getVagasRecusadas();
            recusadas.add(String(idVaga));
            salvarVagasRecusadas(recusadas);

            console.log(`Vaga ID ${idVaga} recusada e movida para o final.`);
        } else {
            reverterRecusa(cardContainer, idVaga);
        }
    }

    function reverterRecusa(cardContainer, idVaga) {
        if (!cardContainer) return;

        const cardVaga = cardContainer.querySelector('.card-vaga');

        if (!cardVaga) return;

        cardVaga.classList.remove('vaga-recusada');

        const recusadas = getVagasRecusadas();
        recusadas.delete(String(idVaga));
        salvarVagasRecusadas(recusadas);

        listaVagasElement.prepend(cardContainer);

        console.log(`Vaga ID ${idVaga} teve a recusa revertida.`);
    }


    // BUSCA E RENDERIZAÇÃO

    async function buscarVagas() {
        listaVagasElement.innerHTML = '';
        const vagasRecusadasSet = getVagasRecusadas();
        let vagasDisponiveis = [];
        let vagasRecusadas = [];

        try {
            const response = await fetch('http://localhost:8080/vaga/listar',{
                method: "get",
                headers:{
                    'Authorization': `Bearer ${token}`, // Envia o token
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }
            const vagas = await response.json();

            if (vagas.length === 0) {
                listaVagasElement.innerHTML = '<p class="mensagem-alerta">Nenhuma vaga disponível no momento.</p>';
                return;
            }

            vagas.forEach(vaga => {
                if (vagasRecusadasSet.has(String(vaga.id))) {
                    vagasRecusadas.push(vaga);
                } else {
                    vagasDisponiveis.push(vaga);
                }
            });

            vagasDisponiveis.forEach(vaga => {
                const cardWrapper = criarCardVaga(vaga, false);
                listaVagasElement.appendChild(cardWrapper);
            });

            vagasRecusadas.forEach(vaga => {
                const cardWrapper = criarCardVaga(vaga, true);
                listaVagasElement.appendChild(cardWrapper);
            });


        } catch (error) {
            console.error('Erro ao buscar as vagas:', error);
            listaVagasElement.innerHTML = '<p class="mensagem-erro">Houve um erro ao carregar as vagas. Tente novamente mais tarde.</p>';
        }
    }

    // Função que constrói o cartão de vaga
    function criarCardVaga(vaga, isRecusada) {

        const cardWrapper = document.createElement('div');
        cardWrapper.classList.add('card-container');

        const cardVaga = document.createElement('div');
        cardVaga.classList.add('card-vaga');

        if (isRecusada) {
            cardVaga.classList.add('vaga-recusada');
        }

        const remuneracaoFormatada = parseFloat(vaga.wage || 0).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 2
        });

        cardVaga.innerHTML = `
            <div class="info-principal">
                <h3>${vaga.title || 'Título Não Informado'}</h3>
                <p class="area-vaga">Área: ${vaga.area || 'Não Especificada'}</p>
                <p class="remuneracao-vaga">Remuneração: <strong>${remuneracaoFormatada}</strong></p>
                <p class="descricao-curta">${vaga.description ? vaga.description.substring(0, 100) + '...' : 'Descrição indisponível'}</p>
            </div>
            <div class="botoes-acao-candidato">
                <button class="btn-acao btn-candidatar" data-id="${vaga.id}" title="A vaga será direcionada para o menu. 'Meus freelances'.">Candidatar</button>
            </div>
        `;

        cardWrapper.appendChild(cardVaga);

        // Adiciona event listeners aos botões
        cardVaga.querySelector('.btn-candidatar').addEventListener('click', (e) => handleCandidatar(e, vaga.id));
        

        return cardWrapper;
    }

    buscarVagas();


    // DROPDOWN (menu)

    const btnNavegacao = document.getElementById('btn-navegacao');
    const menuOpcoes = document.getElementById('menu-opcoes');
    const iconeToggle = document.querySelector('#btn-navegacao .icone-toggle');

    if (btnNavegacao && menuOpcoes && iconeToggle) {

        menuOpcoes.classList.add('menu-escondido');
        iconeToggle.style.transform = 'rotate(0deg)';

        btnNavegacao.addEventListener('click', (event) => {
            event.stopPropagation();

            menuOpcoes.classList.toggle('menu-escondido');

            if (menuOpcoes.classList.contains('menu-escondido')) {
                iconeToggle.style.transform = 'rotate(0deg)';
            } else {
                iconeToggle.style.transform = 'rotate(180deg)';
            }
        });

        document.addEventListener('click', (event) => {
            const isClickInsideButton = btnNavegacao.contains(event.target);
            const isClickInsideMenu = menuOpcoes.contains(event.target);

            if (!isClickInsideButton && !isClickInsideMenu && !menuOpcoes.classList.contains('menu-escondido')) {
                menuOpcoes.classList.add('menu-escondido');
                iconeToggle.style.transform = 'rotate(0deg)';
            }
        });
    } else {
        console.warn("AVISO CRÍTICO: Um ou mais elementos do Menu Colapsável não foram encontrados.");
    }
});
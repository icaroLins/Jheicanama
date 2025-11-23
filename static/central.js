document.addEventListener('DOMContentLoaded', () => {

    let painelCandidatosAberto = null;
    const listaVagasElement = document.getElementById('lista-de-vagas');
    const token = localStorage.getItem('token');

    if (!token) {
        alert("Você precisa estar logado!");
        window.location.href = 'login.html';
        return;
    }

    function formatarData(dataISO) {
        if (!dataISO) return "Data indisponível";

        const data = new Date(dataISO);
        if (isNaN(data)) return "Data inválida";

        const dia = String(data.getDate()).padStart(2, '0');
        const mes = String(data.getMonth() + 1).padStart(2, '0');
        const ano = data.getFullYear();
        const hora = String(data.getHours()).padStart(2, '0');
        const minuto = String(data.getMinutes()).padStart(2, '0');

        return `${dia}/${mes}/${ano} às ${hora}:${minuto}`;
    }


    async function handleContratar(vagaId, candidatoId) {
        console.log(`[AÇÃO] Tentando CONFIRMAR candidato ${candidatoId} da vaga ${vagaId}...`);

        try {
            const response = await fetch(`http://localhost:8080/vagas/${vagaId}/candidato/${candidatoId}/status`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`, // Envia o token
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Falha ao confirmar candidato: ${response.status}`);
            }
            alert(`SUCESSO: Candidato ${candidatoId} CONFIRMADO!`);

        } catch (error) {
            console.error('Erro ao confirmar o candidato:', error);
            alert(`ERRO: Falha ao confirmar o candidato. ${error.message}`);
        }
    }

    async function handleDispensar(vagaId, candidatoId) {
        console.log(`[AÇÃO] Tentando DISPENSAR candidato ${candidatoId} da vaga ${vagaId}...`);

        try {
            const response = await fetch(`http://localhost:8080/vagas/${vagaId}/candidato/${candidatoId}/recusar`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`, // Envia o token
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Falha ao dispensar candidato: ${response.status}`);
            }

            alert(`SUCESSO: Candidato ${candidatoId} DISPENSADO.`);

            const cardCandidato = document.querySelector(`.candidato-card-info[data-candidato-id="${candidatoId}"]`);

            if (cardCandidato) {
                cardCandidato.remove();

                const listaGrid = cardCandidato.closest('.lista-candidatos-grid');
                if (listaGrid && listaGrid.children.length === 0) {
                    const painel = listaGrid.closest('.painel-candidatos');
                    if (painel) {
                        painel.innerHTML = '<h3>Candidatos Aplicados:</h3><p class="mensagem-alerta">Nenhum candidato restante para esta vaga.</p>';
                    }
                }
            }

        } catch (error) {
            console.error('Erro ao dispensar o candidato:', error);
            alert(`ERRO: Falha ao dispensar o candidato. ${error.message}`);
        }
    }

    /**
     * Cria o card do candidato com os botões Confirma/Dispensar.
     */
    function criarCardCandidato(candidato, vagaId) {
        console.log("DEBUG candidato recebido:", candidato);
        const cardDiv = document.createElement('div');
        cardDiv.classList.add('candidato-card-info');
        cardDiv.setAttribute('data-candidato-id', candidato.id);

        const botoesAcao = `
            <div class="botoes-acao-candidato">
                <button class="btn-acao btn-contratar" data-vaga-id="${vagaId}" data-candidato-id="${candidato.id}">Confirmar</button>
                <button class="btn-acao btn-dispensar" data-vaga-id="${vagaId}" data-candidato-id="${candidato.id}">Dispensar</button>
            </div>
        `;

        const nome = candidato.user?.name || 'Nome Oculto';
        const email = candidato.user?.email || 'N/A';
        const dataCandidatura = formatarData(candidato.dataCandidatura);


        cardDiv.innerHTML = `
            <h4>${nome}</h4>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Candidatou-se em:</strong> ${dataCandidatura}</p>
            ${botoesAcao}
        `;

        const btnContratar = cardDiv.querySelector('.btn-contratar');
        const btnDispensar = cardDiv.querySelector('.btn-dispensar');

        if (btnContratar) {
            btnContratar.addEventListener('click', (e) => {
                e.stopPropagation();
                handleContratar(vagaId, e.target.dataset.candidatoId);
            });
        }

        if (btnDispensar) {
            btnDispensar.addEventListener('click', (e) => {
                e.stopPropagation();
                handleDispensar(vagaId, e.target.dataset.candidatoId);
            });
        }

        return cardDiv;
    }

    function renderizarCandidatos(candidatos, painelElement, vagaId) {
        painelElement.innerHTML = '<h3>Candidatos Aplicados:</h3>';

        if (candidatos.length === 0) {
            painelElement.innerHTML += '<p class="mensagem-alerta">Nenhum candidato se aplicou a esta vaga ainda.</p>';
            return;
        }

        const listaCandidatosGrid = document.createElement('div');
        listaCandidatosGrid.classList.add('lista-candidatos-grid');

        candidatos.forEach(candidato => {


            const cardCandidato = criarCardCandidato(candidato, vagaId);
            listaCandidatosGrid.appendChild(cardCandidato);
        });

        painelElement.appendChild(listaCandidatosGrid);
    }

    async function handleInformacoes(vagaId, cardElement) {
        const cardContainer = cardElement.closest('.card-container');
        const painelId = `candidatos-vaga-${vagaId}`;
        let painelAtual = document.getElementById(painelId);

        if (painelAtual) {
            painelAtual.remove();
            painelCandidatosAberto = null;
            return;
        }

        if (painelCandidatosAberto) {
            painelCandidatosAberto.remove();
            painelCandidatosAberto = null;
        }

        painelAtual = document.createElement('div');
        painelAtual.id = painelId;
        painelAtual.classList.add('painel-candidatos');
        painelAtual.innerHTML = '<p class="mensagem-carregamento">Carregando candidatos...</p>';

        cardContainer.insertAdjacentElement('afterend', painelAtual);
        painelCandidatosAberto = painelAtual;

        try {
            const API_CANDIDATOS = `http://localhost:8080/vagas/${vagaId}/candidaturas`;
            const response = await fetch(API_CANDIDATOS, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`, // Envia o token
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Erro ao buscar candidatos: ${response.status}`);
            }

            const candidatos = await response.json();

            renderizarCandidatos(candidatos, painelAtual, vagaId);

        } catch (error) {
            console.error('Falha ao carregar candidatos:', error);
            painelAtual.innerHTML = `<p class="mensagem-erro">Erro ao carregar candidatos: ${error.message}</p>`;
        }
    }


    /**
     * Função para lidar com o clique no botão "Editar".
      @param {string} vagaId 
      @param {HTMLElement} cardContent
     
    /**
     * Exibe um painel de confirmação antes de apagar a vaga.
     */
    function handleFinalizar(vagaId, cardElement) {
        const confirmPanel = document.createElement('div');
        confirmPanel.classList.add('confirmacao-finalizar');
        confirmPanel.innerHTML = `
            <p>Deseja realmente apagar ou finalizar esta vaga? Essa ação é permanente.</p>
            <div class="botoes-confirmacao">
                <button class="btn-cancelar">Cancelar</button>
                <button class="btn-confirma">Confirmar</button>
            </div>
        `;

        cardElement.appendChild(confirmPanel);

        confirmPanel.querySelector('.btn-cancelar').addEventListener('click', () => {
            confirmPanel.remove();
        });

        confirmPanel.querySelector('.btn-confirma').addEventListener('click', async () => {
            confirmPanel.innerHTML = '<p>Finalizando...</p>';

            try {
                const API_DELETE_VAGA = `http://localhost:8080/vaga/${vagaId}/deletar`;

                const response = await fetch(API_DELETE_VAGA, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`, // Envia o token
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error(`Erro ao finalizar vaga: ${response.status}`);
                }

                // Remove o card da vaga da interface após o sucesso
                cardElement.closest('.card-container').remove();
                alert(`Vaga ID ${vagaId} finalizada e removida com sucesso!`);

            } catch (error) {
                console.error('Falha ao finalizar vaga:', error);
                confirmPanel.innerHTML = `<p class="mensagem-erro">Erro: ${error.message}</p>`;
                setTimeout(() => confirmPanel.remove(), 3000);
            }
        });
    }

    function criarCardVaga(vaga) {
        const cardContent = document.createElement('div');
        cardContent.classList.add('card-vaga');
        cardContent.setAttribute('data-vaga-id', vaga.id);

        const remuneracaoFormatada = parseFloat(vaga.wage || 0).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 2
        });

        cardContent.innerHTML = `
            <div class="info-principal">
                <h3>${vaga.title || 'Título Não Informado'}</h3>
                <p class="area-vaga">Área: ${vaga.area || 'Não Especificada'}</p>
                <p class="remuneracao-vaga">Remuneração: <strong>${remuneracaoFormatada}</strong></p>
                <p class="descricao-curta">${vaga.description ? vaga.description : 'Descrição indisponível'}</p>
            </div>
            <div class="botoes-acao-contratante">
                <button class="btn-acao btn-info">Informações</button>
                <button class="btn-acao btn-editar">Editar</button>
                <button class="btn-acao btn-finalizar">Finalizar</button>
            </div>
            `;

        const vagaId = vaga.id;

        cardContent.querySelector('.btn-info').addEventListener('click', (e) => {
            e.stopPropagation();
            handleInformacoes(vagaId, cardContent);
        });

        cardContent.querySelector('.btn-editar').addEventListener('click', (e) => {
            e.stopPropagation();
            handleEditar(vagaId, cardContent);
        });

        cardContent.querySelector('.btn-finalizar').addEventListener('click', (e) => {
            e.stopPropagation();
            handleFinalizar(vagaId, cardContent);
        });

        return cardContent;
    }

    async function buscarVagas() {
        listaVagasElement.innerHTML = '';

        try {
            const response = await fetch('http://localhost:8080/vaga/minhas', {
                method: 'GET',
                headers: {
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
                const cardWrapper = document.createElement('div');
                cardWrapper.classList.add('card-container');
                cardWrapper.appendChild(criarCardVaga(vaga));
                listaVagasElement.appendChild(cardWrapper);
            });

        } catch (error) {
            console.error('Erro ao buscar as vagas:', error);
            listaVagasElement.innerHTML = '<p class="mensagem-erro">Houve um erro ao carregar as vagas. Tente novamente mais tarde.</p>';
        }
    }

    buscarVagas();


    // --- LÓGICA DO MENU DROPDOWN (MANTIDA) ---
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
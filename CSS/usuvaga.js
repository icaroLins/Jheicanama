document.addEventListener('DOMContentLoaded', () => {

    // --- 1. FUNÇÕES PRINCIPAIS ---

    async function enviarStatusCandidato(vagaId, candidatoId, novoStatus) {
        const API_STATUS_UPDATE_URL = '/api/contratante/atualizar-status-candidato';
        const data = { vagaId, candidatoId, status: novoStatus };

        try {
            const response = await fetch(API_STATUS_UPDATE_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Erro HTTP: ${response.status}`);
            }

            alert(`Status atualizado para '${novoStatus}' para o Candidato ID: ${candidatoId}.`);
            carregarCandidatosParaVaga(vagaId);

        } catch (error) {
            console.error(`Erro ao atualizar status para ${novoStatus}:`, error);
            alert(`Falha ao atualizar o status: ${error.message}`);
        }
    }

    async function enviarStatusVaga(vagaId, novoStatus) {
        const API_VAGA_UPDATE_URL = '/api/contratante/finalizar-vaga';

        try {
            const response = await fetch(API_VAGA_UPDATE_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ vagaId, status: novoStatus })
            });

            if (response.ok) {
                alert(`Vaga ID ${vagaId} FINALIZADA.`);
            } else {
                throw new Error(`Erro ao finalizar vaga: ${response.status}`);
            }
        } catch (error) {
            console.error('Falha ao finalizar vaga:', error);
            alert(`Erro: ${error.message}`);
        }
    }

    function aceitarCandidato(vagaId, candidatoId) {
        if (confirm(`Tem certeza que deseja CONFIRMAR o Candidato ID ${candidatoId} para a Vaga ID ${vagaId}?`)) {
            enviarStatusCandidato(vagaId, candidatoId, 'confirmado');
        }
    }

    function recusarCandidato(vagaId, candidatoId) {
        if (confirm(`Tem certeza que deseja RECUSAR o Candidato ID ${candidatoId} para a Vaga ID ${vagaId}?`)) {
            enviarStatusCandidato(vagaId, candidatoId, 'recusado');
        }
    }

    function finalizarVaga(vagaId) {
        if (confirm(`ATENÇÃO: Você está prestes a FINALIZAR a Vaga ID ${vagaId}. Deseja continuar?`)) {
            enviarStatusVaga(vagaId, 'finalizado');
        }
    }

    function verDetalhesPerfil(candidatoId) {
        window.location.href = `perfil.html?id_candidato=${candidatoId}`;
    }

    // --- 2. CRIAÇÃO DOS CARDS ---
    function criarCardCandidato(candidato, vagaId) {
        const card = document.createElement('div');
        card.classList.add('candidato-card');
        card.setAttribute('data-candidato-id', candidato.id);

        const statusClass = candidato.status ? candidato.status.toLowerCase().replace(' ', '-') : 'em-espera';

        card.innerHTML = `
            <div class="candidato-info">
                <h4>${candidato.nome || 'Candidato Desconhecido'}</h4>
                <p>E-mail: ${candidato.email || 'N/A'}</p>
                <p>Status Atual: <span class="status-tag status-${statusClass}">${candidato.status || 'Em Espera'}</span></p>
            </div>
            <div class="candidato-acoes">
                <button class="btn-acao btn-confirmar" data-id="${candidato.id}">Aceitar/Confirmar</button>
                <button class="btn-acao btn-recusar" data-id="${candidato.id}">Recusar</button>
                <button class="btn-acao btn-detalhes" data-id="${candidato.id}">Ver Perfil</button>
            </div>
        `;

        card.querySelector('.btn-confirmar').addEventListener('click', () => aceitarCandidato(vagaId, candidato.id));
        card.querySelector('.btn-recusar').addEventListener('click', () => recusarCandidato(vagaId, candidato.id));
        card.querySelector('.btn-detalhes').addEventListener('click', () => verDetalhesPerfil(candidato.id));

        return card;
    }

    // --- 3. CARREGAMENTO DAS LISTAS ---
    async function carregarCandidatosParaVaga(vagaId) {
        const listaEspera = document.getElementById('lista-espera');
        const listaConfirmado = document.getElementById('lista-confirmado');
        const listaRecusado = document.getElementById('lista-recusado');

        const API_CANDIDATOS_VAGA = `/api/contratante/vaga/${vagaId}/candidatos`;

        if (!listaEspera || !listaConfirmado || !listaRecusado) {
            console.error("Alguns elementos de lista não foram encontrados no HTML.");
            return;
        }

        listaEspera.innerHTML = '<p class="loading-message">Carregando candidatos...</p>';
        listaConfirmado.innerHTML = '';
        listaRecusado.innerHTML = '';

        try {
            const response = await fetch(API_CANDIDATOS_VAGA);
            if (!response.ok) throw new Error(`Erro ao carregar candidatos: ${response.status}`);

            const candidatos = await response.json();

            listaEspera.innerHTML = '';
            listaConfirmado.innerHTML = '';
            listaRecusado.innerHTML = '';

            if (candidatos.length === 0) {
                listaEspera.innerHTML = '<p class="alert-message">Nenhum candidato para esta vaga ainda.</p>';
                return;
            }

            candidatos.forEach(candidato => {
                const card = criarCardCandidato(candidato, vagaId);

                if (candidato.status === 'confirmado') {
                    listaConfirmado.appendChild(card);
                } else if (candidato.status === 'recusado') {
                    listaRecusado.appendChild(card);
                } else {
                    listaEspera.appendChild(card);
                }
            });

            //  Mensagem candidatos confirmados
            if (listaConfirmado.children.length > 0) {
                const aviso = document.createElement('p');
                aviso.classList.add('info-email');
                aviso.textContent = 'Fique de olho no seu e-mail, você receberá mais informações por lá.';
                listaConfirmado.appendChild(aviso);
            }

        } catch (error) {
            console.error('Falha ao carregar candidatos:', error);
            listaEspera.innerHTML = `<p class="error-message">Erro: ${error.message}</p>`;
        }
    }

    // --- 4. INICIALIZAÇÃO ---
    const urlParams = new URLSearchParams(window.location.search);
    const vagaAtualId = urlParams.get('id');

    const btnFinalizar = document.getElementById('btn-finalizar-vaga');
    if (btnFinalizar && vagaAtualId) {
        btnFinalizar.addEventListener('click', () => finalizarVaga(vagaAtualId));
    }

    if (vagaAtualId) {
        carregarCandidatosParaVaga(vagaAtualId);
    } else {
        const erroElement = document.getElementById('lista-espera') || document.body;
        erroElement.innerHTML = '<p class="error-message">ID da vaga não especificado. Verifique a URL.</p>';
    }

});

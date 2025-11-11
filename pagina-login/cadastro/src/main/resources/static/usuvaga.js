document.addEventListener('DOMContentLoaded', () => {

    const token = localStorage.getItem('token');
    if (!token) {
        alert("Você precisa estar logado!");
        return;
    }



    function parseJwt(token) {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
        );
        return JSON.parse(jsonPayload);
    }

    const payload = parseJwt(token);
    const candidatoId = payload ? payload.userId : null;

    if (!candidatoId) {
        alert("ID do usuário não encontrado no token. Faça login novamente.");
        return;
    }

    console.log("ID do usuário extraído do token:", candidatoId);



    console.log("✅ Arquivo usuvaga.js carregado com sucesso!");


    // --- 1. CRIAÇÃO DOS CARDS ---
    function criarCardVaga(vaga) {
        const card = document.createElement('div');
        card.classList.add('vaga-card');
        card.setAttribute('data-vaga-id', vaga.id);

        const statusClass = vaga.status ? vaga.status.toLowerCase().replace(' ', '-') : 'em-espera';

        // Pega dados da vaga associada (dentro de "vagas")
        const titulo = vaga.vagas?.title || 'Vaga Desconhecida';
        const empresa = vaga.vagas?.contractor?.empresa || 'Empresa não informada';
        const emailEmpresa = vaga.vagas?.contractor?.email || null;

        const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${emailEmpresa}&su=Contato%20sobre%20vaga%20${encodeURIComponent(titulo)}`;


        let mensagemContato = '';
        if (vaga.status === 'ACEITO' && emailEmpresa) {
            mensagemContato = `
            <p class="mensagem-contato">
                🎉 Parabéns! Você foi aceito nesta vaga. Entre em contato com 
                <strong>${empresa}</strong> pelo e-mail: 
                <a href="${gmailLink}" target="_blank">Enviar e-mail</a>.
            </p>
        `;
        }

        card.innerHTML = `
        <div class="vaga-info">
            <h4>${titulo}</h4>
            <p>Empresa: ${empresa}</p>
            <p>Status da candidatura: 
                <span class="status-tag status-${statusClass}">
                    ${vaga.status || 'Em Espera'}
                </span>
            </p>
            ${mensagemContato}
        </div>
    `;

        return card;
    }

    // --- 2. CARREGAMENTO DAS LISTAS ---
    async function carregarVagasCandidato(candidatoId) {


        const listaEspera = document.getElementById('lista-espera');
        const listaAceitas = document.getElementById('lista-aceitas');
        const listaRecusadas = document.getElementById('lista-recusadas');

        const API_VAGAS_CANDIDATO = `http://localhost:8080/vagas/${Number(candidatoId)}/candidature`;
        // ajuste conforme sua rota backend

        if (!listaEspera || !listaAceitas || !listaRecusadas) {
            console.error("Alguns elementos de lista não foram encontrados no HTML.");
            return;
        }

        listaEspera.innerHTML = '<p class="loading-message">Carregando suas vagas...</p>';
        listaAceitas.innerHTML = '';
        listaRecusadas.innerHTML = '';

        try {


            const response = await fetch(API_VAGAS_CANDIDATO, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`, // Envia o token
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) throw new Error(`Erro ao carregar vagas: ${response.status}`);

            const vagas = await response.json();
            console.log("Vagas recebidas do backend:", vagas);

            listaEspera.innerHTML = '';
            listaAceitas.innerHTML = '';
            listaRecusadas.innerHTML = '';

            if (vagas.length === 0) {
                listaEspera.innerHTML = '<p class="alert-message">Você ainda não se candidatou a nenhuma vaga.</p>';
                return;
            }

            vagas.forEach(vaga => {
                const card = criarCardVaga(vaga);

                switch (vaga.status) {
                    case 'ACEITO':
                        listaAceitas.appendChild(card);
                        break;
                    case 'RECUSADO':
                        listaRecusadas.appendChild(card);
                        break;
                    case 'PENDENTE':
                    default:
                        listaEspera.appendChild(card);
                        break;
                }
            });

            console.log("🔍 Buscando vagas para candidato:", candidatoId);
            console.log("Token usado:", token);

            console.log("Exemplo de vaga recebida:", vagas[0]);

        } catch (error) {
            console.error('Falha ao carregar vagas:', error);
            listaEspera.innerHTML = `<p class="error-message">Erro: ${error.message}</p>`;
        }

    }

    // --- 3. INICIALIZAÇÃO ---
    if (candidatoId) {
        carregarVagasCandidato(candidatoId);
    } else {
        const erroElement = document.getElementById('lista-espera') || document.body;
        erroElement.innerHTML = '<p class="error-message">ID do candidato não encontrado. Faça login novamente.</p>';
    }



});

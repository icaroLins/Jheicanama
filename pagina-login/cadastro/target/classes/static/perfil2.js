document.addEventListener('DOMContentLoaded', () => {

    /* ============================================= */
    /* 1. LÓGICA DO PERFIL DA EMPRESA */
    /* ============================================= */

    // --- 1- API ---

    const API_PERFIL_URL = 'http://localhost:8080/contratantes/me';
    const token = localStorage.getItem('token');

    if (!token) {
        alert("Você precisa estar logado!");
        window.location.href = 'login.html';
        return;
    }

    console.log("Token enviado no fetch:", token);


    // --- 2. FUNÇÃO PRINCIPAL: RECEBER DADOS E INSERIR NO HTML ---
    async function carregarDadosDoPerfil() {
        try {
            const resposta = await fetch(API_PERFIL_URL, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }// token aqui

            });

            if (resposta.status === 401) {
                alert('Sessão expirada. Faça login novamente.');
                localStorage.removeItem('token');
                window.location.href = 'login.html';
                return;
            }

            if (resposta.status === 403) {
                alert('Você não tem permissão para acessar este recurso.');
                return;
            }

            if (!resposta.ok) {
                throw new Error(`Erro de rede ou servidor: ${resposta.status}`);
            }

            let dadosDaEmpresa = {};
            try {
                dadosDaEmpresa = await resposta.json();
            } catch (e) {
                console.warn("Resposta vazia ou inválida, usando objeto vazio.");
            }

            // Chama a função para o HTML
            preencherPerfil(dadosDaEmpresa);

        } catch (erro) {
            console.error('Falha ao carregar dados da empresa:', erro);
            // Mensagem de erro no HTML (Verifica se os elementos existem antes de tentar manipulá-los)
            const infoNome = document.getElementById('infoNome');
            const infoEmail = document.getElementById('infoEmail');
            if (infoNome) infoNome.textContent = 'Falha ao carregar';
            if (infoEmail) infoEmail.textContent = 'Verifique a API.';
        }
    }

    // dados do nome, email, cnpj, e telefone.
    function preencherPerfil(dados) {
        // Verifica se os elementos existem antes de atualizar
        const infoNome = document.getElementById('infoNome');
        const infoEmail = document.getElementById('infoEmail');
        const infoCNPJ = document.getElementById('infoCNPJ');
        const infoTelefone = document.getElementById('infoTelefone');
        const fotoUsuario = document.getElementById('fotoUsuario');

        // Atualiza as informações de texto
        document.getElementById('infoNome').textContent = dados.name || 'Não informado';
        document.getElementById('infoEmail').textContent = dados.email || 'Não informado';

        // CNPJ e Telefone
        document.getElementById('infoCNPJ').textContent = dados.cnpj || 'Não informado';
        document.getElementById('infoTelefone').textContent = dados.telefone || 'Não informado';

        // Atualiza a foto se o URL for válido
        if (dados.fotoPerfilUrl && fotoUsuario) {
            fotoUsuario.src = "http://localhost:8080" + dados.fotoPerfilUrl;
        } else {
            fotoUsuario.src = "https://via.placeholder.com/150";
        }

        console.log("Perfil da Empresa preenchido com dados da API.");
    }

    // --- 4. Funcional do 'editar foto' ---
    const btnEditarFoto = document.getElementById('btnEditarFoto');
    const inputFoto = document.getElementById('inputFoto');
    const fotoUsuario = document.getElementById('fotoUsuario');

    if (btnEditarFoto && inputFoto && fotoUsuario) {
        btnEditarFoto.addEventListener('click', () => {
            inputFoto.click();
        });

        inputFoto.addEventListener('change', (event) => {
            const file = event.target.files[0];

            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    fotoUsuario.src = e.target.result;
                };
                reader.readAsDataURL(file);

                //upload deve ser aqui.
                console.log("Iniciando upload da nova foto...");
            }
        });
    }

    // Chamada inicial para carregar os dados
    carregarDadosDoPerfil();


    /* ============================================= */
    /* 3. LÓGICA DO MENU COLAPSÁVEL (DROPDOWN) */
    /* (Adicionada ao mesmo DOMContentLoaded) */
    /* ============================================= */

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
        console.warn("AVISO: Elementos do Menu Colapsável não foram encontrados. O menu pode não funcionar.");
    }

    inputFoto.addEventListener('change', async (event) => {

        const file = event.target.files[0];

        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                fotoUsuario.src = e.target.result;
            };
            reader.readAsDataURL(file);

            console.log("Iniciando upload da nova foto...");

            const formData = new FormData();
            formData.append("foto", file);

            try {
                const resposta = await fetch("http://localhost:8080/contratantes/upload_foto", {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    },
                    body: formData
                });

                if (resposta.ok) {
                    alert("Foto enviada com sucesso!");
                } else {
                    const texto = await resposta.text();
                    alert("Erro ao enviar foto: " + texto);
                }

            } catch (erro) {
                console.error("Erro durante upload:", erro);
                alert("Falha ao enviar foto. Veja o console para detalhes.");
            }
        }
    });

});
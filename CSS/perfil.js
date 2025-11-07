document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. API (Configuração) ---
    
    // API.
    const API_PERFIL_URL = 'http://localhost:8080/usuarios/me'; 
    const token = localStorage.getItem('token');

    if (!token) {
        alert('Você precisa estar logado para acessar esta página.');
        window.location.href = 'login.html';
        return;
    }

    console.log("Token enviado no fetch:", token);

    // --- 2. receber os dados---
    
    async function carregarDadosDoPerfil() {
        try {
            // [ATENÇÃO: Esta chamada falhará se API_PERFIL_URL for vazia ou inválida]
            const resposta = await fetch(API_PERFIL_URL, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`, // Envia o token
                    'Content-Type': 'application/json'
                }
                
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

            // Converte o JSON recebido em um objeto JavaScript
            const dadosDoUsuario = await resposta.json();

            // Chama a função para preencher o HTML
            preencherPerfil(dadosDoUsuario);

        } catch (erro) {
            console.error('Falha ao carregar dados do perfil:', erro);
            // Mensagem de erro no HTML caso a busca falhe
            const infoNome = document.getElementById('infoNome');
            const infoEmail = document.getElementById('infoEmail');
            
            if (infoNome) infoNome.textContent = 'Falha ao carregar';
            if (infoEmail) infoEmail.textContent = 'Verifique a conexão.';
        }
    }
    
    // nome, email, cpf, dataNascimento e urlFoto.
    function preencherPerfil(dados) {
        // Atualiza as informações de texto
        document.getElementById('infoNome').textContent = dados.name || 'Não informado';
        document.getElementById('infoEmail').textContent = dados.email || 'Não informado';
        document.getElementById('infoCPF').textContent = dados.cpf || 'Não informado';
        //document.getElementById('infoNascimento').textContent = dados.dataNascimento || 'Não informado';
        
        // Atualiza a foto se o URL for válido
        if (dados.urlFoto && fotoUsuario) {
            fotoUsuario.src = dados.urlFoto;
        }

        console.log("Perfil preenchido com dados da API.");
    }
    
    
    // --- 3. FUNCIONALIDADE do botão "editar foto" ---
    
    const btnEditarFoto = document.getElementById('btnEditarFoto');
    const inputFoto = document.getElementById('inputFoto');
    const fotoUsuario = document.getElementById('fotoUsuario');
    
    if (btnEditarFoto && inputFoto && fotoUsuario) {
        
        btnEditarFoto.addEventListener('click', () => {
            inputFoto.click();
        });

        // Pré-visualização e Preparação para Upload
        inputFoto.addEventListener('change', (event) => {
            const file = event.target.files[0];
            
            if (file) {
                const reader = new FileReader();
                
                reader.onload = (e) => {
                    // Exibe a nova imagem para pré-visualização
                    fotoUsuario.src = e.target.result;
                };
                
                reader.readAsDataURL(file);
                
                // [Adicione aqui a lógica de upload real para o servidor]
                console.log("Nova foto selecionada para pré-visualização.");
            }
        });
    }

    
    // Chama a função para começar a buscar os dados assim que a página carregar
    carregarDadosDoPerfil();
    
    
    // --- 4. LÓGICA DO MENU DROPDOWN (Integrada) ---
    
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
        console.warn("AVISO: Um ou mais elementos do Menu Colapsável não foram encontrados.");
    }
});
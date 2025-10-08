document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. API ---
    
    // API.
    const API_PERFIL_URL = ''; 

    
    // --- 2. receber os dados---
    
    async function carregarDadosDoPerfil() {
        try {
            const resposta = await fetch(API_PERFIL_URL, {
                method: 'GET',
                
            });

            if (!resposta.ok) {
                throw new Error(`Erro de rede ou servidor: ${resposta.status}`);
            }

            // Converte o JSON recebido em um objeto JavaScript
            const dadosDoUsuario = await resposta.json();

            // Chama a função para o HTML
            preencherPerfil(dadosDoUsuario);

        } catch (erro) {
            console.error('Falha ao carregar dados do perfil:', erro);
            // Mensagem de erro no HTML caso a busca falhe
            document.getElementById('infoNome').textContent = 'Falha ao carregar';
            document.getElementById('infoEmail').textContent = 'Verifique a conexão.';
        }
    }
 
    // nome, email, cpf, dataNascimento e urlFoto.
    function preencherPerfil(dados) {
        // Atualiza as informações de texto
        document.getElementById('infoNome').textContent = dados.nome || 'Não informado';
        document.getElementById('infoEmail').textContent = dados.email || 'Não informado';
        document.getElementById('infoCPF').textContent = dados.cpf || 'Não informado';
        document.getElementById('infoNascimento').textContent = dados.dataNascimento || 'Não informado';
        
        // Atualiza a foto se o URL for válido
        if (dados.urlFoto) {
            document.getElementById('fotoUsuario').src = dados.urlFoto;
        }

        console.log("Perfil preenchido com dados da API.");
    }
    
    
    // --- 4. FUNCIONal do botão "editar foto" ---
    
    const btnEditarFoto = document.getElementById('btnEditarFoto');
    const inputFoto = document.getElementById('inputFoto');
    const fotoUsuario = document.getElementById('fotoUsuario');
    
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
            
    
            console.log("");
        }
    });

    
    // Chama a função para começar a buscar os dados assim que a página carregar
    carregarDadosDoPerfil();
});
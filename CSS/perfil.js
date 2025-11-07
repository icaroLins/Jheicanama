document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. API ---
    
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
        document.getElementById('infoNome').textContent = dados.name || 'Não informado';
        document.getElementById('infoEmail').textContent = dados.email || 'Não informado';
        document.getElementById('infoCPF').textContent = dados.cpf || 'Não informado';
        //document.getElementById('infoNascimento').textContent = dados.dataNascimento || 'Não informado';
        
        // Atualiza a foto se o URL for válido
        if (dados.fotoPerfilUrl && fotoUsuario) {
            fotoUsuario.src = "http://localhost:8080" + dados.fotoPerfilUrl;
        } else {
            fotoUsuario.src = "https://via.placeholder.com/150";
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
                const resposta = await fetch("http://localhost:8080/usuarios/upload_foto", {
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
    })

    
    // Chama a função para começar a buscar os dados assim que a página carregar
    carregarDadosDoPerfil();
});
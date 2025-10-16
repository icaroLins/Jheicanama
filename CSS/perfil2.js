document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1- API ---
    
    const API_PERFIL_URL = 'http://localhost:8080/contratantes/me'; 
    const token = localStorage.getItem('token');

    if(!token){
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
                    'Authorization': `Bearer ${token}`, // Envia o token
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
            // Mensagem de erro no HTML
            document.getElementById('infoNome').textContent = 'Falha ao carregar';
            document.getElementById('infoEmail').textContent = 'Verifique a API.';
        }
    }

    // dados do nome, email, cnpj, e telefone.
    function preencherPerfil(dados) {
        // Atualiza as informações de texto
        document.getElementById('infoNome').textContent = dados.name || 'Não informado';
        document.getElementById('infoEmail').textContent = dados.email || 'Não informado';
        
        // CNPJ e Telefone
        document.getElementById('infoCNPJ').textContent = dados.cnpj || 'Não informado';
        document.getElementById('infoTelefone').textContent = dados.telefone || 'Não informado';
        
        // Atualiza a foto se o URL for válido
        if (dados.urlFoto) {
            document.getElementById('fotoUsuario').src = dados.urlFoto;
        }

        console.log("Perfil da Empresa preenchido com dados da API.");
    }
    
    
    // --- 4. Funcional do 'editar foto'---
    
    const btnEditarFoto = document.getElementById('btnEditarFoto');
    const inputFoto = document.getElementById('inputFoto');
    const fotoUsuario = document.getElementById('fotoUsuario');
    
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
            console.log("");
        }
    });
    
    carregarDadosDoPerfil();
});
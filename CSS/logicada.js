document.addEventListener('DOMContentLoaded', function() {

    // --- SELEÇÃO DOS ELEMENTOS ---
    // Formulários
    const loginBox = document.getElementById('login-box');
    const cadastroBox = document.getElementById('cadastro-box');
    const contratanteBox = document.getElementById('form-contratante'); // Novo formulário

    // Botões
    const btnCadastrar = document.getElementById('btn-cadastrar'); // Vai para o cadastro de usuário
    const btnVoltar = document.getElementById('btn-voltar'); // Volta do cad. usuário para o login
    
    // Botões do formulário de cadastro de usuário
    const btnContratante = document.querySelector('.btn-contratante'); // Vai para o cadastro de contratante
    
    // Botões do novo formulário de contratante
    const btnVoltarContratante = document.getElementById('btn-voltar-contratante'); // Volta do cad. contratante para o login

    const btnLogin = document.getElementById('btn-login');
    // --- FUNÇÕES DE CONTROLE ---

    // Esconde todos os formulários
    function hideAllForms() {
        loginBox.classList.add('hidden');
        cadastroBox.classList.add('hidden');
        contratanteBox.classList.add('hidden');
    }

    // --- LÓGICA DOS CLIQUES ---

    // 1. Do Login -> para Cadastro de Usuário
    btnCadastrar.addEventListener('click', function(event) {
        event.preventDefault();
        hideAllForms(); // Esconde todos
        cadastroBox.classList.remove('hidden'); // Mostra só o de cadastro
    });

    // 2. Do Cadastro de Usuário -> para Login
    btnVoltar.addEventListener('click', function(event) {
        event.preventDefault();
        hideAllForms(); // Esconde todos
        loginBox.classList.remove('hidden'); // Mostra só o de login
    });

    // 3. Do Cadastro de Usuário -> para Cadastro de Contratante (NOVO)
    btnContratante.addEventListener('click', function(event) {
        event.preventDefault();
        hideAllForms(); // Esconde todos
        contratanteBox.classList.remove('hidden'); // Mostra só o de contratante
    });

    // 4. Do Cadastro de Contratante -> para Login (NOVO)
    btnVoltarContratante.addEventListener('click', function(event) {
        event.preventDefault();
        hideAllForms(); // Esconde todos
        loginBox.classList.remove('hidden'); // Mostra só o de login
    });

    // Seleciona o formulário de contratante
document.getElementById("btn-finalizar-contratante").addEventListener("click", function (e) {
    e.preventDefault(); // evita recarregar a página

    const data = {
        empresa: document.getElementById("contratante-empresa").value,
        name: document.getElementById("contratante-name").value,
        cnpj: document.getElementById("contratante-cnpj").value,
        telefone: document.getElementById("contratante-telefone").value,
        email: document.getElementById("contratante-email").value,
        passWord: document.getElementById("contratante-senha").value
    };

    fetch("http://localhost:8080/contratantes/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    })
    .then(res => {
        if (res.ok) {
            alert("Cadastro realizado com sucesso!");
        } else {
            alert("Erro no cadastro!");
        }
    })
    .catch(err => console.error("Erro:", err));
});

document.getElementById("btn-finalizar-candidato").addEventListener("click", function (e) {
    e.preventDefault(); // não recarrega a página

    const data = {
        name: document.getElementById("candidato-nome").value,
        email: document.getElementById("candidato-email").value,
        cpf: document.getElementById("candidato-cpf").value,
        passWord: document.getElementById("candidato-senha").value,
        dataNascimento: document.getElementById("candidato-nascimento").value
    };

    fetch("http://localhost:8080/usuarios/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    })
    .then(res => {
        if (res.ok) {
            alert("Candidato cadastrado com sucesso!");
            hideAllForms();
            loginBox.classList.remove('hidden');
        } else {
            return res.text().then(text => { throw new Error(text) });
        }
    })
    .catch(err => {
        console.error("Erro:", err);
        alert("Erro ao cadastrar candidato. Veja o console.");
    });
});

btnLogin.addEventListener('click', function(e) {
    e.preventDefault();

    const email = loginBox.querySelector('input[type="text"]').value;
    const senha = loginBox.querySelector('input[type="password"]').value;

    fetch(`http://localhost:8080/usuarios/login?email=${encodeURIComponent(email)}&senha=${encodeURIComponent(senha)}`, {
        method: "POST"
    })
    .then(async res => {
        if (res.ok) {
            const token = await res.text(); // o backend retorna o token como texto
            alert("Login realizado com sucesso!");
            console.log("Token:", token);
        } else {
            const msg = await res.text();
            alert("Erro no login: " + msg);
        }
    })
    .catch(err => {
        console.error("Erro:", err);
        alert("Erro ao tentar logar. Veja o console.");
    });
});
});
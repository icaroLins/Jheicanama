document.addEventListener('DOMContentLoaded', function () {

    // Formulários
    const loginBox = document.getElementById('login-box');
    const cadastroBox = document.getElementById('cadastro-box');
    const contratanteBox = document.getElementById('form-contratante');

    // Botões
    const btnCadastrar = document.getElementById('btn-cadastrar'); // Vai para o cadastro de usuário
    const btnVoltar = document.getElementById('btn-voltar'); // Volta do cad. usuário para o login
    const forgotPasswordLink = document.querySelector('.forgot-password-link');

    // Botões do formulário de cadastro de usuário
    const btnContratante = document.querySelector('.btn-contratante'); // Vai para o cadastro de contratante
    // Botões do novo formulário de contratante
    const btnVoltarContratante = document.getElementById('btn-voltar-contratante'); // Volta do cad. contratante para o login


    // Botões da tela de login (novos e/ou com IDs específicos para o problema)
    const btnContratanteLogin = document.getElementById('btn-contratante-login');

    const inputIdentificador = document.getElementById('login-identificador');
    const btnLogin = document.getElementById('btn-login');

    let modoContratante = false;

    // --- FUNÇÕES DE CONTROLE ---

    // Esconde todos os formulários e o link de recuperação de senha
    function hideAllForms() {
        loginBox.classList.add('hidden');
        cadastroBox.classList.add('hidden');
        contratanteBox.classList.add('hidden');
        if (forgotPasswordLink) {
            forgotPasswordLink.classList.add('hidden');
        }
    }

    // Função para mostrar apenas o Login
    function showLogin() {
        hideAllForms();
        loginBox.classList.remove('hidden');
        inputIdentificador.placeholder = "CPF/EMAIL";
        modoContratante = false;

        // Revela o link de recuperação de senha apenas no Login
        if (forgotPasswordLink) {
            forgotPasswordLink.classList.remove('hidden');
        }
    }


    // --- LÓGICA DOS CLIQUES ---

    // 1. Do Login -> para Cadastro de Usuário
    btnCadastrar.addEventListener('click', function (event) {
        event.preventDefault();
        hideAllForms();
        cadastroBox.classList.remove('hidden');
    });

    // 2. Do Cadastro de Usuário -> para Login
    btnVoltar.addEventListener('click', function (event) {
        event.preventDefault();
        showLogin();
    });

    // 3. Do Cadastro de Usuário -> para Cadastro de Contratante
    btnContratante.addEventListener('click', function (event) {
        event.preventDefault();
        hideAllForms();
        contratanteBox.classList.remove('hidden');
    });

    // 4. Do Cadastro de Contratante -> para Login
    btnVoltarContratante.addEventListener('click', function (event) {
        event.preventDefault();
        showLogin();
    });

    // 5. Lógica para carregar o formulário correto via URL (Melhorado para Contratante também)
    function checkUrlForForm() {
        const urlParams = new URLSearchParams(window.location.search);
        const formParam = urlParams.get('form');

        if (formParam === 'cadastro') {
            hideAllForms();
            cadastroBox.classList.remove('hidden');
        }
        else if (formParam === 'contratante') {
            hideAllForms();
            contratanteBox.classList.remove('hidden');
        }
        else {
            showLogin();
        }
    }


    // Adicionado evento para o botão 'Contratante' da tela de login
    btnContratanteLogin.addEventListener('click', function (e) {
        e.preventDefault();
        modoContratante = !modoContratante; // alterna estado

        if (modoContratante) {
            inputIdentificador.placeholder = "CNPJ/EMAIL";
            btnLogin.textContent = "Logar";
        } else {
            inputIdentificador.placeholder = "CPF/EMAIL";
            btnLogin.textContent = "Logar";
        }
    });

    // Seleciona o formulário de contratante
    document.getElementById("btn-finalizar-contratante").addEventListener("click", function (e) {
        e.preventDefault();

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
        e.preventDefault();

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
                    showLogin(); // Chama a função para voltar ao Login
                } else {
                    return res.text().then(text => { throw new Error(text) });
                }
            })
            .catch(err => {
                console.error("Erro:", err);
                alert("Erro ao cadastrar candidato. Veja o console.");
            });
    });

    btnLogin.addEventListener('click', function (e) {
        e.preventDefault();
        const identificador = inputIdentificador.value;
        const senha = loginBox.querySelector('input[type="password"]').value;

        if (modoContratante) {
            // Login contratante
            fetch("http://localhost:8080/contratantes/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ identificador, senha })
            })
                .then(async res => {
                    if (res.ok) {
                        const data = await res.json();
                        alert("Login contratante realizado com sucesso!");

                        localStorage.setItem("token", data.token);
                        localStorage.setItem("tipo", data.tipo);
                        window.location.href = "http://127.0.0.1:5500/pagina-login/cadastro/src/main/resources/static/central.html";
                    } else {
                        const msg = await res.text();
                        alert("Erro no login contratante: " + msg);
                    }
                })
                .catch(err => console.error("Erro:", err));
        } else {
            // Login usuário
            fetch("http://localhost:8080/usuarios/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ identificador, senha })
            })
                .then(async res => {
                    if (res.ok) {
                        const resJson = await res.json();    // pega o objeto { token, tipo }
                        localStorage.setItem("token", resJson.token);
                        localStorage.setItem("tipo", resJson.tipo);
                        localStorage.setItem("userId", resJson.id);
                        alert("Login usuário realizado com sucesso!");
                        console.log("Token:", resJson.token);
                         window.location.href = "http://127.0.0.1:5500/pagina-login/cadastro/src/main/resources/static/perfil.html";

                    } else {
                        const msg = await res.text();
                        alert("Erro no login usuário: " + msg);
                    }
                })
                .catch(err => console.error("Erro:", err));
        }
    });

    checkUrlForForm();

});
document.addEventListener('DOMContentLoaded', function() {

    // --- SELEÇÃO DOS ELEMENTOS ---
    // Formulários
    const loginBox = document.getElementById('login-box');
    const cadastroBox = document.getElementById('cadastro-box');
    const contratanteBox = document.getElementById('contratante-box'); // Novo formulário

    // Botões
    const btnCadastrar = document.getElementById('btn-cadastrar'); // Vai para o cadastro de usuário
    const btnVoltar = document.getElementById('btn-voltar'); // Volta do cad. usuário para o login

    const forgotPasswordLink = document.querySelector('.forgot-password-link');
    
    // Botões do formulário de cadastro de usuário
     const btnContratante = document.querySelector('.btn-contratante'); // Vai para o cadastro de contratante
    // Botões do novo formulário de contratante
    const btnVoltarContratante = document.getElementById('btn-voltar-contratante'); // Volta do cad. contratante para o login

    // Botões da tela de login (novos e/ou com IDs específicos para o problema)
    const btnContratanteLogin = document.getElementById('btn-contratante-login'); // Esta linha foi ADICIONADA.
    const btnLogar = document.getElementById('btn-logar'); // Esta linha foi ADICIONADA.
  
    
    const inputIdentificador = document.getElementById('login-identificador');///// troca///
    
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
        forgotPasswordLink.classList.add('hidden'); //esconde "esqueci senha"
    });

    // 2. Do Cadastro de Usuário -> para Login
    btnVoltar.addEventListener('click', function(event) {
        event.preventDefault();
        hideAllForms(); // Esconde todos
        loginBox.classList.remove('hidden'); // Mostra só o de login
         forgotPasswordLink.classList.remove('hidden'); //esconde "esqueci senha"
    });

    // 3. Do Cadastro de Usuário -> para Cadastro de Contratante (NOVO)
    btnContratante.addEventListener('click', function(event) {
        event.preventDefault();
        hideAllForms(); // Esconde todos
        contratanteBox.classList.remove('hidden'); // Mostra só o de contratante
        forgotPasswordLink.classList.add('hidden'); //esconde "esqueci senha"
    });

    // 4. Do Cadastro de Contratante -> para Login (NOVO)
    btnVoltarContratante.addEventListener('click', function(event) {
        event.preventDefault();
        hideAllForms(); // Esconde todos
        loginBox.classList.remove('hidden'); // Mostra só o de login
        inputIdentificador.placeholder = "CPF/EMAIL";
        forgotPasswordLink.classList.remove('hidden'); //esconde "esqueci senha"
    });

    // Adicionado evento para o botão 'Contratante' da tela de login
// MUDANÇA AQUI: Corrigido o nome da variável de evento
btnContratanteLogin.addEventListener('click', function(event) {
    event.preventDefault();
    // Quando o contratante clica, o placeholder deve ser CNPJ
    inputIdentificador.placeholder = "CNPJ/EMAIL";
});

});
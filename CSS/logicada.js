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

    // --- LÓGICA PARA ALTERNAR O TIPO DE LOGIN (CPF vs CNPJ) ---
btnContratanteLogin.addEventListener('click', function(event) {
    event.preventDefault();

    // Verifica qual é o ID ATUAL do botão de login para saber o estado
    if (btnLogar.id === 'btn-logar') {
        // Se o ID é o padrão, muda para o modo CONTRATANTE.
        
        // 1. Altera o placeholder
        inputIdentificador.placeholder = "CNPJ/EMAIL";
        
        // 2. Altera o ID do botão "Logar"
        btnLogar.id = 'btn-logar-contratante';

    } else {
        // Se já está no modo CONTRATANTE, volta para o modo PESSOA FÍSICA.
        
        // 1. Restaura o placeholder original
        inputIdentificador.placeholder = "CPF/EMAIL";
        
        // 2. Restaura o ID original do botão "Logar"
        btnLogar.id = 'btn-logar';
    }
});

});

document.addEventListener('DOMContentLoaded', () => {
    // ----- ELEMENTOS -----
    const forgotBtn = document.getElementById('forgot-password-btn');
    const forgotBox = document.getElementById('forgot-password-box');
    const loginBox = document.getElementById('login-box');
    const backBtn = document.getElementById('btn-voltar-esqueci');

    const form = document.getElementById('forgot-password-form');
    const emailInput = document.getElementById('email');
    const messageBox = document.getElementById('message-box');

    // ----- MOSTRAR BOX DE RECUPERAÇÃO -----
    forgotBtn.addEventListener('click', () => {
        loginBox.classList.add('hidden');
        forgotBox.classList.remove('hidden');
    });

    // ----- VOLTAR PARA LOGIN -----
    backBtn.addEventListener('click', (e) => {
        e.preventDefault();
        forgotBox.classList.add('hidden');
        loginBox.classList.remove('hidden');
        messageBox.textContent = "";
        form.reset();
    });

    // ----- ENVIO DO FORMULÁRIO -----
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const email = emailInput.value.trim();
        if (!email) {
            messageBox.textContent = "Por favor, insira seu e-mail.";
            messageBox.style.color = "red";
            return;
        }

        try {
            const url = `http://localhost:8080/api/password/forgot?email=${encodeURIComponent(email)}`;
            const response = await fetch(url, {
                method: 'POST'
            });

            if (response.ok) {
                messageBox.textContent = "Se o e-mail estiver cadastrado, você receberá instruções para redefinir a senha.";
                messageBox.style.color = "green";
                form.reset();
            } else {
                // O backend pode não retornar JSON, então não fazemos parse
                messageBox.textContent = "Erro ao enviar e-mail.";
                messageBox.style.color = "red";
            }
        } catch (error) {
            console.error("Erro:", error);
            messageBox.textContent = "Erro ao conectar com o servidor.";
            messageBox.style.color = "red";
        }
    });
});

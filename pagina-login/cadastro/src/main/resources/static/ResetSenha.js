document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('reset-password-form');
    const newPasswordInput = document.getElementById('new-password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const messageBox = document.getElementById('message-box');

    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (!token) {
        messageBox.textContent = 'Link inválido. Token ausente.';
        messageBox.style.color = 'red';
        form.style.display = 'none';
        return;
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const newPassword = newPasswordInput.value.trim();
        const confirmPassword = confirmPasswordInput.value.trim();

        if (!newPassword || !confirmPassword) {
            messageBox.textContent = 'Preencha todos os campos.';
            messageBox.style.color = 'red';
            return;
        }

        if (newPassword !== confirmPassword) {
            messageBox.textContent = 'As senhas não coincidem.';
            messageBox.style.color = 'red';
            return;
        }

        try {
            const url = `http://localhost:8080/api/password/reset?token=${encodeURIComponent(token)}&newPassword=${encodeURIComponent(newPassword)}`;
            const response = await fetch(url, { method: 'POST' });

            if (response.ok) {
                messageBox.textContent = 'Senha redefinida com sucesso.';
                messageBox.style.color = 'green';
                form.reset();
            } else {
                const text = await response.text();
                messageBox.textContent = `Erro ao redefinir senha: ${text}`;
                messageBox.style.color = 'red';
            }
        } catch (error) {
            messageBox.textContent = 'Erro ao conectar com o servidor.';
            messageBox.style.color = 'red';
        }
    });
});
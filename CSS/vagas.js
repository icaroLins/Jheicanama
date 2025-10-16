document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form'); 
    const token = localStorage.getItem('token');

    if (!token) {
        alert("Você precisa estar logado!");
        window.location.href = 'login.html';
        return;
    }

    form.addEventListener('submit', async (event) => {
        event.preventDefault(); 

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch('http://localhost:8080/vaga/criar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });

            // Ler a resposta como texto e tentar parsear JSON
            const text = await response.text();
            let responseData = {};
            try {
                responseData = text ? JSON.parse(text) : {};
            } catch (e) {
                console.warn("Resposta não é JSON:", text);
            }

            if (response.ok) {
                alert('Vaga salva com sucesso!');
                form.reset();
            } else {
                // Mostra o erro do servidor se existir
                const msg = responseData.message || response.statusText || 'Erro desconhecido';
                alert(`Erro ao salvar: ${msg}`);
            }

        } catch (error) {
            console.error('Erro de rede ou servidor:', error);
            alert('Erro de conexão. Tente novamente.');
        }
    });
});

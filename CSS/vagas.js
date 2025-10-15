document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form'); 

    form.addEventListener('submit', async (event) => {
        event.preventDefault(); 

       
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        try {
            // Envia os dados para o endpoint do servidor
            const response = await fetch('/salvar-dados', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json' // Indica que estamos enviando JSON
                },
                body: JSON.stringify(data) // Converte o objeto JS para uma string JSON
            });

            if (response.ok) {
                alert('Vaga salva com sucesso!');
                form.reset(); // Limpa o formulário após o sucesso
            } else {
                const errorData = await response.json();
                alert(`Erro ao salvar: ${errorData.message || response.statusText}`);
            }
        } catch (error) {
            console.error('Erro de rede ou servidor:', error);
            alert('Erro de conexão. Tente novamente.');
        }
    });
});
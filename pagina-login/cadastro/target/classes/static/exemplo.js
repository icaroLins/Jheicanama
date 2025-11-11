document.addEventListener('DOMContentLoaded', function() {
    const listaCandidaturas = document.getElementById('lista-de-candidaturas');

    const candidaturasIds = JSON.parse(localStorage.getItem('candidaturas')) || [];

    const vagas = [
        { id: 1, titulo: 'Desenvolvedor Front-end', descricao: 'Desenvolvimento de interfaces web', status: 'Disponível' },
        { id: 2, titulo: 'Analista de Dados', descricao: 'Análise de dados para relatórios', status: 'Disponível' }
    ];

    listaCandidaturas.innerHTML = '';
    if (candidaturasIds.length === 0) {
        listaCandidaturas.innerHTML = '<p>Nenhuma candidatura encontrada.</p>';
    } else {
        candidaturasIds.forEach(id => {
            const vaga = vagas.find(v => v.id == id);
            if (vaga) {
                const vagaElement = document.createElement('div');
                vagaElement.className = 'vaga-item';
                vagaElement.innerHTML = `
                    <h3>${vaga.titulo}</h3>
                    <p>${vaga.descricao}</p>
                `;
                listaCandidaturas.appendChild(vagaElement);
            }
        });
    }
});

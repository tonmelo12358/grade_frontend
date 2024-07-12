// Evento para capturar o envio do formulário de pesquisa
document.getElementById('searchForm').addEventListener('submit', function(event) {
    event.preventDefault();

    var title = document.getElementById('movieTitle').value.trim();
    var imdbID = document.getElementById('imdbID').value.trim();

    var apiUrl = 'http://www.omdbapi.com/?apikey=2062843&';

    // Se o ID IMDB estiver preenchido, busca pelo ID, caso contrário, busca pelo título
    if (imdbID) {
        apiUrl += 'i=' + encodeURIComponent(imdbID);
    } else if (title) {
        apiUrl += 's=' + encodeURIComponent(title);
    } else {
        alert('Por favor, insira pelo menos um título ou ID IMDB para realizar a busca.');
        return;
    }

    // Limpar os resultados de pesquisa anteriores
    document.querySelector('.searchResults').innerHTML = '';
    document.querySelector('.searchResults').style.display = 'flex'; // Garantir que os resultados sejam exibidos

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.Response === 'True') {
                // Se a busca foi feita pelo título, use a lista de resultados
                if (data.Search) {
                    data.Search.forEach(movie => {
                        var movieCard = `
                            <div class="movieCard">
                                <img src="${movie.Poster}" alt="${movie.Title}">
                                <div class="movieDetails">
                                    <h3>${movie.Title}</h3>
                                    <p>Ano: ${movie.Year}</p>
                                    <button class="selectBtn" data-imdbid="${movie.imdbID}">Selecionar</button>
                                </div>
                            </div>
                        `;
                        document.querySelector('.searchResults').innerHTML += movieCard;
                    });

                    // Redefinir os eventos de clique nos botões de seleção
                    addSelectEventListeners();
                } else {
                    // Se a busca foi feita pelo ID IMDB, exiba o único resultado
                    displayMovieDetails(data);
                }
            } else {
                document.querySelector('.searchResults').innerHTML = '<p>Nenhum filme encontrado.</p>';
            }
        })
        .catch(error => console.error('Erro ao buscar filmes:', error));
});

// Função para adicionar eventos de clique nos botões de seleção
function addSelectEventListeners() {
    document.querySelectorAll('.selectBtn').forEach(button => {
        button.addEventListener('click', function() {
            var imdbID = this.getAttribute('data-imdbid');
            var detailsUrl = 'http://www.omdbapi.com/?apikey=2062843&i=' + imdbID;

            fetch(detailsUrl)
                .then(response => response.json())
                .then(movieDetails => {
                    displayMovieDetails(movieDetails);
                })
                .catch(error => console.error('Erro ao obter detalhes do filme:', error));
        });
    });
}

function displayMovieDetails(movie) {
    var movieDetailsContainer = document.getElementById('movieDetailsContainer');
    var movieDetailsPoster = document.getElementById('movieDetailsPoster');
    var movieDetailsTitle = document.getElementById('movieDetailsTitle');
    var movieDetailsYear = document.getElementById('movieDetailsYear');
    var movieDetailsRuntime = document.getElementById('movieDetailsRuntime');
    var movieDetailsPlot = document.getElementById('movieDetailsPlot');
    var movieDetailsDirector = document.getElementById('movieDetailsDirector');
    var movieDetailsActors = document.getElementById('movieDetailsActors');
    var movieDetailsRating = document.getElementById('movieDetailsRating');

    movieDetailsPoster.src = movie.Poster;
    movieDetailsTitle.textContent = movie.Title;
    movieDetailsYear.textContent = movie.Year;
    movieDetailsRuntime.textContent = movie.Runtime;
    movieDetailsPlot.textContent = movie.Plot;
    movieDetailsDirector.textContent = movie.Director;
    movieDetailsActors.textContent = movie.Actors;
    movieDetailsRating.textContent = movie.imdbRating;

    movieDetailsContainer.style.display = 'flex';

    // Botão de fechar
    document.getElementById('closeDetails').addEventListener('click', function() {
        movieDetailsContainer.style.display = 'none';
    });

    // Botão de adicionar
    document.getElementById('addToSchedule').addEventListener('click', function() {
        document.getElementById('scheduleTitle').value = movie.Title;
        document.getElementById('duration').value = parseInt(movie.Runtime); // Converte "Runtime" para minutos

        movieDetailsContainer.style.display = 'none';

        // Ocultar os resultados da pesquisa após selecionar um filme
        document.querySelector('.searchResults').style.display = 'none';
    });
}

// Evento para capturar o envio do formulário de agendamento
document.getElementById('scheduleForm').addEventListener('submit', function(event) {
    event.preventDefault();

    var scheduleTitle = document.getElementById('scheduleTitle').value;
    var scheduleDate = document.getElementById('scheduleDate').value;
    var startTime = document.getElementById('startTime').value;
    var duration = document.getElementById('duration').value;
    var endTime = document.getElementById('endTime').value;

    if (!scheduleTitle || !scheduleDate || !startTime || !duration) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
    }

   // Formatar a data sem ajustes de fuso horário
   var dateParts = scheduleDate.split('-');
   var formattedDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0].slice(-2)}`;


    var formData = new FormData();
    formData.append('titulo', scheduleTitle);
    formData.append('data_exib', formattedDate);
    formData.append('inicio_exib', startTime);
    formData.append('duracao', parseInt(duration, 10));
    formData.append('fim_exib', endTime);

    console.log('Dados enviados:', formData);

    fetch('http://localhost:5000/item_grade', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json().then(data => ({ status: response.status, body: data })))
    .then(({ status, body }) => {
        if (status === 200) {
            alert('Item adicionado à grade com sucesso!');
            var loadDataButton = document.getElementById('loadDataButton');
           // Verificar se uma data foi selecionada antes de tentar carregar os dados
           if (document.getElementById('ganttDate').value) {
            loadDataButton.click();
        }
        } else {
            alert(body.message || 'Erro ao adicionar item à grade');
        }
    })
    .catch(error => {
        console.error('Erro ao adicionar item à grade:', error);
    });
});

// Função para deletar item
function deleteItem(id) {
    fetch(`http://localhost:5000/item_grade?id_item=${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Erro ao deletar o item de grade');
        }
    })
    .then(data => {
        alert(data.message);
        // Recarregar os dados da tabela após a exclusão
        var loadDataButton = document.getElementById('loadDataButton');
        loadDataButton.click();
    })
    .catch(error => {
        console.error('Erro ao deletar o item de grade:', error);
    });
}

// Função para calcular o horário de término com base no horário de início e duração
document.getElementById('startTime').addEventListener('input', calculateEndTime);
document.getElementById('duration').addEventListener('input', calculateEndTime);

function calculateEndTime() {
    var startTime = document.getElementById('startTime').value;
    var duration = document.getElementById('duration').value;

    if (startTime && duration) {
        var [startHours, startMinutes] = startTime.split(':').map(Number);
        var durationMinutes = parseInt(duration, 10);

        if (!isNaN(startHours) && !isNaN(startMinutes) && !isNaN(durationMinutes)) {
            var endMinutes = startMinutes + durationMinutes;
            var endHours = startHours + Math.floor(endMinutes / 60);
            endMinutes = endMinutes % 60;
            endHours = endHours % 24;

            var endHoursStr = endHours.toString().padStart(2, '0');
            var endMinutesStr = endMinutes.toString().padStart(2, '0');

            document.getElementById('endTime').value = `${endHoursStr}:${endMinutesStr}`;
            console.log("Calculated end time:", document.getElementById('endTime').value); // Log de verificação
        }
    }
}

// Evento para capturar o envio do formulário de agendamento
let ganttChart = null;

document.getElementById('loadDataButton').addEventListener('click', function() {
    var scheduleDate = document.getElementById('ganttDate').value;

    if (!scheduleDate) {
        alert('Por favor, selecione uma data para carregar a tabela.');
        return;
    }

    // Formatar a data selecionada para dd/mm/aa
    var dateParts = scheduleDate.split('-');
    var formattedDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0].slice(-2)}`;

    fetch(`http://localhost:5000/itens_grade/data_exib?data_exib=${formattedDate}`)
        .then(response => response.json())
        .then(data => {
            console.log('Dados recebidos:', data); // Adiciona um log para verificar os dados

            const tableBody = document.querySelector('#scheduleTable tbody');
            const noItemsMessage = document.getElementById('noItemsMessage');
            tableBody.innerHTML = ''; // Limpar tabela

            if (noItemsMessage) {
                noItemsMessage.remove();
            }

            if (data.itens_grade && data.itens_grade.length > 0) {
                // Ordenar os itens de grade por hora de início (crescente)
                data.itens_grade.sort((a, b) => convertTimeToMinutes(a.inicio_exib) - convertTimeToMinutes(b.inicio_exib));

                data.itens_grade.forEach(item => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${item.titulo}</td>
                        <td>${item.data_exib}</td>
                        <td>${item.inicio_exib}</td>
                        <td>${item.fim_exib}</td>
                        <td>${item.duracao}</td>
                        <td>
                            <button class="deleteButton" data-id="${item.id_item}">Excluir</button>
                        </td>
                    `;
                    tableBody.appendChild(row);
                });

                // Adiciona evento de clique aos botões de exclusão
                document.querySelectorAll('.deleteButton').forEach(button => {
                    button.addEventListener('click', function() {
                        var itemId = this.getAttribute('data-id');
                        deleteItem(itemId);
                    });
                });
            } else {
                const message = document.createElement('p');
                message.id = 'noItemsMessage';
                message.textContent = 'Não existem itens cadastrados para a data selecionada';
                message.classList.add('no-items-message');
                document.querySelector('.tableContainer').appendChild(message);
            }
        })
        .catch(error => {
            console.error('Erro ao carregar os dados da tabela:', error);
        });
});

// Função para converter uma hora no formato HH:MM para minutos
function convertTimeToMinutes(time) {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
}

const apiKey = 'chave da api'
const apiUrl = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=pt-BR&page=1`
const imageBaseUrl = 'https://image.tmdb.org/t/p/w500'

const inputPesquisar = document.getElementById('search-input')
const btnPesquisar = document.getElementById('search-button')
const containerResultados = document.getElementById('results-container')

const pageRandom = Math.floor(Math.random() * 500) + 1
const apiUrlRandom = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=pt-BR&page=${pageRandom}`


function TelaFilme (Filmes) {
    containerResultados.innerHTML = ''

    if(Filmes.lenght === 0) {
        containerResultados.innerHTML = '<h2>Nenhum filme encontrado</h2>'
        return
    }

    Filmes.forEach(filme => {

        const dataLancamento = filme.release_date ? filme.release_date.split('-')[0] : 'Desconhecido'

        const filmeCardHTML = `
            <div class="card-Resultado">
                <div class="rating-container">
                    <div class="ratingEstrela">⭐ ${filme.vote_average.toFixed(1)}</div>
                </div>
                <img src="${filme.poster_path ? imageBaseUrl + filme.poster_path : 'https://avatars.githubusercontent.com/u/45665895?v=4'}" alt="Poster do Filme ${filme.title}">
                <h3>${filme.title}</h3>
                <div class="detalhesFilme">
                    <p>Ano: ${dataLancamento}</p>
                </div>
                <p>${filme.overview.substring(0, 100)}...</p>
                <button class="btnDetalhes" data-id="${filme.id}">Detalhes</button>
            </div>`

        containerResultados.innerHTML += filmeCardHTML
    })
}

async function fetchFilmesPopulares() {
    try{
        const url = apiUrlRandom
        const response = await fetch(url)
        const data = await response.json()
        TelaFilme(data.results)
    } catch (error) {
        console.error('Erro ao buscar filmes populares:', error)
        containerResultados.innerHTML = '<h2>Erro ao carregar filmes populares. Tente novamente mais tarde.</h2>'
    }
}

fetchFilmesPopulares()

// Pesquisar os filmes

async function pesquisarFilmes(query){

    containerResultados.innerHTML = '<p>Carregando...</p>'

    try{

        const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=pt-BR&query=${encodeURIComponent(query)}&page=1&include_adult=false`

        const response = await fetch(url)
        const data = await response.json()
        TelaFilme(data.results)

    }catch (err){
        console.error('Erro ao pesquisar filmes:', err)
        containerResultados.innerHTML = '<h2>Erro ao pesquisar filmes. Tente novamente mais tarde.</h2>'
    }
}

function eventoPesquisando() {


    const nomeFilmePesquisado = inputPesquisar.value.trim()

    if(nomeFilmePesquisado !== ''){

        pesquisarFilmes(nomeFilmePesquisado)
    }else{

        fetchFilmesPopulares()
    }
}

btnPesquisar.addEventListener('click', eventoPesquisando)

inputPesquisar.addEventListener('keydown', (event) => {
    if(event.key === "Enter"){
        eventoPesquisando()
    }
})


const API_KEY = `b4e59077eed37925947989634404ea03`
const image_path = `https://image.tmdb.org/t/p/w500`
const genero = `https://api.themoviedb.org/3/genre/movie/list?api_key=b4e59077eed37925947989634404ea03&language=en-US`

const trending_el = document.querySelector('.trending .movies-grid')
const main_grid = document.querySelector('.favorites .movies-grid')

get_trending_movies()
async function get_trending_movies () {
    const resp = await fetch(`https://api.themoviedb.org/3/trending/all/day?api_key=${API_KEY}`)
    const respData = await resp.json()
    return respData.results
}

add_to_dom_trending()
async function add_to_dom_trending () {

    const data = await get_trending_movies()
    console.log(data);

    trending_el.innerHTML = data.slice(0, 5).map(e => {
        return `
            <div class="card" data-id="${e.id}">
                <div class="img">
                    <img src="${image_path + e.poster_path}">
                </div>
                <div class="info">
                    <h2>${e.title}</h2>

                    <div class="single-info">
                        <span>Sinopsis: </span>
                        <span>${e.overview}</span>
                    </div>
                    <div class="single-info">
                        <span>Géneros: </span>
                        <span>${e.genero}</span>
                    </div>

                    <div class="single-info">
                        <span>Lenguaje original: </span>
                        <span>${e.original_language}</span>
                    </div>

                    <div class="single-info">
                    <span>Fecha de estreno: </span>
                    <span>${e.release_date}</span>
                </div>

                    <div class="single-info">
                        <span>Puntuación: </span>
                        <span>${e.vote_average}</span>
                    </div>
                </div>
            </div>
        `
    }).join('')

    //LocalStorage
function get_LS () {
    const movie_ids = JSON.parse(localStorage.getItem('movie-id'))
    return movie_ids === null ? [] : movie_ids
}
function add_to_LS (id) {
    const movie_ids = get_LS()
    localStorage.setItem('movie-id', JSON.stringify([...movie_ids, id]))
}
function remove_LS (id) {
    const movie_ids = get_LS()
    localStorage.setItem('movie-id', JSON.stringify(movie_ids.filter(e => e !== id)))
}


    //El lío de los favoritos

    const heart_icon = corazon.querySelector('.heart-icon')

    const movie_ids = get_LS()
    for(let i = 0; i <= movie_ids.length; i++) {
        if (movie_ids[i] == movie_id) heart_icon.classList.add('change-color')
    }

    heart_icon.addEventListener('click', () => {
        if(heart_icon.classList.contains('change-color')) {
            remove_LS(movie_id)
            heart_icon.classList.remove('change-color')
        } else {
            add_to_LS(movie_id)
            heart_icon.classList.add('change-color')
        }
        fetch_favorite_movies()
    })
}

// Favorite Movies
fetch_favorite_movies()
async function fetch_favorite_movies () {
    main_grid.innerHTML = ''

    const movies_LS = await get_LS()
    const movies = []
    for(let i = 0; i <= movies_LS.length - 1; i++) {
        const movie_id = movies_LS[i]
        let movie = await get_movie_by_id(movie_id)
        add_favorites_to_dom_from_LS(movie)
        movies.push(movie)
    }
}

function add_favorites_to_dom_from_LS (movie_data) {
    main_grid.innerHTML += `
        <div class="card" data-id="${movie_data.id}">
            <div class="img">
                <img src="${image_path + movie_data.poster_path}">
            </div>
            <div class="info">
                <h2>${movie_data.title}</h2>
                <div class="single-info">
                    <span>Rate: </span>
                    <span>${movie_data.vote_average} / 10</span>
                </div>
                <div class="single-info">
                    <span>Release Date: </span>
                    <span>${movie_data.release_date}</span>
                </div>
            </div>
        </div>
    `

    const cards = document.querySelectorAll('.card')
    add_click_effect_to_card(cards)
}

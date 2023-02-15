// ------------------------------------------------ //
// ----------------- IMPORTANTE ----------------- //
// ------------------------------------------------ //
// Si descomentas que se guarden todos los datos de la película en el local storage no funcionará bien
// Tienes que comentar el de guardar ID y descomentar el de guardar todos los datos
// si vas a hacer lo contrario, tienes que comentar el de guardar todos los datos y descomentar el de guardar ID

// Unos pequetips:
// Para comentar y descomentar con atajos de teclado:
//     - Comentar: Ctrl + K + C
//     - Descomentar: Ctrl + K + U
// Para comentar y descomentar bloques de código (seleccionar el bloque y hacer lo siguiente)):
//     - Comentar: Ctrl + Shift + A
//     - Descomentar: Ctrl + Shift + A
// Para borrar una línea: Ctrl + D
// Para copiar una línea: Ctrl + C
// Para pegar una línea: Ctrl + V
// Para mover una línea: Alt + ↑/↓
// Para duplicar una línea: Alt + Shift + ↑/↓
// Formatear todo el documento (usalo mucho): Alt + Shift + F


const LANGUAGE = { "en": "Inglés", "es": "Español", "fr": "Francés" };
const API_KEY = `b4e59077eed37925947989634404ea03`
const image_path = `https://image.tmdb.org/t/p/w500`
const genero = `https://api.themoviedb.org/3/genre/movie/list?api_key=b4e59077eed37925947989634404ea03&language=en-US`

const trending_el = document.querySelector('.trending .movies-grid')
const main_grid = document.querySelector('.favorites .movies-grid')

get_trending_movies()
async function get_trending_movies() {
    const resp = await fetch(`https://api.themoviedb.org/3/trending/all/day?api_key=${API_KEY}&language=es-EN`)
    const respData = await resp.json()
    return respData.results
}

get_genero()
async function get_genero() {
    const resp = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=es-EN`)
    const respData = await resp.json()
    return respData.genres
}

async function get_movie_by_id(id) {
    const resp = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=es-EN`)
    const respData = await resp.json()
    return respData
}

add_to_dom_trending()
async function add_to_dom_trending() {

    const data = await get_trending_movies()
    const generos = await get_genero()

    trending_el.innerHTML = data.slice(0, 5).map(e => {
        const genero = generos.find(g => g.id === e.genre_ids[0]).name
        return `
            <div class="card" data-id="${e.id}">
                <div class="img">
                    <img src="${image_path + e.poster_path}">
                </div>
                <div class="info">
                    
                    <a class="add-fav" data-id_movie="${e.id}" style="float: left;"><img src="icons/heart.svg" alt=""></a>
                    

                    <h2>${e.title ? e.title : e.name}</h2>

                    <div class="single-info">
                        <span>Sinopsis: </span>
                        <span>${e.overview}</span>
                    </div>
                    <div class="single-info">
                        <span>Géneros: </span>
                        <span>${genero}</span>
                    </div>

                    <div class="single-info">
                        <span>Lenguaje original: </span>
                        <span>${LANGUAGE[e.original_language]}</span>
                    </div>

                    <div class="single-info">
                    <span>Fecha de estreno: </span>
                    <span>${e.release_date ? e.release_date : 'Por determinar'}</span>
                </div>

                    <div class="single-info">
                        <span>Puntuación: </span>
                        <span>${e.vote_average}</span>
                    </div>
                </div>
            </div>
        `
    }).join('')

    // ----------------------- SE APLICA SOLO PARA CUANDO PONER EL ID EN EL LOCAL STORAGE ----------------------- //
    const movie_ids = JSON.parse(localStorage.getItem('movie-id'))
    if (movie_ids !== null) {
        movie_ids.forEach(id => {
            const id_movie = document.querySelector(`[data-id_movie="${id}"]`)
            if (id_movie !== null) {
                id_movie.querySelector('img').src = '/icons/heart-fill.svg'
            }
        })
    }
    // ------------------- FIN DE "SE APLICA SOLO PARA CUANDO PONER EL ID EN EL LOCAL STORAGE" ------------------- //



    // ------------------- SE APLICA AL PASARSE LOS DATOS DE TODA LA PELÍCULA AL LOCAL STORAGE ------------------- //
    // Al cargar la página que compruebe si hay elementos en el local storage ('movie') si hay añadir el botón de favoritos relleno
    /* const movies = JSON.parse(localStorage.getItem('movie'))
    if (movies !== null) {
        //Recorrer el movies buscando que el id del data-id_movie coincida con el id de la película, si es así, rellena el icono del corazón
        movies.forEach(movie => {
            const id_movie = document.querySelector(`[data-id_movie="${movie.id}"]`)
            if (id_movie !== null) {
                id_movie.querySelector('img').src = '/icons/heart-fill.svg'
            }
        })
    } */
    // ------------------- FIN DE "SE APLICA AL PASARSE LOS DATOS DE TODA LA PELÍCULA AL LOCAL STORAGE" ------------------- //



    // Obtener todos los botones con la clase "add-fav"
    const botones = document.querySelectorAll('.add-fav');

    // Añadir un event listener a cada botón
    botones.forEach(boton => {
        boton.addEventListener('click', () => {
            // Obtener el valor de "data-id_movie" del botón actual
            const idMovie = boton.getAttribute('data-id_movie');
            /* Comprobar si el path de la imágen es /icons/heart-fill.svg */
            if (boton.querySelector('img').src.includes('/icons/heart-fill.svg')) {
                boton.querySelector('img').src = '/icons/heart.svg'
                remove_LS(idMovie);
                return
            } else {
                boton.querySelector('img').src = '/icons/heart-fill.svg'
                modify_fav_LS(idMovie);
            }

        });
    });

    // ----------------- AÑADE ID DE LA PELÍCULA A LOCALSTORAGE ----------------- //
    function get_LS() {
        const movie_ids = JSON.parse(localStorage.getItem('movie-id'))
        return movie_ids === null ? [] : movie_ids
    }

    function modify_fav_LS(id) {
        const movie_ids = get_LS()
        for (let i = 0; i <= movie_ids.length; i++) {
            // si movie_ids[i] == id borrar en el local storage el elemento
            if (movie_ids[i] == id) {
                remove_LS(id)
                return
            }
        }
        localStorage.setItem('movie-id', JSON.stringify([...movie_ids, id]))
    }


    function remove_LS(id) {
        const movie_ids = get_LS()
        localStorage.setItem('movie-id', JSON.stringify(movie_ids.filter(e => e !== id)))
    }
    // ----------------- FIN DE "AÑADE ID DE LA PELÍCULA A LOCALSTORAGE" ----------------- //


    // ----------------- AÑADE TODOS LOS DATOS DE LA PELÍCULA AL LOCALSTORAGE ----------------- //
    // Obten los datos del local storage
    /* function get_LS() {
        const movie_ids = JSON.parse(localStorage.getItem('movie')) || []
        console.log(movie_ids)
        return movie_ids
    }

    //Consigue todos los datos de la película pasando la variable id usando función "get_movie_by_id(id)" y almacénala dentro de un array en el nombre movies
    function modify_fav_LS(id) {
        const movie_ids = get_LS()
        //Hacer una llamada para conseguir todos los datos de la película
        get_movie_by_id(id).then(movie => {
            //Añadir el objeto movie al array movies
            movie_ids.push(movie)
            //Guardar el array movies en el local storage
            localStorage.setItem('movie', JSON.stringify(movie_ids))

        })
    }

    function remove_LS(id) {
        const movie_ids = get_LS()
        const movie = movie_ids.find(m => m.id == id)
        const index = movie_ids.indexOf(movie)
        movie_ids.splice(index, 1)
        localStorage.setItem('movie', JSON.stringify(movie_ids))
    } */
    // ----------------- FIN DE "AÑADE TODOS LOS DATOS DE LA PELÍCULA AL LOCALSTORAGE" ----------------- //


}

// -------------------- SE APLICA PASANDO EL ID DE LA PELÍCULA ---------------------- //
// Crea una función que a través del ID devuelva los datos de la película
if (document.querySelector('.movies-container.favorites')) {
    // Crea una función que llame a la API y devuelva los datos de la película
    async function fetch_favorite_movies() {
        const movie_ids = JSON.parse(localStorage.getItem('movie-id'))
        //llamar a la función get_movie_by_id(id) para cada id de la lista movie_ids
        movie_ids.forEach(id => {
            get_movie_by_id(id).then(movie => {
                add_favorites_to_dom_from_LS(movie)
            })
        })
    }
}
// -------------------- FIN DE "SE APLICA PASANDO EL ID DE LA PELÍCULA" ---------------------- //


// Favorite Movies
// LA FUNCIÓN ESTÁ EN EL ARCHIVO "tempscript.js" cod 2

// ---------------------- SE APLICA PASANDO LOS DATOS DE LA PELÍCULA ---------------------- //
// Si la página ha cargado y existe 1 div con las clases movies-container favorites entonces ejecuta la función
/* if (document.querySelector('.movies-container.favorites')) {
    //Crea una función que recoja los datos del local storage y los ponga en la página de favoritos
    function fetch_favorite_movies() {
        //Obtener los datos del local storage
        const movies = JSON.parse(localStorage.getItem('movie'))
        //Borrar los datos de la página de favoritos
        document.getElementById("fav-movies").innerHTML = ''
        //Añadir los datos del local storage a la página de favoritos
        movies.forEach(movie => add_favorites_to_dom_from_LS(movie))
    }
} */
// ---------------------- FIN DE "SE APLICA PASANDO LOS DATOS DE LA PELÍCULA" ---------------------- //

// Poner las películas de dentro del local storage en la página de favoritos
function add_favorites_to_dom_from_LS(movie_data) {
    return document.getElementById("fav-movies").innerHTML += `
    <div class="card" data-id="${movie_data.id}">
        <div class="img">
            <img src="${image_path + movie_data.poster_path}">
        </div>
        <div class="info">
            
            <a class="add-fav" data-id_movie="${movie_data.id}" style="float: left;"><img src="icons/heart.svg" alt=""></a>
            

            <h2>${movie_data.title ? movie_data.title : movie_data.name}</h2>

            <div class="single-info">
                <span>Sinopsis: </span>
                <span>${movie_data.overview}</span>
            </div>
            <div class="single-info">
                <span>Géneros: </span>
                <span>${genero}</span>
            </div>

            <div class="single-info">
                <span>Lenguaje original: </span>
                <span>${LANGUAGE[movie_data.original_language]}</span>
            </div>

            <div class="single-info">
            <span>Fecha de estreno: </span>
            <span>${movie_data.release_date ? movie_data.release_date : 'Por determinar'}</span>
        </div>

            <div class="single-info">
                <span>Puntuación: </span>
                <span>${movie_data.vote_average}</span>
            </div>
        </div>
    </div>
`
}

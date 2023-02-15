// cod-- 1
function modify_fav_LS(id) {
    console.log(get_LS());
    const movie_ids = get_LS()
    for (let i = 0; i <= movie_ids.length; i++) {
        /* si movie_ids[i] == id borrar en el local storage el elemento */
        if (movie_ids[i] == id) {
            remove_LS(id)
            return
        }
        /* if (movie_ids[i] == id) return */
    }
    let movie = get_movie_by_id(id)
    localStorage.setItem('movie-' + id, JSON.stringify(movie))
}

// cod-- 2
fetch_favorite_movies()
async function fetch_favorite_movies() {
    main_grid.innerHTML = ''

    const movies_LS = await get_LS()
    const movies = []
    for (let i = 0; i <= movies_LS.length - 1; i++) {
        const movie_id = movies_LS[i]
        let movie = await get_movie_by_id(movie_id)
        add_favorites_to_dom_from_LS(movie)
        movies.push(movie)
    }
}

// Esto era para rellenar el corazón si tiene favoritos, eso ya está hecho
for (let i = 0; i <= movie_ids.length - 1; i++) {
    const id = movie_ids[i]
    const boton = document.querySelector(`.add-fav[data-id_movie="${id}"]`)
    boton.querySelector('img').src = '/icons/heart-fill.svg'
}
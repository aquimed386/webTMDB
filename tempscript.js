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
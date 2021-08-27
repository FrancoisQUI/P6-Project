class Movie {
    constructor(movie_data) {
        this.title = movie_data.title
        this.url = movie_data.url
        this.imdb_url = movie_data.imdb_url
        this.year = movie_data.year
        this.imdb_score = movie_data.imdb_score
        this.directors = movie_data.directors
        this.actors = movie_data.actors
        this.writers = movie_data.writers
        this.genres = movie_data.genres
    }

    get_more_datas(data) {
        console.log(data)
        this.image_url = data.image_url
        this.description = data.description
    }

    viewAsMain(){
        document.querySelector(".best-movie-pres__img").src = this.image_url;
        document.querySelector(".best-movie-pres__title").innerHTML = this.title;
        document.querySelector(".best-movie-pres__abstract").innerHTML = this.description;
    }
}


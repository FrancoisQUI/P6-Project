const API_URL = "http://127.0.0.1:8000/"
// TODO: Update this when the finale version will be online,
// must end by "/"
const FAVORITES_MOVIE_GENRE = ["Best", "Adventure", "Animation", "Family"]
// le genre "Best" comprend tous les films => pas prévu dans l'API mais ajouté dans ce script

async function CreateBestImdbMovieElement(apiUrl){
    fetch(apiUrl + 'api/v1/titles/?imdb_score_min=9&sort_by=-imdb_score&page_size=10')
        .then(response => response.json())
        .then(data => {
            let film = data.results[0];
            fetch(film.url)
                .then(response => response.json())
                .then(async data => {
                    film.info = data
                    document.querySelector(".best-movie-pres__title").innerHTML = film.title
                    document.querySelector(".best-movie-pres__abstract").innerHTML = film.info.description
                    document.querySelector(".best-movie-pres__img-back").src = film.info.image_url
                    document.querySelector(".best-movie-pres__img-thumb").src = film.info.image_url
                    document.querySelector(".best-movie-pres").setAttribute("data-url", film.info.url)
                    document.querySelector(".best-movie-pres").addEventListener("click", evt => showModal(evt) )
                })
        })
}

async function CreateCategoryMoviesElement(apiUrl, genre) {
    /* Génération de la div qui contiendra les 7 films du genre donné */
    const body = document.querySelector("body")
    const template = document.querySelector("#film-group-section-template")
    const section = document.importNode(template.content, true)
    const filmContainer = section.querySelector(".film-container")
    section.querySelector("section").id = genre
    section.querySelector(".film-group_title").innerHTML = genre

    /* Adapte la requête si on souhaite les meilleurs films sans catégorie */
    let request = ""
    if (genre === "Best") {
        request = `${apiUrl}api/v1/titles/?page_size=7&sort_by=imdb_score`
    } else {
        request = `${apiUrl}api/v1/titles/?page_size=7&genre=${genre}&sort_by=imdb_score`
    }

    /* Récupère les 7 films les mieux notés du genre */
    fetch(request)
        .then(response => response.json())
        .then(async data => {
            let filmList = data["results"]
            /* Parcours chaque film de la liste */
            for await (const film of filmList) {
                /* Récupère toutes les informations du film*/
                fetch(film.url)
                    .then(response => response.json())
                    .then(data => {
                        generateMovieCard(data, filmContainer)
                        }
                    )
            }
        })
    body.appendChild(section)

    async function generateMovieCard(data, destDiv) {
        /* Génération du DOM pour le film */
        const filmTemplate = document.getElementById("movie-card-template")
        const card = document.importNode(filmTemplate.content, true)
        if (data.image_url == null) {
            data.image_url = "./img/movie-placeholder.png"
        }
        card.querySelector(".film-container__movie-pic").src = data.image_url
        card.querySelector(".film-container__movie-back").src = data.image_url
        card.querySelector(".film-container__movie-title").innerHTML = data.title
        card.querySelector(".film-container__movie-card").setAttribute("data-url", data.url)
        card.querySelector(".film-container__movie-card").addEventListener("click", evt => showModal(evt))
        destDiv.appendChild(card)
    }
}


function showModal(evt) {
    //info-url : evt.target.offsetParent.dataset.url
    console.log(evt)
    fetch(evt.target.offsetParent.dataset.url)
        .then(response => response.json())
        .then(async data => {
            let filmInfo = data
            if (document.querySelector("#modal") !== null) {
                document.querySelector("#modal").remove() }
            const body = document.querySelector("body")
            const modalTemplate = document.querySelector("#modal-template")
            const modal = document.importNode(modalTemplate.content, true)
            // Titre
            modal.querySelector(".modal-movie_title").innerHTML = filmInfo.title
            // Image
            modal.querySelector("img").src = filmInfo.image_url
            // Genres
            await generateList(".modal__movie-genres", filmInfo.genres, modal)
            //Date de sortie
            modal.querySelector(".modal__release-date").innerHTML = filmInfo.date_published
            // Rated
            modal.querySelector(".modal__rated").innerHTML = filmInfo.rated
            // Imdb
            modal.querySelector(".modal__imdb").innerHTML = filmInfo.imdb_score
            // Réalisateur
            await generateList(".modal__director", filmInfo.directors, modal)
            // Acteurs
            await generateList(".modal__actors", filmInfo.actors, modal)
            // Durée
            modal.querySelector(".modal__duration").innerHTML = filmInfo.duration
            // Pays
            await generateList(".modal__countries", filmInfo.countries, modal)
            // Box Office
            modal.querySelector(".modal__gross-usa").innerHTML = filmInfo.usa_gross_income
            modal.querySelector(".modal__gross-ww").innerHTML = filmInfo.worldwide_gross_income
            // Résumé
            modal.querySelector(".modal__description").innerHTML = filmInfo.long_description

            // Event de fermeture  de la modale si click sur le bouton
            modal.querySelector(".close-btn")
                .addEventListener("click", evt => document.querySelector("#modal").remove())
            body.appendChild(modal)

        })

    function generateList(parentNode, info, modal){
        const domList = modal.querySelector(parentNode)
        for (const item of info) {
            const element = document.createElement("li")
            element.innerHTML = item
            domList.appendChild(element)
        }
        return this
    }
}

async function GenerateMovieSectionsButtons(){
    const sections = document.querySelectorAll(".film-group .container")
    for (const section of sections) {
        const filmContainer = section.querySelector(".film-container")
        const left = document.createElement("div")
        const right = document.createElement("div")
        left.innerHTML = "<"
        right.innerHTML = ">"
        left.setAttribute("class", "arrow arrow__left")
        right.setAttribute("class", "arrow arrow__right")
        section.insertBefore(left, filmContainer)
        section.appendChild(right)
        left.addEventListener("click", () => {
            console.log(section.scrollLeft)
            section.scroll({left: section.scrollLeft + 600, behavior:"smooth"})
        })
        right.addEventListener("click", () => {
            section.scroll({left: section.scrollLeft - 600, behavior:"smooth"})
        })
    }
}



CreateBestImdbMovieElement(API_URL).then(()=> console.log("best movie - computed"))

for (const genre of FAVORITES_MOVIE_GENRE) {
    CreateCategoryMoviesElement(API_URL, genre).then(genre => console.log(genre + "computed"))
}

GenerateMovieSectionsButtons().then(() => console.log("arrows - generated"))


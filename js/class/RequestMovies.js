export class RequestMovies {
    constructor(mainUrl, type_of_request, params) {
        switch (type_of_request) {
            case 'Top Imdb Rank':
                fetch(mainUrl + 'api/v1/titles/?imdb_score_min=9&sort_by=imdb_score&page_size=10')
                    .then(response => response.json())
                    .then(data => {
                        this.informations = data["results"][0]
                        this.movie = new Movie(this.informations)
                        fetch(this.movie.url)
                            .then(response => response.json())
                            .then(data => {
                                console.log(data)
                                this.movie.get_more_datas(data)
                            })
                            .then(() => console.log(this.movie))
                    })
                    .then(() => this.movie.viewAsMain())
                    .then(() => console.log(this.movie))
                break;
            case 'Category View':


                break;
            default:
                break;
        }
    }
}
import Card from "./Card"


export default function MovieContent(props) {

    return (
        <div className="flex overflow-auto bg-black bg-opacity-30 rounded-lg px-4 ">
            {props && props.url.map((movie, index) => (
                <div key={index} className="mt-8 mb-3 mx-5 transition ease-in-out">
                    <Card
                        name={movie.name || movie.title}
                        image={"https://image.tmdb.org/t/p/w500" + (movie.poster_path || movie.backdrop_path)}
                        overview={movie.overview}
                        rating={movie.vote_average}
                        releaseDate={movie.release_date || movie.first_air_date}
                    />
                </div>
            ))}
        </div>
    )
}
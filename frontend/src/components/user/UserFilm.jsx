import { useState } from "react";
import { useEffect } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { getAll, getSorted } from "../../api/review";
import Background from "../Background";
import Container from "../Container";
import RatingModal from "../modals/RatingModal";
import Navbar from "../Navbar";
import SortBy from "./SortBy";
import LoadingImage from "../utils/LoadingImage";


export default function UserFilm() {
    document.title = "My Reviews • TCDb";
    const [allReviews, setAllReviews] = useState([])
    const [displayModal, setDisplayModal] = useState(false)
    const [selectedReviewData, setSelectedReviewData] = useState({})
    const [selected, setSelected] = useState("movieRelease")
    const [sortValue, setSortValue] = useState(-1)
    const [loadedImages, setLoadedImages] = useState({})

    // grabs movie data from TMDB 
    const grabData = async (movieType, movieId) => {
        const response = await fetch(`https://api.themoviedb.org/3/${movieType}/${movieId}?api_key=${process.env.REACT_APP_TMDB_API_KEY}`)
        const data = await response.json()
        return data
    }

    // grabs data from clicked movie, opens modal, and sets state
    const toggleModal = async (index) => {
        const mediaType = allReviews[index].movieType
        const id = allReviews[index].movieId
        const data = await grabData(mediaType, id)

        setSelectedReviewData({
            "title": data.title || data.name,
            "releaseDate": data.release_date || data.first_air_date,
            "imgPath": data.poster_path || data.backdrop_path,
            "reviewDetails": allReviews[index],
        })
        setDisplayModal(!displayModal)
        setSelected("movieRelease")
    }


    // sorts movies 
    const sortItems = async (filterTerm, filterValue) => {
        const response = await getSorted(filterTerm, filterValue)
        setSortValue(filterValue)
        setSelected(filterTerm)
        setAllReviews(response)
    }

    // reverses sort order
    const changeSort = () => {
        sortItems(selected, sortValue * -1)
    }


    // refreshes all reviews from db when modal is toggled
    useEffect(() => {
        const grabAllReviews = async () => {
            const response = await getAll()
            setAllReviews(response)
        }
        grabAllReviews()
    }, [displayModal])


    useEffect(() => {
        allReviews.forEach((review) => {
          const img = new Image();
          img.src = `https://image.tmdb.org/t/p/w342${review.imgPath}`;
          img.onload = () => {
            setLoadedImages((prevLoadedImages) => ({ ...prevLoadedImages, [review.movieId]: true }));
          };
        });
    }, [allReviews]);


    return (
        <Background>
            <Navbar />
            <Container>
                <SortBy
                    sortValue={sortValue}
                    changeSort={changeSort}
                    selected={selected}
                    sortItems={sortItems}
                    header="MY FILMS"
                    numItems={allReviews.length} 
                />
                <div className="grid gap-1 md:grid-cols-5 sm:grid-cols-4 xs:grid-cols-3 2xs:grid-cols-2 transition-all">
                    {/* Looping over all user reviews */}
                    {allReviews.length !== 0 && allReviews.map((review, index) => (
                        <div key={index} className="w-40 group relative">
                            <p className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-500 text-gray-200 px-1 rounded group-hover:block whitespace-nowrap space-x-1 hidden transition-all duration-400 border-1">
                                <span>{review.movieName}</span>
                                <span>({review.movieRelease.slice(0, 4)})</span>
                            </p>
                            {!loadedImages[review.movieId] 
                                ? <LoadingImage />
                                : <img
                                    src={`https://image.tmdb.org/t/p/w342${review.imgPath}`}
                                    alt="Poster"
                                    onClick={() => toggleModal(index)}
                                    className="h-60 w-40 min-w-40 box-content rounded-lg border-4 border-slate-400 border-opacity-0 hover:border-opacity-100 transition-all hover:cursor-pointer" 
                                />}
                            <p className="flex items-center justify-center space-x-2 md:space-x-1 sm:space-x-1 lg:space-x-2 ">
                                <span>
                                    Rating:
                                    <span className="bg-slate-600 rounded mx-0.5 px-1 bg-opacity-60 text-white ">
                                        {review.rating}
                                    </span>
                                </span>
                                <span>{review.liked ? <FaHeart className="text-red-400" /> : <FaRegHeart />}</span>
                            </p>
                        </div>
                    ))}
                </div>

                {displayModal &&
                    <RatingModal
                        title={selectedReviewData.title}
                        releaseDate={selectedReviewData.releaseDate}
                        imgPath={selectedReviewData.imgPath}
                        reviewDetails={selectedReviewData.reviewDetails}
                        toggleModal={() => setDisplayModal(!displayModal)}
                    />
                }
            </Container>
        </Background>
    )
}
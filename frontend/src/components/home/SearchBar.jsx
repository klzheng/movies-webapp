import { useEffect } from "react"
import { useState } from "react"
// import image from "../../../public/default.jpg"

export default function SearchBar({ apiUrl, placeholder}) {

    const [search, setSearch] = useState("")
    const [searchResult, setSearchResult] = useState([])

    // grabs API data and returns results
    const requestResultsData = async (query) => {
        const res = await fetch(`${apiUrl + query}`)
        const data = await res.json()
        console.log(data.results)
        return data.results
    }

    // sets search query state to input field
    const handleChange = (e) => {
        if (e.target.value === "") setSearchResult([])
        setSearch(e.target.value)
    }

    // grabs data and stores it if query is valid
    useEffect(() => {
        if (!search) return;
        requestResultsData(search)
            .then(setSearchResult)
    },[search])

    return (
        <div className="relative text-center my-10 ">
            <input
                id="main-search"
                type="text"
                placeholder={placeholder}
                onChange={handleChange}
                value={search}
                className="w-9/12 h-10 rounded-full border-none px-4 text-xl bg-gray-300 outline-none" />
            <button type="submit" className="p-1 mx-2 rounded-full border-none w-10 h-10 bg-gray-300 text-black">
                <i className="fa-solid fa-magnifying-glass"></i>
            </button>
            {/* <img src="/default.jpg" /> */}
            <SearchResults data={searchResult}/>
        </div>
    )
}


const SearchResults = ({ data }) => {

    const getImgUrl = (index) => {
        if (data[index].poster_path) return "https://image.tmdb.org/t/p/w185" + data[index].poster_path
        else if (data[index].backdrop_path) return "https://image.tmdb.org/t/p/w185" + data[index].backdrop_path
        else if (data[index].profile_path) return "https://image.tmdb.org/t/p/w185" + data[index].profile_path
        else return "/default.jpg"
    }

    if (data.length === 0) return null
    return (
        <div className="absolute w-9/12 right-14 left-0 top-10 z-10 bg-gray-400 p-2 max-h-96 space-y-2 drop-shadow-lg overflow-auto mx-auto mt-1 text-left rounded-md text-gray-700 border-2 border-gray-500">
        {data.slice(0,20).map((result, index) => {
            return (
                <div key={index} className="flex font-karla justify-start rounded bg-gray-300 p-2 hover:bg-slate-200 transition">
                    <img 
                        src={getImgUrl(index)} 
                        alt="Poster" 
                        className="w-32 h-36 object-cover rounded overflow-hidden" />
                    <div className="flex flex-col w-full  px-2 ">
                        <p className="text-lg font-bold">
                            {(result.title || result.name)}
                        </p>
                        <p className="text-sm line-clamp-4 mt-3 leading-snug">
                            {result.overview || result.known_for_department}
                        </p>
                    </div>
                </div>
            )
        })}
    </div>
    )
}
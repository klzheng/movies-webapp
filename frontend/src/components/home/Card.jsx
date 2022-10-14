export default function Card(props) {
    return (
        <div className="w-40 relative group">
            <div className="group-hover:shadow-whitexl rounded-lg group-hover:transition-all duration-500">
                <img src={props.image} alt="Poster IMG" className="border border-white rounded-lg group-hover:brightness-20  group-hover:transition duration-500" />
                <p className="text-center absolute -translate-y-52 text-white px-2.5 line-clamp-8 opacity-0 group-hover:opacity-100 ease-in-out duration-500 leading-snug">
                    {props.overview}
                </p>
                <span className="absolute -translate-y-60 translate-x-32 my-2 -mx-1 text-white bg-black bg-opacity-70 group-hover:brightness-20 transition-all rounded px-1">
                    {props.rating.toFixed(1)}
                </span>
            </div>
            <div className="text-center pt-4 font-semibold text-lg">
                {props.name}
            </div>
        </div>
    )
}
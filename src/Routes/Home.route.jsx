import { useContext } from "react"
import { LocationContext } from "../Contexts/locationContext"

export default function HomePage() {

    const location  = useContext(LocationContext);

    return (
        <div className="flex w-full justify-center overflow-hidden">
            {location ? (
                <MapElement
                    latitude={location.latitude}
                    longitude={location.longitude}
                />
            ) : (
                <div className="flex">Fetching Local Coordinates</div>
            )}
        </div>
    )
}
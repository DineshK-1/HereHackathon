import { createContext, useEffect, useState } from "react";

export const LocationContext = createContext();

export const LocationContextProvider = ({ children }) => {
    const [location, setLocation] = useState({});

    useEffect(() => {
        if (location?.latitude == null) {
            getLocation();
        }

    }, [location]);

    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(success, error);
        } else {
            console.log("Geolocation not supported");
        }
    }

    function success(position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        setLocation({ latitude, longitude });
    }

    function error() {
        console.log("Unable to retrieve your location");
    }

    return <LocationContext.Provider value={location}>{children}</LocationContext.Provider>
}
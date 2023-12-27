import { useEffect, useRef } from "react";
import H from '@here/maps-api-for-javascript';


export default function MapElement({ latitude, longitude }) {
    const mapRef = useRef(null);
    const map = useRef(null);
    const platform = useRef(null);

    const apikey = "Ec-pPDpl8Y62ziZEYCevNt9ouuzyEDxND1Td8FrgUAU";


    useEffect(
        () => {
            if (!latitude) return;

            if (!map.current) {
                platform.current = new H.service.Platform({ apikey });
                var defaultLayers = platform.current.createDefaultLayers();

                const newMap = new H.Map(mapRef.current, defaultLayers.vector.normal.map, {
                    center: { lat: latitude, lng: longitude },
                    zoom: 16,
                    padding: { top: 50, right: 50, bottom: 50, left: 50 },
                    pixelRatio: window.devicePixelRatio || 1
                });

                var ui = H.ui.UI.createDefault(newMap, defaultLayers);

                newMap.addEventListener('pointermove', function (event) {
                    if (event.target instanceof H.map.Marker) {
                        newMap.getViewPort().element.style.cursor = 'pointer';
                    } else {
                        newMap.getViewPort().element.style.cursor = 'auto';
                    }
                }, false);

                window.addEventListener('resize', () => newMap.getViewPort().resize());
                var currentLocation = new H.map.Circle({ lat: latitude, lng: longitude }, 10);
                newMap.addObject(currentLocation);
                var currentLocation = new H.map.Circle({ lat: latitude, lng: longitude }, 125);

                const behavior = new H.mapevents.Behavior(
                    new H.mapevents.MapEvents(newMap)
                );

                map.current = newMap;
            }
        },

        [apikey, latitude, longitude]
    );

    return (
        <>
            <div className="flex fixed top-0 left-0 z-20 mt-3 ml-3" >
                <div className="flex gap-5">
                    <input type="text" placeholder="From.." />
                    <input type="text" placeholder="To.." />
                </div>
            </div>
            <div className='absolute' style={{ width: "100%", height: "90vh" }} ref={mapRef} />
        </>
    )
}
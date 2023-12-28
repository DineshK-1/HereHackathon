import { useContext, useEffect, useRef, useState } from "react";
import H from '@here/maps-api-for-javascript';
import axios from "axios";
import { fromLocationAPI, toLocationAPI } from "../helpers/API";
import Tripdeets from "../Routes/tripdeets.route";
import { LocationContext } from "../Contexts/locationContext";
import PoliceIcon from "../assets/police.png";
import PoliceEmergency from "../assets/siren.png";
import EmergencyIcon from "../assets/emergency.png";
import AmbualnceIcon from "../assets/ambulance.png";

export default function MapNew() {

    const { latitude, longitude } = useContext(LocationContext);

    const mapRef = useRef(null);
    const map = useRef(null);
    const platform = useRef(null);

    const apikey = "XFPTW9372jRU8QoSFlXDbpAgL8JYciNBQU5M";

    const router = platform.current?.getRoutingService(null, 8);
    var destination = { lat: latitude, lng: longitude };

    const [routingEnabled, setRoutingEnabled] = useState(false);
    const routingGroup = useRef(null);

    const [routingResults, setRoutingResults] = useState();

    const [routingTime, setRoutingTime] = useState();

    const ambulanceGroup = useRef();

    const policeIncidentsGroup = useRef();
    const ambulanceIncidentsGroup = useRef();

    const dummyCops = [
        {
            id: 1,
            lat: 19.1402731,
            lng: 72.9285206,
            type: "ambulance"
        },
        {
            id: 2,
            lat: 19.1804731,
            lng: 72.9484206,
            type: "police"
        },
        {
            id: 3,
            lat: 19.1103731,
            lng: 72.9123306,
            type: "police"
        },
        {
            id: 4,
            lat: 19.1202731,
            lng: 72.9488206,
            type: "police"
        },
        {
            id: 5,
            lat: 19.1204731,
            lng: 72.9288206,
            type: "ambulance"
        },

    ]

    const policeGroup = useRef(null);

    const [selectedIncident, setSelectedIncident] = useState();

    const [selectedVehicle, setSelectedVehicles] = useState();

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
                policeIncidentsGroup.current = new H.map.Group();
                ambulanceIncidentsGroup.current = new H.map.Group();

                newMap.addLayer(defaultLayers.vector.traffic.map);

                const behavior = new H.mapevents.Behavior(
                    new H.mapevents.MapEvents(newMap)
                );

                map.current = newMap;

                renderCops();
            }
        },

        [apikey, latitude, longitude]
    );
    const onResult = function (result) {
        if (result.routes.length) {
            const lineStrings = [];
            result.routes[0].sections.forEach((section) => {
                lineStrings.push(H.geo.LineString.fromFlexiblePolyline(section.polyline));
            });

            const multiLineString = new H.geo.MultiLineString(lineStrings);

            const routeLine = new H.map.Polyline(multiLineString, {
                style: {
                    strokeColor: 'blue',
                    lineWidth: 4
                }
            });

            routingGroup.current = new H.map.Group();
            routingGroup.current.addObjects([routeLine]);

            map.current.addObject(routingGroup.current);

            map.current.getViewModel().setLookAtData({
                bounds: routingGroup.current.getBoundingBox()
            });

            setRoutingResults(result);
            setRoutingTime({ arrival: result.routes[0].sections[0].arrival.time, departure: result.routes[0].sections[0].departure.time });
            setRoutingEnabled(true);
        };
    };

    function assignID() {
        axios.post(`https://hereapi-emergency.up.railway.app/assign_id?case_id=${selectedIncident.id}&assignment=${selectedVehicle.id}`).then(() => {
            getIncidents();
        }).finally(() => {
            searchRoute();
        })
    }

    function clearRoute() {
        setSelectedIncident()
        setSelectedVehicles()

        setRoutingEnabled(false);
    }

    function renderCops() {

        var policeIcon = new H.map.Icon(PoliceIcon);
        var ambulanceIcon = new H.map.Icon(AmbualnceIcon);

        policeGroup.current = new H.map.Group();
        ambulanceGroup.current = new H.map.Group();

        dummyCops.forEach((police) => {
            if (police.type == "police") {
                const markerPolice = new H.map.Marker({ lat: police.lat, lng: police.lng }, { icon: policeIcon });
                markerPolice.addEventListener("tap", function () {
                    setSelectedVehicles(police)
                })
                policeGroup.current.addObject(markerPolice)
            } else {
                const marketAmbu = new H.map.Marker({ lat: police.lat, lng: police.lng }, { icon: ambulanceIcon });
                marketAmbu.addEventListener("tap", function () {
                    setSelectedVehicles(police)
                })
                ambulanceGroup.current.addObject(marketAmbu)
            }

        })

        map.current.addObject(policeGroup.current);
        map.current.addObject(ambulanceGroup.current);
    }

    useEffect(() => {
        if (routingEnabled) return;
        if (!map.current) return;
        var objs = map.current.getObjects().filter((obj) => {
            if (obj instanceof H.map.Group) {
                map.current.removeObject(obj)
            }
        });
        getIncidents();
        renderCops();
    }, [routingEnabled, map])

    useEffect(() => {
        if (map.current) {
            renderCops();
        }
    }, [map])

    function searchArea(inci, cops) {
        const routingParameters = {
            'routingMode': 'fast',
            'transportMode': 'car',
            'origin': `${inci.lat},${inci.lng}`,
            'destination': `${cops.lat},${cops.lng}`,
            'return': 'polyline',
        };

        destination = { lat: cops.lat, lng: cops.lng }
        router.calculateRoute(routingParameters, onResult,
            function (error) {
                alert(error.message);
            });
    }

    function searchRoute(switchh = false) {
        if (routingEnabled) {
            setRoutingEnabled(false);
        }
        if (selectedIncident && selectedVehicle) {
            const routingParameters = {
                'routingMode': 'fast',
                'transportMode': 'car',
                'origin': `${selectedIncident.lat},${selectedIncident.lng}`,
                'destination': `${selectedVehicle.lat},${selectedVehicle.lng}`,
                'return': 'polyline',
            };

            destination = { lat: selectedVehicle.lat, lng: selectedVehicle.lng }
            router.calculateRoute(routingParameters, onResult,
                function (error) {
                    alert(error.message);
                });
        }
    }

    function zoomToLocation() {
        map.current.getViewModel().setLookAtData({
            position: {
                lat: latitude,
                lng: longitude
            },
            zoom: 17
        })
    }

    function zoomToCoords(coords) {
        map.current.getViewModel().setLookAtData({
            position: {
                lat: coords.lat,
                lng: coords.lng
            },
            zoom: 17
        })
    }

    useEffect(() => {
        if (selectedIncident && selectedIncident) {
            searchRoute(true)
        }
    }, [selectedIncident, selectedVehicle])

    const [incidents, setIncidents] = useState();

    useEffect(() => {
        if (map.current == null || policeIncidentsGroup.current === null) return;
        if (incidents?.emergencies) {
            // map.current.removeObject(policeIncidentsGroup.current);
            policeIncidentsGroup.current = new H.map.Group();
            var policeIcon = new H.map.Icon(PoliceEmergency);
            var ambulance = new H.map.Icon(EmergencyIcon);
            incidents.emergencies.forEach((inci) => {
                if (inci.scene_type === "success") return;
                if (inci.type === "police") {
                    const marker = new H.map.Marker({ lat: inci.lat, lng: inci.lng }, { icon: policeIcon });
                    policeIncidentsGroup.current?.addObject(marker)
                } else {
                    const marker = new H.map.Marker({ lat: inci.lat, lng: inci.lng }, { icon: ambulance });
                    ambulanceIncidentsGroup.current?.addObject(marker)
                }

            })
            map.current.addObject(policeIncidentsGroup.current);
            map.current.addObject(ambulanceIncidentsGroup.current);
        }
    }, [incidents, map, policeIncidentsGroup])

    function getIncidents() {
        axios.get('https://hereapi-emergency.up.railway.app/get_emergencies').then((res) => {
            setIncidents(res.data)
        })
    }

    return (
        <>
            <div className="z-30 flex flex-col fixed gap-4 text-center right-0 h-screen overflow-y-auto text-black bg-white p-2">
                Incidents
                <div className="flex flex-col gap-2">
                    {
                        incidents?.emergencies &&
                        incidents.emergencies.map((inci, idx) => {
                            var date = new Date(inci.created_time)
                            if (inci.scene_type === "success") return;
                            return (
                                <div key={idx} className={"flex flex-col p-1 rounded-lg cursor-pointer select-none text-sm " + (inci.scene_type === "success" ? " bg-green-500" : (selectedIncident?.id === inci.id ? "bg-blue-600" : "bg-red-400"))} onClick={() => {
                                    // if (routingGroup.current && routingEnabled) {
                                    //     map.current.removeObject(routingGroup.current);
                                    //     setRoutingEnabled(false);
                                    // }
                                    if (inci.assigned_id !== null) {
                                        setSelectedIncident(inci)

                                        searchArea(inci, dummyCops.find((cop) => {
                                            if (cop.id === parseInt(inci.assigned_id)) {
                                                return cop;
                                            }
                                        }))
                                    } else {
                                        zoomToCoords({ lat: inci.lat, lng: inci.lng }); setSelectedIncident(inci)
                                    }
                                }
                                }>
                                    <div className="flex p-1">
                                        {
                                            inci.type === "police" ?
                                                <span className={`material-symbols-outlined text-red-500`}>
                                                    local_police
                                                </span> :
                                                <span className={`material-symbols-outlined`}>
                                                    ambulance
                                                </span>
                                        }
                                    </div>
                                    <div className="flex justify-between p-2 rounded-lg">
                                        {date.toLocaleDateString() + " " + date.toLocaleTimeString()}
                                        <div className="flex">
                                            <span className="material-symbols-outlined">keyboard_arrow_down</span>
                                        </div>
                                    </div>
                                    {
                                        inci.scene_type === "success" ? "" :
                                            <>
                                                <div className="flex text-center w-full justify-center text-sm">
                                                    {
                                                        inci.assigned_id ?
                                                            `Assigned to ${inci.assigned_id}`

                                                            :

                                                            "No one assigned"
                                                    }
                                                </div>
                                                <div className="flex text-xs p-2 mt-3 bg-blue-500 w-fit rounded-lg self-center" onClick={(e) => {
                                                    e.preventDefault()
                                                    e.stopPropagation();
                                                    axios.post(`https://hereapi-emergency.up.railway.app/change_type?type=success&case_id=${inci.id}`).then(() => {
                                                        getIncidents();
                                                    })
                                                }}>
                                                    Mark as Responded
                                                </div>
                                            </>
                                    }
                                </div>
                            )
                        })
                    }
                    {
                        incidents?.emergencies &&
                        incidents.emergencies.map((inci, idx) => {
                            var date = new Date(inci.created_time)
                            if (inci.scene_type !== "success") return;
                            return (
                                <div key={idx} className={"flex flex-col p-1 rounded-lg select-none text-sm " + (inci.scene_type === "success" ? " bg-green-500" : (selectedIncident?.id === inci.id ? "bg-blue-600" : "bg-red-400"))}>
                                    <div className="flex">
                                        {
                                            inci.type === "police" ? 
                                            <span className={`material-symbols-outlined text-red-500`}>
                                            local_police
                                        </span>:
                                        <span className={`material-symbols-outlined`}>
                                        ambulance
                                    </span>
                                        }
                                    </div>
                                    <div className="flex justify-between p-1 rounded-lg items-center">
                                        {date.toLocaleDateString() + " " + date.toLocaleTimeString()}
                                        <div className="flex p-2">
                                            <span className="material-symbols-outlined ">keyboard_arrow_down</span>
                                        </div>
                                    </div>
                                    
                                    {
                                        inci.scene_type === "success" ? "" :
                                            <>
                                                <div className="flex text-center w-full justify-center text-sm">
                                                    {
                                                        inci.assigned_id ?
                                                            `Assigned to ${inci.assigned_id}`

                                                            :

                                                            "No one assigned"
                                                    }
                                                </div>
                                                <div className="flex text-xs p-2 bg-blue-500 w-fit rounded-lg self-center" onClick={(e) => {
                                                    e.preventDefault()
                                                    e.stopPropagation();
                                                    axios.post(`https://hereapi-emergency.up.railway.app/change_type?type=success&case_id=${inci.id}`).then(() => {
                                                        getIncidents();
                                                    })
                                                }}>
                                                    Mark as Responded
                                                </div>
                                            </>
                                    }
                                </div>
                            )
                        })
                    }
                    {
                        !incidents?.emergencies &&
                        <div className="flex p-2 text-gray-400">
                            No incidents available.
                        </div>
                    }
                </div>
            </div>
            <div className="flex fixed top-10 left-2 z-20 w-full justify-center items-center">
                {
                    selectedVehicle &&
                    <div className="flex bg-white text-black p-2 rounded-lg text-sm">
                        Selected {selectedVehicle.type === "police" ? "Police" : "Ambulance"} #{selectedVehicle.id}
                    </div>
                }
                {
                    routingEnabled &&
                    <div className="flex bg-white p-2 text-black w-fit h-fit rounded-lg mx-2 select-none cursor-pointer" onClick={clearRoute}>
                        <span className={`material-symbols-outlined`}>
                            close
                        </span>
                        Clear Route
                    </div>
                }

                <div className="flex flex-col w-fit  gap-2 justify-center">
                    <div className="flex text-blue-500 bg-white p-3 rounded-xl select-none cursor-pointer" onClick={getIncidents}>
                        <span className={`material-symbols-outlined `}>
                            refresh
                        </span>
                        <div className="flex">Refresh Incidents</div>
                    </div>
                    {
                        (selectedIncident && selectedVehicle) &&
                        <div onClick={assignID} className="flex text-blue-500 bg-white p-3 rounded-xl select-none cursor-pointer items-center">
                            <span className={`material-symbols-outlined `}>
                                add
                            </span>
                            <div className="flex">Assign Incident</div>
                        </div>
                    }

                </div>
            </div>
            <div className="flex fixed bottom-20 mb-5 left-2 z-20">
                <span className={`material-symbols-outlined text-blue-500 bg-white p-3 rounded-xl select-none cursor-pointer`} onClick={zoomToLocation}>
                    my_location
                </span>
            </div>
            <div className='absolute' style={{ width: "100%", height: "90vh" }} ref={mapRef} />
        </>
    )
}
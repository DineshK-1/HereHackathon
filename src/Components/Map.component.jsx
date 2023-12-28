import { useEffect, useRef, useState } from "react";
import H from '@here/maps-api-for-javascript';
import axios from "axios";
import { fromLocationAPI, toLocationAPI } from "../helpers/API";
import Tripdeets from "../Routes/tripdeets.route";


export default function MapElement({ latitude, longitude }) {
  const mapRef = useRef(null);
  const map = useRef(null);
  const platform = useRef(null);

  const FromRef = useRef(null);
  const toRef = useRef(null);

  const apikey = "E1RQs4gDilxM4-hVVPH4tfHM8KUSpVvTTJXPbrnaX98";

  const router = platform.current?.getRoutingService(null, 8);
  var destination = { lat: latitude, lng: longitude };

  const [fromLocation, setFromLocation] = useState({ title: "" });
  // const [fromLocation, setFromLocation] = useState(fromLocationAPI);
  const [toLocation, setToLocation] = useState({ title: "" });
  // const [toLocation, setToLocation] = useState(toLocationAPI);
  const [vialocation, setVialocation] = useState({ title: "" })


  const [showFromSuggestions, setShowFromSuggestions] = useState(false);
  const [fromSuggestions, setFromSuggestions] = useState({});

  const [routingEnabled, setRoutingEnabled] = useState(false);
  const routingGroup = useRef(null);

  const [routingResults, setRoutingResults] = useState();

  const [routingTime, setRoutingTime] = useState();

  useEffect(() => {
    if (!latitude) return;
    if (fromLocation.title.length <= 3) {
      setShowFromSuggestions(false);
      return;
    }
    if (fromLocation.id != undefined) {
      setShowFromSuggestions(false);
      return;
    }; if (fromLocation.title.length > 3) {
      axios.get(`https://autosuggest.search.hereapi.com/v1/autosuggest?at=${latitude},${longitude}&lang=en&q=${fromLocation.title}&apiKey=${apikey}`).then((res) => {
        setFromSuggestions(res.data);
      }).finally(() => {
        setShowFromSuggestions(true)
      })
    }
  }, [fromLocation, latitude, fromSuggestions, setFromSuggestions])


  const [showToSuggestions, setShowToSuggestions] = useState(false);
  const [toSuggestions, setToSuggestions] = useState({});

  useEffect(() => {
    if (!latitude) return;
    if (toLocation.title.length <= 3) {
      setShowToSuggestions(false);
      return;
    }
    if (toLocation.id != undefined) {
      setShowToSuggestions(false);
      return;
    };
    if (toLocation.title.length > 3) {
      axios.get(`https://autosuggest.search.hereapi.com/v1/autosuggest?at=${latitude},${longitude}&lang=en&q=${toLocation.title}&apiKey=${apikey}`).then((res) => {
        setToSuggestions(res.data);
      }).finally(() => {
        setShowToSuggestions(true)
      })
    }
  }, [toLocation, latitude, toSuggestions, setToSuggestions])


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

        newMap.addLayer(defaultLayers.vector.traffic.map);

        const behavior = new H.mapevents.Behavior(
          new H.mapevents.MapEvents(newMap)
        );
        map.current = newMap;
      }
    },

    [apikey, latitude, longitude]
  );
  const onResult = function (result) {
    if (result.routes.length) {
      console.log(result)
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

      const startMarker = new H.map.Marker({ lat: fromLocation.position.lat, lng: fromLocation.position.lng });

      const endMarker = new H.map.Marker(destination);

      let viaMarker;

      console.log(vialocation)

      if (vialocation && vialocation.position) {
        viaMarker = new H.map.Marker({ lat: vialocation.position.lat, lng: vialocation.position.lng });
      }

      routingGroup.current = new H.map.Group();
      console.log(routeLine, startMarker, endMarker)
      routingGroup.current.addObjects([routeLine, startMarker, endMarker]);

      if (vialocation && vialocation.title !== "") {
        routingGroup.current.addObject(viaMarker);
      }

      map.current.addObject(routingGroup.current);

      map.current.getViewModel().setLookAtData({
        bounds: routingGroup.current.getBoundingBox()
      });

      setRoutingResults(result);
      result.routes[0].sections.forEach((section) => {
        setRoutingTime((x) => {
          let temp = {...x};
          if(temp["arrival"]){
            temp["arrival"] += section.arrival.time
            temp["departure"] += section.departure.time;
          }else{
            return { arrival: section.arrival.time, departure: section.departure.time }
          }
        });
      })
      setRoutingEnabled(true);
    };
  };

  function clearRoute() {
    if (vialocation.position === undefined) {
      setRoutingEnabled(false);
    }
    map.current.removeObject(routingGroup.current);
  }


  function searchRoute(points = false) {
    if (routingEnabled) {
      clearRoute();
    }
    const routingParameters = {
      'routingMode': 'fast',
      'transportMode': 'car',
      'origin': `${fromLocation.position.lat},${fromLocation.position.lng}`,
      'destination': `${toLocation.position.lat},${toLocation.position.lng}`,
      'return': 'polyline,summary,typicalDuration,turnbyturnactions',
    };

    if (vialocation?.position !== undefined) {
      routingParameters['via'] = new H.service.Url.MultiValueQueryParameter([`${vialocation.position.lat},${vialocation.position.lng}`]);
    }

    destination = { lat: toLocation.position.lat, lng: toLocation.position.lng }
    router.calculateRoute(routingParameters, onResult,
      function (error) {
        alert(error.message);
      });
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

  // useEffect(() => {
  //   if (vialocation && vialocation.position) {
  //     searchRoute(true);
  //   }
  // }, [vialocation])

  return (
    <>
      <div className="flex fixed top-0 left-0 z-20 mt-3 ml-3" >
        <div className="flex gap-3 justify-center items-center">
          <div className="flex flex-col">
            <input type="text" disabled={routingEnabled} placeholder="From.." value={fromLocation.title} ref={FromRef} onChange={(e) => {
              setFromLocation(() => {
                return {
                  title: e.target.value
                }
              })
            }} />
            {
              showFromSuggestions &&
              <div className="flex bg-white flex-col absolute w-fit mt-10 overflow-hidden text-black rounded-sm" style={{ width: `${FromRef.current && FromRef.current.clientWidth}px` }}>
                {
                  fromSuggestions.items &&
                  fromSuggestions?.items.map((suggestion) => {
                    return (
                      <div className="flex p-2 text-xs select-none cursor-pointer" key={suggestion.id} onClick={() => { setFromLocation(suggestion); setShowFromSuggestions(false); }}>
                        {suggestion.title}
                      </div>
                    )
                  })
                }
              </div>
            }
          </div>
          <div className="flex flex-col">
            <input type="text" disabled={routingEnabled} placeholder="To.." value={toLocation.title} ref={toRef} onChange={(e) => {
              setToLocation(() => {
                return {
                  title: e.target.value
                }
              })
            }} />
            {
              showToSuggestions &&
              <div className="flex bg-white flex-col absolute w-fit mt-10 overflow-hidden text-black rounded-sm" style={{ width: `${toRef.current && toRef.current.clientWidth}px` }}>
                {
                  toSuggestions.items &&
                  toSuggestions?.items.map((suggestion) => {
                    return (
                      <div className="flex p-2 text-xs select-none cursor-pointer" key={suggestion.id} onClick={() => { setToLocation(suggestion); setShowToSuggestions(false); }}>
                        {suggestion.title}
                      </div>
                    )
                  })
                }
              </div>
            }
          </div>
          <div className="flex bg-white p-2 text-blue-300 rounded-full cursor-pointer" onClick={() => {
            if (routingEnabled) {
              clearRoute();
              if (vialocation) {
                setVialocation({ title: "" });
              }
            } else {
              searchRoute();
            }
          }}>
            <span className="material-symbols-outlined">{routingEnabled ? "close" : "search"}</span>
          </div>
        </div>
      </div>
      {
        routingEnabled &&
        <Tripdeets searchArea={searchRoute} fromLocation={fromLocation} toLocation={toLocation} routingResults={routingResults} latitude={latitude} longitude={longitude} apikey={apikey} vialocation={vialocation} setVialocation={setVialocation} />
      }
      <div className="absolute flex flex-col bg-white right-0 top-0 z-20 text-black">
        <div className="flex">

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
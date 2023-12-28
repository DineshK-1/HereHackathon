import axios from "axios";
import { useEffect, useRef, useState } from "react";
// import Infocard from "../Components/Infocard.component";

export default function Tripdeets({ routingResults, fromLocation, searchArea, toLocation, latitude, longitude, apikey, vialocation, setVialocation }) {

  const newRef = useRef(null);

  const [dropsummary, setDropsummary] = useState(false);
  const [droproute, setDroproute] = useState(false);

  const [addwaypoint, setAddwaypoint] = useState(false);
  const [waypointsearch, setWaypointsearch] = useState({ title: "" });

  const [showToSuggestions, setShowToSuggestions] = useState(false);
  const [toSuggestions, setToSuggestions] = useState({});

  useEffect(() => {
    if (!latitude) return;
    if (waypointsearch.title.length <= 3) {
      setShowToSuggestions(false);
      return;
    }
    if (waypointsearch.id != undefined) {
      setShowToSuggestions(false);
      return;
    }; if (waypointsearch.title.length > 3) {
      axios.get(`https://autosuggest.search.hereapi.com/v1/autosuggest?at=${latitude},${longitude}&lang=en&q=${waypointsearch.title}&apiKey=${apikey}`).then((res) => {
        setToSuggestions(res.data);
      }).finally(() => {
        setShowToSuggestions(true)
      })
    }
  }, [toLocation, waypointsearch, latitude])

  let metric;
  let tmetric;


  function formatDistance(distanceInMeters) {
    if (distanceInMeters >= 1000) {
      const distanceInKilometers = (distanceInMeters / 1000).toFixed(2);
      metric = "km";
      return `${distanceInKilometers}`;
    } else {
      metric = "m";
      return `${distanceInMeters}`;
    }
  }

  function formatTime(timeInSeconds) {
    if (timeInSeconds >= 3600) {
      const timeInHours = (timeInSeconds / 3600).toFixed(2);
      tmetric = "hr";
      return `${timeInHours}`;
    } else {
      const timeInMinutes = (timeInSeconds / 60).toFixed(2);
      tmetric = "min";
      return `${timeInMinutes}`;
    }
  }

  return (
    <div className="z-20 flex flex-col fixed gap-4 text-center right-4 h-full text-black">
      <div className="basicinfo flex flex-col gap-2 justify-center mt-6 bg-white w-full p-4 rounded-2xl font-semibold drop-shadow-2xl text-ellipsis" >
        <div className="inline-block">
          <h2 className="whitespace-nowrap text-ellipsis w-[170px] overflow-hidden inline-block">{fromLocation.title}</h2>
        </div>
        <span className="material-symbols-outlined text-blue-700 items-center">
          arrow_downward
        </span>
        {vialocation && vialocation.position?.lat !== undefined && (
          <>
            <div className="inline-block">
              <h2 className="whitespace-nowrap text-ellipsis w-[170px] overflow-hidden inline-block">{vialocation.title}</h2>
            </div>
            <span className="material-symbols-outlined text-blue-700 items-center">
              arrow_downward
            </span></>
        )}
        <div className="inline-block">
          <h2 className="whitespace-nowrap text-ellipsis w-[170px] overflow-hidden inline-block">{toLocation.title}</h2>
        </div>      </div>
      <div className="summary flex bg-none justify-between">
        <div className="km flex flex-col items-center justify-center text-center bg-white p-3 rounded-full border-4 border-blue-800 m-auto leading-3 drop-shadow-2xl">
          <h2>{formatDistance(routingResults.routes[0].sections[0].summary.length)}</h2>
          <p className="text-blue-800">{metric}</p>
        </div>
        <div className="km flex flex-col items-center justify-center text-center bg-white p-3 rounded-full border-4 border-red-500 m-auto leading-3 drop-shadow-2xl">
          <h2>{formatTime(routingResults.routes[0].sections[0].summary.duration)}</h2>
          <p className="text-blue-800">{tmetric}</p>
        </div>
        <div className="km flex flex-col items-center justify-center text-center bg-white p-3 rounded-full border-4 border-green-500 m-auto leading-3 drop-shadow-2xl">
          <h2>-</h2>
          <p className="text-blue-800">INR</p>
        </div>
      </div>
      {vialocation && vialocation.title === "" && (
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-2xl drop-shadow-2xl" onClick={() => setAddwaypoint(!addwaypoint)}>
          + Add a via point
        </button>
      )}
      {addwaypoint && (
        <>
          <div className="flex gap-3">
            <input type="text" placeholder="Add more" value={waypointsearch.title} ref={newRef} onChange={(e) => {
              setWaypointsearch(() => {
                return {
                  title: e.target.value
                }
              })
            }} />
            <button onClick={searchArea}><span className="material-symbols-outlined bg-white p-2 rounded-full">
              search
            </span></button>
            {
              showToSuggestions &&
              <div className="flex bg-white flex-col absolute w-fit mt-10 overflow-hidden text-black rounded-sm" style={{ width: `${newRef.current && newRef.current.clientWidth}px` }}>
                {
                  toSuggestions.items &&
                  toSuggestions?.items.map((suggestion) => {
                    return (
                      <div className="flex p-2 text-xs select-none cursor-pointer" key={suggestion.id} onClick={() => { setWaypointsearch(suggestion); setAddwaypoint(suggestion); setShowToSuggestions(false); setVialocation(suggestion) }}>
                        {suggestion.title}
                      </div>
                    )
                  })
                }
              </div>
            }
          </div>
        </>)}

      <div className="sidebar bg-white text-black rounded-xl p-4 select-none cursor-pointer max-w-[400px]" onClick={() => setDroproute(!droproute)}>
        <div>
          <div className="flex justify-center">
            <p className="font-semibold"> Routing Instructions </p>
            <span
              className="material-symbols-outlined"
            >
              {droproute ? "expand_less" : "expand_more"}
            </span>
          </div>
          {droproute && (
            <div className="flex flex-col gap-4 pt-4 text-black overflow-y-scroll" style={{ height: "400px " }}>
              {
                routingResults &&
                routingResults.routes[0].sections.map((section) => {
                  return section.turnByTurnActions.map((tempAction, i) => {
                    return (
                      <div key={i} className="flex gap-2">
                        <div className="flex justify-center items-center">
                          {tempAction?.direction === "left" ? (
                            <span className="material-symbols-outlined font-bold text-2xl">turn_left</span>
                          ) : tempAction?.direction === "right" ? (
                            <span className="material-symbols-outlined">turn_right</span>
                          ) : tempAction?.direction === "depart" ? (
                            <span className="material-symbols-outlined">trip_origin</span>
                          ) : tempAction?.action === "continue" ? (
                            <span className="material-symbols-outlined">straight</span>
                          ) : tempAction?.action === "enterHighway" ? (
                            <span className="material-symbols-outlined">merge_type</span>
                          ) : (
                            <span className="material-symbols-outlined">location_on</span>
                          )}

                        </div>
                        <div className="flex w-full justify-between flex-col">
                          <div className="instructions flex justify-center text-md gap-1">
                            <p className="overflow-hidden whitespace-nowrap"> {tempAction.nextRoad && tempAction?.nextRoad?.name && tempAction?.nextRoad?.name[0]?.value}</p>
                          </div>
                          <span className="text-xs">{tempAction.currentRoad && tempAction?.currentRoad?.name && tempAction?.currentRoad?.name[0]?.value}</span>
                          <hr />
                        </div>
                      </div>
                    )
                  })
                })
              }
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

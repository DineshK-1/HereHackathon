import { useState } from "react";
// import Infocard from "../Components/Infocard.component";

export default function Tripdeets({ routingResults, fromLocation, toLocation }) {

  const [dropsummary, setDropsummary] = useState(false);
  const [droproute, setDroproute] = useState(false);

  return (
    <div className="z-20 flex flex-col fixed gap-4 text-center right-4 h-full text-black">
      <div className="basicinfo flex flex-col gap-2 justify-center mt-6 bg-white w-max p-4 rounded-2xl font-semibold drop-shadow-2xl text-ellipsis" style={{ width: "200px" }}>
        <div className="inline-block">
          <h2 className="whitespace-nowrap text-ellipsis w-[170px] overflow-hidden inline-block">{fromLocation.title}</h2>
        </div>
        <span className="material-symbols-outlined text-blue-700 items-center">
          arrow_downward
        </span>
        <div className="inline-block">
          <h2 className="whitespace-nowrap text-ellipsis w-[170px] overflow-hidden inline-block">{toLocation.title}</h2>
        </div>      </div>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-2xl drop-shadow-2xl">
        + Multitrip
      </button>
      <div className="summary flex bg-none justify-between">
        <div className="km flex flex-col items-center justify-center text-center bg-white p-3 rounded-full border-4 border-blue-800 m-auto leading-3 drop-shadow-2xl">
          <h2>16</h2>
          <p className="text-blue-800">km</p>
        </div>
        <div className="km flex flex-col items-center justify-center text-center bg-white p-3 rounded-full border-4 border-green-500 m-auto leading-3 drop-shadow-2xl">
          <h2>16</h2>
          <p className="text-blue-800">km</p>
        </div>
        <div className="km flex flex-col items-center justify-center text-center bg-white p-3 rounded-full border-4 border-red-500 m-auto leading-3 drop-shadow-2xl">
          <h2>16</h2>
          <p className="text-blue-800">km</p>
        </div>
      </div>

      {/* <div className="sidebar bg-white text-black rounded-xl p-4">
        <div>
          <div className="flex justify-center">
            <p className="font-semibold"> Trip Summary </p>
            <span
              className="material-symbols-outlined"
              onClick={() => setDropsummary(!dropsummary)}
            >
              {dropsummary ? "expand_less" : "expand_more"}
            </span>
          </div>
          {dropsummary && (
            <div className="flex flex-col gap-4 pt-4">
              <div className="flex flex-col rounded-full w-fit p-4" style={{border: "3px black solid"}}>
                <p>16</p>
                <span className="text-xs">Km</span>
              </div>
              <hr />
              <div className="flex flex-row justify-between">
                <p>Travel Time</p>
                <p>13 mins</p>
              </div>
              <hr />
              <div className="flex flex-row justify-between">
                <p>Fare Estimate</p>
                <p>250 INR</p>
              </div>
            </div>
          )}
        </div>
      </div> */}
      <div className="sidebar bg-white text-black rounded-xl p-4 select-none cursor-pointer" onClick={() => setDroproute(!droproute)}>
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
            <div className="flex flex-col gap-4 pt-4 text-black overflow-y-scroll" style={{height: "400px "}}>
              {
                routingResults.routes[0].sections[0].turnByTurnActions.map((tempAction) => {
                  console.log(tempAction)
                  return (
                    <div className="flex w-full justify-between flex-col">
                      <span className="text-sm">{tempAction?.nextRoad?.name[0].value}</span>
                      <span className="text-xs">{tempAction?.currentRoad?.name[0].value}</span>
                      <hr />
                    </div>
                  )
                })
              }
            </div>
          )}
        </div>
      </div>

      {/* <div className="infocards flex flex-col gap-10">
        {information.map((info) => (
          <Infocard
            key={info.icon}
            header={info.header}
            body={info.body}
            icon={info.icon}
          />
        ))}
      </div> */}
    </div>
  );
}

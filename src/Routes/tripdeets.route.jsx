import { useState } from "react";
// import Infocard from "../Components/Infocard.component";

export default function Tripdeets() {
  const from = "bandra";
  const to = "andheri";

  const [dropsummary, setDropsummary] = useState(false);
  const [droproute, setDroproute] = useState(false);

  //   const information = [
  //     {
  //       header: "16 km",
  //       body: "distance to destination",
  //       icon: "directions_car",
  //     },
  //     {
  //       header: "13 mins",
  //       body: "travel time",
  //       icon: "access_time",
  //     },
  //     {
  //       header: "250 INR",
  //       body: "fare estimate",
  //       icon: "currency_rupee",
  //     },
  //   ];

  return (
    <div className="z-20 flex flex-col fixed gap-4 text-center right-4 h-full text-black">
      <div className="basicinfo flex flex-row gap-6 justify-center mt-6 bg-white w-max p-4 rounded-2xl font-semibold drop-shadow-2xl">
        <h2>{from}</h2>
        <span className="material-symbols-outlined text-blue-700">
          arrow_right_alt
        </span>
        <h2>{to}</h2>
      </div>
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
              <div className="flex flex-row justify-between">
                <p>Distance</p>
                <p>16 km</p>
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
      <div className="sidebar bg-white text-black rounded-xl p-4">
        <div>
          <div className="flex justify-center">
            <p className="font-semibold"> Routing Instructions </p>
            <span
              className="material-symbols-outlined"
              onClick={() => setDroproute(!droproute)}
            >
              {droproute ? "expand_less" : "expand_more"}
            </span>
          </div>
          {droproute && (
            <div className="flex flex-col gap-4 pt-4">
              <div className="flex flex-row justify-between">
                <p>Distance</p>
                <p>16 km</p>
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
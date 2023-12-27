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
      <div className="basicinfo flex flex-row gap-6 justify-center mt-6 bg-white w-max p-4 rounded-2xl font-semibold">
        <h2>{from}</h2>
        <span className="material-symbols-outlined text-blue-700">
          arrow_right_alt
        </span>
        <h2>{to}</h2>
      </div>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-2xl">
        + Multitrip
      </button>
      <div className="sidebar bg-white text-black rounded-xl p-4">
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
      </div>
      <div className="flex justify-center">
        <p className="font-semibold"> Route Instructions </p>
        <span
          className="material-symbols-outlined"
          onClick={() => setDroproute(!droproute)}
        >
          {dropsummary ? "expand_less" : "expand_more"}
        </span>
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

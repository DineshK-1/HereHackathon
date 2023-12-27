export default function Infocard({ header, body, icon }) {
  return (
    <div className="flex flex-row  bg-white text-black p-6 pt-8 rounded-3xl drop-shadow-6xl">
      <div className="info flex flex-col">
        <h1>{header}</h1>
        <p>{body}</p>
      </div>
      <div className="image flex">
        <span className={`material-symbols-outlined text-green-500`}>
          {icon}
        </span>
      </div>
    </div>
  );
}

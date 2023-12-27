import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Footer from "./layout/Footer.layout.jsx";
import HomePage from "./Routes/Home.route.jsx";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { LocationContextProvider } from "./Contexts/locationContext.jsx";
import Tripdeets from "./Routes/tripdeets.route.jsx";
import MapNew from "./Components/MapNew.jsx";
const router = createBrowserRouter([
  {
    element: <Footer />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/trip", element: <Tripdeets /> },
      { path: "/911", element: <MapNew /> }
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <LocationContextProvider>
    <RouterProvider router={router} />
  </LocationContextProvider>
);

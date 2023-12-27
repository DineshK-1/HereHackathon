import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import Footer from './layout/Footer.layout.jsx';
import HomePage from './Routes/Home.route.jsx';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
const router = createBrowserRouter([
  {
    element: <Footer />,
    children: [
      { path: "/", element: <HomePage /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
    <RouterProvider router={router} />
);
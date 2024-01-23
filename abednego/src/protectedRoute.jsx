 // protectedRoute.js
import React from 'react';
import { useState,useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import axios from "axios";


const ip = process.env.REACT_APP_IP;

const ProtectedRoute = ({ element, goto, isAuthenticated }) => {
const [info, setInfo] = useState([]);

 useEffect(() => {
    const fetchProspecteur = async () => {
      try {
        const cachedToken = sessionStorage.getItem("token");

        if (cachedToken) {
          const headers = { Authorization: `Bearer ${cachedToken}` };
          const response = await axios.get(
            `${ip}prospector-info/${cachedToken}`,
            { headers }
          );
          if (response.status === 200) {
            setInfo(response.data);
            
          } else {
            throw new Error("Failed to load data");
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };
    fetchProspecteur();
  }, [info]);
  
if (sessionStorage.getItem("token")) {
  isAuthenticated = true;
}
  return isAuthenticated ? (
    element
  ) : (
    <Navigate to="/" state={{ from: goto }} replace />
  );
};

export default ProtectedRoute;

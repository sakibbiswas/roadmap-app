import axios from "axios";

const API_BASE = "http://localhost:5000/api"; 
// const API_BASE = "https://backend-o9xavzrqi-sakibbiswas-projects.vercel.app/api"; 


const api = axios.create({
  baseURL: API_BASE,
});

export function setAuthToken(token: string | null) {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
}

export default api;






// // src/api/api.ts

// import axios from "axios";
// import.meta.env.VITE_API_BASE_URL


// const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

// const api = axios.create({
//   baseURL: API_BASE,
//   withCredentials: true, // cookie support থাকলে true রাখো
// });


// export function setAuthToken(token: string | null) {
//   if (token) {
//     api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
//   } else {
//     delete api.defaults.headers.common["Authorization"];
//   }
// }

// export default api;


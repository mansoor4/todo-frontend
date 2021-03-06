import axios from "axios";

const axios_instance = axios.create({
  // baseURL: "http://localhost:4000",
  baseURL: process.env.REACT_APP_API,
});

export default axios_instance;

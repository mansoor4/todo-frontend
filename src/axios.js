import axios from "axios";

const axios_instance = axios.create({
  baseURL: "http://localhost:4000",
  // baseURL:"https://todo-backend52.herokuapp.com"
});

export default axios_instance;

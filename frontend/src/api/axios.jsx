import axios from "axios";
const BASE_URL = "http://localhost:4242";

export default axios.create({
  baseURL: BASE_URL,
});

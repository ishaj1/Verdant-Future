import axios from "axios";
const BASE_URL = "https://vf-deploy-flask.onrender.com";

export default axios.create({
  baseURL: BASE_URL,
});

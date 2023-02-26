import { toast } from "react-toastify";
import axios from "axios";
import logger from "./logService";

axios.defaults.baseURL = process.env.REACT_APP_API_URL;

//Handling unexpected errors globally.
axios.interceptors.response.use(null, (error) => {
  const expectedError =
    error.response &&
    error.response.status >= 400 &&
    error.response.status < 500;

  if (!expectedError) {
    //Unexpected
    logger.log(error);
    toast.error("An unexpected error has occured.");
  }

  return Promise.reject(error);
});

function setJwt(jwt) {
  axios.defaults.headers.common["x-auth-tokn"] = jwt;
}

export default {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  delete: axios.delete,
  setJwt,
};

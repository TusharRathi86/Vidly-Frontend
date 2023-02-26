import http from "./httpService";

const apiEndpoint = "/movies";

function movieUrl(id) {
  return `${apiEndpoint}/${id}`;
}

export function getMovies() {
  return http.get(`${apiEndpoint}`);
}

export function getMovie(movieId) {
  return http.get(movieUrl(movieId));
}

export function saveMovie(movie) {
  const body = { ...movie };
  delete body._id;
  //Update Scenario and
  if (movie._id) {
    return http.put(movieUrl(movie._id), body);
  }

  return http.post(`${apiEndpoint}`, movie);
}

export function deleteMovie(movieId) {
  return http.delete(movieUrl(movieId));
}

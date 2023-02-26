import React from "react";
import Form from "./common/form";
import Joi from "joi-browser";
import { useParams, useNavigate } from "react-router-dom";
import { getGenres } from "../services/genreService";
import { getMovie, saveMovie } from "../services/movieService";

function getParams(WrapperComponent) {
  const Wrapper = (props) => {
    return (
      <WrapperComponent
        {...props}
        params={useParams()}
        navigate={useNavigate()}
        replace
      />
    );
  };
  return Wrapper;
}

class MovieForm extends Form {
  state = {
    data: {
      title: "",
      genreId: "",
      numberInStock: "",
      dailyRentalRate: "",
    },
    genres: [],
    errors: {},
  };

  schema = {
    _id: Joi.string(),
    title: Joi.string().required().label("Title"),
    genreId: Joi.string().required().label("Genre"),
    numberInStock: Joi.number()
      .required()
      .min(0)
      .max(100)
      .label("Number in Stock"),
    dailyRentalRate: Joi.number()
      .required()
      .min(0)
      .max(10)
      .label("Daily Rental Rate"),
  };

  populateGenres = async () => {
    const { data: genres } = await getGenres();
    this.setState({ genres });
  };

  populateMovie = async () => {
    try {
      const movieId = this.props.params.id;
      if (movieId === "new") return;

      const { data: movie } = await getMovie(movieId);
      this.setState({ data: this.mapToViewModel(movie) });
    } catch (ex) {
      if (ex.response && ex.response.status === 404) {
        this.props.navigate("/not-found", { replace: true });
      }
    }
  };

  componentDidMount = async () => {
    await this.populateGenres();
    await this.populateMovie();
  };

  mapToViewModel = (movie) => {
    return {
      _id: movie._id,
      title: movie.title,
      genreId: movie.genre._id,
      numberInStock: movie.numberInStock,
      dailyRentalRate: movie.dailyRentalRate,
    };
  };

  doSubmit = async () => {
    await saveMovie(this.state.data);
    this.props.navigate("/movies");
  };

  render() {
    return (
      <div className="container">
        <center>
          <h1>Movie Form</h1>
        </center>
        <form onSubmit={this.handleSubmit}>
          {this.renderInput("title", "Title")}
          {this.renderSelect("genreId", "Genre", this.state.genres)}
          {this.renderInput("numberInStock", "Number In Stock")}
          {this.renderInput("dailyRentalRate", "Rate")}
          {this.renderButton("Save")}
        </form>
      </div>
    );
  }
}

export default getParams(MovieForm);

/*   const { id } = useParams();
  const navigate = useNavigate();
  
  function handleClick() {
    navigate("/movies");
  }
 */

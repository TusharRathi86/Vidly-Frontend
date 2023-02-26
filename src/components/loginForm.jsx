import Joi from "joi-browser";
import Form from "./common/form";
import auth from "../services/authService";
import {
  useParams,
  useNavigate,
  useLocation,
  Navigate,
} from "react-router-dom";

function getParams(WrapperComponent) {
  const Wrapper = (props) => {
    return (
      <WrapperComponent
        {...props}
        params={useParams()}
        navigate={useNavigate()}
        location={useLocation()}
        replace
      />
    );
  };
  return Wrapper;
}

class LoginForm extends Form {
  state = {
    data: { username: "", password: "" },
    errors: {},
  };

  //No Joi.object is used.
  schema = {
    username: Joi.string().label("Username").required(),
    password: Joi.string().label("Password").required(),
  };

  doSubmit = async () => {
    /* CALL THE SERVER */
    try {
      const { data } = this.state;
      const { navigate, location } = this.props;

      await auth.login(data.username, data.password);

      if (location.state?.from) {
        navigate(location.state.from);
        auth.refreshPage();
      }
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        const errors = { ...this.state.errors };
        errors.username = ex.response.data;
        this.setState({ errors });
      }
    }
  };

  render() {
    if (auth.getCurrentUser()) return <Navigate to="/" />;
    return (
      <div className="container">
        <center>
          <h1>Login</h1>
        </center>
        <form onSubmit={this.handleSubmit}>
          {this.renderInput("username", "Username")}
          {this.renderInput("password", "Password", "password")}
          {this.renderButton("Login")}
        </form>
      </div>
    );
  }
}

export default getParams(LoginForm);

// this.props.navigate("/", { replace: true });
// window.location = this.props.location.state
//   ? this.props.navigate(this.props.location.state.from.pathname)
//   : this.props.navigate("/");

/* !!IMPORTANT!! 
Whenever we want to work with properties of and object dynamically, instead of 
the dot Notation (.), we should work with the bracket notation ([]).

null and undefined cannot be used as a value of control elements.

Joi terminates validation as soon as it finds an error. This is called abortEarly.

validate() --> Old code.
  
  // const errors = {};
  // if (data.username.trim() === "") {
  //   errors.username = "Username is required!";
  // }
  // if (data.password.trim() === "") {
  //   errors.password = "Password is required!";
  // }
  // return Object.keys(errors).length === 0 ? null : errors;

validateProperty() --> Old code.
 if (name === "username") {
      if (value.trim() === "") return "Username is required";
    }
    if (name === "password") {
      if (value.trim() === "") return "Password is required";
    }

  validateProperty() --> Not working.
    const obj = { [name]: value };
    const rule = this.schema.extract(name);
    const schema = Joi.object({ [name]: rule });
    const { error } = schema.validate(obj);
    return !error ? null : error.details[0].message;
*/

import React from "react";
import Joi from "joi-browser";
import Form from "./common/form";
import auth from "../services/authService";
import * as userService from "../services/userService";
import { useParams, useNavigate } from "react-router-dom";

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

class RegisterForm extends Form {
  state = { data: { username: "", password: "", name: "" }, errors: {} };

  schema = {
    username: Joi.string().email().required().label("Username"),
    password: Joi.string().min(5).required().label("Password"),
    name: Joi.string().min(10).max(20).required().label("Name"),
  };

  doSubmit = async () => {
    try {
      /* CALL THE SERVER */
      const response = await userService.register(this.state.data);
      auth.loginWithJwt(response.headers["x-auth-token"]);
      // this.props.navigate("/", { replace: true });
      window.location = "/";
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        const errors = { ...this.state.errors };
        errors.username = ex.response.data;
        this.setState({ errors });
      }
    }
  };

  render() {
    return (
      <div className="container">
        <center>
          <h1>Register</h1>
        </center>
        <form onSubmit={this.handleSubmit}>
          {this.renderInput("username", "Username")}
          {this.renderInput("password", "Password", "password")}
          {this.renderInput("name", "Name")}
          {this.renderButton("Register")}
        </form>
      </div>
    );
  }
}

export default getParams(RegisterForm);

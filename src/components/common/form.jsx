import { Component } from "react";
import Joi from "joi-browser";
import Input from "./input";
import Select from "./select";

class Form extends Component {
  state = {
    data: {},
    errors: {},
  };

  validate = () => {
    const options = { abortEarly: false };

    const { error } = Joi.validate(this.state.data, this.schema, options);
    if (!error) return null;

    const errors = {};
    for (let item of error.details) {
      errors[item.path[0]] = item.message;
    }
    return errors;
  };

  validateProperty = ({ name, value }) => {
    const obj = { [name]: value };
    const schema = { [name]: this.schema[name] };
    const { error } = Joi.validate(obj, schema);
    return error ? error.details[0].message : null;
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const errors = this.validate();
    this.setState({ errors: errors || {} });
    if (errors) return;
    this.doSubmit();
  };

  //Controlled Element. ==> Single Source of Truth.
  handleChange = ({ currentTarget: input }) => {
    const errors = { ...this.state.errors };
    const errorMessage = this.validateProperty(input);

    if (errorMessage) errors[input.name] = errorMessage;
    else delete errors[input.name];

    const data = { ...this.state.data };
    data[input.name] = input.value;
    this.setState({ data, errors });
  };

  renderSelect(name, label, options) {
    const { data, errors } = this.state;
    return (
      <Select
        label={label}
        name={name}
        options={options}
        value={data[name]}
        onChange={this.handleChange}
        errors={errors[name]}
      />
    );
  }

  renderInput(name, label, type = "text") {
    const { data, errors } = this.state;
    return (
      <Input
        label={label}
        type={type}
        name={name}
        value={data[name]}
        error={errors[name]}
        onChange={this.handleChange}
      />
    );
  }

  renderButton(label) {
    return (
      <button disabled={this.validate()} className="btn btn-primary">
        {label}
      </button>
    );
  }
}

export default Form;

//NOTES\\
/* HANDLE SUBMIT METHOD  */
// console.log(errors);
/* We set the errors property to an errors object or an empty object.
The errors property should always be set to an object, it can never be null. */

// const obj = { [name]: value };
// const schema = Joi.object({ [name]: this.schema[name] });
// const result = Joi.reach({schema, this})
// const { error } = schema.validate(obj);
// return !error ? null : error.details[0].message;

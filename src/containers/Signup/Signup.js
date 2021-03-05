import React, { Component } from "react";
import Backdrop from "../../components/Backdrop/Backdrop";
import Aux from "../../HOC/Auxillary/Auxillary";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { signup } from "../../redux/actions/index";
import classes from "./Signup.module.css";
import Loader from "../../UI/Loader/Loader";
class Signup extends Component {
  state = {
    name: "",
    lastName: "",
    contact: "",
    email: "",
    password: "",
  };

  componentDidMount() {
    if (this.props.isAuth) {
      this.props.history.push("/");
    }
  }


  changeHandler = (event, type) => {
    this.setState({ [type]: event.target.value });
  };

  registerHandler = () => {
    const userData = {
      name: this.state.name,
      lastName: this.state.lastName,
      contact: this.state.contact,
      email: this.state.email,
      password: this.state.password,
    };

    this.props.signup(userData, this.props.history);
  };

  render() {
    let signup = <Loader />;
    if (!this.props.loading) {
      signup = (
        <div className={classes.Signup}>
          <h1>
            <i className="fas fa-user-plus"></i>Register
          </h1>
          <div className={classes.FormContain}>
            <form>
              <div>
                <label>Name</label>
                <input
                  placeholder="Enter Name"
                  type="text"
                  value={this.state.name}
                  onChange={(event) => this.changeHandler(event, "name")}
                />
              </div>
              <div>
                <label>Last Name</label>
                <input
                  placeholder="Enter Last Name"
                  type="text"
                  value={this.state.lastName}
                  onChange={(event) => this.changeHandler(event, "lastName")}
                />
              </div>
              <div>
                <label>Contact</label>
                <input
                  placeholder="Enter Contact"
                  type="text"
                  value={this.state.contact}
                  onChange={(event) => this.changeHandler(event, "contact")}
                />
              </div>
              <div>
                <label>Email</label>
                <input
                  placeholder="Enter Email"
                  type="email"
                  value={this.state.email}
                  onChange={(event) => this.changeHandler(event, "email")}
                />
              </div>
              <div>
                <label>Password</label>
                <input
                  placeholder="Enter Password"
                  type="password"
                  value={this.state.password}
                  onChange={(event) => this.changeHandler(event, "password")}
                />
              </div>
            </form>
            <button
              onClick={this.registerHandler}
              className={classes.RegisterButton}
            >
              Register
            </button>
            <p>
              Have an account?
              <span className={classes.RedirectLogin}>
                <Link to="/signin">Login</Link>
              </span>
            </p>
          </div>
        </div>
      );
    }
    return (
      <Aux>
        <Backdrop color="white" opacity="1" />
        {signup}
      </Aux>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    loading: state.loading,
    isAuth: state.isAuth,
  };
};
export default connect(mapStateToProps, { signup })(Signup);

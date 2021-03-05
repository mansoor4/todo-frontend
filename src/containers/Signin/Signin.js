import React, { Component } from "react";
import Backdrop from "../../components/Backdrop/Backdrop";
import Aux from "../../HOC/Auxillary/Auxillary";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { signin, googleLogin } from "../../redux/actions/index";
import classes from "./Signin.module.css";
import Loader from "../../UI/Loader/Loader";
import { GoogleLogin } from "react-google-login";

class Signin extends Component {
  state = {
    email: "",
    password: "",
  };

  componentDidMount() {
    if (this.props.isAuth) {
      this.props.history.push("/");
    }
  }

  componentDidUpdate() {
    if (this.props.isAuth) {
      this.props.history.push("/");
    }
  }

  changeHandler = (event, type) => {
    this.setState({ [type]: event.target.value });
  };

  loginhandler = () => {
    const userdata = {
      email: this.state.email,
      password: this.state.password,
    };

    this.props.signin(userdata, this.props.history);
  };

  render() {
    let signin = <Loader />;
    if (!this.props.loading) {
      signin = (
        <div className={classes.Signin}>
          <h1>
            <i className="fas fa-sign-in-alt"></i>Login
          </h1>
          <div className={classes.FormContain}>
            <form>
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
              onClick={this.loginhandler}
              className={classes.RegisterButton}
            >
              Login
            </button>
            <div className={classes.RedirectContent}>
              <p>
                No Account?
                <span className={classes.RedirectRegister}>
                  <Link to="/signup">Register</Link>
                </span>
              </p>
              <p>
                Forgot Password?
                <span className={classes.RedirectRegister}>
                  <Link to="/reset">Reset</Link>
                </span>
              </p>
            </div>
          </div>
          <p style={{ textAlign: "center" }}>OR</p>
          <div style={{ width: "100px", margin: "auto", marginTop: "10px" }}>
            <GoogleLogin
              clientId={process.env.CLIENT_ID}
              onSuccess={(response) =>
                this.props.googleLogin(response, this.props.history)
              }
              onFailure={this.props.googleLogin}
            >
              <p style={{ transform: "translateY(-5px)" }}>LOGIN</p>
            </GoogleLogin>
          </div>
        </div>
      );
    }
    return (
      <Aux>
        <Backdrop color="white" opacity="1" />
        {signin}
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
export default connect(mapStateToProps, { signin, googleLogin })(Signin);

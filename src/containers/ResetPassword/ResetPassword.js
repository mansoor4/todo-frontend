import React, { Component } from "react";
import Backdrop from "../../components/Backdrop/Backdrop";
import Aux from "../../HOC/Auxillary/Auxillary";
import { connect } from "react-redux";
import classes from "./ResetPassword.module.css";
import Loader from "../../UI/Loader/Loader";
import { Link } from "react-router-dom";
import axios from "../../axios";
import { toast } from "react-toastify";

toast.configure({ autoClose: "2000" });

class Reset extends Component {
  state = {
    email: "",
    password: "",
    confirmPassword: "",
    loading: false,
  };

  componentDidMount() {
    if (this.props.isAuth) {
      this.props.history.push("/");
    }
  }

  changeHandler = (event, type) => {
    this.setState({ [type]: event.target.value });
  };

  SubmitHandler = async () => {
    const email = this.state.email;
    const password = this.state.password;
    const confirmPassword = this.state.confirmPassword;

    const RESET_PASSWORD = {
      query: `
        mutation RESET_PASSWORD($email:String!,$password:String!,$confirmPassword:String!){
            auth{
                resetPassword(userInput:{email:$email,password:$password,confirmPassword:$confirmPassword}){
                    message
                }
            }
        }`,
      variables: {
        email: email,
        password: password,
        confirmPassword: confirmPassword,
      },
    };
    try {
      this.setState({ loading: true });
      const response = await axios.post("/graphql", RESET_PASSWORD);
      this.setState({ loading: false });
      if (response.data.errors) {
        toast(response.data.errors[0].message, {
          type: "warning",
        });
      } else {
        toast(response.data.data.auth.resetPassword.message, {
          type: "success",
        });
        this.props.history.push("/signin");
      }
    } catch (err) {
      this.setState({ loading: false });
      toast(err.message, { type: "warning" });
    }
  };

  render() {
    let reset = <Loader />;
    if (!this.state.loading) {
      reset = (
        <div className={classes.Reset}>
          <h1>
            <i className="fas fa-unlock"></i>Reset Password
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
              <div>
                <label>Confirm Password</label>
                <input
                  placeholder="Enter Confirm Password"
                  type="password"
                  value={this.state.confirmPassword}
                  onChange={(event) =>
                    this.changeHandler(event, "confirmPassword")
                  }
                />
              </div>
            </form>
            <button
              onClick={this.SubmitHandler}
              className={classes.ResetButton}
            >
              Submit
            </button>
            <p>
              Go to
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
        {reset}
      </Aux>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isAuth: state.isAuth,
  };
};
export default connect(mapStateToProps)(Reset);

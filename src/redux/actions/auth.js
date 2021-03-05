import * as actionTypes from "./actionTypes";
import axios from "../../axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import setAuthToken from "../../utils/setAuthToken";
import jwt_decode from "jwt-decode";
toast.configure({ autoClose: "2000" });

const signup_start = () => {
  return {
    type: actionTypes.SIGNUP_START,
  };
};

const signup_success = () => {
  return {
    type: actionTypes.SIGNUP_SUCCESS,
  };
};

const signup_failed = () => {
  return {
    type: actionTypes.SIGNUP_FAILED,
  };
};

const signin_start = () => {
  return {
    type: actionTypes.SIGNIN_START,
  };
};

const signin_success = (token, userId) => {
  return {
    type: actionTypes.SIGNIN_SUCCESS,
    token: token,
    userId: userId,
  };
};

const signin_failed = () => {
  return {
    type: actionTypes.SIGNIN_FAILED,
  };
};

const logout_action = () => {
  localStorage.removeItem("token");
  setAuthToken(false);
  return {
    type: actionTypes.LOGOUT,
  };
};

const auto_logout = (history) => (dispatch) => {
  setTimeout(() => {
    dispatch(logout_action());
    toast("Session expired", { type: "warning" });
    history.push("/signin");
  }, 60 * 60 * 1000);
};

export const signup = (userData, history) => (dispatch) => {
  dispatch(signup_start());
  const signup_query = {
    query: `
      mutation REGISTER( 
          $name:String!,
          $lastName:String!,
          $contact:String!,
          $email:String!,
          $password:String!){
        auth{
            signup(userInput:{
                name:$name,
                lastName:$lastName,
                contact:$contact,
                email:$email,
                password:$password})
              {
                  message
              }
          }
      }`,
    variables: {
      name: userData.name,
      lastName: userData.lastName,
      contact: userData.contact,
      email: userData.email,
      password: userData.password,
    },
  };

  axios
    .post("/graphql", signup_query)
    .then((response) => {
      console.log(response.data);
      if (response.data.errors) {
        dispatch(signup_failed());
        toast(response.data.errors[0].message, {
          type: "warning",
        });
      } else {
        dispatch(signup_success());
        toast(response.data.data.auth.signup.message, {
          type: "success",
        });
        history.push("/signin");
      }
    })
    .catch((err) => {
      dispatch(signup_failed());
      toast(err.message, { type: "warning" });
    });
};

export const signin = (userData, history) => (dispatch) => {
  dispatch(signin_start());
  const signin_query = {
    query: `
      mutation LOGIN( 
          $email:String!,
          $password:String!){
        auth{
            signin(userInput:{
                email:$email,
                password:$password})
              {
                token
                user
                {
                  id
                }
                message
              }
          }
      }`,
    variables: {
      email: userData.email,
      password: userData.password,
    },
  };

  axios
    .post("/graphql", signin_query)
    .then((response) => {
      if (response.data.errors) {
        dispatch(signin_failed());
        toast(response.data.errors[0].message, {
          type: "warning",
        });
      } else {
        const token = response.data.data.auth.signin.token;
        const userId = response.data.data.auth.signin.user.id;
        localStorage.setItem("token", token);
        setAuthToken(token);
        dispatch(auto_logout(history));
        dispatch(signin_success(token, userId));
        toast(response.data.data.auth.signin.message, {
          type: "success",
        });
      }
    })
    .catch((err) => {
      dispatch(signin_failed());
      toast(err.message, { type: "warning" });
    });
};

export const logout = (history) => (dispatch) => {
  dispatch(logout_action());
  history.replace("/signin");
};

export const checkSignin = () => (dispatch) => {
  if (localStorage.getItem("token")) {
    const token = localStorage.getItem("token");
    const decode = jwt_decode(token);
    const date = new Date();
    if (decode.exp >= date.getTime() / 1000) {
      setAuthToken(token);
      dispatch(signin_success(token, decode.id));
    }
  }
};

export const googleLogin = (response, history) => (dispatch) => {
  console.log(response);
  const GOOGLE_LOGIN = {
    query: `
    mutation GOOGLE_LOGIN($token:String!){
      auth{
        googleLogin(token:$token){
          message
          token
          user{
            id
          }
        }
      }
    }`,
    variables: {
      token: response.tokenId,
    },
  };
  axios
    .post("/graphql", GOOGLE_LOGIN)
    .then((response) => {
      if (response.data.errors) {
        toast(response.data.errors[0].message, {
          type: "warning",
        });
      } else {
        const token = response.data.data.auth.googleLogin.token;
        const userId = response.data.data.auth.googleLogin.user.id;
        localStorage.setItem("token", token);
        setAuthToken(token);
        dispatch(auto_logout(history));
        dispatch(signin_success(token, userId));
        toast(response.data.data.auth.googleLogin.message, {
          type: "success",
        });
      }
    })
    .catch((err) => {
      toast(err.message, { type: "warning" });
    });
};

import React, { Component } from "react";
import Layout from "./HOC/Layout/Layout";
import Todo from "./containers/Todo/Todo";
import Aux from "./HOC/Auxillary/Auxillary";
import Modal from "./components/Modal/Modal";
import Input from "./components/Input/Input";
import Button from "./UI/Button/Button";
import classes from "./App.module.css";
import Backdrop from "./components/Backdrop/Backdrop";
import history from "./history";
import _ from "lodash";
import { Switch, Route, Redirect, Router } from "react-router-dom";
import Signup from "./containers/Signup/Signup";
import Signin from "./containers/Signin/Signin";
import Reset from "./containers/ResetPassword/ResetPassword";
import { connect } from "react-redux";
import { checkSignin } from "./redux/actions/index";
import axios from "./axios";
import { toast } from "react-toastify";
toast.configure({ autoClose: "2000" });
class App extends Component {
  state = {
    inputLists: {
      description: {
        elementType: "textarea",
        elementConfig: {
          type: "text",
          placeholder: "DESCRIPTION...",
        },
        validation: {
          isvalid: false,
        },
        value: "",
      },
    },
    title: "",
    modalShow: false,
    showError: true,
    updateTodo: false,
  };

  componentDidMount() {
    this.props.checkSignin();
  }

  changeHandler = (event, type) => {
    const state = _.cloneDeep(this.state);
    let isValid = true;
    const value = event.target.value;
    state.inputLists[type].value = value;
    isValid = value.trim() !== "" && isValid;
    state.showError = !isValid;
    state.updateTodo = false;
    this.setState(state);
  };

  todoSet = (type, value) => {
    const state = _.cloneDeep(this.state);
    type.forEach((ele, index) => {
      state[ele] = value[index];
    });
    this.setState(state);
  };

  modalClose = () => {
    const state = _.cloneDeep(this.state);
    state.inputLists.description.value = "";
    state.modalShow = false;
    this.setState(state);
  };
  continueClick = async () => {
    const description = this.state.inputLists.description.value.trim();
    const title = this.state.title.trim();
    if (description === "") {
      return;
    }
    const CREATE_TODO = {
      query: `
      mutation CREATE_TODO($text:String!,$description:String!){
        todo{
          createTodo(todoInput:{text:$text,description:$description})
          {
            message
          }
        }
      }`,
      variables: {
        text: title,
        description: description,
      },
    };
    try {
      const response = await axios.post("/graphql", CREATE_TODO);
      this.modalClose();
      if (response.data.errors) {
        toast(response.data.errors[0].message, { type: "warning" });
      } else {
        toast(response.data.data.todo.createTodo.message, { type: "success" });
        this.setState({ updateTodo: true });
      }
    } catch (err) {
      this.modalClose();
      toast(err.message, { type: "error" });
    }
  };
  render() {
    return (
      <Router history={history}>
        <Aux>
          {this.state.modalShow ? (
            <Aux>
              <Backdrop change={this.modalClose} />
              <Modal>
                <div className={classes.Contain}>
                  <Input
                    inputName="description"
                    class={classes.Description}
                    inputType={this.state.inputLists.description.elementType}
                    config={this.state.inputLists.description.elementConfig}
                    value={this.state.inputLists.description.value}
                    change={this.changeHandler}
                    showError={this.state.showError}
                  />
                  <Button
                    change={this.continueClick}
                    title="Continue"
                    class="Success"
                  />
                  <Button
                    change={this.modalClose}
                    title="Cancel"
                    class="Danger"
                  />
                </div>
              </Modal>
            </Aux>
          ) : null}
          <Switch>
            <Route path="/signup" component={Signup} />
            <Route path="/signin" component={Signin} />
            <Route path="/reset" component={Reset} />
            {this.props.isAuth ? (
              <Layout>
                <Route
                  path="/"
                  render={() => (
                    <Todo set={this.todoSet} update={this.state.updateTodo} />
                  )}
                />
              </Layout>
            ) : (
              <Redirect to="/signin" />
            )}
          </Switch>
        </Aux>
      </Router>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isAuth: state.isAuth,
  };
};
export default connect(mapStateToProps, { checkSignin })(App);

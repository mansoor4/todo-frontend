import React, { Component } from "react";
import axios from "../../axios";
import TodoContainer from "../../components/TodoContainer/TodoContainer";
import { withRouter } from "react-router-dom";
import classes from "./Todo.module.css";
import { toast } from "react-toastify";
import _ from "lodash";
import Loader from "../../UI/Loader/Loader";
toast.configure({ autoClose: "2000" });
class Todo extends Component {
  state = {
    listItems: [],
    inputList: {
      search: {
        elementType: "input",
        elementConfig: {
          type: "text",
          placeholder: "SEARCH TODO...",
        },
        validation: {
          isValid: false,
        },
        value: "",
      },
      add: {
        elementType: "input",
        elementConfig: {
          type: "text",
          placeholder: "TODO TITLE...",
        },
        validation: {
          isvalid: false,
        },
        value: "",
      },
      filter: {
        elementType: "select",
        elementConfig: {
          option: [
            { value: "all", displayValue: "ALL" },
            { value: "complete", displayValue: "COMPLETE" },
            { value: "incomplete", displayValue: "INCOMPLETE" },
          ],
        },
        validation: {},
        value: "all",
      },
      errorMessage: null,
      showError: true,
    },
    loading: false,
  };
  fetchTodo = async () => {
    this.setState({ loading: true });
    const GET_TODOS = {
      query: `
      query getAllTodo{
        todo
        {
          getAllTodo {
          todos {
            id
            text
            description
            completed
          }
        }
      }
    }
    
    `,
    };
    try {
      const response = await axios.post("/graphql", GET_TODOS);
      this.setState({ loading: false });
      if (response.data.errors) {
        toast(response.data.errors[0].message, { type: "warning" });
      } else {
        const items = response.data.data.todo.getAllTodo.todos.map((item) => {
          return {
            ...item,
            delete: false,
            loading: false,
            display: true,
            detail: false,
            update: false,
          };
        });
        this.setState({ listItems: items });
      }
    } catch (err) {
      this.setState({ loading: false });
      toast(err.message, { type: "error" });
    }
  };
  componentDidMount() {
    this.fetchTodo();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.update &&
      !prevProps.update
      // (prevState.listItems.length !== 0 &&
      //   prevState.listItems.length !== this.state.listItems.length)
    ) {
      this.fetchTodo();
    }
  }

  changeHandler = (event, type) => {
    const inputList = _.cloneDeep(this.state.inputList);
    inputList[type].value = event.target.value;
    this.setState({ inputList: inputList });
  };

  toggleDetailHandler = (id) => {
    const listItems = _.cloneDeep(this.state.listItems);
    const index = listItems.findIndex((item) => item.id === id);
    listItems[index].detail = !this.state.listItems[index].detail;
    this.setState({ listItems: listItems });
  };

  closeDetailHandler = (id) => {
    const listItems = _.cloneDeep(this.state.listItems);
    const index = listItems.findIndex((item) => item.id === id);
    listItems[index].detail = false;
    this.setState({ listItems: listItems });
  };

  updateShowHandler = (id) => {
    const listItems = _.cloneDeep(this.state.listItems);
    const index = listItems.findIndex((item) => item.id === id);
    listItems[index].update = true;
    this.setState({ listItems: listItems });
  };

  updateCloseHandler = (id) => {
    const listItems = _.cloneDeep(this.state.listItems);
    const index = listItems.findIndex((item) => item.id === id);
    listItems[index].update = false;
    this.setState({ listItems: listItems });
  };

  closeUpdateAndDetailHandler = (id) => {
    const listItems = _.cloneDeep(this.state.listItems);
    const index = listItems.findIndex((item) => item.id === id);
    listItems[index].update = false;
    listItems[index].detail = false;
    this.setState({ listItems: listItems });
  };

  updateTodoHandler = (todo) => {
    const listItems = _.cloneDeep(this.state.listItems);
    const index = listItems.findIndex((item) => item.id === todo.id);
    const updatedTodo = {
      ...listItems[index],
      text: todo.text,
      description: todo.description,
    };
    listItems[index] = updatedTodo;
    this.setState({ listItems: listItems });
  };

  //==========================================================
  //Bug in serach handler
  searchHandler = (event, type) => {
    const state = _.cloneDeep(this.state);
    const value = event.target.value;
    state.inputList[type].value = value;
    let searchList = null;
    const completeList = state.listItems.filter((item) => item.completed);
    const inCompleteList = state.listItems.filter((item) => !item.completed);
    const allList = [...state.listItems];
    if (this.state.inputList.filter.value === "complete") {
      searchList = [...completeList];
    } else if (this.state.inputList.filter.value === "incomplete") {
      searchList = inCompleteList;
    } else {
      searchList = allList;
    }
    searchList.forEach((item, index) => {
      if (
        item.text.indexOf(value.toLowerCase()) === -1 &&
        value.trim() !== ""
      ) {
        state.listItems[index].display = false;
      } else {
        state.listItems[index].display = true;
      }
    });
    if (this.state.inputList.filter.value === "complete") {
      state.listItems = [...searchList, ...inCompleteList];
    } else if (this.state.inputList.filter.value === "incomplete") {
      state.listItems = [...searchList, ...completeList];
    } else {
      state.listItems = [...allList];
    }
    this.setState(state);
  };

  ///=============================================================

  plusClickHandler = () => {
    const inputList = _.cloneDeep(this.state.inputList);
    const value = inputList.add.value;
    let isValid = true;
    inputList.errorMessage = null;
    inputList.showError = true;
    isValid = value.trim() !== "" && isValid;
    if (!isValid) {
      inputList.errorMessage = "Field cannot be empty";
      return this.setState({ inputList: inputList });
    }
    isValid = value.length <= 30 && isValid;
    if (!isValid) {
      inputList.errorMessage = "Length should be less than 30 character";
      return this.setState({ inputList: inputList });
    }
    this.props.set(["modalShow", "title"], [true, value]);
    this.setState({ inputList: inputList });
  };

  crossClickHandler = () => {
    const inputList = _.cloneDeep(this.state.inputList);
    inputList.showError = false;
    this.setState({ inputList: inputList });
  };

  toggleClick = async (event, id) => {
    const listItems = _.cloneDeep(this.state.listItems);
    const index = listItems.findIndex((item) => id === item.id);
    const bool = !listItems[index].completed;
    listItems[index].completed = bool;

    const UPDATE_TODO = {
      query: `
      mutation UPDATE_TODO($completed:Boolean,$id:Int){
        todo{
          toggleComplete(todoInput:{completed:$completed,id:$id})
          {
            message
          }
        }
      }`,
      variables: {
        completed: bool,
        id: id,
      },
    };
    try {
      const response = await axios.post("/graphql", UPDATE_TODO);
      if (response.data.errors) {
        toast(response.data.errors[0].message, { type: "warning" });
      } else {
        this.setState({ listItems: listItems }, () => {
          this.filterHandler(event, "filter");
        });
      }
    } catch (err) {
      toast(err.message, { type: "error" });
    }
  };

  deleteHandler = async (id) => {
    const loadingItems = this.state.listItems.filter(
      (item) => item.loading === true
    );
    if (loadingItems.length > 0) {
      return;
    }
    const index = this.state.listItems.findIndex((item) => item.id === id);
    let updateList = { ...this.state.listItems[index], loading: true };
    let updatedListItmes = [...this.state.listItems];
    updatedListItmes[index] = updateList;
    this.setState({ listItems: updatedListItmes });
    const DELETE_TODO = {
      query: `mutation DELETE_TODO($id:Int!){
        todo{
       deleteTodo(todoInput:{id:$id}){
           message
       }
    }
    }`,
      variables: {
        id: id,
      },
    };
    try {
      const response = await axios.post("graphql", DELETE_TODO);
      updateList = { ...this.state.listItems[index], loading: false };
      updatedListItmes = [...this.state.listItems];
      updatedListItmes[index] = updateList;
      this.setState({ listItems: updatedListItmes });

      if (response.data.errors) {
        toast(response.data.errors[0].message, { type: "warning" });
      } else {
        const state = _.cloneDeep(this.state);
        const filterItems = state.listItems.filter((item) => item.id !== id);
        this.setState({ listItems: filterItems }, () => {
          toast(response.data.data.todo.deleteTodo.message, {
            type: "success",
          });
        });
      }
    } catch (err) {
      updateList = { ...this.state.listItems[index], loading: false };
      updatedListItmes = [...this.state.listItems];
      updatedListItmes[index] = updateList;
      this.setState({ listItems: updatedListItmes });
      toast(err.message, { type: "error" });
    }
  };

  filterHandler = (event, type) => {
    const state = _.cloneDeep(this.state);
    let value = null;
    if (event.type === "change") {
      value = event.target.value;
    } else {
      value = state.inputList[type].value;
    }
    state.inputList[type].value = value;
    state.listItems.forEach((item, index) => {
      if (value === "complete" || value === "all") {
        if (!item.completed && value !== "all") {
          state.listItems[index].display = false;
        } else {
          state.listItems[index].display = true;
        }
      } else {
        if (item.completed) {
          state.listItems[index].display = false;
        } else {
          state.listItems[index].display = true;
        }
      }
    });
    this.setState(state);
  };
  render() {
    const iconClass = ["fas fa-list-alt", classes.Icon];
    let todoContainer = <Loader />;
    if (!this.state.loading) {
      todoContainer = (
        <TodoContainer
          changeHandler={this.changeHandler}
          inputList={this.state.inputList}
          listItems={this.state.listItems}
          plusClick={this.plusClickHandler}
          crossClick={this.crossClickHandler}
          toggleClick={this.toggleClick}
          deleteClick={this.deleteHandler}
          searchHandler={this.searchHandler}
          filterHandler={this.filterHandler}
          toggleDetail={this.toggleDetailHandler}
          closeDetail={this.closeDetailHandler}
          updateShow={this.updateShowHandler}
          updateClose={this.updateCloseHandler}
          closeUpdateAndDetail={this.closeUpdateAndDetailHandler}
          updateTodo={this.updateTodoHandler}
        />
      );
    }
    return (
      <div className={classes.Todo}>
        <h1 className={classes.Heading}>
          <i className={iconClass.join(" ")}></i>TODO LIST
        </h1>
        {todoContainer}
      </div>
    );
  }
}

export default withRouter(Todo);

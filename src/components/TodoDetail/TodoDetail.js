import React, { Component } from "react";
import Aux from "../../HOC/Auxillary/Auxillary";
import Backdrop from "../Backdrop/Backdrop";
import { toast } from "react-toastify";
import axios from "../../axios";
import classes from "./TodoDetail.module.css";
toast.configure({ autoClose: "2000" });

class TodoDetail extends Component {
  state = {
    title: this.props.title,
    description: this.props.description,
    loading: false,
  };

  backdropCloseHandler = () => {
    if (!this.state.loading) {
      this.props.closeUpdateAndDetail(this.props.id);
    }
  };

  updateSubmitHandler = async (id) => {
    const title = this.state.title.trim();
    const description = this.state.description.trim();
    if (description === "" || title === "") {
      toast("Fill all the input fields", { type: "warning" });
      return;
    }
    if (title.length > 30) {
      toast("Title should be less than 30 character", { type: "warning" });
      return;
    }

    const UPDATE_TODO = {
      query: `
      mutation UPDATE_TODO($text:String!,$description:String!,$id:Int!){
        todo{
          updateTodo(todoInput:{text:$text,description:$description,id:$id}){
            todo{
              id
              text
              description
            }
            message
          }
        }
      }`,
      variables: {
        text: title,
        description: description,
        id: id,
      },
    };
    try {
      this.setState({ loading: true });
      const response = await axios.post("/graphql", UPDATE_TODO);
      this.setState({ loading: false });
      if (response.data.errors) {
        toast(response.data.errors[0].message, { type: "warning" });
      } else {
        this.props.updateClose(this.props.id);
        toast(response.data.data.todo.updateTodo.message, { type: "success" });
        this.props.updateTodo(response.data.data.todo.updateTodo.todo);
      }
    } catch (err) {
      this.setState({ loading: false });
      toast(err.message, { type: "error" });
    }
  };
  render() {
    let detail = (
      <Aux>
        <div className={classes.Title_contain}>
          <span className={classes.Title}>Title:</span>
          <span className={classes.Title_content}>{this.props.title}</span>
        </div>
        <div className={classes.Description_contain}>
          <span className={classes.Description}>Description:</span>
          <br />
          <span className={classes.Description_content}>
            {this.props.description}
          </span>
        </div>
        <div className={classes.Button_contain}>
          <span
            className={classes.Update}
            onClick={() => this.props.updateShow(this.props.id)}
          >
            Update
          </span>
          <span
            className={classes.Cancel}
            onClick={() => this.props.closeDetail(this.props.id)}
          >
            Cancel
          </span>
        </div>
      </Aux>
    );

    if (this.props.update) {
      detail = (
        <Aux>
          <form className={classes.Form}>
            <input
              type="text"
              placeholder="Title"
              value={this.state.title}
              className={classes.Input_title}
              onChange={(event) => this.setState({ title: event.target.value })}
            />
            <textarea
              type="text"
              placeholder="Title"
              value={this.state.description}
              className={classes.Input_description}
              onChange={(event) =>
                this.setState({ description: event.target.value })
              }
            />
          </form>
          <div className={classes.Input_button}>
            <span
              className={classes.Submit}
              onClick={() => this.updateSubmitHandler(this.props.id)}
            >
              Submit
            </span>
            <span
              className={classes.Input_cancel}
              onClick={() => this.props.updateClose(this.props.id)}
            >
              Cancel
            </span>
          </div>
        </Aux>
      );
    }
    return (
      <Aux>
        {this.props.display ? (
          <Backdrop change={this.backdropCloseHandler} />
        ) : null}
        <div
          style={{ display: this.props.display ? "" : "none" }}
          className={classes.Detail}
        >
          {detail}
        </div>
      </Aux>
    );
  }
}

export default TodoDetail;

import React from "react";
import TodoLists from "../TodoLists/TodoLists";
import classes from "./TodoContainer.module.css";
import Input from "../Input/Input";
import Error from "../../UI/Error/Error";
const TodoContainer = (props) => {
  const plusIcon = ["fas fa-plus-square", classes.Plus];
  const dropIcon = ["fas fa-sort-down", classes.Drop];
  let todoList = (
    <p className={classes.AddTodo}>Create Todo make Day Productive!</p>
  );
  if (props.listItems.length !== 0) {
    todoList = (
      <TodoLists
        deleteClick={props.deleteClick}
        toggleClick={props.toggleClick}
        listItems={props.listItems}
        toggleDetail={props.toggleDetail}
        closeDetail={props.closeDetail}
        updateShow={props.updateShow}
        updateClose={props.updateClose}
        closeUpdateAndDetail={props.closeUpdateAndDetail}
        updateTodo={props.updateTodo}
      />
    );
  }
  return (
    <div className={classes.TodoContainer}>
      {props.inputList.errorMessage !== null ? (
        <Error
          message={props.inputList.errorMessage}
          show={props.inputList.showError}
          clicked={props.crossClick}
        />
      ) : null}
      <div className={classes.SearchContainer}>
        <Input
          inputName="search"
          class={classes.Search}
          inputType={props.inputList.search.elementType}
          config={props.inputList.search.elementConfig}
          value={props.inputList.search.value}
          change={props.searchHandler}
        />
      </div>
      <div className={classes.Contain}>
        <div className={classes.AddContainer}>
          <Input
            inputName="add"
            class={classes.Add}
            inputType={props.inputList.add.elementType}
            config={props.inputList.add.elementConfig}
            value={props.inputList.add.value}
            change={props.changeHandler}
          />
          <i onClick={props.plusClick} className={plusIcon.join(" ")}></i>
        </div>
        <div>
          <Input
            inputName="filter"
            class={classes.Select}
            optionClass={classes.Option}
            inputType={props.inputList.filter.elementType}
            config={props.inputList.filter.elementConfig}
            value={props.inputList.filter.value}
            change={props.filterHandler}
          />
          <i className={dropIcon.join(" ")}></i>
        </div>
      </div>

      <div className={classes.TodoList}>{todoList}</div>
    </div>
  );
};

export default TodoContainer;

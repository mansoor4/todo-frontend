import React from "react";
import TodoList from "./TodoList/TodoList";
import Aux from "../../HOC/Auxillary/Auxillary";
import Spinner from "../../UI/Spinner/Spinner";
const TodoLists = (props) => {
  const items = props.listItems.map((item) => {
    let component = (
      <TodoList
        deleted={item.delete}
        deleteClick={props.deleteClick}
        completed={item.completed}
        toggle={props.toggleClick}
        key={item.id}
        id={item.id}
        text={item.text}
        description={item.description}
        display={item.display}
        toggleDetail={props.toggleDetail}
        detailDisplay={item.detail}
        closeDetail={props.closeDetail}
        updateShow={props.updateShow}
        updateClose={props.updateClose}
        update={item.update}
        closeUpdateAndDetail={props.closeUpdateAndDetail}
        updateTodo={props.updateTodo}
      />
    );

    if (item.loading) {
      component = <Spinner key={item.id} />;
    }
    return component;
  });
  return <Aux>{items}</Aux>;
};

export default TodoLists;

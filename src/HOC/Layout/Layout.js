import React from "react";
import Toolbar from "../../components/Toolbar/Toolbar";
import Aux from "../Auxillary/Auxillary";
import classes from "./Layout.module.css";
const Layout = (props) => {
  return (
    <Aux>
      <Toolbar />
      <main className={classes.Main}>{props.children}</main>
    </Aux>
  );
};

export default Layout;

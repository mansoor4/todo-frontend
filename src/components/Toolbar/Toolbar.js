import React from "react";
import todoLogo from "../../assets/istockphoto-1059266342-612x612.jpg";
import classes from "./Toolbar.module.css";
import { connect } from "react-redux";
import { logout } from "../../redux/actions/index";
import { withRouter } from "react-router-dom";
const Toolbar = (props) => {
  return (
    <div className={classes.Toolbar}>
      <div className={classes.Image}>
        <img src={todoLogo} alt="TODO" />
      </div>
      <div className={classes.Navitems}>
        <div onClick={() => props.logout(props.history)}>
          <i className="fas fa-sign-out-alt"></i>
          <span>Logout</span>
        </div>
      </div>
    </div>
  );
};
const mapStateToProps = (state) => {
  return {
    isAuth: state.isAuth,
  };
};

export default connect(mapStateToProps, { logout })(withRouter(Toolbar));

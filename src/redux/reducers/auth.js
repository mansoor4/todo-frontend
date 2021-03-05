import * as actionTypes from "../actions/actionTypes";

const initialState = {
  isAuth: false,
  userId: null,
  token: null,
  loading: false,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SIGNUP_START:
      return {
        ...state,
        loading: true,
      };
    case actionTypes.SIGNUP_SUCCESS:
      return {
        ...state,
        loading: false,
      };
    case actionTypes.SIGNUP_FAILED:
      return {
        ...state,
        loading: false,
      };
    case actionTypes.SIGNIN_START:
      return {
        ...state,
        loading: true,
      };
    case actionTypes.SIGNIN_SUCCESS:
      return {
        ...state,
        loading: false,
        token: action.token,
        userId: action.userId,
        isAuth: true,
      };
    case actionTypes.SIGNIN_FAILED:
      return {
        ...state,
        loading: false,
      };

    case actionTypes.LOGOUT:
      return {
        ...state,
        token: null,
        userId: null,
        isAuth: false,
      };
    default:
      return state;
  }
};

export default reducer;

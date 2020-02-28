import { createStore, compose, applyMiddleware } from "redux";
import ReduxThunk from "redux-thunk";
import RootReducer from "./reducers";

const store = createStore(
  RootReducer,
  (String(navigator.platform).indexOf("Linux") > -1) ? 
  compose(
    applyMiddleware(ReduxThunk),
    (window as any).__REDUX_DEVTOOLS_EXTENSION__ && (window as any).__REDUX_DEVTOOLS_EXTENSION__()
  ) :
  compose(
    applyMiddleware(ReduxThunk),
  )
);

export default store;
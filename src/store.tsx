import { createStore, applyMiddleware } from "redux";
import ReduxThunk from "redux-thunk";
import RootReducer from "./reducers";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { composeWithDevTools } from "redux-devtools-extension";

const persistConfig = {
  key: "root",
  storage,
  blacklist: ["MailReducer"],
};

const persistedReducer = persistReducer(persistConfig, RootReducer);

const store = createStore(persistedReducer, composeWithDevTools(applyMiddleware(ReduxThunk)));

export const persistor = persistStore(store);

export default store;

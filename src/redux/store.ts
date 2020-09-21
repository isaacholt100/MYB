import { createStore } from "redux";
import rootReducer from "./reducers";
const store = createStore(rootReducer);
export const dispatch = store.dispatch;
export const getState = store.getState;
export default store;
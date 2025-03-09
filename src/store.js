// import rootReducer from "./reducers";
// import {createStore, applyMiddleware, compose} from 'redux';
// import { thunk } from 'redux-thunk'

// // const store = createStore(rootReducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

// // Combine Thunk and Redux DevTools
// const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
// export const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)));

// export default store;




import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './reducers';
import { apiSlice } from "./redux/apiSlice"; // RTK Query API slice

// Create store using configureStore
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat((apiSlice.middleware)),
  devTools: process.env.NODE_ENV !== 'production', // Enables Redux DevTools in non-production environments
});

export default store;
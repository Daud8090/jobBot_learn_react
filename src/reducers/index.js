import contactsReducer from './contactsReducer';
import apiReducer from './apiReducer';
import {combineReducers} from 'redux'
import changeCounter from "./counterManipulation";
import { apiSlice } from '../redux/apiSlice';

const rootReducer = combineReducers({
    changeCounter,
    contactsReducer,
    api: apiReducer,
    [apiSlice.reducerPath]: apiSlice.reducer
})

export default rootReducer;
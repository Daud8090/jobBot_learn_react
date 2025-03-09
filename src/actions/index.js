import axios from "axios";


const ADD_CONTACT = 'ADD_CONTACT';
const REMOVE_CONTACT = 'REMOVE_CONTACT';
const UPDATE_CONTACT = 'UPDATE_CONTACT';
const INCREMENT_COUNTER = 'INCREMENT';
const DECREMENT_COUNTER = 'DECREMENT';

export const FETCH_DATA_REQUEST = "FETCH_DATA_REQUEST";
export const FETCH_DATA_SUCCESS = "FETCH_DATA_SUCCESS";
export const FETCH_DATA_FAILURE = "FETCH_DATA_FAILURE";

export const incNumber  = (num) => {
    return {
        type: INCREMENT_COUNTER,
        payload: num
    }
}

export const decNumber  = (num) => {
    return {
        type: DECREMENT_COUNTER,
        payload: num
    }
}

export const addContact = (contact) => ({
    type: ADD_CONTACT,
    payload: contact,
  });
  
export const removeContact = (id) => ({
type: REMOVE_CONTACT,
payload: id,
});

export const updateContact = (dataToBeUpdated) => ({
    type: UPDATE_CONTACT,
    payload: dataToBeUpdated,
});

export const fetchData = () => {
    // api call using redux thunk 
    return async (dispatch) => {
        dispatch({ type: FETCH_DATA_REQUEST })

        try {
            const response = await axios.get("https://jsonplaceholder.typicode.com/posts");
            dispatch({type: FETCH_DATA_SUCCESS, payload:response.data})
        } catch (error) {
            dispatch({type: FETCH_DATA_FAILURE, payload:error});
        }
    }
}
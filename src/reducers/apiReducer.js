import { FETCH_DATA_REQUEST, FETCH_DATA_SUCCESS, FETCH_DATA_FAILURE } from "../actions/index";

// set the initial state 

const initialState = {
    data: [],
    loading: false,
    error: null,
  };
// reducers updates the state
const apiReducer  = (state = initialState, action) => {
    console.log("going ",action.type)
    switch (action.type) {
        case FETCH_DATA_REQUEST:
            return({ ...state, loading: true, error: null })
        case FETCH_DATA_SUCCESS:
            return({ ...state, loading: false, data: action.payload }) //it returns a new state object with updated values.
        case FETCH_DATA_FAILURE:
            return({ ...state, loading: false, error: action.payload })
        default:
            return state;
    }
}

export default apiReducer;
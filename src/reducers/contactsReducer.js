import { v4 as uuid } from 'uuid';
// Action Types
const ADD_CONTACT = 'ADD_CONTACT';
const REMOVE_CONTACT = 'REMOVE_CONTACT';

const LOCAL_KEY = 'contacts';
const initialState = JSON.parse(localStorage.getItem(LOCAL_KEY)) || [];

const contactsReducer = (state = initialState, action ) =>{
    switch (action.type) {
        case ADD_CONTACT:
            const newContacts = [...state, {id: uuid(),...action.payload}];
            localStorage.setItem(LOCAL_KEY, JSON.stringify(newContacts));
            return newContacts
        case REMOVE_CONTACT:
            const updatedContacts = state.filter((contact) => contact.id !== action.payload);
            localStorage.setItem(LOCAL_KEY, JSON.stringify(updatedContacts));
            return updatedContacts;
        default:
            return state;
    }
}

export default contactsReducer;
import React from "react";
import ContactCard from "./ContactCard";
import { Link } from "react-router-dom";
import { useSelector } from 'react-redux';

const ContactList = () => {
    const contacts = useSelector(state => state.contactsReducer);
    const renderContactList = contacts.map((contact) => {
        return (
            <ContactCard contact={contact} key={contact.id} />
        )
    })
    return (
        <div className="main">
            <h2>Contact List</h2>
            <Link to={'/add'}>
                <button className="ui button blue right"> Add</button>
            </Link>
            <div className="ui celled list">
                {renderContactList}
            </div>
        </div>
    )
}

export default ContactList;
import React from "react";
import user from "../images/image.png"
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

const ContactDetail = () =>{
    const location = useLocation();
    const name = location.state.contact.name
    const email = location.state.contact.email
    return(
        <div className="main" >
            <div className="ui centered card">
                <div className="image">
                    <img src={user} alt="user" />
                </div>
                <div className=" content">
                    <div className="header">{name}</div>
                    <div className="description">{email}</div>
                </div>
            </div>
            <div className="ui container center aligned">
                <Link to={'/'}>
                    <button className='ui button green center'>Go To Contact List</button>
                </Link>
            </div>
        </div>
    )
}

export default ContactDetail;
// functional based component
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom'
import { addContact } from '../actions';

const AddContact = () => {
    const [contact, setContact] = useState({ name: '', email: '' });
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const add = (e) => {
        e.preventDefault()
        if (contact.name === "" && contact.email === "") {
            alert("name and email are empty")
            return;
        }
        if (contact.name === "" || contact.email === "") {
            alert("either name or email is empty")
            return;
        }
        dispatch(addContact(contact));
        setContact({ name: "", email: "" })
        // now on click we should land on some route this can be done using useNavigate from react-router-dom
        // suppose we want to go on the / route
        navigate("/");
    }
    return (
        <div className='ui main'>
            <h2>Add Contact</h2>
            <form className='ui form' onSubmit={add}>
                <div className='field'>
                    <label>
                        Name
                    </label>
                    <input type='text' name='name' placeholder='Name' value={contact.name} onChange={e => setContact({...contact, name: e.target.value })} />
                </div>
                <div className='field'>
                    <label>
                        Email
                    </label>
                    <input type='text' name='email' placeholder='Email' value={contact.email} onChange={e => setContact({...contact, email: e.target.value })} />
                </div>
                <button className='ui button blue'>add</button>
                <Link to={'/'}>
                    <button className='ui button green'>Go To Contact List</button>
                </Link>
            </form>
        </div>
    )
}

export default AddContact;














































// // class based component
// import React from 'react'
// import { useDispatch } from 'react-redux';
// import { Link, useNavigate } from 'react-router-dom'
// import { addContact } from '../actions';


// // Higher-order component to inject navigation into props
// function withNavigation(Component) {
//     return (props) => {
//       const navigate = useNavigate();
//       return <Component {...props} navigate={navigate} />;
//     };
//   }

// class AddContact extends React.Component{
// //creating state for the class based approach

// state={
//     name:'',
//     email:''
// }

//  add = (e) =>{
//     e.preventDefault()
//     if(this.state.name === "" && this.state.email === "")
//     {
//         alert("name and email are empty")
//         return;
//     }
//     if(this.state.name === "" || this.state.email === "")
//     {
//         alert("either name or email is empty")
//         return;
//     }
//     this.props.addContactHandler(this.state)
//     this.setState({name:"", email:""})
//     // now on click we should land on some route this can be done using useNavigate from react-router-dom
//     // suppose we want to go on the / route
//     this.props.navigate("/");
// }
//     render(){
//         return (
//             <div className='ui main'>
//                 <h2>Add Contact</h2>
//                 <form className='ui form' onSubmit={this.add}>
//                     <div className='field'>
//                         <label>
//                             Name
//                         </label>
//                         <input type='text' name='name' placeholder='Name' value={this.state.name} onChange={e => this.setState({name:e.target.value})}/>
//                     </div>
//                     <div className='field'>
//                         <label>
//                             Email
//                         </label>
//                         <input type='text' name='email' placeholder='Email' value={this.state.email} onChange={e => this.setState({email:e.target.value})}/>
//                     </div>
//                     <button className='ui button blue'>add</button>
//                     <Link to={'/'}>
//                         <button className='ui button green'>Go To Contact List</button>
//                     </Link>
//                 </form>
//             </div>
//         )
//     }
// }

// export default withNavigation(AddContact);
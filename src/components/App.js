import './App.css';
import Header from './Header';
import IncrementCounter from './IncrementCounter';
import AddContact from './AddContact';
import ContactList from './ContactList';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ContactDetail from './ContactDetail';
import UserDetails from './UserDetails';
import FetchPosts from './FetchPosts'; 
import FetchComments from './FetchComments';
import ChatInterface from './ChatInterface';
import JobDashboard from './JobDashboard';

function App() {

  return (
    <div className="ui container">
      <Router>
        <Header /> 
        <Routes> {/* routes will look for the match if it matches then it will not look for the other matches */}
          <Route path="/" element={<ContactList />} />
          <Route path="/add" element={<AddContact />} />
          <Route path="/contact/:id" element={<ContactDetail />} />
          <Route path="/redux" element={<IncrementCounter />}/>
          <Route path="/rtk" element={<UserDetails />}/>
          <Route path="/fetch-data-only-using-redux" element={<FetchPosts />}/>
          <Route path="/fetch-data-using-rtk-query" element={<FetchComments />}/>
          <Route path="/ai-assistant" element={<ChatInterface />}/>
          <Route path="/jobs" element={<JobDashboard />}/>
        </Routes>
      </Router>
          {/* <AddContact addContactHandler={addContactHandler} /> */}
          {/* <ContactList contacts={contacts} removeContactHandler={removeContactHandler} /> */}
    </div>
  );
}

export default App;

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchData } from "../actions/index";

const FetchPosts = () => {
const dispatch = useDispatch();
const {data, loading, error} = useSelector((state)=> state.api); // it will fetch the state from reducer, here we specified api as the reducer in reducers file
console.log(data)

useEffect(() => {
  dispatch(fetchData())
}, []) // condition based useEffect , when there is some action performed on the dispatch then only use useEffect will get executed.

console.log(data)
return (
  <div className="main">
    <h2>API Data</h2>

    {loading && <p>Loading...</p>}
    {error && <p className="error">Error: {error}</p>}

    {data?.map((item, index) => (
      <div key={item.id} className="item-container">
        <span className="step-number">{index + 1}.</span>
        <div className="item">
          <div className="header">{item.title}</div>
          <p className="logo">{item.body}</p>
        </div>
      </div>
    ))}
  </div>
);
};

export default FetchPosts;




// state is like 
// {
//   "api": {
//     "data": [...],        // API response data
//     "loading": true,      // Whether an API request is in progress
//     "error": null         // Error message if the request failed
//   }
// }
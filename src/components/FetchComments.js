import React from "react";
import { useGetCommentsQuery } from "../redux/apiSlice";

const FetchComments = () => {
    const { data, error, isLoading } = useGetCommentsQuery();
    if(isLoading) return <p>Loading...</p>;
    if(error) return <p className="error">Error: {error}</p>

console.log(data,'--->>', error,'=====>>', isLoading)
return (
  <div className="main">
    <h2>API Data</h2>

    {data.map((item, index) => (
      <div key={item.id} className="item-container">
        <span className="step-number">{index + 1}.</span>
        <div className="item">
          <div className="header">{item.name}- email- {item.email}</div>
          <p className="logo">{item.body}</p>
        </div>
      </div>
    ))}
  </div>
);
};

export default FetchComments;
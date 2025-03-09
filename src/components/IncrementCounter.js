import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { decNumber, incNumber } from '../actions';
 
const IncrementCounter = () =>{
    const myState = useSelector((state) => state.changeCounter)
    const dispatch = useDispatch();
    return (
        <div className='container'>
            <h1>Increment/Decrement counter</h1>
            <h4>Using React and Redux</h4>
            <div className='quantity'>
                <a className='quantity-minus' title='decrement'
                onClick={()=> dispatch(decNumber(5))}><span> - </span></a>
                <input name='quantity' type='text' className='quantity-input' value={myState} />
                <a className='quantity-plus' title='increment'
                onClick={()=> dispatch(incNumber(5))}><span> + </span></a>
            </div>
        </div>
    )
}

export default IncrementCounter;

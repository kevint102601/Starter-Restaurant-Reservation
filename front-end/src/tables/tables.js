import React, { useState } from "react";
import { createReservation, createTable } from "../utils/api";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import ErrorAlert from "../layout/ErrorAlert";
import TableForm from "../forms/tableForm";


export default function NewTable(){
    const history = useHistory()
    const base ={
        table_name: '',
        capacity: 0
    }
    
    const[errorArray, setErrorArray] = useState([])
    let err = []
  
    function validateName(table_name) {
      if (table_name.trim() === ''|| table_name.length < 2) {
        err.push('Please enter a valid name.') ;
      }
      return null; // Validation passed
    }
    function validateCapacity(capacity) {
        if (!Number.isInteger(capacity) || capacity < 2) {
          err.push('Please enter a valid number of people.');
        }
        return null; // Validation passed
      }

    const [form, setForm] = useState(base)
    function changeHandler({ target: { name, value } }) {
        if (name === "capacity") {
          setForm((prevState) => ({
            ...prevState,
            [name]: Number(value),
          }));
        } else {
          setForm((prevState) => ({
            ...prevState,
            [name]: value,
          }));
        }
      }

    function submitHandler(event) {
        event.preventDefault();
        validateName(form.table_name,);
        validateCapacity(form.capacity);
        setErrorArray(err)
        if(err.length === 0){
        createTable(form)
        .then(()=> history.push(`/dashboard`))
        }
      }
    return(
        <>
         <form onSubmit={submitHandler}>
            <TableForm edit={false} form={form} changeHandler={changeHandler}/>
            <button type="submit" className="btn">
              Submit Table
            </button>
            <button type="button" className="btn" onClick={() => history.goBack()}>
              Cancel
            </button>
        </form>
        {errorArray.length > 0 ? errorArray.map((error, index) => <ErrorAlert key={index} error={error}/>) : ''}
        </>
    )
}
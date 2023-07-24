import React from "react";
import { freeTable } from "../utils/api";
import {BrowserRouter as Router, useHistory} from "react-router-dom"

function Table({data}){
    const history = useHistory()

    function handleFinish(event){
        event.preventDefault();
        let result = window.confirm("Is this table ready to seat new guests? This cannot be undone.")
        if(result){
            freeTable(data.table_id)
                .then(res => {
                    history.push(`/`)  
                })
        }
    }

    return (
        <tr>
            <td>{data.table_name}</td>
            <td>{data.capacity}</td>
            <td data-table-id-status={data.table_id}>
                {!data.reservation_id ? "Free" : "Occupied"}
            </td>
            <td>
                {!data.reservation_id 
                    ?   "Seat Me!"
                    :   <button
                            className="btn btn-danger dashBrdBtn actionBtn"
                            data-table-id-finish={data.table_id}
                            onClick={handleFinish}
                            >
                            Finish
                        </button>
                } 
            </td>
        </tr>
   )
    
}

export default Table
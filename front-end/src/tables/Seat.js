import React, {useState, useEffect} from "react"
import {BrowserRouter, useHistory, useParams} from "react-router-dom"
import { listTables, updateTable } from "../utils/api"
import { today } from "../utils/date-time"

function SeatRes(){
    const { reservationId } = useParams()
    const history = useHistory()

    const [tables, setTables] = useState([]);
    const [selectedTableId, setSelectedTableId] = useState('');
    const [errorMessage, setErrorMessage] = useState(null);

    function loadPage(){
        const abortController = new AbortController();
        setErrorMessage(null);
        listTables(abortController.signal)
            .then(setTables)
            .catch(setErrorMessage)
        return () => abortController.abort();
    }
    console.log(tables)
    useEffect(loadPage, []);

    function handleSelectChange(event){
        setSelectedTableId(event.target.value);
    };

    function handleSubmit(event){
        event.preventDefault();
        setErrorMessage(null);

        //grab selected table data
        const selectedTable = tables.find((table, indx)=>{
            return table.table_id === Number(selectedTableId)
        })
        console.log("resId", reservationId) //string
        console.log("tableId", selectedTable.table_id) //number

        //PUT request.. on submit, we send api request to /tables/:tableId/seat
        //const abortController = new AbortController();
        updateTable( reservationId, selectedTable.table_id)
            .then(res => {
                console.log(res)
                history.push(`/dashboard?date=${today()}`)
            })
        //return abortController.abort()        <--- Abort controller makes seating table inconsistent.
    }

    const handleCancel = () => {
        history.goBack();
    };

    return (
        <div>
            <h2>Seat Reservation</h2>

            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="table_id">Table:</label>
                    <select
                        className="form-control"
                        id=""
                        name="table_id"
                        value={selectedTableId}
                        onChange={handleSelectChange}
                        required>
                        <option value="">Select a table</option>
                        {tables.map((table) => (
                            <option key={table.table_id} id={table.table_id} value={table.table_id}>
                            {`${table.table_name} - ${table.capacity}`}
                            </option>
                        ))}
                    </select>
                </div>

                <button type="submit" className="btn btn-primary mr-2" onClick={handleSubmit}>
                    Submit
                </button>
                <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                    Cancel
                </button>
            </form>
        </div>
      )
}

export default SeatRes
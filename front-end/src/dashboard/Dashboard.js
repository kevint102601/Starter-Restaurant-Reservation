import React, { useEffect, useState } from "react";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { listTables } from "../utils/api";
import {Link} from "react-router-dom"
import { previous, next, today } from "../utils/date-time";
import Reservation from "./Reservation";
import Table from "./Table";


/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [tables, setTables] = useState([])
  const [tablesError, setTablesError] = useState(null)

  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    listTables(abortController.signal)
      .then(setTables)
      .catch(setTablesError)
    return () => abortController.abort();
  }

  function deleteRes(resToDelete){
    let filteredRes = reservations.filter(res => res !== resToDelete);
    setReservations(filteredRes)
  }

  const months   = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const arrDate = date.split("-")
  if(arrDate[1][0]=="0"){
    arrDate[1]=arrDate[1][1]
  }
  const dateInWords = months[arrDate[1]] + ' ' + arrDate[2] + ', ' + arrDate[0]

  return (
    <main>
      <h1 className="title">Dashboard</h1>
      <div className=" mb-3 title">
        <h4 className="mb-0">Reservations for {dateInWords}</h4>

          <form>
            <div className="form-group">
                <Link to={`/dashboard?date=${previous(date)}`}><button className="btn btn-secondary m-1"> Previous </button></Link>
                 <Link to={`/dashboard?date=${today()}`}><button className="btn btn-secondary m-1 dashBrdBtn">Today</button></Link>
                <Link to={`/dashboard?date=${next(date)}`}><button className="btn btn-secondary m-1 dashBrdBtn">Next</button></Link>                   
            </div>
          </form>  
        
      </div>
      <ErrorAlert error={reservationsError} />
      <div className="table-responsive table-responsive-sm table-responsive-md">
        <table className="table-sm">
          <thead className="tableHead">
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th className="sizeColumn">Size</th>
              <th>Time</th>
              <th className="phoneNumberColumn">Phone</th>
              <th>Status</th>
              <th className="actionButtonCol">Action</th>
            </tr>
          </thead>
          <tbody>
              {reservations.map((oneRes, indx) => <Reservation key={oneRes.reservation_id} reservation={oneRes} deleteRes={deleteRes}/>)}
          </tbody>
        </table>
      </div>

      <h1 className="title">Tables</h1>
      <ErrorAlert error={tablesError} />
      <div className="table-responsive table-responsive-sm table-responsive-md">
        <table className="table-sm">
          <thead className="tableHead">
            <tr>
              <th>Table Name</th>
              <th>Capacity</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
              {tables.map((oneTable, indx) => <Table key={oneTable.table_id} data={oneTable}/>)}
          </tbody>
        </table>
      </div>
    </main>
  );
}

export default Dashboard;

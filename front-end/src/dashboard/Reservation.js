import React from "react";
import {BrowserRouter as Router, Link, useHistory} from "react-router-dom"
import { cancelReservation } from "../utils/api";
import { tConvert } from "../utils/Time";


function Reservation({reservation}){
    const history = useHistory()

    let newTime = tConvert(reservation.reservation_time)

    const reservation_id = reservation.reservation_id

    function handleCancel(event){
        event.preventDefault();
        let result = window.confirm("Do you want to cancel this reservation? This cannot be undone.")
        if(result){
            //if OK is clicked, we cancel table, sends PUT request to change status to "cancelled"
            cancelReservation(reservation_id)
                .then(history.go(0))
        }
    }

    function checkStatus(status){
        if(status === 'booked'){
            return (
                <td>
                <Link to={`/reservations/${reservation_id}/seat`}> 
                    <button 
                        name="seat"
                        className="btn btn-primary dashBrdBtn actionBtn">
                        Seat    
                    </button>                                            
                </Link>
                <Link to={`/reservations/${reservation_id}/edit`}> 
                    <button
                        name="edit"
                        className="btn btn-secondary dashBrdBtn actionBtn">
                        Edit    
                    </button>                                            
                </Link> 
                    <button
                        data-reservation-id-cancel={reservation.reservation_id}
                        name="cancel"
                        className="btn btn-danger dashBrdBtn actionBtn"
                        onClick={handleCancel}>
                        Cancel    
                    </button>
            </td>
            )
        } else if (status === 'seated') {
            return (
                <td>
                    <button name="delete"
                        className="btn btn-danger dashBrdBtn cancel" 
                        >	
                        Dining 
                    </button>
                </td>
            )
        } else {
            return (
                <td></td>
            )
        }
    }

    return (
        <tr>
            <td>{reservation.first_name}</td>
            <td>{reservation.last_name}</td>
            <td className="sizeColumn">{reservation.people}</td>
            <td>{newTime}</td>
            <td className="phoneNumberColumn">{reservation.mobile_number}</td>
            <td className="actionButtonCol" data-reservation-id-status={reservation.reservation_id}>{reservation.status}</td>
            {checkStatus(reservation.status)}
        </tr>
   )
    
}

export default Reservation
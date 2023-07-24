import React from "react";
import {useParams} from "react-router-dom";
import ReservationForm from "../forms/reservationForm";

function EditRes(){
    const { reservationId } = useParams()
    return(
        <React.Fragment>
            <h1>Edit Reservation</h1>
            <ReservationForm reservationId={reservationId}/>
        </React.Fragment>
    )
}

export default EditRes
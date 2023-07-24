import React,{useState, useEffect} from "react";
import { createReservation } from "../utils/api";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import ErrorAlert from "../layout/ErrorAlert";
import { readReservation } from "../utils/api";
import { updateReservation } from "../utils/api";
import formatReservationDate from "../utils/format-reservation-date";

export default function ReservationForm({reservationId}){
    let isValid = true
  
    const history = useHistory();
    const base = {
      first_name: "",
      last_name: "",
      mobile_number: "",
      reservation_date: "",
      reservation_time: "",
      people: 0,
    };
    const [form, setForm] = useState(base);
    const[errorArray, setErrorArray] = useState([])
    let err = []
 
    function loadRes() {
      if(reservationId){
          const abortController = new AbortController();
              readReservation(reservationId, abortController.signal)
                  .then(setForm)
                  .catch(err=>{
                      throw err
                  })
          return () => abortController.abort();            
      } else {
          console.log("No resID, landed on create Page")
      }
  }

  useEffect(loadRes, []);

    function changeHandler({ target: { name, value } }) {
      if (name === "people") {
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
  

  
    function validateName(firstName, lastName) {
      if (firstName.trim() === '' || lastName.trim() === '') {
        err.push('Please enter a valid name.') ;
        isValid = false
      }
      return null; // Validation passed
    }
    function validateMobileNumber(mobileNumber) {
      const regex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
      if (!regex.test(mobileNumber)) {
        err.push('Please enter a valid mobile number (e.g., 000-000-0000).');
        isValid = false
      }
      return null; // Validation passed
    }
    function validateReservationDate(reservationDate) {
      const selectedDate = new Date(reservationDate);
      const currentDate = new Date();
    
      if (isNaN(selectedDate.getTime())) {
       err.push('Please enter a valid reservation date.');
       isValid = false
      }
    
      if (selectedDate < currentDate) {
         err.push('Reservation date cannot be in the past.');
         isValid = false
      }
      const [year, month, day] = reservationDate.split("-");
      const dateObj = new Date(year, month - 1, day);
      const dayOfWeek = dateObj.getDay();
      if(dayOfWeek === 2){
          err.push('we are closed on Tuesdays')
          isValid = false
      }
  
      return null; // Validation passed
    }

    function convertISOTimeToMinutes(time) { 
      const result = time.split(":").map((part) => parseInt(part));
      return result[0] * 60 + result[1];
  }

    function validateReservationTime(reservation_time) {
      let isValid = true

      if(!reservation_time){
          err.push("Please enter a time")
          isValid = false
      }

      const resTime = convertISOTimeToMinutes(reservation_time)
      if(resTime < 630 || resTime > 1290){
          err.push('Please select a time between 10:30am and 9:30pm.')
          isValid = false
      }
      return null
    }

    function validateNumberOfPeople(people) {
      if (!Number.isInteger(people) || people <= 0) {
        err.push('Please enter a valid number of people.');
        isValid = false
      }
      return null; // Validation passed
    }
   
  
    function submitHandler(event) {
      event.preventDefault();
      validateName(form.first_name, form.last_name);
      validateMobileNumber(form.mobile_number);
      validateReservationDate(form.reservation_date);
      validateReservationTime(form.reservation_time);
      validateNumberOfPeople(form.people);
      setErrorArray(err)
      if(err.length === 0){
        if (reservationId){
          const abortController = new AbortController();
          updateReservation(form, abortController.signal)
             .then((updatedRes)=>{
                 history.push(`/dashboard?date=${(updatedRes.reservation_date)}`)
             })
          return () => abortController.abort();
        }else{
          createReservation(form)
          .then(()=> history.push(`/dashboard?date=${form.reservation_date}`))
        }
      
      }
    }
    return (
        <>
          <form onSubmit={submitHandler}>
            <div className="formGroup">
              <label>Name</label>
              <input
                type="text"
                id="firstName"
                name="first_name"
                value={form.first_name}
                required={true}
                placeholder="First Name"
                onChange={changeHandler}
              />
              <input
                type="text"
                id="lastName"
                name="last_name"
                value={form.last_name}
                required={true}
                placeholder="Last Name"
                onChange={changeHandler}
              />
              <input
                type="phone"
                id="mobileNumber"
                name="mobile_number"
                value={form.mobile_number}
                required={true}
                placeholder="Phone Number"
                onChange={changeHandler}
              />
              <input
                type="date"
                id="reservation_date"
                name="reservation_date"
                value={form.reservation_date}
                required={true}
                placeholder="01/01/01"
                onChange={changeHandler}
              />
              <input
                type="time"
                id="reservation_time"
                name="reservation_time"
                value={form.reservation_time}
                required={true}
                placeholder="12:00 am"
                onChange={changeHandler}
              />
              <input
                type="number"
                id="people"
                name="people"
                value={form.people}
                required={true}
                placeholder="Number of People"
                onChange={changeHandler}
              />
            </div>
            
            {errorArray.length > 0 ? errorArray.map((error, index) => <ErrorAlert key={index} error={error}/>) : ''}

            <button type="submit" className="btn">
              Submit Reservation
            </button>
            <button type="button" className="btn" onClick={() => history.goBack()}>
              Cancel
            </button>
          </form>
        </>
      );

}

import React from "react";
import { createReservation } from "../utils/api";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import ErrorAlert from "../layout/ErrorAlert";

export default function TableForm({edit, form, changeHandler}){


    if(edit === false){
        return (
            <>
                    <div class='formGroup'>
                    <input
                        type="text"
                        id="table_name"
                        name="table_name"
                        value={form.table_name}
                        required={true}
                        placeholder="Table Name"
                        onChange={changeHandler}
                    />
                    <input
                        type="number"
                        id="capacity"
                        name="capacity"
                        value={form.capacity}
                        required={true}
                        placeholder="capacity"
                        onChange={changeHandler}
                    />
                    </div>
            </>
        )
    }
}
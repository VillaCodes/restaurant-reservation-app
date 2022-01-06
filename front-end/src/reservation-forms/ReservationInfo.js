import React, {useState} from "react";
import { useHistory } from "react-router-dom";
import { createReservation } from "../utils/api";
import { isNotOnATuesday } from "../utils/date-time";
import { isInTheFuture } from "../utils/date-time";
import ErrorAlert from "../layout/ErrorAlert";
import Form from "./Form";


export default function ReservationInfo () {
    const history = useHistory();
    const [reservationsError, setReservationsError] = useState(null);
    
    const initialFormData = {
      first_name: "",
      last_name: "",
      mobile_number: "",
      reservation_date: "",
      reservation_time: "",
      people: 0,
    };

    const [formData, setFormData] = useState({...initialFormData})


    const handleFormChange = (event) => {
      setFormData({
        ...formData,
        [event.target.name]: event.target.value,
      });
    };

    const findErrors = (date, errors) => {
      isNotOnATuesday(date, errors);
      isInTheFuture(date, errors);
    };
  
    const handleSubmit = async (event) => {
      event.preventDefault();
      const abortController = new AbortController();
      const errors = [];
      findErrors(formData.reservation_date, errors);
      if (errors.length) {
        setReservationsError({ message: errors });
        return;
      }
      try {
        formData.people = Number(formData.people);
        await createReservation(formData, abortController.signal);
        const date = formData.reservation_date;
        history.push(`/dashboard?date=${date}`);
      } catch (error) {
        setReservationsError(error);
      }
      return () => abortController.abort();
    };


    return (
      <div>
        <ErrorAlert error={reservationsError} />
        <Form
          initialformData={formData}
          handleFormChange={handleFormChange}
          handleSubmit={handleSubmit}
        />
      </div>
    );
}
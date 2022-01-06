import React from "react";
import { useHistory } from "react-router"

export default function Form ({
    initialFormData, 
    handleFormChange,
    handleSubmit
}) {
    const history = useHistory()

    const handleCancel = () => {
        history.goBack()
    };

    //initialFormData && as a conditional below?
    return (
       (
        <div>
          <h1 className="mb-3 justify-content-center">Create Reservation</h1>
          <Form onSubmit = {handleSubmit} className="mb-4">

          <div className="row mb-3">
            <div className="col-6 form-group">
            <label className="form-label" htmlFor="first_name">
              First Name
            </label>
            <input
              className="form-control"
              id="first_name"
              name="first_name"
              type="text"
              value={initialFormData?.first_name}
              placeholder={initialFormData?.first_name || "First Name"}
              onChange={handleFormChange}
              required={true}
            />
            </div>
          <div className="col-6">
            <label className="form-label" htmlFor="last_name">
              Last Name
            </label>
            <input
              className="form-control"
              id="last_name"
              name="last_name"
              type="text"
              value={initialFormData?.last_name}
              placeholder={initialFormData?.last_name || "Last Name"}
              onChange={handleFormChange}
              required={true}
            />
          </div>
        </div>
        
        <div className="row mb-3">
          <div className="col-6 form-group">
            <label className="form-label" htmlFor="mobile_number">
            Phone Number
            </label>
                <input
                className="form-control"
                id="mobile_number"
                name="mobile_number"
                type="number"
                value={initialFormData?.mobile_number}
                placeholder={initialFormData?.mobile_number || "Mobile Number"}
                onChange={handleFormChange}
                required={true}
                />
            </div>
            <div className="col-6">
            <label className="form-label" htmlFor="people">
              Party Size
            </label>
            <input
              className="form-control"
              id="people"
              name="people"
              type="number"
              min="1"
              value={initialFormData?.people}
              placeholder={initialFormData?.people || "Number of People"}
              onChange={handleFormChange}
              required={true}
            />
          </div>
          </div>

          <div className="row mb-3">
            <div className="col-6 form-group">
            <label className="form-label" htmlFor="reservation_date">
              Reservation Date
            </label>
            <input
              className="form-control"
              id="reservation_date"
              name="reservation_date"
              type="date" 
              pattern="\d{4}-\d{2}-\d{2}"
              value={initialFormData?.reservation_date}
              placeholder={initialFormData?.reservation_date || "YYYY-MM-DD"}
              onChange={handleFormChange}
              required={true}
            />
            </div>
          <div className="col-6">
            <label className="form-label" htmlFor="reservation_time">
              Reservation Time
            </label>
            <input
              className="form-control"
              id="reservation_time"
              name="reservation_time"
              type="time" 
              pattern="[0-9]{2}:[0-9]{2}"
              value={initialFormData?.reservation_time}
              placeholder={initialFormData?.reservation_time || "HH:MM"}
              onChange={handleFormChange}
              required={true}
            />
          </div>
        </div>

        <div>
            <button
              type="button"
              className="btn btn-secondary mr-2"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>
        </Form>
        </div>
        )
    )
}
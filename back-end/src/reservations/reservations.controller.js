const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const service = require("./reservations.service")



//all the fields used for reservations

const VALID_PROPERTIES = [
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people",
  "status",
  "reservation_id",
  "created_at",
  "updated_at",
];

const REQUIRED_FIELDS = [
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people",
];

//helper function to be used in validation for time values
function validateTime(timeString) {
  const [hour, minute] = timeString.split(":");

  if (hour.length > 2 || minute.length > 2) {
    return false;
  }
  if (hour < 1 || hour > 23) {
    return false;
  }
  if (minute < 0 || minute > 59) {
    return false;
  }
  return true;
}

//validation below//


//checks the valid properties arrays above to make sure there are no unwanted properties in the request

function hasOnlyValidProperties(req, res, next) {
  const {data = {}} = req.body;

  const invalidProperties = Object.keys(data).filter((property) => {
    return !VALID_PROPERTIES.includes(property)
  })

  if (invalidProperties) {
    return next({status: 400, message: `Invalid field(s): ${invalidProperties.join(", ")}`})
  }

  next();
}

function hasRequiredProperties(req, res, next) {
  const {data = {}} = req.body;

  REQUIRED_FIELDS.forEach((field) => {
    if (!data[field]) {
      return next({status: 400, message: `${field} is missing.`})
    }
  })

  next();
}

//check @param reservation_id to make sure the matching res exists

async function reservationExists(req, res, next) {
  const { reservation_id } = req.params;
  const reservation = await service.read(reservation_id)

  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  }
  next({
    status: 404,
    message: `Reservation ${req.params.reservation_id} does not exist.`,
  });
}

//validate that request has data/is not null

function hasData(req, res, next) {
  if (req.body.data) {
    return next()
  }
  next({status: 400, message: "Body must have data property"})
}

//make sure reservation is not on a Tuesday

function isNotOnTuesday(req, res, next) {
  const { reservation_date } = req.body.data;
  const [year, month, day] = reservation_date.split("-");
  const date = new Date(`${month} ${day}, ${year}`);
  res.locals.date = date;
  if (date.getDay() === 2) {
    return next({ status: 400, message: "Location is closed on Tuesdays" });
  }
  next();
}

//regular expressions for time and date formats
const dateFormat = /^\d\d\d\d-\d\d-\d\d$/;
const timeFormat = /^\d\d:\d\d$/;

function timeFormatIsValid(timeString) {
  return timeString.match(timeFormat)?.[0];
}

function dateFormatIsValid(dateString) {
  return dateString.match(dateFormat)?.[0];
}

//makes sure reservation request is for a future date

function dateNotInPast(dateString, timeString) {
  const now = new Date();
  // creates a date object using a string formatted as: '2021-10-08T01:21:00'
  const reservationDate = new Date(dateString + "T" + timeString);
  return reservationDate >= now;
}

//validate that reservation is during business hours

function duringBusinessHours(timeString) {
  const opens = "10:30";
  const lastHour = "21:30";

  return timeString >= opens && timeString <= lastHour
}

//check query params to make sure either mobile_number or date are entered before performing a search query

function hasValidSearchQuery(req, res, next) {
  const {mobile_number, date} = req.query;

  if (!mobile_number && !date) {
    return next({status: 400, message: `Please enter a valid mobile number or date`})
  };

  next();
}


//validate that status is correct

function statusIsValid(req, res, next) {
  const { status } = req.body.data;

  const VALID_STATUSES = ["seated", "finished", "booked", "cancelled"];

  if (!VALID_STATUSES.includes(status)) {
    return next({status: 400, message: `Invalid status: ${status}`})
  }

  next();
}

//checks that reservation status is not finished before put request

function statusIsNotFinished(req, res, next) {
  const {status} = res.locals.reservation;

  if (status === "finished") {
    return next({status: 400, message: `A finished reservation can not be edited`})
  }

  next();
}

//checks that reservation status is booked before put request

function statusIsBooked(req, res, next) {
  const { status } = res.locals.reservation;

  if (status !== "booked") {
    return next({status: 400, message: `Only "booked" reservations can be edited`})
  }

  next();
}

//Validates the individual values of the request to ensure they are the right data type and adhere to rules. Uses helper functions from above.

function requestValueValidator(req, res, next) {
  const {reservation_date, reservation_time, people} = req.body.data;

  if (!Number.isInteger(people) || people < 1) {
    return next({status: 400, message: `People field must include valid integer greater than 0`})
  }

  if(!validateTime(reservation_time) || !timeFormatIsValid(reservation_time)) {
    return next({status: 400, message: `Reservation time must be in HH:MM format`})
  }

  if(!dateFormatIsValid(reservation_date)) {
    return next({status: 400, message: `Date must be in YYYY-MM-DD format`})
  }

  if(!dateNotInPast(reservation_date)) {
    return next({status: 400, message: `Reservations can not be made for a past date`})
  }

  if (!duringBusinessHours(reservation_time)) {
    return next({status: 400, message: "The reservation must be booked between 10:30 AM and 9:30 PM",});
  }

  if (!isNotOnTuesday(reservation_date)) {
    return next({status: 400, message: "The reservation date is a Tuesday- but the restaurant is closed on Tuesdays",});
  }

  if (req.body.data?.status !== null || "booked") {
    return next ({status: 400, message: `"finished" and "seated" are not valid statuses for this request`})
  } 

  next();
}

//validation above
//crud below
/**
 * List handler for reservation resources. Determines which service query to make based on query param
 */
async function list(req, res) {
  const {mobile_number, date} = req.query;

  const reservations = await (mobile_number
    ? service.searchByPhone(mobile_number)
    : service.searchByDate(date));

  res.json({data: reservations});
}

//locals are set within reservationExists() validation;
async function read (req, res) {
  const { reservation } = res.locals;

  res.json({ data: reservation });
}

// Create new reservation
async function create(req, res) {
  const reservation = await service.create(req.body.data);
  res.status(201).json({ data: reservation});
}

//update existing reservation
async function update(req, res) {
  const updatedReservation = {
    ...req.body.data,
    reservation_id: res.locals.reservation.reservation_id,
  };
  
  service
  .update(updatedReservation)
  .then((data) => res.status(200).json({ data: updatedReservation }))
  .catch(next);
}

//update a reservation's status

async function updateStatus(req, res) {
  const updatedStatus = req.body.data.status;

  const {reservation_id} = res.locals.reservation;

  service
  .updateStatus(reservation_id, updateStatus)
  .then((data) => res.status(200).json({ data : { status: updatedStatus} }))
  .catch(next);
}


module.exports = {
  list: [hasValidSearchQuery, asyncErrorBoundary(list)],
  read: [asyncErrorBoundary(reservationExists), read],
  create: [hasOnlyValidProperties, hasRequiredProperties, requestValueValidator, asyncErrorBoundary(create)],
  update: [asyncErrorBoundary(reservationExists), hasOnlyValidProperties, hasRequiredProperties, requestValueValidator, statusIsBooked, asyncErrorBoundary(update)],
  updateStatus: [asyncErrorBoundary(reservationExists), statusIsValid, statusIsNotFinished, asyncErrorBoundary(updateStatus)],
};

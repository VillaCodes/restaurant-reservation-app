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
    return next({status: 400, message: `Invalid field(s): ${invalidStatuses.join(", ")}`})
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

function reservationExists(req, res, next) {
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
  .then((data) => res.json({ data }))
  .catch(next);
}


module.exports = {
  list: asyncErrorBoundary(list),
  read: [asyncErrorBoundary(reservationExists), read],
  create,
  update,
};

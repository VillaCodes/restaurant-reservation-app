const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const service = require("./reservations.service")



//all the fields used for reservations

const VALID_RESERVATION_FIELDS = [
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people",
];

//helper function to be used in validation
function _validateTime(str) {
  const [hour, minute] = str.split(":");

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

//validation below

function hasData(req, res, next) {
  if (req.body.data) {
    return next()
  }
  next({status: 400, message: "Body must have data property"})
}

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

//crud below
/**
 * List handler for reservation resources
 */
async function list(req, res) {
  const data = await service.list();

  res.json({data});
}

async function read (req, res) {
  const reservation = res.locals.reservation

  res.json({reservation});
}

module.exports = {
  list: asyncErrorBoundary(list),
  read: [asyncErrorBoundary]
};

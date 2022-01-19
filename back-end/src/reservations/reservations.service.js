const knex = require("../db/connection");

function list() {
    return knex("reservations")
      .select("*")
      .whereNotIn("status", ["finished", "cancelled"])
      .orderBy("reservations.reservation_date");
  }

// returns non-finished reservations for the specified date
function searchByDate(date) {
    return knex("reservations")
      .select("*")
      .where({ reservation_date: date })
      .whereNot("status", "finished")
      .orderBy("reservation_time");
  }
  
  // returns all reservations that partial match the specified phone number
  function searchByPhone(mobile_number) {
    return knex("reservations")
      .whereRaw(
        "translate(mobile_number, '() -', '') like ?",
        `%${mobile_number.replace(/\D/g, "")}%`
      )
      .orderBy("reservation_date");
  }

// posts new reservation and then returns it
function create(newReservation) {
    return knex("reservations")
      .insert(newReservation, "*")
      .then((createdReservation) => createdReservation[0]);
  }


// returns a reservation for the specified id
async function read (reservation_id) {
    return knex("reservations")
    .select("*")
    .where({reservation_id})
    .first();
}

//takes updated reservation param and updates the database where the id matches
async function update(updatedReservation) {
    return knex("reservations")
    .where({reservation_id: updatedReservation.reservation_id})
    .update(updatedReservation, "*")
    .then((result) => result[0]);
}

// updates reservation status
function updateStatus(reservation_id, status) {
  return knex("reservations")
    .select("*")
    .where({ reservation_id })
    .update({ status })
    .returning("*")
    .then((updated) => updated[0]);
}


//not in use, but could be utilized in the future
async function destroy(reservation_id) {
    return knex("reservations")
    .where({reservation_id})
    .del();
}

module.exports = {
    create,
    read,
    update,
    updateStatus,
    destroy,
    searchByDate,
    searchByPhone,
    list,
}
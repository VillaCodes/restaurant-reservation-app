const knex = require("../db/connection");

// returns all tables
function list() {
  return knex("tables").select("*").orderBy("table_name");
}

// posts new table
function create(table) {
  return knex("tables")
    .insert(table)
    .returning("*")
    .then((newTables) => newTables[0]);
}

// returns a reservation for the specified id
function read(id) {
  return knex("tables")
    .select("*")
    .where({ table_id: id })
    .then((result) => result[0]);
}

// updates table after being assigned a reservation and updates reservation status
async function update(updatedTable, reservation_id, updatedReservationStatus) {
  try {
    await knex.transaction(async (trx) => {
      const returnedUpdatedTable = await trx("tables")
        .where({ table_id: updatedTable.table_id })
        .update(updatedTable, "*")
        .then((updatedTables) => updatedTables[0]);

      const returnedUpdatedReservation = await trx("reservations")
        .where({ reservation_id: reservation_id })
        .update({ status: updatedReservationStatus }, "*")
        .then((updatedReservations) => updatedReservations[0]);
    });
  } catch (error) {
    // If this runs, neither the reservation nor table updates have taken place.
    console.error(error);
  }
}

module.exports = {
  create,
  read,
  update,
  list,
};
const knex = require("../db/connection");

async function create (newReservation) {
    return knex("reservations").insert(newReservation).returning("*");
}

async function list () {
    return knex("reservations").select("*");
}

async function read (reservation_id) {
    return knex("reservations")
    .where({reservation_id})
    .first();
}

async function update(updatedReservation) {
    return knex("reservations")
    .where({reservation_id: updatedReservation.reservation_id})
    .update(updatedReservation, "*");
}

async function destroy(reservation_id) {
    return knex("reservations")
    .where({reservation_id})
    .del();
}

module.exports = {
    create,
    list,
    read,
    update,
    destroy
}
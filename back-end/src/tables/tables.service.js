const knex = require('../db/connection');

function getTableById(tableId) {
  return knex('tables').where('table_id', tableId).first();
}

function createTable(tableData) {
  return knex('tables').insert(tableData).returning('*');
}

function getAllTables() {
  return knex('tables').orderBy('table_name');
}

function seatReservation(tableId, reservationId) {
  return knex('tables').where('table_id', tableId).update({ reservation_id: reservationId });
}

function finishOccupiedTable(tableId) {
  return knex("tables")
    .where("table_id", tableId)
    .update({ reservation_id: null });
}
function updateReservationStatus(reservationId){
  return knex('reservations').where('reservation_id', reservationId).update({status: 'seated'})
}
function finishReservation(reservationId) {
  return knex("reservations")
    .where({ reservation_id: reservationId })
    .update({ status: "finished" });
}

module.exports = {
  getTableById,
  createTable,
  getAllTables,
  seatReservation,
  finishOccupiedTable,
  updateReservationStatus,
  finishReservation
};


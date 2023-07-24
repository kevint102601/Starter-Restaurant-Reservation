
exports.up = function (knex) {
    return knex.schema.createTable("tables", function (table) {
      table.increments("table_id").primary();
      table.integer("capacity");
      table.string("table_name");
      table.integer("reservation_id").unsigned().references("reservation_id").inTable("reservations");
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTable("tables");
  };
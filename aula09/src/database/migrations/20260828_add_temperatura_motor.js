exports.up = function(knex) {
  return knex.schema.alterTable('telemetria', function(table) {
    table.float('temperatura_motor').notNullable().defaultTo(0);
  });
};

exports.down = function(knex) {
  return knex.schema.alterTable('telemetria', function(table) {
    table.dropColumn('temperatura_motor');
  });
};

exports.up = function(knex) {
    return knex.schema.createTable('motoristas', function(table) {
        table.increments('id').primary();
        table.string('nome').notNullable();
        table.string('cnh').notNullable().unique();
        table.string('categoria').notNullable();
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('motoristas');
};

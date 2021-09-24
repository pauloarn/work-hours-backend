"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
async function up(knex) {
    return knex.schema.createTableIfNotExists('work_points', table => {
        table.increments('id').primary();
        table.string('date').notNullable();
        table.string('entry').notNullable();
        table.string('lunchLeave').notNullable();
        table.string('lunchEntry').notNullable();
        table.string('leave').notNullable();
        table.integer('workedHours').notNullable();
        table.integer('employee_id', 10)
            .unsigned()
            .notNullable()
            .references('id')
            .inTable('employees')
            .onDelete('CASCADE')
            .onUpdate('CASCADE');
    });
}
exports.up = up;
async function down(knex) {
    return knex.schema.dropTable('work_points');
}
exports.down = down;

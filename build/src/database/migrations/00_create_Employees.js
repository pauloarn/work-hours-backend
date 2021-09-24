"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
async function up(knex) {
    return knex.schema.createTableIfNotExists('employees', table => {
        table.increments('id').primary();
        table.string('name').notNullable();
        table.string('password').notNullable();
        table.double('hoursToWork').notNullable();
    });
}
exports.up = up;
async function down(knex) {
    return knex.schema.dropTable('employees');
}
exports.down = down;

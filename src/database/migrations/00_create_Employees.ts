import {Knex} from 'knex';

export async function up (knex: Knex){
    return knex.schema.createTableIfNotExists('employees', table=>{
        table.increments('id').primary();
        table.string('name').notNullable();
        table.string('password').notNullable();
        table.double('hoursToWork').notNullable();
    })
}

export async function down (knex: Knex){
    return knex.schema.dropTable('employees')
}
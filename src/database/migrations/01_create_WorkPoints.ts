import {Knex}from 'knex'

export async function up(knex: Knex){
    return knex.schema.createTableIfNotExists('work_points', table=>{
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
            .onUpdate('CASCADE')
    })
}

export async function down (knex: Knex){
    return knex.schema.dropTable('work_points')
}
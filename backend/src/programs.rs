use std::time::Instant;
use rocket::serde::json::Json;
use rocket::serde::{Deserialize, Serialize};
use rocket::response::{Debug, status::Created};

use super::sqlite::DbConn;

use rocket_sync_db_pools::diesel;
use self::diesel::prelude::*;

type Result<T, E = Debug<diesel::result::Error>> = std::result::Result<T, E>;

#[derive(Debug, Clone, Deserialize)]
#[serde(crate = "rocket::serde")]
pub struct NewProgram {
    name: String,
    description: String,
    // The name of the file on disk
    fileName: String,
    data: String,
}

#[derive(Debug, Clone, Deserialize, Serialize, Queryable, Insertable)]
#[serde(crate = "rocket::serde")]
#[table_name="programs"]
pub struct Program {
    #[serde(skip_deserializing)]
    #[serde(rename = "id")]
    prog_id: Option<i32>,
    name: String,
    description: String,
    #[serde(rename = "file_name")]
    file: String,
    #[serde(skip_deserializing)]
    #[serde(rename = "created_at")]
    // TODO use chrono::{DateTime, Utc};
    // TODO how to do this as DateTime<Utc>,
    date_upload: i32,
}

table! {
    programs (prog_id) {
        prog_id -> Nullable<Integer>,
        name -> Text,
        description -> Text,
        file -> Text,
        date_upload -> Integer,
    }
}

#[get("/programs")]
pub async fn get_programs(db: DbConn) -> Result<Json<Vec<Program>>> {
    let programs: Vec<Program> = db.run(move |conn| {
        programs::table
            .load(conn)
    }).await?;

    Ok(Json(programs))
}

#[post("/programs", format = "json", data = "<program>")]
pub async fn create_program(db: DbConn, program: Json<NewProgram>) -> Result<Created<Json<Program>>> {
    let program_value = Program {
        prog_id: None,
        name: program.name,
        description: program.description,
        file: program.fileName,
        // TODO fix the time
        date_upload: 0,
    };
    db.run(move |conn| {
        diesel::insert_into(programs::table)
            .values(program_value)
            .execute(conn);

        diesel::select(programs::table)
            .filter(name.eq(""))
            .execute(conn)
    }).await?;



    // We want to know the ID, so we have to query for it
    /*db.run(move |conn| {
        diesel::select(programs::table)
            .filter(programs::name.eq(program.name))
            .execute(conn)
    }).await?;*/

    Ok(Created::new("/").body(program))
}

#[delete("/programs/<id>")]
pub async fn delete_program(db: DbConn, id: i32) -> Result<Option<()>> {
    let affected = db.run(move |conn| {
        diesel::delete(programs::table)
            .filter(programs::prog_id.eq(id))
            .execute(conn)
    }).await?;

    Ok((affected == 1).then(|| ()))
}

#[put("/programs/<id>/actions/compile")]
pub fn compile_program(id: i32) -> String {
    // TODO implement this
    let resp = String::from("{}");
    return resp;
}
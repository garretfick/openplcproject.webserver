use std::time::Duration;
use rocket::{Build, State};
use rocket::serde::json::Json;
use rocket::serde::{Deserialize, Serialize};
use rocket::response::{Debug, status::Created, status::NoContent, status::Accepted};
use rocket::http::Status;

use super::plc;
use super::sqlite::DbConn;
use super::schema::programs;
use super::response::*;

use rocket_sync_db_pools::diesel;
use self::diesel::prelude::*;

type Result<T, E = Debug<diesel::result::Error>> = std::result::Result<T, E>;

#[derive(Debug, Clone, Deserialize)]
#[serde(crate = "rocket::serde")]
pub struct InsertableProgram {
    name: String,
    description: String,
    // The name of the file on disk
    #[serde(rename = "fileName")]
    file: String,
    data: String,
}

#[derive(Debug, Clone, Serialize, Queryable, Insertable)]
#[serde(crate = "rocket::serde")]
#[table_name="programs"]
pub struct Program {
    #[serde(skip_deserializing)]
    #[serde(rename = "id")]
    prog_id: Option<i32>,
    name: String,
    description: String,
    #[serde(rename = "fileName")]
    file: String,
    #[serde(skip_deserializing)]
    #[serde(rename = "createdAt")]
    // TODO use chrono::{DateTime, Utc};
    // TODO how to do this as DateTime<Utc>,
    date_upload: i32,
}

impl Program {
    fn from_insertable(program: InsertableProgram) -> Program {
        Program {
            prog_id: None,
            name: program.name,
            description: program.description,
            file: program.file,
            // TODO fix the time
            date_upload: 0,
        }
    }

    async fn create(db: DbConn, program: Program)  -> Result<Program, diesel::result::Error> {
        db.run(move |conn| {
            match diesel::insert_into(programs::table)
                .values(&program)
                .execute(conn) {
                    Ok(_) => {
                        programs::table
                            .filter(programs::name.eq(program.name))
                            .limit(1)
                            .first::<Program>(conn)
                    },
                    Err(e) => Err(e),
                }
        }).await
    }

    async fn get(db: DbConn, id: i32) -> Result<Program, diesel::result::Error> {
        db.run(move |conn| {
            programs::table
                .find(id)
                .first::<Program>(conn)
        }).await
    }

    async fn all(db: DbConn) -> Result<Vec<Program>, diesel::result::Error> {
        db.run(move |conn| {
            programs::table
                .load(conn)
        }).await
    }

    async fn delete(db: DbConn, id: i32) -> Result<i32, diesel::result::Error> {
        db.run(move |conn| {
            match diesel::delete(programs::table)
                .filter(programs::prog_id.eq(id))
                .execute(conn)  {
                    Ok(a) => {
                        if a == 1 {
                            Ok(id)
                        } else {
                            Err(diesel::result::Error::NotFound)
                        }
                    },
                    Err(e) => Err(e),
                }
        }).await
    }
}

#[get("/programs")]
async fn get_programs(db: DbConn) -> OkResponse<Vec<Program>> {
    Program::all(db)
        .await
        .map(|programs| Ok(Json(programs)))
        .map_err(|e| Error::from(e).to_response(Status::ImATeapot))?
}

#[post("/programs", format = "json", data = "<program>")]
async fn create_program(db: DbConn, program: Json<InsertableProgram>) -> CreatedResponse<Program> {
    let program = Program::from_insertable(program.into_inner());
    Program::create(db, program)
        .await
        .map(|p| Ok(Created::new("/").body(Json(p))))
        .map_err(|e| Error::from(e).to_response(Status::ImATeapot))?
}

#[delete("/programs/<id>")]
async fn delete_program(db: DbConn, id: i32) -> NoContentResponse {
    Program::delete(db, id)
        .await
        .map(|r| Ok(NoContent))
        .map_err(|e| Error::from(e).to_response(Status::ImATeapot))?
}

#[put("/programs/<id>/actions/compile")]
async fn compile_program(plc: &State<plc::SharedPlcStateMachine>, db: DbConn, id: i32) -> AcceptedResponse {
    let program = Program::get(db, id)
        .await
        // TODO this should be an error
        .map_err(|e| Error::from(e).to_response(Status::ImATeapot))?;

    plc.transition(plc::PlcEvent::Compile(program.file), Duration::from_secs(2))
        .await
        .map(|_| Ok(Accepted::<()>(None)))
        // TODO this should be an error
        .map_err(|e| Error::response(Status::ImATeapot, "", ""))?
}

pub fn mount(rocket: rocket::Rocket<Build>) -> rocket::Rocket<Build> {
    rocket.mount("/",
        routes![
            get_programs,
            create_program,
            delete_program,
            compile_program,
        ]
    )
}

#[cfg(test)]
mod test {
    use super::super::rocket;
    use super::super::plc::SharedPlcStateMachine;
    //use super::main::rocket;
    use rocket::http::Status;
    use rocket::local::blocking::Client;

    #[test]
    fn compile_program() {
        let state = SharedPlcStateMachine::new();
        let client = Client::tracked(rocket(state)).expect("valid rocket instance");
        let response = client.put("/programs/1/actions/compile").dispatch();
        assert_eq!(response.status(), Status::ImATeapot);
        assert_eq!(response.into_string().unwrap(), "Hello, world!");
    }
}
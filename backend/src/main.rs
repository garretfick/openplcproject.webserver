#[macro_use]
extern crate rocket;
// #[macro_use] extern crate rocket_sync_db_pools;
#[macro_use]
extern crate diesel_migrations;
#[macro_use]
extern crate diesel;
#[macro_use]
extern crate matches;

use rocket::fairing::{Fairing, Info, Kind};
use rocket::http::{Header, Status};
use rocket::{Build, Request, Response, Rocket};
use std::time::Duration;

mod devices;
mod hardware;
mod plc;
mod programs;
mod response;
mod schema;
mod settings;
mod sqlite;
mod state;
mod users;
mod variables;

pub struct CORS;

#[rocket::async_trait]
impl Fairing for CORS {
    fn info(&self) -> Info {
        Info {
            name: "Attaching CORS headers to responses",
            kind: Kind::Response,
        }
    }

    async fn on_response<'r>(&self, _request: &'r Request<'_>, response: &mut Response<'r>) {
        response.set_status(Status::Ok);
        response.set_header(Header::new("Access-Control-Allow-Origin", "*"));
        response.set_header(Header::new(
            "Access-Control-Allow-Methods",
            "POST, PUT, GET, PATCH, DELETE, OPTIONS",
        ));
        response.set_header(Header::new("Access-Control-Allow-Headers", "*"));
        response.set_header(Header::new("Access-Control-Allow-Credentials", "true"));
    }
}

#[launch]
pub fn launch() -> _ {
    // Create the shared state. We need this protected a mutex
    // because both requests and our background process will need
    // to access the state.
    let state = plc::SharedPlcStateMachine::new();

    let clone = state.clone();
    tokio::spawn(async move {
        // Every one second we will recheck the state by passing the
        // NoOp event.
        let mut interval = tokio::time::interval(Duration::from_secs(5));
        loop {
            {
                let mut x = clone.sm.write().unwrap();
                x.run(plc::PlcEvent::NoOp);
            }
            interval.tick().await;
        }
    });

    rocket(state)
}

pub fn rocket(state: plc::SharedPlcStateMachine) -> Rocket<Build> {
    let mut rocket = rocket::build()
        .attach(CORS)
        .attach(sqlite::stage())
        .manage(state);

    rocket = devices::mount(rocket);
    rocket = hardware::mount(rocket);
    rocket = programs::mount(rocket);
    rocket = settings::mount(rocket);
    rocket = state::mount(rocket);
    rocket = users::mount(rocket);
    rocket = variables::mount(rocket);

    return rocket;
}

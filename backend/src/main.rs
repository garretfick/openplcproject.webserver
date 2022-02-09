#[macro_use] extern crate rocket;
// #[macro_use] extern crate rocket_sync_db_pools;
#[macro_use] extern crate diesel_migrations;
#[macro_use] extern crate diesel;

use rocket::fairing::{Fairing, Info, Kind};
use rocket::http::{Header, Status};
use rocket::{Request, Response};

mod devices;
mod hardware;
mod programs;
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
fn rocket() -> _ {
    rocket::build()
        .attach(CORS)
        .attach(sqlite::stage())
        .mount(
            "/",
            routes![
                state::state,
                state::set_state,
                state::logs,
                state::compile_logs,

                programs::get_programs,
                programs::create_program,
                programs::delete_program,
                programs::compile_program,

                devices::devices,
                devices::add_device,
                devices::ports,

                variables::variables,
                variables::patch_variable,
                
                hardware::drivers,
                hardware::select_driver,

                hardware::custom_driver,
                hardware::set_custom_driver,
                hardware::reset_custom_driver,

                users::get_users,
                users::create_user,
                users::patch_user,
                users::delete_user,

                settings::settings,
            ],
    )
}

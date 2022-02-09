use rocket::{Rocket, Build};
use rocket::fairing::AdHoc;
use rocket_sync_db_pools::{diesel, database};

// use self::diesel::prelude::*;

#[database("sqlite_logs")]
pub struct DbConn(diesel::SqliteConnection);

async fn run_migrations(rocket: Rocket<Build>) -> Rocket<Build> {
    // This macro from `diesel_migrations` defines an `embedded_migrations`
    // module containing a function named `run` that runs the migrations in the
    // specified directory, initializing the database.
    embed_migrations!("db/migrations");

    let conn = DbConn::get_one(&rocket).await.expect("database connection");
    conn.run(|c| embedded_migrations::run(c)).await.expect("diesel migrations");

    rocket
}

pub fn stage() -> AdHoc {
    AdHoc::on_ignite("Diesel SQLite Stage", |rocket| async {
        rocket.attach(DbConn::fairing())
            .attach(AdHoc::on_ignite("Diesel Migrations", run_migrations))
    })
}
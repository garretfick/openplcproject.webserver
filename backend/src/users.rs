use rocket::Build;
use rocket::serde::json::Json;
use rocket::serde::{Deserialize, Serialize};
use rocket::response::{status::Created, status::NoContent};
use rocket::http::Status;

use super::sqlite::DbConn;
use super::schema::users;
use super::response::*;

use rocket_sync_db_pools::diesel;
use self::diesel::prelude::*;

#[derive(Debug, Clone, Deserialize, Serialize, Queryable, Insertable, AsChangeset)]
#[serde(crate = "rocket::serde")]
#[table_name="users"]
pub struct User {
    #[serde(skip_deserializing)]
    #[serde(rename = "id")]
    user_id: Option<i32>,
    name: String,
    username: String,
    email: String,
    password: String,
}

impl User {
  async fn create(db: DbConn, user: User) -> Result<User, diesel::result::Error> {
        db.run(move |conn| {
            match diesel::insert_into(users::table)
                .values(user)
                .execute(conn) {
                    Ok(_u) => {
                        users::table
                            .order(users::user_id.desc())
                            .first::<User>(conn)
                    },
                    Err(e) => Err(e),
                }
        }).await
    }

    async fn all(db: DbConn) -> Result<Vec<User>, diesel::result::Error> {
        db.run(move |conn| {
            users::table
                .load(conn)
        }).await
    }

    async fn update(db: DbConn, id: i32, user: User) -> Result<User, diesel::result::Error> {
        db.run(move |conn| {
            match diesel::update(users::table.find(id)).set(user).execute(conn) {
                Ok(u) => {
                    users::table
                        .order(users::user_id.desc())
                        .first::<User>(conn)
                },
                Err(e) => Err(e),
            }
        }).await
    }

    async fn delete(db: DbConn, id: i32) -> Result<i32, diesel::result::Error> {
        db.run(move |conn| {
            match diesel::delete(users::table)
                .filter(users::user_id.eq(id))
                .execute(conn) {
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

#[get("/users")]
async fn get_users(db: DbConn) -> OkResponse<Vec<User>> {
    User::all(db)
        .await
        .map(|users| Ok(Json(users)))
        .map_err(|e| Error::from(e).to_response(Status::ImATeapot))?
}

#[post("/users", format = "json", data = "<user>")]
async fn create_user(db: DbConn, user: Json<User>) -> CreatedResponse<User> {
    User::create(db, user.into_inner())
        .await
        .map(|user| Ok(Created::new("/").body(Json(user))))
        .map_err(|e| Error::from(e).to_response(Status::ImATeapot))?
}

#[patch("/users/<id>", format = "json", data = "<user>")]
async fn patch_user(db: DbConn, id: i32, user: Json<User>) -> OkResponse<User> {
    User::update(db, id, user.into_inner())
        .await
        .map(|user| Ok(Json(user)))
        .map_err(|e| Error::from(e).to_response(Status::ImATeapot))?
}

#[delete("/users/<id>")]
async fn delete_user(db: DbConn, id: i32) -> NoContentResponse {
    User::delete(db, id)
        .await
        .map(|_d| Ok(NoContent))
        .map_err(|e| Error::from(e).to_response(Status::ImATeapot))?
}

pub fn mount(rocket: rocket::Rocket<Build>) -> rocket::Rocket<Build> {
    rocket.mount("/",
        routes![
            get_users,
            create_user,
            patch_user,
            delete_user,
        ]
    )
}
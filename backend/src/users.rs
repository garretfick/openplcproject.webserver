use rocket::serde::json::Json;
use rocket::serde::{Deserialize, Serialize};
use rocket::response::{Debug, status::Created};

use super::sqlite::DbConn;

use rocket_sync_db_pools::diesel;
use self::diesel::prelude::*;

type Result<T, E = Debug<diesel::result::Error>> = std::result::Result<T, E>;

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

table! {
    users (user_id) {
        user_id -> Nullable<Integer>,
        name -> Text,
        username -> Text,
        email -> Text,
        password -> Text,
    }
}

#[get("/users")]
pub async fn get_users(db: DbConn) -> Result<Json<Vec<User>>> {
    let users: Vec<User> = db.run(move |conn| {
        users::table
            .load(conn)
    }).await?;

    Ok(Json(users))
}

#[post("/users", format = "json", data = "<user>")]
pub async fn create_user(db: DbConn, user: Json<User>) -> Result<Created<Json<User>>> {
    let user_value = user.clone();
    db.run(move |conn| {
        diesel::insert_into(users::table)
            .values(user_value)
            .execute(conn)
    }).await?;

    Ok(Created::new("/").body(user))
}

#[patch("/users/<id>", format = "json", data = "<user>")]
pub async fn patch_user(db: DbConn, id: i32, user: Json<User>) -> Result<Json<User>> {
    let user_value = user.clone();
    db.run(move |conn| {
        diesel::update(users::table.find(id))
            .set(user_value)
            .execute(conn)
    }).await?;

    Ok(user)
}

#[delete("/users/<id>")]
pub async fn delete_user(db: DbConn, id: i32) -> Result<Option<()>> {
    let affected = db.run(move |conn| {
        diesel::delete(users::table)
            .filter(users::user_id.eq(id))
            .execute(conn)
    }).await?;

    Ok((affected == 1).then(|| ()))
}

use rocket::serde::json::Json;
use rocket::serde::{Deserialize, Serialize};

// We control state as a finite state machine.
// The state functions allow direct control of the
// state (other actions have state side effects).
//
// It is important to note that while the interactive
// server can manipulate the state, it doesn't own
// the state and needs to query to determine the actual
// state.
#[derive(Deserialize, Serialize, Copy, Clone)]
#[serde(crate = "rocket::serde")]
pub enum State {
    RUNNING,
    COMPILING,
    STOPPED,
}

#[derive(Serialize)]
#[serde(crate = "rocket::serde")]
pub struct StateInfo {
    // The name of the selected program.
    name: String,
    description: String,
    path: String,
    hostname: String,
    uptime: String,
    state: State,
}

#[derive(Deserialize)]
#[serde(crate = "rocket::serde")]
pub struct StateRequest {
    message: String,
    state: State,
}

#[derive(Serialize)]
#[serde(crate = "rocket::serde")]
pub struct Logs {
    data: String,
}

#[get("/state")]
pub fn state() -> Json<StateInfo> {
    Json(StateInfo {
        name: String::from("world"),
        description: String::from("hello"),
        path: String::from("file_name"),
        hostname: String::from("localhost"),
        uptime: String::from("f"),
        state: State::STOPPED,
    })
}

#[put("/state", format = "json", data = "<message>")]
pub fn set_state(message: Json<StateRequest>) -> Json<StateInfo> {
    Json(StateInfo {
        name: String::from("world"),
        description: String::from("hello"),
        path: String::from("file_name"),
        hostname: String::from("localhost"),
        uptime: String::from("f"),
        state: message.state,
    })
}

#[get("/logs")]
pub fn logs() -> Json<Logs> {
    Json(Logs {
        data: String::from("logs content"),
    })
}

#[get("/compileLogs")]
pub fn compile_logs() -> Json<Logs> {
    Json(Logs {
        data: String::from("logs content"),
    })
}

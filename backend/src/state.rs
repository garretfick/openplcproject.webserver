use rocket::State;
use rocket::serde::json::Json;
use rocket::serde::{Deserialize, Serialize};
use rocket::http::Status;

use super::plc;
use super::response::*;

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
pub enum AppState {
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
    state: AppState,
}

#[derive(Deserialize)]
#[serde(crate = "rocket::serde")]
pub struct StateRequest {
    message: String,
    state: AppState,
}

#[derive(Serialize)]
#[serde(crate = "rocket::serde")]
pub struct Logs {
    data: String,
}

#[get("/state")]
pub fn state(plc: &State<plc::SharedPlcStateMachine>) -> OkResponse<StateInfo> {
    match plc.sm.read() {
        Ok(plc) => {
            // TODO something meaningful here
            return Ok(Json(StateInfo {
                name: String::from("world"),
                description: String::from("hello"),
                path: String::from("file_name"),
                hostname: String::from("localhost"),
                uptime: String::from("f"),
                state: AppState::STOPPED,
            }))
        },
        Err(e) => return Err(Error::response(Status::ImATeapot, "", "")),
    }
}

#[put("/state", format = "json", data = "<message>")]
pub fn set_state(plc: &State<plc::SharedPlcStateMachine>, message: Json<StateRequest>) -> OkResponse<StateInfo> {
    // TODO this needs stuff
    Ok(Json(StateInfo {
        name: String::from("world"),
        description: String::from("hello"),
        path: String::from("file_name"),
        hostname: String::from("localhost"),
        uptime: String::from("f"),
        state: message.state,
    }))
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

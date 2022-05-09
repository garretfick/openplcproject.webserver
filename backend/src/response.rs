use diesel::result::Error as DieselError;
use rocket::http::Status;
use rocket::response::{status::Accepted, status::Created, status::Custom, status::NoContent};
use rocket::serde::json::Json;
use rocket::serde::Serialize;

#[derive(Debug, Clone, Serialize)]
#[serde(crate = "rocket::serde")]
pub struct Error {
    code: &'static str,
    title: &'static str,
}

impl Error {
    fn new(code: &'static str, title: &'static str) -> Error {
        Error {
            code: code,
            title: title,
        }
    }

    pub fn from(error: DieselError) -> Error {
        Error {
            code: "database",
            title: "help",
        }
    }

    pub fn to_response(self, status: Status) -> Custom<Json<Error>> {
        Custom(status, Json(self))
    }

    pub fn response(
        status: Status,
        code: &'static str,
        title: &'static str,
    ) -> Custom<Json<Error>> {
        Custom(status, Json(Error::new(code, title)))
    }
}

pub type CreatedResponse<T> = std::result::Result<Created<Json<T>>, Custom<Json<Error>>>;

// Ok means the request was accepted and a response is provided.
pub type OkResponse<T> = std::result::Result<Json<T>, Custom<Json<Error>>>;

// NoContent means the request was accepted and enacted.
//
// Typical uses are for DELETE.
pub type NoContentResponse = std::result::Result<NoContent, Custom<Json<Error>>>;

// Accepted means the request was accepted but not et enacted.
//
// Typical uses are changing the state of the PLC.
pub type AcceptedResponse = std::result::Result<Accepted<()>, Custom<Json<Error>>>;

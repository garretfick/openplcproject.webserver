use rocket::serde::json::Json;
use rocket::serde::{Deserialize, Serialize};

#[derive(Serialize)]
#[serde(crate = "rocket::serde")]
pub struct Variable {
    name: String,
    location: String,
    forced: bool,
    value: String,
    #[serde(alias = "typeName")]
    type_name: String
}

#[derive(Deserialize)]
#[serde(crate = "rocket::serde")]
pub struct PatchVariable {
    value: String
}

#[get("/variables")]
pub fn variables() -> Json<Vec<Variable>> {
    let variable = Variable {
        name: String::from("world"),
        location: String::from("loc"),
        forced: false,
        value: String::from("TRUE"),
        type_name: String::from("BOOL"),
    };

    let mut vec = Vec::new();
    vec.push(variable);

    Json(vec)
}

#[patch("/variables/<id>", format = "json", data = "<message>")]
pub fn patch_variable(id: String, message: Json<PatchVariable>) -> String {
    let resp = String::from("{}");
    return resp;
}
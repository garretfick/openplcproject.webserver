use rocket::serde::json::Json;
use rocket::serde::{Deserialize, Serialize};

#[derive(Deserialize, Serialize)]
#[serde(crate = "rocket::serde")]
pub struct ModbusRegisterDefinition {
    start: u8,
    size: u8,
}

#[derive(Deserialize, Serialize)]
#[serde(crate = "rocket::serde")]
pub struct ModbusDevice {
    // We allow the ID to be default value when
    // creating a new Modbus device.
    #[serde(default)]
    id: String,
    name: String,
    //type: String
    di: ModbusRegisterDefinition,
    //do: String
    ai: ModbusRegisterDefinition,
    ao: ModbusRegisterDefinition,
}

#[get("/devices")]
pub fn devices() -> Json<Vec<ModbusDevice>> {
    let di = ModbusRegisterDefinition {
        start: 0,
        size: 0,
    };
    let ai = ModbusRegisterDefinition {
        start: 0,
        size: 0,
    };
    let ao = ModbusRegisterDefinition {
        start: 0,
        size: 0,
    };

    let device = ModbusDevice {
        id: String::from("id"),
        name: String::from("world"),
        di: di,
        ai: ai,
        ao: ao,
    };

    let mut vec = Vec::new();
    vec.push(device);

    Json(vec)
}

#[post("/devices", format = "json", data = "<message>")]
pub fn add_device(message: Json<ModbusDevice>) -> Json<ModbusDevice> {
    return message
}

#[get("/ports")]
pub fn ports() -> Json<Vec<String>> {
    let port = String::from("COM1");

    let mut vec = Vec::new();
    vec.push(port);

    Json(vec)
}

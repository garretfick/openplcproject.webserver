use rocket::serde::json::Json;
use rocket::serde::Serialize;

#[derive(Serialize)]
#[serde(crate = "rocket::serde")]
pub struct Settings {
    modbus_enabled: bool,
    modbus_port: u32,

    dnp3_enabled: bool,
    dnp3_port: u32,

    enip_enabled: bool,
    enip_port: u32,

    persistent_storage_enabled: bool,
    //persistent_storage_period: Duration,

    start_in_run: bool,
    
    //slave_poll_period: Duration,
    //timeout: Duration,
}

#[get("/settings")]
pub fn settings() -> Json<Settings> {
    Json(Settings{
        modbus_enabled: true,
        modbus_port: 502,

        dnp3_enabled: true,
        dnp3_port: 20000,

        enip_enabled: true,
        enip_port: 44818,

        persistent_storage_enabled: false,
        //persistent_storage_period: Duration::seconds(10),

        start_in_run: false,

        //slave_poll_period: Duration::seconds(10),

        //timeout: Duration::milliseconds(1000)
    })
}
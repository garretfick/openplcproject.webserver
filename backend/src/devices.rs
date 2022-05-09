use rocket::serde::json::Json;
use rocket::serde::{Deserialize, Serialize};
use rocket::response::Debug;

use super::sqlite::DbConn;
use super::schema::slave_dev;

use rocket_sync_db_pools::diesel;
use self::diesel::prelude::*;

type Result<T, E = Debug<diesel::result::Error>> = std::result::Result<T, E>;


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

#[derive(Queryable)]
struct SlaveDev {
    dev_id: Option<i32>,
    dev_name: String,
    dev_type: String,
    slave_id: i32,
    com_port: String,
    baud_rate: i32,
    parity: String,
    data_bits: i32,
    stop_bits: i32,
    ip_address: String,
    ip_port: i32,
    di_start: i32,
    di_size: i32,
    coil_start: i32,
    coil_size: i32,
    ir_start: i32,
    ir_size: i32,
    hr_read_start: i32,
    hr_read_size: i32,
    hr_write_start: i32,
    hr_write_size: i32,
}

#[get("/devices")]
pub async fn devices(db: DbConn) -> Result<Json<Vec<ModbusDevice>>> {
    let programs : Vec<SlaveDev> = db.run(move |conn| {
        slave_dev::table
            .load(conn)
    }).await?;

    let mut counter_di = 0;
    let mut counter_do = 0;
    let mut counter_ai = 0;
    let mut counter_ao = 0;

    for program in programs.iter() {
        if program.di_size == 0 {
            
        }
        else {
            counter_di += program.di_size;
        }

        if program.coil_size == 0 {

        }
        else {
            counter_do += program.coil_size;
        }

        if program.ir_size + program.hr_read_size == 0 {

        }
        else {
            counter_ai += program.ir_size + program.hr_read_size;
        }

        if program.hr_write_size == 0 {

        }
        else {
            counter_ao += program.hr_write_size;
        }
    }

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

    Ok(Json(vec))
}

#[post("/devices", format = "json", data = "<message>")]
pub fn add_device(db: DbConn, message: Json<ModbusDevice>) -> Json<ModbusDevice> {
    return message
}

#[delete("/devices/<id>")]
pub async fn delete_device(db: DbConn, id: i32) -> Result<Option<()>> {
    let affected = db.run(move |conn| {
        diesel::delete(slave_dev::table)
            .filter(slave_dev::dev_id.eq(id))
            .execute(conn)
    }).await?;

    Ok((affected == 1).then(|| ()))
}

#[get("/ports")]
pub fn ports() -> std::result::Result<Json<Vec<String>>, String> {
    match serialport::available_ports() {
        Err(e) => Err(String::from("")),
        Ok(ports) => Ok(Json(ports.iter().map(|x| x.port_name.clone()).collect())),
    }
}

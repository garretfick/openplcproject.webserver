use rocket::serde::json::Json;
use rocket::serde::{Deserialize, Serialize};

const NUM_DRIVERS: usize = 12;

#[derive(Serialize)]
#[serde(crate = "rocket::serde")]
struct Driver {
    id: &'static str,
    name: &'static str,
}

// Drivers are a bit odd to model with REST. What we have
// is a list of items of which one of them can be selected.
#[derive(Serialize)]
#[serde(crate = "rocket::serde")]
pub struct Drivers {
    items: [Driver; NUM_DRIVERS],
    // The value of the ID field for the selected item.
    selected: String,
}

#[derive(Deserialize, Serialize)]
#[serde(crate = "rocket::serde")]
pub struct Code {
    data: String,
}

// OpenPLC has built-in support for specific hardware
// integrations. They are hard-coded here, but could be
// loaded from disk for some versions.
const DRIVERS: [Driver; NUM_DRIVERS] = [
    Driver {
        id: "blank",
        name: "Blank",
    },
    Driver {
        id: "blank_linux",
        name: "Blank with DNP3 (Linux only)",
    },
    Driver {
        id: "fischertechnik",
        name: "Fischertechnik",
    },
    Driver {
        id: "neuron",
        name: "Neuron",
    },
    Driver {
        id: "pixtend",
        name: "PiXtend",
    },
    Driver {
        id: "pixtend_2s",
        name: "PiXtend 2s",
    },
    Driver {
        id: "pixtend_2l",
        name: "PiXtend 2l",
    },
    Driver {
        id: "rpi",
        name: "Raspberry Pi",
    },
    Driver {
        id: "rpi_old",
        name: "Raspberry Pi - Old Model (2011 model B)",
    },
    Driver {
        id: "simulink",
        name: "Simulink",
    },
    Driver {
        id: "simulink_linux",
        name: "Simulink with DNP3 (Linux only)",
    },
    Driver {
        id: "unipi",
        name: "UniPi v1.1",
    },
];

#[get("/drivers")]
pub fn drivers() -> Json<Drivers> {
    let drivers = Drivers {
        items: DRIVERS,
        selected: String::from("none"),
    };

    Json(drivers)
}

#[post("/drivers?<selected>")]
pub fn select_driver(selected: String) -> String {
    return String::from("ok");
}

#[get("/customDriver")]
pub fn custom_driver() -> Json<Code> {
    let code = Code {
        data: String::from("ok"),
    };
    return Json(code);    
}

#[put("/customDriver", format="json", data = "<message>")]
pub fn set_custom_driver(message: Json<Code>) -> Json<Code> {
    let code = Code {
        data: String::from("ok"),
    };
    return Json(code);    
}

#[put("/customDriver/actions/reset")]
pub fn reset_custom_driver() -> Json<Code> {
    let code = Code {
        data: String::from("ok"),
    };
    return Json(code); 
}
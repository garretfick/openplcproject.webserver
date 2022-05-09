table! {
    programs (prog_id) {
        prog_id -> Nullable<Integer>,
        name -> Text,
        description -> Text,
        file -> Text,
        date_upload -> Integer,
    }
}

table! {
    slave_dev (dev_id) {

        dev_id -> Nullable<Integer>,
        dev_name -> Text,
        dev_type -> Text,
        slave_id -> Integer,
        com_port -> Text,
        baud_rate -> Integer,
        parity -> Text,
        data_bits -> Integer,
        stop_bits -> Integer,
        ip_address -> Text,
        ip_port -> Integer,
        di_start -> Integer,
        di_size -> Integer,
        coil_start -> Integer,
        coil_size -> Integer,
        ir_start -> Integer,
        ir_size -> Integer,
        hr_read_start -> Integer,
        hr_read_size -> Integer,
        hr_write_start -> Integer,
        hr_write_size -> Integer,
    }
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

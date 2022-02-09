CREATE TABLE `Programs` (
	`Prog_ID`	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	`Name`	TEXT NOT NULL,
	`Description`	TEXT,
	`File`	TEXT NOT NULL,
	`Date_upload`	INTEGER NOT NULL
)

CREATE TABLE `Settings` (
	`Key`	TEXT NOT NULL UNIQUE,
	`Value`	TEXT NOT NULL,
	PRIMARY KEY(`Key`)
)

CREATE TABLE `Slave_dev` (
	`dev_id`	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
	`dev_name`	TEXT NOT NULL UNIQUE,
	`dev_type`	TEXT NOT NULL,
	`slave_id`	INTEGER NOT NULL,
	`com_port`	TEXT,
	`baud_rate`	INTEGER,
	`parity`	TEXT,
	`data_bits`	INTEGER,
	`stop_bits`	INTEGER,
	`ip_address`	TEXT,
	`ip_port`	INTEGER,
	`di_start`	INTEGER NOT NULL,
	`di_size`	INTEGER NOT NULL,
	`coil_start`	INTEGER NOT NULL,
	`coil_size`	INTEGER NOT NULL,
	`ir_start`	INTEGER NOT NULL,
	`ir_size`	INTEGER NOT NULL,
	`hr_read_start`	INTEGER NOT NULL,
	`hr_read_size`	INTEGER NOT NULL,
	`hr_write_start`	INTEGER NOT NULL,
	`hr_write_size`	INTEGER NOT NULL
)

CREATE TABLE "Users" (
	`user_id`	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	`name`	TEXT NOT NULL,
	`username`	TEXT NOT NULL UNIQUE,
	`email`	TEXT,
	`password`	TEXT NOT NULL,
	`pict_file`	TEXT
)
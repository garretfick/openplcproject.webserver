How to build SQLite3 .lib file on Windows 10
Download source from source (https://www.sqlite.org/download.html)

For example: source https://www.sqlite.org/2021/sqlite-amalgamation-3340100.zip

Download binary from binary

For example: binary https://www.sqlite.org/2021/sqlite-dll-win64-x64-3340100.zip

Extract both archives to the same directory

Open Developer Command Prompt for VS 2017 by typing Developer Command in Windows Search

Go to directory where you've extracted source code and binary files (via opened cmd)

Run lib /DEF:sqlite3.def /OUT:sqlite3.lib /MACHINE:x64
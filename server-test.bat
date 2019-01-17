if not exist "%CD%\data" mkdir "%CD%\data"

START /B "" "D:\MongoDB\Server\4.0\bin\mongod.exe" --dbpath "%CD%\data"
nodemon server.js
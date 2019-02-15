# Music Managed

Basically, to go to normal website, execute

```bash
./server-test.sh
```

on Linux based distros

If you want to go to website, go to http://localhost:5000

If you want to use the API, go to http://localhost:5000/api/endpoint

Endpoints-

All endpoints are POST requests and should be called using a form

| Endpoint | Instructions |
|----------|--------------|
| `/api/adduser` | Adds a User to the database. POST form must contain the desired username and password |
| `/api/verifyuser` | Verifies the credentials of a User. POST form must contain the username and password to be verified |
| `/api/addmusicfile` | Adds a music file to the database as belonging to a user. POST form must contain file buffer of the music file and the username of the user |
| `/api/getmusicfile` | Gets a music file from the database as belonging to a user. POST form must contain file name and id of the music file and the username of the user |

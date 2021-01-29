# BPAProject

This is a project for the 2021 BPA web app challenge

## Installation

1. clone or download this repository

2.open your command line and navigate to this repository

3. run ```npm install```

## Optional

if you would like to use this project over HTTPS and have openSLL installed run
```openssl genrsa -out key.pem
openssl req -new -key key.pem -out csr.pem
openssl x509 -req -days 9999 -in csr.pem -signkey key.pem -out cert.pem
rm csr.pem
```

## running the server
run ```node mainServer.js```

## accessing the web page
go into your web browser and enter [http://localhost:8080] if you chose not to run the server with HTTPS
for HTTPS go to [https://localhost:443] (this will only work if you made the HTTPS certificates)

## using the application
when you first boot the server there will be two(2) accounts:
1. Test email: TT@email.com Password: Password100

 __for the admin account login go to /admin__
 
2. Admin email: AA@email.com Password:Admin1000

 __you can make more regular accounts in the standard login page but you cannot make more Admin accounts__

<p align="center">
  <a href="" rel="noopener">
 <img width=400px height=200px src="https://124135-361502-raikfcquaxqncofqfm.stackpathdns.com/asset/img/banners/blog/rest_api.png" alt="logo"></a>
</p>

<h3 align="center">Backend Arva Shop</h3>

---

## 🧐 About
This is the repository Backend of the Bootcamp Arkademy task

## 💻 Installation

Follow the steps below

1. Clone this repo
```
git clone https://github.com/therevolt/BE-ARVA-Shop
cd BE-ARVA-Shop
```

2. Install module & Import Database
##### Install Module
```
npm install
```

3. Create env file
```
# ---------------------------------------
#               CONFIG DB
# ---------------------------------------
DB_HOST=
DB_USER=
DB_PASSWORD=
DB_NAME=
DB_DIALECT=

# ---------------------------------------
#            CONFIG WEBSITE
# ---------------------------------------
DOMAIN=

# ---------------------------------------
#            CONFIG MAILER
# ---------------------------------------
EMAIL=
PASSWORD=

# ---------------------------------------
#            CONFIG GENERAL
# ---------------------------------------
PORT=
HOST=
SECRET_KEY=
SECRET_KEY_RESET=
SECRET_KEY_VERIF=
SECRET_KEY_REFRESH=
SECRET_KEY_PIN=
STATIC_FOLDER=/avatar
```
Detail CONFIG GENERAL
| EXAMPLE URL | [http://localhost:6000]() |
| :-------------: |:-------------:|
| PORT | 6000 |
| HOST | [http://localhost]() |

4. Done, You can run it in the way below
##### Developer Mode (with nodemon)
```
npm run dev
```
##### Production Mode (only node)
```
npm start
```

## Schema Database
<img src="https://i.ibb.co/Hp6q22y/Untitled-Workspace.png" alt="logo">

## 🔖 Standard Response & Preview Request By Postman
#### Standard Response API
```json
{
    "status": true,
    "message": "success register",
    "data": [object Object]
}
```
Object data contains content according to the request

## ⛏️ Built Using

- [ExpressJS](https://expressjs.com)
- [MySQL2 Package](https://www.npmjs.com/package/mysql2)
- [CORS Package](https://www.npmjs.com/package/cors)
- [Morgan Package](https://www.npmjs.com/package/morgan)
- [DotEnv Package](https://www.npmjs.com/package/dotenv)
- [Redis Package](https://www.npmjs.com/package/redis)
- [JWT Package](https://www.npmjs.com/package/jsonwebtoken)
- [Nodemailer Package](https://www.npmjs.com/package/nodemailer)
- [UUID Package](https://www.npmjs.com/package/uuid)
- [Multer Package](https://www.npmjs.com/package/multer)
- [Bcrypt Package](https://www.npmjs.com/package/bcrypt)
- [Socket.io Package](https://www.npmjs.com/package/socket.io)

## 💭 Documentation

[Click Here](https://documenter.getpostman.com/view/10780576/TzRNEpqV)

## 💻 FrontEnd

Repo Frontend : https://github.com/abudzr/arva-online-shop

## 💻 Live Demo

Coming Soon

## ✍️ Authors

- [@therevolt](https://github.com/therevolt)
- [@abudzr](https://github.com/abudzr)
- [@nevalenaginda](https://github.com/nevalenaginda)
- [@heatclift77](https://github.com/heatclift77)

<p align="center">
  <a href="" rel="noopener">
 <img width=200px src="https://i.ibb.co/0m3XJDP/Pink-and-Purple-Charity-Store-Logo.png" alt="logo"></a>
</p>

## 🧐 About
Backend ARVA Shop

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

Vercel : https://arva-online-shop-theta.vercel.app/

## ✍️ Authors

<center>
  <table>
    <tr>
      <th>Frontend/PM</th>
      <th>Backend</th>
      <th>Frontend</th>
      <th>Frontend</th>
    </tr>
    <tr>
      <td align="center">
        <a href="https://github.com/abudzr">
          <img width="150" style="background-size: contain;" src="https://media-exp1.licdn.com/dms/image/C5603AQHJkatPPZkv3w/profile-displayphoto-shrink_800_800/0/1616558810228?e=1626307200&v=beta&t=ZvN_rhdGzPqdvpsJoOWBwWHZ_-l0MslxoSmu7D3YcYM"><br/>
          <b>Abu Dzar Al Ghifari</b>
        </a>
      </td>
      <td align="center">
        <a href="https://github.com/therevolt/">
          <img width="150" src="https://media-exp1.licdn.com/dms/image/C5603AQHWisyVrRhm-Q/profile-displayphoto-shrink_800_800/0/1617809629399?e=1626307200&v=beta&t=Jx9QSk3dCoVZWsdErlwIY6FuoL5tqj3vr49yTRkvoO4" alt="Rama Seftiansyah"><br/>
          <b>Rama Seftiansyah</b>
        </a>
      </td>
      <td align="center">
        <a href="https://github.com/nevalenaginda">
          <img width="150" src="https://avatars.githubusercontent.com/u/55057008?s=400&u=fb217ef27a008e647cf48927f153dcbb266ce4d6&v=4" alt="Nevalen Aginda Prasetyo"><br/>
          <b>Nevalen Aginda Prasetyo</b>
        </a>
      </td>
      <td align="center">
        <a href="https://github.com/heatclift77">
          <img width="150" src="https://media-exp1.licdn.com/dms/image/C5603AQFZLY_7XQ9k0A/profile-displayphoto-shrink_800_800/0/1617766337918?e=1626307200&v=beta&t=t3BBq8dehfARnHorAe1MyQyXAsJz21Ec4O6_Pmx7wSY" alt="Muhammad Aditya Pratama"><br/>
          <b>Muhammad Aditya Pratama</b>
        </a>
      </td>
    </tr>
  </table>
</center>

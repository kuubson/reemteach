# Project "reemteach"

## Technologies

-   HTML, CSS, JS
-   React.js + Redux (HOC, Hooks, Styled Components, PWA, Web Push Notifications, WebRTC, Leaflet)
-   Node.js + Express (passport.js, JWT, socket.io, multer)
-   MySQL (ORM Sequelize)

## Description

App's purpose is to help remote communication flow in school between its units and help teachers do their job.

The app offers head teachers to manage teachers, school news and school bell hours. Teachers can create classes of students, prepare and conduct tests among them and evaluate them based on configurable assessment criteria, control students' grades, communicate with them via chat or video calls, which gives them the freedom to teach in several schools at once. Students get quick access to grades, school news, the current school bells schedule and a communicator to communicate with the class and teachers.

The app was my "showcase" at IT competitions in the 2020 school year in the 3rd grade of technical secondary school, which contributed to several successes

## Installation

Create **.env** file and fill it based on **.env-example** file, then:

### Development

```bash
npm install
```

Start backend:

```bash
npm run backend
```

Start frontend:

```bash
npm run frontend
```

Make sure to create **MySQL** database with credentials the same as in **.env** with the usage of e.g, [xampp](https://www.apachefriends.org/pl/index.html)

### Production

Build frontend:

```bash
npm run build
```

Compile & start backend:

```bash
npm run start
```

## Some screenshots

### Home

[![reemteach-Home.png](https://i.postimg.cc/x18xSRBH/reemteach-Home.png)](https://postimg.cc/RWrQ7cSV)

### Admin (creating head teachers + menu options)

[![reemteach-Admin.png](https://i.postimg.cc/8zw7LdCy/reemteach-Admin.png)](https://postimg.cc/rD0ykrxW)

### Head teacher (managing school bells + menu options)

[![reemteach-Headteacher.png](https://i.postimg.cc/FFZXrTCn/reemteach-Headteacher.png)](https://postimg.cc/t7YMDNjh)

### Teacher (chat with students + menu options)

[![reemteach-Headteacher-Chat.png](https://i.postimg.cc/j2PSkP4J/reemteach-Headteacher-Chat.png)](https://postimg.cc/GT3R4BNc)

### Teacher (video chat - sharing screen with student)

[![reemteach-Teacher-Video.png](https://i.postimg.cc/g0j28nr8/reemteach-Teacher-Video.png)](https://postimg.cc/t10bHR34)

### Student (marks + menu options)

[![reemteach-Student.png](https://i.postimg.cc/pV63kCkm/reemteach-Student.png)](https://postimg.cc/PN165mgH)

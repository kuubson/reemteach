const Sequelize = require('sequelize')

const {
    DATABASE_NAME,
    DATABASE_USERNAME,
    DATABASE_PASSWORD,
    DATABASE_HOST
} = process.env

const connection = new Sequelize(
    DATABASE_NAME,
    DATABASE_USERNAME,
    DATABASE_PASSWORD,
    {
        host: DATABASE_HOST,
        dialect: 'mysql'
    }
)

connection
    // .sync({ force: true })
    .sync()
    .then(async () => {
        console.log('Successfully connected to the database!')
    })
    .catch(error => {
        console.log({
            error,
            message: 'There was a problem connecting to the database!'
        })
    })

module.exports = {}

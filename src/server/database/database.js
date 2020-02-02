import Sequelize from 'sequelize'

const { DATABASE_NAME, DATABASE_USERNAME, DATABASE_PASSWORD, DATABASE_HOST } = process.env

const connection = new Sequelize(DATABASE_NAME, DATABASE_USERNAME, DATABASE_PASSWORD, {
    host: DATABASE_HOST,
    dialect: 'mysql'
})

const HeadTeacher = connection.import('./models/HeadTeacher')
const Teacher = connection.import('./models/Teacher')

const initializeDatabaseConnection = async () => {
    try {
        // await connection.sync({alter:true})
        // await connection.sync({force:true})
        await connection.sync()
    } catch (error) {
        console.log({
            error,
            message: 'There was a problem connecting to the database!'
        })
    }
}
initializeDatabaseConnection()

export { HeadTeacher, Teacher }

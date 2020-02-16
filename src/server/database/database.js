import Sequelize from 'sequelize'

const { DATABASE_NAME, DATABASE_USERNAME, DATABASE_PASSWORD, DATABASE_HOST } = process.env

const connection = new Sequelize(DATABASE_NAME, DATABASE_USERNAME, DATABASE_PASSWORD, {
    host: DATABASE_HOST,
    dialect: 'mysql'
})

const Authentication = connection.import('./models/Authentication')
const Admin = connection.import('./models/Admin')
const HeadTeacher = connection.import('./models/HeadTeacher')
const School = connection.import('./models/School')
const Teacher = connection.import('./models/Teacher')
const Student = connection.import('./models/Student')

Authentication.hasOne(Teacher)
Authentication.hasOne(Student)
Teacher.belongsTo(Authentication)
Student.belongsTo(Authentication)

HeadTeacher.hasOne(School)
School.belongsTo(HeadTeacher)

const initializeDatabaseConnection = async () => {
    try {
        // await connection.sync({ alter: true })
        // await connection.sync({ force: true })
        await connection.sync()
        console.log('The database connection has been successfully established!')
    } catch (error) {
        console.log({
            error,
            message: 'There was a problem connecting to the database!'
        })
    }
}
initializeDatabaseConnection()

export { Admin, HeadTeacher, School, Teacher, Student }

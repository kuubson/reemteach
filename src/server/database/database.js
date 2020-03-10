import Sequelize from 'sequelize'

const { DATABASE_NAME, DATABASE_USERNAME, DATABASE_PASSWORD, DATABASE_HOST } = process.env

const connection = new Sequelize(DATABASE_NAME, DATABASE_USERNAME, DATABASE_PASSWORD, {
    host: DATABASE_HOST,
    dialect: 'mysql',
    logging: false
})

const Admin = connection.import('./models/Admin')
const HeadTeacher = connection.import('./models/HeadTeacher')
const School = connection.import('./models/School')
const SchoolBell = connection.import('./models/SchoolBell')
const Grade = connection.import('./models/Grade')
const Teacher = connection.import('./models/Teacher')
const Student = connection.import('./models/Student')
const Subscription = connection.import('./models/Subscription')

HeadTeacher.hasOne(School)
School.belongsTo(HeadTeacher)

School.hasMany(SchoolBell)
SchoolBell.belongsTo(School)

School.belongsToMany(Teacher, { through: 'composedSchools' })
Teacher.belongsToMany(School, { through: 'composedSchools' })

School.hasMany(Grade)
Grade.belongsTo(School)

Grade.hasMany(Student)
Student.belongsTo(Grade)

Student.hasMany(Subscription)
Subscription.belongsTo(Student)

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

export { Admin, HeadTeacher, School, SchoolBell, Grade, Teacher, Student, Subscription }

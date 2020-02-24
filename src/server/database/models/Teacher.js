import { Model, DataTypes } from 'sequelize'
import bcrypt from 'bcryptjs'

const { STRING, TEXT, INTEGER, BOOLEAN } = DataTypes

export default sequelize => {
    class Teacher extends Model {}
    Teacher.init(
        {
            email: {
                type: STRING,
                allowNull: false
            },
            password: {
                type: TEXT,
                allowNull: false
            },
            name: {
                type: STRING
            },
            surname: {
                type: STRING
            },
            age: {
                type: INTEGER
            },
            description: {
                type: TEXT
            },
            subject: {
                type: STRING
            },
            isActivated: {
                type: BOOLEAN,
                defaultValue: false
            }
        },
        {
            sequelize,
            modelName: 'teacher',
            hooks: {
                beforeCreate: teacher => {
                    teacher.password = bcrypt.hashSync(teacher.password, 11)
                }
            }
        }
    )
    return Teacher
}

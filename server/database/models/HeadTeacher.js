import { Model, DataTypes } from 'sequelize'
import bcrypt from 'bcryptjs'

const { STRING, TEXT, INTEGER, BOOLEAN } = DataTypes

export default sequelize => {
    class HeadTeacher extends Model {}
    HeadTeacher.init(
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
            isActivated: {
                type: BOOLEAN,
                defaultValue: false
            }
        },
        {
            sequelize,
            modelName: 'headTeacher',
            hooks: {
                beforeCreate: headTeacher => {
                    headTeacher.password = bcrypt.hashSync(headTeacher.password, 11)
                }
            }
        }
    )
    return HeadTeacher
}

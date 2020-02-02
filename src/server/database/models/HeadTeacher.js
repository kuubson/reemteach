import { Model, DataTypes } from 'sequelize'
import bcrypt from 'bcryptjs'

const { STRING, TEXT } = DataTypes

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

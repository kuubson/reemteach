import { Model, DataTypes } from 'sequelize'
import bcrypt from 'bcryptjs'

const { STRING, TEXT } = DataTypes

export default sequelize => {
    class Admin extends Model {}
    Admin.init(
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
            modelName: 'admin',
            hooks: {
                beforeCreate: admin => {
                    admin.password = bcrypt.hashSync(admin.password, 11)
                }
            }
        }
    )
    return Admin
}

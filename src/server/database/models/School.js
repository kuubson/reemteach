import { Model, DataTypes } from 'sequelize'

const { STRING, TEXT } = DataTypes

export default sequelize => {
    class School extends Model {}
    School.init(
        {
            name: {
                type: STRING,
                allowNull: false
            },
            type: {
                type: STRING,
                allowNull: false
            },
            description: {
                type: TEXT,
                allowNull: false
            },
            creationDate: {
                type: STRING,
                allowNull: false
            }
        },
        {
            sequelize,
            modelName: 'school'
        }
    )
    return School
}

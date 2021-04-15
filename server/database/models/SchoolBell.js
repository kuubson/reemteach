import { Model, DataTypes } from 'sequelize'

const { STRING, BOOLEAN } = DataTypes

export default sequelize => {
    class SchoolBell extends Model {}
    SchoolBell.init(
        {
            from: {
                type: STRING,
                allowNull: false
            },
            to: {
                type: STRING,
                allowNull: false
            },
            isRecess: {
                type: BOOLEAN,
                allowNull: false
            }
        },
        {
            sequelize,
            modelName: 'schoolBell'
        }
    )
    return SchoolBell
}

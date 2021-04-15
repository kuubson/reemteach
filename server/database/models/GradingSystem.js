import { Model, DataTypes } from 'sequelize'

const { ENUM, INTEGER } = DataTypes

export default sequelize => {
    class GradingSystem extends Model {}
    GradingSystem.init(
        {
            grade: {
                type: ENUM(['1', '2', '3', '4', '5', '6']),
                allowNull: false
            },
            from: {
                type: INTEGER,
                allowNull: false
            },
            to: {
                type: INTEGER,
                allowNull: false
            }
        },
        {
            sequelize,
            modelName: 'gradingSystem'
        }
    )
    return GradingSystem
}

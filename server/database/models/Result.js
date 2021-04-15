import { Model, DataTypes } from 'sequelize'

const { ENUM, TEXT } = DataTypes

export default sequelize => {
    class Result extends Model {}
    Result.init(
        {
            grade: {
                type: ENUM(['1', '2', '3', '4', '5', '6']),
                allowNull: false
            },
            questions: {
                type: TEXT,
                allowNull: false
            }
        },
        {
            sequelize,
            modelName: 'result'
        }
    )
    return Result
}

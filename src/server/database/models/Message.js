import { Model, DataTypes } from 'sequelize'

const { TEXT, STRING, BOOLEAN } = DataTypes

export default sequelize => {
    class Message extends Model {}
    Message.init(
        {
            content: {
                type: TEXT,
                allowNull: false
            },
            school: {
                type: STRING
            },
            grade: {
                type: STRING
            },
            isTeacher: {
                type: BOOLEAN,
                allowNull: false
            }
        },
        {
            sequelize,
            modelName: 'message'
        }
    )
    return Message
}

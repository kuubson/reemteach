import { Model, DataTypes } from 'sequelize'

const { TEXT } = DataTypes

export default sequelize => {
    class News extends Model {}
    News.init(
        {
            title: {
                type: TEXT,
                allowNull: false
            },
            content: {
                type: TEXT,
                allowNull: false
            }
        },
        {
            sequelize,
            modelName: 'news'
        }
    )
    return News
}

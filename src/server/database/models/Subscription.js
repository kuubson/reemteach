import { Model, DataTypes } from 'sequelize'

const { STRING, BOOLEAN } = DataTypes

export default sequelize => {
    class Subscription extends Model {}
    Subscription.init(
        {
            endpoint: {
                type: STRING,
                allowNull: false
            },
            p256dh: {
                type: STRING,
                allowNull: false
            },
            auth: {
                type: STRING,
                allowNull: false
            },
            isActivated: {
                type: BOOLEAN,
                defaultValue: true
            }
        },
        {
            sequelize,
            modelName: 'subscription'
        }
    )
    return Subscription
}

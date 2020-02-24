import { Model, DataTypes } from 'sequelize'

const { ENUM } = DataTypes

export default sequelize => {
    class Grade extends Model {}
    Grade.init(
        {
            grade: {
                type: ENUM([
                    '1A',
                    '1B',
                    '1C',
                    '1D',
                    '1E',
                    '1F',
                    '1G',
                    '1H',
                    '1I',
                    '1J',
                    '1K',
                    '1L',
                    '1M',
                    '2A',
                    '2B',
                    '2C',
                    '2D',
                    '2E',
                    '2F',
                    '2G',
                    '2H',
                    '2I',
                    '2J',
                    '2K',
                    '2L',
                    '2M',
                    '3A',
                    '3B',
                    '3C',
                    '3D',
                    '3E',
                    '3F',
                    '3G',
                    '3H',
                    '3I',
                    '3J',
                    '3K',
                    '3L',
                    '3M',
                    '4A',
                    '4B',
                    '4C',
                    '4D',
                    '4E',
                    '4F',
                    '4G',
                    '4H',
                    '4I',
                    '4J',
                    '4K',
                    '4L',
                    '4M'
                ]),
                allowNull: false
            }
        },
        {
            sequelize,
            modelName: 'grade'
        }
    )
    return Grade
}

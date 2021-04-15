import { Model, DataTypes } from 'sequelize'

const { TEXT, ENUM } = DataTypes

export default sequelize => {
    class Question extends Model {}
    Question.init(
        {
            subject: {
                type: ENUM([
                    'Religia',
                    'Język polski',
                    'Język angielski',
                    'Język niemiecki',
                    'Język rosyjski',
                    'Język francuski',
                    'Matematyka',
                    'Fizyka',
                    'Biologia',
                    'Chemia',
                    'Geografia',
                    'Wiedza o społeczeństwie',
                    'Historia',
                    'Informatyka'
                ]),
                allowNull: false
            },
            content: {
                type: TEXT,
                allowNull: false
            },
            answerA: {
                type: TEXT,
                allowNull: false
            },
            answerB: {
                type: TEXT,
                allowNull: false
            },
            answerC: {
                type: TEXT,
                allowNull: false
            },
            answerD: {
                type: TEXT,
                allowNull: false
            },
            properAnswer: {
                type: ENUM(['A', 'B', 'C', 'D']),
                allowNull: false
            },
            image: {
                type: TEXT
            }
        },
        {
            sequelize,
            modelName: 'question'
        }
    )
    return Question
}

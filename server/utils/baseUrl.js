export default () =>
    process.env.NODE_ENV === 'development'
        ? 'http://localhost:3001'
        : 'https://reemteach.herokuapp.com'

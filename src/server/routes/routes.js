import confirmToken from './global/confirmToken/confirmToken'
import logout from './global/logout/logout'

export default app => {
    app.use('/', confirmToken)
    app.use('/', logout)
}

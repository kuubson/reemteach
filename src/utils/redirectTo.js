import { history } from '@utils'

export default (pathname, state) => {
    window.scrollTo(0, 0)
    history.push({
        pathname,
        state
    })
}

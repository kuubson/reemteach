import { history, setShouldMenuAppear } from 'utils'

export default (pathname, state) => {
    window.scrollTo(0, 0)
    setShouldMenuAppear(false)
    setTimeout(() => {
        setShouldMenuAppear()
        history.push({
            pathname,
            state
        })
    }, 800)
}

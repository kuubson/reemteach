import { history } from '@utils'

export default (pathname, state) => {
	history.push({
		pathname,
		state
	})
}

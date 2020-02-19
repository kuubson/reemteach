import sanitize from 'sanitize-html'

export default value => value !== sanitize(value)

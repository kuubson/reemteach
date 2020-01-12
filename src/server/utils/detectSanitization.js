const sanitize = require('sanitize-html')

module.exports = value => {
	value = value.toString()
	if (value !== sanitize(value) && typeof value !== 'boolean') {
		throw new Error()
	} else {
		return sanitize(value)
	}
}

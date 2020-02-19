export default value => {
    value = value.toString()
    if (value.split(' ').length > 1) {
        throw new Error()
    } else {
        return value
    }
}

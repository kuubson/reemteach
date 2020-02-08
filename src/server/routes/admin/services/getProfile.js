const main = (req, res) => {
    const { email } = req.user
    res.send({
        email
    })
}

export default () => main

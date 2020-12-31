const app = require('express')()
const api = require('./api')
const mongoUtil = require('./db-utils/mong-util')
const PORT = 3000
app.use('/api', api)


mongoUtil.connectDB((err) => {
    if (err) {
        console.log('could not connect to db ' + err)
        return
    }
    app.listen(PORT, (err) => {
        if (err) {
            console.log('server failed')
            return
        }
        console.log(`server up at ${PORT}`)
    })
})

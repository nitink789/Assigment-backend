const router = require('express').Router()
const mongoUtil = require('./db-utils/mong-util')

router.get('/getOrdersPlacedUser', async (req, res) => {
    try {
        const orders = mongoUtil.getDB().collection('orders')
        let response = await orders.aggregate([{
            $group: {
                _id: "$userId",
                noOfOrders: { $sum: 1 },
                averageBillValue: { $avg: "$subtotal" }
            }
        }, {
            $lookup: {
                from: 'users',
                localField: '_id',
                foreignField: 'userId',
                as: 'name'
            }
        }, {
            $unwind: "$name"
        },
        {
            $project: {
                _id: 0, userId: "$_id", name: "$name.name", noOfOrders: "$noOfOrders",
                averageBillValue: { $trunc: ["$averageBillValue", 0] }
            }
        },
        { $sort: { userId: 1 } }]).toArray()

        res.json(response)
    }
    catch (e) {
        res.send(String(e))
    }
})

router.post('/updateUserOrder', async (req, res) => {
    try {
        const db = mongoUtil.getDB()
        const orders = db.collection('orders')
        const users = db.collection('users')
        const bulk = users.initializeUnorderedBulkOp()
        let userOrders = await orders.aggregate([{ $group: { _id: '$userId', count: { $sum: 1 } } }]).toArray()
        userOrders.forEach(user => {
            bulk.find({ userId: user._id }).update({ $set: { "noOfOrders": user.count } })
        })
        await bulk.execute()
        res.send({ success: true, message: 'Successfully updated' })
    }
    catch (e) {
        res.send(String(e))
    }
})

module.exports = router
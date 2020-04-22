/*index.js*/ 
// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const result1 = await db.collection('post_certification').doc(event._id)
      .update({
        data: {
          status: 'done',
        }
      }).then(console.log)

    const result2 = await db.collection('user').where({
      _openid: event._openid
    })
      .update({
        data: {
          certification: event.action
        }
      }).then(console.log)
    console.log(result2)
    return result2
  } catch (err) {
    console.log(err)
    return err
  }
}
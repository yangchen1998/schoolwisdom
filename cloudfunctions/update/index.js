// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  //云函数的传入参数有两个，一个是 event 对象，一个是 context 对象。event 指的是触发云函数的事件，当小程序端调用云函数时，event 就是小程序端调用云函数时传入的参数，外加后端自动注入的小程序用户的 openid 和小程序的 appid。context 对象包含了此处调用的调用信息和运行状态，可以用它来了解服务运行的情况。
  try {
    //根据entrance的不同，执行不同的更新函数
    if (event.entrance == 'viewers') {
      //批量更新数据
      return await db.collection('post').where({
        state: '0'
      })
        .update({
          data: {
            //db.command.inc更新指令。用于指示字段自增某个值，这是个原子操作，使用这个操作指令而不是先读数据、再加、再写回的好处是：1、原子性：多个用户同时写，对数据库来说都是将字段加一，不会有后来者覆写前者的情况 2、减少一次网络请求：不需先读再写
            viewers: _.inc(3)
          },
        })
      console.log(result)
    } else if (event.entrance == 'viewer') {
      //单个数据更新
      return await db.collection('post').doc(event.id)
        .update({
          data: {
            viewers: _.inc(1)
          },
        })
    } else if (event.entrance == 'comments') {
      return await db.collection('post').doc(event.id)
        .update({
          data: {
            comments: _[0].inc(1)
          },
        })
    } else {
      return await db.collection('post').add({
        data: event
      })
      //      console.log('没有执行任何更新函数')
    }
    console.log(result)
  } catch (e) {
    console.error(e)
  }
}
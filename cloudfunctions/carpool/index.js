// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: "neuhelper-8f4v",
  traceUser: true,
})
const db = cloud.database()
const _ = db.command
exports.main = async (event, context) => {
  try {
    const wxContext = cloud.getWXContext()
    if (event.entrance == 'start') {
      const result = await cloud.openapi.templateMessage.send({
        touser: wxContext.OPENID,
        page: 'pages/carpool/carpool',
        templateId: 'HMGenKcCtNFnPOuQRImDIZgc3m-1zyxqhg8CTc79u2Q',
        formId: event.creator.formId,
        data: {
          keyword1: {
            value: event.creator.name
          },
          keyword2: {
            value: event.destination
          },
          keyword3: {
            value: event.origin
          },
          keyword4: {
            value: event.date + ' ' + event.time
          },
          keyword5: {
            value: event.phone
          },
          keyword6: {
            value: event.people_nums
          },
          keyword7: {
            value: '后续无法下发通知，请您自行留意拼车信息'
          }
        }
      })
    } else if (event.entrance == 'add') {
      await db.collection('carpool').doc(event._id).update({
        data: {
          sharing: _.push(event.information)
        },
      })
      const result = await cloud.openapi.templateMessage.send({
        touser: wxContext.OPENID,
        page: 'pages/carpool/carpool',
        templateId: 'IoXVgan2luZv1VqpyYFYrc9-ORS6x_C3XbL72GEB7II',
        formId: event.information.formId,
        data: {
          keyword1: {
            value: event.information.name
          },
          keyword2: {
            value: event.destination
          },
          keyword3: {
            value: event.origin
          },
          keyword4: {
            value: event.date + ' ' + event.time
          },
          keyword5: {
            value: event.people_nums
          },
          keyword6: {
            value: event.phone
          },
          keyword7: {
            value: '上述电话为拼车发起人的联系方式，请您尽快联系'
          }
        }
      })

    }
    console.log(result)
    return result
  } catch (err) {
    console.log(err)
    return err
  }
}
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
    if (event.entrance == 'post') {
      const result = await cloud.openapi.templateMessage.send({
        touser: event._openid2,
        page: 'pages/lostAndFound/lostAndFound',
        templateId: 'gzJFIeyITnElPDhE24IIcQLscwM0_qoKx6TYeKb96ME',
        formId: event.formId2,
        data: {
          keyword1: {
            value: '学生证'
          },
          keyword2: {
            value: event.type2
          },
          keyword3: {
            value: event.stuid2
          },
          keyword4: {
            value: event.time2
          },
          keyword5: {
            value: event.location2
          },
          keyword6: {
            value: event.name2
          },
          keyword7: {
            value: event.phone2
          },
          keyword8: {
            value: '线下认领'
          }
        }
      })
      if (event.stuid22 != 'no') {
        await db.collection('lost_idcard').where({
          student_id: event.stuid22
        }).update({
          data: {
            state: 'done'
          },
        })
      }
    } else {
      const result = await cloud.openapi.templateMessage.send({
        touser: event._openid,
        page: 'pages/lostAndFound/lostAndFound',
        templateId: 'Z0sCb1_mgawBJSEWTJc2GAYPsCiCoFb5aZ5XUsi-_58',
        formId: event.formId,
        emphasisKeyword: 'keyword3.DATA',
        data: {
          keyword1: {
            value: event.name
          },
          keyword2: {
            value: event.student_id
          },
          keyword3: {
            value: event.action
          },
          keyword4: {
            value: '如有问题请联系工作人员'
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
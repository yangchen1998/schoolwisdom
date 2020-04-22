/*index.js*/ 
// 云函数模板
// 部署：在 cloud-functions/login 文件夹右击选择 “上传并部署”

const cloud = require('wx-server-sdk')

// 初始化 cloud
cloud.init()
const db = cloud.database()
let repair = new Array();
let certifying = new Array();
let report = new Array();
let err1 = 0;
let checkcertification = '';
/**
 * 这个示例将经自动鉴权过的小程序用户 openid 返回给小程序端
 * 
 * event 参数包含小程序端调用传入的 data
 * 
 */
exports.main = (event, context) => {
  // console.log(event)
  // console.log(context)

  // 可执行其他自定义逻辑
  // console.log 的内容可以在云开发云函数调用日志查看
  // 获取 WX Context (微信调用上下文)，包括 OPENID、APPID、及 UNIONID（需满足 UNIONID 获取条件）
  const wxContext = cloud.getWXContext()
  try {
    if (event.name == 'checkidentity') {
      db.collection('user').where({
        _openid: wxContext.OPENID
      }).get({}).then(
        res => {
          if (res.data[0].identity == 'administrator') {
            db.collection('post_repair').where({
              status: 'doing'
            }).orderBy('date', 'asc').limit(100).get().then(p1 => {
              if (p1.data.length != 0) {
                repair = p1.data
              }
            })
            db.collection('post_certification').where({
              status: 'doing'
            }).orderBy('date', 'asc').limit(100).get().then(p2 => {
              if (p2.data.length != 0) {
                certifying = p2.data
              }
            })
            db.collection('report').where({
              status: 'doing'
            }).orderBy('date', 'asc').limit(100).get().then(p3 => {
              if (p3.data.length != 0) {
                report = p3.data
              }
            })
          } else {
            err1 = 1;
          }
        })
    } else if (event.name == 'checkcertification') {
      db.collection('user').where({
        _openid: wxContext.OPENID
      }).get({}).then(
        res => {
          if (res.data[0].identity != 'invaliduser' && res.data[0].certification == 'yes') {
            checkcertification = 'yes';
          } else {
            checkcertification = 'no';
          }
        })
    }
    return {
      event,
      userInfo: wxContext.USERINFO,
      openid: wxContext.OPENID,
      appid: wxContext.APPID,
      unionid: wxContext.UNIONID,
      certifying: certifying,
      report: report,
      err: err1,
      repair: repair,
      checkcertification: checkcertification
    }
  } catch (err) {
    console.log(err)
    return err
  }
}
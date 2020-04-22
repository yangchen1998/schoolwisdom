// miniprogram/pages/prelogin.js
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    modalName: 'Image'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
/*     var util = require('../utils/util.js')
    var time = util.formatTime(new Date()) //获取时间
    wx.showLoading({
      title: '登录中'
    })
    var user = wx.getStorageSync('user')
    if (!user) {
      //没有本地缓存，获取_openid,查找用户信息
      wx.cloud.callFunction({
        name: 'login',
      }).then(res => {
        db.collection('user').where({
          _openid: res.result.openid
        }).get().then(r1 => {
          wx.hideLoading()
          if (r1.data.length == 0) { //用户信息不存在建立新用户

            db.collection('user').add({
              data: {
                name: '',
                student_id: '',
                campus: '',
                college: '',
                major: '',
                phone: '',
                email: '',
                dormitory: '',
                roomnum: '',
                history: [{
                  _id: res.result.openid,
                  time: time,
                  type: 'post_create',
                  status: 'done'
                }],
                identity: 'user',
                certification: 'no',
                privacySetting: ['success', 'success']
              },
              success: function(se) {
                //                console.log(se)
                wx.setStorageSync('user', {
                  _id: se._id,
                  _openid: res.result.openid,
                  name: '',
                  student_id: '',
                  campus: '',
                  college: '',
                  major: '',
                  phone: '',
                  email: '',
                  dormitory: '',
                  roomnum: '',
                  history: [{
                    _id: res.result.openid,
                    time: time,
                    type: 'post_create',
                    status: 'done'
                  }],
                  identity: 'user',
                  certification: 'no',
                  privacySetting: ['success', 'success']
                })
                wx.hideLoading()
                wx.switchTab({
                  url: '/pages/index/index',
                })
              },
              fail: console.error
            })
            // console.log("不存在该用户") 
          } else { //用户已注册过，检查账户的identity有效性，有效则将信息缓存到本地
            db.collection('user').where({
              _openid: r1.data._openid
            }).get().then(r3 => {
              success: {
                //console.log("该用户已注册")
                //判断是否有效
                if (r3.data[0].identity == 'invaliduser') {
                  //先将信息缓存下来，无效用户重复进入的时候就直接进入另一个判断分支
                  console.log(r3.data[0])
                  wx.setStorageSync('user', r3.data[0])
                  //无效用户则不能进入程序并给出提示
                  this.setData({
                    modalName: 'Image',
                    fail: true
                  })
                } else {
                  wx.reLaunch({
                    url: '/pages/index/index',
                  })
                }
              }
              fail: wx.onUnload
            })
          }
        })

      })
    } else {
      //如果有缓存则验证账户的有效性
      db.collection('user').where({
        _openid: user._openid
      }).get().then(r1 => {
        wx.hideLoading()
        if (r1.data.length == 0 || r1.data[0].identity == 'invaliduser') { //用户信息不存在或者identity是invaliduser的
          //无效用户则不能进入程序并给出提示
          this.setData({
            modalName: 'Image',
            fail: true
          })
        } else { //存在账户且账户有效则进入首页
          wx.setStorageSync('user', r1.data[0])
          wx.reLaunch({
            url: '/pages/index/index',
          })
        }
      })
    }
  */ },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  hideModal: function (e) {
    this.setData({
      modalName: null
    })
  },
  hideModal22: function (e) {
    this.setData({
      modalName: null
    })
  }
})
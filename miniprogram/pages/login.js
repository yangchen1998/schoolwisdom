// miniprogram/pages/login.js
const app = getApp()
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    /*  have_register: false,
     read: 'not',
     cansubmit1: 'notread',
     cansubmit2: 'notread',
     pw: false */
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      imagec: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1562909710058&di=9a5e08c8f0f8faa21c1f76a5c7679654&imgtype=0&src=http%3A%2F%2Fpic49.nipic.com%2Ffile%2F20140928%2F11624852_143144132000_2.jpg'
    })
    //   this.changeimage()
  },
  changeimage: function (e) {
    this.randomimage();
    setTimeout(() => {
      this.changeimage();
    }, 500) //用定时器实现实时刷新
  },
  randomimage: function (e) {
    var index = Math.ceil(Math.random() * 10);
    if (index < 5) {
      this.setData({
        imagec: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1562909710058&di=9a5e08c8f0f8faa21c1f76a5c7679654&imgtype=0&src=http%3A%2F%2Fpic49.nipic.com%2Ffile%2F20140928%2F11624852_143144132000_2.jpg'
      })
    } else {
      this.setData({
        imagec: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1562909710058&di=ee5439f561ee227422b31019a3790c58&imgtype=0&src=http%3A%2F%2Fpic8.nipic.com%2F20100730%2F5160202_115708024562_2.jpg'
      })
    }
  },
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
    wx.showShareMenu({
      withShareTicket: true
    })
  },
  onTaprule: function () {
    console.log("1")
    wx.showModal({
      title: '用户许可协议',
      content: wx.getStorageSync('rule'),
      confirmText: '接受',
      cancelText: '拒绝',
      confirmColor: '#4d4bec',
      success: (res => {
        if (res.confirm) {
          /* console.log('用户点击接受') */
          this.setData({
            read: 'yes',
            cansubmit1: 'submit1',
            cansubmit2: 'submit2'
          })
        } else if (res.cancel) {
          /* console.log('用户点击不接受') */
          this.setData({
            read: 'not',
            cansubmit1: 'notread',
            cansubmit2: 'notread'
          })
        }
      })
    })

  },
  submit2: function () {
    console.log("用户请求登录")
    wx.setStorageSync('identity', 'visitor')
    wx.navigateTo({
      url: '/pages/visitor/visitor',
    })
  },
  submit1: function () {
    //用户信息不存在时进行的主动登录操作
    var util = require('../utils/util.js')
    var time = util.formatTime(new Date()) //获取时间
    if (this.data.pw == true) {

      wx.showModal({
        title: '绑定确认',
        content: '一网通账户信息核实成功！请确认绑定',
        confirmText: '确认',
        cancelText: '取消',
        confirmColor: '#4d4bec',
        success: (res => {
          wx.hideToast()
          if (res.confirm) {
            /* console.log('用户点击同意') */
            wx.showLoading({
              title: '绑定中',
            })
            wx.cloud.callFunction({
              name: 'login',
              complete: rt => {
                console.log('callFunction test result: ', rt)
                var mydata = {
                  name: 'NEU',
                  student_id: '19230426',
                  campus: '',
                  college: '',
                  major: '',
                  phone: '',
                  email: '',
                  dormitory: '',
                  roomnum: '',
                  history: [{
                    _id: rt.result.openid,
                    time: time,
                    type: 'post_create',
                    status: 'done'
                  }],
                  identity: 'user',
                  certification: 'no',
                  privacySetting: ['success', 'success'],
                  bad_record: []
                }
                db.collection('user').add({
                  data: mydata,
                  success: function (res) {
                    // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
                    /* console.log(res) */
                    mydata._id = res._id;
                    wx.hideLoading()
                    wx.setStorageSync('user', mydata)
                    wx.showToast({
                      title: '绑定成功',
                      icon: 'success',
                      duration: 500,
                    })
                    wx.switchTab({
                      url: '/pages/index/index',
                    })
                  },
                  fail: console.error
                })
              }
            })

          } else if (res.cancel) {
            /* console.log('用户点击不接受') */

          }
        })
      })


    } else {
      wx.showToast({
        title: '密码错误请重新输入！',
        icon: 'none',
        duration: 1000
      })
      this.resetpw()
    }
  },
  notread: function () {
    wx.showToast({
      title: '请先接受用户许可协议',
      icon: 'none',
      duration: 1000
    })
  },
  inputid: function (e) {
    this.setData({
      student_id: e.detail.value
    })
  },
  inputpassword: function (e) {
    this.setData({
      password: e.detail.value
    })
  },
  resetpw: function (e) {
    console.log("执行了resetpw")
    this.setData({
      password: ''
    })
  },
  ontapinput1: function () {
    this.setData({
      focus1: true
    })
  },
  ontapinput2: function () {
    this.setData({
      focus2: true
    })
  },
  blur2: function (e) {
    var account = new Array;
    var in_account = new Array;
    account[0] = this.data.student_id;
    account[1] = this.data.password;
    in_account[0] = wx.getStorageSync('account').student_id;
    in_account[1] = wx.getStorageSync('account').password;
    if (JSON.stringify(account) === JSON.stringify(in_account)) {
      this.setData({
        focus2: false,
        pw: true
      })
    } else {
      this.setData({
        pw: false
      })
    }
  },
  refurbish: function () {
    wx.reLaunch({
      url: '/pages/login'
    })
  },
  onBackPage: function (e) {
    if (getCurrentPages().length == 1) {
      wx.reLaunch({
        url: '../lostAndFound/lostAndFound',
      })
    } else {
      wx.navigateBack({
        delta: 1
      })
    }
  }
})
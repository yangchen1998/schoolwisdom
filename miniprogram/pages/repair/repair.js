// pages/repair/repair.js
const db = wx.cloud.database()
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    locationid: [0, 0, 0],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      user: wx.getStorageSync('user'),
      time: util.formatTime(new Date())
    })
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

  },
  /* formSubmit: function(e){
    console.log(e.detail.value.type)
  }, */
  formSubmit: function (e) {
    wx.showLoading({
      title: '提交中',
    })
    // console.log('form发生了submit事件，携带数据为：', e.detail.value)
    db.collection('post_repair').add({
      data: {
        name: this.data.user.name,
        dormitory: this.data.user.dormitory,
        time: this.data.time,
        phone: e.detail.value.input,
        detail: e.detail.value.detail,
        status: 'doing',
        type: e.detail.value.type
      },
      success: (res => {
        var user = this.data.user;
        var add = {
          _id: res._id,
          time: this.data.time,
          type: 'post_repair',
          status: 'doing'
        }
        user.history.push(add)
        wx.setStorageSync('user', user)
        db.collection('user').doc(user._id).update({
          // data 传入需要局部更新的数据
          data: {
            // 表示将 done 字段置为 true
            history: user.history
          },
          success: (rr => {
            wx.hideLoading()
            wx.showToast({
              title: '提交成功',
              duration: 1000,
              success: function () {
                wx.reLaunch({
                  url: '../index/index',
                })
              },
              fail: function () { },
            })
          }),
          fail: console.error
        })
      })
    })
  },
  formReset: function () {
    //console.log('form发生了reset事件')
    wx.reLaunch({
      url: '../index/index',
    })
  }
})
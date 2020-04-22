// pages/information/information.js
//获取应用实例
const app = getApp()
Page({
  data: {},
  //事件处理函数
  bindViewTap: function () { },
  onLoad: function (options) {
    this.setData({
      userInfo: wx.getStorageSync('userInfo'),
      user: wx.getStorageSync('user'),
    })
  },
  onGotUserInfo: function (e) {
    if (!this.data.userInfo) {
      wx.setStorageSync('userInfo', e.detail.userInfo)
      this.setData({
        userInfo: e.detail.userInfo
      })
    } else {
      wx.hideTabBar({})
      this.showCard();
    }

  },
  onShow: function () { },
  changeinfomation: function () {
    wx.navigateTo({
      url: '../update/update',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  tocertify: function () {
    wx.showTabBar({})
    wx.navigateTo({
      url: '../certifying/certifying',
    })

  },
  onBackPage: function () {
    //console.log("1")
    wx.navigateBack({
      delta: 1
    })
  },
  showCard: function (e) {
    this.setData({
      hideCard: true
    })
  },
  hideCard: function (e) {
    this.setData({
      hideCard: false
    })
    wx.showTabBar({})
  }
})
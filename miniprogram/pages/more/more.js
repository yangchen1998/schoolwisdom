// miniprogram/more/more.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
  tap1: function (e) {
    wx.navigateTo({
      url: 'school_calendar/school_calendar',
    })
  },
  tap2: function (e) {
    wx.showToast({
      title: '该功能尚未开放',
      icon: 'none',
      duration: 1000,
    })
  },
  tap3: function (e) {
    wx.navigateTo({
      url: 'school_class/school_phone',
    })
  },
  tap4: function (e) {
    wx.navigateTo({
      url: 'school_calendar/school_calendar',
    })
  },
  tap5: function (e) {
    wx.navigateTo({
      url: 'school_calendar/school_calendar',
    })
  },
  tap6: function (e) {
    wx.navigateTo({
      url: 'school_calendar/school_calendar',
    })
  }
})
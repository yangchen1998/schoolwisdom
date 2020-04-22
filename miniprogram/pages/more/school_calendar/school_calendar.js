// miniprogram/pages/more/school_calendar/school_calendar.js
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
  tap1: function () {
    wx.previewImage({
      current: 'cloud://neuhelper-1ol0o.6e65-neuhelper-1ol0o/NEU/2019-2020学年校历.jpg',
      urls: ['cloud://neuhelper-1ol0o.6e65-neuhelper-1ol0o/NEU/2019-2020学年校历.jpg', 'cloud://neuhelper-1ol0o.6e65-neuhelper-1ol0o/NEU/校车.jpg']
    })
  },
  tap2: function () {
    wx.previewImage({
      current: 'cloud://neuhelper-1ol0o.6e65-neuhelper-1ol0o/NEU/校车.jpg',
      urls: ['cloud://neuhelper-1ol0o.6e65-neuhelper-1ol0o/NEU/2018-2019学年校历.png', 'cloud://neuhelper-1ol0o.6e65-neuhelper-1ol0o/NEU/校车.jpg']
    })
  },
  onBackPage: function () {
    wx.navigateBack({
      delta: 1
    })
  }
})
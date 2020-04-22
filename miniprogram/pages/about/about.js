// miniprogram/pages/about/about.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navigationBarText: '关于'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.stopPullDownRefresh()
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
  ongroup: function (e) {
    wx.navigateTo({
      url: '../login',
    })
    wx.showToast({
      title: '下个版本更新',
      icon: 'none'
    })
  },
  onupdate: function (e) {
    wx.showToast({
      title: '下个版本更新',
      icon: 'none'
    })
  },
  onlicense: function (e) {
    wx.showToast({
      title: '下个版本更新',
      icon: 'none'
    })
  },
  onmanagement: function (e) {
    wx.showToast({
      title: '下个版本更新',
      icon: 'none'
    })
  },
  onprivacy: function (e) {
    wx.showToast({
      title: '下个版本更新',
      icon: 'none'
    })
  },
  onBackPage: function (e) {
    wx.navigateBack({
      delta: 1
    })
  }
})
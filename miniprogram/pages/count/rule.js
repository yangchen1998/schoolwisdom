// miniprogram/pages/count/rule.js
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
  onUrl: function (e) {
    wx.setClipboardData({
      data: 'http://aao.neu.edu.cn/2019/0318/c2340a86970/page.htm',
      success(res) {
        wx.getClipboardData({
          success(res) {
            console.log(res.data) // data
          }
        })
      }
    })
  },
  onBackPage: function (e) {
    wx.navigateBack({
      delta: 1,
      fail: function () {
        wx.reLaunch({
          url: '/page/lostAndFound/lostAndFound'
        })
      }
    })
  },
  /* onImg:function(e){
    let urls = ['cloud://neuhelper-1ol0o.6e65-neuhelper-1ol0o/NEU/课程单次GPA.png', 'cloud://neuhelper-1ol0o.6e65-neuhelper-1ol0o/NEU/课程平均GPA.png', 'cloud://neuhelper-1ol0o.6e65-neuhelper-1ol0o/NEU/总GPA.png']
    console.log(urls[e.currentTarget.dataset.id])
    wx.previewImage({
      current: urls[e.currentTarget.dataset.id], // 当前显示图片的http链接
      urls: urls // 需要预览的图片http链接列表
    })
  } */
})
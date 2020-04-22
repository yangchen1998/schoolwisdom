// miniprogram/pages/process/process.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    processt1: 'success',
    processt2: 'waiting',
    processt3: 'waiting',
    color1: '#00FF00',
    backcolor1: '#00FF00',
    color2: '#e5e5e5',
    backcolor2: '#e5e5e5',
    color3: '#e5e5e5',
    backcolor3: '#e5e5e5',
    done1: 'no',
    done2: 'no',
    done3: 'no'
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
    /*  const db = wx.cloud.database()
     db.collection('todorepair').where({
       tid:wx.getStorageSync('todo').repairid
     }).get().then(res => {
       
     })
     this.setData({
       
     })
    */
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
  finish1: function (e) {
    wx.showToast({
      title: '事件已结束',
      icon: 'success',
      duration: 2000
    })
    this.setData({
      done1: 'yes'
    })
  },
  finish2: function (e) {
    wx.showToast({
      title: '事件已结束',
      icon: 'success',
      duration: 2000
    })
    this.setData({
      done2: 'yes'
    })
  },
  finish3: function (e) {
    wx.showToast({
      title: '事件已结束',
      icon: 'success',
      duration: 2000
    })
    this.setData({
      done3: 'yes'
    })
  },
  help: function (e) {
    wx.showActionSheet({
      itemList: ['向自管会求助', '向管委会求助', '向客服求助'],
      success(res) {
        console.log(res.tapIndex)
      },
      fail(res) {
        console.log(res.errMsg)
      }
    })
  }
})
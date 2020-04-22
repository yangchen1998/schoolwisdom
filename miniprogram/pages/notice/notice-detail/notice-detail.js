// pages/notice/notice-detail/notice-detail.js
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  onBackPage: function () {
    wx.navigateBack({
      delta: 1
    })
  },
  onUser: function () {

  },
  onImage: function () {

  },
  onShare: function () {

  },
  onReclaim: function () {

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.notice) {
      this.setData({
        notice: JSON.parse(options.notice)
      });
    }
    if (options.postnotice) {
      var notice = JSON.parse(options.postnotice)
      db.collection(notice[1]).doc(notice[0]).get({
        success: res => {
          this.setData({
            notice: res.data,
            pdd: true,
          })
        }
      })
    }
    /* wx.showShareMenu({
      // 要求小程序返回分享目标信息
      withShareTicket: true
    }); */
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
  onShareAppMessage: function (ops) {
    if (ops.from === 'share') {
      // 来自页面内转发按钮
      console.log(ops.target)
    }
    return {
      title: '学校通知',
      path: '/pages/login',
      success: function (res) {
        // 转发成功
        console.log("转发成功:" + JSON.stringify(res));
        var shareTickets = res.shareTickets;
        // if (shareTickets.length == 0) {
        //   return false;
        // }
        // //可以获取群组信息
        // wx.getShareInfo({
        //   shareTicket: shareTickets[0],
        //   success: function (res) {
        //     console.log(res)
        //   }
        // })
      },
      fail: function (res) {
        // 转发失败
        console.log("转发失败:" + JSON.stringify(res));
      }
    }
  },
  backtoindex: function () {
    wx.reLaunch({
      url: '/pages/prelogin',
    })
  },
  onimg: function (e) {
    //   console.log(e.currentTarget.dataset.img)
    wx.previewImage({
      current: e.currentTarget.dataset.img,
      urls: this.data.notice.imgid
    })
  }

})
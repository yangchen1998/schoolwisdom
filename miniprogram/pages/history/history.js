// miniprogram/pages/history/history.js
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navigationBarText: '我的历史'
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var history = wx.getStorageSync('user').history;
    if (!history) {
      this.setData({
        none: 'true'
      })
    } else {
      this.setData({
        history: wx.getStorageSync('user').history.reverse()
      })

    }
    wx.hideLoading()
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
  onShow: function () { },

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
  onPostTap: function (event) {
    console.log(event.currentTarget.dataset.detail)
    var type = event.currentTarget.dataset.detail.type;
    wx.showLoading({
      title: '加载中'
    })
    console.log(type)
    if (type == 'post_create') {
      wx.hideLoading()
      wx.showToast({
        title: '此功能尚未开放',
        icon: 'none'
      })
      /* wx.navigateTo({
                url: '/pages/=' + JSON.stringify(res.data[0])
              }) */
      //这里设置一个反馈页面路径
    } else if (type == 'post_lost' || type == 'post_found') {
      wx.hideLoading()
      wx.showToast({
        title: '此功能正在维护',
        icon: 'none'
      })
      /* db.collection(event.currentTarget.dataset.detail.type).where({
        _id: event.currentTarget.dataset.detail._id
      }).get({
        success: (res => {
          //console.log(res.data)
          wx.hideLoading()
          if (res.data.length == 0) {
            wx.showToast({
              title: '此条记录已过期',
              icon: 'none'
            })
          } else {
            wx.navigateTo({
              url: '/pages/lostAndFound/detail/detail?post=' + JSON.stringify(res.data[0])
            })
          }
        })
      }) */
    } else if (type == '身份认证') {
      wx.hideLoading()
      wx.showToast({
        title: '此功能尚未开放',
        icon: 'none'
      })
      /* wx.navigateTo({
        url: '/pages/=' + JSON.stringify(res.data[0])
      }) */
      //这里设置一个反馈页面路径
    } else if (type == '寻物启事' || type == '失物招领') {
      db.collection('post').doc(event.currentTarget.dataset.detail._id).get({
        success: (res => {
          wx.navigateTo({
            url: '/pages/lostAndFound/detail/detail?post=' + JSON.stringify(res.data)
          })
        }),
        fail: console.error,
        complete: e => {
          wx.hideLoading()
          //  console.log(e)
        }
      })

      //这里设置一个反馈页面路径
    } else if (type == '加入拼车' || type == '发起拼车') {
      console.log(type)
      db.collection('carpool').doc(event.currentTarget.dataset.detail._id).get({
        success: (res => {
          wx.navigateTo({
            url: '/pages/carpool/carpoolDetail?detail=' + JSON.stringify(res.data)
          })
        }),
        fail: console.error,
        complete: e => {
          wx.hideLoading()
          //  console.log(e)
        }
      })
    }
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
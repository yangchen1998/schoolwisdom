// pages/notice/notice.js
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navigationBarText: '通知',
    tabs: ['全部', '我的校区', '我的宿舍'],
    activeIndex: 0,

  },
  onShow: function () {
    wx.showTabBar()
  },
  onLoad: function () {
    wx.showLoading({
      title: '加载中',
    })
    db.collection('post_notice').where({
      type: '通知',
      scope3: '所有类型'
    }).orderBy('date', 'desc').get().then(res => {
      this.setData({
        noticeList: res.data,
      }),
        wx.hideLoading()
    })
    wx.stopPullDownRefresh()
  },
  onPostTap: function (event) {
    //  console.log(event.currentTarget.dataset.notice)
    wx.navigateTo({
      url: '../notice/notice-detail/notice-detail?notice=' + JSON.stringify(event.currentTarget.dataset.notice),
    })
  },
  tabClick: function (e) {

    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
    //下面的代码要优化，改成先从缓存读取，判断是否要加载。在没退出这个页面之前就不要再加载了，刷新的时候再更新数据库的信息
    if (e.currentTarget.id == 0) {
      wx.showLoading({
        title: '加载中',
      })
      db.collection('post_notice').where({
        type: '通知',
        scope3: '所有类型'
      }).orderBy('date', 'desc').get().then(res => {
        this.setData({
          noticeList: res.data,
        }),
          wx.hideLoading()
      })
    }
    if (e.currentTarget.id == 1) {
      wx.showLoading({
        title: '加载中',
      })
      db.collection('post_notice').where({
        type: '通知',
        scope1: wx.getStorageSync('user').campus,
        scope2: ['全部']
      }).orderBy('date', 'desc').get().then(res => {
        this.setData({
          noticeList: res.data,
        }),
          wx.hideLoading()
      })
    }
    if (e.currentTarget.id == 2) {
      wx.showLoading({
        title: '加载中',
      })
      db.collection('post_notice').where({
        type: '通知',
        scope2: [wx.getStorageSync('user').dormitory]
      }).orderBy('date', 'desc').get().then(res => {
        this.setData({
          noticeList: res.data,
        }),
          wx.hideLoading()
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
  onBackPage: function (e) {
    wx.navigateBack({
      delta: 1
    })
  }
})
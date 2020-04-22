const db = wx.cloud.database()
var util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: ['全部', '卡证', '雨伞', '水杯', '书籍', '数码', '其它'],
    activeIndex: 0,
  },

  tabClick: function (e) {

    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
    //下面的代码要优化，改成先从缓存读取，判断是否要加载。在没退出这个页面之前就不要再加载了，刷新的时候再更新数据库的信息
    if (e.currentTarget.id == 1) {
      var type = '学生证'
    }
    if (e.currentTarget.id == 2) {
      var type = '雨伞'
    }
    if (e.currentTarget.id == 3) {
      var type = '水杯'
    }
    if (e.currentTarget.id == 4) {
      var type = '书籍'
    }
    if (e.currentTarget.id == 5) {
      var type = '数码'
    }
    if (e.currentTarget.id == 6) {
      var type = '其它'
    }
    wx.showLoading({
      title: '加载中',
    })
    db.collection('post_lost').limit(20).where({
      type: type
    }).orderBy('date', 'desc').get().then(res => {
      this.setData({
        postList: res.data,
      }),
        wx.hideLoading()
    })
  },



  oninput: function (e) {
    this.setData({
      seachtext: e.detail.value
    })
  },
  onsearch: function () {
    wx.showLoading({
      title: '正在搜索',
    })
    db.collection('post_lost').where({
      date: this.data.seachtext
    }).get().then(res => {
      this.setData({
        postList: res.data,
        activeIndex: '7'
      }),
        wx.hideLoading()
    })
    /*    this.setData({
         activeIndex: '7'
       }); */
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })
    db.collection('post_lost').limit(10).where({
      state: '0'
    }).orderBy('date', 'desc').get().then(res => {
      this.setData({
        postlen: res.data.length,
        postList: res.data,
        date: util.formatDate(new Date()),
        activeIndex: 0,
        sliderOffset: 0
      }),
        wx.hideLoading()
    })
    wx.stopPullDownRefresh() //刷新完成后停止下拉刷新动效
  },

  onPostTap: function (event) {
    /*   console.log(event.currentTarget.dataset.post) */
    wx.navigateTo({
      url: '../detail/detail?post=' + JSON.stringify(event.currentTarget.dataset.post)
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
    if (this.data.activeIndex == '0') {
      wx.showLoading({
        title: '加载中',
      })
      db.collection('post_lost').skip(this.data.postlen).limit(20).where({
        state: '0'
      }).orderBy('date', 'desc').get({
        success: (res => {
          wx.hideLoading()
          if (res.data.length == 0) {
            wx.showToast({
              title: '已经没有更多了',
              icon: 'none',
              duration: 2500
            })
          } else {
            var n = new Array;
            var newpostList = n.concat(this.data.postList, res.data)
            console.log(newpostList)
            this.setData({
              postList: newpostList,
              postlen: this.data.postlen + res.data.length,
            })
          }

        })
      })
    } else if (this.data.activeIndex == '7') {
      wx.showLoading({
        title: '加载中',
      })
      db.collection('post_lost').skip(this.data.postlen).limit(20).where({
        date: this.data.seachtext
      }).get({
        success: (res => {
          wx.hideLoading()
          if (res.data.length == 0) {
            wx.showToast({
              title: '已经没有更多了',
              icon: 'none',
              duration: 2500
            })
          } else {
            var n = new Array;
            var newpostList = n.concat(this.data.postList, res.data)
            console.log(newpostList)
            this.setData({
              postList: newpostList,
              postlen: this.data.postlen + res.data.length,
            })
          }
        })
      })
    } else if (this.data.activeIndex != '0' && this.data.activeIndex != '7') {
      {
        wx.showLoading({
          title: '加载中',
        })
        db.collection('post_lost').skip(this.data.postlen).limit(20).where({
          type: this.data.type
        }).orderBy('date', 'desc').get({
          success: (res => {
            wx.hideLoading()
            if (res.data.length == 0) {
              wx.showToast({
                title: '已经没有更多了',
                icon: 'none',
                duration: 2500
              })
            } else {
              var n = new Array;
              var newpostList = n.concat(this.data.postList, res.data)
              console.log(newpostList)
              this.setData({
                postList: newpostList,
                postlen: this.data.postlen + res.data.length,
              })
            }

          })
        })
      }
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
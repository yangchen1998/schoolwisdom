// pages/lostAndFound/Found/found.js
const db = wx.cloud.database()
var util = require('../../../utils/util.js')
var postlen = 0;
var scrollTop = 0;
var up = 0;
var class1 = 0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: ['全部', '卡证', '雨伞', '水杯', '书籍', '数码', '其它'],
    activeIndex: 0
  },

  tabClick: function (e) {
    //下面的代码要优化，改成先从缓存读取，判断是否要加载。在没退出这个页面之前就不要再加载了，刷新的时候再更新数据库的信息
    if (e.currentTarget.id == 0) {
      var type = '全部'
    }
    if (e.currentTarget.id == 1) {
      var type = '卡证'
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
    if (type == '全部') {
      wx.showLoading({
        title: '加载中',
      })
      db.collection('post').limit(10).where({
        state: '0'
      }).orderBy('time', 'desc').get().then(res => {
        this.postlen = res.data.length,
          this.setData({
            type: type,
            postList: res.data,
            sliderOffset: e.currentTarget.offsetLeft,
            activeIndex: e.currentTarget.id,
          }),
          wx.hideLoading()
      })
    } else {
      wx.showLoading({
        title: '加载中',
      })
      db.collection('post').limit(10).where({
        // certification:'yes',
        type: type
      }).orderBy('time', 'desc').get().then(res => {
        this.postlen = res.data.length,
          this.setData({
            type: type,
            // postlen: res.data.length,
            postList: res.data,
            sliderOffset: e.currentTarget.offsetLeft,
            activeIndex: e.currentTarget.id,
          }),
          wx.hideLoading()
      })
    }

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
    db.collection('post').limit(10).where({
      // certification:'yes',
      date: this.data.seachtext
    }).orderBy('time', 'desc').get().then(res => {
      this.postlen = res.data.length,
        this.setData({
          // postlen: res.data.length,
          postList: res.data,
          activeIndex: '7'
        }),
        wx.hideLoading()
    })
  },
  bindDateChange: function (e) {
    wx.showLoading({
      title: '加载中',
    })
    db.collection('post').limit(10).where({
      date: e.detail.value
    }).get().then(res => {
      this.setData({
        date: e.detail.value,
        postList: res.data,
        activeIndex: '7'
      }),
        wx.hideLoading()
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //  console.log(options.mold)
    var mold = options.mold;
    wx.showLoading({
      title: '加载中',
    })
    if (mold == 'post_found') {
      class1 = '招领'
      wx.setNavigationBarTitle({
        title: '失物招领'
      })
    } else {
      class1 = '寻物'
      wx.setNavigationBarTitle({
        title: '寻物启事'
      })
    }

    db.collection('post').limit(10).where({
      class1: class1,
      state: '0'
    }).orderBy('time', 'desc').get().then(res => {
      this.postlen = res.data.length,
        this.setData({
          //   postlen: res.data.length,
          postList: res.data,
          date: util.formatDate(new Date()),
          activeIndex: 0,
          sliderOffset: 0,
          mold: mold
        }),
        wx.hideLoading()
    })
    wx.stopPullDownRefresh() //刷新完成后停止下拉刷新动效 
  },

  onPostTap: function (event) {
    /*   console.log(event.currentTarget.dataset.post) */
    /*    if ( == 'post_lost') {
         var passmold = '寻物启事'
       } else(
         passmold = '失物招领'
       ) */
    wx.navigateTo({
      url: '../detail/detail?post=' + JSON.stringify(event.currentTarget.dataset.post) + "&mold=" + this.data.mold
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
      db.collection('post').skip(this.postlen).limit(10).where({
        // certification:'yes',
        state: '0'
      }).orderBy('time', 'desc').get({
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
            // console.log(newpostList)
            this.postlen = this.postlen + res.data.length,
              this.setData({
                postList: newpostList,
                //      postlen: this.data.postlen + res.data.length,
              })
          }

        })
      })
    } else if (this.data.activeIndex == '7') {
      wx.showLoading({
        title: '加载中',
      })
      db.collection('post').skip(this.postlen).limit(10).where({
        // certification:'yes',
        date: this.data.seachtext
      }).orderBy('time', 'desc').get({
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
            this.postlen = this.postlen + res.data.length,
              this.setData({
                postList: newpostList,
                //  postlen: this.data.postlen + res.data.length,
              })
          }
        })
      })
    } else if (this.data.activeIndex != '0' && this.data.activeIndex != '7') {
      {
        wx.showLoading({
          title: '加载中',
        })
        db.collection('post').skip(this.postlen).limit(20).where({
          // certification:'yes',
          type: this.data.type
        }).orderBy('time', 'desc').get({
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
              this.postlen = this.data.postlen + res.data.length,
                this.setData({
                  postList: newpostList,
                  // postlen: this.data.postlen + res.data.length,
                })
            }

          })
        })
      }
    }
  },
  //监听屏幕滚动 判断上下滚动  
  onPageScroll: function (event) {
    if (event.scrollTop >= scrollTop) {
      scrollTop = event.scrollTop
      up = 0
      this.setData({
        backtop: 1
      })
    } else {
      up = up - (event.scrollTop - scrollTop)
      console.log(up)
      if (up >= 300) {
        up = 0
      }
      scrollTop = event.scrollTop
    }
    if (event.scrollTop == 0) {
      this.setData({
        backtop: 0
      })
    }
  },
  //返回顶部
  onBacktop: function (e) {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (ops) {
    return {
      title: '失物招领信息(请在相应页面内搜索:' + this.data.post.type + ')',
      path: 'pages/lostAndFound/lostAndFound',
      success: function (res) {
        // 转发成功
        console.log("转发成功:" + JSON.stringify(res));
        var shareTickets = res.shareTickets;
      },
      fail: function (res) {
        // 转发失败
        console.log("转发失败:" + JSON.stringify(res));
      }
    }
  }
})
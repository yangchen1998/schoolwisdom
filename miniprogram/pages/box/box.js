//index.js
//获取应用实例
const app = getApp()
const db = wx.cloud.database()
var postlen = 0
Page({
  data: {

    have_discover: 'no',
    have_index: 'no'
  },
  onShareAppMessage: function (ops) {
    return {
      title: '东大Helper',
      path: '/pages/index',
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
  },

  //事件处理函数
  onTap1: function () {

  },
  onTap2: function () {
    wx.navigateTo({
      url: '../notice/notice',
    })
  },
  onTap3: function () {
    wx.showToast({
      title: '此功能正在内测',
      icon: 'none'
    })
  },
  onTap4: function () {
    wx.redirectTo({
      url: '../repair/repair',
    })
  },
  onShow: function () {
    wx.showTabBar({

    })
  },
  onLoad: function (e) {
    let c = wx.getStorageSync('user').certification;
    if (app.globalData.better == 1 && c == 'yes') {
      db.collection('todo').doc('1d90dcdc-4f0b-4bb3-9df7-52b5a0c6db16').get({
        success: p => {
          console.log(p)
          this.setData({
            iconList: p.data.iconList,
            certification: 1
          })
        }
      })
    } else {
      db.collection('todo').doc('1d90dcdc-4f0b-4bb3-9df7-52b5a0c6db16').get({
        success: p => {
          console.log(p)
          this.setData({
            iconList: p.data.iconList,
            certification: 1
          })
        }
      })
    }
    wx.stopPullDownRefresh()
  },
  onNoticeTap: function (event) {
    console.log(event.currentTarget.dataset.notice)
    wx.navigateTo({
      url: '../notice/notice-detail/notice-detail?notice=' + JSON.stringify(event.currentTarget.dataset.notice),
    })
  },
  onDiscoverTap: function (event) {
    console.log(event.currentTarget.dataset.post)
    wx.navigateTo({
      url: '../lostAndFound/detail/detail?post=' + JSON.stringify(event.currentTarget.dataset.post),
    })
  },
  onActivityTap: function (e) {
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },
  hideModal1(e) {
    this.setData({
      modalName: null
    })

  },
  hideModal2: function (e) {
    wx.setClipboardData({
      data: '978381571',
      success: (res => {
        wx.getClipboardData({
          success: (res => {
            this.setData({
              modalName: null
            })
            wx.showToast({
              title: '复制成功',
              duration: 2000
            })
            console.log(res.data) // data
          })
        })
      })
    })
  },
  hideModal: function (e) {
    this.setData({
      modalName: null
    })
  },
  hideModal21: function (e) {
    wx.navigateTo({
      url: '/pages/certifying/certifying',
    })
    this.setData({
      modalName: null
    })
  },
  hideModal22: function (e) {
    this.setData({
      modalName: null
    })
  },
  pickbus: function (e) {
    var c = wx.getStorageSync('user').certification;
    if (c != 'yes') {
      wx.showToast({
        title: '仅对已认证用户开放',
        icon: 'none'
      })
    } else {
      wx.showLoading({
        title: '加载中',
      })
      db.collection('user').doc(wx.getStorageSync('user')._id).get().then(res => {
        if (res.data.certification == 'yes') {
          wx.hideLoading()
          wx.navigateTo({
            url: e + '?ct=' + res.data.certification,
          })
        } else {
          wx.hideLoading()
          wx.showToast({
            title: '状态异常请重试',
            icon: 'none'
          })
        }
      }).catch(err => {
        // handle error
      })
    }
  },
  doing: function (e) {
    wx.showToast({
      title: '此功能尚未开放',
      icon: "none"
    })
    /* wx.navigateTo({
      url: '../process/process'
    })  */
  },
  help: function (e) {
    wx.navigateTo({
      url: '../help/help',
    })
  },
  more: function (e) {
    wx.navigateTo({
      url: '../more/more',
    })
  },
  history: function (e) {
    wx.navigateTo({
      url: '../history/history',
    })
  },
  setting: function (e) {
    wx.navigateTo({
      url: '../setting/setting',
    })
  },
  onContactus: function (e) {
    wx.showModal({
      title: '联系我们',
      content: '欢迎加入东大Helper学习交流群,群聊号码：978381571',
      showCancel: false,
      confirmColor: '#4d4bec',
      success(res) {
        if (res.confirm) {
          // console.log('用户点击确定')
          wx.setClipboardData({
            data: '978381571',
            success(res) {
              wx.getClipboardData({
                success(res) {
                  wx.showToast({
                    title: '复制成功',
                    duration: 2000
                  })
                  console.log(res.data) // data
                }
              })
            }
          })
        }
      }
    })
  },
  pick: function (e) {
    console.log(e)
    var p = this.data.iconList[e.currentTarget.dataset.id];
    if (p.value == 'bus') {
      this.pickbus(p.url)
    } else {
      wx.navigateTo({
        url: p.url,
      })
    }
  }
})
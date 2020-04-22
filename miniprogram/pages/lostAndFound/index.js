// miniprogram/pages/lostAndFound/index.js
const db = wx.cloud.database();
const app = getApp();
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    iconList: [{
      icon: 'command',
      color: 'blue',
      badge: 0,
      name: '失物招领',
      value: 'ask',
      url: '../lostAndFound/lostAndFound'
    },
    {
      icon: 'addressbook',
      color: 'blue',
      badge: 0,
      name: '电话簿',
      value: 'book',
      url: '../more/school_phone/school_phone'
    }, {
      icon: 'taxi',
      color: 'blue',
      badge: 0,
      name: '出行组队',
      value: 'bus',
      url: '../carpool/carpool'
    }, {
      icon: 'form',
      color: 'blue',
      badge: 0,
      name: '校历校车',
      value: 'calendar',
      url: '../more/school_calendar/school_calendar'
    }, {
      icon: 'keyboard',
      color: 'blue',
      badge: 0,
      name: '计算器',
      value: 'keyboard',
      url: '../count/count'
    }, {
      icon: 'comment',
      color: 'blue',
      badge: 0,
      name: '系统通知',
      value: 'comment',
      url: '../message/message'
    }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) { },

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

  onShareAppMessage: function (ops) {
    return {
      title: '校园智多星',
      path: '/pages/lostAndFound/index',
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
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  //跳转搜索结果页面
  onSearch: function (e) {
    console.log(e)
    this.setData({
      trysearch: null
    })
    if (e.detail.value) {
      wx.navigateTo({
        url: '../search/search?searchtext=' + e.detail.value
      })
    } else {
      wx.showToast({
        title: '没有搜索目标',
      })
    }

  },
  trySearch: function () {
    this.setData({
      trysearch: 1
    })
  },
  intputSearch: function (e) {
    this.tip(e.detail.value)
    this.setData({
      inputsearchtext: e.detail.value
    })
  },
  tip: function (e) { //智能提词
    // console.log(e)
    let key = e;
    // console.log(key)
    let list = util.searchList;
    // console.log(list)
    for (let i = 0; i < list.length; i++) {
      let a = key;
      let b = list[i].name;
      if (b.search(a) != -1) {
        list[i].isShow = true
      } else {
        list[i].isShow = false
      }
    }
    this.setData({
      searchList: list
    })
  },
  onClearsearch: function () {
    this.setData({
      inputsearchtext: null
    })
  },
  cancelSearch: function (e) {
    this.setData({
      trysearch: null
    })
  },
  onSearchTip: function (e) {
    console.log(e.currentTarget.dataset.name)
    this.setData({
      trysearch: null
    })
    wx.navigateTo({
      url: '../search/search?searchtext=' + e.currentTarget.dataset.name
    })
  },
  onKeyboard: function (e) {
    console.log(e)
    if (e.detail.height == 0) {
      this.setData({
        trysearch: null
      })
    }
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
      content: '欢迎加入交流群,群聊号码：978381571',
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
    } else if (p.value == 'ask') {
      var c = wx.getStorageSync('user').certification;
      if (c != 'yes') {
        wx.showToast({
          title: '仅对已认证用户开放',
          icon: 'none'
        })
      } else {
        wx.navigateTo({
          url: p.url,
        })
      }
    } else {
      wx.navigateTo({
        url: p.url,
      })
    }
  }
})
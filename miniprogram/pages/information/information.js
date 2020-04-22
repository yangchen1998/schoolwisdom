// pages/information/information.js
//获取应用实例
const app = getApp()

Page({
  data: {
    iconList: [{
      icon: 'commandfill',
      color: 'purple',
      badge: 0,
      name: '问答',
      value: 'ask'
    }, {
      icon: 'cardboardfill',
      color: 'red',
      badge: 120,
      name: '校园导览',
      value: 'guide'
    },
    {
      icon: 'addressbook',
      color: 'cyan',
      badge: 0,
      name: '电话簿',
      value: 'book'
    }, {
      icon: 'taxi',
      color: 'blue',
      badge: 0,
      name: '校车',
      value: 'bus'
    }, {
      icon: 'form',
      color: 'purple',
      badge: 0,
      name: '校历',
      value: 'calendar'
    }, {
      icon: 'group_fill',
      color: 'mauve',
      badge: 0,
      name: '社团',
      value: 'group'
    }
    ],
    getInfo: 'yes'
  },
  //事件处理函数
  bindViewTap: function () { },
  onLoad: function () {
    if (!wx.getStorageSync('userInfo')) {
      this.setData({
        getInfo: 'no'
      })
    } else {
      this.setData({
        userInfo: wx.getStorageSync('userInfo'),
        user: wx.getStorageSync('user'),
        getInfo: 'yes'
      })
    }
    /*  wx.cloud.callFunction({
        name: 'login',
        complete: res => {
  /*         console.log('callFunction test result: ', res) 
          this.setData({
            openid: res.result.openid
          })
        }
      }) */
    wx.stopPullDownRefresh()
  },
  myinformation: function () {
    wx.navigateTo({
      url: 'myinformation/myinformation'
    })
  },
  onGetUserInfo(e) {
    console.log(e.detail.userInfo)
    success: {
      wx.setStorageSync('userInfo', e.detail.userInfo)
      this.setData({
        userInfo: wx.getStorageSync('userInfo'),
        user: wx.getStorageSync('user')
      })
      this.onLoad()
    }
    fail: {
      console.log('未授权')
    }
  },
  onGetUserInfo: function (e) {
    console.log(e.detail.userInfo)
    success: {
      wx.setStorageSync('userInfo', e.detail.userInfo)
      this.setData({
        userInfo: wx.getStorageSync('userInfo'),
        user: wx.getStorageSync('user')
      })
    }
    fail: {
      console.log('未授权')
    }
    this.onLoad()
  },

  onShow: function () {
    wx.showTabBar()
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
      content: '欢迎加入火石桥村职业技术学校,群聊号码：978381571',
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
  pickask: function (e) {
    wx.showToast({
      title: '此功能正在内测',
      icon: 'none'
    })
    console.log('点击了问答')
    wx.navigateTo({
      url: '../post/post',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  pickguide: function (e) {
    wx.showToast({
      title: '此功能正在内测',
      icon: 'none'
    })
    /* wx.navigateToMiniProgram({
      appId: 'wxfeee3b8285e9bb1d',
      path: 'pages/index/index',
      success(res) {
        console.log(res)
      } 
    })
   /*  wx.showModal({
      title: '校园导览',
      content: '本程序校园导览功能正在开发中，如有需要请前往学校发布的“东北大学校园导览”小程序',
    }) */
    console.log('点击了校园导览')
  },
  pickbook: function (e) {
    console.log('点击了电话簿')
    wx.navigateTo({
      url: '../more/school_phone/school_phone',
    })
  },
  pickbus: function (e) {
    wx.showToast({
      title: '此功能正在内测',
      icon: 'none'
    })
    console.log('点击了校车')
  },
  pickcalendar: function (e) {
    wx.showToast({
      title: '此功能正在内测',
      icon: 'none'
    })
    console.log('点击了校历')
  },
  pickgroup: function (e) {
    wx.showToast({
      title: '此功能正在内测',
      icon: 'none'
    })
    console.log('点击了社团')
  }
})
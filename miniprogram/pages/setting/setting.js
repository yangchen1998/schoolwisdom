// miniprogram/pages/setting/setting.js
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    chenge: 'no',
    navigationBarText: '设置'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var user = wx.getStorageSync('user');
    this.setData({
      avatar_switch: user.privacySetting[0],
      nickname_switch: user.privacySetting[1],
      calendar_switch: user.privacySetting[2],
      bus_switch: user.privacySetting[3],
      phone_switch: user.privacySetting[4],
      opentime_switch: user.privacySetting[5],
      notice_switch: user.privacySetting[6],
      activity_switch: user.privacySetting[7],
      logout: user.logout
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
    //如果有操作，则更新数据库信息
    var _user = wx.getStorageSync('user')
    if (this.data.change == 'yes') {
      /* console.log('有操作，数据库更新') */
      db.collection('user').doc(_user._id).update({
        data: {
          privacySetting: {
            0: this.data.avatar_switch,
            1: this.data.nickname_switch,
            2: this.data.calendar_switch,
            3: this.data.bus_switch,
            4: this.data.phone_switch,
            5: this.data.opentime_switch,
            6: this.data.notice_switch,
            7: this.data.activity_switch,
          }
        }
      })
    }
    //更新本地缓存
    _user.privacySetting[0] = this.data.avatar_switch;
    _user.privacySetting[1] = this.data.nickname_switch;
    _user.privacySetting[2] = this.data.calendar_switch;
    _user.privacySetting[3] = this.data.bus_switch;
    _user.privacySetting[4] = this.data.phone_switch;
    _user.privacySetting[5] = this.data.opentime_switch;
    _user.privacySetting[6] = this.data.notice_switch;
    _user.privacySetting[7] = this.data.activity_switch;
    _user.logout = this.data.logout;
    wx.setStorageSync('user', _user)
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
  switch_nickname: function (e) {
    if (this.data.nickname_switch == 'success') {
      this.setData({
        nickname_switch: 'clear',
        change: 'yes'
      })
    } else if (this.data.nickname_switch == 'clear') {
      this.setData({
        nickname_switch: 'success',
        change: 'yes'
      })
    }
  },
  switch_avatar: function (e) {
    if (this.data.avatar_switch == 'success') {
      this.setData({
        avatar_switch: 'clear',
        change: 'yes'
      })
    } else if (this.data.avatar_switch == 'clear') {
      this.setData({
        avatar_switch: 'success',
        change: 'yes'
      })
    }
  },
  switch_calendar: function (e) {
    if (this.data.calendar_switch == 'success') {
      this.setData({
        calendar_switch: 'clear',
        change: 'yes'
      })
    } else if (this.data.calentar_switch == 'clear') {
      this.setData({
        calentar_switch: 'success',
        change: 'yes'
      })
    }
  },
  switch_bus: function (e) {
    if (this.data.bus_switch == 'success') {
      this.setData({
        bus_switch: 'clear',
        change: 'yes'
      })
    } else if (this.data.bus_switch == 'clear') {
      this.setData({
        bus_switch: 'success',
        change: 'yes'
      })
    }
  },
  switch_phone: function (e) {
    if (this.data.phone_switch == 'success') {
      this.setData({
        phone_switch: 'clear',
        change: 'yes'
      })
    } else if (this.data.phone_switch == 'clear') {
      this.setData({
        phone_switch: 'success',
        change: 'yes'
      })
    }
  },
  switch_opentime: function (e) {
    if (this.data.opentime_switch == 'success') {
      this.setData({
        opentime_switch: 'clear',
        change: 'yes'
      })
    } else if (this.data.opentime_switch == 'clear') {
      this.setData({
        opentime_switch: 'success',
        change: 'yes'
      })
    }
  },
  switch_notice: function (e) {
    if (this.data.notice_switch == 'success') {
      this.setData({
        notice_switch: 'clear',
        change: 'yes'
      })
    } else if (this.data.notice_switch == 'clear') {
      this.setData({
        notice_switch: 'success',
        change: 'yes'
      })
    }
  },
  switch_activity: function (e) {
    if (this.data.activity_switch == 'success') {
      this.setData({
        activity_switch: 'clear',
        change: 'yes'
      })
    } else if (this.data.activity_switch == 'clear') {
      this.setData({
        activity_switch: 'success',
        change: 'yes'
      })
    }
  },
  clearstorage: function (e) {
    wx.showModal({
      title: '清空所有本地缓存',
      content: '此操作将影响您下次访问此程序的加载速度，请您慎重选择',
      confirmText: "确认",
      cancelText: "取消",
      success: (res => {
        if (res.confirm) {
          /*  console.log('用户点击确认') */

          wx.clearStorageSync()
          wx.hideToast()
          this.setData({
            clearStorage: 'yes'
          })
          if (this.data.clearStorage == 'yes') {
            console.log("操作成功")
            wx.showToast({
              title: '操作成功',
              icon: 'success',
              duration: 2000
            })
          }
        } else {
          /*    console.log('用户点击取消') */
        }
      })
    })
  },
  logout: function (e) {
    wx.showModal({
      title: '警告',
      content: '注销账户将会情况包括认证状态在内所有信息，注销操作将在24h后完成，如若申请取消请联系管理员。注销成功后现已开启的功能也将不再可用。请您慎重操作！',
      cancelText: '取消',
      cancelColor: '#000000',
      confirmText: '注销',
      confirmColor: '#f30000',
      success: (res => {
        if (res.confirm) {
          console.log('用户点击确定')
          this.setData({
            logout: 'logouting'
          })
          var user = wx.getStorageSync('user')
          /* user.logout = 'logouting'
          wx.setStorageSync('user', user)  */
          db.collection('user').doc(user._id).update({
            data: {
              logout: 'logouting'
            }
          })
          wx.showToast({
            title: '已提交',
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      })
    })
  },
  backlogout: function (e) {
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
  onBackPage: function (e) {
    wx.navigateBack({
      delta: 1
    })
  },
  clearCarpool: function (e) {
    wx.removeStorage({
      key: 'carpool',
      success(res) {
        wx.showToast({
          title: '清除成功',
        })
      }
    })
  }
})
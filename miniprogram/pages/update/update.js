// pages/update/update.js
//获取应用实例
const app = getApp()

Page({
  data: {
    winH: app.globalData.screenHeight - app.globalData.CustomBar,
    winW: app.globalData.windowWidth
  },
  //事件处理函数
  bindViewTap: function () { },
  onLoad: function () {

    // 获取用户信息
    var user = wx.getStorageSync('user')
    this.setData({
      name: user.name,
      student_id: user.student_id,
      campus: user.campus,
      college: user.college,
      major: user.major,
      phone: user.phone,
      email: user.email,
      dormitory: user.dormitory,
      roomnum: user.roomnum
    })
  },

  bindnameInput(e) {
    this.setData({
      name: e.detail.value
    })
  },
  bindstudent_idInput(e) {
    this.setData({
      student_id: e.detail.value
    })
  },
  bindcampusInput(e) {
    this.setData({
      campus: e.detail.value
    })
  },
  bindphoneInput(e) {
    this.setData({
      phone: e.detail.value
    })
  },
  bindemailInput(e) {
    this.setData({
      email: e.detail.value
    })
  },
  binddormitoryInput(e) {
    this.setData({
      dormitory: e.detail.value
    })
  },
  bindroomnumInput(e) {
    this.setData({
      roomnum: e.detail.value
    })
  },
  onReset: function (e) {
    wx.navigateBack({
      delta: 1
    })
  },
  onSubmit: function (e) {
    var user = wx.getStorageSync('user');
    user.name = this.data.name;
    user.student_id = this.data.student_id;
    user.campus = this.data.campus;
    user.college = this.data.college;
    user.major = this.data.major;
    user.phone = this.data.phone;
    user.email = this.data.email;
    user.dormitory = this.data.dormitory;
    user.roomnum = this.data.roomnum;
    wx.setStorageSync('user', user)
    const db = wx.cloud.database()
    db.collection('user').doc(user._id).update({
      data: {
        phone: user.phone,
        email: user.email,
        dormitory: user.dormitory,
        roomnum: user.roomnum,
        campus: user.campus
      },
      success: res => {
        this.reL(res)
      },
      fail: console.error
    })

  },
  reL: function (e) {
    wx.showToast({
      title: '修改成功',
    })
    console.log(e)
    this.onBackPage()
  },
  onBackPage: function (e) {
    if (getCurrentPages().length == 1) {
      wx.reLaunch({
        url: '../myinformation/myinformation',
      })
    } else {
      wx.navigateBack({
        delta: 1
      })
    }
  }
})
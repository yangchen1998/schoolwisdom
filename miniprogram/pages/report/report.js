// miniprogram/pages/report/report.js
var util = require('../../utils/util.js')
var db = wx.cloud.database()
var mold = 0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navigationBarText: '举报'
  },
  onBackPage: function () {
    wx.navigateBack({
      delta: 1
    })
  }
  ,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    var repts = wx.getStorageSync('repts');
    var date = util.formatDate(new Date());
    var time = util.formatTime(new Date());
    mold = e.mold;
    if (!repts) {
      repts = new Object
      repts.date = date
      repts.times = 0
    } else {
      if (repts.date != date) {
        repts.date = date
        repts.times = 0
      }
    }
    this.setData({
      postid: e.id,
      time: time,
      date: date,
      repts: repts
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

  },

  /**
   * 用户点击右上角分享
   */
  formSubmit: function (e) {
    if (!e.detail.value.reason) {
      wx.showToast({
        title: '请填写举报原因',
        icon: 'none'
      })
    } else {
      wx.showLoading({
        title: '提交中',
      })
      var user = wx.getStorageSync('user')
      if (!user.report) {
        user.report = new Array
      }
      // console.log(user.report[0])
      // console.log(user.report[1])
      // console.log(user.report[2])
      //  console.log(user.report[3])
      if (user.report[0] == this.data.postid || user.report[1] == this.data.postid || user.report[2] == this.data.postid || user.report[3] == this.data.postid) {
        //  console.log(this.data.postid)
        //   console.log(user.report[0])
        //   console.log(user.report[1])
        //   console.log(user.report[2])
        //   console.log(user.report[3])
        wx.showToast({
          title: '请勿重复举报',
        })
      } else if (this.data.repts.times == 4) {
        wx.showToast({
          title: '举报次数过多',
          icon: 'none'
        })
      } else {
        user.report[3] = user.report[2]
        user.report[2] = user.report[1]
        user.report[1] = user.report[0]
        user.report[0] = this.data.postid
        //     console.log(user.report)
        db.collection('report').add({
          data: {
            name: user.name,
            postid: this.data.postid,
            time: this.data.time,
            reason: e.detail.value.reason,
            formId: e.detail.formId,
            status: 'doing',
            mold: mold
          },
          success: (res => {
            // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
            // console.log(user)
            wx.setStorageSync('user', user)
            this.data.repts.times++
            wx.setStorageSync('repts', {
              date: this.data.date,
              times: this.data.repts.times
            })
            //   console.log(user)
            db.collection('user').doc(user._id).update({
              data: {
                // 表示将 done 字段置为 true
                report: user.report
              },
              success: (re => {
                wx.hideLoading()
                wx.showToast({
                  title: '提交成功',
                  success: (r => {
                    wx.navigateBack({
                      delta: 1
                    })
                  })
                })
              }),
              fail: console.error
            })

            // console.log(res)
          }),
          fail: console.error
        })
      }

    }

    //  console.log(e)
    //  console.log(e.detail.formId)
  },
})
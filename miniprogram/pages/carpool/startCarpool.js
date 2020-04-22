// miniprogram/pages/carpool/startCarpool.js
const db = wx.cloud.database()
const _ = db.command
var mydata = new Object();
var util = require('../../utils/util.js')
var origin = '';
var destination = '';
var phone = '';
var people_nums = '';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    time: util.formatHour(new Date),
    date: util.formatDate(new Date),
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '正在加载',
    })
    var user = wx.getStorageSync('user');
    if (user.certification == 'yes') {
      this.loading(user);
    } else {
      wx.hideLoading();
      wx.showToast({
        title: '状态异常请稍后重试',
      })
      wx.redirectTo({
        url: '../lostAndFound/lostAndFound',
      })
    }
  },
  loading: function (e) {
    if (e.certification == 'yes') {
      var information = wx.getStorageSync('information');
      if (information) {
        this.setData({
          name: information.name,
          student_id: information.student_id,
          campus: information.campus,
          major: information.major,
          sex: information.sex,
        })
        wx.hideLoading()
      } else {
        this.setData({
          name: e.name,
          student_id: e.student_id,
          campus: e.campus,
          major: e.major,
          showInfo: 1,
        })
        wx.setStorageSync('information', {
          name: e.name,
          student_id: e.student_id,
          campus: e.campus,
          major: e.major
        })
        wx.hideLoading()
        wx.showToast({
          title: '首次使用请完善信息',
          icon: 'none'
        })
      }
      if (!e.bad_record) {
        this.setData({
          bad_record: ''
        })
      } else {
        this.setData({
          bad_record: e.bad_record
        })
      }
    } else {
      wx.hideLoading();
      wx.showToast({
        title: '状态异常请稍后重试',
      })
      wx.redirectTo({
        url: '../lostAndFound/lostAndFound',
      })
    }
    this.setData({
      fullyinfo: 1
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
  onPullDownRefresh: function () {
    wx.showToast({
      title: '此页面无法刷新',
      icon: 'none'
    })
  },
  formSubmit: function (e) {
    console.log(e)
    this.checkform(e);
    if (!this.data.check) {
      wx.showToast({
        title: '请补全信息',
        icon: 'none'
      })
    } else {
      wx.showLoading({
        title: '正在发起拼车',
      })
      mydata = {
        creator: {
          name: this.data.name,
          student_id: this.data.student_id,
          campus: this.data.campus,
          major: this.data.major,
          sex: this.data.sex,
          bad_record: this.data.bad_record,
          formId: e.detail.formId
        },
        origin: e.detail.value.input_origin,
        destination: e.detail.value.input_destination,
        date: e.detail.value.input_date,
        time: e.detail.value.input_time,
        phone: e.detail.value.input_phone,
        people_nums: this.data.people_nums,
        notes: e.detail.value.input_notes,
        now_nums: 0,
        status: 'doing',
        tag_campus: 0,
        tag_date: 0,
        tag_origin: 0,
        tag_destination: 0,
        viewers: 0,
        sharing: [],
      }
      db.collection('carpool').add({
        data: mydata,
        success: res => {
          console.log(res)
          wx.setStorageSync('carpool', res._id)
          wx.hideLoading()
          wx.showToast({
            title: '发起成功',
          })
          mydata._id = res._id;
          this.setHistory(mydata);
          console.log(mydata)
          this.sendMassege(mydata);
        },
        fail: function () {
          wx.hideLoading()
          wx.hideLoading()
          wx.showToast({
            title: '系统错误请重试',
            icon: 'none'
          })
          wx.reLaunch({
            url: '../lostAndFound/lostAndFound',
          })
        }
      })
    }
  },
  sendMassege: function (e) {
    e.entrance = 'start'
    console.log(e)
    wx.cloud.callFunction({
      // 要调用的云函数名称
      name: 'carpool',
      // 传递给云函数的event参数
      data: e
    }).then(res => {
      // 返回结果
      console.log(res)

    }).catch(err => {
      // handle error
      console.error
    })
  },
  formReset: function () {
    wx.navigateBack({
      delta: 1
    })
  },
  onBackPage: function (e) {
    //  console.log(getCurrentPages())
    if (getCurrentPages().length == 1) {
      wx.reLaunch({
        url: '../lostAndFound/lostAndFound',
      })
    } else {
      wx.navigateBack({
        delta: 1
      })
    }
  },
  TimeChange(e) {
    this.setData({
      time: e.detail.value
    })
  },
  DateChange(e) {
    this.setData({
      date: e.detail.value
    })
  },
  chooseNum: function (e) {
    this.setData({
      chooseNum: 1
    })
    //  console.log(e)
  },
  hideNum: function (e) {
    this.setData({
      chooseNum: null
    })
  },
  numbers: function (e) {
    //  console.log(e)
    this.setData({
      people_nums: e.detail.value
    })
    this.hideNum()
  },
  chooseSex: function (e) {
    this.setData({
      sex: e.detail.value
    })
    console.log(e)
    var information = wx.getStorageSync('information')
    information.sex = e.detail.value
    wx.setStorageSync('information', information)
  },
  showInfo: function (e) {
    if (this.data.showInfo == 1) {
      this.setData({
        showInfo: null
      })
    } else {
      this.setData({
        showInfo: 1
      })
    }
  },
  inputOrigin: function (e) {
    origin = e.detail.value
  },
  inputDestination: function (e) {
    destination = e.detail.value;
    console.log(destination)
  },
  textareaInput: function (e) {
    if (e.detail.value != '') {
      this.checkform(e);
    }
  },
  checkform: function (e) {
    if (e.detail.value != '') {
      var that = this.data;
      if (!that.name || !that.student_id || !that.campus || !that.major || !that.sex) {
        console.log('这个')
        this.setData({
          check: null
        })
      } else {
        console.log(this.data.check)
        this.checkdetail()
      }
    } else {
      this.setData({
        check: null
      })
    }
  },
  checkdetail: function () {

    if (!origin || !destination || !this.data.people_nums) {
      console.log(this.data.check)
      this.setData({
        check: null
      })
    } else {
      console.log(this.data.check)
      this.setData({
        check: 1
      })
    }
  },
  setHistory: function (mydata) {
    console.log(mydata)
    var user = wx.getStorageSync('user');
    var add = {
      _id: mydata._id,
      time: util.formatTime(new Date()),
      type: '发起拼车',
      status: 'doing'
    }
    user.history.push(add)
    wx.setStorageSync('user', user)
    db.collection('user').doc(user._id).update({
      // data 传入需要局部更新的数据
      data: {
        // 表示将 done 字段置为 true
        history: _.push(add)
      },
      success: (rr => {
        wx.navigateTo({
          url: 'carpoolDetail?detail=' + JSON.stringify(mydata),
        })
      }),
      fail: console.error
    })
  }
})
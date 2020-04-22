// miniprogram/pages/carpool/carpoolDetail.js
const db = wx.cloud.database()
const _ = db.command
var carpool = new Object();
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    this.check()
    this.setData({
      carpool: JSON.parse(e.detail)
    })
    this.validity(JSON.parse(e.detail))
    this.countDate()
  },
  check: function (e) {
    //检查身份的合法性--本地验证就行了
    //未认证则不显示内容
    if (wx.getStorageSync('user').certification != 'yes') {
      wx.showToast({
        title: '您的身份签证错误',
        icon: 'none'
      })
      wx.redirectTo({
        url: '../lostAndFound/lostAndFound',
      })
    }
  },
  validity: function (e) {
    //检查信息的有效性
    var _validity = this.checkValidity(e);
    if (_validity == 'yes') {
      this.setData({
        end: null
      })
    } else {
      wx.showToast({
        title: '此条信息已过期',
        icon: 'none'
      })
      this.setData({
        end: 1
      })
    }
  },
  checkValidity: function (e) {
    var validity = '';
    var checktime = this.checkTime(e)
    // console.log(checktime)
    if (e.status == 'doing' && e.sharing.length + 1 < e.people_nums && checktime == 'ok') {
      validity = 'yes';
      //   console.log('有效')
    } else {
      validity = 'no'
    }
    // console.log(validity)
    return validity
  },
  checkTime: function (e) {
    var tag = '';
    var date = util.formatDate(new Date);
    var time = util.formatHour(new Date);
    // console.log(e.time.replace(":", ""))
    //console.log(parseInt(e.time.replace(":", "")))
    if (Date.parse(e.date) < Date.parse(date)) { //转换成时间戳比较大小
      tag = 'no';
      // console.log('日期比较')
    } else if (Date.parse(e.date) == Date.parse(date)) { //日期相同时比较时间
      if (parseInt(e.time.replace(":", "")) <= parseInt(time.replace(":", ""))) { //先将字符串中的符号去掉再转换成数值比较大小
        //   console.log('时间比较')
        tag = 'no'
      } else { //在日期相同的情况下，设置时间大于当前时间
        tag = 'ok'
      }
    } else { //设置日期大于当前日期则证明仍有效
      tag = 'ok'
    }
    // console.log(tag)
    return tag
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
    wx.stopPullDownRefresh()
    wx.showToast({
      title: '无法刷新当前页面',
      icon: 'none'
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

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
  //带天数的倒计时
  /*  countDown: function(times) {
     var timer = null;
     timer = setInterval(function() {
       var day = 0,
         hour = 0,
         minute = 0,
         second = 0; //时间默认值
       if (times > 0) {
         day = Math.floor(times / (60 * 60 * 24));
         hour = Math.floor(times / (60 * 60)) - (day * 24);
         minute = Math.floor(times / 60) - (day * 24 * 60) - (hour * 60);
         second = Math.floor(times) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
       }
       if (day <= 9) day = '0' + day;
       if (hour <= 9) hour = '0' + hour;
       if (minute <= 9) minute = '0' + minute;
       if (second <= 9) second = '0' + second;
       //
       console.log(day + "天:" + hour + "小时：" + minute + "分钟：" + second + "秒");
       times--;
     }, 1000);
     if (times <= 0) {
       clearInterval(timer);
     }
   } */
  countDate: function (e) {
    this.setData({
      valtime: this.dateDiff(this.data.carpool.date, util.formatDate(new Date()))
    })
  },
  dateDiff: function (sDate1, sDate2) { //sDate1和sDate2是xxxx-xx-xx格式
    var aDate, oDate1, oDate2, iDays
    aDate = sDate1.split("-")
    oDate1 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0])   //转换为xx-xx-xxxx格式  
    aDate = sDate2.split("-")
    oDate2 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0])
    iDays = parseInt(/*Math.abs*/(oDate1 - oDate2) / 1000 / 60 / 60 / 24)   //把相差的毫秒数转换为天数  
    return iDays
  },
  onBadrecord: function (e) {
    console.log(e);
    wx.showToast({
      title: '暂不支持查看',
      icon: 'none'
    })
  },
  onAdd: function (e) {
    this.setData({
      loading: 1
    })
    //console.log(e)
    var id = wx.getStorageSync('carpool')
    if (id == this.data.carpool._id) {
      wx.showToast({
        title: '请勿重复加入',
        icon: 'none'
      })
      this.setData({
        end: 1,
        loading: null
      })
    } else {
      db.collection('carpool').doc(this.data.carpool._id).get({
        success: res => {
          console.log(res)
          if (res.data.sharing.length < res.data.people_nums) {
            var on_add = this.checkinformation();
            on_add.formId = e.detail.formId
            console.log(on_add)
            if (on_add.valitity == 'yes') {
              console.log('执行了addSharing')
              this.addSharing(on_add)
            } else {
              this.setData({
                loading: null
              })
              console.log('信息访问错误')
              wx.showToast({
                title: '身份信息错误无法加入',
                icon: 'none'
              })
            }
          } else {
            this.setData({
              loading: null,
              end: 1
            })
            wx.showToast({
              title: '人数已满',
              icon: 'none'
            })
          }
        }
      })
    }
  },
  checkinformation: function () {
    var c_infor = new Object();
    c_infor.valitity = '';
    var information = wx.getStorageSync('information');
    if (information) {
      c_infor = information;
      c_infor.valitity = 'yes';
    } else {
      var user = wx.getStorageSync('user');
      c_infor.name = user.name;
      c_infor.student_id = user.student_id;
      c_infor.campus = user.campus;
      c_infor.major = c_infor.major;
      c_infor.valitity = 'yes';
    }
    return c_infor;
  },
  addSharing: function (e) {
    carpool = this.data.carpool;
    carpool.information = e;
    this.sendMassege(carpool)
  },
  sendMassege: function (e) {
    e.entrance = 'add'
    console.log(e)
    wx.cloud.callFunction({
      // 要调用的云函数名称
      name: 'carpool',
      // 传递给云函数的event参数
      data: e
    }).then(res => {
      // 返回结果
      console.log(res)
      e.sharing.push(e.information)
      wx.setStorage({
        key: 'carpool',
        data: this.data.carpool._id,
        success: res => {
          this.setHistory()
        }
      })
      this.setData({
        carpool: e,
        loading: null
      })
      wx.showToast({
        title: '加入成功',
      })
    }).catch(err => {
      // handle error
      console.error
    })
  },
  onPhone: function (e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone
    })
  },
  setHistory: function (mydata) {
    var user = wx.getStorageSync('user');
    var add = {
      _id: this.data.carpool._id,
      time: util.formatTime(new Date()),
      type: '加入拼车',
      status: 'doing'
    }
    user.history.push(add)
    wx.setStorageSync('user', user)
    db.collection('user').doc(user._id).update({
      data: {
        history: _.push(add)
      },
      success: (rr => {
        console.log('成功')
        /* this.setData({
          carpool: carpool
        }) */
      }),
      fail: console.error
    })
  }
})
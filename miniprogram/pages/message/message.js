// pages/message/message.js
const db = wx.cloud.database();
var administrator = '';
var password = '';
var repair = '';
var report = '';
var certifying = '';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    read: 'not_read',
    tabs: ['消息', '认证', '反馈', '举报'],
    activeIndex: 0,
  },
  onMassege: function (e) {
    var message = this.data.message
    var id = e.currentTarget.dataset.id
    console.log(e.currentTarget.dataset.id)
    if (message[id].class1 == '通知') {
      wx.navigateTo({
        url: '../notice/notice-detail/notice-detail?notice=' + JSON.stringify(message[id])
      })
    } else {
      wx.navigateTo({
        url: '../lostAndFound/detail/detail?post=' + JSON.stringify(message[id])
      })
    }

  },
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
    // console.log(e.currentTarget.id)
    //下面的代码要优化，改成先从缓存读取，判断是否要加载。在没退出这个页面之前就不要再加载了，刷新的时候再更新数据库的信息
    if (e.currentTarget.id == 1) {
      wx.showLoading({
        title: '加载中',
      })
      db.collection('post_certification').where({
        status: 'doing'
      }).orderBy('date', 'asc').get().then(res => {
        wx.hideLoading()
        if (res.data.length == 0) {
          wx.showToast({
            title: '暂时没有新消息',
            icon: 'none'
          })
        } else {
          this.setData({
            certifying: res.data,
          })
        }

      })
    }
    if (e.currentTarget.id == 3) {
      wx.showLoading({
        title: '加载中',
      })

    }
    if (e.currentTarget.id == 2) {
      wx.showLoading({
        title: '加载中',
      })
      db.collection('post_repair').where({
        status: 'doing'
      }).orderBy('date', 'asc').get().then(res => {
        wx.hideLoading()
        if (res.data.length == 0) {
          wx.showToast({
            title: '暂时没有新消息',
            icon: 'none'
          })
        } else {
          this.setData({
            repair: res.data,
          })
        }

      })
    }

  },
  /* 生命周期函数--监听页面加载
   */
  onLoad: function () {
    wx.showLoading({
      title: '加载中',
    })
    var user = wx.getStorageSync('user')
    this.checkidentity(user.identity)
    this.setData({
      user: user
    })
    if (user.certification != 'yes') {
      this.setData({
        modalName: 'Image'
      })
    } else {
      //  console.log(delete1)
      const db = wx.cloud.database()
      const _ = db.command
      db.collection('post').where(_.or([{
        scope1: '全部'
      },
      {
        scope2: user.campus
      },
      {
        scope3: user.dormitory
      },
      {
        cardid: user.student_id,
        state: '0'
      }
      ])).orderBy('time', 'desc').limit(20).get({
        success: (r => {
          this.choosemessage(r.data)
        }),
        fail: function (res) { },
        complete: function (res) { }
      })
    }
    wx.showTabBar({})
    wx.hideLoading()
    wx.stopPullDownRefresh()
  },
  checkidentity: function (e) {
    if (e == 'administrator') {
      // console.log('执行了')
      wx.cloud.callFunction({
        name: 'login',
        data: {
          name: 'checkidentity'
        }
      }).then(res => {
        console.log(res.result)
        repair = res.result.repair;
        report = res.result.report;
        certifying = res.result.certifying;
      }).catch(err => {
        // handle error
      })
    } else {
      //console.log('没有执行')
    }
    /*  db.collection('user').where({
       _openid: wx.getStorageSync('user')._openid
     }).orderBy('date', 'asc').limit(100).get({}).then(
       res => {
         console.log(res.data[0].identity)
         if (res.data[0].identity == 'administrator') {
           db.collection('post_repair').where({
             status: 'doing'
           }).orderBy('date', 'asc').get().then(p1 => {
             console.log(p1.data)
             if (p1.data.length != 0) {
               const repair = p1.data
               this.setData({
                 repair: repair,
               })
             }
           })
           db.collection('post_certification').where({
             status: 'doing'
           }).orderBy('date', 'asc').get().then(p2 => {
             console.log(p2.data)
             if (p2.data.length != 0) {
               const certifying = p2.data
               this.setData({
                 certifying: certifying,
               })
             }
           })
           db.collection('report').where({
             status: 'doing'
           }).orderBy('date', 'asc').get().then(p3 => {
             console.log(p3.data)
             if (p3.data.length != 0) {
               const report = p3.data
               this.setData({
                 report: report,
               })
             }
           })
         } else {
           console.log("不是管理员")
         }
       }) */
  },
  choosemessage: function (e) {
    var delete1 = wx.getStorageSync('demessage');
    var p1 = 20;
    var p2 = 20;
    var i = 0;
    var t = 0;
    var newmessage = e;
    //  console.log(e)
    p1 = e.length
    //console.log(p1)
    let arr = e
    for (let i = 0, len = arr.length; i < len; i++) {
      // console.log(i)
      for (let j = 0, len2 = delete1.length; j < len2; j++) {
        //   console.log(j)
        if (arr[i]._id == delete1[j]) {
          arr.splice(i, 1);
          delete1.splice(j, 1)
          i--;
          len--;
          j--;
          len2--;
          //  console.log(arr)
        }
      }
    }
    //  console.log(arr)
    this.setData({
      message: arr
    })
    if (arr.length == 0) {
      wx.showToast({
        title: '您没有新消息',
        icon: 'none',
        duration: 3000
      })
    }
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

    /*  wx.setStorageSync('post', res.data) */

  },
  hideModal1(e) {
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
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  certifying: function (e) {
    wx.navigateTo({
      url: '../certifying/certifying',
    })
  },
  onTapreportview: function (e) {
    //   console.log(e.currentTarget.dataset.reportview)
    wx.navigateTo({
      url: '../lostAndFound/detail/detail?report_id=' + e.currentTarget.dataset.reportview.postid
    })
  },
  onTapcertifyview: function (e) {
    console.log(e.currentTarget.dataset.certifyview)
  },
  onTapcertifyfail: function (e) {
    wx.showLoading({
      title: '处理中',
    })
    //  console.log(e.currentTarget.dataset.certifyfail)
    //  console.log(e.currentTarget.dataset.id)

    wx.cloud.callFunction({
      // 要调用的云函数名称
      name: 'certify',
      // 传递给云函数的event参数
      data: {
        _openid: this.data.certifying[e.currentTarget.dataset.id]._openid,
        _id: this.data.certifying[e.currentTarget.dataset.id]._id,
        action: 'no',
      }
    }).then(res => {
      // 返回结果
      console.log(res.result)
    }).catch(err => {
      // handle error
    })
    //console.log(certifying)
    wx.cloud.callFunction({
      // 要调用的云函数名称
      name: 'identity',
      // 传递给云函数的event参数
      data: {
        _openid: this.data.certifying[e.currentTarget.dataset.id]._openid,
        action: 'no',
      }
    }).then(res => {
      wx.hideLoading()
      // 返回结果
      console.log(res.result)
      var certifying = this.data.certifying;
      // console.log(certifying)
      certifying.splice(e.currentTarget.dataset.id, 1);
      //  console.log(certifying)
      this.setData({
        certifying: certifying
      })
    }).catch(err => {
      // handle error
    })
  },
  onTapcertifypass: function (e) {
    wx.showLoading({
      title: '处理中',
    })
    //  console.log(e.currentTarget.dataset.certifypass)
    //   console.log(e.currentTarget.dataset.id)
    wx.cloud.callFunction({
      // 要调用的云函数名称
      name: 'template',
      // 传递给云函数的event参数
      data: {
        _openid: this.data.certifying[e.currentTarget.dataset.id]._openid,
        name: this.data.certifying[e.currentTarget.dataset.id].name,
        student_id: this.data.certifying[e.currentTarget.dataset.id].student_id,
        action: '认证通过',
        formId: this.data.certifying[e.currentTarget.dataset.id].formId
      }
    }).then(res => {
      wx.hideLoading()
      // 返回结果
      console.log(res)

    }).catch(err => {
      // handle error
      console.error
    })

    wx.cloud.callFunction({
      // 要调用的云函数名称
      name: 'certify',
      // 传递给云函数的event参数
      data: {
        _openid: this.data.certifying[e.currentTarget.dataset.id]._openid,
        _id: this.data.certifying[e.currentTarget.dataset.id]._id,
        action: 'yes',
      }
    }).then(res => {
      // 返回结果
      console.log(res.result)
      var certifying = this.data.certifying;
      // console.log(certifying)
      certifying.splice(e.currentTarget.dataset.id, 1);
      //  console.log(certifying)
      this.setData({
        certifying: certifying
      })
    }).catch(err => {
      // handle error
    })

  },
  ViewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.dataset.path, // 当前显示图片的http链接
      urls: [e.currentTarget.dataset.path] // 需要预览的图片http链接列表
    })
  },
  // ListTouch触摸开始
  ListTouchStart(e) {
    this.setData({
      ListTouchStart: e.touches[0].pageX
    })
  },

  // ListTouch计算方向
  ListTouchMove(e) {
    this.setData({
      ListTouchDirection: e.touches[0].pageX - this.data.ListTouchStart > 0 ? 'right' : 'left'
    })
  },

  // ListTouch计算滚动
  ListTouchEnd(e) {
    if (this.data.ListTouchDirection == 'left') {
      this.setData({
        modalName: e.currentTarget.dataset.target
      })
    } else {
      this.setData({
        modalName: null
      })
    }
    this.setData({
      ListTouchDirection: null
    })
  },
  moreNotice: function (e) {
    wx.navigateTo({
      url: '../notice/notice',
    })
  },
  onRemove: function (e) {
    var message = this.data.message;
    message.splice(e.currentTarget.dataset.id, 1)
    console.log(e.currentTarget.dataset.id);
    this.setData({
      message: message
    })
    // console.log(e.currentTarget.dataset.viewid);
    var delete1 = wx.getStorageSync('demessage');
    if (!delete1) {
      var newdelete1 = new Array();
      newdelete1[0] = e.currentTarget.dataset.viewid
      wx.setStorageSync('demessage', newdelete1)
    } else {
      delete1.unshift(e.currentTarget.dataset.viewid);
      if (delete1.length > 20) {
        delete1.pop()
      }
      wx.setStorageSync('demessage', delete1)
    }
    // console.log(delete1);

  },
  administrator: function (e) {
    //  console.log(e)
    administrator = e.detail.value;
  },
  password: function (e) {
    //   console.log(e)
    password = e.detail.value
  },
  log: function (e) {
    console.log(e)
    console.log(administrator)
    console.log(password)
    db.collection('my').get({
      success: r => {
        console.log(r.data)
        if (r.data[0].administrator == administrator && r.data[0].password == password) {
          if (administrator == 'NEUHelper') {
            this.setData({
              repair: repair,
              report: report,
              certifying: certifying,
              password: 1
            })
          } else {
            console.log('错误')
          }
        } else {
          console.log('错误')
        }
      }
    })

  },
  onBackPage: function (e) {
    wx.navigateBack({
      delta: 1,
      fail: function (e) {
        wx.reLaunch({
          url: '../lostAndFound/index',
        })
      }
    })
  }
})
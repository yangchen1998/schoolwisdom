// pages/lostAndFound/detail/detail.js
const db = wx.cloud.database();
var delta = 1;
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  onBackPage: function (e) {
    wx.navigateBack({
      delta: delta
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (p) {
    // console.log(p)
    var user = wx.getStorageSync('user')
    if (user.certification != 'yes') {
      this.setData({
        modalName: 'tip'
      })
    }
    if (p.post) {
      var post = JSON.parse(p.post);
      if (user._openid == post._openid || user.identity == 'administrator') {
        var delete1 = true
      } else {
        delete1 = false
      }
      /*       if (post.class1 == '寻物') {
              var moldname = '寻物启事'
            } else {
              moldname = '失物招领'
            } */
      this.setData({
        post: post,
        certification: user.certification,
        //       moldname: moldname,
        // mold: p.mold,
        delete1: 1
      });
    } else if (p.detail_id) {
      db.collection('post').doc(p.detail_id).get({
        success: (res => {
          //         console.log(res)
          this.setData({
            post: res.data,
            backto: 'index'
          })
        }),
        fail: function () {
          console.log('失败')
        }
      })
    } else if (p.release) {
      db.collection('post').doc(p.release).get({
        success: (res => {
          console.log(res)
          this.setData({
            post: res.data,
            backto: 'index'
          })
        }),
        fail: function () {
          console.log('失败')
        }
      })
    } else if (p.report_id) {
      db.collection('post').doc(p.report_id).get({
        success: (res => {
          console.log(res)
          this.setData({
            post: res.data,
            delete1: 1
          })
        }),
        fail: function () {
          console.log('失败')
        }
      })
    }
    /*  wx.showShareMenu({
       // 要求小程序返回分享目标信息
       withShareTicket: true
     }); */
    wx.stopPullDownRefresh()
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
  onShareAppMessage: function (ops) {
    return {
      title: '失物招领信息',
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
  reback: function () {
    if (this.data.backto == 'index') {
      wx.reLaunch({
        url: '/pages/lostAndFound/lostAndFound',
      })
    } else {
      wx.navigateBack({
        delta: 1
      })
    }

  },

  //
  onRemark: function () {
    this.setData({
      remarks: 0
    })
    wx.showToast({
      title: '暂未开放此功能',
      icon: 'none'
    })
  },
  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },
  /* hideModal(e) {
    this.setData({
      modalName: null
    })
  }, */
  onDelete: function (e) {
    var idty = wx.getStorageSync('user').identity
    if (this.data.post.class1 == '招领') {
      if (idty == 'user') {
        var mold = 'post_found'
      } else {
        mold = 'found'
      }
    } else {
      mold = 'post_lost'
    }
    db.collection(mold).doc(this.data.post._id).remove({
      success: (res => {
        wx.showToast({
          title: '删除成功',
          duration: 2000,
          success: (res => {
            wx.reLaunch({
              url: '/pages/lostAndFound/lostAndFound',
            })
          })
        })
      }),
      fail: (res => {
        wx.showToast({
          title: '操作失败',
          icon: 'none'
        })
        this.setData({
          modalName: null
        })
      })
    })
  },
  onReport: function (e) {
    var idty2 = wx.getStorageSync('user').identity
    if (this.data.post.class1 == '招领') {
      if (idty2 == 'user') {
        var mold2 = 'post_found'
      } else {
        mold2 = 'found'
      }
    } else {
      mold2 = 'post_lost'
    }

    this.setData({
      modalName: null
    })
    wx.navigateTo({
      url: '../../report/report?id=' + this.data.post._id + '&mold=' + mold2,
    })

  },
  onImage: function (e) {
    if (this.data.certification != 'yes') {
      wx.showToast({
        title: '您无权查看原图',
        icon: 'none'
      })
    } else {
      wx.previewImage({
        current: this.data.post.imgid[e.currentTarget.dataset.imgid],
        urls: this.data.post.imgid
      })
    }
  },
  onReclaim: function () {
    if (this.data.certification == 'yes') {
      wx.showModal({
        title: '联系方式',
        content: '请联系:' + this.data.post.contact,
        confirmText: '确认',
        cancelText: '取消',
        cancelColor: '#4169E1',
        success: (res => {
          if (res.confirm) {
            wx.makePhoneCall({
              phoneNumber: this.data.post.contact
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        })
      })
    } else {
      wx.showToast({
        title: '您无此操作权限',
        icon: 'none'
      })
    }

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
  onUser: function (e) {
    if (this.data.certification != 'yes') {
      wx.previewImage({
        current: 'cloud://neuhelper-1ol0o.6e65-neuhelper-1ol0o/NEU/自管会.jpg',
        urls: ['cloud://neuhelper-1ol0o.6e65-neuhelper-1ol0o/NEU/自管会.jpg', 'cloud://neuhelper-1ol0o.6e65-neuhelper-1ol0o/NEU/NEUHelper.png'],
      })
    } else {
      wx.previewImage({
        current: this.data.post.postimgid,
        urls: [this.data.post.postimgid],
      })
    }
  },
  remarksclose: function (e) {
    this.setData({
      remarks: 1
    })
  }
})
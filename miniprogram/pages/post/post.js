// miniprogram/pages/post/post.js
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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

    this.setData({
      modalName: 'Image'
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

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
  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    db.collection('post_certification').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        name: e.detail.value.input_name,
        student_id: e.detail.value.input_id,
        campus: e.detail.value.input_campus,
        college: e.detail.value.input_college,
        major: e.detail.value.input_major,
        email: e.detail.value.input_email,
        formId: e.detail.formId,
        path: this.data.path,
        status: 'doing'
      },
      success: (r1 => {

        console.log(this.data.path)
        console.log(user)
        wx.showModal({
          title: '提交成功',
          content: '已开始对您的信息进行核实，结果将在1-2个工作日后公布，请您耐心等待。如有其它问题请联系工作人员。',
        })
        console.log(r1)
        console.log(user)
        user.history.push({
          _id: r1._id,
          time: this.data.time,
          type: this.data.mold,
          status: 'doing'
        })
        wx.setStorageSync('user', user)
        console.log(user)
        db.collection('user').doc(user._id).update({
          // data 传入需要局部更新的数据
          data: {
            // 表示将 done 字段置为 true
            name: e.detail.value.input_name,
            student_id: e.detail.value.input_id,
            campus: e.detail.value.input_campus,
            college: e.detail.value.input_college,
            major: e.detail.value.input_major,
            history: user.history,
            email: e.detail.value.input_email,
            certification: 'certifying',
          },
          success: (res => {
            console.log("已经提交成功")
            wx.navigateBack({
              delta: 1
            })
          }),
          fail: console.error
        })

      }),
      fail: console.error
    })
  },
  formSubmit2: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    db.collection('addressbook').where({
      id: '4'
    }).get({
      success: (res => {
        var detail = res.data[0].detail
        console.log(res.data)
        console.log(detail)
        detail.push({
          avatar: 'http://a3.qpic.cn/psb?/V1440qhp31sLv2/g.83UaR7E9KEN*UwDgEGTAHYHS2sEmK3s.I9To.*P30!/m/dAYBAAAAAAAAnull&bo=rwCoAAAAAAABByc!&rf=photolist&t=5',
          name: e.detail.value.input_name1,
          phone: e.detail.value.input_phone
        })
        console.log(detail)
        db.collection('addressbook').doc(res.data[0]._id).update({
          // data 传入需要局部更新的数据
          data: {
            detail: detail
          },
          success: console.log,
          fail: console.error
        })
      })

    })

  },
  formSubmit1: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    db.collection('addressbook').add({
      data: {
        name: e.detail.value.input_name,
        detail: [''],
        id: e.detail.value.input_id,
        state: '0'
      },
      success: (r1 => {
        console.log(r1)
        wx.showToast({
          title: '添加成功',
        })
        wx.reLaunch({
          url: '/pages/post/post',
        })
      }),
      fail: console.error
    })
  },
})
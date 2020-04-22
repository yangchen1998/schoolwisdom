// miniprogram/pages/certifying/certifying.js
const db = wx.cloud.database()
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mold: 'post_certification',
    navigationBarText: '学生身份认证'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      user: wx.getStorageSync('user'),
      time: util.formatTime(new Date()), //获取时间
      timename: util.formatTimename(new Date())
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

  ViewImage: function () {
    wx.previewImage({
      current: this.data.tempFilePaths[0], // 当前显示图片的http链接
      urls: this.data.tempFilePaths // 需要预览的图片http链接列表
    })
  },
  DelImg: function () {
    this.setData({
      tempFilePaths: ''
    })
  },
  ChooseImage: function () {
    wx.chooseImage({
      count: 1,
      sizeType: 'compressed',
      sourceType: ['camera'],
      success: (res => {
        const tempFilePaths = res.tempFilePaths
        this.setData({
          tempFilePaths: tempFilePaths
        })
        const uploadTask = wx.cloud.uploadFile({
          cloudPath: '学生证/' + this.data.user._openid + '/' + this.data.timename + '.jpg',
          filePath: tempFilePaths[0],
          success: (res => {
            this.setData({
              path: res.fileID
            })
          }),
          fail: function (res) { },
          complete: function (res) { },
        })
        uploadTask.onProgressUpdate((res) => {
          //console.log('上传进度', res.progress)
          // console.log('已经上传的数据长度', res.totalBytesSent)
          this.setData({
            progress: res.progress
          })
          // console.log('预期需要上传的数据总长度', res.totalBytesExpectedToSend)
        })
        // console.log(res.tempFilePaths)
      }),
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  formSubmit1: function (e) {
    console.log('form发生了submit事件，携带数据为：', e)
    
  },

  formSubmit: function (e) {
    wx.showLoading({
      title: '正在提交中',
    })
    var user = wx.getStorageSync('user');
    if (user.certification == 'certifying') {
      wx.hideLoading()
      wx.showToast({
        title: '请勿重复提交',
        icon: 'none',
        duration: 2000
      })
    } else {
      console.log('form发生了submit事件，携带数据为：', e.detail.value)
      user.name = e.detail.value.input_name;
      user.student_id = e.detail.value.input_id;
      user.campus = e.detail.value.input_campus;
      user.college = e.detail.value.input_college;
      user.major = e.detail.value.input_major;
      user.email = e.detail.value.input_email;
      user.certification = 'certifying';
      console.log(user._openid)
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
          // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
          /*  this.setData({
             id: res._id
           }) */
          //console.log(res._id)
          // console.log(wx.getStorageSync('user'))
          wx.hideLoading()
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


    }

  },
  formReset: function () {
    wx.navigateBack({
      delta: 1
    })
  },
  onBackPage: function (e) {
    wx.navigateBack({
      delta: 1
    })
  }
})
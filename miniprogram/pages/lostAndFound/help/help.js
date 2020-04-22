// pages/lostAndFound/help/help.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    item: [
      { name: 'schoolIDCard', value: '学生证' },
      { name: 'schoolSupplies', value: '学习用品' },
      { name: 'groceries', value: '生活用品' },
      { name: 'others', value: '其它' },
    ],
    checkboxs: [{
      name: "NO1",
      value: "一号楼"
    }, {
      name: "canteen",
      value: "食堂"
    }, {
      name: "wenguanlou",
      value: "文管楼"
    }, {
      name: "library",
      value: "图书馆"
    }, {
      name: "shengkelou",
      value: "生科楼"
    }, {
      name: "xinxilou",
      value: "信息楼"
    }, {
      name: "jianzhulou",
      value: "建筑楼",
    }, {
      name: "stadium",
      value: "风雨操场"
    }, {
      name: "1",
      value: "一舍"
    }, {
      name: "2",
      value: "二舍"
    }, {
      name: "3",
      value: "三舍"
    }, {
      name: "4",
      value: "四舍"
    }, {
      name: "5",
      value: "五舍"
    }
    ]
  },

  redioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
  },
  onTap1: function () {
    wx.reLaunch({
      url: '../lostAndFound',
    })
  },
  onTap2: function () {
    wx.reLaunch({
      url: '../lostAndFound',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
  onShareAppMessage: function () {

  }
})
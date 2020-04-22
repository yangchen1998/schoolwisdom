const app = getApp()
const db = wx.cloud.database()
Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom,
    TabCur: 0,
    MainCur: 0,
    VerticalNavTop: 0,
    list: [],
    load: true,
    navigationBarText: '电话簿'
  },
  onLoad() {
    wx.showLoading({
      title: '加载中...',
      mask: true
    });
    var addressbook = wx.getStorageSync('addressbook')
    if (!addressbook) {
      console.log('访问了数据库')
      db.collection('addressbook').where({
        state: '0'
      }).get({
        success: (r1 => {
          console.log(r1)
          db.collection('addressbook').where({
            state: '0'
          }).skip(r1.data.length).get({
            success: (r2 => {
              console.log(r2)
              var list = r1.data.concat(r2.data)
              this.setData({
                list: list,
                listCur: list[0]
              })
              wx.setStorageSync('addressbook', list)
              wx.stopPullDownRefresh()
            })
          })
        })
      })
    } else {
      console.log('没有访问数据库')
      this.setData({
        list: addressbook,
        listCur: addressbook[0]
      })
    }




    /* let list = [{}];
    for (let i = 0; i < 9; i++) {
      list[i] = {};
      list[i].name = String.fromCharCode(65 + i);
      list[i].id = i;
      console.log(list[i])
    } */
    /* let list = [{
      name: '常用',
      id: 0,
      detail: [{
          name: '校长办公室接待科',
          phone: '024-83687361'
        },
        {
          name: '教务处教学管理科',
          phone: '024-83681251'
        },
        {
          name: '南湖公安处值班室',
          phone: '024-83680110'
        },
        {
          name: '浑南公安处值班室',
          phone: '024-83656110'

      */

    //  console.log(list)
    wx.stopPullDownRefresh()
  },
  onReady() {
    wx.hideLoading()
  },
  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      MainCur: e.currentTarget.dataset.id,
      VerticalNavTop: (e.currentTarget.dataset.id - 1) * 50
    })
  },
  VerticalMain(e) {
    let that = this;
    let list = this.data.list;
    let tabHeight = 0;
    if (this.data.load) {
      for (let i = 0; i < list.length; i++) {
        let view = wx.createSelectorQuery().select("#main-" + list[i].id);
        view.fields({
          size: true
        }, data => {
          list[i].top = tabHeight;
          //tabHeight = tabHeight + data.height;
          list[i].bottom = tabHeight;
        }).exec();
      }
      that.setData({
        load: false,
        list: list
      })
    }
    let scrollTop = e.detail.scrollTop + 20;
    for (let i = 0; i < list.length; i++) {
      if (scrollTop > list[i].top && scrollTop < list[i].bottom) {
        that.setData({
          VerticalNavTop: (list[i].id - 1) * 50,
          TabCur: list[i].id
        })
        return false
      }
    }
  },
  onPullDownRefresh: function () {
    //刷新页面时对数据更新
    console.log('用户下拉刷新')
    db.collection('addressbook').where({
      state: '0'
    }).get({
      success: (r1 => {
        console.log(r1)
        db.collection('addressbook').where({
          state: '0'
        }).skip(r1.data.length).get({
          success: (r2 => {
            console.log(r2)
            var list = r1.data.concat(r2.data)
            this.setData({
              list: list,
              listCur: list[0]
            })
            wx.setStorageSync('addressbook', list)
            wx.stopPullDownRefresh()
          })
        })
      })
    })
    // 
  },
  onPhone: function (e) {
    console.log(e.currentTarget.dataset.phone)
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone
    })
  },
  onShareAppMessage: function (ops) {
    return {
      title: '东大电话簿',
      path: '/pages/login',
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
  onBackPage: function (e) {
    wx.navigateBack({
      delta: 3,
    })
  }
})
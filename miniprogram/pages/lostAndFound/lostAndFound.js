// pages/lostAndFound/lostAndFound.js
const db = wx.cloud.database();
const app = getApp();
var util = require('../../utils/util.js');
var postlen1 = 0;
var postlen2 = 0;
var scrollTop = 0;
var up = 0;
var foundlen = 0;
var lostlen = 0;
var certification = 'no';
Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    more2: 0,
    getUserInfo: null,
    searchList: [{
      name: '学生证',
      isShow: true
    }, {
      name: '一号楼',
      isShow: true
    }, {
      name: '图书馆',
      isShow: true
    }, {
      name: '食堂',
      isShow: true
    }, {
      name: '澡堂',
      isShow: true
    }],
    better: null,
    certification: null
  },
  focussearch: function (e) {
    this.setData({
      prompt: ['1号楼', '图书馆', '食堂', '信息楼', '风雨操场']
    })
  },
  blursearch: function (e) {
    this.setData({
      prompt: ''
    })
  },
  //页面加载，只执行一次
  onLoad: function (options) {
    this.focuschange(1)
    wx.showLoading({
      title: '数据加载中',
    })
    this.loading(1)
    this.setData({
      better: app.globalData.better
    })
    let c = wx.getStorageSync('user').certification;
    if (c == 'yes') {
      this.setData({
        certification: 1
      })
    }
  },
  onGotUserInfo: function (e) {
    console.log(e.detail.errMsg)
    console.log(e.detail.userInfo)
    console.log(e.detail.rawData)
    wx.setStorageSync('userInfo', e.detail.userInfo)
    this.setData({
      getUserInfo: null,
      avatar: e.detail.userInfo.avatarUrl
    })
    wx.showTabBar({})
  },
  move: function () { },
  //数据加载，写这个方法方便页面对数据更新有要求时可以实现数据的实时更新
  loading: function (e) {
    if (e == 1) { //onLoad() and 重复tap1 调用时调用此方法
      var user = wx.getStorageSync('user')
      certification = user.certification
      var avatarUrl = wx.getStorageSync('userInfo').avatarUrl
      if (!avatarUrl) {
        var avatar = 'http://m.qpic.cn/psb?/V1440qhp31sLv2/fqIBhGH380t3bGaRDNWzywDRlebvIf4Q4EHWulTCDW8!/b/dLYAAAAAAAAA&bo=3wDfAAAAAAADByI!&rf=viewer_4';
        // wx.hideTabBar()


      } else {
        avatar = wx.getStorageSync('userInfo').avatarUrl
      }
      if (certification != 'yes') {
        this.setData({
          viewcer: 'no',
          modalName: 'tip',
          avatar: avatar
        })
      } else {
        this.setData({
          viewcer: 'yes',
          avatar: avatar
        })
      }
      //  var postList1 = new Array;
      db.collection('post').limit(20).where({
        state: '0'
      }).orderBy('time', 'desc').get({
        success: (r3 => {
          //  postList1 = postList1.concat(r3.data)
          postlen1 = r3.data.length;
          this.setData({
            postList1: this.showall(r3.data),
            index: 1,
            inputtext: '',
            loadModal: false //加载完成后停止刷新动画
          }),
            wx.hideLoading()
          //     this.selectpost(postList) //调用分类方法
        })
      })
      wx.cloud.callFunction({
        // 要调用的云函数名称
        name: 'update',
        // 传递给云函数的参数
        data: {
          entrance: 'viewers',
          id: ''
        },
        success: res => {
          //   console.log(res)
        },
        fail: err => {
          // handle error
        },
        complete: () => {
          // ...
        }
      })
      wx.stopPullDownRefresh() //刷新完成后停止下拉刷新动效
    } else if (e == 2) { // tap2调用时的方法
    } else if (e == 3) { //tap3调用方法
    } else if (e == 4) { //tap4调用方法

    } else if (e == 5) { //tap5调用方法

    } else if (e == 7) {
      //页面触底函数加载方法
      wx.showLoading({
        title: '加载中',
      })
      //  console.log(postlen1)
      db.collection('post').where({
        state: '0'
      }).orderBy('time', 'desc').skip(postlen1).limit(20).get({
        success: (rp1 => {
          wx.hideLoading()
          if (rp1.data.length == 0) {
            wx.showToast({
              title: '已经没有更多了',
              icon: 'none',
              duration: 2500
            })
          } else {
            var n = new Array;
            if (this.data.index == 1) {
              var newpostList = n.concat(this.data.postList1, this.showall(rp1.data))
            } else if (this.data.index == 2) {
              var newpostList = n.concat(this.data.postList1, this.showfound(rp1.data))
            } else if (this.data.index == 3) {
              var newpostList = n.concat(this.data.postList1, this.showlost(rp1.data))
            }
            postlen1 = newpostList.length
            console.log(newpostList)
            this.setData({
              postList1: newpostList,
            })
          }
        })
      })
    }
  },
  //这是焦点变化方法
  focuschange: function (e) {
    console.log("焦点值：" + e)
    var tap = [0, 0, 0, 0, 0];
    tap[e - 1] = 1;
    this.setData({
      index: e,
      interface: {
        interface1: '全部信息',
        tap1: tap[0],
        interface2: '失物招领',
        tap2: tap[1],
        interface3: '寻物启事',
        tap3: tap[2],
      },
    })
  },

  //这是顶部导航栏点击操作方法
  onTap1: function () { //点击最新的动作
    if (this.data.backtop == 0 || this.data.index != 1) { //页面焦点不在顶部or不在最新时进行数据更新
      if (this.data.index == 1) {
        this.setData({
          loadModal: true
        })
        this.loading() //调用数据加载方法，更新当前数据
        this.setData({
          postList1: this.showall(this.data.postList1)
        })
        setTimeout(() => {
          this.setData({
            loadModal: false
          })
          wx.showToast({
            title: '已是最新动态',
            icon: 'none'
          }) //给一个页面反馈
        }, 2000) //定时器设置超时自动停止加载动画
      } else {
        this.setData({
          postList1: this.showall(this.data.postList1)
        })
        this.focuschange(1)
        this.onBacktop()
      }
    } else { //页面焦点不在顶部时返回顶部
      this.onBacktop()
    }
  },
  onTap2: function () { //点击招领的动作
    //  console.log('Tap2')
    if (this.data.backtop == 0 || this.data.index != 2) { //页面焦点在顶部or 不在招领时进行数据更新
      if (this.data.index == 2) {
        this.setData({
          loadModal: true
        })
        // this.loading() //调用数据加载方法，更新当前数据
        this.setData({
          postList1: this.showfound(this.data.postList1)
        })
        if (foundlen < 5) {
          this.onReachBottom()
        }
        setTimeout(() => {
          this.setData({
            loadModal: false
          })
          wx.showToast({
            title: '已是最新动态',
            icon: 'none'
          }) //给一个页面反馈
        }, 2000) //定时器设置超时自动停止加载动画
      } else {
        this.loading() //调用数据加载方法，更新当前数据
        this.setData({
          postList1: this.showfound(this.data.postList1)
        })
        this.focuschange(2)
        this.onBacktop()
        if (foundlen < 5) {
          this.onReachBottom()
        }
      }
    } else { //页面焦点不在顶部时返回顶部
      this.onBacktop()
    }

  },
  onTap3: function () { //点击寻物的动作
    //  console.log('Tap2')
    if (this.data.backtop == 0 || this.data.index != 3) { //页面焦点在顶部or 不在招领时进行数据更新
      if (this.data.index == 3) {
        this.setData({
          loadModal: true
        })
        //  this.loading() //调用数据加载方法，更新当前数据
        this.setData({
          postList1: this.showlost(this.data.postList1)
        })
        if (lostlen < 5) {
          this.onReachBottom()
        }
        setTimeout(() => {
          this.setData({
            loadModal: false
          })
          wx.showToast({
            title: '当前状态已更新',
            icon: 'none'
          }) //给一个页面反馈
        }, 2000) //定时器设置超时自动停止加载动画
      } else {
        this.loading() //调用数据加载方法，更新当前数据
        this.setData({
          postList1: this.showlost(this.data.postList1)
        })
        this.focuschange(3)
        this.onBacktop()
        if (lostlen < 5) {
          this.onReachBottom()
        }
      }
    } else { //页面焦点不在顶部时返回顶部
      this.onBacktop()
    }

  },
  onTap5: function () { //点击心情的动作
    wx.showToast({
      title: '正在维护中',
      icon: 'none'
    })
    /*    wx.navigateTo({
         url: '../notice/notice',
       }) */
  },
  onTap4: function () { //点击活动的动作
    wx.showToast({
      title: '此功能正在内测',
      icon: 'none'
    })
  },
  onPostTap: function (event) { //点击帖子的动作
    wx.showLoading({
      title: '加载中',
    })
    var post = event.currentTarget.dataset.post;
    var id = event.currentTarget.dataset.id;
    var newp = new Array()
    newp = this.data.postList1;
    newp[id].viewers++
    this.setData({
      postList1: newp
    })
    this.gotodetail(post)
  },
  //详情页面跳转方法
  gotodetail: function (e) {
    wx.cloud.callFunction({
      // 要调用的云函数名称
      name: 'update',
      // 传递给云函数的参数
      data: {
        entrance: 'viewer',
        id: e._id
      }
    })
    wx.navigateTo({
      url: 'detail/detail?post=' + JSON.stringify(e)
    })
    wx.hideLoading()
  },
  onPostimg: function (event) {
    //  console.log('点击了图片')
    if (certification != 'yes') {
      wx.showToast({
        title: '您无权查看原图',
        icon: 'none'
      })
    } else {
      wx.previewImage({
        current: event.currentTarget.dataset.imgid, // 当前显示图片的http链接
        urls: this.data.postList1[event.currentTarget.dataset.imglistid].imgid // 需要预览的图片http链接列表
      })
    }
  },
  onPostpromptTap: function (event) {
    console.log(event.currentTarget.dataset.text)
    this.setData({
      inputtext: event.currentTarget.dataset.text,
      index: event.currentTarget.dataset.text
    })
    wx.showLoading({
      title: '数据加载中',
    })
    db.collection('post').limit(10).where({
      location1: event.currentTarget.dataset.text
    }).orderBy('time', 'desc').get({
      success: (res => {
        postlen1 = res.data.length
        console.log(postlen1)
        this.setData({
          postList1: res.data,
          //  postlen1: res.data.length
        }),
          wx.hideLoading()
      })
    })
  },
  onReady: function () {
    this.animation = wx.createAnimation()
  },
  onShow: function () {
    if (this.data.drawer) {
      wx.hideTabBar({})
    } else {
      if (this.data.getUserInfo == 1) {
        wx.hideTabBar()
      } else {
        wx.showTabBar();
      }
    }
  },
  onHide: function () {

  },
  onUnload: function () {

  },
  //监听屏幕滚动 判断上下滚动  
  onPageScroll: function (event) {
    // console.log(event)
    //判断浏览器滚动条上下滚动   
    if (event.scrollTop < scrollTop) {
      //   console.log('向上滚动');
      up = up - (event.scrollTop - scrollTop)
      //   console.log(up)
      if (up >= 300 || scrollTop < 200) {
        wx.showTabBar({})
      }
      scrollTop = event.scrollTop
      this.setData({
        more2: 0,
        more3: 0,
        bottom1: 125
      })
    } else {
      //  console.log('向下滚动');
      //向下滚动时自动隐藏导航栏并更新scrollTop的值
      wx.hideTabBar()
      scrollTop = event.scrollTop
      up = 0
      this.setData({
        backtop: 1,
        more2: 0,
        more3: 0,
        bottom1: 125,
      })

    }
    if (event.scrollTop == 0) {
      this.setData({
        backtop: 0
      })
    }
  },
  //返回顶部
  onBacktop: function (e) {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300
    })
    this.setData({
      backtop: 0,
      more2: 0,
      more3: 0,
    })
  },
  //下拉刷新动作
  onPullDownRefresh: function () {
    this.onLoad(0)
  },
  //下滑触底动作
  onReachBottom: function () {
    this.loading(7) //页面触底时调用加载的7号功能
  },
  //转发方法
  onShareAppMessage: function (ops) {
    return {
      title: '失物招领',
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
  //模态弹窗方法
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
  //发布方法
  onRelease: function (e) {
    var _onrealease = wx.getStorageSync('userInfo')
    if (!_onrealease) {
      wx.showToast({
        title: '未授权无法发布内容',
        icon: 'none'
      })
    } else {
      wx.navigateTo({
        url: '/pages/release/release',
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    }
  },
  onIndex: function (e) {
    wx.reLaunch({
      url: 'index',
    })
  },
  //悬浮键方法
  rotate: function () {
    this.animation.rotate(Math.round(Math.random() * 10) * 180 - 90).step()
    if (this.data.more2 == 0) {
      this.setData({
        backtop: 1,
        bottom1: 125,
        animation: this.animation.export()
      })
      setTimeout(() => {
        this.setData({
          bottom1: 150
        })
      }, 100) //定时器模拟弹出效果
      setTimeout(() => {
        this.setData({
          bottom1: 190,
          more3: 1,
          bottom3: 110
        })
      }, 100) //定时器模拟弹出效果
      setTimeout(() => {
        this.setData({
          bottom1: 230,
          bottom3: 150
        })
      }, 100) //定时器模拟弹出效果
      setTimeout(() => {
        this.setData({
          more2: 1,
          bottom1: 270,
          bottom2: 125,
          bottom3: 190,
        })
      }, 100) //定时器模拟弹出效果
    } else if (this.data.more2 == 1) {
      this.setData({
        backtop: 0,
        more2: 0,
        more3: 0,
        bottom1: 230,
        animation: this.animation.export()
      })
    }
  },
  showDrawer: function (e) {
    var avatarUrl = wx.getStorageSync('userInfo').avatarUrl
    if (!avatarUrl) {
      this.setData({
        getUserInfo: 1
      })
      wx.hideTabBar({})
    } else {
      wx.hideTabBar({
        aniamtion: true
      })
      setTimeout(() => {
        this.setData({
          drawer: 1
        })
      }, 350) //定时器模拟弹出效果

    }

  },
  hideDrawer: function (e) {
    this.setData({
      drawer: null
    })
    setTimeout(() => {
      wx.showTabBar({
        aniamtion: true
      })
    }, 450) //定时器模拟弹出效果

  },
  //跳转搜索结果页面
  onSearch: function (e) {
    console.log(e)
    this.setData({
      trysearch: null
    })
    if (e.detail.value) {
      wx.navigateTo({
        url: '../search/search?searchtext=' + e.detail.value
      })
    } else {
      wx.showToast({
        title: '没有搜索目标',
      })
    }

  },
  trySearch: function () {
    this.setData({
      trysearch: 1
    })
  },
  intputSearch: function (e) {
    this.tip(e.detail.value)
    this.setData({
      inputsearchtext: e.detail.value
    })
  },
  tip: function (e) { //智能提词
    // console.log(e)
    let key = e;
    // console.log(key)
    let list = util.searchList;
    // console.log(list)
    for (let i = 0; i < list.length; i++) {
      let a = key;
      let b = list[i].name;
      if (b.search(a) != -1) {
        list[i].isShow = true
      } else {
        list[i].isShow = false
      }
    }
    this.setData({
      searchList: list
    })
  },
  onClearsearch: function () {
    this.setData({
      inputsearchtext: null
    })
  },
  cancelSearch: function (e) {
    this.setData({
      trysearch: null
    })
  },
  onSearchTip: function (e) {
    console.log(e.currentTarget.dataset.name)
    this.setData({
      trysearch: null
    })
    wx.navigateTo({
      url: '../search/search?searchtext=' + e.currentTarget.dataset.name
    })
  },
  onKeyboard: function (e) {
    console.log(e)
    if (e.detail.height == 0) {
      this.setData({
        trysearch: null
      })
    }
  },
  onCancelInfo: function (e) {
    this.setData({
      getUserInfo: 2
    })
  },
  showall: function (e) {
    for (let i = 0; i < e.length; i++) {
      e[i].show = 1;
    }
    console.log(e);
    return e;
  },
  showfound: function (e) {
    foundlen = 0;
    for (let i = 0; i < e.length; i++) {
      if (e[i].class1 == '失物招领') {
        e[i].show = 1;
        foundlen++;
      } else {
        e[i].show = null;
      }
    }
    console.log(e);
    return e;
  },
  showlost: function (e) {
    // console.log(e);
    lostlen = 0;
    for (let i = 0; i < e.length; i++) {
      if (e[i].class1 == '寻物启事') {
        e[i].show = 1;
        lostlen++;
      } else {
        e[i].show = null;
      }
    }
    console.log(e);
    return e;
  }

})
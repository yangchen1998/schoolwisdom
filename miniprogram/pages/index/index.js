//index.js
const app = getApp()
const db = wx.cloud.database()
const _ = db.command;
var util = require('../../utils/util.js');
var col1H = 0; //瀑布流卡片
var col2H = 0;
var len = 0;
Page({
  data: {
    //导航栏相关
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom,
    windowWidth: app.globalData.windowWidth,
    search_height: app.globalData.screenHeight - app.globalData.CustomBar,
    TabCur: 0,
    scrollLeft: 0,
    tabnav: 0,
    navigation: ['全部', '寻物', '招领', '互助', '推广', '通知'],
    // tabbar_height: app.globalData.screenHeight - app.app.globalData.windowHeight
    //瀑布流相关
    scrollH: app.globalData.windowHeight,
    imgWidth: app.globalData.windowWidth * 0.48,
    loadingCount: 0,
    images: [],
    col1: [],
    col2: [],
    attraction: [],
  },
  onLoad: function () {
    this.loadAttraction()
    this.loadhistory()
    this.loadHot()
    this.loadRecommend()
  },
  loadhistory: function () {
    var search_history = wx.getStorageSync('search_history');
    this.setData({
      search_history: search_history
    })
  },
  loadHot: function () {
    db.collection('hot')
      .get().then(res => {
        //  console.log(res.data)
        this.setData({
          hot_search: res.data
        })
      })
  },
  loadRecommend: function () {
    db.collection('post')
      .where({
        recommend: 'yes'
      })
      .get()
      .then(res => {
        this.setData({
          recommend: res.data
        })
      })
  },
  searchInput: function (e) {
    // console.log(e)
    this.setData({
      inputValue: e.detail.value,
      bindSearch: 1
    })
    if (e.detail.value == '') {
      this.setData({
        bindSearch: null,
        inputValue: null
      })
    }
  },
  tryfocus: function (e) {
    this.setData({
      tryfocus: 1
    })
    wx.hideTabBar()
    wx.getStorageSync('search_history')
  },
  tryblur: function (e) {

  },
  search: function (e) {
    console.log('按了搜索,它的值为：' + e)
    this.setData({
      bindSearch: 1
    })
    if (!e.detail) {
      var name = e;
      this.changeHistory(e);
    } else {
      var name = e.detail.value;
      this.changeHistory(e.detail.value);
      //更新数据库搜索记录数据
    }
    db.collection('search')
      .add({
        data: {
          name: name
        }
      });
  },
  changeHistory: function (history_id) {
    var search_history = wx.getStorageSync('search_history');
    if (!search_history) {
      search_history = new Array(history_id);
      wx.setStorageSync('search_history', search_history)
      this.setData({
        search_history: search_history
      })

    } else {
      var checked = this.check(search_history, history_id);
      if (checked < 0) {
        search_history.unshift(history_id)
        wx.setStorageSync('search_history', search_history)
        this.setData({
          search_history: search_history
        })
      } else {
        // console.log(checked)
        // console.log('重复搜索')
        if (checked > 0) {
          var val_temp = search_history[checked];
          search_history.splice(checked, 1);
          console.log(val_temp)
          search_history.unshift(val_temp)
          wx.setStorageSync('search_history', search_history)
          console.log(search_history)
          this.setData({
            search_history: search_history
          })
        } else {
          // console.log('不需要更改顺序')
        }
      }
    }
  },
  check: function (search_history, key) {
    //console.log(search_history)
    //console.log(key)
    var checked = -1;
    for (var i = 0; i < search_history.length; i++) {
      //console.log(i)
      if (search_history[i] == key) {
        checked = i;
        break;
      } else {
        checked = -1;
      }
    }
    console.log(checked)
    return checked
  },
  keyboardheightchange: function (e) {
    /* console.log(e)
    wx.onKeyboardHeightChange(e => {
      console.log(e.height)
    }) */
  },
  cancelSearch: function (e) {
    if (this.data.bindSearch == 1) {
      this.setData({
        bindSearch: null,
        inputValue: null
      })
    } else {
      this.setData({
        tryfocus: null
      })
      wx.showTabBar()
    }
  },
  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    })
  },
  navgationSelect: function (e) {
    this.setData({
      tabnav: e.currentTarget.dataset.id
    })
  },
  //瀑布流相关
  //---景点加载
  loadAttraction: function () {
    // let len = this.data.attraction.length
    // console.log(len)
    wx.showLoading({
      title: '加载中',
    })
    let attraction = new Array()

    db.collection('post')
      //.skip(len)
      .where({
        class1: _.eq('寻物启事').or(_.eq('失物招领'))
      })
      .get()
      .then(res => {
        //   console.log(res.data)
        let attraction = res.data;
        let baseId = "img-" + (+new Date());
        for (let i = 0; i < attraction.length; i++) {
          attraction[i].id = baseId + "-" + i;
          attraction[i].height = 0;
        }

        this.setData({
          attraction: attraction,
          loadingCount: attraction.length,
        })
        //   console.log(this.data.attraction)
      })
  },
  onImageLoad1: function (e) {
    let imageId = e.currentTarget.id;
    let oImgW = e.detail.width; //图片原始宽度
    let oImgH = e.detail.height; //图片原始高度
    let imgWidth = this.data.imgWidth; //图片设置的宽度
    let scale = imgWidth / oImgW;
    let imgHeight = oImgH * scale; //自适应高度
    //  console.log(imageId)
    let images = this.data.attraction;
    let imageObj = null;
    //   console.log(images)
    for (let i = 0; i < images.length; i++) {
      let img = images[i];
      if (img.id === imageId) {
        imageObj = img;
        break;
      }
    }

    imageObj.height = imgHeight;

    let loadingCount = this.data.loadingCount - 1;
    let col1 = this.data.col1;
    let col2 = this.data.col2;

    if (col1H <= col2H) {
      col1H += imgHeight;
      col1.push(imageObj);
    } else {
      col2H += imgHeight;
      col2.push(imageObj);
    }
    let data = {
      loadingCount: loadingCount,
      col1: col1,
      col2: col2
    };

    if (!loadingCount) {
      data.attraction = [];
    }

    this.setData(data);
    wx.hideLoading()
  },
  chooseAttraction1: function (e) {
    wx.navigateTo({
      url: '../lostAndFound/detail/detail?post=' + JSON.stringify(this.data.col1[e.currentTarget.dataset.id]),
    })
  },
  chooseAttraction2: function (e) {
    wx.navigateTo({
      url: '../lostAndFound/detail/detail?post=' + JSON.stringify(this.data.col2[e.currentTarget.dataset.id]),
    })
  },

  //
  onImageLoad2: function (e) {
    let imageId = e.currentTarget.id;
    let oImgW = e.detail.width; //图片原始宽度
    let oImgH = e.detail.height; //图片原始高度
    let imgWidth = this.data.imgWidth; //图片设置的宽度
    let scale = imgWidth / oImgW; //比例计算
    let imgHeight = oImgH * scale; //自适应高度

    let images = this.data.images;
    let imageObj = null;

    for (let i = 0; i < images.length; i++) {
      let img = images[i];
      if (img.id === imageId) {
        imageObj = img;
        break;
      }
    }

    imageObj.height = imgHeight;

    let loadingCount = this.data.loadingCount - 1;
    let col1 = this.data.col1;
    let col2 = this.data.col2;

    if (col1H <= col2H) {
      col1H += imgHeight;
      col1.push(imageObj);
    } else {
      col2H += imgHeight;
      col2.push(imageObj);
    }

    let data = {
      loadingCount: loadingCount,
      col1: col1,
      col2: col2
    };

    if (!loadingCount) {
      data.images = [];
    }

    this.setData(data);
  },
  onImageLoad3: function (e) {
    let imageId = e.currentTarget.id;
    let oImgW = e.detail.width; //图片原始宽度
    let oImgH = e.detail.height; //图片原始高度
    let imgWidth = this.data.imgWidth; //图片设置的宽度
    let scale = imgWidth / oImgW; //比例计算
    let imgHeight = oImgH * scale; //自适应高度

    let images = this.data.images;
    let imageObj = null;

    for (let i = 0; i < images.length; i++) {
      let img = images[i];
      if (img.id === imageId) {
        imageObj = img;
        break;
      }
    }

    imageObj.height = imgHeight;

    let loadingCount = this.data.loadingCount - 1;
    let col1 = this.data.col1;
    let col2 = this.data.col2;

    if (col1H <= col2H) {
      col1H += imgHeight;
      col1.push(imageObj);
    } else {
      col2H += imgHeight;
      col2.push(imageObj);
    }

    let data = {
      loadingCount: loadingCount,
      col1: col1,
      col2: col2
    };

    if (!loadingCount) {
      data.images = [];
    }

    this.setData(data);
  },
  onImageLoad4: function (e) {
    let imageId = e.currentTarget.id;
    let oImgW = e.detail.width; //图片原始宽度
    let oImgH = e.detail.height; //图片原始高度
    let imgWidth = this.data.imgWidth; //图片设置的宽度
    let scale = imgWidth / oImgW; //比例计算
    let imgHeight = oImgH * scale; //自适应高度

    let images = this.data.images;
    let imageObj = null;

    for (let i = 0; i < images.length; i++) {
      let img = images[i];
      if (img.id === imageId) {
        imageObj = img;
        break;
      }
    }

    imageObj.height = imgHeight;

    let loadingCount = this.data.loadingCount - 1;
    let col1 = this.data.col1;
    let col2 = this.data.col2;

    if (col1H <= col2H) {
      col1H += imgHeight;
      col1.push(imageObj);
    } else {
      col2H += imgHeight;
      col2.push(imageObj);
    }

    let data = {
      loadingCount: loadingCount,
      col1: col1,
      col2: col2
    };

    if (!loadingCount) {
      data.images = [];
    }

    this.setData(data);
  },
  onShop: function (e) {
    wx.navigateTo({
      url: '/pages/creativity/detail/detail',
    })
  },
  tapselect: function (e) {
    console.log(e.currentTarget.dataset.id)
  },
  tapHistory: function (e) {
    console.log(e.currentTarget.dataset.id)
    this.search(this.data.search_history[e.currentTarget.dataset.id])
  },
  ltapHistory: function (e) {
    //   console.log(e.currentTarget.dataset.id)
    wx.showModal({
      content: '是否要删除该记录',
      success: res => {
        if (res.confirm) {
          // console.log('用户点击确定')
          var new_history = this.data.search_history;
          new_history.splice(e.currentTarget.dataset.id, 1)
          this.setData({
            search_history: new_history
          })
          wx.setStorageSync('search_history', new_history)
        } else if (res.cancel) {
          // console.log('用户点击取消')
        }
      }
    })
  },
  onDeleteHistory: function (e) {
    //  console.log("点击删除历史记录")
    wx.showModal({
      content: '是否要删除所有记录',
      success: res => {
        if (res.confirm) {
          // console.log('用户点击确定')
          this.setData({
            search_history: null
          })
          wx.removeStorageSync('search_history')
        } else if (res.cancel) {
          // console.log('用户点击取消')
        }
      }
    })
  },
  hotSelect: function (e) {
    console.log(e.currentTarget.dataset.id)
    this.search(this.data.hot_search[e.currentTarget.dataset.id].name)
  }
})

/*  if (!wx.cloud) {
     wx.redirectTo({
       url: '../chooseLib/chooseLib',
     })
     return
   }

   // 获取用户信息
   wx.getSetting({
     success: res => {
       if (res.authSetting['scope.userInfo']) {
         // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
         wx.getUserInfo({
           success: res => {
             this.setData({
               avatarUrl: res.userInfo.avatarUrl,
               userInfo: res.userInfo
             })
           }
         })
       }
     }
   }) 
*/

/* 
onGetUserInfo: function(e) {
  if (!this.logged && e.detail.userInfo) {
    this.setData({
      logged: true,
      avatarUrl: e.detail.userInfo.avatarUrl,
      userInfo: e.detail.userInfo
    })
  }
},

onGetOpenid: function() {
  // 调用云函数
  wx.cloud.callFunction({
    name: 'login',
    data: {},
    success: res => {
      console.log('[云函数] [login] user openid: ', res.result.openid)
      app.globalData.openid = res.result.openid
      wx.navigateTo({
        url: '../userConsole/userConsole',
      })
    },
    fail: err => {
      console.error('[云函数] [login] 调用失败', err)
      wx.navigateTo({
        url: '../deployFunctions/deployFunctions',
      })
    }
  })
},

// 上传图片
doUpload: function() {
  // 选择图片
  wx.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: function (res) {

      wx.showLoading({
        title: '上传中',
      })

      const filePath = res.tempFilePaths[0]

      // 上传图片
      const cloudPath = 'my-image' + filePath.match(/\.[^.]+?$/)[0]
      wx.cloud.uploadFile({
        cloudPath,
        
        filePath,
        success: res => {
          console.log('[上传文件] 成功：', res)

          app.globalData.fileID = res.fileID
          app.globalData.cloudPath = cloudPath
          app.globalData.imagePath = filePath

          wx.navigateTo({
            url: '../storageConsole/storageConsole'
          })
        },
        fail: e => {
          console.error('[上传文件] 失败：', e)
          wx.showToast({
            icon: 'none',
            title: '上传失败',
          })
        },
        complete: () => {
          wx.hideLoading()
        }
      })

    },
    fail: e => {
      console.error(e)
    }
  })
}, */
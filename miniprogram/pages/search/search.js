// miniprogram/pages/search/search.js
const db = wx.cloud.database();
const app = getApp();
let util = require('../../utils/util.js');
let index = 0; //用来判断当前页面显示结果为哪一种搜索结果
let lac = 0; //记录结果显示的location0 还是location1的结果
let delen1 = 0; //记录title的条数
let delen2 = 0; //记录detail的条数
Page({

  /**
   * 页面的初始数据
   */
  data: {
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    wx.showLoading({
      title: '正在搜索',
    })
    let c = wx.getStorageSync('user').certification
    if (c == 'yes') {
      this.setData({
        searchtext: e.searchtext,
        better: app.globalData.better,
        certification: 1
      })
    } else {
      this.setData({
        searchtext: e.searchtext,
        better: app.globalData.better,
        certification: null
      })
    }

    let key = this.check(e);
    if (key == 0) {
      this.searchLocation(e)
    } else if (key == 1) {
      this.searchClass(e)
    } else if (key == 2) {
      this.searchType(e)
    } else if (key == 4) {
      e.searchtext = '卡证'
      this.searchType(e)
    } else {
      this.search(e)
    }
    console.log(e)
  },
  check: function (e) {
    let key = null;
    let text = e.searchtext;
    let class1 = "寻物启事失物招领通知";
    let type = "卡证书籍水杯雨伞其它";
    let location = "浑南校区南湖校区生科楼建筑楼信息楼图书馆一号楼五舍一舍二舍三舍四舍风雨操场澡堂食堂刘长春体育馆";
    // console.log(location.search(text))
    if (text == '学生证' || text == '校园卡') {
      key = 4;
      console.log('4')
    } else if (location.search(text) != -1) {
      key = 0;
      console.log('0')
    } else if (class1.search(text) != -1) {
      key = 1;
      console.log('1')
    } else if (type.search(text) != -1) {
      key = 2;
      console.log('2')
    }
    return key;
  },
  searchLocation: function (e) {
    index = 1; //目前显示的结果为地点搜索的结果
    db.collection('post').where({
      location0: db.RegExp({
        regexp: e.searchtext,
        options: 'i',
      })
    }).orderBy('time', 'desc').get({
      success: p => {
        if (p.data.length != 0) {
          lac = 1;
          this.setData({
            result: p.data
          })
        } else {
          db.collection('post').where({
            location1: db.RegExp({
              regexp: e.searchtext,
              options: 'i',
            })
          }).orderBy('time', 'desc').get({
            success: p => {
              lac = 2;
              this.setData({
                result: p.data
              })
              wx.hideLoading()
            }
          })
        }
      }
    })
  },
  searchClass: function (e) {
    index = 2; //显示类别
    db.collection('post').where({
      class1: db.RegExp({
        regexp: e.searchtext,
        options: 'i',
      })
    }).orderBy('time', 'desc').get({
      success: p => {
        this.setData({
          result: p.data
        })
        wx.hideLoading()
      }
    })
  },
  searchType: function (e) {
    index = 3; //显示物品种类
    db.collection('post').where({
      type: db.RegExp({
        regexp: e.searchtext,
        options: 'i',
      })
    }).orderBy('time', 'desc').get({
      success: p => {
        this.setData({
          result: p.data
        })
        wx.hideLoading()
      }
    })
  },
  search: function (e) {
    index = 4; //显示内容搜索结果
    let resultList = new Array();
    // console.log(e)
    db.collection('post').where({
      title: db.RegExp({
        regexp: e.searchtext,
        options: 'i',
      })
    }).orderBy('time', 'desc').get({
      success: p => {
        console.log(p.data)
        delen1 = p.data.length;
        resultList = resultList.concat(p.data)
        db.collection('post').where({
          detail: db.RegExp({
            regexp: e.searchtext,
            options: 'i',
          })
        }).get({
          success: p2 => {
            console.log(p2.data)
            delen2 = p.data.length;
            resultList = resultList.concat(p2.data)
            wx.hideLoading()
            console.log(resultList)
            this.setData({
              result: resultList
            })
            if (this.data.result.length == 0) {
              this.searchNumber(e.searchtext)
            }
          }
        })
      }
    })
  },
  searchNumber: function (e) {
    index = 5; //学生证查询结果
    let resultList = new Array();
    console.log(e)
    db.collection('post').where({
      cardid: db.RegExp({
        regexp: e,
        options: 'i',
      })
    }).orderBy('time', 'desc').get({
      success: p => {
        console.log(p.data)
        if (p.data.length == 0) {
          db.collection('post').where({
            cardname: db.RegExp({
              regexp: e,
              options: 'i',
            })
          }).orderBy('time', 'desc').get({
            success: p2 => {
              console.log(p2.data)
              if (p2.data.length != 0) {
                wx.hideLoading()
                this.setData({
                  result: p2.data
                })
              }
            }
          })
        } else {
          this.setData({
            result: p.data
          })
        }
      }
    })
  },
  onBackPage: function (e) {
    //console.log("1")
    wx.navigateBack({
      delta: 1
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
    wx.showLoading({
      title: '正在加载',
    })
    switch (index) {
      //页面显示查询地点结果
      case 1:
        if (lac = 1) {
          db.collection('post').where({
            location0: db.RegExp({
              regexp: this.data.searchtext,
              options: 'i',
            })
          }).orderBy('time', 'desc').skip(this.data.result.length).get({
            success: p => {
              let newadd = this.data.result.concat(p.data)
              this.setData({
                result: newadd
              })
              wx.hideLoading()
              if (p.data.length == 0) {
                wx.showToast({
                  title: '已经没有更多了',
                  icon: 'none'
                })
              }
            }
          })
        } else if (lac = 2) {
          db.collection('post').where({
            location1: db.RegExp({
              regexp: this.data.searchtext,
              options: 'i',
            })
          }).orderBy('time', 'desc').skip(this.data.result.length).get({
            success: p => {
              let newadd = this.data.result.concat(p.data)
              this.setData({
                result: newadd
              })
              wx.hideLoading()
              if (p.data.length == 0) {
                wx.showToast({
                  title: '已经没有更多了',
                  icon: 'none'
                })
              }
            }
          })
        }
        break;
      //类别
      case 2:
        db.collection('post').where({
          class1: db.RegExp({
            regexp: this.data.searchtext,
            options: 'i',
          })
        }).orderBy('time', 'desc').skip(this.data.result.length).get({
          success: p => {
            let newadd = this.data.result.concat(p.data)
            this.setData({
              result: newadd
            })
            wx.hideLoading()
            if (p.data.length == 0) {
              wx.showToast({
                title: '已经没有更多了',
                icon: 'none'
              })
            }
          }
        })
        break;
      //物品种类
      case 3:
        db.collection('post').where({
          type: db.RegExp({
            regexp: this.data.searchtext,
            options: 'i',
          })
        }).orderBy('time', 'desc').skip(this.data.result.length).get({
          success: p => {
            let newadd = this.data.result.concat(p.data)
            this.setData({
              result: newadd
            })
            wx.hideLoading()
            if (p.data.length == 0) {
              wx.showToast({
                title: '已经没有更多了',
                icon: 'none'
              })
            }
          }
        })
        break;
      //内容
      case 4:
        let resultList = new Array();
        // console.log(e)
        db.collection('post').where({
          title: db.RegExp({
            regexp: this.data.searchtext,
            options: 'i',
          })
        }).orderBy('time', 'desc').skip(delen1).get({
          success: p => {
            console.log(p.data)
            delen1 = delen1 + p.data.length;
            resultList = resultList.concat(p.data)
            db.collection('post').where({
              detail: db.RegExp({
                regexp: this.data.searchtext,
                options: 'i',
              })
            }).orderBy('time', 'desc').skip(delen2).get({
              success: p2 => {
                console.log(p2.data)
                delen2 = delen2 + p.data.length;
                resultList = resultList.concat(p2.data)
                let nrl = this.data.result.concat(resultList)
                wx.hideLoading()
                console.log(nrl)
                this.setData({
                  result: nrl
                })
                if (resultList.length == 0) {
                  wx.showToast({
                    title: '已经没有更多了',
                    icon: 'none'
                  })
                }
              }
            })
          }
        })

        break;
      default:
        console.log('错误')
    }
  },
  onSearch: function () {
    let e = new Object();
    e.searchtext = this.data.searchtext;
    let key = this.check(e);
    if (key == 0) {
      this.setData({
        result: this.searchLocation(e)
      })
    } else if (key == 1) {
      this.setData({
        result: this.searchClass(e)
      })
    } else if (key == 2) {
      this.setData({
        result: this.searchType(e)
      })
    } else {
      this.search(e)
    }
  },
  trySearch: function () {
    this.setData({
      trysearch: 1
    })
  },
  cancelSearch: function (e) {
    this.setData({
      trysearch: null
    })
  },
  onSearchTip: function (e) {
    let that = this;
    let n = new Object();
    n.searchtext = e.currentTarget.dataset.name
    console.log(e.currentTarget.dataset.name)
    this.setData({
      trysearch: null
    })
    that.onLoad(n)
  },
  onKeyboard: function (e) {
    console.log(e)
    if (e.detail.height == 0) {
      this.setData({
        trysearch: null
      })
    }
  },
  onInputsearch: function (e) {
    //   console.log(e)
    this.tip(e.detail.value)
    this.setData({
      searchtext: e.detail.value
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
  onClearsearch: function (e) {
    this.setData({
      searchtext: null,
      trysearch: 1
    })
  },
  onPostTap: function (event) { //点击帖子的动作
    wx.showLoading({
      title: '加载中',
    })
    var post = event.currentTarget.dataset.post;
    var id = event.currentTarget.dataset.id;
    var newp = this.data.result;
    newp[id].viewers++
    this.setData({
      result: newp
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
      url: '../lostAndFound/detail/detail?post=' + JSON.stringify(e)
    })
    wx.hideLoading()
  },
  onPostimg: function (event) {
    //  console.log('点击了图片')
    if (wx.getStorageSync('user').certification != 'yes') {
      wx.showToast({
        title: '您无权查看原图',
        icon: 'none'
      })
    } else {
      wx.previewImage({
        current: event.currentTarget.dataset.imgid, // 当前显示图片的http链接
        urls: this.data.result[event.currentTarget.dataset.imglistid].imgid // 需要预览的图片http链接列表
      })
    }
  }
})
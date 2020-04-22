// miniprogram/pages/carpool/carpool.js
const app = getApp();//注册小程序示例
var util = require('../../utils/util.js')
const db = wx.cloud.database();
var scrollTop = 0;
var carpool_b = []; //辅助序列，加载更多时筛选的序列
var up = 0;
var len = 0; //记录当前数组的长度
var mycarpool = '';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    choose: null,
    backtop: 0,
    better: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    //this.dotag({name:'张三'},'sadda')
    //this.dotag( 'dfsfsdfs',{ name: '张三' })
    this.setData({
      better: app.globalData.better
    })
    this.creatviewers(wx.getStorageSync('user'));
    if (wx.getStorageSync('carpool')) {
      console.log('222')
      this.tagCarpool(wx.getStorageSync('carpool'))
    } else {
      this.setData({
        del_tag: 1,
        tag_carpool:'undo',
      })
    }

    if (e.ct == 'yes') {
      this.loading(e.ct);
    } else {
      console.log('调用了云函数')
      wx.cloud.callFunction({
        name: 'login',
        data: {
          name: 'checkcertification'
        }
      }).then(res => {
        //     console.log(res.result)
        if (res.result.checkcertification == 'yes') {
          this.loading(res.result.checkcertification);
        } else {
          wx.showToast({
            title: '状态异常请重试',
            icon: 'none'
          })
          wx.navigateBack({
            delta: 1
          })
        }
      }).catch(err => {
        // handle error
      })
    }
  },
  loading: function (e) {//如果身份认证成功进行以下函数
    if (e == 'yes') {
      db.collection('carpool').where({
        status: 'doing',
    
      }).orderBy('date', 'desc').limit(20).get().then(
        carpool => {
          // console.log(carpool.data)
          var valcarpool = this.valCarpool(carpool.data);
          this.setData({
            carpool: valcarpool//展示组队信息
            //carpool: carpool.data
          })
          len = carpool.data.length;
        })
      wx.stopPullDownRefresh()
    } else {
      wx.showToast({
        title: '状态异常',
        icon: 'none'
      })
      wx.navigateBack({
        delta: 1
      })
    }
  },/******* */
  valCarpool: function (e) {
    var val_carpool = e;
    for (var i = 0; i < e.length; i++) {
      if (this.checkValidity(e[i]) != 'yes') {
        //    console.log('无效')
        val_carpool[i].end_tag = 1;
      } else {
        val_carpool[i].end_tag = 0;
      }
    }
    return val_carpool
  },
  creatviewers: function (e) {
    //   console.log(e)
    if (e.certification == 'yes') {
      db.collection('cpviewer').add({
        data: {
          campus: e.campus,
          major: e.major,
          sex: e.sex,
          student_id: e.student_id
        }
      })
        .then(res => {
          console.log(res)
        })
        .catch(console.error)
    } else {
      wx.showToast({
        title: '状态异常',
        icon: 'none'
      })
      wx.navigateBack({
        delta: 1
      })
    }
    db.collection('cpviewer').count().then(
      cpviewers => {
        this.setData({
          viewers: cpviewers.total
        })
      })
  },
  //检查是否有仍未结束的拼车事件
  tagCarpool: function (e) {
    if (typeof (e) == null) {
      this.setData({
        del_tag: 1,
        //tag_carpool:'undo',
      })
    } else {
      console.log('执行了')
      db.collection('carpool').doc(e).get({
        success: res => {
          console.log(res)
          var validity = this.checkValidity(res.data);
          var checktime0 = this.checkTime(res.data);
          console.log(validity)
          if (validity == 'yes') {
            if(checktime0=='ok')
            {
              this.setData({
                tag_carpool: 'doing',
              })
            }
            else
            {
              this.setData({
                del_tag: 1,
                tag_carpool: 'undo',
              }) 
            }
            mycarpool = res.data
          } else {
            if (checktime0=='ok')
            {
              this.setData({
                del_tag: 0,
                tag_carpool: 'doing',
              }) 
              }
            else
            {
              this.setData({
                del_tag: 1,
                tag_carpool: 'undo',
              }) 
            }
            mycarpool = res.data
          }
        },
        fail: function () {
          console.log(validity)
          wx.showToast({
            title: '服务器异常',
            icon: 'none'
          })
        },
        complete: function (e) {
          /* console.log(validity)
          wx.showToast({
            title: '服务器异常',
            icon: 'none'
          }) */
          if (!e.data) {
            console.log(e)
            wx.showToast({
              title: '服务器异常',
              icon: 'none'
            })
          } else {
            console.log(e)
          }
        },
      })
    }
  },
  checkValidity: function (e) {
    var validity = '';
    var checktime = this.checkTime(e)
    // console.log(checktime)
    if (e.status == 'doing' && /*e.now_nums<e.people_nums*/ e.sharing.length + 1 < e.people_nums /*&& checktime == 'ok'*/) {
      validity = 'yes';
      /*   this.setData({
          tag_carpool: 'doing'
        }) */
      //   console.log('有效')
    } else {
      validity = 'no'
      console.log('zhe')
      /* this.setData({
        tag_carpool: null
      }) */
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
    this.onLoad({
      ct: ''
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    wx.showLoading({
      title: '加载中',
    })
    //  console.log(len)
    db.collection('carpool').skip(len).where({
      status: 'doing'
    }).orderBy('date', 'desc')
      .get({
        success: morebt => {
          console.log(morebt.data)
          if (morebt.data.length == 0) {
            wx.hideLoading()
            wx.showToast({
              title: '已经没有更多了',
              icon: 'none'
            })
          } else {
            carpool_b = morebt.data
            //  console.log(carpool_b)
            this.selectCampus('more');
            this.selectCampus('more');
            this.selectDestination('more');
            this.selectOrigin('more');
            //    console.log(this.data.carpool)
            //  this.valCarpool(carpool_a)
            console.log(carpool_b)
            let carpool_a = this.data.carpool.concat(carpool_b)
            this.setData({
              carpool: carpool_a
              // carpool: 
            })
            //     console.log(this.data.carpool)
            len = len + morebt.data.length;
            //    console.log(len)
            wx.hideLoading()
          }

        },
        fail: function (morebt) {
          console.error
        }
      })
  },
  doselect: function (e) {

  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  onBackPage: function () {
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
  numSteps() {
    this.setData({
      num: this.data.num == this.data.numList.length - 1 ? 0 : this.data.num + 1
    })
  },
  onCarpoolView: function (e) {
    console.log(e)
    wx.navigateTo({
      url: 'carpoolDetail?detail=' + JSON.stringify(this.data.carpool[e.currentTarget.dataset.id]),
      fail: function () {
        wx.showToast({
          title: '系统错误',
          icon: 'none'
        })
      }
    })
  },
  onDestination: function (e) {
    if (!this.data.choose) {
      this.select('destination');
    } else {
      this.setData({
        choose: null
      })
    }
  },
  onDate: function (e) {
    if (!this.data.choose) {
      this.select('date');
    } else {
      this.setData({
        choose: null
      })
    }
  },
  onOrigin: function (e) {
    // console.log(e)
    if (!this.data.choose) {
      this.select('origin');
    } else {
      this.setData({
        choose: null
      })
    }
  },
  onCampus: function (e) {
    // console.log(e)
    if (!this.data.choose) {
      this.select('campus')
    } else {
      this.setData({
        choose: null
      })
    }
  },
  onChoose: function (e) {
    if (this.data.choose == 'campus') {
      this.setData({
        campus: e.target.dataset.name
      })
      this.selectCampus(e.target.dataset.name)
      this.onBacktop()
    } else if (this.data.choose == 'origin') {
      this.setData({
        origin: e.target.dataset.name
      })
      this.selectOrigin(e.target.dataset.name)
      this.onBacktop()
    } else if (this.data.choose == 'date') {
      this.setData({
        date: e.target.dataset.name
      })
      this.selectDate(e.target.dataset.name)
      this.onBacktop()
    } else if (this.data.choose == 'destination') {
      this.setData({
        destination: e.target.dataset.name
      })
      this.selectDestination(e.target.dataset.name)
      this.onBacktop()
    }
    this.setData({
      choose: null,
      chooseList: null,
    })
  },
  onChooseAll: function (e) {
    if (this.data.choose == 'campus') {
      this.setData({
        campus: null
      })
      this.selectCampus('all_campus')
    } else if (this.data.choose == 'origin') {
      this.setData({
        origin: null
      })
      this.selectOrigin('all_origin')
    } else if (this.data.choose == 'date') {
      this.setData({
        date: null
      })
      this.selectDate('all_date')
    } else if (this.data.choose == 'destination') {
      this.setData({
        destination: null
      })
      this.selectDestination('all_destination')
    }
    this.onBacktop()
    this.setData({
      choose: null,
      chooseList: null,
    })
  },
  //动态展示可选择类型
  select: function (e) {
    // console.log('执行了')
    // console.log(this.data.carpool)
    var chooseList = [];
    if (e == 'campus') {
      for (var i = 0; i < this.data.carpool.length; i++) {
        chooseList.push(this.data.carpool[i].creator.campus)
      }
    } else if (e == 'origin') {
      for (var i = 0; i < this.data.carpool.length; i++) {
        chooseList.push(this.data.carpool[i].origin)
      }
    } else if (e == 'date') {
      for (var i = 0; i < this.data.carpool.length; i++) {
        chooseList.push(this.data.carpool[i].date)
      }
    } else if (e == 'destination') {
      for (var i = 0; i < this.data.carpool.length; i++) {
        chooseList.push(this.data.carpool[i].destination)
      }
    }
    var hash = [];
    for (var j = 0; j < chooseList.length; j++) {
      if (hash.indexOf(chooseList[j]) == -1) {
        hash.push(chooseList[j]);
      }
    }
    //  console.log(hash)
    this.setData({
      choose: e,
      chooseList: hash,
    })
  },
  //对字符串做标记
  dotag: function (a, b) { //a接收一个数组对象，b接收一个筛选关键字
    console.log(typeof a);
    console.log(typeof b);
    if (typeof (b) == 'string') {
      console.log('b为字符串时的操作')
    } else if (typeof (b) == 'object') {
      console.log('b为对象时的操作')
    }
    /*  let do_tag = new Array();
     let key = b;
     let list = a;
     for (let i = 0; i < list.length; i++) {
       let a = key;
       let b = list[i].creator.campus;
       if (b.search(a) != -1) {
         list[i].tag_campus = 0
       } else {
         list[i].tag_campus = 1 //如果没有找到任何匹配的子串，则返回 -1。
       }
     }
     return do_tag; */
  },


  //筛选校区
  selectCampus(e) {
    if (e != 'more') {
      let key = (e == 'all_campus' ? '' : e);
      let list = this.data.carpool;
      for (let i = 0; i < list.length; i++) {
        let a = key;
        let b = list[i].creator.campus;
        if (b.search(a) != -1) {
          list[i].tag_campus = 0
        } else {
          list[i].tag_campus = 1 //如果没有找到任何匹配的子串，则返回 -1。
        }
      }
      this.setData({
        carpool: list
      })
    } else if (e == 'more') {
      let key = (this.data.campus ? this.data.campus : '');
      let list = carpool_b;
      for (let i = 0; i < list.length; i++) {
        let a = key;
        let b = list[i].creator.campus;
        if (b.search(a) != -1) {
          list[i].tag_campus = 0
        } else {
          list[i].tag_campus = 1 //如果没有找到任何匹配的子串，则返回 -1。
        }
        carpool_b = list;
      }
    }
  },
  //筛选日期
  selectDate(e) {
    if (e != 'more') {
      let key = (e == 'all_date' ? '' : e);
      let list = this.data.carpool;
      for (let i = 0; i < list.length; i++) {
        let a = key;
        let b = list[i].date;
        if (b.search(a) != -1) {
          list[i].tag_date = 0
        } else {
          list[i].tag_date = 1 //如果没有找到任何匹配的子串，则返回 -1。
        }
      }
      this.setData({
        carpool: list
      })
    } else if (e == 'more') {
      let key = (this.data.date ? this.data.date : '');
      let list = carpool_b;
      for (let i = 0; i < list.length; i++) {
        let a = key;
        let b = list[i].date;
        if (b.search(a) != -1) {
          list[i].tag_date = 0
        } else {
          list[i].tag_date = 1 //如果没有找到任何匹配的子串，则返回 -1。
        }
      }
      carpool_b = list
    }
  },
  //筛选始发地
  selectOrigin(e) {
    if (e != 'more') {
      let key = (e == 'all_origin' ? '' : e);
      let list = this.data.carpool;
      for (let i = 0; i < list.length; i++) {
        let a = key;
        let b = list[i].origin;
        if (b.search(a) != -1) {
          list[i].tag_origin = 0
        } else {
          list[i].tag_origin = 1 //如果没有找到任何匹配的子串，则返回 -1。
        }
      }
      this.setData({
        carpool: list
      })
    } else if (e == 'more') {
      let key = (this.data.origin ? this.data.origin : '');
      let list = carpool_b;
      for (let i = 0; i < list.length; i++) {
        let a = key;
        let b = list[i].origin;
        if (b.search(a) != -1) {
          list[i].tag_origin = 0
        } else {
          list[i].tag_origin = 1 //如果没有找到任何匹配的子串，则返回 -1。
        }
      }
      carpool_b = list
    }
  },
  //筛选目的地
  selectDestination(e) {
    if (e != 'more') {
      let key = (e == 'all_destination' ? '' : e);
      let list = this.data.carpool;
      for (let i = 0; i < list.length; i++) {
        let a = key;
        let b = list[i].destination;
        if (b.search(a) != -1) {
          list[i].tag_destination = 0
        } else {
          list[i].tag_destination = 1 //如果没有找到任何匹配的子串，则返回 -1。
        }
      }
      this.setData({
        carpool: list
      })
    } else if (e == 'more') {
      let key = (this.data.destination ? this.data.destination : '');
      let list = carpool_b;
      for (let i = 0; i < list.length; i++) {
        let a = key;
        let b = list[i].destination;
        if (b.search(a) != -1) {
          list[i].tag_destination = 0
        } else {
          list[i].tag_destination = 1 //如果没有找到任何匹配的子串，则返回 -1。
        }
      }
      carpool_b = list
    }
    // var carpool_a =[];//用来存放标记序列
    // var carpool_c = [];//用来存放没有被标记的序列
    /*   */
    console.log(e)
    /*    if(e=='all_campus'){
         this.second(e)
       }else if(e==) */
  },

  //监听屏幕滚动 判断上下滚动  
  onPageScroll: function (event) {
    // console.log(event)
    //判断浏览器滚动条上下滚动   
    if (event.scrollTop < scrollTop) {
      //   console.log('向上滚动');
      up = up - (event.scrollTop - scrollTop)
      //   console.log(up)
      scrollTop = event.scrollTop
    } else {
      //  console.log('向下滚动');
      //向下滚动时自动隐藏选项框并更新scrollTop的值
      scrollTop = event.scrollTop
      up = 0
      this.setData({
        backtop: 1,
        choose: null
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
      scrollTop: 0
    })
  },
  //发起拼车
  startCarpool: function (e) {
    console.log(e)
    if (wx.getStorageSync('user').certification == 'yes') {
      wx.navigateTo({
        url: 'startCarpool',
      })
    } else {
      wx.showToast({
        title: '加载失败请重试',
        icon: 'none'
      })
    }

    //再此核实身份 --云函数执行
    //再弹出发起拼车的信息
    //如果身份信息没有完善则弹出提示完善身份信息的弹窗
  },
  //我的拼车
  myCarpool: function (e) {
    console.log(e)
    wx.navigateTo({
      url: 'carpoolDetail?detail=' + JSON.stringify(mycarpool),
    })
    //根据本地缓存的ID查找信息
    ///如果查找不到则提示异常
  }
})
//拼车的详情页
//拼车信息的填写弹窗
//加入拼车页面or操作
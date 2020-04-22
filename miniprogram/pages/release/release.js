// miniprogram/pages/release/releasechooice.js
const app = getApp()
var util = require('../../utils/util.js')
const db = wx.cloud.database()
const _ = db.command
var mydata = new Object();
var stuidlen = 0;
var stuid = '0';
var scrollTop = 0;
var postimgid = 'http://b182.photo.store.qq.com/psb?/V1440qhp31sLv2/fqIBhGH380t3bGaRDNWzywDRlebvIf4Q4EHWulTCDW8!/m/dLYAAAAAAAAAnull&bo=3wDfAAAAAAADByI!&rf=photolist&t=5';
var nickName = '不愿透露姓名的同学';
/*
var _openid22 = 0;
var name22 = 0;
var stuid22 = 0;
var formId22 = 0;
var phone22 = 0;
var time22 = 0;
var location22 = 0;
var associated_id22 = 0;
var mold22 = 0;

var width = 0;
var height = 0; */
Page({

  /**
   * 页面的初始数据
   */
  data: {

    /* b1: 'button-sp-area',
    b2: 'button-sp-area1',
    bgc1: 'rgb(246, 243, 243)',
    bgc2: 'white',
    bgc3: '',
    bgc4: '', */
    post_upload: null,
    typeid: 0,
    type: util.type,
    typec: '',
    studentidcard: true,
    yes: 0,
    //  location: util.location,
    //  locationc: '浑南校区1号楼A区',
    //   location0: '浑南校区',
    //   location1: '1号楼',
    //  location2: 'A区',
    //  locationid: [0, 0, 0],
    modaltype: 'choosetype',
    class1: '寻物启事'
  },
  onLoad: function (options) {
    wx.showLoading({
      title: '数据加载中',
    })
    // var date1 = util.formatDate(new Date()) //获取日期
    // var timename = util.formatTimename(new Date()) //获取时间，用于命名
    //var user = wx.getStorageSync('user');
    this.setData({
      imgid: [],
      tempFilePaths: [],
    })
    this.checkidentify()
    this.loadList()
    wx.hideLoading()
    wx.stopPullDownRefresh()
    wx.getSystemInfo({
      success: (res => {
        console.log(res);
        // 屏幕宽度、高度
        console.log('height=' + res.windowHeight);
        console.log('width=' + res.windowWidth);
        // 高度,宽度 单位为px
        this.setData({
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth
        })
      })
    })
    this.getPrivacySetting()
  },
  getPrivacySetting: function () {
    let setting = wx.getStorageSync('user').privacySetting;
    if (setting[0] == 'success') {
      postimgid = wx.getStorageSync('userInfo').avatarUrl;
    }
    if (setting[1] == 'success') {
      nickName = wx.getStorageSync('userInfo').nickName;
    }
  },
  /* checkboxChange1: function(e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)

  },
  checkboxChange2: function(e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)

  },
  radioChange: function(e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    this.setData({
      scopec: e.detail.value
    })
  }, */

  checktype: function (e) {
    this.setData({
      picktype: 1
    })
    this.setData({
      modaltype: null,
    })
  },
  bindPickerChange: function (e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      //  picktype: 1,
      typeid: e.detail.value,
      typec: this.data.type[e.detail.value],
      picktype: 1
    })
    if (e.detail.value == 0) {
      //  this.typeModal(0)

      this.setData({
        modaltype: 'pickcard',
      })
      console.log(this.data.modaltype)
    } else {
      //  this.typeModal(1)
      this.setData({
        modaltype: null,
      })
    }
  },
  addtopic: function (e) {
    this.setData({
      modalName: 'addtopic'
    })
  },
  choosetopic: function (e) {
    if (e.currentTarget.dataset.name == 1) {
      this.setData({
        modalName: null,
        topic: null
      })
    } else {
      this.setData({
        modalName: null,
        topic: e.currentTarget.dataset.name
      })
    }
  },
  typeModal: function (e) {
    //0为show,其它为隐藏
    if (e == 0) {
      this.setData({
        modalName: 'picktype',
      })
    } else {
      this.setData({
        modalName: null
      })
    }
  },
  addlocation: function (e) {
    this.setData({
      modalName: 'addlocation'
    })
  },
  chooselocation: function (e) {
    this.setData({
      modalName: null,
      location0: e.currentTarget.dataset.location0,
      location1: e.currentTarget.dataset.location1,
      location2: e.currentTarget.dataset.location2,
    })
  },
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },

  /*   bindlocationPickerChange: function(e) {
       //console.log('picker发送选择改变，携带值为', e.detail.value)
      this.setData({
        locationid: e.detail.value
      })
    }, */
  bindlocationPickerColumnChange: function (e) {
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    var data = {
      location: util.location,
      locationid: this.data.locationid,
    };
    data.locationid[e.detail.column] = e.detail.value;
    //    console.log(data.locationid[e.detail.column]);
    if (data.locationid[1] == 1) {
      var c2 = 1;
    } else if (data.locationid[1] == 11) {
      var c2 = 2;
    } else if (data.locationid[1] == 12) {
      var c2 = 3;
    } else if (data.locationid[1] == 13) {
      var c2 = 4;
    } else {
      var c2 = 0;
    }
    switch (e.detail.column) {
      case 0:
        switch (data.locationid[0]) {
          case 0:
            data.location[1] = util.building_hunnan;
            data.location[2] = ['A区', 'B区'];
            //  console.log(data.location[1])
            break;
          case 1:
            data.location[1] = util.building_nanhu;
            data.location[2] = util.zone_nanhu;
            break;
        }
        data.locationid[1] = 0;
        data.locationid[2] = 0;
        break;
      case 1:
        switch (data.locationid[0]) {
          case 0:
            switch (c2) {
              case 0:
                data.location[2] = ['A区', 'B区'];
                break;
              case 1:
                data.location[2] = ['南侧', '北侧'];
                break;
              case 2:
                data.location[2] = ['食堂', '澡堂', '超市', '水果超市', '文印室', '快递站'];
                break;
              case 3:
                data.location[2] = ['一楼', '二楼'];
                break;
              case 4:
                data.location[2] = ['南侧', '东侧'];
                break;
            }
            break;
          case 1:
            switch (data.locationid[1]) {
              case 0:
                data.location[2] = util.zone_nanhu;
                break;
              case 1:
                data.location[2] = util.zone_nanhu;
                break;
              case 2:
                data.location[2] = util.zone_nanhu;
                break;
            }
            break;
        }
        data.locationid[2] = 0;
        break;
    }
    //console.log(data.locationid);
    //console.log(data.location);
    var locationc = data.location[0][data.locationid[0]] + ' ' + data.location[1][data.locationid[1]] + ' ' + data.location[2][data.locationid[2]];
    console.log(locationc)
    //this.setData(data)
    this.setData({
      picklocation: 1,
      locationid: data.locationid,
      locationc: locationc,
      location0: data.location[0][data.locationid[0]],
      location1: data.location[1][data.locationid[1]],
      location2: data.location[2][data.locationid[2]],
      check_location: 1
    });
  },

  input: function (e) {
    this.setData({
      detail: e.detail.value
    })
  },
  titleinput: function (e) {
    this.setData({
      title: e.detail.value
    })
  },
  input_location0: function (e) {
    this.setData({
      location0: e.detail.value
    })
  },
  input_location1: function (e) {
    this.setData({
      location1: e.detail.value
    })
  },
  input_location2: function (e) {
    this.setData({
      location2: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */

  checkidentify: function () {
    var user = wx.getStorageSync('user')
    if (user.identity == 'administrator') {
      this.setData({
        iconList: util.iconList2
      })
    } else {
      this.setData({
        iconList: util.iconList1
      })
    }
  },
  onlost: function () {
    /* if (this.data.choose2 == 'primary') {
      this.setData({
        choose2: 'default',
      })
    } */
    this.setData({
      choose1: 'primary',
      choose2: 'default',
      choose3: 'default',
      choose4: 'default',
      bgc1: '#D3D3D3;',
      bgc2: '',
      bgc3: '',
      bgc4: '',
      mold: 'post_lost',
      title: '求助！！！我丢了东西',
    })
  },
  onfound: function () {
    /* if (this.data.choose1 == 'primary' || this.data.choose3 == 'primary' || this.data.choose4 == 'primary') {
      this.setData({
        choose1: 'default',
      })
    } */
    this.setData({
      choose1: 'default',
      choose2: 'primary',
      choose3: 'default',
      choose4: 'default',
      bgc1: '',
      bgc2: '#D3D3D3',
      bgc3: '',
      bgc4: '',
      mold: 'post_found',
      title: '我捡到了某同学丢失的物品',
    })
  },
  onnotice: function () {
    /* if (this.data.choose4 == 'primary' || this.data.choose2 == 'primary' || this.data.choose1 == 'primary') {
      this.setData({
        choose4: 'default'
      })
    } */
    this.setData({
      choose4: 'default',
      choose3: 'primary',
      choose1: 'default',
      choose2: 'default',
      bgc1: '',
      bgc2: '',
      bgc3: '#D3D3D3',
      bgc4: '',
      mold: 'post_notice'
    })
  },
  onrelease1: function () {
    /*  if (this.data.choose3 == 'primary') {
       this.setData({
         choose3: 'default'
       })
     } */
    this.setData({
      choose4: 'primary',
      choose3: 'default',
      choose1: 'default',
      choose2: 'default',
      bgc1: '',
      bgc2: '',
      bgc3: '',
      bgc4: '#D3D3D3',
      mold: 'found'
    })
  },
  feile: function (e) {
    wx.showLoading({
      title: '发布中',
    })
    //  console.log('form发生了submit事件，携带数据为：', e.detail.value);
    //   console.log(e.detail.value.type);
    // console.log(this.data.tempFilePaths);
    //根据隐私设置将相应信息设置好
    if (this.data.user.privacySetting[0] == 'success') {
      var postimgid = this.data.userInfo.avatarUrl
    } else {
      postimgid = 'cloud://neuhelper-1ol0o.6e65-neuhelper-1ol0o/NEU/自管会.jpg'
    }
    if (this.data.user.privacySetting[1] == 'success') {
      var nickName = this.data.userInfo.nickName
    } else {
      nickName = '某位不愿意透露姓名的同学'
    }
    if (this.data.user.identity == 'user') {
      var identity = 'user';
    } else if (this.data.identity == 'administrator') {
      identity = 'administrator';
    }
    if (this.data.location0 == '浑南校区') {
      var campus = '浑南'
    } else {
      campus = '南湖'
    }
    if (this.data.mold == 'post_lost') {
      var class1 = '寻物'
    } else {
      class1 = '招领'
    }
    if (this.data.checkstuid == 'yes') {
      //如果能在数据库中找到这么条消息
      //先给对方发送失物招领通知，将自己的信息发送过去
      //判断选择的是寻物还是招领来决定发送模板的文字
      if (this.data.mold == 'post_lost') {
        var stu21 = 'ta的学号是：' + e.detail.value.student_id;
        var type221 = '失主前来认领通知';
        var stu22 = '请您尽快前去认领';
        var type222 = '学生证已找到通知';
      } else {
        stu21 = 'ta捡到学生证的学号是：' + stuid;
        type221 = '学生证已找到通知';
        stu22 = '请您尽快前去认领';
        type222 = '失主前来认领通知';
      }
      wx.cloud.callFunction({
        // 要调用的云函数发送模板消息
        name: 'template',
        data: {
          entrance: 'post',
          _openid2: _openid22, //对方的OPENID
          name2: this.data.user.name, //自己的姓名
          stuid2: stu21, //自己的学号
          formId2: formId22, //对方提交表单的ID
          phone2: e.detail.value.phone, //自己的联系方式
          time2: util.formatTime(new Date()), //自己的时间
          location2: location22,
          type2: type221, //类型
          stuid22: e.detail.value.student_id, //更新此条失物招领状态避免下次查询继续套用
        }
      }).then(r4 => {
        //wx.hideLoading()
        //然后给自己发通知里面是对方的信息。紧接着自己跳到详情页
        wx.cloud.callFunction({
          // 要调用的云函数发送模板消息
          name: 'template',
          data: {
            entrance: 'post',
            _openid2: this.data.user._openid, //自己的OPENID
            name2: name22, //对方的姓名
            stuid2: stu22, //物品描述一栏
            formId2: e.detail.formId, //自己提交的表单formId
            phone2: phone22, //对方的联系方式
            time2: time22, //对方发现的时间
            location2: location22,
            type2: type222, //类型
            stuid22: e.detail.value.student_id, //这条是为了避免调用云函数时这个数据为endefind型产生错误而加的
          }
        })
        console.log(r4)
        wx.hideLoading()
        //console.log(res)
        wx.showToast({
          title: '发布成功',
        })
        wx.redirectTo({
          url: '../lostAndFound/detail/detail?pot=' + JSON.stringify([associated_id22, mold22, 'index'])
        })

      }).catch(err => {
        // handle error
        console.error
      })
    } else {
      //如果在数据库中是没有这条消息的则进行相应的操作
      if (this.data.typec == '卡证') {
        this.setData({
          imgid2: 'cloud://neuhelper-1ol0o.6e65-neuhelper-1ol0o/NEU/学生证3.png'
        })
      } else {
        if (!this.data.tempFilePaths) {
          this.setData({
            imgid2: '0'
          })
        }
      }
      // console.log(this.data.imgid2[0])'cloud://neuhelper-1ol0o.6e65-neuhelper-1ol0o/NEU/1.png'
      // console.log(this.data.tempFilePaths[0])

      //  var post = new Object;
      //console.log(this.data.imgid2[0])
      //console.log(this.data.imgid2.length)
      if (this.data.imgid2) {
        db.collection('post').add({
          data: {
            certification: this.data.certification,
            type: this.data.typec,
            nickName: nickName,
            formId: e.detail.formId,
            cardid: e.detail.value.student_id,
            cardname: e.detail.value.student_name,
            imgid: this.data.imgid2,
            contact: e.detail.value.phone,
            date: e.detail.value.date,
            detail: e.detail.value.detail,
            postimgid: postimgid,
            location0: this.data.location0,
            location1: this.data.location1,
            location2: this.data.location2,
            campus: campus,
            class1: class1,
            state: '0',
            identity: identity,
            time: util.formatTime(new Date()),
            title: this.data.title,
            comments: 0,
            viewers: viewers,
            width: width,
            height: height,
          },
          success: (res => {
            //  console.log('失物招领的集合上已添加')
            //在失物招领的集合上添加成功，则更新用户数据，在历史记录一栏增加新的信息
            var user = this.data.user;
            var add = {
              _id: res._id,
              time: util.formatTime(new Date()),
              type: this.data.mold,
              status: 'doing'
            }
            user.history.push(add)
            wx.setStorageSync('user', user)
            db.collection('user').doc(user._id).update({
              // data 传入需要局部更新的数据
              data: {
                // 表示将 done 字段置为 true
                history: user.history
              },
              success: (rr => { }),
              fail: console.error
            })
            console.log('checkstuid=no ')
            if (this.data.mold == 'post_found' || this.data.mold == 'post_lost') {
              //继续在遗失学生证的集合添加记录
              db.collection('lost_idcard').add({
                data: {
                  student_id: e.detail.value.student_id,
                  associated_id: res._id, //关联此条内容的id
                  date: this.data.date,
                  type: this.data.mold,
                  formId: e.detail.formId,
                  location: this.data.location0 + this.data.location1 + this.data.location2,
                  name: nickName,
                  phone: e.detail.value.phone,
                  time: util.formatTime(new Date()),
                  state: 'doing'
                },
                success: (r2 => {
                  // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
                  wx.hideLoading()
                  //console.log(res)
                  wx.showToast({
                    title: '发布成功',
                  })
                  wx.redirectTo({
                    url: '../lostAndFound/detail/detail?pot=' + JSON.stringify([res._id, this.data.mold, 'index'])
                  })
                }),
                fail: console.error
              })
            } else {
              wx.hideLoading()
              //console.log(res)
              wx.showToast({
                title: '发布成功',
              })
              wx.redirectTo({
                url: '../lostAndFound/detail/detail?pot=' + JSON.stringify([res._id, this.data.mold, 'index'])
              })
            }
          }),
          fail: console.error
        })
      }
    }
  },
  formReset1: function () {
    console.log('form发生了reset事件')
    wx.reLaunch({
      url: '/pages/lostAndFound/lostAndFound',
    })
  },
  formSubmit2: function (e) {
    wx.showLoading({
      title: '发布中',
    })

    if (e.detail.value.scope1 == '南湖校区') {
      var scope2 = e.detail.value.scope2
    } else if (e.detail.value.scope1 == '浑南校区') {
      var scope2 = e.detail.value.scope3
    }
    console.log('form发生了submit事件，携带数据为：', e.detail.value);
    console.log(this.data.imgid2[0])
    var imgid = this.data.imgid2;
    db.collection(this.data.mold).add({
      data: {
        title: e.detail.value.notice_title,
        name: this.data.userInfo.nickName,
        date: this.data.date,
        formId: e.detail.formId,
        detail: e.detail.value.textarea2,
        scope1: e.detail.value.scope1,
        scope2: scope2,
        scope3: '所有类型',
        time: util.formatTime(new Date()),
        imgid: imgid,
        type: '通知'
      },
      success: (res => {
        // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
        wx.hideLoading()
        //console.log(res)
        wx.showToast({
          title: '发布成功',
        })
        // console.log(imgid)
        wx.redirectTo({
          url: '../notice/notice-detail/notice-detail?postnotice=' + JSON.stringify([res._id, this.data.mold])
        })
      }),
      fail: console.error
    })
    console.log(this.data.imgid2[0])

  },
  formReset2: function (e) {
    console.log('form发生了reset事件')
    wx.reLaunch({
      url: '/pages/lostAndFound/lostAndFound',
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
    var user = wx.getStorageSync('user')
    if (user.certification != 'yes') {
      this.setData({
        modalName: 'Image'
      })
    }
  },
  ViewImage: function (e) {
    wx.previewImage({
      current: this.data.tempFilePaths[0], // 当前显示图片的http链接
      urls: this.data.tempFilePaths // 需要预览的图片http链接列表
    })
  },
  DelImg: function (e) {
    this.data.tempFilePaths.splice(e.currentTarget.dataset.index, 1);
    this.setData({
      tempFilePaths: this.data.tempFilePaths
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
  certifying: function (e) {
    wx.navigateTo({
      url: '../certifying/certifying',
    })
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
  inputstuid: function (e) {
    stuid = e.detail.value,
      stuidlen = e.detail.cursor
  },
  checkstuid: function (e) {

    if (stuidlen == '7') {
      wx.showToast({
        title: '学号可能不正确',
        icon: 'none'
      })
    } else if (stuidlen == '8') {

      db.collection('lost_idcard').where({
        student_id: stuid,
        state: 'doing'
      }).orderBy('time', 'desc').get({
        success: (r2 => {
          if (r2.data.length == 0) {

          } else {
            this.setData({
              foundcard: 1,
              detail_id: r2.data[0].associated_id
            })
            /* //如果能在数据库中找到这么条消息
            //先给对方发送失物招领通知，将自己的信息发送过去
            //判断选择的是寻物还是招领来决定发送模板的文字
            if (this.data.class1 == '寻物启事') {
              var stu21 = 'ta的学号是：' + e.detail.value.student_id;
              var type221 = '失主前来认领通知';
              var stu22 = '请您尽快前去认领';
              var type222 = '学生证已找到通知';
            } else {
              stu21 = 'ta捡到学生证的学号是：' + stuid;
              type221 = '学生证已找到通知';
              stu22 = '请您尽快前去认领';
              type222 = '失主前来认领通知';
            }
            wx.cloud.callFunction({
              // 要调用的云函数发送模板消息
              name: 'template',
              data: {
                entrance: 'post',
                _openid2: r2.data[0]._openid, //对方的OPENID
                name2: this.data.user.name, //自己的姓名
                stuid2: stu21, //自己的学号
                formId2: formId22, //对方提交表单的ID
                phone2: e.detail.value.phone, //自己的联系方式
                time2: util.formatTime(new Date()), //自己的时间
                location2: location22,
                type2: type221, //类型
                stuid22: e.detail.value.student_id, //更新此条失物招领状态避免下次查询继续套用
              }
            }).then(r4 => {
              //wx.hideLoading()
              //然后给自己发通知里面是对方的信息。紧接着自己跳到详情页
              wx.cloud.callFunction({
                // 要调用的云函数发送模板消息
                name: 'template',
                data: {
                  entrance: 'post',
                  _openid2: this.data.user._openid, //自己的OPENID
                  name2: r2.data[0].name, //对方的姓名
                  stuid2: stu22, //物品描述一栏
                  formId2: e.detail.formId, //自己提交的表单formId
                  phone2: phone22, //对方的联系方式
                  time2: time22, //对方发现的时间
                  location2: location22,
                  type2: type222, //类型
                  stuid22: e.detail.value.student_id, //这条是为了避免调用云函数时这个数据为endefind型产生错误而加的
                }
              })
              console.log(r4)
              wx.hideLoading()
              //console.log(res)
             /*  wx.showToast({
                title: '发布成功',
              })
              wx.redirectTo({
                url: '../lostAndFound/detail/detail?pot=' + JSON.stringify([associated_id22, mold22, 'index'])
              })

            }).catch(err => {
              // handle error
              console.error
            }) */
          }
          console.log(r2.data)
          console.log(r2.data.length)
        })
      })

    } else {
      wx.showToast({
        title: '请检查学号',
        icon: 'none'
      })
    }
    // console.log(e)
  },
  hideFoundcard: function (e) {
    this.setData({
      foundcard: null
    })
  },
  toDetail: function (e) {
    this.hideFoundcard()
    console.log('去往详情页')
    wx.navigateTo({
      url: '../lostAndFound/detail/detail?detail_id=' + this.data.detail_id
    })
  },
  invalidtap: function (e) {
    if (this.data.post_upload == null) {
      wx.showToast({
        title: '请输入联系方式',
        icon: 'none'
      })
    } else if (this.data.post_upload == 'doing') {
      wx.showToast({
        title: '上传照片中',
        icon: 'none'
      })
    }
  },
  input_phone: function (e) {
    // console.log(e)
    if (e.detail.value != null) {
      this.setData({
        post_upload: 'done'
      })
    }
  },
  //监听屏幕滚动 判断上下滚动  
  onPageScroll: function (event) {
    // console.log(event)
    //判断浏览器滚动条上下滚动   
    if (event.scrollTop >= scrollTop) {
      //  console.log('向下滚动');
      //向下滚动时自动隐藏导航栏并更新scrollTop的值
      wx.hideTabBar()
      scrollTop = event.scrollTop
    } else {
      //   console.log('向上滚动');
      wx.showTabBar({})
      scrollTop = event.scrollTop
    }
  },
  onBackPage: function (e) {
    wx.navigateBack({
      delta: 1
    })
  },
  pick: function (e) {
    // console.log(e.currentTarget.dataset.name)
    this.setData({
      class1: e.currentTarget.dataset.name
    })
    this.hideModaltype()
  },
  picklost: function (e) {
    this.pick(e)
    this.loadList(0)
  },
  pickfound: function (e) {
    this.pick(e)
    this.loadList(1)
  },
  pickexperience: function (e) {
    this.pick(e)
    this.loadList(2)
  },
  pickhelp: function (e) {
    this.pick(e)
    this.loadList(3)
  },
  pickwarning: function (e) {
    this.pick(e)
    this.loadList(4)
  },
  pickcomplain: function (e) {
    this.pick(e)
    this.loadList(5)
  },
  picknotice: function (e) {
    this.pick(e)
    this.loadList(6)
  },
  pickgroup: function (e) {
    this.pick(e)
    this.loadList(7)
  },
  hideModaltype: function (e) {
    this.setData({
      modaltype: null
    })
  },
  chooseClass: function () {
    this.setData({
      modaltype: 'choosetype'
    })
  },
  loadList: function (e) {
    this.setData({
      locationList: util.locationList
    })
    /*  db.collection('topic').get({
       success: (res => {
         // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
         this.setData({
           topicList: res.data
         })
       }),
       fail: console.error
     }) */
  },
  //收集所有表单信息，调用上传接口
  onRelease: function (e) {
    //console.log(e)
    mydata = e.detail.value;
    mydata.formId = e.detail.formId;
    mydata.class1 = this.data.class1;
    mydata.location0 = this.data.location0;
    mydata.location1 = this.data.location1;
    mydata.location2 = this.data.location2;
    mydata.date = util.formatDate(new Date());
    mydata.time = util.formatTime(new Date());
    mydata.nickName = nickName;
    mydata.postimgid = postimgid;
    mydata.identity = wx.getStorageSync('user').identity;
    mydata.certification = wx.getStorageSync('user').certification;
    mydata._openid = wx.getStorageSync('user')._openid;
    mydata.viewers = 10 + Math.ceil(Math.random() * 10);
    mydata.imgid = this.data.imgid;
    mydata.comments = [0, [{}]];
    mydata.state = '0';
    mydata.topic = this.data.topic;
    mydata.type = this.data.typec;
    if (this.data.class1 == '寻物启事' || this.data.class1 == '失物招领') {
      if (!mydata.title) {
        mydata.title = '我没有标题喔~'
      } else if (!this.data.picktype) {
        wx.showToast({
          title: '请选择物品类型',
          icon: 'none'
        })
      } else if (!e.detail.value.detail) {
        wx.showToast({
          title: '请输入详细情况',
          icon: 'none'
        })
      } else {
        if (this.data.tempFilePaths.length == 0) {
          console.log('1')
          this.upform()
        } else {
          console.log('2')
          this.setData({
            updata: 1
          })
          this.uploadimg({
            tempFilePaths: this.data.tempFilePaths
          })
        }
      }
    } else {
      if (!mydata.title) {
        mydata.title = '我没有标题喔~'
      } else if (!e.detail.value.detail) {
        wx.showToast({
          title: '请输入详情',
          icon: 'none'
        })
      } else {
        if (this.data.tempFilePaths.length == 0) {
          this.upform()
        } else {
          this.setData({
            updata: 1
          })
          this.uploadimg({
            tempFilePaths: this.data.tempFilePaths
          })
        }
      }
    }

    /* mydata.imgid = this.data.imgid;
    mydata.display = this.data.display; */
    console.log(e)
    /* db.collection('post').add({
      data: mydata,
      success: function(res) {
        // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
        console.log(res)
      },
      fail: console.error
    }) */
  },
  //将表单信息上传云函数接口
  upform: function (e) {
    //  console.log('执行了')
    //  console.log(mydata)
    delete mydata._openid;
    db.collection('post').add({
      data: mydata,
      success: res => {
        // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
        //   console.log(res)
        this.upformdone(res._id)
      },
      fail: console.error,
      complete: function (e) {
        //   console.log(e)
      }
    })
  },
  upformdone: function (e) {
    this.setData({
      updata: null
    })
    //   console.log(e)
    var user = wx.getStorageSync('user');
    var add = {
      _id: e,
      time: util.formatTime(new Date()),
      type: this.data.class1,
      status: 'doing'
    }
    user.history.push(add)
    wx.setStorageSync('user', user)
    //   console.log(user._id)
    db.collection('user').doc(user._id).update({
      // data 传入需要局部更新的数据
      data: {
        // 表示将 done 字段置为 true
        history: _.push(add)
      },
      success: (rr => {
        wx.redirectTo({
          url: '../lostAndFound/detail/detail?release=' + e
        })
      }),
      fail: console.error
    })



  },
  searchLocation: function (e) {
    let key = e.detail.value;
    let list = this.data.locationList;
    for (let i = 0; i < list.length; i++) {
      let a = key;
      let b = list[i].location;
      if (b.search(a) != -1) { //如果没有找到任何匹配的子串，则返回 -1。
        list[i].isShow = true
      } else {
        list[i].isShow = false
      }
    }
    this.setData({
      locationList: list
    })
  },
  chooseimage: function () {
    //    console.log('choose1')
    var fration = 0;
    wx.chooseImage({
      count: 9,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res => {
        console.log('成功')
        /*  wx.getImageInfo({
           src: res.tempFilePaths[0],
           success(re2) {
             fration = re2.width / re2.height;
             if (fration < 0.8 && re2.height < 500) {
               width = 320;
               height = 480;
             } else if (fration < 0.8 && re2.height >= 500) {
               width = 711.44;
               height = 711.44;
             } else if (fration >= 0.8 && fration <= 1.2 && re2.height <= 500) {
               width = 400;
               height = 400;
             } else if (fration >= 0.8 && fration <= 1.2 && re2.height > 500) {
               width = 711.44;
               height = 711.44;
             } else if (fration >= 1.2) {
               width = 711.44;
               height = 480;
             }
             console.log(width)
             console.log(height)
           }
         }) */
        this.setData({
          tempFilePaths: res.tempFilePaths,
        })
      }),
      fail: (res => {
        console.log('选择照片失败')
      }),
      complete: function (res) { },
    })

  },
  uploadimg: function (e) {
    var that = this;
    var i = (i = e.i ? e.i : 0);
    var success = (success = e.success ? e.success : 0);
    var fail = (fail = e.fail ? e.fail : 0);
    //   console.log(e);
    //  console.log(e.tempFilePaths[i]);
    wx.cloud.uploadFile({
      cloudPath: 'postimage/' + this.data.class1 + '/' + e.date + '/' + util.formatTimename(new Date()) + i + '.jpg',
      filePath: e.tempFilePaths[i],
      success: (resp => {
        // console.log(resp.fileID)
        success++;
        var imgid = this.data.imgid;
        console.log(this.data.imgid);
        imgid.push(resp.fileID);
        this.setData({
          imgid: imgid
        })
      }),
      fail: (res) => {
        fail++;
        console.log('fail:' + i + "fail:" + fail);
      },
      complete: () => {
        i++;
        if (i == e.tempFilePaths.length) { //当图片传完时，停止调用     
          //         console.log('执行完毕');
          console.log('成功：' + success + " 失败：" + fail);
          this.uploadimgdone()
          var myEventDetail = {
            picsList: that.data.detailPics
          } // detail对象，提供给事件监听函数
          var myEventOption = {} // 触发事件的选项
          that.triggerEvent('myevent', myEventDetail, myEventOption) //结果返回调用的页面
          console.log(picsList)
        } else { //若图片还没有传完，则继续调用函数
          console.log(i)
          e.i = i;
          e.success = success;
          e.fail = fail;
          that.uploadimg(e); //递归，回调自己
        }
      }
    });
  },
  uploadimgdone: function (e) {
    console.log('执行了')
    mydata.imgid = this.data.imgid;
    this.upform();
  },
})
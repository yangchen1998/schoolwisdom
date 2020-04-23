var util = require('../../utils/util.js')
const app = getApp()
const db = wx.cloud.database()
const _ = db.command;
var turnBase64 = '';
var user = wx.getStorageSync('user');
var id = ''; //生成课程的ID
var update = false; //课表信息发生更新标志,默认为没有发生更新
var import_text = ''; //用于存放导入课程表的id
var change_weektag = true; //开始、结束周改变标记
var singleTap = 0; //在所有课表上的点击操作记录
var a_util_curriculum = JSON.stringify(util.free_curriculum);
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //导航栏相关
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom,
    windowWidth: app.globalData.windowWidth,
    search_height: app.globalData.screenHeight - app.globalData.CustomBar,

    colorArrays: ["bg-gradual-red", "bg-gradual-orange", "bg-gradual-green", "bg-gradual-red", "bg-gradual-purple", "bg-gradual-pink", "bg-gradual-blue", "bg-gradual-red"],

    s_week: 1,
    e_week: 18,
    spicker: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22],
    epicker: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22],
    week_days: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
    classtimes: ['第一节', '第二节', '第三节', '第四节', '第五节', '第六节'],
  },

  bindWeekChange: function (e) {
    console.log(e)
    var tp_now = Number(e.detail.value) + 1;
    var tp_cu = this.loadCurriculum({
      currentweeks: {
        current_week: tp_now
      }
    });
    var tp_weeks = this.weekChangeDay(e.detail.value);
    console.log(tp_weeks)
    console.log(tp_cu)
    this.setData({
      current_week: tp_now,
      curriculum: tp_cu,
      weekdays: tp_weeks
    })

  },


  onLoad: function (options) {
    //  console.log(free_curriculum0)
    /*   var user = wx.getStorageSync('user');
     var courses = wx.getStorageSync('courses');
     courses[14].what_time = 6;
     db.collection('user').doc(user._id).update({
       data: {
         courses: courses
       }
     })  */
    /*   wx.getStorage({
        key: 'user',
        success: re => {
          user = re;
          console.log(re)
        },
      }) */
    user = wx.getStorageSync('user');
    var currentweeks = this.getCurrentWeek();
    var currenttime = this.getTime();
    var curriculum = this.loadCurriculum({
      currentweeks,
      currenttime
    });
    var bgimage = wx.getStorageSync('bgimage');
    var week_picker = this.cu_week(currentweeks.current_week);
    this.showClass(this.data.courses);
    this.setData({
      current_week: currentweeks.current_week,
      currentday: currentweeks.currentday,
      weekdays: currentweeks.weekdays,
      lesson: currenttime.lesson,
      campus: currenttime.campus,
      curriculum: curriculum,
      bgimage: bgimage,
      _GMT_0880: util.formatYearname(new Date()),
      week_picker: week_picker
    })

    //    wx.getStorageSync('user'); //防止由于读取信息过慢造成的信息延迟
  },
  cu_week: function (e) {
    var week_picker = new Array();
    for (var i = 0; i < 23; i++) {

      if ((i + 1) == e) {
        week_picker[i] = {
          id: i + 1,
          name: '第 ' + (i + 1) + ' 周（当前）'
        }
      } else {
        week_picker[i] = {
          id: i + 1,
          name: '第 ' + (i + 1) + ' 周'
        }
      }

    }
    return week_picker;
  },
  //对课程信息进行分析，生成当前周的课程表
  loadCurriculum: function (e) { //输入当前周等时间信息、获取当前周上课信息，返回一个课程表
    //新建一个空的课程表
    // console.log(e.currentweeks.current_week)
    var free_curriculum = new Array();
    free_curriculum = JSON.parse(a_util_curriculum);
    // console.log(free_curriculum)
    // console.log('当前周为：' + e.currentweeks.current_week);
    var current_week = e.currentweeks.current_week;
    var user_courses = user.courses;
    // var user_courses = wx.getStorageSync('myCourses');
    //下面将课程信息逐个分析
    if (user_courses) {
      var len_courses = user_courses.length
    } else {
      var len_courses = 0;
    }
    for (var i = 0; i < len_courses; i++) {
      //循环历遍课程列表
      var a = current_week; //当前周
      if (user_courses[i].start_week <= a && user_courses[i].end_week >= a) {
        //当前周在课程开始和结束的合法范围
        //  for (var j = user_courses[i].start_week; j <= user_courses[i].end_week; j++) {

        //如果当前周不在lesson_off列表中，添加到课程表上
        var lesson_off = this.check_dayoff({
          week_list: user_courses[i].free_week,
          a: a
        });
        if (lesson_off == true) {
          free_curriculum[user_courses[i].id] = {
            class_name: user_courses[i].class_name,
            class_room: user_courses[i].class_room,
            what_day: user_courses[i].what_day,
            what_time: user_courses[i].what_time
          }
        }

        // }
      }
    }
    var curriculum = free_curriculum;
    return curriculum;
  },
  //检查该课程是否在当前周为空，返回一个用于判断的真值
  check_dayoff: function (e) { //e={week_list:['空课列表'],a:'需要判断的周的值'}
    var lesson_off = true;
    for (var k = 0; k < e.week_list.length; k++) {
      if (e.week_list[k] == e.a) {
        lesson_off = false; //匹配成功，则该节课为空课
        break;
      }
    }
    // console.log(lesson_off)
    return lesson_off;
  },
  //获取当前时间为第几周
  getCurrentWeek: function () {
    var date = new Date('2020/02/23 00:00:00');
    var nowdate = new Date();
    var stime = Date.parse(date);
    var etime = Date.parse(nowdate);
    // 两个时间戳相差的毫秒数
    var usedTime = etime - stime;
    // 计算相差的天数
    var days = Math.ceil(usedTime / (24 * 3600 * 1000));
    //  console.log(days)
    // 计算相差的周数(这里主要算现在为第几周，所以结果比相差周多一周)
    var weeks = Math.ceil(days / 7);
    if (days == 0) {
      var currentday = 0; // 为了解决days =0 或者刚好7的倍数的时候的bug
    } else if ((days % 7) == 0) {
      var currentday = 6;
    } else {
      var currentday = days % 7 - 1;
    }
    var weekdays = new Array();
    /* temp.setFullYear(temp.getFullYear() + x);//注意是FullYear
    temp.setMonth(temp.getMonth() + 1 + y);//由于设计缺陷，要在设置月份的时候就加1
    temp.setDate(temp.getDate() + z);//注意是Date */
    // var nowday = date.setDate((date.getDate()) + days - 1);
    // console.log(date)
    var tempdate = new Date();
    tempdate.setDate(date.getDate() + (weeks - 1) * 7);
    for (var i = 0; i < 7; i++) {
      weekdays[i] = tempdate.getDate();
      tempdate.setDate(tempdate.getDate() + 1);
    }
    // console.log('现在为:第' + weeks + '周  星期 ' + currentday + '今天是 ' + new Date().getDate() + '日')
    var currentweeks = {
      current_week: weeks,
      currentday: currentday,
      weekdays: weekdays
    };
    console.log(currentday)
    return currentweeks;
  },
  //获取当前时间与上课时间的关系，以区分南湖校区与浑南校区
  getTime: function () {
    var date = util.formatYear(new Date());
    var campus = user.campus;
    if (campus != '南湖校区') {
      // console.log(date + ' 08:30:00')
      var sfirst = new Date(date + ' 08:30:00');
      var efirst = new Date(date + ' 10:20:00');
      var ssecond = new Date(date + ' 10:40:00');
      var esecond = new Date(date + ' 12:30:00');
      //  console.log('现在是浑南校区时间')
    } else {
      var sfirst = new Date(date + ' 08:00:00');
      var efirst = new Date(date + ' 09:50:00');
      var ssecond = new Date(date + ' 10:10:00');
      var esecond = new Date(date + ' 12:00:00');
      //  console.log('现在是南湖校区时间')
    }
    var sthird = new Date(date + ' 14:00:00');
    var ethird = new Date(date + ' 15:50:00');
    var sfourth = new Date(date + ' 16:10:00');
    var efourth = new Date(date + ' 18:00:00');
    var sfifth = new Date(date + ' 18:30:00');
    var efifth = new Date(date + ' 20:20:00');
    var ssixth = new Date(date + ' 20:40:00');
    var esixth = new Date(date + ' 22:30:00');
    //上面是定义每节课的时间，下面时比较当前时间得出第几节
    var nowtime = new Date();
    var lesson = -1;
    // var nowtime = new Date(date + ' 14:00:00');
    if (sfirst <= nowtime && efirst >= nowtime) {
      lesson = 1;
    } else if (efirst < nowtime && ssecond > nowtime) {
      lesson = 2;
    } else if (ssecond <= nowtime && esecond >= nowtime) {
      lesson = 3;
    } else if (esecond < nowtime && sthird > nowtime) {
      lesson = 4;
    } else if (sthird <= nowtime && ethird >= nowtime) {
      lesson = 6;
    } else if (ethird < nowtime && sfourth > nowtime) {
      lesson = 7;
    } else if (sfourth <= nowtime && efourth >= nowtime) {
      lesson = 8;
    } else if (efourth < nowtime && sfifth > nowtime) {
      lesson = 9;
    } else if (sfifth <= nowtime && efifth >= nowtime) {
      lesson = 10;
    } else if (efifth < nowtime && ssixth > nowtime) {
      lesson = 11;
    } else if (ssixth <= nowtime && esixth >= nowtime) {
      lesson = 12;
    } else {
      lesson = -1;
    }
    //console.log(nowtime)
    var currenttime = {
      lesson: lesson,
      campus: campus
    }
    return currenttime;
  },
  //根据周获取日期
  weekChangeDay: function (e) {
    var date = new Date('2019/09/08 00:00:00');
    var c_weeks = new Array();
    var tempdate = new Date('2019/09/08 00:00:00');
    tempdate.setDate(date.getDate() + e * 7);
    console.log(tempdate)
    for (var i = 0; i < 7; i++) {
      c_weeks[i] = tempdate.getDate();
      tempdate.setDate(tempdate.getDate() + 1);
    }
    return c_weeks;
  },
  //将图片转换成Base64码，用于设置背景图片
  turnBase64: function () {
    wx.chooseImage({
      count: 1,
      success: res => {
        wx.getFileSystemManager().readFile({
          filePath: res.tempFilePaths[0], //选择图片返回的相对路径
          encoding: 'base64', //编码格式
          success: res => { //成功的回调
            //  console.log('data:image/png;base64,' + res.data)
            turnBase64 = 'data:image/png;base64,' + res.data;
            wx.setStorageSync('bgimage', turnBase64);
            this.setData({
              bgimage: turnBase64
            })
          }
        })
      }
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
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (ops) {
    return {
      title: '校园智多星课程表',
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
  //更新云端数据
  updateDatabase: function () {
    if (update == true) { //数据发生了更新
      this.updateDatabase();
    } else { //数据没发生更新，检查是否已经备份当前学期课程数据
      if (user.history_courses) { //存在这个记录
        var semster = false;
        for (var i = 0; i < user.history_courses.length; i++) {
          if (user.history_courses[i].semster == '2019-2020 秋季学期') {
            semster = true; //已经备份了这个学期的记录，结束循环
            break;
          }
        }
      } else { //没有记录时，上传记录
        var history_couses = this.tosemster();
        db.collection('user').update({
          data: {
            user: {
              history_courses: history_courses
            }
          }
        })
      }
    }
    if (user.history_courses) { //存在以学期保存为单位的课程表
      db.collection('courses').add({
        data: {}
      })
    } else { //不存在，证明没有保存有学期为单位的课程表，则需要新建
      // db.collection('courses').doc(user.)
    }
  },
  //生成学期课程表
  tosemster: function () {
    var semsterCourses = {
      semster: '2019-2020 秋季学期',
      college: user.college,
      courses: user.courses
    }
    return semsterCourses;
  },

  //刷新页面
  reflesh: function () { //这一段是刷新课程表的操作
    console.log('执行了刷新页面')
    var currentweeks = this.getCurrentWeek();
    var currenttime = this.getTime();
    var curriculum = this.loadCurriculum({
      currentweeks,
      currenttime
    });
    this.setData({
      current_week: currentweeks.current_week,
      currentday: currentweeks.currentday,
      weekdays: currentweeks.weekdays,
      lesson: currenttime.lesson,
      direct0: currenttime.direct0,
      direct1: currenttime.direct1,
      campus: currenttime.campus,
      curriculum: curriculum,
      _GMT_0880: util.formatYearname(new Date())
    })
  },
  //用户交互模块函数

  //点击动画
  toggle(e) {

  },

  TimeChange(e) {
    this.setData({
      time: e.detail.value
    })
  },
  DateChange(e) {
    this.setData({
      date: e.detail.value
    })
  },
  //修改校区
  changeCampus: function (e) {
    var that = this;
    if (user.campus != '南湖校区') {
      var campus = '浑南校区';
    } else {
      campus = '南湖校区'
    }
    wx.showModal({
      title: '切换校区',
      content: '本课表上课时间默认为浑南校区时间,当前显示的校区时间为：' + campus,
      confirmText: '切换',
      success(res) {
        if (res.confirm) {
          //   console.log('用户点击确定')
          wx.showLoading({
            title: '数据更新中...',
          })
          if (that.data.campus != '南湖校区') { //如果校区为空或者为浑南校区时
            user.campus = '南湖校区';
            var a = wx.setStorageSync('user', user);
            db.collection('user').doc(user._id).update({
              data: {
                campus: '南湖校区'
              },
              success(r) {
                wx.hideLoading()
                wx.showToast({
                  title: '当前时间为：' + user.campus,
                  icon: 'none'
                })
                that.reflesh();
              }
            })

          } else {
            user.campus = '浑南校区';
            var a = wx.setStorageSync('user', user);
            db.collection('user').doc(user._id).update({
              data: {
                campus: '浑南校区'
              },
              success(r) {
                wx.hideLoading()
                wx.showToast({
                  title: '当前时间为：' + user.campus,
                  icon: 'none'
                })
                that.reflesh();
              }
            })
          }
        } else if (res.cancel) {
          // console.log('用户点击取消')
          wx.showToast({
            title: '当前时间为：' + user.campus,
            icon: 'none'
          })
        }
      }
    })

  },


  /*======================= 课 程 表 相 关 函 数 =========================== */

  showClass: function (item) {
    //这个函数专门接收一个课程表的信息（数组对象），然后判断显示或者不显示
    //  console.log(item)
  },
  //对单个课程的操作对象属性函数，开始touch到结束touch，用于区分长按和点击事件
  bindTouchStart: function (e) {
    this.startTime = e.timeStamp;
  },
  bindTouchEnd: function (e) {
    this.endTime = e.timeStamp;
    this.setData({
      bindItem: '',
      longBind: ''
    })
  },
  //点击单门课程，展示该课程信息
  showCardView: function (e) {
    /*    //控制一下时间
       if (this.endTime - this.startTime < 350) { */
    //因为用了bindlongpress所以不用控制时间了
    console.log(e)
    var that = this;
    this.coursesView(e.currentTarget.id); //展示该课程信息
    that.setData({
      bindItem: ++e.currentTarget.id //这里的id为什么要加1是因为按照原id会产生一个小bug,无论点击哪里第一个都会同时产生动画，影响交互体验
    })

    setTimeout(function () {
      that.setData({
        bindItem: ''
      })
    }, 1000)

    //  }
  },
  //展示该点击课程信息
  coursesView: function (e) {
    console.log(e)
    if (!user.courses) {
      //  console.log('没有用户的课程信息')
    } else {
      //  console.log('找到该用户的课程信息');
      if (user.courses.length > 0) {
        //  console.log('课程长度大于0')
        for (var i = 0; i < user.courses.length; i++) {
          if (user.courses[i].id == e) {
            //    console.log('找到该节课的课程');
            if (user.courses[i].class_name == this.data.curriculum[e].class_name) {
              //     console.log('匹配课程名称成功');
              this.setData({
                currentCourse: user.courses[i],
                coursesView: true
              })
              break;
            } else {
              //   console.log('匹配课程名称失败');
            }
          } else {
            //  console.log('未找到该节课的课程');
          }
        }
      } else {
        // console.log('课程长度为0');
      }

    }
  },
  //隐藏课程信息
  hideCoursesView: function () {
    this.setData({
      coursesView: false,
      currentCourse: null
    })
  },
  //对单门课程长按时的操作
  longTap: function (e) {
    var that = this;
    var new_id = e.currentTarget.id;
    console.log('长按：' + e.currentTarget.id)
    that.setData({
      bindItem: ++e.currentTarget.id,
      longBind: true, //这里的id为什么要加1是因为按照原id会产生一个小bug,无论点击哪里第一个都会同时产生动画，影响交互体验
      lganimation: 'animation-scale-down',
    })
    setTimeout(function () {
      that.setData({
        lganimation: ''
      })
    }, 500)
    //检查该节课是否有课
    //  var checkLesson = this.checkLesson(e.currentTarget.id - 1);
    if (this.checkLesson(new_id) == false) {
      //这节有课，开启编辑模式
      console.log('有课')
      change_weektag = false;
      var edit_course = this.data.curriculum[new_id];
      edit_course.id = new_id;
      that.addClass(edit_course);
    } else {
      //这节无课，直接开启新建模式
      change_weektag = true;
      that.setData({
        addCourseday: that.data.curriculum[new_id].what_day - 1, //这里减一可能是因为后面计算的时候加了一导致开始设置的时候会产生BUG
        addCoursetime: String(that.timeToclass(that.data.curriculum[new_id].what_time)),
      })
      console.log('无课')
      that.addClass();
    }
  },
  //课程时间与列表值转换函数
  timeToclass: function (e) {
    var toClass = new Number();
    switch (e) {
      case 1:
        toClass = 0;
        break;
      case 3:
        toClass = 1;
        break;
      case 6:
        toClass = 2;
        break;
      case 8:
        toClass = 3;
        break;
      case 10:
        toClass = 4;
        break;
      case 12:
        toClass = 5;
        break;
      default:
        console.log('时间转换成课程坐标发生错误！')
        break;
    }
    return toClass;
  },
  //检查当前课节是否为空
  checkLesson: function (e) {
    var checkLesson = false;
    console.log('当前选择的课程为:' + e)
    if (!this.data.curriculum[e].class_room && !this.data.curriculum.class_room) {
      //这是空课
      checkLesson = true;
    }
    return checkLesson;
  },
  //添加课程函数or编辑课程,启用编辑模式时添加编辑标记
  addClass: function (e) {
    console.log(e);
    var that = this;
    if (!e) { //空调用，新建课程模式
      change_weektag = true;
      that.setData({
        addCourse: true,
        addCoursename: '',
        addCourseroom: '',
        spick: '',
        epick: '',
        f_week: '',
        addCourseteacher: '',
        strWeek: ''
      })
    } else { //带参数调用，编辑已有课程模式
      change_weektag = false;
      for (var i = 0; i < user.courses.length; i++) {
        if ((user.courses[i].id == e.id) && (user.courses[i].class_name == e.class_name)) {
          var a = user.courses[i].free_week;
          if (!user.courses[i].free_week) {
            var b = '无';
          } else {
            var b = a.join("、");
          }
          that.setData({
            addCourse: true,
            addCoursename: user.courses[i].class_name,
            addCourseroom: user.courses[i].class_room,
            addCourseday: user.courses[i].what_day - 1,
            addCoursetime: String(this.timeToclass(user.courses[i].what_time)),
            spick: user.courses[i].start_week,
            epick: user.courses[i].end_week,
            f_week: user.courses[i].free_week,
            addCourseteacher: user.courses[i].teacher_name,
            strWeek: '您已选择的无课周为：' + b,
            try_editcourse: i
          })
          break;
        }
      }
    }
  },

  //取消课表添加时的函数
  cancelAdd: function (e) {
    this.hideAddCourse();
    this.clearaddCourse();
  },
  //添加课程时的确定函数
  confirmAdd: function (e) {
    var j = Number(this.data.addCoursetime);
    var i = Number(this.data.addCourseday);

    var jtime = 0;
    //  console.log(i)
    //  console.log(j)
    switch (i) {
      case 0:
        id = j;
        break;
      case 1:
        id = 6 + j;
        break;
      case 2:
        id = 12 + j;
        break;
      case 3:
        id = 18 + j;
        break;
      case 4:
        id = 24 + j;
        break;
      case 5:
        id = 30 + j;
        break;
      case 6:
        id = 36 + j;
        break;
      default:
        console.log('swich (i)发生错误！')
        break;
    }
    switch (j) {
      case 0:
        jtime = 1;
        break;
      case 1:
        jtime = 3;
        break;
      case 2:
        jtime = 6;
        break;
      case 3:
        jtime = 8;
        break;
      case 4:
        jtime = 10;
        break;
      case 5:
        jtime = 12;
        break;
      default:
        console.log('swich(j)发生错误！')
        break;
    }
    var courses = {
      semster: '2019-2020 秋季学期',
      start_week: this.data.spick,
      end_week: this.data.epick,
      free_week: this.data.f_week,
      id: id,
      class_name: this.data.addCoursename,
      class_room: this.data.addCourseroom,
      what_day: ++i,
      what_time: jtime,
      teacher_name: this.data.addCourseteacher
    };
    var checked = this.check_addcourses();
    console.log(courses)

    if (checked == true) {
      if (!user.courses) {
        var new_courses = new Array();
        new_courses[0] = courses
        user.courses = new_courses;
        wx.setStorageSync('user', user)
        this.hideAddCourse();
        this.reflesh();
        // console.log('没有缓存时做的')
      } else {
        if (this.data.try_editcourse) {
          user.courses[this.data.try_editcourse] = courses;
        } else {
          user.courses.push(courses);
        }
        //  console.log(user.courses)
        //更新本地缓存
        wx.setStorageSync('user', user);
        //   console.log(user.courses)
        db.collection('user').doc(user._id).update({
          data: {
            courses: user.courses
          }
        })
        this.reflesh();
        update = true; //因为数据发生了改变，添加标记，以便更新云端数据
        //完成后再把之前输入的信息全部清空，方便继续添加
        this.clearaddCourse();
        this.hideAddCourse();
        //console.log('已存在courses')
      }
    } else {
      wx.showToast({
        title: '请先补充完整课程信息',
        icon: 'none'
      })
    }
  },
  //隐藏添加课程窗口
  hideAddCourse: function (e) {
    var that = this;
    console.log(e);
    that.setData({
      addCourse: ''
    })
    that.clearaddCourse();
  },
  //清空添加课表时输入的信息
  clearaddCourse: function (e) {
    id = '';
    this.setData({
      spick: '',
      epick: '',
      f_week: '',
      addCoursename: '',
      addCourseroom: '',
      addCoursetime: '',
      addCourseday: '',
      addCourseteacher: '',
      try_editcourse: null
    })
  },
  //添加空课周窗口
  addFreeWeek: function (e) {
    var checkbox = new Array();
    if (change_weektag == true) { //开始、结束周发生改变
      //从开始周计算到结束周，得出可选的无课周
      console.log('开始、结束周发生了改变')
      if (!this.data.spick || !this.data.epick) {
        var stemp = this.data.s_week;
        var etemp = this.data.e_week;
      } else {
        var stemp = Number(this.data.spick);
        var etemp = Number(this.data.epick);
      }
      for (var i = stemp, j = 0; i < (etemp + 1); i++ , j++) {
        checkbox[j] = {
          name: i,
          checked: false
        }
        console.log(checkbox[j])
      }
      console.log(checkbox)
      change_weektag = false;
      console.log(checkbox)
      this.setData({
        addFreeWeek: true,
        checkbox: checkbox
      })
    } else { //开始、结束周没有改变
      if (!this.data.checkbox) { //编辑模式开启时，对已选的空课选项check
        console.log('编辑模式下')
        var _stemp = Number(this.data.spick);
        var _etemp = Number(this.data.epick);
        for (var i = _stemp, j = 0; i < (_etemp + 1); i++ , j++) {
          //每周都比较
          var review = this.check_dayoff({
            week_list: this.data.f_week,
            a: i
          })
          if (review == false) { //匹配成功，是空课
            checkbox[j] = {
              name: i,
              checked: true
            }
          } else {
            checkbox[j] = {
              name: i,
              checked: false
            }
          }

        }
      } else {
        console.log('选择过后的选择框')
        checkbox = this.data.checkbox;
      }
      change_weektag = false;
      console.log(checkbox)
      this.setData({
        addFreeWeek: true,
        checkbox: checkbox
      })
    }

  },
  //隐藏空课周选择窗口
  hideAddFreeWeek: function () {
    this.setData({
      addFreeWeek: ''
    })
  },
  //选择空课周的多选框函数
  ChooseCheckbox(e) {
    console.log(this.data.checkbox)
    var items = this.data.checkbox;
    var strWeek = this.data.strWeek;
    var values = e.currentTarget.dataset.value;
    for (let i = 0, lenI = items.length; i < lenI; ++i) {
      // console.log('循环：' + i);
      if (items[i].name == values) {
        items[i].checked = !items[i].checked;
        break;
      }
    }
    this.setData({
      checkbox: items,
      //  strWeek: strWeek
    })
    this.strWeek(items);
    this.findf_week()
  },
  //渲染一个字符串
  strWeek: function (e) {
    var items = e;
    var value;
    var strWeek = '您添加的无课周为：';
    for (var i = 0; i < items.length; i++) {
      if (items[i].checked == true) {
        value = items[i].name;
        strWeek = strWeek + value + '、';
      }
    }
    this.setData({
      strWeek: strWeek
    })
  },
  //查找空课周
  findf_week: function () {
    var items = this.data.checkbox;
    var f_week = new Array();
    for (let i = 0, lenI = items.length; i < lenI; ++i) {
      if (items[i].checked == true) {
        var num = Number(items[i].name);
        // num++;
        f_week.push(num);
      }
    }
    // console.log(f_week)
    this.setData({
      f_week: f_week
    })
  },
  //开始周选择器
  startPickerChange(e) {
    // console.log(e);
    var temppick = Number(e.detail.value);
    var tempepick = Number(this.data.epick);
    temppick++;
    if ((temppick > tempepick) && this.data.epick) {
      wx.showToast({
        title: '不能输入比结束周晚的开始周',
        icon: 'none'
      })
    } else {
      this.setData({
        spick: temppick
      })
    }
    change_weektag = true;
  },
  //结束周选择器
  endPickerChange(e) {
    //  console.log(e);
    var temppick = Number(e.detail.value);
    var tempspick = Number(this.data.spick);
    temppick++;
    if ((temppick < tempspick) && this.data.spick) {
      wx.showToast({
        title: '不能输入比开始周早的结束周',
        icon: 'none'
      })
    } else {
      this.setData({
        epick: temppick
      })
    }
    change_weektag = true;
  },

  //检查是否已经把必要信息添加完整
  check_addcourses: function (e) {
    var checked = false;
    if (this.data.spick && this.data.epick) {
      if (this.data.addCoursename && this.data.addCourseroom) {
        if (this.data.addCourseday && this.data.addCoursetime) {
          if (id >= 0)
            checked = true;
        }
      }
    }
    return checked;
  },

  //输入课程名称函数
  addCoursenameInput: function (e) {
    //  console.log(e)
    this.setData({
      addCoursename: e.detail.value
    })
  },
  //输入上课地点函数
  addCourseroomInput: function (e) {
    console.log(e)
    this.setData({
      addCourseroom: e.detail.value
    })
  },
  //输入教师名字函数
  addCourseteacherInput: function (e) {
    console.log(e)
    this.setData({
      addCourseteacher: e.detail.value
    })
  },
  //星期几选择器函数
  dayPickerChange(e) {
    console.log(e);
    this.setData({
      addCourseday: e.detail.value
    })
  },
  //第几节课选择器函数
  timePickerChange(e) {
    console.log(e);
    this.setData({
      addCoursetime: e.detail.value
    })
  },


  //分享课程表函数
  shareClass: function (e) {
    if (user.courses) { //如果存在课表，则生成学期课表
      var semstercourses = this.tosemster();
      db.collection('courses').add({
        data: semstercourses
      }).then(res => {
        console.log(res)
        wx.setClipboardData({
          data: res._id,
          success: r => {
            this.setData({
              sharecourses: res._id
            })
          }
        })
      })
    } else { //不存在课程信息
      wx.showToast({
        title: '您的课程表为空，请检查！',
        icon: 'none'
      })
    }
  },
  //隐藏分享窗口
  hideSharecourses: function () {
    this.setData({
      sharecourses: ''
    })
  },
  searchClass: function (e) {
    //搜搜课程表函数
  },

  //==========================导入课程表函数=================================
  importClass: function (e) {
    //获取剪贴板内容，失败后直接打开导入窗口
    wx.getClipboardData({
      success: res => {
        console.log(res.data)
        this.downCourses(res.data);
      },
      fail(res) {
        console.log('获取剪贴板内容失败');
        this.setData({
          importClass: true
        })
      }
    })

  },
  //下载课程表函数
  downCourses: function (e) {
    wx.showLoading({
      title: '导入中...',
    })
    db.collection('courses').doc(e)
      .get({
        success: r => {
          console.log(r)
          if (r.data) {
            user = wx.getStorageSync('user');
            var n_courses = r.data.courses;
            user.courses = n_courses;
            db.collection('user').doc(user._id).update({
              data: {
                courses: n_courses
              }
            }).then(rr => {
              wx.hideLoading()
              console.log(rr)
              if (rr.stats.updated == 1) {
                wx.setStorage({
                  key: "user",
                  data: user,
                  success: pp => {
                    wx.showToast({
                      title: '导入成功！'
                    })
                    this.reflesh();
                    this.hideImportClass();
                  }
                })

              } else {
                wx.showToast({
                  title: '导入失败,请重试',
                  icon: 'none'
                })
                this.setData({
                  importClass: true
                })
              }
            })
              .catch(console.error)
          } else {
            wx.hideLoading()
            wx.showToast({
              title: '导入失败！',
              icon: 'none'
            })
            this.hideImportClass();
          }
        },
        fail: f => {
          wx.hideLoading()
          if (this.data.importClass == true) {
            wx.showToast({
              title: '导入失败,请重试',
              icon: 'none'
            })
          }
          this.setData({
            importClass: true
          })
        }
      })
  },
  //输入分享码函数
  inputImport: function (e) {
    import_text = e.detail.value;
  },
  //确认导入课程表函数
  confirmImport: function (e) {
    this.downCourses(import_text)
  },
  //隐藏导入课程表窗口
  hideImportClass: function (e) {
    this.setData({
      importClass: false
    })
  },

  //设置启动函数
  settings: function (e) {
    var that = this;
    that.setData({
      setanimation: true
    });
  },
  //隐藏设置抽屉函数
  hideSettings: function (e) {
    var that = this;
    that.setData({
      setanimation: ''
    });
  },
  //隐藏全部课程窗口
  hideAllCourses: function (e) {
    this.setData({
      allCourses: false
    })
  },
  /*   //课程时间转换课节函数
    toChangeCourse: function(e) {
      var numstr = '';
      switch(e){
        case 1:
        numstr = '第一节'
        break;
      }
      return numstr;
    }, */
  //全部课程相关函数
  allCourses: function (e) {
    var all_courses = user.courses;
    for (var i = 0; i < all_courses.length; i++) {
      all_courses[i].lesson = this.timeToclass(all_courses[i].what_time);
    }
    this.setData({
      allCourses: true,
      all_courses: all_courses
    })
  },
  //单击的时候记录，双击进入编辑模式，长按进入删除模式
  singleTap: function (e) {
    console.log(e)
    ++singleTap;
    if (singleTap == 2) {
      // this.operate('双击')
    }
    setTimeout(function () {
      singleTap = 0;
    }, 500)
  },
  longtap: function (e) {
    var tp = this.data.all_courses[e.currentTarget.id];
    wx.showModal({
      title: '删除确认',
      content: '您将删除 ' + tp.class_name + ' 课程(老师：' + tp.teacher_name + '\n 时间：' + this.data.week_days[tp.what_day - 1] + ' ' + this.data.classtimes[tp.lesson] + ')',
      success: r => {
        if (r.confirm) {
          console.log('用户点击确定')
          this._delete(e.currentTarget.id)
        } else if (r.cancel) {
          console.log('用户点击取消')
        }
      }
    })
    console.log(e)

  },

  //删除课程函数
  _delete: function (e) {
    //删除课程函数
    var that = this;
    wx.showLoading({
      title: '删除中',
    })
    var t_id = user.courses[e].id;
    var temp = user.courses.splice(e, 1);
    console.log(temp);
    console.log(user.courses)
    db.collection('user').doc(user._id).update({
      data: {
        courses: user.courses
      }
    }).then(rr => {
      if (rr.stats.updated == 1) {
        wx.setStorage({
          key: 'user',
          data: user,
          success: r => {
            wx.hideLoading()
            var de_curname = 'curriculum[' + t_id + '].class_name';
            this.setData({
              [de_curname]: ''
            })
            that.hideAllCourses()
            wx.showToast({
              title: '删除成功',
            })
          },
          fail: r => {
            wx.hideLoading();
            wx.showToast({
              title: '删除失败',
              icon: 'none'
            })
          }
        })
      } else {
        wx.hideLoading();
        wx.showToast({
          title: '删除失败',
          icon: 'none'
        })
      }
    })
    that.reflesh();
  },
  //================================设置列表的操作函数============================
  doSettings: function (e) {
    var that = this;
    console.log(e)
    switch (Number(e.currentTarget.id)) {
      case 0:
        that.allCourses()
        break;
      case 1:
        that.addClass();
        break;
      case 2:
        that.shareClass();
        break;
      case 3:
        that.importClass();
        break;
      case 4:
        that.turnBase64();
        break;
      case 5:
        this.changeCampus();
      default:
        break;
    }
  },

})
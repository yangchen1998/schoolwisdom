// pages/subject/allsubject.js
const app = getApp()
const db = wx.cloud.database()
var user = '';
var singleTap = 0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    windowWidth: app.globalData.windowWidth,
    navigation: ['课程', '时间', '地点', '老师'],
    spicker: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    user = wx.getStorageSync('user');
    this.setData({
      courses: user.courses
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  navgationSelect: function (e) {
    console.log(e)
    wx.showToast({
      title: '暂不支持',
    })
  },
  //单击的时候
  singleTap: function (e) {
    console.log(e)
    ++singleTap;
    if (singleTap == 2) {
      this.operate('双击')
    }
    setTimeout(function () {
      singleTap = 0;
    }, 500)
  },
  operate: function (e) {
    console.log(e)
    this.setData({
      editCourse: true
    })
  },
  //清楚编辑信息
  clearEdit: function (e) {

  },
  /*===========================================编辑课程表相关操作函数============================== */
  //点击取消或者右上角的X，隐藏编辑页面
  hideEditCourse: function () {
    this.setData({
      editCourse: false
    })
    this.clearEdit();
  },
  //点击确认函数
  comfirmEdit: function (e) {
    console.log(e)
    //接下来进行一些操作,保存什么的操作，再隐藏页面

    this.hideEditCourse()
  },
  //
  editCoursenameInput: function (e) {
    this.setData({
      editCoursename: e.detail.value
    })
  },
  //
  editCourseroomInput: function (e) {
    this.setData({
      editCourseroom: e.detail.value
    })
  },
  //
  //编辑函数
  editCourse: function (e) {
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
        num++;
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
  //删除函数
  _delete: function () { }
})
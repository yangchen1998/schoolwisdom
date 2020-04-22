// miniprogram/pages/count/count.js
let one = null;
let two = null;
let three = null;
let four = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    announcement: null,
    index: 0,
    allSubjects: [{
      score: null,
      credit: null
    }],
    base: 0,
    baseg: 0,
    mbase: 0,
    gbase: 0,
    mbaseg: 0
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
    return {
      title: '绩点模拟计算器',
      path: '/page/count/count'
    }
  },
  onRule: function () {
    wx.navigateTo({
      url: 'rule'
    })
  },
  announcement: function () {
    if (this.data.announcement == null) {
      this.setData({
        announcement: 1
      })
    } else {
      this.setData({
        announcement: null
      })
    }
  },
  radiochange: function (e) {
    this.setData({
      index: e.detail.value
    })
  },
  on: function (e) {
    //  console.log(e)
    this.setData({
      index: e.currentTarget.dataset.id
    })
  },
  single: function (e) {
    // console.log(Number(e.detail.value).toFixed(4))
    let score = Number(e.detail.value).toFixed(4)
    let gpa = Number(score / 10 - 5).toFixed(4)
    if (gpa < 1) {
      this.setData({
        single: 0,
        singlecolor: 'red'
      })
    } else if (gpa >= 1 && gpa < 3) {
      this.setData({
        single: gpa,
        singlecolor: 'red'
      })
    } else if (gpa >= 3 && gpa < 4) {
      this.setData({
        single: gpa,
        singlecolor: 'blue'
      })
    } else if (gpa >= 4 && gpa <= 5) {
      this.setData({
        single: gpa,
        singlecolor: 'green'
      })
    } else {
      this.setData({
        single: '请输入正确成绩'
      })
    }
  },
  add: function (e) {
    if (!this.data.three) {
      this.setData({
        three: 1
      })
    } else if (this.data.three && !this.data.four) {
      this.setData({
        four: 1
      })
    }
  },
  move: function (e) {
    if (this.data.three && !this.data.four) {
      this.setData({
        three: null
      })
    } else if (this.data.three && this.data.four) {
      this.setData({
        four: null
      })
    } else {
      this.setData({
        three: null,
        four: null
      })
    }
  },
  one: function (e) {
    // console.log(e.detail.value);
    one = e.detail.value;
    if (e.detail.value < 60) {
      this.setData({
        one: e.detail.value,
        onecolor: 'red'
      })
    } else if (e.detail.value >= 60 && e.detail.value < 90) {
      this.setData({
        one: e.detail.value,
        onecolor: 'blue'
      })
    } else if (e.detail.value >= 90 && e.detail.value <= 100) {
      this.setData({
        one: e.detail.value,
        onecolor: 'green'
      })
    } else {
      this.setData({
        one: e.detail.value,
        onecolor: 'red'
      })
    }
  },
  oneg: function (e) {
    this.setData({
      oneg: e.detail.value,
      twog: e.detail.value,
      threeg: e.detail.value,
      fourg: e.detail.value
    })
  },
  two: function (e) {
    //console.log(e.detail.value)
    two = e.detail.value;
    if (e.detail.value < 60) {
      this.setData({
        two: e.detail.value,
        twocolor: 'red'
      })
    } else if (e.detail.value >= 60 && e.detail.value < 90) {
      this.setData({
        two: e.detail.value,
        twocolor: 'blue'
      })
    } else if (e.detail.value >= 90 && e.detail.value <= 100) {
      this.setData({
        two: e.detail.value,
        twocolor: 'green'
      })
    } else {
      this.setData({
        two: e.detail.value,
        twocolor: 'red'
      })
    }
  },
  twog: function (e) {
    this.setData({
      twog: e.detail.value
    })
  },
  three: function (e) {
    //console.log(e.detail.value)
    three = e.detail.value;
    if (e.detail.value < 60) {
      this.setData({
        three: e.detail.value,
        threecolor: 'red'
      })
    } else if (e.detail.value >= 60 && e.detail.value < 90) {
      this.setData({
        three: e.detail.value,
        threecolor: 'blue'
      })
    } else if (e.detail.value >= 90 && e.detail.value <= 100) {
      this.setData({
        three: e.detail.value,
        threecolor: 'green'
      })
    } else {
      this.setData({
        three: e.detail.value,
        threecolor: 'red'
      })
    }
  },
  threeg: function (e) {
    this.setData({
      threeg: e.detail.value
    })
  },
  four: function (e) {
    //console.log(e.detail.value)
    four = e.detail.value;
    if (e.detail.value < 60) {
      this.setData({
        four: e.detail.value,
        fourcolor: 'red'
      })
    } else if (e.detail.value >= 60 && e.detail.value < 90) {
      this.setData({
        four: e.detail.value,
        fourcolor: 'blue'
      })
    } else if (e.detail.value >= 90 && e.detail.value <= 100) {
      this.setData({
        four: e.detail.value,
        fourcolor: 'green'
      })
    } else {
      this.setData({
        four: e.detail.value,
        fourcolor: 'red'
      })
    }
  },
  fourg: function (e) {
    this.setData({
      fourg: e.detail.value
    })
  },
  moreCount: function (e) {
    wx.showLoading({
      title: '计算中',
    })
    if (this.data.one && this.data.oneg) {
      if (this.data.two && this.data.twog) {
        if (this.data.three) {
          if (this.data.threeg) {
            if (this.data.four) {
              if (this.data.fourg) {
                //计算四次成绩
                this.countFour()
              } else {
                wx.showToast({
                  title: '第4次成绩和学分有误',
                  icon: 'none'
                })
              }
            } else {
              //计算三次成绩
              this.countThree()
            }

          } else {
            wx.showToast({
              title: '第3次成绩和学分有误',
              icon: 'none'
            })
          }
        } else {
          //计算两次的平均绩点
          this.countTwo()
        }
      } else {
        wx.showToast({
          title: '第2次成绩和学分有误',
          icon: 'none'
        })
      }
    } else {
      wx.showToast({
        title: '第1次成绩和学分有误',
        icon: 'none'
      })
    }
  },
  countTwo: function (e) { //计算两次的平均绩点
    let onescore = 0;
    let onegpa = 0;
    let twoscore = 0;
    let twogpa = 0;
    let oneg = Number(this.data.oneg);
    let twog = Number(this.data.twog);
    if (this.data.one < 60) {
      onegpa = Number(0).toFixed(4);
    } else {
      onescore = Number(this.data.one).toFixed(4);
      onegpa = Number(onescore / 10 - 5).toFixed(4);
    }
    if (this.data.two < 60) {
      twogpa = Number(0).toFixed(4);
    } else {
      twoscore = Number(this.data.two).toFixed(4);
      twogpa = Number(twoscore / 10 - 5).toFixed(4);
    }
    let gpa = ((onegpa * oneg + twogpa * twog) / (oneg + twog)).toFixed(4);
    this.setData({
      more: gpa
    })
    wx.hideLoading()
  },
  countThree: function (e) { //计算三次的平均绩点
    let onescore = 0;
    let onegpa = 0;
    let twoscore = 0;
    let twogpa = 0;
    let threescore = 0;
    let threegpa = 0;
    let oneg = Number(this.data.oneg);
    let twog = Number(this.data.twog);
    let threeg = Number(this.data.threeg);
    if (this.data.one < 60) {
      onegpa = Number(0).toFixed(4);
    } else {
      onescore = Number(this.data.one).toFixed(4);
      onegpa = Number(onescore / 10 - 5).toFixed(4);
    }
    if (this.data.two < 60) {
      twogpa = Number(0).toFixed(4);
    } else {
      twoscore = Number(this.data.two).toFixed(4);
      twogpa = Number(twoscore / 10 - 5).toFixed(4);
    }
    if (this.data.three < 60) {
      threegpa = Number(0).toFixed(4);
    } else {
      threescore = Number(this.data.three).toFixed(4);
      threegpa = Number(threescore / 10 - 5).toFixed(4);
    }
    //console.log(threegpa)
    let gpa = ((onegpa * oneg + twogpa * twog + threegpa * threeg) / (oneg + twog + threeg)).toFixed(4);
    this.setData({
      more: gpa
    })
    wx.hideLoading()
  },
  countFour: function (e) { //计算三次的平均绩点
    let onescore = 0;
    let onegpa = 0;
    let twoscore = 0;
    let twogpa = 0;
    let threescore = 0;
    let threegpa = 0;
    let fourscore = 0;
    let fourgpa = 0;
    let oneg = Number(this.data.oneg);
    let twog = Number(this.data.twog);
    let threeg = Number(this.data.threeg);
    let fourg = Number(this.data.fourg);
    if (this.data.one < 60) {
      onegpa = Number(0).toFixed(4);
    } else {
      onescore = Number(this.data.one).toFixed(4);
      onegpa = Number(onescore / 10 - 5).toFixed(4);
    }
    if (this.data.two < 60) {
      twogpa = Number(0).toFixed(4);
    } else {
      twoscore = Number(this.data.two).toFixed(4);
      twogpa = Number(twoscore / 10 - 5).toFixed(4);
    }
    if (this.data.three < 60) {
      threegpa = Number(0).toFixed(4);
    } else {
      threescore = Number(this.data.three).toFixed(4);
      threegpa = Number(threescore / 10 - 5).toFixed(4);
    }
    if (this.data.four < 60) {
      fourgpa = Number(0).toFixed(4);
    } else {
      fourscore = Number(this.data.four).toFixed(4);
      fourgpa = Number(fourscore / 10 - 5).toFixed(4);
    }
    let gpa = ((onegpa * oneg + twogpa * twog + threegpa * threeg + fourgpa * fourg) / (oneg + twog + threeg + fourg)).toFixed(4);
    this.setData({
      more: gpa
    })
    wx.hideLoading()
  },
  allAdd: function (e) {
    let allSubjects = this.data.allSubjects;
    allSubjects.push({
      score: null,
      credit: null
    })
    this.setData({
      allSubjects: allSubjects
    })
  },
  allMove: function (e) {
    let allSubjects = this.data.allSubjects;
    allSubjects.pop()
    this.setData({
      allSubjects: allSubjects
    })
  },
  all: function (e) {
    // console.log(e)
    let id = e.currentTarget.dataset.id;
    let allSubjects = this.data.allSubjects;
    allSubjects[id].score = e.detail.value;
    this.setData({
      allSubjects: allSubjects
    })
  },
  allg: function (e) {
    //console.log(e)
    let id = e.currentTarget.dataset.id;
    let allSubjects = this.data.allSubjects;
    allSubjects[id].credit = e.detail.value;
    this.setData({
      allSubjects: allSubjects
    })
  },
  base: function (e) {
    this.setData({
      base: e.detail.value
    })
  },
  baseblur: function (e) {
    this.setData({
      base: Number(e.detail.value).toFixed(4)
    })
  },
  baseg: function (e) {
    //  console.log(e)
    this.setData({
      baseg: e.detail.value
    })
  },
  allCount: function (e) {
    let ct = this.checkall();
    //  console.log(ct)
    if (ct == 1) {
      //计算总绩点
      //   console.log('计算绩点中')
      let ascore = 0;
      let acredit = 0;
      let gpa = Number(0).toFixed(4);
      let agpam = (Number(this.data.base) * Number(this.data.baseg)).toFixed(4);
      let agpad = Number(this.data.baseg);
      let len = this.data.allSubjects.length;
      let allSubjects = this.data.allSubjects;
      for (let i = 0; i < len; i++) {
        ascore = allSubjects[i].score;
        if (ascore < 60) {
          gpa = Number(0).toFixed(4);
        } else {
          gpa = Number(ascore / 10 - 5).toFixed(4);
        }
        //  console.log(gpa)
        acredit = Number(allSubjects[i].credit).toFixed(4);
        //    console.log(acredit)
        agpam = Number(agpam) + Number(gpa * acredit);
        agpad = (Number(acredit) + Number(agpad));
      }
      //  console.log(agpam)
      //  console.log(agpad)
      let allgpa = (agpam / agpad).toFixed(4);
      this.setData({
        allgpa: allgpa
      })
    } else {
      wx.showToast({
        title: '请补充完整所有成绩信息',
        icon: 'none'
      })
    }
  },
  checkall: function () {
    let ct = null;
    let len = this.data.allSubjects.length;
    let allSubjects = this.data.allSubjects;
    for (let i = 0; i < len; i++) {
      if (!allSubjects[i].score || !allSubjects[i].credit) {
        ct = null;
        break;
      } else {
        ct = 1;
      }
    }
    // console.log(ct)
    return ct;
  },
  mbase: function (e) {
    this.setData({
      mbase: e.detail.value
    })
  },
  mbaseblur: function (e) {
    this.setData({
      mbase: Number(e.detail.value).toFixed(4)
    })
  },
  mbaseg: function (e) {
    //  console.log(e)
    this.setData({
      mbaseg: e.detail.value
    })
  },
  gbase: function (e) {
    this.setData({
      gbase: e.detail.value
    })
  },
  gbaseblur: function (e) {
    this.setData({
      gbase: Number(e.detail.value).toFixed(4)
    })
  },
  goSimulation: function (e) {
    console.log('进行绩点模拟计算推测课程分数区间')
    let mgpa = Number(this.data.mbase).toFixed(4);
    let ggpa = Number(this.data.gbase).toFixed(4);
    if (mgpa == ggpa) { //维持当前GPA的操作
      console.log('维持绩点')
      this.holdGpa();
    } else if (mgpa < ggpa) { //提高当前GPA的操作
      console.log('提高绩点')
      this.addGpa();
    } else { //降低当前GPA的操作
      console.log('降低绩点')
      this.moveGpa();
    }
  },
  holdGpa: function (e) {
    var mgpa = Number(this.data.mbase).toFixed(4);
    var mcredit = Number(this.data.mbaseg);
    var ggpa = Number(this.data.gbase).toFixed(4);
    var mgpam = (Number(this.data.mbase) * Number(this.data.mbaseg)).toFixed(4);
    var mgpad = this.data.mbaseg;
    var newgpa = 0;
    var gk = Number(mgpa);
    var pgk = mgpa - gk;
    //  console.log(!((mgpa - gk) > 0.1))
    if (this.data.mbase > 0 && this.data.gbase > 0 && this.data.mbaseg > 0) {
      for (var g = 0; pgk < 0.1; g++) {
        // console.log(Number(g) + Number(mgpad))
        //  console.log(mgpam)
        mgpad++;
        gk = (Number(mgpam) / Number(mgpad)).toFixed(4);
        pgk = mgpa - gk;
        console.log(gk)
        console.log(pgk)
        console.log((mgpad - this.data.mbaseg))
      }
    } else {
      wx.showToast({
        title: '请输入正确的学分绩点',
        icon: 'none'
      })
    }



    // for (var g = 0; !((mgpa - gle) > 0.1); g++) {
    // console.log(((le - mgpa) < 0.1));
    /*       
          mgpam = Number(mgpam) + Number(gpa * acredit); */
    //  mgpad = (Number(g) + Number(mgpad));
    //   
    //   gle = (Number(newgpa) + Number(0.01)).toFixed(4);
    // }
    // console.log((Number(newgpa).toFixed(4) - mgpa))


  },
  addGpa: function (e) {
    let mgpa = Number(this.data.mbase).toFixed(4);
    let mcredit = Number(this.data.mbaseg);
    let ggpa = Number(this.data.gbase).toFixed(4);
    let newgpa = (mgpam / mgpad).toFixed(4);
    if (mcredit < 3) { //当前绩点小于3时

    } else { //当前绩点大于等于3时

    }
  },
  moveGpa: function (e) {
    let mgpa = Number(this.data.mbase).toFixed(4);
    let mcredit = Number(this.data.mbaseg);
    let ggpa = Number(this.data.gbase).toFixed(4);
    //  let newgpa = (mgpam / mgpad).toFixed(4);
    if (mcredit < 3) { //当前绩点小于3时

    } else { //当前绩点大于等于3时

    }
  }
})
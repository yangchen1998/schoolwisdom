/*app.js*/ 

App({
  onLaunch: function (e) {
    console.log(e)
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env:"neuhelper-8f4v",
        traceUser: true,
      })
    }
    const db = wx.cloud.database();
    var util = require('utils/util.js')
    var time = util.formatTime(new Date()) //获取时间
    wx.showLoading({
      title: '登录中'
    })
    var user = wx.getStorageSync('user')
    if (!user) {
      //没有本地缓存，获取_openid,查找用户信息
      wx.cloud.callFunction({
        name: 'login',
      }).then(res => {
        var openid = res.result.openid;
        db.collection('user').where({
          _openid: res.result.openid
        }).get().then(r1 => {
          wx.hideLoading()
          if (r1.data.length == 0) { //用户信息不存在建立新用户
            var mydata = {
              name: '',
              student_id: '',
              campus: '',
              college: '',
              courses: '',
              major: '',
              phone: '',
              email: '',
              dormitory: '',
              roomnum: '',
              history: [{
                _id: res.result.openid,
                time: time,
                type: '初识东大Helper',
                status: 'done'
              }],
              identity: 'user',
              certification: 'no',
              privacySetting: ['success', 'success'],
              bad_record: [],
            }
            db.collection('user').add({
              data: mydata,
              success: function (se) {
                mydata._id = se._id
                wx.setStorageSync('user', mydata)
                wx.hideLoading()
              },
              fail: console.error
            })
            // console.log("不存在该用户") 
          } else { //用户已注册过，检查账户的identity有效性，有效则将信息缓存到本地
            //       console.log(openid)
            db.collection('user').where({
              _openid: openid
            }).get().then(r3 => {
              success: {
                /* console.log("该用户已注册") */
                //判断是否有效
                console.log(r3)
                if (r3.data[0].identity == 'invaliduser') {
                  //先将信息缓存下来，无效用户重复进入的时候就直接进入另一个判断分支
                  //      console.log(r3.data[0])
                  wx.setStorageSync('user', r3.data[0])
                  //无效用户则不能进入程序并给出提示
                  wx.reLaunch({
                    url: '/pages/error',
                  })
                } else {
                  //缓存信息至本地
                  wx.setStorageSync('user', r3.data[0])
                }
              }
              fail: wx.onUnload
            })
          }
        })

      })
    } else {
      //如果有缓存则验证账户的有效性
      db.collection('user').where({
        _openid: user._openid
      }).get().then(r1 => {
        wx.hideLoading()
        if (r1.data.length == 0 || r1.data[0].identity == 'invaliduser') { //用户信息不存在或者identity是invaliduser的
          //更新本地缓存
          wx.setStorage('user', r1.data[0])
          //无效用户则不能进入程序并给出提示
          wx.reLaunch({
            url: '/pages/error',
          })
        } else { //存在账户且账户有效则更新本地缓存信息
          wx.setStorageSync('user', r1.data[0])
        }
      })
    }
    wx.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;
        let custom = wx.getMenuButtonBoundingClientRect();
        this.globalData.Custom = custom;
        this.globalData.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
        this.globalData.windowWidth = e.windowWidth;
        this.globalData.windowHeight = e.windowHeight;
        this.globalData.screenHeight = e.screenHeight;
      }
    })
  },
  globalData: {
    post_upload: 'none',
    ColorList: [{
      title: '嫣红',
      name: 'red',
      color: '#e54d42'
    },
    {
      title: '桔橙',
      name: 'orange',
      color: '#f37b1d'
    },
    {
      title: '明黄',
      name: 'yellow',
      color: '#fbbd08'
    },
    {
      title: '橄榄',
      name: 'olive',
      color: '#8dc63f'
    },
    {
      title: '森绿',
      name: 'green',
      color: '#39b54a'
    },
    {
      title: '天青',
      name: 'cyan',
      color: '#1cbbb4'
    },
    {
      title: '海蓝',
      name: 'blue',
      color: '#0081ff'
    },
    {
      title: '姹紫',
      name: 'purple',
      color: '#6739b6'
    },
    {
      title: '木槿',
      name: 'mauve',
      color: '#9c26b0'
    },
    {
      title: '桃粉',
      name: 'pink',
      color: '#e03997'
    },
    {
      title: '棕褐',
      name: 'brown',
      color: '#a5673f'
    },
    {
      title: '玄灰',
      name: 'grey',
      color: '#8799a3'
    },
    {
      title: '草灰',
      name: 'gray',
      color: '#aaaaaa'
    },
    {
      title: '墨黑',
      name: 'black',
      color: '#333333'
    },
    {
      title: '雅白',
      name: 'white',
      color: '#ffffff'
    },
    ]
  }
})

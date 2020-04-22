/*util.js*/ 
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
const formatYear = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return [year, month, day].map(formatNumber).join('/')
}
const formatYearname = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return year + '年' + month + '月' + day + '日'
}
const formatTimename = date => {
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return hour + '时' + minute + '分' + second + '秒'
}

const formatHour = date => {
  const hour = date.getHours()
  const minute = date.getMinutes()
  return [hour, minute].map(formatNumber).join(':')
}

const formatDate = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  return [year, month, day].map(formatNumber).join('-')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
const free_curriculum = [{
  class_name: '',
  class_room: '',
  what_day: 1,
  what_time: 1
}, {
  class_name: '',
  class_room: '',
  what_day: 1,
  what_time: 3
}, {
  class_name: '',
  class_room: '',
  what_day: 1,
  what_time: 6
}, {
  class_name: '',
  class_room: '',
  what_day: 1,
  what_time: 8
}, {
  class_name: '',
  class_room: '',
  what_day: 1,
  what_time: 10
}, {
  class_name: '',
  class_room: '',
  what_day: 1,
  what_time: 12
}, {
  class_name: '',
  class_room: '',
  what_day: 2,
  what_time: 1
}, {
  class_name: '',
  class_room: '',
  what_day: 2,
  what_time: 3
}, {
  class_name: '',
  class_room: '',
  what_day: 2,
  what_time: 6
}, {
  class_name: '',
  class_room: '',
  what_day: 2,
  what_time: 8
}, {
  class_name: '',
  class_room: '',
  what_day: 2,
  what_time: 10
}, {
  class_name: '',
  class_room: '',
  what_day: 2,
  what_time: 12
}, {
  class_name: '',
  class_room: '',
  what_day: 3,
  what_time: 1
}, {
  class_name: '',
  class_room: '',
  what_day: 3,
  what_time: 3
}, {
  class_name: '',
  class_room: '',
  what_day: 3,
  what_time: 6
}, {
  class_name: '',
  class_room: '',
  what_day: 3,
  what_time: 8
}, {
  class_name: '',
  class_room: '',
  what_day: 3,
  what_time: 10
}, {
  class_name: '',
  class_room: '',
  what_day: 1,
  what_time: 12
}, {
  class_name: '',
  class_room: '',
  what_day: 4,
  what_time: 1
}, {
  class_name: '',
  class_room: '',
  what_day: 4,
  what_time: 3
}, {
  class_name: '',
  class_room: '',
  what_day: 4,
  what_time: 6
}, {
  class_name: '',
  class_room: '',
  what_day: 4,
  what_time: 8
}, {
  class_name: '',
  class_room: '',
  what_day: 4,
  what_time: 10
}, {
  class_name: '',
  class_room: '',
  what_day: 4,
  what_time: 12
}, {
  class_name: '',
  class_room: '',
  what_day: 5,
  what_time: 1
}, {
  class_name: '',
  class_room: '',
  what_day: 5,
  what_time: 3
}, {
  class_name: '',
  class_room: '',
  what_day: 5,
  what_time: 6
}, {
  class_name: '',
  class_room: '',
  what_day: 5,
  what_time: 8
}, {
  class_name: '',
  class_room: '',
  what_day: 5,
  what_time: 10
}, {
  class_name: '',
  class_room: '',
  what_day: 5,
  what_time: 12
}, {
  class_name: '',
  class_room: '',
  what_day: 6,
  what_time: 1
}, {
  class_name: '',
  class_room: '',
  what_day: 6,
  what_time: 3
}, {
  class_name: '',
  class_room: '',
  what_day: 6,
  what_time: 6
}, {
  class_name: '',
  class_room: '',
  what_day: 6,
  what_time: 8
}, {
  class_name: '',
  class_room: '',
  what_day: 6,
  what_time: 10
}, {
  class_name: '',
  class_room: '',
  what_day: 6,
  what_time: 12
}, {
  class_name: '',
  class_room: '',
  what_day: 7,
  what_time: 1
}, {
  class_name: '',
  class_room: '',
  what_day: 7,
  what_time: 3
}, {
  class_name: '',
  class_room: '',
  what_day: 7,
  what_time: 6
}, {
  class_name: '',
  class_room: '',
  what_day: 7,
  what_time: 8
}, {
  class_name: '',
  class_room: '',
  what_day: 7,
  what_time: 10
}, {
  class_name: '',
  class_room: '',
  what_day: 7,
  what_time: 12
}]
const releaseIconList1 = [{
  icon: 'search',
  color: 'purple',
  badge: 0,
  name: '寻物启事',
  value: 'lost'
}, {
  icon: 'squarecheck',
  color: 'red',
  badge: 120,
  name: '失物招领',
  value: 'found'
}]
const releaseIconList2 = [{
  icon: 'search',
  color: 'purple',
  badge: 0,
  name: '寻物启事',
  value: 'lost'
}, {
  icon: 'squarecheck',
  color: 'red',
  badge: 120,
  name: '失物招领',
  value: 'found'
}, {
  icon: 'notification',
  color: 'mauve',
  badge: 0,
  name: '通知',
  value: 'notice'
}, {
  icon: 'group',
  color: 'mauve',
  badge: 0,
  name: '活动推广',
  value: 'group'
}]

const locationList = [{
  location: '浑南校区一号楼A区',
  location0: '浑南校区',
  location1: '一号楼',
  location2: 'A区',
  isShow: true
}, {
  location: '浑南校区一号楼B区',
  location0: '浑南校区',
  location1: '一号楼',
  location2: 'B区',
  isShow: true
}, {
  location: '浑南校区图书馆一楼',
  location0: '浑南校区',
  location1: '图书馆',
  location2: '一楼',
  isShow: true
},
{
  location: '浑南校区图书馆F区',
  location0: '浑南校区',
  location1: '图书馆',
  location2: 'F区',
  isShow: true
},
{
  location: '浑南校区食堂',
  location0: '浑南校区',
  location1: '食堂',
  location2: '',
  isShow: true
},
{
  location: '浑南校区澡堂',
  location0: '浑南校区',
  location1: '澡堂',
  location2: '',
  isShow: true
}, {
  location: '浑南校区生科楼A区',
  location0: '浑南校区',
  location1: '生科楼',
  location2: 'A区',
  isShow: true
}, {
  location: '浑南校区生科楼B区',
  location0: '浑南校区',
  location1: '生科楼',
  location2: 'B区',
  isShow: true
}, {
  location: '浑南校区信息楼A区',
  location0: '浑南校区',
  location1: '信息楼',
  location2: 'A区',
  isShow: true
}, {
  location: '浑南校区文管楼A区',
  location0: '浑南校区',
  location1: '文管楼',
  location2: 'A区',
  isShow: true
}, {
  location: '浑南校区文管楼B区',
  location0: '浑南校区',
  location1: '文管楼',
  location2: 'B区',
  isShow: true
}, {
  location: '浑南校区建筑楼A区',
  location0: '浑南校区',
  location1: '建筑楼',
  location2: 'A区',
  isShow: true
}, {
  location: '浑南校区建筑楼B区',
  location0: '浑南校区',
  location1: '建筑楼',
  location2: 'B区',
  isShow: true
}, {
  location: '浑南校区一舍A区',
  location0: '浑南校区',
  location1: '一舍',
  location2: 'A区',
  isShow: true
}, {
  location: '浑南校区一舍B区',
  location0: '浑南校区',
  location1: '一舍',
  location2: 'B区',
  isShow: true
}, {
  location: '浑南校区二舍A区',
  location0: '浑南校区',
  location1: '二舍',
  location2: 'A区',
  isShow: true
}, {
  location: '浑南校区二舍B区',
  location0: '浑南校区',
  location1: '二舍',
  location2: 'B区',
  isShow: true
}, {
  location: '浑南校区三舍A区',
  location0: '浑南校区',
  location1: '三舍',
  location2: 'A区',
  isShow: true
}, {
  location: '浑南校区三舍B区',
  location0: '浑南校区',
  location1: '三舍',
  location2: 'B区',
  isShow: true
}, {
  location: '浑南校区四舍A区',
  location0: '浑南校区',
  location1: '四舍',
  location2: 'A区',
  isShow: true
}, {
  location: '浑南校区四舍B区',
  location0: '浑南校区',
  location1: '四舍',
  location2: 'B区',
  isShow: true
}, {
  location: '浑南校区五舍A区',
  location0: '浑南校区',
  location1: '五舍',
  location2: 'A区',
  isShow: true
}, {
  location: '浑南校区五舍B区',
  location0: '浑南校区',
  location1: '五舍',
  location2: 'B区',
  isShow: true
}, {
  location: '浑南校区风雨操场',
  location0: '浑南校区',
  location1: '风雨操场',
  location2: '',
  isShow: true
}, {
  location: '浑南校区体育场',
  location0: '浑南校区',
  location1: '体育场',
  location2: '',
  isShow: true
},
{
  location: '浑南校区生活服务中心2',
  location0: '浑南校区',
  location1: '生活服务中心2',
  location2: '',
  isShow: true
}, {
  location: '南湖校区一舍东',
  location0: '南湖校区',
  location1: '一舍',
  location2: '东',
  isShow: true
}, {
  location: '南湖校区一舍西',
  location0: '南湖校区',
  location1: '一舍',
  location2: '西',
  isShow: true
}, {
  location: '南湖校区二舍东',
  location0: '南湖校区',
  location1: '二舍',
  location2: '东',
  isShow: true
}, {
  location: '南湖校区二舍西',
  location0: '南湖校区',
  location1: '二舍',
  location2: '西',
  isShow: true
}, {
  location: '南湖校区三舍A',
  location0: '南湖校区',
  location1: '三舍',
  location2: 'A',
  isShow: true
}, {
  location: '南湖校区三舍B',
  location0: '南湖校区',
  location1: '三舍',
  location2: 'B',
  isShow: true
}, {
  location: '南湖校区三舍C',
  location0: '南湖校区',
  location1: '三舍',
  location2: 'C',
  isShow: true
}, {
  location: '南湖校区四舍',
  location0: '南湖校区',
  location1: '四舍',
  location2: '',
  isShow: true
}, {
  location: '南湖校区五舍',
  location0: '南湖校区',
  location1: '五舍',
  location2: '',
  isShow: true
}, {
  location: '南湖校区老七舍（培训公寓）',
  location0: '南湖校区',
  location1: '老七舍（培训公寓）',
  location2: '',
  isShow: true
}, {
  location: '南湖校区六舍',
  location0: '南湖校区',
  location1: '六舍',
  location2: '',
  isShow: true
}, {
  location: '南湖校区七舍',
  location0: '南湖校区',
  location1: '七舍',
  location2: '',
  isShow: true
}, {
  location: '南湖校区十舍',
  location0: '南湖校区',
  location1: '十舍',
  location2: '',
  isShow: true
}, {
  location: '南湖校区莘莘超市',
  location0: '南湖校区',
  location1: '莘莘超市',
  location2: '',
  isShow: true
}, {
  location: '南湖校区培训餐厅',
  location0: '南湖校区',
  location1: '培训餐厅',
  location2: '',
  isShow: true
}, {
  location: '南湖校区桃园亭',
  location0: '南湖校区',
  location1: '桃园亭',
  location2: '',
  isShow: true
}, {
  location: '南湖校区清真食堂',
  location0: '南湖校区',
  location1: '清真食堂',
  location2: '',
  isShow: true
}, {
  location: '南湖校区一浴池',
  location0: '南湖校区',
  location1: '一浴池',
  location2: '',
  isShow: true
}, {
  location: '南湖校区二浴池',
  location0: '南湖校区',
  location1: '二浴池',
  location2: '',
  isShow: true
}, {
  location: '南湖校区知行楼',
  location0: '南湖校区',
  location1: '知行楼',
  location2: '',
  isShow: true
}, {
  location: '南湖校区一食堂',
  location0: '南湖校区',
  location1: '一食堂',
  location2: '',
  isShow: true
}, {
  location: '南湖校区二食堂',
  location0: '南湖校区',
  location1: '二食堂',
  location2: '',
  isShow: true
}, {
  location: '南湖校区机械楼',
  location0: '南湖校区',
  location1: '机械楼',
  location2: '',
  isShow: true
}, {
  location: '南湖校区逸夫楼南',
  location0: '南湖校区',
  location1: '逸夫楼',
  location2: '南',
  isShow: true
}, {
  location: '南湖校区逸夫楼北',
  location0: '南湖校区',
  location1: '逸夫楼',
  location2: '北',
  isShow: true
}, {
  location: '南湖校区大学生活动中心（大活）',
  location0: '南湖校区',
  location1: '大学生活动中心（大活）',
  location2: '',
  isShow: true
}, {
  location: '南湖校区大成教学楼',
  location0: '南湖校区',
  location1: '大成教学楼',
  location2: '',
  isShow: true
}, {
  location: '南湖校区冶金馆',
  location0: '南湖校区',
  location1: '冶金馆',
  location2: '',
  isShow: true
}, {
  location: '南湖校区何世礼教学馆',
  location0: '南湖校区',
  location1: '何世礼教学馆',
  location2: '',
  isShow: true
}, {
  location: '南湖校区化学馆A',
  location0: '南湖校区',
  location1: '化学馆',
  location2: 'A',
  isShow: true
}, {
  location: '南湖校区化学馆B',
  location0: '南湖校区',
  location1: '化学馆',
  location2: 'B',
  isShow: true
}, {
  location: '南湖校区五五体育场',
  location0: '南湖校区',
  location1: '五五体育场',
  location2: '',
  isShow: true
}, {
  location: '南湖校区九舍食堂',
  location0: '南湖校区',
  location1: '九舍食堂',
  location2: '',
  isShow: true
}, {
  location: '南湖校区东大风味',
  location0: '南湖校区',
  location1: '东大风味',
  location2: '',
  isShow: true
}, {
  location: '南湖校区汉卿会堂',
  location0: '南湖校区',
  location1: '汉卿会堂',
  location2: '',
  isShow: true
}, {
  location: '南湖校区建筑馆',
  location0: '南湖校区',
  location1: '建筑馆',
  location2: '',
  isShow: true
}, {
  location: '南湖校区宁承恩图书馆',
  location0: '南湖校区',
  location1: '宁承恩图书馆',
  location2: '',
  isShow: true
}, {
  location: '南湖校区采矿馆',
  location0: '南湖校区',
  location1: '采矿馆',
  location2: '',
  isShow: true
}, {
  location: '南湖校区刘长春体育馆',
  location0: '南湖校区',
  location1: '刘长春体育馆',
  location2: '',
  isShow: true
}, {
  location: '南湖校区羽乒馆',
  location0: '南湖校区',
  location1: '羽乒馆',
  location2: '',
  isShow: true
}, {
  location: '南湖校区科学馆',
  location0: '南湖校区',
  location1: '科学馆',
  location2: '',
  isShow: true
}, {
  location: '南湖校区五四体育场',
  location0: '南湖校区',
  location1: '五四体育场',
  location2: '',
  isShow: true
}, {
  location: '南湖校区游泳馆',
  location0: '南湖校区',
  location1: '游泳馆',
  location2: '',
  isShow: true
}, {
  location: '南湖校区信息楼',
  location0: '南湖校区',
  location1: '信息楼',
  location2: '',
  isShow: true
}, {
  location: '南湖校区计算中心',
  location0: '南湖校区',
  location1: '计算中心',
  location2: '',
  isShow: true
}
]
const type = ['卡证', '雨伞', '水杯', '书籍', '数码', '其它']

const location = [
  ['浑南校区', '南湖校区'],
  ['1号楼', '图书馆', '信息楼', '文管楼', '建筑楼', '生科', '一舍', '二舍', '三舍', '四舍', '五舍', '生活服务中心1', '风雨操场', '运动场'],
  ['A区', 'B区'],
]

const campus = ['南湖校区', '浑南校区']
const building_hunnan = ['1号楼', '图书馆', '信息楼', '文管楼', '建筑楼', '生科', '一舍', '二舍', '三舍', '四舍', '五舍', '生活服务中心1', '风雨操场', '运动场']
const building_nanhu = ['大学生活动中心', '综合楼', '建筑楼']
const zone_hunnan = ['A区', 'B区', '南侧', '北侧', '东侧', '西侧']
const zone_nanhu = ['东', '西', '南', '北']
const scope = [{
  name: '全部',
  checked: 'true'
},
{
  name: '南湖校区'
},
{
  name: '浑南校区'
},
]

const scope_hunnan = [{
  name: '全部',
  checked: 'true'
},
{
  name: '一舍'
},
{
  name: '二舍'
},
{
  name: '三舍'
},
{
  name: '四舍'
},
{
  name: '五舍'
},
]
const scope_nanhu = [{
  name: '全部',
  checked: 'true'
},
{
  name: '一舍'
},
{
  name: '二舍'
},
{
  name: '三舍'
},
{
  name: '四舍'
},
{
  name: '五舍'
},
]

const searchList = [{
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
}, {
  name: '生科楼',
  isShow: true
}, {
  name: '建筑楼',
  isShow: true
}, {
  name: '信息楼',
  isShow: true
}, {
  name: '文管楼',
  isShow: true
}, {
  name: '风雨操场',
  isShow: true
}, {
  name: '运动场',
  isShow: true
}, {
  name: '一舍',
  isShow: true
}, {
  name: '二舍',
  isShow: true
}, {
  name: '三舍',
  isShow: true
}, {
  name: '四舍',
  isShow: true
}, {
  name: '五舍',
  isShow: true
}, {
  name: '南门',
  isShow: true
}, {
  name: '莘莘超市',
  isShow: true
}, {
  name: '老七舍（培训公寓）',
  isShow: true
}, {
  name: '公安处',
  isShow: true
}, {
  name: '培训餐厅',
  isShow: true
}, {
  name: '桃园亭',
  isShow: true
}, {
  name: '清真食堂',
  isShow: true
}, {
  name: '一浴池',
  isShow: true
}, {
  name: '知行楼',
  isShow: true
}, {
  name: '一食堂',
  isShow: true
}, {
  name: '129花园',
  isShow: true
}, {
  name: '二食堂',
  isShow: true
}, {
  name: '十舍',
  isShow: true
}, {
  name: '二浴池',
  isShow: true
}, {
  name: '机械楼',
  isShow: true
}, {
  name: '逸夫楼',
  isShow: true
}, {
  name: '大活',
  isShow: true
}, {
  name: '大成',
  isShow: true
}, {
  name: '冶金馆',
  isShow: true
}, {
  name: '综合楼',
  isShow: true
}, {
  name: '北广场',
  isShow: true
}, {
  name: '机电馆',
  isShow: true
}, {
  name: '何世礼教学馆',
  isShow: true
}, {
  name: '化学馆',
  isShow: true
}, {
  name: '五五体育场',
  isShow: true
}, {
  name: '九舍',
  isShow: true
}, {
  name: '九舍食堂',
  isShow: true
}, {
  name: '八舍',
  isShow: true
}, {
  name: '东大风味',
  isShow: true
}, {
  name: '六舍',
  isShow: true
}, {
  name: '七舍',
  isShow: true
}, {
  name: '小北门',
  isShow: true
}, {
  name: '汉卿会堂',
  isShow: true
}, {
  name: '建筑馆',
  isShow: true
}, {
  name: '宁承恩图书馆',
  isShow: true
}, {
  name: '采矿馆',
  isShow: true
}, {
  name: '刘长春体育馆',
  isShow: true
}, {
  name: '羽乒馆',
  isShow: true
}, {
  name: '科学馆',
  isShow: true
}, {
  name: '五四体育场',
  isShow: true
}, {
  name: '游泳馆',
  isShow: true
}, {
  name: '信息楼（南湖）',
  isShow: true
}, {
  name: '计算中心',
  isShow: true
}, {
  name: '北门',
  isShow: true
},]

module.exports = {
  formatYear: formatYear,
  formatYearname: formatYearname,
  formatTime: formatTime, //时间
  formatDate: formatDate, //日期
  formatTimename: formatTimename, //时间命名
  formatNumber: formatNumber, //数字时间
  formatHour: formatHour, //几点几分
  searchList: searchList, //智能提词
  free_curriculum: free_curriculum,//空课表
  locationList: locationList,
  iconList1: releaseIconList1,
  iconList2: releaseIconList2,
  type: type,
  location: location,
  campus: campus,
  building_hunnan: building_hunnan,
  building_nanhu: building_nanhu,
  zone_hunnan: zone_hunnan,
  zone_nanhu: zone_nanhu,
  scope: scope,
  scope_hunnan: scope_hunnan,
  scope_nanhu: scope_nanhu
}

/*iconList: [
 {
          icon: 'commandfill',
          color: 'gray',
          badge: 0,
          name: '问答',
          value: 'ask',
          url:'../lostAndFound/lostAndFound'
        }, {
          icon: 'cardboardfill',
          color: 'gray',
          badge: 120,
          name: '校园导览',
          value: 'guide',
          url:'../massege/massge'
        }, 
  {
    icon: 'addressbook',
    color: 'blue',
    badge: 0,
    name: '电话簿',
    value: 'book'
  }, {
    icon: 'taxi',
    color: 'blue',
    badge: 0,
    name: '出行组队',
    value: 'bus'
  }, {
    icon: 'form',
    color: 'blue',
    badge: 0,
    name: '校历',
    value: 'calendar'
  }
  /* , {
          icon: 'group_fill',
          color: 'gray',
          badge: 0,
          name: '社团',
          value: 'group'
        } 
]*/
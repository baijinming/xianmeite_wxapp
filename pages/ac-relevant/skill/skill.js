const RQ = require('../../../utils/request.js');
let rule = [
  { money: 100, score: 30, removeNum: 0 },
  { money: 200, score: 60, removeNum: 1 },
  { money: 300, score: 90, removeNum: 2 },
  { money: 400, score: 120, removeNum: 3 },
];

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.money) {
      for(let i = 0; i < rule.length; i++) {
        if(options.money == rule[i].money) {
          let scoreList = [];
          for (let j = 0; j < rule[i].removeNum; j++) {
            scoreList.push((j + 1) + '0分')
          }
          this.setData({
            title: rule[i],
            scoreList: scoreList
          })
          console.log(this.data.scoreList)
        }
      };
    }
    if (options.acid) {
      this.setData({
        acid: options.acid
      })
    }

    this.getList()
  },

  //获取活动参与者列表
  getList() {
    let form = {
      token: wx.getStorageSync('token'),
      spell_project_id: this.data.acid
    }
    RQ.postRequest('/api/SpellGoods/get_spell_project_people', form, (res) => {
      let user_list = res.result.spell_project_user.activity_information.top_list;
      for(let i = 0; i < user_list.length; i++) {
        for(let j = 0; j < user_list[i].data.length; j++) {
          user_list[i].data[j].check = false;
          user_list[i].data[j].num = 1;
        }
      }
      this.setData({
        user_list: user_list
      })
    })
  },

  //确定扣除
  sure() {
    let user_list = this.data.user_list;
    let userId = [];
    for (let i = 0; i < user_list.length; i++) {
      for (let j = 0; j < user_list[i].data.length; j++) {
        if (user_list[i].data[j].check) {
          for (let k = 0; k < user_list[i].data[j].num; k++) {
            userId.push(user_list[i].data[j].user_id)
          }
        }
      }
    }
    if (userId.length > this.data.title.removeNum) {
      wx.showToast({
        title: '选择扣除分数已超出',
        icon: 'none'
      })
      return false
    }
    let form = {
      token: wx.getStorageSync('token'),
      spell_project_id: this.data.acid,
      spell_project_user_id: userId.join(',') + ',',
    }
    RQ.postRequest('/api/SpellGoods/deduction_spell_project_user_point', form, (res) => {
      wx.showToast({
        title: res.msg,
        icon: "none"
      })
      if(res.status == 1) {
        setTimeout(() => {
          wx.switchTab({
            url: '/pages/activity/activity',
          })
        }, 1000)
      }
    })
  },

  //选择用户
  choose(e) {
    let index = e.currentTarget.dataset.index;
    let lindex = e.currentTarget.dataset.lindex;
    let user_list = this.data.user_list;
    let checkNum = 0;
    for(let i = 0; i < user_list.length; i++) {
      for(let j = 0; j < user_list[i].data.length; j++) {
        if (user_list[i].data[j].check) {
          ++checkNum;
        }
      }
    }
    if (checkNum < this.data.title.removeNum) {
      user_list[lindex].data[index].check = true;
    }
    this.setData({
      user_list: user_list
    })
  },

  //取消用户
  reduce(e) {
    let index = e.currentTarget.dataset.index;
    let lindex = e.currentTarget.dataset.lindex;
    let user_list = this.data.user_list;
    user_list[lindex].data[index].check = false;
    this.setData({
      user_list: user_list
    })
  },

  // 打开picker
  bindPickerChange(e) {
    let index = e.currentTarget.dataset.index;
    let lindex = e.currentTarget.dataset.lindex;
    let user_list = this.data.user_list;
    user_list[lindex].data[index].num = parseInt(e.detail.value) + 1;
    this.setData({
      user_list: user_list
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

  }
})
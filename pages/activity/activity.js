const util = require('../../utils/util.js');
const RQ = require('../../utils/request.js');
const Format = require('../../utils/format.js');
const app = getApp();

let recommendForYou = [
  {
    img: '/static/images/activity/recommend_bg1.png',
    name: '当期热推'
  },
  {
    img: '/static/images/activity/recommend_bg2.png',
    name: '当期热推'
  },
  {
    img: '/static/images/activity/recommend_bg3.png',
    name: '当期热推'
  },
  {
    img: '/static/images/activity/recommend_bg4.png',
    name: '当期热推'
  }
]

Page({

  /**
   * 页面的初始数据
   */
  data: {
    nav_index: 1,
    activity: "11",
    popupShow: false,
    acContent: null,
    acTimeStr: null,
    is_start: false,
    is_end: false,
    shop_p: 1,
  },
    
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      nav_index: app.globalData.ac_nav_index
    })
    if (options.acid) {
      this.setData({
        acid: options.acid
      })
    }
  },

  // 获取先到先得活动列表数据
  getActivityList() {
    let that = this;
    let params = {
      p: that.data.shop_p
    };
    RQ.postRequest('/api/SpellGoods/goodsList', params, (res) => {
      if(res.status == 1) {
        let list = res.result.goods_list;
        for(let i = 0; i < list.length; i++) {
          list[i].isRace = false;
          list[i].isOrganize = false;
          let nowTime = parseInt(Date.parse(new Date()) / 1000);
          if (list[i].project && nowTime >= list[i].project.wait_end_time && nowTime < list[i].project.conduct_end_time) {
            list[i].isRace = true;
          }
          if (list[i].project && nowTime < list[i].project.wait_end_time) {
            list[i].isOrganize = true;
          }
        }
        that.setData({
          ac_list: list
        })
      }
    })
  },

  // 获取当前活动信息
  getActivity() {
    let form = {};
    if (this.data.acid) {
      form.spell_project_id = this.data.acid;
    } else {
      form.token = wx.getStorageSync('token');
    }
    RQ.postRequest('/api/SpellGoods/activity_information', form, (res) => {
      if (res.status == -1) {
        this.getActivityList()
        return false;
      }
      if (res.result.spell_project_user.state == 0) {
        this.setData({
          isInvalid: true
        })
      }
      let now_acContent = res.result.spell_project_user;
      if (now_acContent.activity_information) {
        for (let i = 0; i < now_acContent.activity_information.top_list.length; i++) {
          if (now_acContent.activity_information.top_list[i].data.length == 0) {
            now_acContent.activity_information.top_list[i].data.push({ nickname: '暂无用户' });
          }
          // if (now_acContent.activity_information.top_list[i].data.length == 1) {
          //   now_acContent.activity_information.top_list[i].data.push({ nickname: '' });
          // }
        }
      }
      let loding_time = (+now_acContent.wait_end_time + '000') - (Date.parse(new Date()))
      let end_time = (+now_acContent.conduct_end_time + '000') - (Date.parse(new Date()))
      this.setData({
        now_acContent: now_acContent,
        organization_time: now_acContent.wait_start_time_str.replace(/-/g, '.') + '-' + now_acContent.wait_end_time_str.slice(5).replace(/-/g, '.'),
        match_time: now_acContent.wait_end_time_str.replace(/-/g, '.') + '-' + now_acContent.conduct_end_time_str.slice(5).replace(/-/g, '.'),
        match_day: parseInt((now_acContent.conduct_end_time - now_acContent.wait_end_time) / 60 / 60 / 24),
        is_start: loding_time <= 0 && end_time > 0 ? true : false,
        is_end: end_time <= 0 ? true : false,
        popupShow: now_acContent.activity_settlement_information && now_acContent.activity_settlement_information.top_list[0].user_id == wx.getStorageSync('userInfo').user_id && now_acContent.activity_settlement_information.purchase_state == 0? true : false,
        start_day: parseInt(now_acContent.wait_loding_time / 24),
        start_hours: now_acContent.wait_loding_time % 24,
        end_day: parseInt(now_acContent.conduct_loding_time/24),
        end_hours: now_acContent.conduct_loding_time % 24,
        spell_project_id: res.result.spell_project_user.spell_project_id,
        delay_number: res.result.spell_project_user.delay_number
      })
    })
  },

  // 参与其它比赛按钮
  joinOther() {
    RQ.postRequest('/api/SpellGoods/save_project_user', { token: wx.getStorageSync('token'), spell_project_id: this.data.spell_project_id}, (res) => {
      this.setData({
        ac_list: [],
        now_acContent: null,
        organization_time: null,
        match_time: null,
        is_start: false,
        is_end: false,
        popupShow: false,
        isInvalid: false,
      })
      this.getActivity()
    })
  },

  // 开启参与活动
  joinAc(e) {
    let form = {
      token: wx.getStorageSync('token')
    }
    if (e.currentTarget.dataset.goods_id) {
      form.goods_id = e.currentTarget.dataset.goods_id
    } else {
      form.project_id = this.data.acid
    }
    let that = this;
    RQ.postRequest('/api/SpellGoods/add_project', form, (res) => {
      if(res.status == 1) {
        that.setData({
          acid: null
        })
        that.getActivity()
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })
  },

  closePopup() {
    this.setData({
      popupShow: false
    })
  },

  // 领取奖品
  lqBtn() {
    wx.navigateTo({
      url: '/pages/confirmLqOrder/confirmLqOrder?id=' + this.data.now_acContent.spell_project_id,
    })
  },

  nabSwitch(event) {
    let nav_index = event.currentTarget.dataset.index;
    if(nav_index == this.data.nav_index) {
      return false;
    }
    this.setData({
      nav_index: nav_index
    })
    if (this.data.nav_index == 2) {
      this.getSortList()
      this.getLabel()
    } else {
      if (wx.getStorageSync('token') || this.data.acid) {
        this.getActivity()
      } else {
        this.getActivityList()
      }
    }
  },

  // 获取积分商城分类列表
  getSortList() {
    RQ.getRequest('/api/integral/integralCategoryList', '', (res) => {
      this.setData({
        sortList: res.result
      })
    })
  },
  // 获取积分商城标签内容
  getLabel() {
    RQ.getRequest('/api/integral/integralLabelList', '', (res) => {
      let label = res.result.integralLabelNavList;
      for(let i = 0; i< label.length; i++) {
        label[i].img = recommendForYou[i].img
      }
      this.setData({
        label: label,
        labelList: res.result.integralLabelList
      })
    })
  },
  //跳转商品分类页
  goShopList(event) {
    let categoryId = event.currentTarget.dataset.categoryid;
    let labelId = event.currentTarget.dataset.labelid;
    wx.navigateTo({
      url: '/pages/integral-shop/list/list?categoryId=' + categoryId + '&labelId=' + labelId,
    })
  },
  //跳转商品详情页
  goDetail(event) {
    let id = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/integral-shop/detail/detail?id=' + id,
    })
  },

  //订阅提醒
  submitInfo(e) {
    let form = {
      token: wx.getStorageSync('token'),
      fromid: e.detail.formId
    }
    RQ.postRequest('/api/user/subscribeMiniappMessage', form, (res) => {
      wx.showToast({
        title: res.msg,
        icon: 'none'
      })
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
    this.setData({
      ac_list: [],
      now_acContent: null,
      organization_time: null,
      match_time: null,
      is_start: false,
      is_end: false,
      popupShow: false,
      isInvalid: false,
    })
    if (this.data.nav_index == 2) {
      this.getSortList()
      this.getLabel()
    } else {
      if (wx.getStorageSync('token') || this.data.acid) {
        this.getActivity()
      } else {
        this.getActivityList()
      }
    }
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
    this.setData({
      ac_list: [],
      now_acContent: null,
      organization_time: null,
      match_time: null,
      is_start: false,
      is_end: false,
      popupShow: false,
      isInvalid: false,
    })
    if (this.data.nav_index == 2) {
      this.getSortList()
      this.getLabel()
    } else {
      if (wx.getStorageSync('token') || this.data.acid) {
        this.getActivity()
      } else {
        this.getActivityList()
      }
    }
    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 500)
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
      title: '参与活动，免费领取' + this.data.now_acContent.goods_data.goods_name,
      path: 'pages/activity/activity?acid=' + this.data.now_acContent.spell_project_id,
      imageUrl: this.data.now_acContent.goods_data.original_img,
    }
  }
})
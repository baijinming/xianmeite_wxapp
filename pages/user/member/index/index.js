const RQ = require('../../../../utils/request.js');
let equityList = [
  {
    iconUrl: '/static/images/user/member/icon1.png',
    text1: '积分换礼',
    text2: '可到积分商城换取礼品'
  },
  {
    iconUrl: '/static/images/user/member/icon2.png',
    text1: '急速配送',
    text2: '最快时间商品送到指定地点'
  },
  {
    iconUrl: '/static/images/user/member/icon3.png',
    text1: '售后服务',
    text2: '售后在线与电话咨询'
  },
  {
    iconUrl: '/static/images/user/member/icon4.png',
    text1: '特色活动',
    text2: '参加平台设置的各项活动'
  },
  {
    iconUrl: '/static/images/user/member/icon5.png',
    text1: '会员价格',
    text2: '按照优惠的会员价格采买'
  },
  {
    iconUrl: '/static/images/user/member/icon6.png',
    text1: '积分提现',
    text2: '积分返现及提现(每月两次）'
  },
  {
    iconUrl: '/static/images/user/member/icon7.png',
    text1: '专属服务',
    text2: '享受平台提供的专属服务'
  }

]

Page({

  /**
   * 页面的初始数据
   */
  data: {
    equityList: [],
    cardList: [
      'https://dstest.pxuc.com.cn/Public/imgs/common_card.png',
      'https://dstest.pxuc.com.cn/Public/imgs/gold_card.png',
      'https://dstest.pxuc.com.cn/Public/imgs/platinum_card.png',
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getMember()
  },

  // 获取会员等级
  getMember() {
    let allIntegral = wx.getStorageSync('userInfo').all_account_log;
    let myMember;
    RQ.getRequest('/api/user/levelList', '', (res) => {
      let memberList = res.result;
      for(let i = 0; i < memberList.length; i++) {
        if (allIntegral > 0 && allIntegral < memberList[i].amount) {
          let member = memberList[i-1];
          console.log(member)
          myMember = {
            name: member.level_name,
            text: '还差' + parseInt(memberList[i].amount-allIntegral) + '积分升级为' + memberList[i].level_name + ' >',
            level_id: member.level_id
          }
        } else {
          let member = memberList[memberList.length-1];
          myMember = {
            name: member.level_name,
            text: '您已经是最高等级会员 >',
            level_id: member.level_id
          }
        }
      }
      if (allIntegral == 0) {
        let member = memberList[0];
        myMember = {
          name: member.level_name,
          text: '还差' + parseInt(memberList[1].amount - allIntegral) + '积分升级为' + memberList[1].level_name + ' >',
          level_id: member.level_id
        }
      }
      let e = equityList;
      if (myMember.level_id == 1) {
        equityList = e.slice(0,4)
      } else if (myMember.level_id == 2) {
        equityList = e.slice(0,6)
      }
      this.setData({
        myMember: myMember,
        equityList: equityList
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
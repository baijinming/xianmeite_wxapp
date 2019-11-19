const RQ = require('../../../utils/request.js');

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
    this.getList()
  },

  // 获取优惠券列表
  getList() {
    let form = {
      token: wx.getStorageSync('token'),
      type: 2
    }
    RQ.postRequest('/api/user/getCouponList', form, (res) => {
      let list = res.result;
      for(let i = 0; i < list.length; i++) {
        list[i].money = list[i].money.split('.')[0];
        list[i].condition = list[i].condition.split('.')[0];
      }
      this.setData({
        list: list
      })
    })
  },

  goIndex() {
    wx.switchTab({
      url: '/pages/index/index',
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
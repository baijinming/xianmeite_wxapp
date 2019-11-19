const RQ = require('../../../utils/request.js');

Page({

  /**
   * 页面的初始数据
   */
  data: { 
    list: [],
    totalIntergral: 0,
    allIntegral: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.totalIntergral) {
      this.setData({
        totalIntergral: options.totalIntergral,
        allIntegral: wx.getStorageSync('userInfo').all_account_log,
      })
    }
    this.getData()
  },

  getData() {
    let that = this;
    RQ.postRequest("/api/user/conchDetail", { token: wx.getStorageSync('token')}, function(res) {
      if(res.status == 1) {
        let list = res.result;
        for(let i = 0; i < list.length; i++) {
          if (list[i].pay_points > 0) {
            list[i].pay_points = '+' + list[i].pay_points;
          }
        }
        that.setData({
          list: list
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
const RQ = require('../../../utils/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData()
  },

  // 获取足迹
  getData() {
    let that = this;
    RQ.postRequest("/api/goods/goodsview", { token: wx.getStorageSync('token') }, function (res) {
      if (res.status == 1) {
        let handleList = res.result;
        let showList = [];
        for (let i = 0; i < handleList.length; i++) {
          let hasTime = false;
          let index = 0;
          for (let j = 0; j < showList.length; j++) {
            if (handleList[i].add_time_str == showList[j].time) {
              hasTime = true;
              index = j;
            }
          }
          if (hasTime) {
            showList[index]['content'].push(handleList[i]);
          } else {
            showList.push({ time: handleList[i].add_time_str, content: [handleList[i]] });
          }
        }
        that.setData({
          list: showList
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
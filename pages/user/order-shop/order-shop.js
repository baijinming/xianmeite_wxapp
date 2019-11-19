const RQ = require('../../../utils/request.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    order_id: null,
    shopList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      order_id: options.order_id,
    })
  },

  // 获取订单商品
  getList() {
    let that = this;
    RQ.postRequest('/api/user/getOrderDetail', { token: wx.getStorageSync('token'), id: that.data.order_id}, (res) => {
      if (res.status == 1) {
        that.setData({
          shopList: res.result.goods_list
        })
      }
    })
  },

  goComment(event) {
    wx.navigateTo({
      url: '/pages/user/comment/comment?order_id=' + this.data.order_id + '&goods_id=' + event.currentTarget.dataset.id,
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
    this.getList()
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
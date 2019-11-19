const RQ = require('../../utils/request.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  //领取新人福利优惠券
  lqwelfare() {
    RQ.postRequest('/api/Promotion/couponState', {token: wx.getStorageSync('token')}, (res) => {
      if (res.result.coupon && res.result.coupon.order_id != 0) {
        wx.showToast({
          title: '你已不是新人了哦',
          icon: 'none'
        })
      } else {
        RQ.postRequest('/api/Promotion/applyCoupon', { token: wx.getStorageSync('token') }, (res) => {
          this.getShopList()
        })
      }
    })

  },

  // 获取新人福利商品
  getShopList() {
    RQ.postRequest('/api/Promotion/getGood', {token: wx.getStorageSync('token')}, (res) => {
      if(res.result.length == 0){
        wx.showToast({
          title: '暂无新人福利商品',
          icon: 'none'
        })
      }
      this.setData({
        list: res.result
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
    // if(wx.getStorageSync('token')) {
    //   this.getShopList()
    // }
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
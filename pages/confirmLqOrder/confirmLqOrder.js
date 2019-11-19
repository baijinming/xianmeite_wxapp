// pages/confirmOrder/confirm.js
var request = require("../../utils/request.js");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    payType: 1,
    addressList: null,
    cartList: null,
    totalPrice: null,
    couponList: null,

    pay_points: true,
    address_id: null,
    hasAddress: false,
    hiddenPage: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id
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
    this.getCat();
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
    this.getCat();
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

  },
  changeType: function (e) {
    let dataset = e.target.dataset;
    this.setData({
      payType: dataset.type
    })
  },
  goAddress: function () {
    wx.navigateTo({
      url: '/pages/user/address/index/index?operation=choose',
    })
  },
  getCat: function () {
    let params = {
      token: wx.getStorageSync('token'),
      spell_project_id: this.data.id
    };
    request.postRequest('/api/SpellGoods/purchaseCheck', params, (msg) => {
      wx.stopPullDownRefresh();
      if (msg.status == 1) {
        let result = msg.result;
        let address_id = null;
        let hasAddress = false;
        if (result.addressList && result.addressList[0].address_id) {
          address_id = result.addressList[0].address_id;
          hasAddress = true;
        }
        this.setData({
          addressList: result.addressList[0],
          goodsList: result.goodsList,
          address_id: address_id,
          hasAddress: hasAddress,
          hiddenPage: false,
        })
      }
    })
  },

  confirmOrder: function () {
    let token = wx.getStorageSync('token');
    let that = this;
    let params = {
      token: token,
      address_id: this.data.address_id,
      spell_project_id: that.data.id
    };

    if (!this.data.address_id) {
      wx.showToast({
        title: '请选择地址',
        icon: 'none'
      });
      return false;
    }

    request.postRequest('/api/SpellGoods/buyGoods', params, (msg) => {
      wx.showToast({
        title: msg.msg,
        icon: 'none'
      });
      if(msg.status == 1) {
        setTimeout(() => {
          wx.navigateTo({
            url: '/pages/ac-order/ac-order',
          })
        }, 1000)
      }
    })
  },

  
});
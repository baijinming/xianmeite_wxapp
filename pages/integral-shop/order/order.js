
var request = require("../../../utils/request.js");
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
    hiddenPage: true,
    immediately: false,
    showPopup: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      goods_id: options.id
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
  //积分商城订单信息获取
  getCat: function () {
    let params = {
      token: wx.getStorageSync('token'),
      goods_id: this.data.goods_id
    };
    request.postRequest('/api/integral/purchaseCheck', params, (msg) => {
      wx.stopPullDownRefresh();
      if (msg.status == 1) {
        let result = msg.result;

        let address_id = null;
        let hasAddress = false;
        if (result.addressList && result.addressList.length > 0) {
          address_id = result.addressList[0].address_id;
          hasAddress = true;
        }
        this.setData({
          addressList: result.addressList[0],
          address_id: address_id,
          goodsList: result.goodsList,
          hiddenPage: false,
          hasAddress: hasAddress
        })
      }
    })
  },
  //积分商城商品确认兑换
  confirmOrder: function () {
    let token = wx.getStorageSync('token');
    let that = this;
    let params = {
      token: token,
      goods_id: that.data.goodsList.goods_id,
      address_id: that.data.address_id
    };

    if (!this.data.address_id) {
      wx.showToast({
        title: '请选择地址',
        icon: 'none'
      });
      return false;
    }

    let pay_points = wx.getStorageSync('userInfo').pay_points;
    let order_money = that.data.goodsList.integral_count;
    if (pay_points < order_money) {
      that.setData({
        showPopup: true
      })
      return false;
    }

    request.postRequest('/api/integral/buyGoods', params, (msg) => {
      wx.showToast({
        title: msg.msg,
        icon: 'none'
      });
      if (msg.status == 1) {
        setTimeout(() => {
          wx.navigateTo({
            url: '/pages/jf-order/jf-order',
          })
        }, 1000)
      }
    })
  },

  // 余额支付订单
  payOrder: function (order) {
    let token = wx.getStorageSync('token');
    let params = {
      token: token,
      order_sn: order
    };
    let url = '/api/payment/dopayWithMoney';
    request.postRequest(url, params, (res) => {
      if (res.status == 1) {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        });
        wx.navigateTo({
          url: '/pages/user/order/order?currentTab=2',
        })
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        });
      }
    })
  },
  // 微信支付
  wxPayOrder: function (order) {
    let token = wx.getStorageSync('token');
    let params = {
      token: token,
      order_sn: order
    };
    let payType = this.data.payType;
    let url = '/api/wxpay/pay';

    request.postRequest(url, params, (msg) => {
      if (msg.status == 1) {
        let data = msg.result;
        wx.requestPayment(
          {
            timeStamp: String(data.timeStamp),
            nonceStr: data.nonceStr,
            package: data.package,
            signType: data.signType,
            paySign: data.sign,
            success: function (res) {
              wx.showToast({
                title: '支付成功',
                icon: 'none'
              });
              wx.navigateTo({
                url: '/pages/user/order/order?currentTab=2',
              })
            },
            fail: function (res) {
              console.log(res)
              wx.showToast({
                title: res.err_desc,
                icon: 'fail'
              });
              wx.navigateTo({
                url: '/pages/user/order/order?currentTab=1',
              })
            },
            complete: function (res) { }
          })
      } else {
        wx.showToast({
          title: msg.msg,
          icon: 'none'
        });
      }
    })

  },

  // 关闭弹窗
  closePopup() {
    this.setData({
      showPopup: false
    })
  }
});
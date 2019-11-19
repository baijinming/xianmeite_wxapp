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
    hiddenPage: true,
    immediately: false,
    showPopup: false,

    couponId: null,
    showCoupon: false,
    welfare: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    if (options.immediately) {
      this.setData({
        immediately: true,
        pay_points: false
      })
    }
    if (options.welfare) {
      this.setData({
        welfare: true
      })
    }
    this.isJoinAc()
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
      unique_id: wx.getStorageSync('userInfo').openid,
      ...app.globalData.repurchaseGoods,
      is_reg_user: 1
    };
    request.postRequest('/api/cart/cart4', params, (msg) => {
      wx.stopPullDownRefresh();
      if (msg.status == 1) {
        let result = msg.result;
        let list = result.cartList;
        let cartList = [];
        for (let i = 0; i < list.length; i++) {
          let item = list[i].cartList;
          for (let j = 0; j < item.length; j++) {
            item[j].checked = true;
            cartList.push(item[j])
          }
        }

        let address_id = null;
        let hasAddress = false;
        if (result.addressList && result.addressList.length > 0) {
          address_id = result.addressList[0].address_id;
          hasAddress = true;
        }
        if (this.data.couponMoney) {
          result.totalPrice.total_fee = (+result.totalPrice.total_fee) - (+this.data.couponMoney);
        }
        this.setData({
          addressList: result.addressList[0],
          cartList: cartList,
          totalPrice: result.totalPrice,
          couponList: result.couponList,
          address_id: address_id,
          hasAddress: hasAddress,
          hiddenPage: false,
          shop_total: (+result.totalPrice.total_fee) + (+result.totalPrice.cut_fee) - (+result.totalPrice.post_fee),
          integral_money: result.integral_money
        })
        if (this.data.isJoinAc) {
          this.countScore()
        }
      }
    })
  },

  confirmOrder: function () {
    let token = wx.getStorageSync('token');
    let that = this;
    let params = {
      token: token,
      is_buyNow: 1,
      address_id: this.data.address_id,
      pay_points: this.data.pay_points,
      goods_id: this.data.cartList[0].goods_id,
      goods_num: this.data.cartList[0].goods_num,
      shop_id: this.data.cartList[0].shop_id,
      goods_spec: app.globalData.repurchaseGoods.goods_spec,
    };
    if (that.data.welfare) {
      params.is_reg_user = 1
    }

    if(this.data.couponId) {
      params.coupon_price = this.data.couponId;
    }

    if (!this.data.address_id) {
      wx.showToast({
        title: '请选择地址',
        icon: 'none'
      });
      return false;
    }

    let balance = wx.getStorageSync('userInfo').user_money;
    let order_money = that.data.totalPrice.total_fee;
    if (that.data.payType != 1 && balance < order_money) {
      that.setData({
        showPopup: true
      })
      return false;
    }

    request.postRequest('/api/cart/cart3', params, (msg) => {
      if (msg.status == 1) {
        let payType = that.data.payType;
        if (payType == 1) {
          that.wxPayOrder(msg.result.order_sn);
        } else {
          that.payOrder(msg.result.order_sn);
        }
      } else {
        wx.showToast({
          title: msg.msg,
          icon: 'none'
        });
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
  },

  //展示优惠券列表
  showCoupon() {
    this.setData({
      showCoupon: true
    })
    this.getList()
  },
  //隐藏优惠券列表
  hideCoupon() {
    this.setData({
      showCoupon: false
    })
  },
  //使用优惠券
  useCoupon(e) {
    if (this.data.shop_total < e.currentTarget.dataset.condition) {
      wx.showToast({
        title: '不符合使用条件',
        icon: 'none'
      })
      return false;
    }
    let totalPrice = this.data.totalPrice;
    totalPrice.total_fee = (+totalPrice.total_fee) - (+e.currentTarget.dataset.money);
    this.setData({
      couponId: e.currentTarget.dataset.id,
      couponMoney: e.currentTarget.dataset.money,
      totalPrice: totalPrice,
      showCoupon: false
    })
    if (this.data.isJoinAc) {
      this.countScore()
    }
  },

  // 获取优惠券列表
  getList() {
    let form = {
      token: wx.getStorageSync('token'),
      type: 2
    }
    request.postRequest('/api/user/getCouponList', form, (res) => {
      let list = res.result;
      for (let i = 0; i < list.length; i++) {
        list[i].money = list[i].money.split('.')[0];
        list[i].condition = list[i].condition.split('.')[0];
      }
      this.setData({
        list: list
      })
    })
  },

  // 判断用户是否参与先到先得活动
  isJoinAc() {
    request.postRequest('/api/SpellGoods/activity_information', {token: wx.getStorageSync('token')}, (res) => {
      if (res.result.spell_project_user) {
        this.setData({
          isJoinAc: true
        })
      }
    })
  },

  // 计算分数
  countScore() {
    let score = parseInt(this.data.totalPrice.total_fee / 35) * 10 + 5;
    this.setData({
      acScore: score
    })
  }

});
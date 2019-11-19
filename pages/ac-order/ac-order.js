const RQ = require('../../utils/request.js');
const Format = require('../../utils/format.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0,
    noOrder: true,
    type: "",
    waitPay: [],
    waitSend: [],
    waitReceive: [],
    waitComment: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.currentTab) {
      let t = "";
      if (options.currentTab == 1) {
        t = 'WAITPAY'
      } else if (options.currentTab == 2) {
        t = 'WAITSEND'
      } else if (options.currentTab == 3) {
        t = 'WAITRECEIVE'
      } else if (options.currentTab == 4) {
        t = 'FINISH'
      }
      this.setData({
        currentTab: options.currentTab,
        type: t
      })
    }
    this.getData()
  },

  // 获取订单列表
  getData() {
    let that = this;
    RQ.postRequest("/api/user/getSpellOrderList", { token: wx.getStorageSync('token'), type: that.data.type }, function (res) {
      if (res.status == 1) {
        let list = res.result;
        if (list.length > 0) {
          that.setData({
            noOrder: false
          })
        } else {
          that.setData({
            noOrder: true
          })
        }
        let waitPay = [];
        let waitSend = [];
        let waitReceive = [];
        let waitComment = [];
        for (let i = 0; i < list.length; i++) {
          let timeJS = list[i].add_time;
          list[i]['time_str'] = Format.formatTimeTwo(timeJS, 'Y-M-D h:m')
          if (list[i].order_status_code == "WAITPAY") {
            waitPay.push(list[i])
          }
          if (list[i].order_status_code == "WAITSEND") {
            waitSend.push(list[i])
          }
          if (list[i].order_status_code == "WAITRECEIVE") {
            waitReceive.push(list[i])
          }
          if (list[i].order_status_code == "FINISH") {
            waitComment.push(list[i])
          }
        }
        that.setData({
          waitPay: waitPay,
          waitSend: waitSend,
          waitReceive: waitReceive,
          waitComment: waitComment,
        })
      }
    })
  },

  // 去付款
  goPay(event) {
    let order_sn = event.currentTarget.dataset.sn;
    this.wxPayOrder(order_sn)
  },

  // 取消订单 
  delOrder(event) {
    let order_id = event.currentTarget.dataset.id;
    let that = this;
    RQ.postRequest('/api/user/cancelOrder', { token: wx.getStorageSync('token'), order_id: order_id }, (res) => {
      if (res.status == 1) {
        wx.showToast({
          title: '订单已取消',
          icon: 'success'
        })
        setTimeout(() => {
          that.getData()
        }, 1000)
      }
    })
  },

  // 确认收货
  sureReceive(event) {
    let that = this;
    RQ.postRequest("/api/user/orderSpellConfirm", { token: wx.getStorageSync('token'), order_id: event.currentTarget.dataset.id }, function (res) {
      if (res.status == 1) {
        wx.showToast({
          title: '确认成功',
          icon: 'success'
        })
        setTimeout(() => {
          that.setData({
            currentTab: 4,
            type: 'FINISH'
          })
          that.getData();
        }, 1000)
      }
    })
  },

  // 提醒发货
  remindSend() {
    wx.showLoading({
      title: '加载中',
    })
    setTimeout(() => {
      wx.hideLoading();
      wx.showToast({
        title: '已提醒卖家发货',
        icon: 'success'
      })
    }, 1000)
  },

  navSwitch(event) {
    let current = event.currentTarget.dataset.current;
    let t = "";
    if (current == 1) {
      t = 'WAITPAY'
    } else if (current == 2) {
      t = 'WAITSEND'
    } else if (current == 3) {
      t = 'WAITRECEIVE'
    } else if (current == 4) {
      t = 'FINISH'
    } else {
      t = ''
    }
    this.setData({
      currentTab: current,
      type: t
    })
    this.getData();
  },

  // 微信支付
  wxPayOrder: function (order) {
    let that = this;
    let token = wx.getStorageSync('token');
    let params = {
      token: token,
      order_sn: order
    };
    let url = '/api/wxpay/pay';

    RQ.postRequest(url, params, (msg) => {
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
              that.setData({
                currentTab: 2,
                type: 'WAITSEND'
              })
              that.getData();
            },
            fail: function (res) {

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
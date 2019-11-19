// pages/detail/detail.js
var request = require("../../utils/request.js");
const WxParse = require('../../wxParse/wxParse.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    gallery: [],
    indicatorDots: false,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    proList: [1, 2],
    goods: null,
    currentSwiper: 1,
    hidden: true,
    goodsId: null,
    is_collect: 0,
    immediately: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      orderId: options.id
    })
  },

  // 跳特色中心
  goAc(e) {
    getApp().globalData.ac_nav_index = e.currentTarget.dataset.index;
    wx.switchTab({
      url: '/pages/activity/activity',
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getDetail();
    // this.getList();
    // this.addgoodsview()
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
    return {
      title: this.data.goods.goods_name,
      path: "pages/detail/detail?id=" + this.data.goods.goods_id,
      imageUrl: this.data.goods.original_img
    };
  },

  // 图片预览
  previewImage(event) {
    let that = this;
    let imgUrls = [];
    for (let i = 0; i < that.data.gallery.length; i++) {
      imgUrls.push(that.data.gallery[i].image_url)
    }
    wx.previewImage({
      urls: imgUrls,
      current: event.currentTarget.dataset.current
    })
  },

  getId() {

  },

  // 增加浏览记录
  addgoodsview() {
    let that = this;
    let userInfo = wx.getStorageSync('userInfo');
    let token = wx.getStorageSync('token');
    if (userInfo && token) /**用户已经登录 */ {
      request.postRequest('/api/goods/addgoodsview', { token: token, id: that.data.orderId }, (res) => {

      })
    }
  },

  getDetail: function () {
    let str = 'id=' + this.data.orderId + '&is_reg_user=1';
    let userInfo = wx.getStorageSync('userInfo');
    let token = wx.getStorageSync('token');
    if (userInfo && token) /**用户已经登录 */ {
      str = str + '&token=' + token;
    }
    request.getRequest('/api/goods/goodsInfo', str, (msg) => {
      let result = msg.result;
      var article = result.goods.goods_content.split('<style>')[1].split('</style>')[1]
      WxParse.wxParse('article', 'html', article, this, 5);
      this.setData({
        goods: result.goods,
        gallery: result.gallery,
        comment: result.comment,
        is_collect: result.goods.is_collect
      })
      // this.getShopInfo(result.goods.shop_id)
    })
  },
  // 获取店铺信息
  getShopInfo(id) {
    let str = 'token=' + wx.getStorageSync('token') + '&shop_id=' + id;
    request.getRequest('/api/shop/shop_desc', str, (res) => {
      this.setData({
        shopMsg: res.result
      })
    })
  },
  getList: function () {
    request.getRequest('/api/goods/guessYouLike', '', (msg) => {
      let result = msg.result;
      this.setData({
        proList: result
      })
    })
  },
  swiperChange: function (e) {
    let current = e.detail.current;
    current += 1;
    this.setData({
      currentSwiper: current
    })
  },
  goComment: function () {
    wx.navigateTo({
      url: '/pages/comment/comment?id=' + this.data.orderId,
    })
  },
  showModal: function (event) {
    let immediately = event.currentTarget.dataset.immediately == 'true' ? true : false;
    this.setData({
      hidden: false,
      immediately: immediately,
      welfare: event.currentTarget.dataset.welfare
    })
  },
  collectGoods: function () {
    let userInfo = wx.getStorageSync('userInfo');
    let token = wx.getStorageSync('token');
    let type = this.data.is_collect;
    let params = {
      token: token,
      goods_id: this.data.orderId,
      type: type
    };
    request.postRequest('/api/goods/collectGoods', params, (msg) => {
      if (msg.status == 1) {
        if (type == 1) {
          type = 0;
        } else {
          type = 1;
        }
        wx.showToast({
          title: msg.msg,
          icon: 'none'
        })
        this.setData({
          is_collect: type
        })
      }
    })
  }
});
// pages/brand/brand.js
var request = require("../../utils/request.js");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    indicatorDots: false,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    list:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getList();
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

  },

  getList:function(){
    let token = wx.getStorageSync('token');
    let params = {
      token: token,
    };
    request.postRequest('/api/index/getClearList',params,(msg)=>{
      if(msg.status==1){
        let obj={};
        let list = msg.result;
        for(let i=0;i<list.length;i++){
          let id=list[i].goods_id;
          obj[id]=1;
        }
        this.setData({
          list: list,
          currentIndex:obj
        })
      }
    })
  },
  swiperChange:function(e){
    let dataset=e.currentTarget.dataset;
    let id=dataset.id;
    let currentIndex=this.data.currentIndex;
    let num = e.detail.current;
    num++;
    currentIndex[id] = num;
    this.setData({
      currentIndex: currentIndex
    })
  },
  // 图片预览
  previewImage(event) {
    let that = this;
    let index = event.currentTarget.dataset.index;
    let imgUrls = [];
    for (let i = 0; i < that.data.list[index].gallery.length; i++) {
      imgUrls.push(that.data.list[index].gallery[i].image_url)
    }
    wx.previewImage({
      urls: imgUrls,
      current: event.currentTarget.dataset.current
    })
  },

});
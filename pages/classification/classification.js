// pages/productType/proType.js
var app = getApp();
var request = require("../../utils/request.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navH: app.globalData.navHeight,
    type: [],
    list:[],
    categoryId:1,
    pageNum:1,
    allLoaded:false,
    city: '北京'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      city: app.globalData.city ? app.globalData.city : '北京'
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
    this.setData({
      categoryId: app.globalData.categoryId
    }) 
    this.getCategory();
    this.setData({
      city: app.globalData.city.length > 4 ? app.globalData.city.slice(0, 4) : app.globalData.city
    })
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

  goPage:function(){
    let categoryId = this.data.categoryId;
    let pageNum = this.data.pageNum;
    pageNum++;
    this.getGoodsList(pageNum, categoryId, 1);
  },

  getCategory: function () {
    request.getRequest('/api/goods/goodsCategoryList', '', (msg) => {
      let result = msg.result;
      this.setData({
        type: result
      });

      let categoryId = this.data.categoryId;
      if (!categoryId){
        categoryId=result[0].id;
      }

      this.getGoodsList(1, categoryId);
    })
  },
  getCategoryList:function(e){
    let dataset = e.target.dataset
    let id = dataset.id;
    this.getGoodsList(1,id);
    this.setData({
      categoryId:id
    })
  },
  getGoodsList: function (pageNum,id,flag) {
    let arr=[];
    arr.push('p=' + pageNum);
    arr.push('id=' + id);
    let str = arr.join('&');

    let allLoaded = this.data.allLoaded;
    if(flag!=1){
      allLoaded=false;
    }

    if (allLoaded){
      return;
    }
    request.getRequest('/api/goods/goodsList', str, (msg) => {
      let result = msg.result;
      let goods_list = result.goods_list;
      let list=this.data.list;
      if (goods_list.length==0){
        this.setData({
          allLoaded:true
        })
      }
      if(flag==1){
        list = list.concat(goods_list);
      }else{
        list = goods_list
      }
      this.setData({
        list: list,
        pageNum: pageNum,
        categoryId: id
      })
    })
  },
  goCity() {
    console.log('111')
    wx.navigateTo({
      url: '/pages/city/city?city=' + this.data.city,
    })
  }
})
// pages/hotproduct/hotproduct.js
var request = require("../../utils/request.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: [],
    proList:[],
    categoryId: null,
    pageNum: 1,
    allLoaded:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCategory();
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
    let pageNum = this.data.pageNum;
    let id = this.data.categoryId;
    pageNum++;
    this.getGoodsList(pageNum,id,1);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  getCategory: function () {
    request.getRequest('/api/goods/goodsFineCategoey', '', (msg) => {
      let result = msg.result;
      this.setData({
        type: result.category
      });

      let categoryId = result.category[0].id;
      this.getGoodsList(1, categoryId);
      this.setData({
        categoryId: categoryId
      })
    })
  },
  getCategoryList: function (e) {
    let dataset = e.target.dataset
    let id = dataset.id;
    this.getGoodsList(1, id);
    this.setData({
      categoryId: id
    })
  },
  getGoodsList: function (pageNum, id,flag) {
    // flag:1表示是否是下拉加载
    let form = {
      p: pageNum,
      cat_id: id,
      type: 3
    };
    let allLoaded = this.data.allLoaded;

    if(flag!=1){
      this.setData({
        allLoaded:false
      });
      allLoaded=false;
    }

    if (allLoaded){
      return false;
    }
    request.postRequest('/api/goods/goodsFine', form, (msg) => {
      let result = msg.result;
      let proList = this.data.proList;
      if (result.length==0){
        this.setData({
          allLoaded:true
        })
      }
      if (flag==1){
        proList=proList.concat(result)
      }else{
        proList=result;
      }
      this.setData({
        proList: proList,
        pageNum: pageNum
      })
    })
  }
})
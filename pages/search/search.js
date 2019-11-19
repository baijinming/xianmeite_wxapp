// pages/search/search.js
var request = require("../../utils/request.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchList: [],
    proList: [],
    showSearch: true,
    keyword: null,
    focus: true,
    pageNum: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.getHotList();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    let pageNum = this.data.pageNum;
    pageNum++;
    this.setData({
      pageNum: pageNum
    })
    this.searchKeyword(1);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  handleChange: function(e) {
    let val = e.detail.value;
    this.setData({
      keyword: val
    })
    if (val == '') {
      this.setData({
        proList: [],
        showSearch: true
      })
    }
  },

  bindfocus: function() {
    this.setData({
      focus: true
    })
  },

  getHotList: function() {
    request.getRequest('/api/Search/hotWords', '', (msg) => {
      console.log(msg)
      if (msg.status == 1) {
        let result = msg.result;
        this.setData({
          searchList: result,
        })
      } else {
        wx.showToast({
          title: '请求失败，请稍后重试',
          duration: 2000
        })

      }
    })
  },

  searchHotWord: function(e) {
    let name = e.target.dataset.name;
    this.setData({
      keyword: name
    });
    this.searchKeyword();
  },

  searchKeyword: function(flag) {
    let keyword = this.data.keyword;
    if (keyword == null || keyword == '') {
      wx.showToast({
        title: '请输入要搜索内容',
        duration: 2000,
        icon: 'none',
      })
      return false;
    }
    let params = `p=${this.data.pageNum}&keyword=${this.data.keyword}`;
    request.getRequest('/api/Search/goods', params, (msg) => {
      if (msg.status == 1) {
        let result = msg.result;
        let list = result.list;
        let proList = this.data.proList;
        if (list.length == 0) {
          this.setData({
            allLoaded: true
          })
        }
        if (flag == 1) {
          proList = proList.concat(list)
        } else {
          proList = list;
        }
        this.setData({
          proList: proList,
          showSearch: false
        })
      } else {
        wx.showToast({
          title: '请求失败，请稍后重试',
          duration: 2000
        })
      }
    })
  }
});
// pages/test/test.js
var request = require("../../utils/request.js");
var app = getApp();
var bmap = require('../../utils/bmap-wx.min.js'); 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    typeList: [],
    proList: [],
    actlist: [],
    adlist: [],
    indicatorDots: false,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    proList: [],
    pageNum: 1,
    allLoaded: false,
    city: '',
    fruitList: [],
    seafoodList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getHomeCategory();
    this.getList();
    this.getFruits();
    this.getSeafoods()

    this.getUserLocation()
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
    this.getHomeCategory();
    this.setData({
      proList: [],
      allLoaded: false
    })
    this.getList();
    setTimeout(() => {
      wx.stopPullDownRefresh()
    },500)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if(!this.data.allLoaded) {
      this.setData({
        pageNum: ++this.data.pageNum
      })
      this.getList();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  // 获取时令水果商品 id：1
  getFruits() {
    let str = `p=1&id=1&pagesize=3`
    request.getRequest('/api/goods/goodsList', str, (res) => {
      if (res.result.goods_list.length > 0){
        this.setData({
          fruitList: res.result.goods_list
        })
      }
    }) 
  },

  // 获取鲜美海味商品 id：4
  getSeafoods() {
    let str = `p=1&id=4&pagesize=3`
    request.getRequest('/api/goods/goodsList', str, (res) => {
      if (res.result.goods_list.length > 0) {
        this.setData({
          seafoodList: res.result.goods_list
        })
      }
    })
  },

  getHomeInfo: function (pageNum) {
    let params = {};
    params.p = pageNum;
    request.postRequest('/api/Index/homePage', params, (msg) => {
      if (msg.status == 1) {
        let result = msg.result;
        this.setData({
          typeList: result.iconlist,
          adlist: result.adlist,
          actlist: result.actlist,
          proList: result.getRecList
        })
      } else {
        wx.showToast({
          title: '请求失败，请稍后重试',
          duration: 2000
        })

      }
    })
  },
  getHomeCategory: function () {
    request.getRequest('/api/index/homecategory', '', (msg) => {
      if (msg.status == 1) {
        let result = msg.result;
        this.setData({
          typeList: result.category,
          adlist: result.ad,
        })
      } else {
        wx.showToast({
          title: '请求失败，请稍后重试',
          duration: 2000
        })
      }
    })
  },
  getList: function () {
    let form = {
      p: this.data.pageNum,
      type: 1
    };
    request.postRequest('/api/goods/goodsFine',  form, (msg) => {
      let result = msg.result;
      if(result.length <= 0) {
        this.setData({
          allLoaded: true
        })
      }
      this.setData({
        proList: [...this.data.proList, ...result]
      })
    })
  },
  goCategory: function (e) {
    app.globalData.categoryId = e.target.dataset.id;
    wx.switchTab({
      url: '/pages/classification/classification',
    })
  },

  // 轮播图跳转
  swiperJump(event) {
    let urlStr = event.currentTarget.dataset.url;
    if (urlStr.split('')[0] == '/') {
      wx.navigateTo({
        url: urlStr,
      })
    } else {
      wx.navigateTo({
        url: '/pages/web-view/web-view?url=' + urlStr,
      })
    }
  },

  getUserLocation: function () {
    let vm = this;
    wx.getSetting({
      success: (res) => {
        console.log(JSON.stringify(res))
        // res.authSetting['scope.userLocation'] == undefined    表示 初始化进入该页面
        // res.authSetting['scope.userLocation'] == false    表示 非初始化进入该页面,且未授权
        // res.authSetting['scope.userLocation'] == true    表示 地理位置授权
        if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
          wx.showModal({
            title: '请求授权当前位置',
            content: '需要获取您的地理位置，请确认授权',
            success: function (res) {
              if (res.cancel) {
                wx.showToast({
                  title: '拒绝授权',
                  icon: 'none',
                  duration: 1000
                })
              } else if (res.confirm) {
                wx.openSetting({
                  success: function (dataAu) {
                    if (dataAu.authSetting["scope.userLocation"] == true) {
                      wx.showToast({
                        title: '授权成功',
                        icon: 'success',
                        duration: 1000
                      })
                      //再次授权，调用wx.getLocation的API
                      vm.getLocation();
                    } else {
                      wx.showToast({
                        title: '授权失败',
                        icon: 'none',
                        duration: 1000
                      })
                    }
                  }
                })
              }
            }
          })
        } else if (res.authSetting['scope.userLocation'] == undefined) {
          //调用wx.getLocation的API
          vm.getLocation();
        }
        else {
          //调用wx.getLocation的API
          vm.getLocation();
        }
      }
    })
  },
  // 微信获得经纬度
  getLocation: function () {
    let vm = this;
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        var latitude = res.latitude; //纬度
        var longitude = res.longitude; //经度
        var speed = res.speed
        var accuracy = res.accuracy;
        app.globalData.latitude = latitude;
        app.globalData.longitude = longitude;
        vm.getCity(latitude, longitude)
      },
      fail: function (res) {
        console.log('fail' + JSON.stringify(res))
      }
    })
  },
  // 经纬度转换城市
  getCity(latitude, longitude) {
    let that = this;
    wx.request({
      url: 'https://api.map.baidu.com/reverse_geocoding/v3/?ak=IsEomB5om4jTEGpAGaG07nm9irON6viB&location=' + latitude + ',' + longitude + '&output=json&coordtype=wgs84ll',
      data: {},
      header: {
        'Content-Type': 'application/json'
      },
      success(res) {
        console.log(res)
        let city = res.data.result.addressComponent.city;
        that.setData({
          city: city.length > 4 ? city.slice(0, 4) : city
        })
        app.globalData.city = city.length > 4 ? city.slice(0, 4) : city
      }
    })
  },

  goCity(event) {
    wx.navigateTo({
      url: '/pages/city/city?city=' + this.data.city,
    })
  }

});
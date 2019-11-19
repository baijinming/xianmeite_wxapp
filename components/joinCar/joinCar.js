// components/joinCar/joinCar.js
const app=getApp();
var request = require("../../utils/request.js");
Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String
    },
    hidden: {
      type: Boolean,
      observer:function(newValue){
        if (!newValue){
          this.getDetail()
        } 
      }
    },
    confirmText: {
      type: String
    },
    confirmColor: {
      type: String,
      observer: function (newValue) {
        this.setData({
          tintColor: 'color:' + newValue
        })
      }
    },
    orderId:{
      type:String,
      value:''
    },
    repurchase: {
      type: Boolean,
      value: false
    },
    immediately: {
      type: Boolean,
      value: false
    },
    welfare: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    num:1,
    currentUnit:0,
    goods_spec:'',
    loaded:true
  },

  /**
   * 组件的方法列表
   */
  methods: {
    hideModal: function () {
      this.setData({
        hidden: true,
        loaded:true
      })
    },
    confirmBtn: function () {
      console.log(this.data.immediately)
      if (this.data.repurchase || this.data.immediately) {
        this.confirmH(); //换购
      } else {
        this.confirm(); //添加购物车
      }
    },
    // 确认添加购物车
    confirm: function () {
      let goods_spec = this.data.goods_spec;
      let arr=[];
      for(let i=0;i<goods_spec.length;i++){
        let vals=goods_spec[i].values;
        let choose=false;
        for (let j = 0; j < vals.length;j++){
          if(vals[j].checked){
            choose=true;
            arr.push(vals[j].item_id)
          }
        }

        if (!choose){
          wx.showToast({
            title: '请选择' + goods_spec[i].name,
            icon: 'none'
          })
          return false;
        }
      }
      arr = arr.sort((a, b) => {
        return a - b
      });
      let params={
        token: wx.getStorageSync('token'),
        unique_id: wx.getStorageSync('userInfo').openid,
        goods_spec: arr,
        goods_num: this.data.num,
        goods_id: this.data.orderId
      };
      console.log(params)
      request.postRequest('/api/cart/batchAddCart', params, (msg) => {
        let result = msg.result;
        wx.showToast({
          title: msg.msg,
        });
        if (msg.status==1){
          this.setData({
            shopNum: result
          })
          this.hideModal();
        }
      })
    },
    // 确认换购
    confirmH: function () {
      let goods_spec = this.data.goods_spec;
      let arr = [];
      for (let i = 0; i < goods_spec.length; i++) {
        let vals = goods_spec[i].values;
        let choose = false;
        for (let j = 0; j < vals.length; j++) {
          if (vals[j].checked) {
            choose = true;
            arr.push(vals[j].item_id)
          }
        }

        if (!choose) {
          wx.showToast({
            title: '请选择' + goods_spec[i].name,
            icon: 'none'
          })
          return false;
        }
      }
      arr = arr.sort((a, b) => {
        return a - b
      });
      app.globalData.repurchaseGoods = {
        goods_spec: arr,
        goods_num: this.data.num,
        goods_id: this.data.orderId
      }
      console.log(app.globalData.repurchaseGoods)
      if (this.data.immediately == true) {

        if (this.data.welfare == true) {
          wx.navigateTo({
            url: '/pages/confirmRpOrder/confirmRpOrder?immediately=true&welfare=true',
          })
        }
        //立即购买
        wx.navigateTo({
          url: '/pages/confirmRpOrder/confirmRpOrder?immediately=true',
        })
      } else {
        wx.navigateTo({
          url: '/pages/confirmRpOrder/confirmRpOrder',
        })
      }
      
    },
    calcAdd: function () {
      let num = this.data.num;
      num++; 
      this.setData({ 
        num: num
      })
    },
    calcReduce: function () {
      let num = this.data.num;
      num--;
      if (num<=1){
        num=1;
      }
      this.setData({
        num: num
      })
    },
    chooseUnit:function(e){
      let dataset =e.detail.dataset;
      this.setData({
        currentUnit:dataset.index
      })
    },
    getDetail: function () {
      let str = 'id=' + this.data.orderId;
      if (this.data.welfare) {
        str = str + '&is_reg_user=1&token=' + wx.getStorageSync('token') 
      }
      request.getRequest('/api/goods/goodsInfo', str, (msg) => {
        let result = msg.result;
        this.setData({
          goods: result.goods,
          gallery: result.gallery,
          comment: result.comment,
          loaded:false,
          goods_spec: result.goods.goods_spec_list,
          spec_goods_price: result.spec_goods_price
        })
      })
    },
    changeChecked:function(e){
      let goods_spec = this.data.goods_spec;
      let dataset=e.target.dataset;
      console.log(e.target)
      let index=dataset.index;
      let valindex = dataset.valindex;
      let values = goods_spec[index].values;
      for (let i = 0; i < values.length;i++){
        if (i == valindex){
          values[i].checked=true;
        }else{
          values[i].checked= false;
        }
      }

      console.log(values)

      goods_spec[index].values = values;
      this.setData({
        goods_spec: goods_spec
      })

      // let goods_spec = this.data.goods_spec;
      let arr = [];
      for (let i = 0; i < goods_spec.length; i++) {
        let vals = goods_spec[i].values;
        for (let j = 0; j < vals.length; j++) {
          if (vals[j].checked) {
            arr.push(vals[j].item_id)
          }
        }
      }
      arr = arr.sort((a, b) => {
        return a - b
      });
      let str = arr.join('_');
      let spec_goods_price = this.data.spec_goods_price;
      for(let i = 0; i <= spec_goods_price.length; i++) {
        if (spec_goods_price[i] && str == spec_goods_price[i].key) {
          let g = this.data.goods;
          g.shop_price = spec_goods_price[i].price;
          this.setData({
            goods: g
          })
        }
      }
      
    }
  },

  ready: function () {
  }
})

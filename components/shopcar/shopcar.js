// components/shopcar/shopcar.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    orderId:{
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    hidden:true
  },

  /**
   * 组件的方法列表
   */
  methods: {
    joinShopCar: function (e) {
      this.setData({
        hidden: false
      })
    },
    showModal: function () {
     
    }
  }
})

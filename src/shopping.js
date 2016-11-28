/**
 * 购物车
 * 购物车基于jQuery callbacks 完成 
 * 依赖artTemplate [模板引擎]
 * add by gjun
 * add date 2016/11/27
 * 购物车实现方案
 * 
 * 需要理解一下观察者模式
 * 
 */
(function(win,$) {
    
    /**
     * 任务处理器 
     * @type {[type]}
     */
    var taskObserve = $.Callbacks();
    
    /**
     * 对购物车的动作定义
     * PS 增加一个数量
     * EM 减少一个数量
     * CHECK 选择一个产品
     * CHANGE 改变数目 输入框
     * DEL 删除一个 产品
     * @type {Object}
     */
    var ACTIONS = {
    	 PS:'PS',
    	 EM:'EM',
    	 CHECK:'CHECK',
    	 CHANGE:'CHANGE',
    	 DEL:'DEL',
    	 CHECKALL:'CHECKALL'
    }

    /**
     * 购物车定义
     * @param {[type]} options [description]
     */
    var ShoppingCart = function(element,options) {
        this.options = options || {};
        this.element = typeof element ==='string' ? $(element) : element;
         
        this.init();
        this.bind();
        this.render();
    };

     /**
      * 初始化购物车
      * @return {[type]} [description]
      */
     ShoppingCart.prototype.init =function () {
     	 $.each(this.options.datasource,function (i,it) {
     	 	 it.check = true;
     	 	 it.num =1;

     	 });
     	 this.taskInit();

     }

     /**
      * 触发一次命令
      * 加入执行环境
      * @return {[type]} [description]
      */
     ShoppingCart.prototype.fire = function () {
     	var args = Array.prototype.slice.call(arguments,0);
     	taskObserve.fireWith(this,args);
     }

    /**
     * 购物车渲染
     * @return {[type]} [description]
     */
    ShoppingCart.prototype.render = function () {
    	 var tpl =  $(this.options.tpl).html();
    	 var render = template.compile(tpl);
    	 var total = this.countTotal();
    	 var html = render({
    	 	  data:this.options.datasource,
    	 	  count:total.count,
    	 	  select:total.select
    	 });
    	 this.element.html(html);
    }


     
     /**
      * 事件绑定
      * @return {[type]} [description]
      */
     ShoppingCart.prototype.bind = function () {
     	var self = this;
     	 this.element.on('click','[data-event = "em"]',function () {
     	 	  self.fire(ACTIONS.EM,$(this).data('index'));
     	 })
     	 .on('click','[data-event = "ps"]',function () {
     	 	  self.fire(ACTIONS.PS,$(this).data('index')); 
     	 })
     	 .on('change','[data-event= "change"]',function () {
     	 	  self.fire(ACTIONS.CHANGE,$(this).data('index'),$(this).val()); 
     	 })
     	 .on('change','[data-event = "check"]',function () {
     	 	 self.fire(ACTIONS.CHECK,$(this).data('index'),this.checked); 
     	 })
     	 .on('click','[data-event="del"]',function () {
     	 	 self.fire(ACTIONS.DEL,$(this).data('index')); 
     	 })
     	 .on('change','[data-event="ck-all"]',function (argument) {
     	 	  self.fire(ACTIONS.CHECKALL,this.checked); 
     	 })
     };
     
     
     /**
      * 减少数量
      * @param  {[type]} type [description]
      * @param  {[type]} i    [description]
      * @return {[type]}      [description]
      */
     ShoppingCart.prototype.em = function (type,i) {
     	 if(type===ACTIONS.EM){
     	 	  var num = this.options.datasource[i].num ;
     	 	  if(num >1){
     	 	  	    
     	 	  	   this.options.datasource[i].num --;
     	 	  }
     	 }
     }
     
     /**
      * 增加数量
      * @param  {[type]} type [description]
      * @param  {[type]} i    [description]
      * @return {[type]}      [description]
      */
     ShoppingCart.prototype.ps = function (type,i) {
     	 if(type===ACTIONS.PS){
     	 	   this.options.datasource[i].num ++;
     	 }
     }
     
     /**
      * 改变数量 输入
      * @param  {[type]} type  [description]
      * @param  {[type]} i     [description]
      * @param  {[type]} value [description]
      * @return {[type]}       [description]
      */
     ShoppingCart.prototype.change = function (type,i,value) {
     	 if(type===ACTIONS.CHANGE){
     	 	    this.options.datasource[i].num  = parseInt(value)==0 ? 1 : parseInt(value);
     	 }

     }
     
     /**
      * 选择
      * @param  {[type]} type  [description]
      * @param  {[type]} i     [description]
      * @param  {[type]} value [description]
      * @return {[type]}       [description]
      */
     ShoppingCart.prototype.check = function (type,i,value) {
     	 if(type===ACTIONS.CHECK){
     	 	    this.options.datasource[i].check  = value;
     	 }
     	 
     }
     
     /**
      * 移除
      * @param  {[type]} type  [description]
      * @param  {[type]} i     [description]
      * @param  {[type]} value [description]
      * @return {[type]}       [description]
      */
     ShoppingCart.prototype.del = function (type,i,value) {
     	 if(type===ACTIONS.DEL){
     	 	    this.options.datasource.splice(i,1);
     	 }
     	 
     }

     /**
      * 计算总数
      * @return {[type]} [description]
      */
     ShoppingCart.prototype.countTotal = function () {
     	 var count = 0;
     	 var select =0;
     	 $.each(this.options.datasource,function (i,it) {
     	 	  if(it.check){
                  count += (it.price * (it.num || 1));
                  select ++;
     	 	  } 
     	 });
     	 return  {
     	 	count:count,
     	 	select:select
     	 };
     }
     
     ShoppingCart.prototype.checkAll = function (type,checked) {
     	 if(type===ACTIONS.CHECKALL){
     	 	$.each(this.options.datasource,function (i,iv) {
     	 		iv.check = checked;
     	 	});
     	 }
     }
     /**
      * 初始化任务队列
      * @return {[type]} [description]
      */
     ShoppingCart.prototype.taskInit = function () {
     	 taskObserve.add(this.em)
     	 .add(this.ps)
     	 .add(this.change)
     	 .add(this.check)
     	 .add(this.checkAll)
     	 .add(this.del)
     	 .add(this.render);
     }


    //cmd or amd
    if (typeof define === 'function') {
        define(function() {
            return ShoppingCart;
        });

        // commonjs
    } else if (typeof exports !== 'undefined') {
        module.exports = ShoppingCart;
    } else {
        win.ShoppingCart = ShoppingCart;
    }
})(window,jQuery);

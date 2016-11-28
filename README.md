# 购物车统一模板
> 依赖artTemplate  jquery 
##使用方法
```js
new ShoppingCart(element,config)
// element jQuery 选择器 表示 购物车 父容器
// config
 // 两个参数 tpl  表示 模板的选择器
             datasource 数据源
            
```

## 模板中提供的变量
- count 
  总计价格
- select 
  当前选择的数量
- data 
  商品数据列表

- data-event 表示要监听的事件
  - em 表示 减少一个数量
  - ps 增加一个数量
  - change 输入改变
  - check 选择
  - ck-all 表示全选 / 全不选
  - del 删除
 
 ## 实现原理
 基于artTemplate
 callbacks 事件回调函数完成
 观察者
 

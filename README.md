# bmap-helper

![Alt text](./demo.gif "百度地图开源库 demo")

主要功能有：

* setTheme 设置主题
* setMapInfo 弹框控件
* setZoomControl 地图缩放控件（含放大、缩小）
* setZoomInControl 地图放大控件
* setZoomOutControl 地图缩小控件
* setFullControl 地图全屏控件
* setCustomCover 地图自定义覆盖物
* setCustomControl 地图自定义控件

## 基本使用

### 引入

* 百度地图 api 及百度地图帮助插件。记住要使用自己的 ak 密码，获取方法请戳[这里](http://lbsyun.baidu.com/index.php?title=jspopular3.0/guide/getkey)。

```html
<script src="http://api.map.baidu.com/api?v=3.0&ak=你的ak"></script>
<script src="../build/bmap-helper.js"></script>
```

* 不要忘记引入样式，全屏功能要结合样式才能完美实现。

```html
<link rel="stylesheet" href="../build/bmap-helper.css">
```

* 这里提供了两个主题，苹果风（theme-1）、暗黑（theme-2）。可以使用[百度地图个性化模板](http://lbsyun.baidu.com/custom/list.htm)，也可以自己[编辑一个模板](http://lbsyun.baidu.com/custom/)。

```html
<script src="../build/bmap-theme.js"></script>
```

### 实例化

* 首先需要实例化百度地图应用，这里只列举了最简单的业务场景，更多demo请戳[这里](http://lbsyun.baidu.com/jsdemo.htm#a1_2)。

```html
<!-- 百度地图容器 -->
<div class="bmap-container" id="bmapContainer"></div>
<!-- 百度地图弹框 -->
<div class="bmap-info" id="bmapInfo"></div>
```

```js
var map = new BMap.Map('bmapContainer');
var point = new BMap.Point(116.404, 39.915);
map.centerAndZoom(point, 15);
```

* 然后初始化百度地图插件，并将上面地图实例化对象 map 传入。

```js
var helper = bmapHelper.initHelper({
    map: map, 
    imgPath: '../build/images/'
});
```

* 最后，你就可以通过插件的实例对象 helper 调用其上的原型方法。

* **注意：请确保你的百度地图容器的样式为`bmap-container`，弹窗容器的样式为`bmap-info`。**

### 方法

#### setTheme

```js
/**
 * 设置主题
 * @param {string} key 主题对象
 */
helper.setTheme(BMapThemes['theme-1']);
```

#### setMapInfo

```js
/**
 * 弹框控件
 * @param {BMap Marker} data.bmapMarker 绑定弹框的 marker
 * @param {HTMLElememt} data.infoEl 弹框节点，方便定制
 * @param {{x: number, y: number}} data.infoOffset 弹框偏移，默认 {x:0, y:0}
 * @param {string} data.infoHTML 弹框内容，提供了 info-content 默认样式
 * @param {boolean} data.isInfoCenter 是否定位到弹框节点的中心，当弹框溢出地图需要设置 infoOffset 来兼容，默认 false
 * @param {function} data.showCallback 显示弹框后回调函数
 * @param {any} data.showCallbackData 显示弹框后回调函数所返回的数据
 * @param {function} data.hideCallback 隐藏弹框后回调函数
 * @param {any} data.hideCallbackData 隐藏弹框后回调函数所返回的数据
 */
helper.setMapInfo({
    originEl: marker,
    infoEl: document.getElementById('bmapInfo'),
    infoHTML: '<div class="info-content">' +
        '<p>地址：北京天安门</p>' +
        '<p>经纬度：116.404, 39.915</p>' +
    '</div>',
    isInfoCenter: true
});
```

#### setZoomOutControl

```js
/**
 * 地图放大控件
 * @param {ControlAnchor} data.anchor 停靠位置，默认右上角（BMAP_ANCHOR_TOP_RIGHT）
 * @param {{x: number, y: number}} data.offset 偏移量，默认{x: 20, y: 20}
 * @param {string} data.imgPath 放大图片路径
 * @param {string} data.divHtml 控件内容
 */
helper.setZoomOutControl();
```

#### setZoomInControl

```js
/**
 * 地图缩小控件
 * @param {ControlAnchor} data.anchor 停靠位置，默认右上角（BMAP_ANCHOR_TOP_RIGHT）
 * @param {{x: number, y: number}} data.offset 偏移量，默认{x: 20, y: 51}
 * @param {string} data.imgPath 缩小图片路径
 * @param {string} data.divHtml 控件内容
 */
helper.setZoomInControl();
```

#### setFullControl

* 点击全屏后会在`body`上加一个`bmap-fullScreen`样式。
* 对于页面中仍然显示的元素请加上`full-show`样式。
* 对于页面中直接隐藏的元素请加上`full-hide`样式。
* 对于页面中需要宽度隐藏动画的元素请加上`full-hide-width`样式。
* 对于页面中需要高度隐藏动画的元素请加上`full-hide-height`样式。
* 或者你可以自己写样式覆盖。

```js
/**
 * 地图全屏控件
 * @param {ControlAnchor} data.anchor 停靠位置，默认右上角（BMAP_ANCHOR_TOP_RIGHT）
 * @param {{x: number, y: number}} data.offset 偏移量，默认{x: 20, y: 89}
 * @param {[string, string]} data.imgPath 全屏控件图片，[默认图片，点击后图片]
 * @param {[string, string]} data.divHtml 控件内容，[默认内容，点击后内容]
 * @param {boolean} data.isAutoCenter 是否自动移动中心点
 * @param {function} callback 回调函数，返回全屏状态
 */
helper.setFullControl();
```

#### setCustomCover

```js
/**
 * 地图自定义覆盖物
 * @param {BMap Point Object} point 经纬度，例：new BMap.Point(116.404, 39.915)
 * @param {{x: number, y: number}} offset 覆盖物偏移，默认左上角 {x:0, y:0}
 * @param {string} html 显示内容
 * @param {function} bindEventFun 自定义事件，返回 ComplexCustomOverlay 实例对象
 */
helper.setCustomCover({
    point: new BMap.Point(116.404, 39.915),
    offset: {x: 300, y: 300},
    html: '我是自定义覆盖物！',
    bindEventFun: function(data) {
        data.div.addEventListener('mouseover', function() {
            this.textContent = '你碰到我了，快走开！';
        }, false);
        data.div.addEventListener('mouseout', function() {
            this.textContent = data.html;
        }, false);
    }
});
```

#### setCustomControl

```js
/**
 * 地图自定义控件
 * @param anchor 停靠位置 默认：右上角(BMAP_ANCHOR_TOP_RIGHT)
 * @param {{x: number, y: number}} offset 覆盖物偏移，默认左上角 {x:20, y:20}
 * @param {string} html 默认显示内容
 * @param {function} bindEventFun 自定义事件，返回 CustomControl 实例对象
 */
helper.setCustomControl({
    anchor: BMAP_ANCHOR_BOTTOM_RIGHT,
    offset: {x: 20, y: 20},
    html: '<div class="bmap-ctrl">重置</div>',
    bindEventFun: function(data) {
        data.div.addEventListener('click', function() {
            bmap.centerAndZoom(point, 15);
        }, false);
    }
});
```

#### 其他说明

* [ControlAnchor](http://lbsyun.baidu.com/cms/jsapi/reference/jsapi_reference_3_0.html#a2b1)
* [BMap Marker](http://lbsyun.baidu.com/cms/jsapi/reference/jsapi_reference_3_0.html#a3b2)

### License

MIT License

Copyright (c) 2018 水中熊

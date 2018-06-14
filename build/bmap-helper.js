/**
 * @name 百度地图帮助插件
 * @author 水中熊
 * @see https://github.com/shuizhongxiong/bmap-helper
 * @description 百度地图扩展插件，使用方法如下
 * 1、首先需要实例化百度地图应用：
 * @example var map = new BMap.Map('mapContainer');
        var point = new BMap.Point(116.404, 39.915);
        map.centerAndZoom(point, 15);
 * 2、然后再将地图实例对象传入插件初始化方法：
 * @example var helper = bmapHelper.initHelper(map1);
 * 3、最后可以通过实例对象 helper 调用其上的原型方法。
 * @property {setTheme} 设置主题 
 * @property {setMapInfo} 弹框控件
 * @property {setZoomInControl} 地图放大控件
 * @property {setZoomOutControl} 地图缩小控件
 * @property {setFullControl} 地图全屏控件
 * @property {setCustomCover} 地图自定义覆盖物
 * @property {setCustomControl} 地图自定义控件
 */
;(function() {
    'use strict';

	// 暴露主方法
	window.bmapHelper = {};

	/**
	 * 插件初始化方法
	 * @param {BMap map object} map 
	 */
	window.bmapHelper.initHelper = function (map) {
        if (!map) {
            throw new Error('请初始化百度地图应用');
        }
        return new BmapHelper(map);
	};

	// 私有变量
	var imgPath = '../build/images/';
	// 私有方法
	function isArray(value) {
		return value && Object.prototype.toString.call(value) === '[object Array]';
	}

	/**
	 * 工厂函数
	 * @param {BMap map object} map 
	 */
    function BmapHelper(map) {
        this.map = map;
    }

    /**
     * 设置主题
     * @param {string} key 主题对象
     */
    BmapHelper.prototype.setTheme = function(styleJson) {
		if (!styleJson || !isArray(styleJson)) {
			return false;
		}
        this.map.setMapStyle({
            styleJson: styleJson
        });
    }

    /**
	 * 弹框控件
	 * @param {BMap Marker} data.bmapMarker 绑定弹框的 marker
	 * @param {HTMLElememt} data.infoEl 弹框节点，方便定制
	 * @param {{x: number, y: number}} data.infoOffset 弹框偏移，默认 {x:0, y:0}
	 * @param {string} data.infoHTML 弹框内容
	 * @param {boolean} data.isInfoCenter 是否定位到弹框节点的中心，当弹框溢出地图需要设置 infoOffset 来兼容，默认 false
	 * @param {function} data.showCallback 显示弹框后回调函数
	 * @param {any} data.showCallbackData 显示弹框后回调函数所返回的数据
	 * @param {function} data.hideCallback 隐藏弹框后回调函数
	 * @param {any} data.hideCallbackData 隐藏弹框后回调函数所返回的数据
	 */
	BmapHelper.prototype.setMapInfo = function(data) {
		data = data ? data : {};
		if (!data.bmapMarker || !data.infoEl) {
			return false;
		}
        var that = this;
		var isHoverbmapMarker = false;
		var isHoverInfoEl = false;

		data.bmapMarker.addEventListener('mouseover', (e) => {
			// 地图对象自定义属性，冻结
			if (that.map && that.map.frozen) {
				return false;
			}
			isHoverbmapMarker = true;
			data.infoEl.style.display = 'none';
			// 获取弹框节点大小
			var originDom = data.bmapMarker.V;
			var originDomWidth = originDom.style.width.replace('px', '') || 0;
			var originDomHeight = originDom.style.height.replace('px', '') || 0;
			// 地图偏移量
			var el = e.target || e.srcElement;
			var mapEl = e.target.map.Va;
			var mapLeft = mapEl.offsetLeft;
			var mapTop = mapEl.offsetTop;
			// 自定义偏移量
			var offsetX = 0;
			var offsetY = 0;
			if (data.infoOffset && Object.keys(data.infoOffset).length > 0) {
				offsetX = data.infoOffset.x ? data.infoOffset.x : 0;
				offsetY = data.infoOffset.y ? data.infoOffset.y : 0;
			}
			// 通过事件定位
			var pixel = e.pixel;
			var poLeft = pixel.x + mapLeft - e.offsetX + offsetX;
			var poTop = pixel.y + mapTop - e.offsetY + offsetY;
			if (data.isInfoCenter) {
				poLeft += originDomWidth / 2;
				poTop += originDomHeight / 2;
			}
			data.infoEl.style.left = poLeft + 'px';
			data.infoEl.style.top = poTop + 'px';

			data.infoEl.innerHTML = data.infoHTML;
			data.infoEl.style.display = 'block';
			if (data.showCallback && typeof data.showCallback === 'function') {
				data.showCallback(data.showCallbackData);
			}
		}, false);
		data.bmapMarker.addEventListener('mouseout', (e) => {
			isHoverbmapMarker = false;
			hideInfo();
		}, false);

		data.infoEl.addEventListener('mouseover', () => {
			isHoverInfoEl = true;
		}, false);
		data.infoEl.addEventListener('mouseout', () => {
			isHoverInfoEl = false;
			hideInfo();
		}, false);

		function hideInfo() {
			// 地图对象自定义属性，冻结
			if (that.map.frozen) {
				return false;
			}
			setTimeout(() => {
				if (!isHoverbmapMarker && !isHoverInfoEl) {
					data.infoEl.style.display = 'none';
					if (data.hideCallback && typeof data.hideCallback === 'function') {
						data.hideCallback(data.hideCallbackData);
					}
				}
			}, 0);
		}
	}

	/**
	 * @type ControlAnchor 此常量表示控件的定位，有以下四个方位。
	 * BMAP_ANCHOR_TOP_LEFT 控件将定位到地图的左上角
	 * BMAP_ANCHOR_TOP_RIGHT 控件将定位到地图的右上角
	 * BMAP_ANCHOR_BOTTOM_LEFT 控件将定位到地图的左下角
	 * BMAP_ANCHOR_BOTTOM_RIGHT 控件将定位到地图的右下角
	 */

	/**
	 * 地图放大控件
	 * @param {ControlAnchor} data.anchor 停靠位置，默认右上角（BMAP_ANCHOR_TOP_RIGHT）
	 * @param {{x: number, y: number}} data.offset 偏移量，默认{x: 20, y: 20}
	 * @param {string} data.imgPath 放大图片路径
	 * @param {string} data.divHtml 控件内容
	 */
	BmapHelper.prototype.setZoomInControl = function(data) {
		data = data ? data : {};
		var that = this;
		var map = that.map;
		var ZoomInControl = function() {
			// 默认停靠位置和偏移量
			this.defaultAnchor = data.anchor || BMAP_ANCHOR_TOP_RIGHT;
			if (data.offset && data.offset.x && data.offset.y) {
				this.defaultOffset = new BMap.Size(+data.offset.x, +data.offset.y);
			} else {
				this.defaultOffset = new BMap.Size(20, 20);
			}
		};

		ZoomInControl.prototype = new BMap.Control();
		ZoomInControl.prototype.initialize = function(map) {
			var zoomInDiv = document.createElement('div');
			var divHtml = '';
			if (data.divHtml && data.divHtml.toString().length > 0) {
				divHtml = data.divHtml.toString();
			} else {
				divHtml = 
					'<div class="bmap-ctrl bmap-zoomIn">' +
						'<img src=' + (data.imgPath || imgPath + 'zoomin.png') + ' title="放大"/>' +
					'</div>';
			}
			zoomInDiv.innerHTML = divHtml;
			zoomInDiv.style.cursor = 'pointer';

			zoomInDiv.onclick = function (e) {
				map.zoomIn();
			};
			map.getContainer().appendChild(zoomInDiv);
			return zoomInDiv;
		};

		var zoomInCtrl = new ZoomInControl();
		map.addControl(zoomInCtrl);
	}

	/**
	 * 地图缩小控件
	 * @param {ControlAnchor} data.anchor 停靠位置，默认右上角（BMAP_ANCHOR_TOP_RIGHT）
	 * @param {{x: number, y: number}} data.offset 偏移量，默认{x: 20, y: 51}
	 * @param {string} data.imgPath 缩小图片路径
	 * @param {string} data.divHtml 控件内容
	 */
	BmapHelper.prototype.setZoomOutControl = function(data) {
		data = data ? data : {};
		var that = this;
		var map = that.map;
		var ZoomOutControl = function() {
			// 默认停靠位置和偏移量
			this.defaultAnchor = data.anchor || BMAP_ANCHOR_TOP_RIGHT;
			if (data.offset && data.offset.x && data.offset.y) {
				this.defaultOffset = new BMap.Size(+data.offset.x, +data.offset.y);
			} else {
				this.defaultOffset = new BMap.Size(20, 51);
			}
		};

		ZoomOutControl.prototype = new BMap.Control();
		ZoomOutControl.prototype.initialize = function(map) {
			var zoomOutDiv = document.createElement('div');
			var divHtml = '';
			if (data.divHtml && data.divHtml.toString().length > 0) {
				divHtml = data.divHtml.toString();
			} else {
				divHtml = 
					'<div class="bmap-ctrl bmap-zoomOut">' +
						'<img src=' + (data.imgPath || imgPath + 'zoomout.png') + ' title="缩小"/>' +
					'</div>';
			}
			zoomOutDiv.innerHTML = divHtml;
			zoomOutDiv.style.cursor = 'pointer';

			zoomOutDiv.onclick = function (e) {
				map.zoomOut();
			};
			map.getContainer().appendChild(zoomOutDiv);
			return zoomOutDiv;
		};

		var zoomOutCtrl = new ZoomOutControl();
		map.addControl(zoomOutCtrl);
	}

	/**
	 * 地图全屏控件
	 * @param {ControlAnchor} data.anchor 停靠位置，默认右上角（BMAP_ANCHOR_TOP_RIGHT）
	 * @param {{x: number, y: number}} data.offset 偏移量，默认{x: 20, y: 89}
	 * @param {[string, string]} data.imgPath 全屏控件图片，[默认图片，点击后图片]
	 * @param {[string, string]} data.divHtml 控件内容，[默认内容，点击后内容]
	 * @param {boolean} data.isAutoCenter 是否自动移动中心点
	 * @param {function} callback 回调函数，返回全屏状态
	 */
	BmapHelper.prototype.setFullControl = function(data) {
		data = data ? data : {isAutoCenter: true};
		var that = this;
		var map = that.map;
		map.enableAutoResize();
		var FullControl = function () {
			// 默认停靠位置和偏移量
			this.defaultAnchor = data.anchor || BMAP_ANCHOR_TOP_RIGHT;
			if (data.offset && data.offset.x && data.offset.y) {
				this.defaultOffset = new BMap.Size(+data.offset.x, +data.offset.y);
			} else {
				this.defaultOffset = new BMap.Size(20, 89);
			}
		};

		FullControl.prototype = new BMap.Control();
		FullControl.prototype.initialize = function(map) {
			var that = this;
			var mapEl = map.getContainer();
			var fullDiv = document.createElement('div');
			var fullDivHtml = '';
			var unfullDivHtml = '';

			if (data.divHtml && isArray(data.divHtml) && data.divHtml.length === 2) {
				fullDivHtml = data.divHtml[0].toString();
				unfullDivHtml = data.divHtml[1].toString();
			} else {
				fullDivHtml = 
					'<div class="bmap-ctrl bmap-fullScreen">' +
						'<img src=' + (data.imgPath || imgPath + 'full.png') + ' title="全屏"/>' +
					'</div>';
				unfullDivHtml = 
					'<div class="bmap-ctrl bmap-fullScreen">' +
						'<img src=' + (data.imgPath || imgPath + 'unfull.png') + ' title="恢复"/>' +
					'</div>';
			}
			fullDiv.innerHTML = fullDivHtml;
			fullDiv.style.cursor = 'pointer';
			fullDiv.setAttribute('state', '0'); // 默认关闭全屏
			fullDiv.onclick = function(e) {
				// 为 map 对象添加一个新属性，记录初始化中心点
				if (!map.fullCenter) {
					map.fullCenter = map.getCenter();
				}

				var isToFull = (+fullDiv.getAttribute('state') === 0) ? true : false;
				map.enableAutoResize();

				// 通过添加样式，来更改地图的宽高达到全屏
				var fullCls = ' bmap-fullScreen';
				var cls = document.body.className;
				if (isToFull) {
					if (cls.indexOf(fullCls) === -1) {
						document.body.className = cls + fullCls;
					}
				} else {
					document.body.className = cls.replace(fullCls, '');
				}

				// 更改按钮
				fullDiv.innerHTML = isToFull ? unfullDivHtml : fullDivHtml;
				fullDiv.setAttribute('state', isToFull ? '1' : '0');

				// 监听百度内置的地图蒙版的尺寸变化，知道其变化完毕后再重新定位中心点
				var mapMask = mapEl.getElementsByClassName('BMap_mask')[0];
				if (data.isAutoCenter && map.fullCenter && mapMask) {
					autoCenter();
				}

				function autoCenter() {
					var firstHeight = mapMask.getBoundingClientRect().height;
					var secondHeight;
					setTimeout(() => {
						secondHeight = mapMask.getBoundingClientRect().height;
						// 如地图没有重排完，则延迟重试
						if (firstHeight !== secondHeight) {
							setTimeout(() => {
								autoCenter();
							}, 200);
						} else {
							map.panTo(map.fullCenter);
							// 回调函数
							if (data.callback && typeof data.callback === 'function') {
								data.callback(isToFull);
							}
						}
					}, 100);
				}
			};
			mapEl.appendChild(fullDiv);
			return fullDiv;
		};
		var fullCtrl = new FullControl();
		map.addControl(fullCtrl);
	}

	/**
	 * 地图自定义覆盖物
	 * @param {BMap Point Object} point 经纬度，例：new BMap.Point(116.404, 39.915)
	 * @param {{x: number, y: number}} offset 覆盖物偏移，默认左上角 {x:0, y:0}
	 * @param {string} html 显示内容
	 * @param {function} bindEventFun 自定义事件，返回 ComplexCustomOverlay 实例对象
	 */
	BmapHelper.prototype.setCustomCover = function(data) {
		data = data ? data : {};
		var that = this;

		function ComplexCustomOverlay() {
			this.point = data.point;
			this.html = data.html;
			this.offset = data.offset;
			this.bindEventFun = data.bindEventFun;
		}

		ComplexCustomOverlay.prototype = new BMap.Overlay();
		ComplexCustomOverlay.prototype.initialize = function(map) {
			this.map = map;
			this.div = document.createElement('div');
			this.div.style.position = 'absolute';
			this.div.style.zIndex = BMap.Overlay.getZIndex(this.point.lat);
			this.div.innerHTML = this.html;
			if (this.bindEventFun && typeof this.bindEventFun === 'function') {
				this.bindEventFun(this);
			}

			this.map.getPanes().labelPane.appendChild(this.div);
			return this.div;
		};
		ComplexCustomOverlay.prototype.draw = function () {
			var pixel = this.map.pointToOverlayPixel(this.point);
			var offsetX = 0;
			var offsetY = 0;
			if (this.offset) {
				offsetX = this.offset.x || 0;
				offsetY = this.offset.y || 0;
			}
			this.div.style.left = pixel.x - offsetX + 'px';
			this.div.style.top = pixel.y - offsetY + 'px';
			this.div.style.zIndex = 1;
		};
		var myCompOverlay = new ComplexCustomOverlay();
		that.map.addOverlay(myCompOverlay);
	}

	/**
	 * 地图自定义控件
	 * @param {ControlAnchor} anchor 停靠位置 默认：右上角(BMAP_ANCHOR_TOP_RIGHT)
	 * @param {{x: number, y: number}} offset 覆盖物偏移，默认左上角 {x:20, y:20}
	 * @param {string} html 默认显示内容
	 * @param {function} bindEventFun 自定义事件，返回 CustomControl 实例对象
	 */
	BmapHelper.prototype.setCustomControl = function(data) {
		data = data ? data : {};
		var that = this;

		var CustomControl = function () {
			// 默认停靠位置和偏移量
			this.defaultAnchor = data.anchor || BMAP_ANCHOR_TOP_RIGHT;
			if (data.offset && data.offset.x && data.offset.y) {
				this.defaultOffset = new BMap.Size(+data.offset.x, +data.offset.y);
			} else {
				this.defaultOffset = new BMap.Size(20, 20);
			}
		};

		CustomControl.prototype = new BMap.Control();
		CustomControl.prototype.initialize = function(map) {
			this.map = map;
			this.div = document.createElement('div');
			this.div.innerHTML = data.html;
			this.div.style.cursor = 'pointer';
			if (data.bindEventFun && typeof data.bindEventFun === 'function') {
				data.bindEventFun(this);
			}
			this.map.getContainer().appendChild(this.div);
			return this.div;
		};

		var customCtrl = new CustomControl();
		that.map.addControl(customCtrl);
	}
})();


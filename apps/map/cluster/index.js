'use strict';

//百度地图API功能
var map = new BMap.Map("map");    // 创建Map实例
var point = new BMap.Point(116.404, 39.915);
map.centerAndZoom(point, 11);  // 初始化地图,设置中心点坐标和地图级别
map.addControl(new BMap.MapTypeControl());   //添加地图类型控件
map.addControl(new BMap.NavigationControl());
map.setCurrentCity("北京");          // 设置地图显示的城市 此项是必须设置的
map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放

var markers = (function(map) {
    function Overlays(map) {
        this.overlays = [];
        this.map = map;
    }

    Overlays.prototype.clearLayers = function() {
        this.overlays.forEach(function(overlay) {
            this.map.removeOverlay(overlay)
        }.bind(this));
        this.overlays = [];
    };

    Overlays.prototype.addData = function(data) {
        data.forEach(function(feature) {
            var marker = null;
            var point = new BMap.Point(feature.geometry.coordinates[0], feature.geometry.coordinates[1]);
            if(!feature.properties.cluster) {
                marker = new BMap.Marker(point);
            }else {
                var count = feature.properties.point_count;
                var size =
                    count < 100 ? 'small' :
                    count < 1000 ? 'medium' : 'large';
                marker = new BMap.Label("<div class='marker-cluster marker-cluster-"+size+"'><div><span>"+feature.properties.point_count_abbreviated+"</span></div></div>",
                 {position : point,
                  offset   : new BMap.Size(-30, 0)}
                  );  // 创建文本标注对象
                marker.setStyle({
                    border: 'none',
                    backgroundColor: 'none',
                    fontFamily:"微软雅黑"
                 });
            }
            
            this.map.addOverlay(marker); 
            this.overlays.push(marker);  
        }.bind(this));
    };

    return new Overlays(map);

})(map);

// create a web worker
var worker = new Worker('worker.js');
var ready = false;

// callback on the calculation finished
worker.onmessage = function (e) {
    if (e.data.ready) {
        ready = true;
        update();
    } else {
        markers.clearLayers();
        markers.addData(e.data);
    }
};

// when map changed update markers cluster
function update() {
    if (!ready) return;
    var bounds = map.getBounds();
    worker.postMessage({
        bbox: [bounds.getSouthWest().lng, bounds.getSouthWest().lat, bounds.getNorthEast().lng, bounds.getNorthEast().lat],
        zoom: map.getZoom()
    });
}

// on map events
map.addEventListener('moveend', update);
map.addEventListener('zoomend', update);

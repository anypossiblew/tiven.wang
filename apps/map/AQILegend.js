function AQILegend(aqi) {
	this.thresholds = [0, 51, 101, 151, 201, 301];
	this.colors = ["White", "Green", "Yellow", "Orange", "Red", "Purple", "Maroon"];
    this.labels = [" -  无数据", "<50 优", ">50 良", ">100 轻度污染", ">150 中度污染", ">200 重度污染", ">300 严重污染"];
};

AQILegend.prototype.classify = function(aqi) {
	var color = "White";
	if(aqi === 0) {
		return color;
	}else if(aqi <= 50) {
		color = "Green";
	}else if(aqi <= 100) {
		color = "Yellow";
	}else if(aqi <= 150) {
		color = "Orange";
	}else if(aqi <= 200) {
		color = "red";
	}else if(aqi <= 300) {
		color = "Purple";
	}else if(aqi > 300) {
		color = "Maroon";
	}
	return color;
};
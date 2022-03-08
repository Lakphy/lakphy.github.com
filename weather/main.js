// 引用
import {
  airCondition,
  cityLookup,
  indices1day,
  Ip2Location,
  waterMinutely,
  weather24hours,
  weather7days,
  weatherNow,
  weatherWarning,
} from "./api.js";

function getQueryString(name) {
  let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  let r = window.location.search.substr(1).match(reg);
  if (r != null) {
    return decodeURIComponent(r[2]);
  }
  return null;
}

// 通用组件类
class Component {
  // 构造器
  constructor(id, opts) {
    this.container = document.getElementById(id); // 组件容器dom
    // this.container.innerHTML = this.render(opts.data); // 调用渲染函数
    this.data = [];
  }
  // 渲染函数
  render(data) {
    return "";
  }
}

class topbarObject extends Component {
  constructor(id, opts = { crrentLocation }) {
    super(id, opts);
    window.addEventListener("updateLocation", (event) => {
      this.getCurrentWeather(
        event.detail.locationString,
        event.detail.locationID
      );
    });
    this.crrentLocation = crrentLocation;
  }
  render() {
    if (this.data && this.data.length > 0 && this.data[0].code === "200") {
      this.container.innerHTML = `
      <div class="topbar-container">
          <div class="topbar-icon" id="plus" style="background-image: url('./iamges/plus-light.png')" onclick="addNewLocation(event)"></div>
          <div class="title">${[
            this.data[0].location[0].adm1,
            this.data[0].location[0].adm2,
            this.data[0].location[0].name,
          ]
            .filter((value, index, array) => {
              if (index === 0) return true;
              else if (array[index] === array[index - 1]) return false;
              else return true;
            })
            .reverse()
            .slice(0, 2)
            .join("-")}</div>
          <div class="topbar-icon" id="share" style="background-image: url('./iamges/share-light.png')"></div>
      </div>
      <div class="search-container">
          <div class="searchbox">
              <input type="text" class="searchbox-input" id="searchbox-input" placeholder="请输入想要查询的地址关键字" />
              <div class="searchbox-btn" id="searchbox-btn" style="background-image: url('./iamges/search-light.png')"></div>
          </div>
          <div class="gps-notice" id="gps-notice">使用定位地址</div>
          <div class="result" id="search-result"></div>
      </div>
    `;
      document.getElementById("topbar").className = "";
      document.getElementById("searchbox-input").oninput = (e) => {
        this.searchKey = e.target.value;
      };
      document.getElementById("searchbox-btn").onclick = (e) => {
        cityLookup(this.searchKey).then((res) => {
          console.log(res);
          if (res.code === "200") {
            this.searchResult = res.location;
            const itemList = (
              this.searchResult
                ? this.searchResult
                    .map((item, index) => {
                      if (index < 5)
                        return `
              <div class="item" data-locationid="${item.id}" data-lat="${
                          item.lat
                        }" data-lng="${item.lon}">${[
                          item.name,
                          item.adm2,
                          item.adm1,
                        ]
                          .filter((value, index, array) => {
                            if (index === 0) return true;
                            else if (array[index] === array[index - 1])
                              return false;
                            else return true;
                          })
                          .join("-")}</div>
              `;
                      else return "";
                    })
                    .join("")
                : ""
            ).trim();
            document.getElementById("search-result").innerHTML = itemList;
          }
        });
      };
      document.getElementById("search-result").onclick = (e) => {
        if (
          e.target.dataset.lat &&
          e.target.dataset.lng &&
          e.target.dataset.locationid
        ) {
          history.pushState(
            "",
            "",
            [
              location.origin,
              location.pathname,
              "?lat=",
              e.target.dataset.lat,
              "&lng=",
              e.target.dataset.lng,
              "&locationID=",
              e.target.dataset.locationid,
            ].join("")
          );
          this.crrentLocation.setLocation(
            e.target.dataset.lat,
            e.target.dataset.lng,
            e.target.dataset.locationid
          );
        }
      };
      document.getElementById("gps-notice").onclick = (e) => {
        history.pushState(
          "",
          "",
          [location.origin, location.pathname].join("")
        );
        this.crrentLocation.amapLocation();
      };
    }
  }
  getCurrentWeather(locationString, locationID) {
    Promise.all([cityLookup(locationID ? locationID : locationString)]).then(
      (res) => {
        this.data = res;
        this.render();
      }
    );
  }
}
class currentweatherObject1 extends Component {
  constructor(id, opts = {}) {
    super(id, opts);
    window.addEventListener("updateLocation", (event) => {
      this.getCurrentWeather(
        event.detail.locationString,
        event.detail.locationID
      );
    });
  }
  render() {
    if (
      this.data &&
      this.data.length > 1 &&
      this.data[0].code === "200" &&
      this.data[1].code === "200"
    ) {
      this.container.innerHTML = `
    <div id="current-weather-temp-container">
        <div id="current-weather-temp">${this.data[0].now.temp}</div>
        <div id="current-weather-temp-sign">℃</div>
    </div>
    <div id="current-weather-text"><i class="qi-${this.data[0].now.icon}"></i>${this.data[0].now.text}</div>
    <div id="current-weather-water">${this.data[1].summary}</div>
    <div id="current-weather-about">
        数据更新时间：${this.data[0].updateTime}<br />数据源：
        <a href="${this.data[0].fxLink}">和风天气</a>
    </div>
    `;
    }
  }
  getCurrentWeather(locationString, locationID) {
    Promise.all([
      weatherNow(locationString),
      waterMinutely(locationString),
    ]).then((res) => {
      this.data = res;
      this.render();
    });
  }
}
class currentweatherObject2 extends Component {
  constructor(id, opts = {}) {
    super(id, opts);
    window.addEventListener("updateLocation", (event) => {
      this.getCurrentWeather(
        event.detail.locationString,
        event.detail.locationID
      );
    });
  }
  render() {
    if (this.data && this.data.length > 0 && this.data[0].code === "200")
      this.container.innerHTML = `
      <div class="current-weather-more">更多天气信息</div>
      <div id="current-weather-form">
          <div class="current-weather-form-item">
              <div class="current-weather-form-item-value">${this.data[0].now.feelsLike}℃</div>
              <div class="current-weather-form-item-unit">摄氏度</div>
              <div class="current-weather-form-item-label">体感温度</div>
          </div>
          <div class="current-weather-form-item">
              <div class="current-weather-form-item-value">${this.data[0].now.windDir}</div>
              <div class="current-weather-form-item-unit">方向</div>
              <div class="current-weather-form-item-label">风向</div>
          </div>
          <div class="current-weather-form-item">
              <div class="current-weather-form-item-value">${this.data[0].now.windScale}级</div>
              <div class="current-weather-form-item-unit">级数</div>
              <div class="current-weather-form-item-label">风力等级</div>
          </div>
          <div class="current-weather-form-item">
              <div class="current-weather-form-item-value">${this.data[0].now.windSpeed}</div>
              <div class="current-weather-form-item-unit">km/h</div>
              <div class="current-weather-form-item-label">风速</div>
          </div>
          <div class="current-weather-form-item">
              <div class="current-weather-form-item-value">${this.data[0].now.humidity}%</div>
              <div class="current-weather-form-item-unit">百分比</div>
              <div class="current-weather-form-item-label">相对湿度</div>
          </div>
          <div class="current-weather-form-item">
              <div class="current-weather-form-item-value">${this.data[0].now.precip}</div>
              <div class="current-weather-form-item-unit">mm/h</div>
              <div class="current-weather-form-item-label">降水量</div>
          </div>
          <div class="current-weather-form-item">
              <div class="current-weather-form-item-value">${this.data[0].now.pressure}</div>
              <div class="current-weather-form-item-unit">hPa</div>
              <div class="current-weather-form-item-label">大气压强</div>
          </div>
          <div class="current-weather-form-item">
              <div class="current-weather-form-item-value">${this.data[0].now.vis}</div>
              <div class="current-weather-form-item-unit">km</div>
              <div class="current-weather-form-item-label">能见度</div>
          </div>
      </div>
    `;
  }
  getCurrentWeather(locationString, locationID) {
    Promise.all([weatherNow(locationString)]).then((res) => {
      this.data = res;
      this.render();
    });
  }
}
class dailyweatherObject extends Component {
  constructor(id, opts = {}) {
    super(id, opts);
    window.addEventListener("updateLocation", (event) => {
      this.getCurrentWeather(
        event.detail.locationString,
        event.detail.locationID
      );
    });
  }
  render() {
    const dateArray = ["日", "一", "二", "三", "四", "五", "六"];
    let dateList = new Array();
    dateArray.map((item, index) => {
      if (index === 0) dateList.push("今天");
      else if (index === 1) return dateList.push("明天");
      else if (index === 2) return dateList.push("后天");
      else
        return dateList.push(
          `星期${
            dateArray[
              new Date(
                new Date().setDate(new Date().getDate() + index)
              ).getDay()
            ]
          }`
        );
    });
    if (this.data && this.data.length > 0 && this.data[0].code === "200") {
      const listItem = this.data[0].daily
        .map((item, index) => {
          return `
        <div class="daily-weather-item">
            <div class="daily-weather-date">
                <i class="qi-${item.iconDay} daily-weather-icon"></i>${dateList[index]}·${item.textDay}
            </div>
            <div class="daily-weather-temp">${item.tempMax}°/${item.tempMin}°</div>
        </div>
        `;
        })
        .join("\n");
      this.container.innerHTML = `
      <div class="daily-weather-title">逐天天气预报</div>
      <div class="daily-weather-container">
      ${listItem}
      </div>
      <div id="daily-weather-more">点击查看更多</div>
      <div id="daily-weather-more-pc">滚动查看更多</div>
    `;
      document.getElementById("daily-weather-more").onclick = (e) => {
        const target = document.querySelectorAll(".daily-weather-container")[0];
        if (target.classList.value === "daily-weather-container")
          target.classList.value = "daily-weather-container more";
        else target.classList.value = "daily-weather-container";
      };
    }
  }
  getCurrentWeather(locationString, locationID) {
    Promise.all([weather7days(locationString)]).then((res) => {
      this.data = res;
      this.render();
    });
  }
}
class hourlyweatherObject extends Component {
  constructor(id, opts = {}) {
    super(id, opts);
    window.addEventListener("updateLocation", (event) => {
      this.getCurrentWeather(
        event.detail.locationString,
        event.detail.locationID
      );
    });
  }
  render() {
    if (this.data && this.data.length > 0 && this.data[0].code === "200") {
      const listItem = this.data[0].hourly
        .map((item, index) => {
          return `
          <div class="hourly-weather-item">
              <div class="hourly-weather-time">${
                item.fxTime.split("T")[1].split("+")[0]
              }</div>
              <div class="hourly-weather-temp">${item.temp}°</div>
              <div class="hourly-weather-icon">
                  <i class="qi-${item.icon} hourly-weather-icon-inner"></i>
              </div>
              <div class="hourly-weather-wind">${item.windDir}<br />${
            item.windScale
          }级</div>
          </div>
        `;
        })
        .join("\n");
      this.container.innerHTML = `
      <div class="hourly-weather-title">逐小时天气预报</div>
      <div class="hourly-weather-container">
      ${listItem}
      </div>
    `;
    }
  }
  getCurrentWeather(locationString, locationID) {
    Promise.all([weather24hours(locationString)]).then((res) => {
      this.data = res;
      this.render();
    });
  }
}
class currentLivesObject extends Component {
  constructor(id, opts = {}) {
    super(id, opts);
    window.addEventListener("updateLocation", (event) => {
      this.getCurrentWeather(
        event.detail.locationString,
        event.detail.locationID
      );
    });
  }
  render() {
    const iconList = [
      "./iamges/1_sport_light.png",
      "./iamges/2_car_light.png",
      "./iamges/3_cloth_light.png",
      "./iamges/4_fishing_light.png",
      "./iamges/5_sun_light.png",
      "./iamges/6_tour_light.png",
      "./iamges/7_allergy_light.png",
      "./iamges/8_comfortable_light.png",
      "./iamges/9_cold_light.png",
      "./iamges/10_airpollute_light.png",
      "./iamges/11_conditioner_light.png",
      "./iamges/12_glass_light.png",
      "./iamges/13_makeup_light.png",
      "./iamges/14_drying_light.png",
      "./iamges/15_traffic_light.png",
      "./iamges/16_sunprotection_light.png",
    ];
    if (this.data && this.data.length > 0 && this.data[0].code === "200") {
      const listItem = this.data[0].daily
        .map((item, index) => {
          return `
          <div class="current-lives-item">
              <div class="current-lives-item-category">${item.category}</div>
              <div class="current-lives-item-icon" style="
          background-image: url('${iconList[parseInt(item.type) - 1]}');
        "></div>
              <div class="current-lives-item-name">${item.name}</div>
          </div>
        `;
        })
        .join("\n");
      this.container.innerHTML = `
      <div class="current-lives-title">生活指数</div>
      <div class="current-lives-container">
      ${listItem}
      </div>
    `;
    }
  }
  getCurrentWeather(locationString, locationID) {
    Promise.all([indices1day(locationString)]).then((res) => {
      this.data = res;
      this.render();
    });
  }
}
// 地理位置类
class LocationObject {
  // 构造函数
  constructor() {
    this.location = {
      type: "none",
    };
  }
  start() {
    if (
      getQueryString("lat") &&
      getQueryString("lng") &&
      getQueryString("locationID")
    )
      this.setLocation(
        getQueryString("lat"),
        getQueryString("lng"),
        getQueryString("locationID")
      );
    else this.amapLocation();
  }
  handleLocateSuccess = (that) => {
    console.log(that.location);
    switch (that.location.type) {
      case "position": // 使用经纬度定位
      case "area": // 使用省市区位置
        console.log("定位成功！", that.location);
        break;
      case "none":
      default:
        console.log("定位失败");
    }
    const event = new CustomEvent("updateLocation", {
      detail: {
        locationString: this.locationString(),
        locationID: this.location.locationID,
      },
    });
    window.dispatchEvent(event);
  };
  // IP定位_ 还是有点偏差_ 弃用
  getLocationIp = () => {
    return new Promise(async (resolve) => {
      console.log("尝试进行IP定位");
      const ipdata = await Ip2Location();
      let { rectangle } = ipdata;
      rectangle = rectangle
        .split(";")
        .reduce((previousValue, currentValue) => {
          return [...previousValue, ...currentValue.split(",")];
        }, [])
        .map((item, index) => {
          return parseFloat(item);
        });
      this.location = {
        type: "position",
        latitude: (rectangle[1] + rectangle[3]) / 2,
        longitude: (rectangle[0] + rectangle[2]) / 2,
        locationID: null,
      };
      this.handleLocateSuccess(this);
      resolve();
    });
  };
  // 高德地图定位_ 也就那样_ 比IP稍微准点
  amapLocation = () => {
    const map = new AMap.Map("amap-container", {
      resizeEnable: true,
    });
    AMap.plugin("AMap.Geolocation", function () {
      let geolocation = new AMap.Geolocation({
        enableHighAccuracy: true, //是否使用高精度定位，默认:true
        timeout: 10000, //超过10秒后停止定位，默认：5s
        buttonPosition: "RB", //定位按钮的停靠位置
        buttonOffset: new AMap.Pixel(10, 20), //定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
        zoomToAccuracy: true, //定位成功后是否自动调整地图视野到定位点
      });
      map.addControl(geolocation);
      geolocation.getCurrentPosition(function (status, result) {
        if (status == "complete") {
          onComplete(result);
        } else {
          onError(result);
        }
      });
    });
    //解析定位结果
    const onComplete = (data) => {
      console.log("定位成功");
      let str = [];
      str.push("定位结果：" + data.position);
      str.push("定位类别：" + data.location_type);
      if (data.accuracy) {
        str.push("精度：" + data.accuracy + " 米");
      }
      str.push("是否经过偏移：" + (data.isConverted ? "是" : "否"));
      console.log(str.join("\n"));
      this.location = {
        type: "position",
        latitude: data.position.lat,
        longitude: data.position.lng,
        locationID: null,
      };
      this.handleLocateSuccess(this);
    };
    //解析定位错误信息
    const onError = (data) => {
      console.log("定位失败");
      console.log("失败原因排查信息:" + data.message);
      this.getLocationIp();
    };
  };
  // 位置信息格式化为字符串
  locationString = () => {
    // switch (this.location.type) {
    //   case "position": // 使用经纬度定位
    //     return [
    //       this.location.longitude.toFixed(2),
    //       this.location.latitude.toFixed(2),
    //     ]
    //       .map((item, index) => {
    //         return String(item);
    //       })
    //       .join(",");
    //     break;
    //   case "area": // 使用省市区位置
    //     return this.location.locationID;
    //     break;
    //   case "none":
    //   default:
    //     return;
    // }
    if (this.location.latitude)
      return [
        this.location.longitude.toFixed(2),
        this.location.latitude.toFixed(2),
      ]
        .map((item, index) => {
          return String(item);
        })
        .join(",");
    else return this.location.locationID;
  };
  setLocation = (lat, lng, locationID) => {
    this.location = {
      type: "position",
      latitude: parseFloat(lat),
      longitude: parseFloat(lng),
      locationID,
    };
    this.handleLocateSuccess(this);
  };
  // 浏览器定位_ 由于代理情况下浏览器定位偏差太大_ 弃用
  getLocation = () => {
    return new Promise(async (resolve) => {
      const locationDevice = async (position) => {
        console.log(position);
        if (position && position.coords) {
          this.location = {
            type: "position",
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
        }
        resolve();
      };
      const locationIp = async () => {
        console.log("尝试进行IP定位");
        const ipdata = await Ip2Location();
        let { rectangle } = ipdata;
        rectangle = rectangle
          .split(";")
          .reduce((previousValue, currentValue) => {
            return [...previousValue, ...currentValue.split(",")];
          }, [])
          .map((item, index) => {
            return parseFloat(item);
          });
        this.location = {
          type: "position",
          latitude: (rectangle[1] + rectangle[3]) / 2,
          longitude: (rectangle[0] + rectangle[2]) / 2,
        };
        console.log(rectangle);
        resolve();
      };
      console.log("尝试进行浏览器定位");
      navigator.geolocation.getCurrentPosition(locationDevice, locationIp);
    });
  };
  // 获取天气_ 这部分内容计划解耦合到各个组件_ 已解耦_ 弃用
  getWeather = async () => {
    // // 逆地址解析
    // const responseCitylookup = await cityLookup(this.locationString());
    // console.log("逆地址解析", responseCitylookup);
    // // 实时天气
    // const responseWeatherNow = await weatherNow(this.locationString());
    // console.log("实时天气", responseWeatherNow);
    // // 未来24小时逐小时天气
    // const responseWeather24hours = await weather24hours(this.locationString());
    // console.log("未来24h逐小时天气", responseWeather24hours);
    // // 未来7天逐天天气
    // const responseWeather7days = await weather7days(this.locationString());
    // console.log("未来7天逐天天气", responseWeather7days);
    // // 分钟级降水
    // const responseWaterMinutely = await waterMinutely(this.locationString());
    // console.log("分钟级降水", responseWaterMinutely);
    // // 生活指数
    // const responseIndices1day = await indices1day(this.locationString());
    // console.log("生活指数", responseIndices1day);
    // // 天气预警
    // const responseWeatherWarning = await weatherWarning(this.locationString());
    // console.log("天气预警", responseWeatherWarning);
    // // 空气质量
    // const responseAirCondition = await airCondition(this.locationString());
    // console.log("空气质量", responseAirCondition);
    // Promise
    // Promise.all([
    //   cityLookup(this.locationString()), // 逆地址解析
    //   weatherNow(this.locationString()), // 实时天气
    //   weather24hours(this.locationString()), // 未来24小时逐小时天气
    //   weather7days(this.locationString()), // 未来7天逐天天气
    //   waterMinutely(this.locationString()), // 分钟级降水
    //   indices1day(this.locationString()), // 生活指数
    //   weatherWarning(this.locationString()), // 天气预警
    //   airCondition(this.locationString()), // 空气质量
    // ]).then((res) => {
    //   console.log(res);
    // });
  };
}

const crrentLocation = new LocationObject();
const currentweather1 = new currentweatherObject1("current-weather-1", {});
const currentweather2 = new currentweatherObject2("current-weather-2", {});
const dailyweather = new dailyweatherObject("daily-weather", {});
const hourlyweather = new hourlyweatherObject("hourly-weather", {});
const currentLives = new currentLivesObject("current-lives", {});
const topbar = new topbarObject("topbar", { crrentLocation });
crrentLocation.start();

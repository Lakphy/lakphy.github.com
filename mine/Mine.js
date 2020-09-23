const row = 10; //宽
const col = 10; //长
const maxCount = 10; //最大雷数
let marked = 0; //已被标记的格子数量
let isFirstOpen = true, //定义为第一次打开
    end = false;
const count = document.getElementById('count'); //剩余雷数
const start = document.getElementById('start'); //开始键的对象
const customize = document.getElementById('customize'); //自定义游戏键对象
var time = document.getElementById('time'); //计时器显示对象
var timer;
var timecount;
var grid = init_grid(10, 10, 10); //调用函数，并返回一个二维数组，用于储存地图中每个格子的对象
var gaming = true;
start.onclick = function() {
    document.getElementById('grid').style.display = "table";
    //在这里添加计时功能
    var timer = setInterval(function() {
            let seconds = (parseFloat(time.innerHTML) + 0.1).toFixed(1); //时间保留一位小数
            time.innerHTML = seconds;
            timecount = seconds;
        }, 100) //设置计时器
}
customize.onclick = function() {
    var a = parseInt(prompt("请输入地图长度", "10"));
    var b = parseInt(prompt("请输入地图宽度", "10"));
    var c = parseInt(prompt("请输入地图雷数", "10"));
    grid = init_grid(a, b, c);
    document.getElementById('grid').style.display = "table";
    //在这里添加计时功能
    var timer = setInterval(function() {
            let seconds = (parseFloat(time.innerHTML) + 0.1).toFixed(1); //时间保留一位小数
            time.innerHTML = seconds;
            timecount = seconds;
        }, 100) //设置计时器
}

function upgradeCount() {
    count.innerText = (maxCount - marked).toString(); //更新剩余雷数量
}

function init_grid(a, b, c) {
    let row = a;
    let col = b;
    let maxCount = c;
    let gridHtml = ''; //定义扫雷界面
    for (let i = 0; i < row; i++) {
        gridHtml += '<tr>'
        for (let j = 0; j < col; j++) {
            gridHtml +=
                '<td><span class="blocks" onmousedown="block_click(' + i + ',' + j + ',event)"></span></td>'; //这里应注意每一个格子都不同，在初始化时候就已经把它的位置信息写进去了，点击格子可以触发第46行的代码，并传入位置i、j，以及一个event参数（用于记录该次点击事件的对象）
        }
        gridHtml += '<tr>'
    } //构造扫雷界面
    document.getElementById('grid').innerHTML = gridHtml; //插入扫雷界面
    upgradeCount(); //调用第16行的代码，更新剩余雷数量

    let blocks = document.getElementsByClassName('blocks'); //获取地图上每个格子对象
    let grid = []; //用于储存雷图
    for (let i = 0; i < blocks.length; i++) { //初始化雷图为一个二维数组
        if (i % col === 0) {
            grid.push([]);
        } //构造二维数组
        //初始化计雷数
        blocks[i].count = 0; //定义格子的自定义属性count为0，该count属性用于储存该格周围雷数
        grid[parseInt(i / col)].push(blocks[i]); //将地图格子对象push到对应的雷图中
    } //这循环干了什么？》》构造了一个二维数组作为雷图，并向里面储存了这个数组对应地图格子的对象
    return grid; //返回雷图（二维数组）
} //此函数完善了整体用户界面，又将图中的格子对应对象储存在二维数组中并返回

function block_click(_i, _j, e) { //点击地图上的格子会触发此函数，传入位置坐标ij和一个event对象用于储存点击对象
    if (grid[_i][_j].isOpen) { //检验所点击格子对象的自定义属性isopen，如果没点过这格，那就没定义过isopen属性，那就是undefined，相当于false，反之，是true，将会触发下一行代码直接返回这个函数
        return;
    }
    //下面的代码会检验点击事件对象e的属性button。对于点击事件的属性button，为只读属性，返回点击的鼠标按钮，左键0，中间建为1，右键为2（对于配置为左手反转的设备，对应返回值会反转）
    if (e.button === 0) { //当点击左键时
        if (isFirstOpen) { //当该地图为第一次打开时，第一次点开才定义一遍地雷（埋地雷）（怕你点第一下就挂了）
            isFirstOpen = false; //定义该地图不是第一次打开
            let count = 0; //重新定义局部变量count为0，在该作用域结束后会变回原来在第七行定义的全局变量count
            while (count < maxCount) { //当count小于最大雷数时（这里与自定义雷数有关）while循环用于将所有雷定义一编
                let ri = Math.floor(Math.random() * row); //取随机横坐标ri
                let rj = Math.floor(Math.random() * col); //取随机纵坐标rj
                if (!(ri === _i && rj === _j) && !grid[ri][rj].isMine) { //当随机坐标与所点格子坐标不相等时，且所取随机坐标不是地雷时
                    grid[ri][rj].isMine = true; //定义所取随机坐标为雷
                    count++; //表明定义了一个雷，已定义雷+1
                    for (let i = ri - 1; i < ri + 2; i++) {
                        for (let j = rj - 1; j < rj + 2; j++) {
                            if (i > -1 && j > -1 && i < row && j < col) {
                                grid[i][j].count++;
                            }
                        }
                    } //遍历一遍周围格子，告诉周围格子它周围多了一个格子
                }
            } //循环定义雷结束
        } //对于第一次点击的程序结束

        block_open(_i, _j); //运行下面那一堆代码
        //下面是开雷代码，该函数会被多次调用（递归）
        function block_open(_i, _j) { //原来这里才是真正的左键点击代码（雾
            let block = grid[_i][_j]; //定义block变量为所点击格子对象
            op(block); //运行下面那一堆代码并传入上面刚定义的变量

            function op(block) {
                block.isOpen = true; //标记该格子已被点击
                block.style.background = '#ccc'; //改变该格子背景颜色
                block.style.cursor = 'default'; //设置当鼠标悬停该格时显示鼠标样式为默认样式（不会出现小手）
            }

            if (block.isMine) { //当点的这个是雷时
                //在这里补全踩雷的代码*
                alert("啊欧，您踩到了地雷。。。。您已失败！点击确定重试");
                location.reload(); //重启游戏
            } else if (block.count === 0) { //当它周围没雷时
                for (let i = _i - 1; i < _i + 2; i++) {
                    for (let j = _j - 1; j < _j + 2; j++) {
                        if (i > -1 && j > -1 && i < row && j < col && !grid[i][j].isOpen && !grid[i][j].ismine) {
                            block_open(i, j); //递归
                        }
                    }
                } //当它周围没有雷时，通过递归把周围地图都拆开，直到周围一圈都是周围有雷的格子为止（算法菜鸡，就不深入分析了）
            } else { //当它既不是雷，周围也没雷时
                block.innerHTML = block.count; //将格子内写好它周围的雷数
            }

        } //结束左键分析
    } else if (e.button === 2) { //右键分析
        let block = grid[_i][_j]; //定义block变量为所点击格子对象
        if (block.innerHTML !== '▲') { //如果该格没被标记过
            if (marked < maxCount) { //如果已标记数小于最大雷数
                block.innerHTML = '▲'; //标记雷
                marked++; //增加已标记数
            }
        } else { //如果被标记过
            block.innerHTML = ''; //取消标记
            marked--; //减少已标记数
        }
        upgradeCount(); //更新剩余雷数
    } //结束右键分析

    for (let i = 0; i < row; i++) {
        for (let j = 0; j < col; j++) {
            if (!grid[i][j].isMine && !grid[i][j].isOpen) { //判断所遍历格子为：不是雷，且没打开
                return;
            }
        }
    } //遍历一遍，如果存在不是雷且没点过的格子，直接返回
    clearInterval(timer); //结束计时
    alert("游戏胜利!用时" + timecount + "秒。点击确定重新开始游戏"); //经过上面的遍历发现所有格子都点过或者是雷，提示游戏胜利
    location.reload(); //重启游戏
}
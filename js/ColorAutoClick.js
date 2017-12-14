function getTime(num) {
    var oDate = new Date(); //实例一个时间对象；
    oDate.getFullYear(); //获取系统的年；
    oDate.getMonth() + 1; //获取系统月份，由于月份是从0开始计算，所以要加1
    oDate.getDate(); // 获取系统日，
    oDate.getHours(); //获取系统时，
    oDate.getMinutes(); //分
    oDate.getSeconds(); //秒
    var times=oDate.getHours()+":"+oDate.getMinutes()+":"+oDate.getSeconds();
    console.log("本次自动"+ num +"的时间是" + times);
   
}

//自动双击“调色板”左边第一个格子，适合点出天赋“自动排序”后用，因为最高级的在最左边
function tsb1() {
    $("#desk-grid .grid-cell:first-child .text").trigger("dblclick");
    getTime("点击右边格子")
}
//自动升级“时间”
function times() {
    $("#upgrade-time button").trigger("click");
    getTime("升级时间技能")
}
//自动双击“几率”
function chances() {
    $("#upgrade-chance button").trigger("click");
    getTime("升级几率技能")
}
//自动双击“金钱”
function moneys() {
    $("#upgrade-money button").trigger("click");
    getTime("升级金钱技能")
}

////自动双击“调色板”左边第一个格子
//var tsbcell = setInterval("tsb1();", 1000);
////定时自动点“时间”技能
//var time = setInterval("times();", 6000);
////定时自动点“几率”技能
//var chance = setInterval("chances();", 7000);
////定时自动点“金钱”技能
//var money = setInterval("moneys();", 8000);


////停止自动点击“调色板”左边第一个格子
//clearInterval(tsbcell);
////停止自动升级“时间”技能
//clearInterval(times);
////停止自动升级“几率”技能
//clearInterval(chances);
////停止自动升级“金钱”技能
//clearInterval(moneys);

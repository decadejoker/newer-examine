function Mine(tr, td, mineNum) {
    this.tr = tr;  //行数
    this.td = td;  //列数
    this.mineNum = mineNum; //雷的数量
    this.square = [];  //记下格子的信息
    this.tds = [];  //存储格子的MOD
    this.surplusMine = mineNum; //剩余雷的数量
    this.allRight = false; //右击红旗是否全是雷
    this.parent = document.getElementsByClassName('minebody')[0];
}


//生成表格
Mine.prototype.createDom = function(){
    var This = this;
    var table = document.createElement('table');
    for(var i = 0; i < this.tr; i ++){
        var domTr = document.createElement('tr');
        this.tds[i] = [];
        for(var j = 0; j < this.td; j ++){
            var domTd = document.createElement('td');
            this.tds[i][j] = domTd;
            domTd.pos = [i,j];
            domTd.onmousedown = function(e){
                var event = e || window.event;
                This.play(event,this);
            }
            domTr.appendChild(domTd);
            // if(this.square[i][j].type == 'mine'){
            //     domTd.className = 'mine';
            // }else{
            //     domTd.innerHTML = this.square[i][j].value;
            // }
        }
        table.appendChild(domTr);
    }
    this.parent.innerHTML = '';
    this.parent.appendChild(table);
}
//生成不重复的数
Mine.prototype.randomNum = function(){
    var square = Array(this.tr * this.td);
    for(var i = 0; i < square.length; i ++){
        square[i] = i;
    }
    square.sort(function(){return Math.random() - 0.5})
    return square.slice(0,this.mineNum);
}

Mine.prototype.init = function(){
    var rn = this.randomNum();
    var n = 0;
    for(var i = 0; i < this.tr; i ++){
       this.square[i] = [];
       for(var j = 0; j < this.td; j ++){
           n ++;
           if(rn.indexOf(n) != -1){
               this.square[i][j] = {type:'mine',x:j,y:i};
           }else{
               this.square[i][j] = {type:'number',x:j,y:i,value:0};
           }
       }
    }
    this.updateNum();
    this.createDom();
    this.parent.oncontextmenu = function(){
        return false;
    }
    this.mineNumDom = document.getElementsByTagName('span')[0];
    this.mineNumDom.innerHTML = this.surplusMine;
}
//寻找雷周围的格子
Mine.prototype.findArround = function(square){
    var x = square.x;
    var y = square.y;
    var result = [];
    for(var i = x-1; i <= x+1; i ++){
        for(var j = y-1; j <= y+1; j ++){
            if(
                i < 0 ||
                j < 0 ||
                i > this.tr-1 ||
                j > this.td-1 ||
                (i == x && j == y) ||
                this.square[j][i].type == 'mine'
            ){
                continue;
            }
            result.push([j,i]);
        }
    }
    return result;
}
//给雷周围的格子添加数字
Mine.prototype.updateNum = function(){
    for(var i = 0; i < this.tr; i ++){
        for(var j = 0; j < this.td; j ++){
            if(this.square[i][j].type == 'number'){
                continue;
            }
            var num = this.findArround(this.square[i][j]);
            for(var k = 0; k < num.length; k ++){
                this.square[num[k][0]][num[k][1]].value += 1;
            }
        }
    }
}
//点击事件
Mine.prototype.play = function(ev,obj){
    var This = this;
    if(ev.which == 1 && obj.className != 'flag'){
        var cursquare = this.square[obj.pos[0]][obj.pos[1]];
        var cl = ['zero','one','two','three','four','five','six','seven','eigth'];
        if(cursquare.type == 'number'){
            obj.innerHTML = cursquare.value;
            obj.className = cl[cursquare.value];
            if(cursquare.value == 0){
                obj.innerHTML = '';
                function getAllZero(square){
                    var arround = This.findArround(square);
                    for(var i = 0; i < arround.length; i ++){
                        var x = arround[i][0];
                        var y = arround[i][1];
                        if(This.square[x][y].value == 0){
                            This.tds[x][y].innerHTML == '';
                        }else{
                            This.tds[x][y].innerHTML = This.square[x][y].value;
                        }
                        This.tds[x][y].className = cl[This.square[x][y].value];
                        if(This.square[x][y].value == 0){
                            if(!This.tds[x][y].check){
                                This.tds[x][y].check = true;
                                getAllZero(This.square[x][y]);
                            }
                        }
                    }
                }
                getAllZero(cursquare);
            }
        }else{
            this.gameOver(obj);
        }
    }else if(ev.which == 3){
        if(obj.className && obj.className != 'flag'){
            return;
        }
        obj.className = (obj.className == 'flag') ? '':'flag';
        if(this.square[obj.pos[0]][obj.pos[1]].type == 'mine'){
            this.allRight = true;
        }else{
            this.allRight = false;
        }
        if(obj.className == 'flag'){
            this.mineNumDom.innerHTML = --this.surplusMine;
        }else if(obj.className != 'flag'){
            this.mineNumDom.innerHTML = ++this.surplusMine;
        }
        if(this.surplusMine == 0){
            if(this.allRight == false){
                alert('游戏失败');
            }else{
                alert('恭喜你，游戏通关');
            }
            for(var i = 0; i < this.tr; i ++){
                for(var j = 0; j < this.td; j ++){
                    this.tds[i][j].onmousedown = '';
                }
            }
        }

    }
}
//游戏结束
Mine.prototype.gameOver = function(clickTd){
    for(var i = 0; i < this.tr; i ++){
        for(var j = 0; j < this.td; j ++){
            if(this.square[i][j].type == 'mine'){
                this.tds[i][j].className = 'mine';
            }
            this.tds[i][j].onmousedown = null;
        }
    }
    if(clickTd){

        clickTd.style.borderColor = '#f00';
    }
}
//完成按钮功能
var btns = document.querySelectorAll('.head button');
var mine = null;
var ln = 0;
var arr = [[9,9,10],[16,16,40],[28,28,99]];
for(var i = 0; i < btns.length-1; i ++){
    (function(j){
        btns[j].onclick = function(){
            btns[ln].className = '';
            this.className = 'check';
            mine = new Mine(arr[j][0],arr[j][1],arr[j][2]);
            mine.init();
            ln = j;
        }
    }(i))
}
//初始化和重新开始功能
var mine =new Mine(...arr[0]);
mine.init();
btns[3].onclick = function(){
    mine.init();
}
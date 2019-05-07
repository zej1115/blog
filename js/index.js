window.addEventListener('DOMContentLoaded',function () {

  //获取元素
  var header = document.getElementById('header');
  var navUps = document.querySelectorAll('#header .headerMain .nav .navList .navItem .up');
  var navItems = document.querySelectorAll('#header .headerMain .nav .navList .navItem');
  var arrow = document.querySelector('#header .headerMain .arrow');
  var content = document.getElementById('content');
  var conItems = document.querySelectorAll('#content .conList .conItem');
  var conList = document.querySelector('#content .conList');
  var homeNavLis = document.querySelectorAll('#content .conList .home .homeNav>li');
  var homeItems = document.querySelectorAll('#content .conList .home .homeList .homeItem');
  var team3Items = document.querySelectorAll('#content .conList .team .team3 .team3Item');
  var team3List = document.querySelector('#content .conList .team .team3 .team3List');
  var menuNavs =  document.querySelectorAll('#menuNav>li');
  var myMusic = document.querySelector('#header .headerMain .music');
  var myAudio = document.querySelector('#header .headerMain .music>audio');
  var line = document.querySelector('#mask .line');
  var maskUp = document.querySelector('#mask .maskUp');
  var maskDown = document.querySelector('#mask .maskDown');
  var myMask = document.getElementById('mask')
  var index = 0;
  var time1;
  var time2;
  var myCanvas;
  var oldIndex = 0;
  var isAnimation = false;
  var timeId;
  var autoTimeId;

  //初始化第一个导航li高亮
  navUps[0].style.width = '100%';
  //初始化三角位置
  arrow.style.left = navItems[0].getBoundingClientRect().left + navItems[0].offsetWidth/2 +'px';

  //头部逻辑
  headerBind()
  function headerBind() {
    //给所有的导航li加监听
    for (var i=0; i<navItems.length; i++ ){
      //拿到每一项
      var item = navItems[i]
      //缓存计数器
      item.index = i
      //加点击事件
      item.onclick = function () {
        animationArr[this.index].inAnimation()
        animationArr[index].outAnimation()
        index = this.index
        contentMove(this.index)
      }
    }
  }

  //内容区移动逻辑(包含着三角的移动、高亮的逻辑)
  function contentMove(index) {
    //1.清除所有高亮
    for (var j=0; j<navUps.length; j++ ){
      navUps[j].style.width = ''
    }
    //2.给当前点击的那个加高亮
    navUps[index].style.width = '100%';
    //3.重置所有小圆点
    for (var j=0; j<menuNavs.length; j++ ){
      menuNavs[j].className = '';
    }
    //4.当前加高亮
    menuNavs[index].className = 'active';
    //5.移动三角到当前位置
    arrow.style.left = navItems[index].getBoundingClientRect().left + navItems[index].offsetWidth/2 +'px';
    //6.移动内容区
    conList.style.top = -(index)*(document.documentElement.clientHeight - header.offsetHeight) + 'px'
  }

  //给主体设置高度的逻辑
  contentBind()
  function contentBind() {
    //给内容区设置高度
    content.style.height = document.documentElement.clientHeight - header.offsetHeight + 'px';
    //给每一屏设置高度
    for (var i=0; i<conItems.length; i++ ){
      conItems[i].style.height = document.documentElement.clientHeight - header.offsetHeight + 'px';
    }
  }

  //鼠标滚轮
  scroll()
  function scroll() {
    //ie/chrome
    document.onmousewheel = function (event) {
      clearTimeout(timeId)
      timeId = setTimeout(function () {
        scrollMove(event)
      },150)
    }
    //firefox
    if(document.addEventListener){
      document.addEventListener('DOMMouseScroll',function (event) {
        clearTimeout(timeId)
        timeId = setTimeout(function () {
          scrollMove(event)
        },150)
      });
    }
    function scrollMove(event) {
      event = event || window.event;
      var flag = '';
      if(event.wheelDelta){
        //ie/chrome
        if(event.wheelDelta > 0){
          //上
          flag = 'up';
        }else {
          //下
          flag = 'down'
        }
      }
      else if(event.detail){
        //firefox
        if(event.detail < 0){
          //上
          flag = 'up';
        }else {
          //下
          flag = 'down'
        }
      }
      switch (flag){
        case 'up':
          //滚轮向上
          if(index>0){
            animationArr[index].outAnimation()
            index--
            animationArr[index].inAnimation()
            contentMove(index)
          }
          break;
        case 'down':
          //滚轮向下
          if(index<navItems.length-1){
            animationArr[index].outAnimation()
            index++
            animationArr[index].inAnimation()
            contentMove(index)
          }
          console.log('下')
          break;
      }
      //取消默认行为
      event.preventDefault && event.preventDefault();
      return false;
    }
  }

  //响应缩放
  window.onresize = function () {
    contentMove(index)
    contentBind()
  }

  //给每一个轮播图小圆点加点击事件
  home3D()
  function home3D() {
    for (var i=0; i<homeNavLis.length; i++ ){
      var item = homeNavLis[i];
      item.index = i
      item.onclick = function () {
        if(isAnimation){
          return
        }
        isAnimation = true;
        setTimeout(function () {
          isAnimation = false
        },3000)
        clearInterval(autoTimeId)
        //1.所有的li去除高亮
        for (var j=0; j<homeNavLis.length; j++ ){
          homeNavLis[j].className = '';
        }
        //2.给当前加高亮
        this.className = 'active';
        //3.轮播图的切换
        //判断用户点击的是前还是后
        if(oldIndex<this.index){
          //用户点击了下一张或后面的某一张
          homeItems[oldIndex].className = 'homeItem leftHide';
          homeItems[this.index].className = 'homeItem rightShow';
        }
        else if (oldIndex>this.index){
          //用户点击了上一张或前面的某一张
          homeItems[oldIndex].className = 'homeItem rightHide';
          homeItems[this.index].className = 'homeItem leftShow';
        }
        oldIndex = this.index
        autoPlay()
      }
    }
  }

  //自动轮播
  //autoPlay()
  function autoPlay() {
    autoTimeId = setInterval(function () {
      isAnimation = true;
      setTimeout(function () {
        isAnimation = false
      },3000)
      //1.所有的li去除高亮
      for (var j=0; j<homeNavLis.length; j++ ){
        homeNavLis[j].className = '';
      }
      //2.下一屏的li高亮
      homeNavLis[oldIndex+1>homeNavLis.length-1?0:oldIndex+1].className = 'active';
      //3.切换到下一屏
      //用户点击了下一张或后面的某一张
      homeItems[oldIndex].className = 'homeItem leftHide';
      homeItems[oldIndex+1>homeNavLis.length-1?0:oldIndex+1].className = 'homeItem rightShow';

      if(oldIndex<homeNavLis.length-1){
        oldIndex++
      }else{
        oldIndex = 0;
      }
    },4000)
  }

  //第五逻辑
  team3()
  function team3() {
    //给每个老师所在的父容器加鼠标移除事件
    team3List.onmouseleave = function () {
      //1.所有老师半透明
      for (var j=0; j<team3Items.length; j++ ){
        team3Items[j].style.opacity = 0.7
      }
      //2.移除canvas节点
      myCanvas.remove()
      myCanvas = null
      //3.停掉画圆的两个定时器
      clearInterval(time1)
      clearInterval(time2)
    }

    //给每个老师所在的容器加鼠标移入事件
    for (var i=0; i<team3Items.length; i++ ){
      var item = team3Items[i];
      item.index = i;
      item.onmouseenter = function () {
        //1.所有老师半透明
        for (var j=0; j<team3Items.length; j++ ){
          team3Items[j].style.opacity = 0.7
        }
        //2.当前高亮
        this.style.opacity = 1;
        //3.动态创建一个canvas
        if(!myCanvas){
          //全局没有canvas
          myCanvas = document.createElement('canvas');
          myCanvas.width = this.offsetWidth;
          myCanvas.height = this.offsetHeight;
          addAnimation()
          team3List.appendChild(myCanvas)
        }
        myCanvas.style.left = this.offsetLeft + 'px';
      }
    }
  }

  //给canvas节点加气泡效果
  function addAnimation() {
    var painting = myCanvas.getContext('2d');
    var arr = [];

    //每隔一段时间从“容器”中取出所有圆，绘制在页面上
    time1 = setInterval(function () {
      console.log(arr)
      painting.clearRect(0,0,myCanvas.width,myCanvas.height)
      //加工圆
      for (var j=0; j<arr.length; j++ ){
        var item2 = arr[j];
        item2.deg++;
        item2.y = item2.startY - (item2.deg*Math.PI/180)*item2.path ;
        item2.x = item2.startX + Math.sin(item2.deg*Math.PI/180)*item2.path * 0.5;
        if(item2.y + item2.r<0){
          arr.splice(j,1)
        }
      }

      //真正开始绘制圆
      for (var i=0; i<arr.length; i++ ){
        var item = arr[i];
        painting.beginPath();
        painting.arc(item.x,item.y,item.r,0,2*Math.PI)
        painting.fillStyle = 'rgba('+item.red+','+item.green+','+item.blue+','+item.a+')'
        painting.fill()
      }
    },16)

    //制造圆的工厂
    time2 = setInterval(function () {
      console.log(arr)
      var obj = {};
      //圆的基本信息
      obj.r = Math.random()*8 + 2;
      obj.x = Math.floor(Math.random()*myCanvas.width);
      obj.y = myCanvas.height + obj.r;
      obj.red = Math.floor(Math.random()*255);
      obj.green = Math.floor(Math.random()*255);
      obj.blue = Math.floor(Math.random()*255);
      obj.a = 1;

      //圆做曲线运动需要的信息
      obj.startX = obj.x;
      obj.startY = obj.y;
      obj.deg = 0;
      obj.path = Math.random()*80 + 20;
      arr.push(obj);
    },20)
  }

  //侧边栏导航
  menuNav()
  function menuNav() {
    for (var i=0; i<menuNavs.length; i++ ){
      var item = menuNavs[i];
      item.index = i
      item.onclick = function () {
        animationArr[this.index].inAnimation()
        animationArr[index].outAnimation()
        index = this.index
        contentMove(this.index)
      }
    }
  }

  //音乐控制
  myMusic.onclick = function () {
    if(myAudio.paused){
      //当前音乐没有播放
      myAudio.play();
      myMusic.style.backgroundImage = 'url("./img/musicon.gif")';
    }else{
      //音乐正在播放
      myAudio.pause();
      myMusic.style.backgroundImage = 'url("./img/musicoff.gif")';
    }
  }

  //出入场动画逻辑
  var animationArr = [
    {
      outAnimation:function () {
        var homeList = document.querySelector('#content .conList .home .homeList');
        var homeNav = document.querySelector('#content .conList .home .homeNav');
        homeList.style.transform = 'translate(0,-200px)';
        homeNav.style.transform = 'translate(0,200px)';
      },
      inAnimation:function () {
        var homeList = document.querySelector('#content .conList .home .homeList');
        var homeNav = document.querySelector('#content .conList .home .homeNav');
        homeList.style.transform = 'translate(0,0)';
        homeNav.style.transform = 'translate(0,0)';
      }
    },
    {
      outAnimation:function () {
        var plane1 = document.querySelector('#content .conList .course .plane1');
        var plane2 = document.querySelector('#content .conList .course .plane2');
        var plane3 = document.querySelector('#content .conList .course .plane3');

        plane1.style.transform = 'translate(-200px,-200px)';
        plane2.style.transform = 'translate(-200px,200px)';
        plane3.style.transform = 'translate(200px,-200px)';
      },
      inAnimation:function () {
        var plane1 = document.querySelector('#content .conList .course .plane1');
        var plane2 = document.querySelector('#content .conList .course .plane2');
        var plane3 = document.querySelector('#content .conList .course .plane3');

        plane1.style.transform = 'translate(0,0)';
        plane2.style.transform = 'translate(0,0)';
        plane3.style.transform = 'translate(0,0)';
      }
    },
    {
      outAnimation:function () {
        var pencel1 = document.querySelector('#content .conList .works .pencel1');
        var pencel2 = document.querySelector('#content .conList .works .pencel2');
        var pencel3 = document.querySelector('#content .conList .works .pencel3');

        pencel1.style.transform = 'translate(0,-200px)';
        pencel2.style.transform = 'translate(0,200px)';
        pencel3.style.transform = 'translate(200px,200px)';
      },
      inAnimation:function () {
        var pencel1 = document.querySelector('#content .conList .works .pencel1');
        var pencel2 = document.querySelector('#content .conList .works .pencel2');
        var pencel3 = document.querySelector('#content .conList .works .pencel3');

        pencel1.style.transform = 'translate(0,0)';
        pencel2.style.transform = 'translate(0,0)';
        pencel3.style.transform = 'translate(0,0)';
      }
    },
    {
      outAnimation:function () {
        var about1 = document.querySelector('#content .conList .about .about3 .about3Item:nth-child(1)');
        var about2 = document.querySelector('#content .conList .about .about3 .about3Item:nth-child(2)');

        about1.style.transform = 'rotate(30deg)';
        about2.style.transform = 'rotate(-30deg)';
      },
      inAnimation:function () {
        var about1 = document.querySelector('#content .conList .about .about3 .about3Item:nth-child(1)');
        var about2 = document.querySelector('#content .conList .about .about3 .about3Item:nth-child(2)');

        about1.style.transform = 'rotate(0deg)';
        about2.style.transform = 'rotate(0deg)';
      }
    },
    {
      outAnimation:function () {
        var team1 = document.querySelector('#content .conList .team .team1');
        var team2 = document.querySelector('#content .conList .team .team2');
        team1.style.transform = 'translate(-200px,0)';
        team2.style.transform = 'translate(200px,0)';
      },
      inAnimation:function () {
        var team1 = document.querySelector('#content .conList .team .team1');
        var team2 = document.querySelector('#content .conList .team .team2');
        team1.style.transform = 'translate(0,0)';
        team2.style.transform = 'translate(0,0)';
      }
    }
  ]

  //所有屏都处于出场状态
  for (var i=0; i<animationArr.length; i++ ){
    animationArr[i].outAnimation()
  }

  open()
  function open() {
    var imgArr = ['bg1.jpg','bg2.jpg','bg3.jpg','bg4.jpg','bg5.jpg','about1.jpg','about2.jpg','about3.jpg','about4.jpg','worksimg1.jpg','worksimg2.jpg','worksimg3.jpg','worksimg4.jpg','team.png','greenLine.png'];
    var loaded = 0;
    for (var j=0; j<imgArr.length; j++ ){
      var myImg = new Image();
      myImg.src = './img/'+imgArr[j];
      myImg.onload = function () {
        loaded++;
        line.style.width = (loaded/imgArr.length)*100 +'%';
      }
    }

    line.addEventListener('transitionend',function () {
      maskUp.style.height = '0';
      maskDown.style.height = '0';
      line.remove();
      animationArr[0].inAnimation();
      autoPlay()
    })
    maskUp.addEventListener('transitionend',function () {
      myMask.remove()
    })

  }
})
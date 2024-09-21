// 头部滚动
(function(){
    let $header = document.querySelector('.mod-head');
    document.querySelector('.scroll-container').addEventListener('scroll',function(){
        let scrollTop = this.scrollTop;
        let ratio = Math.min(scrollTop/1000,1);
        $header.style.background = 'rgba(255,255,255,'+(ratio*0.8)+')';
        $header.style.boxShadow = '1px 1px 6px rgba(0,0,0,'+(ratio*0.1)+')';
    });
})();

// 特征选项卡
(function(){
    let $mod_feature = document.querySelector('.mod-feature');
    let $nav = $mod_feature.querySelectorAll('.nav li');
    let $panels = $mod_feature.querySelectorAll('.panels .panel');
    let togglePanel = function(index = 0){
        $nav.forEach(function($li){
            $li.classList.remove('active');
        });
        $nav[index].classList.add('active');
        $panels.forEach(function($panel){
            $panel.classList.remove('active');
        });
        $panels[index].classList.add('active');
    };
    $nav.forEach(function($item,index){
        $item.addEventListener('click',function(){
            togglePanel(index);
        });
    });
    togglePanel(0);
})();

// 底部滚动
(function(){
    let $gotop = document.querySelector('.mod-fixedbar .gotop');
    let $container = document.querySelector('.scroll-container');
    $gotop.addEventListener('click',function(){
        $container.scrollTo({
            left:0,
            top:0,
            behavior:'smooth'
        });
    });
})();

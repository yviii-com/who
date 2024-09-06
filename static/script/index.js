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

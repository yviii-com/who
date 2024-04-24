// 头部滚动
(function(){
    let $header = document.querySelector('.header');
    document.addEventListener('scroll',function(){
        let scrollTop = document.documentElement.scrollTop;
        let ratio = Math.min(scrollTop/1000,1);
        $header.style.background = 'rgba(255,255,255,'+(ratio*0.8)+')';
        $header.style.boxShadow = '1px 1px 6px rgba(0,0,0,'+(ratio*0.1)+')';
    });
})();

// 底部滚动
(function(){
    let timer = null;
    let $gotop = document.querySelector('.mod-fixedbar .gotop');
    $gotop.addEventListener('click',function(){
        cancelAnimationFrame(timer);
        let scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
        let move = scrollTop/18;
        timer = requestAnimationFrame(function fn(){
            var oTop = document.body.scrollTop || document.documentElement.scrollTop;
            if(oTop > 0){
                document.body.scrollTop = document.documentElement.scrollTop = oTop - move;
                timer = requestAnimationFrame(fn);
            }else{
                cancelAnimationFrame(timer);
            }
        });
    });
})();

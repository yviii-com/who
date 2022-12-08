// 数据快速搜索
export function quickSearch(map){
    var _ = this;
    var _cacheKey = {};
    var _cacheValue = {};
    var groupLength = ~~Math.sqrt(Object.entries(map).length);
    // 索引分组
    var getGroupIndex = function(key){
        var arr = key.replace(/,/g,'').split('').map(value=>value.codePointAt(0));
        if(arr.length>1){
            return arr.reduce((a,b)=>(a+b))%groupLength;
        }
        return 0;
    };
    // 建立缓存表
    for(var key in map){
        var keyIndex = getGroupIndex(key);
        if(typeof _cacheKey[keyIndex]=='undefined'){
            _cacheKey[keyIndex] = {};
        }
        _cacheKey[keyIndex][key] = map[key];
        map[key].forEach(function(name){
            var valueIndex = getGroupIndex(name);
            if(typeof _cacheValue[valueIndex]=='undefined'){
                _cacheValue[valueIndex] = {};
            }
            if(typeof _cacheValue[valueIndex][name]=='undefined'){
                _cacheValue[valueIndex][name] = [];
            }
            _cacheValue[valueIndex][name].push(key);
        });
    }
    // 查询方法
    _.getNameByKey = function(key){
        var keyIndex = getGroupIndex(key);
        return _cacheKey[keyIndex][key]||[];
    };
    _.getKeyByName = function(name){
        var valueIndex = getGroupIndex(name);
        return _cacheValue[valueIndex][name]||[];
    };
};

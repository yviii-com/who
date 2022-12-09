/*
 * 缓存数据
*/
import {modeData as _data} from './mode';

var _cache = {};
for(var key in _data){
    _data[key].forEach(function(name){
        if(typeof _cache[name]=='undefined'){
            _cache[name] = [];
        }
        _cache[name].push(key);
    });
}

export default _cache;

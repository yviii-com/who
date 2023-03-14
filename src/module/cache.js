/*
 * 缓存数据
*/
import inputData from './data/input';
import {modeData} from './mode';

let _data = Object.assign({},modeData,inputData);

let _cache = {};
for(let key in _data){
    _data[key].forEach(function(name){
        if(typeof _cache[name]=='undefined'){
            _cache[name] = [];
        }
        _cache[name].push(key);
    });
}

export default _cache;

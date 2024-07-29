/*
 * 缓存数据
*/
import _input from './data/input.js';
import _sort from './data/sort.js';
import {modeData} from './mode.js';

let _hash = Object.assign({},modeData);
for(let key in _input){
    _hash[key] = (_hash[key]||[]).concat(_input[key]);
}
for(let key in _sort){
    _hash[key] = (_hash[key]||[]).concat(_sort[key]);
}

let cacheData = {};
for(let key in _hash){
    _hash[key].forEach(function(name){
        if(typeof cacheData[name]=='undefined'){
            cacheData[name] = [];
        }
        cacheData[name].push(key);
    });
}

export {cacheData};

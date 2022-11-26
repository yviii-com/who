/*
 * 模式数据
*/
import _map from './map';

var _cache = {};                        // 模式缓存
var _data = Object.assign({},_map);     // 最终数据

// 设置模式数据
export function setModeData(sign,data){
    _cache[sign] = Object.assign(_cache[sign]||{},data);
};

// 获取模式数据
export function getModeData(sign){
    _data = Object.assign({},_map);
    if(sign&&_cache[sign]){
        for(var key in _cache[sign]){
            _data[key] = [].concat(_cache[sign][key],_map[key]||[]);
        }
    }
    return _data;
};

// 获取数据
export {_data as modeData};

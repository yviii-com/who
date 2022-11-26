/*
 * 通过表达式获取配置
*/
import _expression from './rule/expression';

export function getOptions(text){
    for(var item of _expression){
        var match = text.match(item['exp']);
        if(match){
            return item['opt'](match);
        }
    }
    return {};
};

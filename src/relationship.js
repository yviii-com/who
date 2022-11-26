import {getOptions} from './module/options';
import {getSelectors,mergeSelector,selector2id} from './module/selector';
import {reverseId,getItemsById,getChainById,getPairsById} from './module/id';
import {setModeData,getModeData,modeData as _data} from './module/mode';

// 对外方法
var relationship = function (parameter){
    if(typeof parameter =='string'){
        parameter = getOptions(parameter);
    }
    var options = Object.assign({
        text:'',            // 目标对象：目标对象的称谓汉字表达，称谓间用‘的’字分隔
        target:'',          // 相对对象：相对对象的称谓汉字表达，称谓间用‘的’字分隔，空表示自己
        sex:-1,             // 本人性别：0表示女性,1表示男性
        type:'default',     // 转换类型：'default'计算称谓,'chain'计算关系链,'pair'计算关系合称
        reverse:false,      // 称呼方式：true对方称呼我,false我称呼对方
        mode:'default',     // 模式选择：使用setMode方法定制不同地区模式，在此选择自定义模式
        optimal:false       // 最短关系：计算两者之间的最短关系
    },parameter);
    _data = getModeData(options.mode);
    var from_selectors = getSelectors(options.text);
    var to_selectors = getSelectors(options.target);
    if(!to_selectors.length){
        to_selectors = [''];
    }
    var result = [];                            //匹配结果
    // console.log('[selectors]',from_selectors,to_selectors);
    from_selectors.forEach(function(from_selector){
        to_selectors.forEach(function(to_selector){
             mergeSelector({
                from:from_selector,
                to:to_selector,
                sex:options.sex,
                optimal:options.optimal
            }).forEach(function(data){
                // console.log('[data]',from_selector,to_selector,data);
                var ids = data?selector2id(data['selector'],data['sex']):[];
                // console.log('[ids]',data['selector'],data['sex'],ids);
                ids.forEach(function(id){
                    var temps = [id];
                    var sex = data['sex'];
                    if(options.reverse){
                        temps = reverseId(id,sex);
                        if(id.match(/([fhs1](&[ol\d]+)?|[olx]b)$/)){
                            sex = 1;
                        }else{
                            sex = 0;
                        }
                    }
                    if(options.type=='chain'){
                        temps.forEach(function(id){
                            var item = getChainById(id,data['sex']);
                            if(item){
                                result.push(item);
                            }
                        });
                    }else if(options.type=='pair'){
                        temps = reverseId(id,data['sex']);
                        temps.forEach(function(r_id){
                            var pairs = getPairsById(id,r_id);
                            result = result.concat(pairs);
                        });
                    }else{
                        temps.forEach(function(id){
                            var items = getItemsById(id);
                            if(!items.length){
                                items = getItemsById(sex+','+id);
                            }
                            result = result.concat(items);
                        });
                    }
                });
            });
        });
    });
    return [...new Set(result)];
};

// 获取数据表
relationship.data = _data;
// 获取数据量
relationship.dataCount = Object.keys(_data).length;
// 设置语言模式
relationship.setMode = setModeData;

export default relationship;

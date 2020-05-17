const path = require('path');//引入path模块
const setting = require('./src/config/setting');
function resolve(dir){
    return path.join(__dirname,dir)//path.join(__dirname)设置绝对路径
}
module.exports={
    devServer: {
        open: true
    },
    configureWebpack: {
        name: setting.websiteName,
    },
    chainWebpack:(config)=>{
        config.resolve.alias
            .set('@',resolve('./src'))
            .set('components',resolve('./src/components'))
            .set('assets',resolve('./src/assets'))
            .set('common',resolve('./src/common'))
            .set('views',resolve('./src/views'))
            .set('store',resolve('./src/store'))
        //set第一个参数：设置的别名，第二个参数：设置的路径

    }
}
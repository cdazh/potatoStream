'use strict'
const Transform = require('stream').Transform;
const binary = require('binary');
const crypto = require('crypto');
var URL = require('url');

class ObfsRequest extends Transform {
    constructor() {
        super();
        this._isFirst = true;
    }
    _transform(buf, enc, next) {
        var buffer;
        if (this._isFirst) {
            var fakeUrl = 'https://help.aliyun.com/product/27782.html?spm=5176.750001.3.27.FGLCI2';
            var url = URL.parse(fakeUrl);
            var referer = url.href;
            var host = url.host;
            var fakeHead = `GET ${fakeUrl} HTTP/1.1
            Accept: */*
            Referer: ${referer}
            Accept-Language: zh-Hans-CN,zh-Hans;q=0.8,ja;q=0.6,en-US;q=0.4,en;q=0.2
            User-Agent: {浏览器UA字符串}
            X-Requested-With: XMLHttpRequest
            Accept-Encoding: gzip, deflate
            Host: ${host}
            Connection: Keep-Alive
            Cookie:{aa=333;bb=222;cc=1111}
            
            `

        }
        var encode_buff = encipherGCM(buf, password);
        var buff_len = new Buffer(4);
        buff_len.writeUInt32BE(encode_buff.length);
        var encode_buff_head = Buffer.concat([buff_len, encode_buff]);
        //var md5 = crypto.createHash('md5');
        //var md5_code = md5.update(buf).digest('hex');
        //console.log(this.i++, 'buf', buf.length, 'encode_buff_head', encode_buff_head.length, 'md5', md5_code);
        next(null, encode_buff_head);
    }
}

var fakeHead = {
    Request: function () {
        var fakeUrl = 'http://help.aliyun.com/product/27782.html?spm=5176.750001.3.27.FGLCI2';
        var url = URL.parse(fakeUrl);
        var referer = url.href;
        var host = url.host;
        var ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Safari/537.36 Edge/15.15063';
        var cookie = 'WxSS_a648_saltkey=GkKu2UYs; WxSS_a648_lastvisit=1508307606; WxSS_a648_lastact=1508311206%09member.php%09logging; Hm_lvt_0288789e156eb1e042ef76d3cf65391f=1508311206; Hm_lpvt_0288789e156eb1e042ef76d3cf65391f=1508311206'
        var fakeHead = `GET ${fakeUrl} HTTP/1.1
        Accept: */*
        Referer: ${referer}
        Accept-Language: zh-Hans-CN,zh-Hans;q=0.8,ja;q=0.6,en-US;q=0.4,en;q=0.2
        User-Agent: ${ua}
        X-Requested-With: XMLHttpRequest
        Accept-Encoding: gzip, deflate
        Host: ${host}
        Connection: Keep-Alive
        Cookie: ${cookie}
        
        `;
        return fakeHead;
    }

}
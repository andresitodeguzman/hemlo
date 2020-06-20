/**
 * 
MIT License

Copyright (c) 2018 Roman Vereschagin

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
 */
"use strict";var regexStringsAddComments=/(?:"(?:\\[\s\S]|[^"])*"|'(?:\\[\s\S]|[^'])*')|(\/\*([\s\S]*?)\*\/)/gi,regexCodeBlock=/{[^{}"']*}/gi,regexComments=/\0c\d+\0/g,regexImport=/@import .*?;/gi,regexCharset=/@charset .*?;/gi;function parseRules(e,r){for(var t=[],n=e.split(";").map(function(e){return e.trim()}).filter(function(e){return e}),s=0;s<n.length;s++){var i=n[s];if(0<=i.indexOf(":")){var o=i.split(":"),c=o[0].trim(),a=r(o.slice(1).join(":").replace(/\n/g," ")).trim();c&&a&&t.push({key:c,value:a})}else t.push({key:"",value:r(i),defective:!0})}return t}function regexEach(e,r,t){for(var n=void 0,s=new RegExp(e);null!==(n=s.exec(r));)t(n)}function parseNode(e,r,t,n,s){for(var i=void 0;null!==(i=t.exec(r));)n.push({selector:"@"+e,type:e,styles:s(i[0])});return r.replace(t,"")}function parsecss(e){var c=[],r=function(e){return"\0"+("{"===e[0]?"b":"/"===e[0]?"c":"")+(c.push(e)-1)+"\0"},t=function(e){return e.replace(/\0.?\d+\0/gi,function(e){return"b"===(e=e.slice(1,-1))[0]||"c"===e[0]?c[+e.substr(1)]:c[+e]})},a=function(e){for(var r=-1;0<=(r=e.indexOf("\0",r));)e=t(e);return e};for(e=e.replace(/\r\n/g,"\n").replace(regexStringsAddComments,r).split("\n").map(function(e){return e.trim()}).filter(function(e){return e}).join("\n");0<=e.search(regexCodeBlock);)e=e.replace(regexCodeBlock,r);var u=function(e){var o=[];return regexEach(/([\s\S]*?)\0b(\d+)\0/gi,e=parseNode("imports",e=parseNode("charset",e,regexCharset,o,t),regexImport,o,t),function(e){e[0];var r=e[1],t=e[2],n=regexComments.exec(r),s={selector:r=r.replace(regexComments,"").trim()};o.push(s),null!==n&&(s.comments=a(n[0])),regexEach(/@([a-z_\-][a-z\d_\-]*)/g,r,function(e){s.type=e[1]});var i=c[+t].slice(1,-1).replace(regexComments,"");s.type&&0<=["media","supports","keyframes","page"].indexOf(s.type)?s.children=u(i):s.rules=parseRules(i,a)}),o};return u(e)} export const parseCSS = parsecss;
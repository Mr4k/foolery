parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"ck+1":[function(require,module,exports) {
var n=1e-5;function r(n,r,t){return{x:n,y:r,z:t}}function t(n,r){return{x:n.x-r.x,y:n.y-r.y,z:n.z-r.z}}function e(n,r){return{x:n.x+r.x,y:n.y+r.y,z:n.z+r.z}}function a(n,r){return{x:n.x*r,y:n.y*r,z:n.z*r}}function i(n,r){return n.x*r.x+n.y*r.y+n.z*r.z}function o(n,r){return{x:n.y*r.z-n.z*r.y,y:n.z*r.x-n.x*r.z,z:n.x*r.y-n.y*r.x}}function s(n){return Math.sqrt(i(n,n))}function v(n){var r=Math.sqrt(i(n,n));return{x:n.x/r,y:n.y/r,z:n.z/r}}function u(n,r,e){var a=v(o(t(n,e),t(r,e)));return{v1:n,v2:r,v3:e,normal:a,edges:[{anchor:r,testPoint:e,v:v(t(n,r)),len:s(t(n,r)),n:v(o(t(n,r),a))},{anchor:e,testPoint:n,v:v(t(r,e)),len:s(t(r,e)),n:v(o(t(r,e),a))},{anchor:n,testPoint:r,v:v(t(e,n)),len:s(t(e,n)),n:v(o(t(e,n),a))}]}}function l(r,e,a){var o=i(a.normal,e);if(!(Math.abs(o)<n))return i(t(a.v1,r),a.normal)/o}function c(n,r){var e=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0,a=!0,o=!1,s=void 0;try{for(var v,u=r.edges[Symbol.iterator]();!(a=(v=u.next()).done);a=!0){var l=v.value,c=i(t(l.testPoint,l.anchor),l.n),f=i(t(n,l.anchor),l.n);if(Math.sign(f)!==Math.sign(c)&&Math.abs(c-f)>=e)return!1}}catch(d){o=!0,s=d}finally{try{a||null==u.return||u.return()}finally{if(o)throw s}}return!0}function f(n,r,o,s){var v=s.v1,u=s.normal,f=Math.sign(i(t(n,v),u)),d=t(n,a(u,o*f)),h=l(d,r,s);if(h)return c(e(a(r,h),d),s)?h:void 0}function d(n,r,e,a){var o=t(n,a.anchor),s=a.v,v=i(o,o),u=i(o,r),l=i(o,s),c=i(r,s),f=2*(u-l*c),d=i(r,r)-c*c,h=f*f-4*d*(v-l*l-e*e);if(!(h<0)){var y=Math.sqrt(h);return{s1:(-f-y)/(2*d),s2:(-f+y)/(2*d)}}}function h(n,r,o,s){var v=d(n,r,o,s);if(void 0===v)return{};var u=v.s1,l=v.s2,c=t(n,s.anchor),f=e(a(r,u),c),h=e(a(r,l),c),y=i(f,s.v),x=i(h,s.v),z={s1:{t:u,n:t(f,a(s.v,y))},s2:{t:l,n:t(h,a(s.v,x))}};return(y<0||y>s.len)&&(z.s1=void 0),(x<0||x>s.len)&&(z.s2=void 0),z}function y(n,r,e,a){var o=t(a.anchor,n),s=i(r,r),v=-2*i(r,o),u=v*v-4*s*(i(o,o)-e*e);if(!(u<0)){var l=Math.sqrt(u);return{s1:(-v-l)/(2*s),s2:(-v+l)/(2*s)}}}function x(n,r,i,o){var s,u=f(n,r,i,o),l=1e8;void 0!==u&&u>0&&(l=u,s=o.normal);var c=!0,d=!1,x=void 0;try{for(var z,g=o.edges[Symbol.iterator]();!(c=(z=g.next()).done);c=!0){var m=z.value,M=h(n,r,i,m);void 0!==M.s1&&M.s1.t>=0&&M.s1.t<l&&(l=M.s1.t,s=v(M.s1.n)),void 0!==M.s2&&M.s2.t>=0&&M.s2.t<l&&(l=M.s2.t,s=v(M.s2.n));var P=y(n,r,i,m);if(void 0!==P&&P.s1>=0&&P.s1<l){var T=e(a(r,P.s1),n);l=P.s1,s=v(t(T,m.anchor))}if(void 0!==P&&P.s2>=0&&P.s2<l){var p=e(a(r,P.s2),n);l=P.s2,s=v(t(p,m.anchor))}}}catch(q){d=!0,x=q}finally{try{c||null==g.return||g.return()}finally{if(d)throw x}}if(s)return{t:l,n:s}}function z(n,r){var e=t(n,r.anchor),o=i(e,r.v);o=Math.min(Math.max(0,o),r.len);var s=t(e,a(r.v,o));return{dist:i(s,s),dir:v(s)}}function g(n,r){var o=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0,s=t(n,r.v1),u=t(s,a(r.normal,i(s,r.normal))),l=t(s,u);if(c(e(u,r.v1),r,o))return{dist:i(l,l),dir:v(l)}}function m(n,r){var t=g(n,r),e=r.edges.reduce(function(r,t){var e=z(n,t);return!r||e.dist<r.dist?e:r},null);return t&&(!e||t.dist<e.dist)?t:e}module.exports={add:e,sub:t,scale:a,dot:i,cross:o,vector:r,normalize:v,triangle:u,rayIntersectsPlane:l,coplanarPointInTriangle:c,sphereHitsTrianglePlane:f,sphereHitsLine:d,sphereHitsEdge:h,sphereHitsPoint:y,sphereHitsTriangle:x,squaredDistToTriangle:m,squaredDistToEdge:z,squaredDistToTrianglePlane:g};
},{}],"0UoL":[function(require,module,exports) {
var r=require("./geometry/triangle"),t=1e-4;function a(t,a,e,i){var n=r.scale(t,e-a);return r.add(n,r.scale(i,-r.dot(n,i)))}function e(i,n,o,l){var v=arguments.length>4&&void 0!==arguments[4]?arguments[4]:1,d=arguments.length>5&&void 0!==arguments[5]?arguments[5]:3,c=arguments.length>6&&void 0!==arguments[6]?arguments[6]:.5,s=arguments.length>7&&void 0!==arguments[7]?arguments[7]:{x:0,y:0,z:0},u=arguments.length>8&&void 0!==arguments[8]?arguments[8]:{x:0,y:0,z:0};if(0===d)return{newOrigin:i,totalNormalForce:s,totalFrictionForce:u};var g,m=1e10,h=!0,f=!1,y=void 0;try{for(var D,x=l[Symbol.iterator]();!(h=(D=x.next()).done);h=!0){var F=D.value,M=r.sphereHitsTriangle(i,o,n,F);M&&M.t>=0&&M.t<m&&(g=M.n,m=M.t)}}catch(p){f=!0,y=p}finally{try{h||null==x.return||x.return()}finally{if(f)throw y}}m=Math.min(Math.max(m-t,0),v);var z=r.add(i,r.scale(o,m));if(!g)return{newOrigin:z,totalNormalForce:s,totalFrictionForce:u};var q=a(o,m,v,g),w=Math.abs(r.dot(g,o))*(1-m),S=r.add(s,r.scale(g,w)),T=Math.sqrt(r.dot(q,q)),b=Math.max(T-w*c,0)/(0===T?1:T);return e(z,n,r.scale(q,b),l,v,d-1,c,S,r.add(u,r.scale(q,-(1-b))))}function i(t,a){var e=arguments.length>2&&void 0!==arguments[2]?arguments[2]:100,i=a.reduce(function(a,i){var n=a.grav,o=a.minDist,l=r.squaredDistToTriangle(t,i);if(!l)return{grav:n,minDist:o};var v=l.dist,d=l.dir;return v>e*e||!v?{grav:n,minDist:o}:v>o?{grav:n,minDist:o}:{grav:n=d,minDist:v}},{grav:r.vector(0,0,0),minDist:1e6}),n=i.grav;i._minDist;return 0===n.x&&0===n.y&&0===n.z?n:r.scale(r.normalize(n),-1)}module.exports={calculateSlide:a,moveAndSlide:e,geom:r,calculateGravityDirection:i};
},{"./geometry/triangle":"ck+1"}],"Q8ss":[function(require,module,exports) {
function e(e){return(Math.sin(e)+1)/2}function r(e,r){var t=new e.SphereGeometry(r,10,10);vertsToNeighborsMap=[];for(var o=0;o<t.vertices.length;o+=1){vertsToNeighborsMap.push({});var s=1.2*Math.random()+.4;s*=s*s,t.vertices[o].set(t.vertices[o].x*s,t.vertices[o].y*s,t.vertices[o].z*s)}var a=!0,i=!1,v=void 0;try{for(var n,c=t.faces[Symbol.iterator]();!(a=(n=c.next()).done);a=!0){var l=n.value;vertsToNeighborsMap[l.a][l.b]=!0,vertsToNeighborsMap[l.a][l.c]=!0,vertsToNeighborsMap[l.b][l.a]=!0,vertsToNeighborsMap[l.b][l.c]=!0,vertsToNeighborsMap[l.c][l.a]=!0,vertsToNeighborsMap[l.c][l.b]=!0}}catch(u){i=!0,v=u}finally{try{a||null==c.return||c.return()}finally{if(i)throw v}}console.log("vtN",vertsToNeighborsMap);for(var h=0;h<3;h++)for(var g=0;g<t.vertices.length;g+=1){var b=Object.keys(vertsToNeighborsMap[g]),p=b.reduce(function(e,r){return e+t.vertices[r].length()},0)/(0===b.length?1:b.length);console.log(p),t.vertices[g]=t.vertices[g].normalize().multiplyScalar(p)}return t.verticesNeedUpdate=!0,t.computeVertexNormals(),t}module.exports={generateAsteroid:r};
},{}],"Kaz0":[function(require,module,exports) {
function e(e,n){var o=geom.cross(n,e);if(Math.abs(geom.dot(o,o))>1e-4)return{axis:geom.normalize(o),angle:Math.acos(geom.dot(n,e))}}var n={LEFT:0,FORWARD:1,DOWN:2};function o(o){var r=[{x:1,y:0,z:0},{x:0,y:-1,z:0},{x:0,y:0,z:1}];return{getOrientation:function(e){return r[e]},update:function(t){var a=e(r[n.DOWN],t);if(a){var i=a.axis,c=a.angle;r.forEach(function(e,n){var t=new o.Vector3(e.x,e.y,e.z);t.applyAxisAngle(i,-c),r[n]={x:t.x,y:t.y,z:t.z}})}}}}module.exports={createOrientationController:o,ORIENTATION_DIRECTIONS:n};
},{}],"Focm":[function(require,module,exports) {
var e=require("./physics.js"),r=require("./geometry/triangle.js"),o=require("./game/asteroid.js"),i=require("./controllers/OrientationController");module.exports={phys:e,geom:r,asteroid:o,orientationController:i};
},{"./physics.js":"0UoL","./geometry/triangle.js":"ck+1","./game/asteroid.js":"Q8ss","./controllers/OrientationController":"Kaz0"}]},{},["Focm"], "game")
//# sourceMappingURL=/index.js.map
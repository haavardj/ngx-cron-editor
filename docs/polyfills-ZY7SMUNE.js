var ce=globalThis;function ee(e){return(ce.__Zone_symbol_prefix||"__zone_symbol__")+e;}function dt(){let e=ce.performance;function r(N){e&&e.mark&&e.mark(N);}function c(N,_){e&&e.measure&&e.measure(N,_);}r("Zone");let t=(()=>{class N{static{this.__symbol__=ee;}static assertZonePatched(){if(ce.Promise!==O.ZoneAwarePromise)throw new Error("Zone.js has detected that ZoneAwarePromise `(window|global).Promise` has been overwritten.\nMost likely cause is that a Promise polyfill has been loaded after Zone.js (Polyfilling Promise api is not necessary when zone.js is loaded. If you must load one, do so before loading zone.js.)");}static get root(){let n=N.current;for(;n.parent;)n=n.parent;return n;}static get current(){return b.zone;}static get currentTask(){return D;}static __load_patch(n,o,p=!1){if(O.hasOwnProperty(n)){let P=ce[ee("forceDuplicateZoneCheck")]===!0;if(!p&&P)throw Error("Already loaded patch: "+n);}else if(!ce["__Zone_disable_"+n]){let P="Zone:"+n;r(P),O[n]=o(ce,N,R),c(P,P);}}get parent(){return this._parent;}get name(){return this._name;}constructor(n,o){this._parent=n,this._name=o?o.name||"unnamed":"<root>",this._properties=o&&o.properties||{},this._zoneDelegate=new u(this,this._parent&&this._parent._zoneDelegate,o);}get(n){let o=this.getZoneWith(n);if(o)return o._properties[n];}getZoneWith(n){let o=this;for(;o;){if(o._properties.hasOwnProperty(n))return o;o=o._parent;}return null;}fork(n){if(!n)throw new Error("ZoneSpec required!");return this._zoneDelegate.fork(this,n);}wrap(n,o){if(typeof n!="function")throw new Error("Expecting function got: "+n);let p=this._zoneDelegate.intercept(this,n,o),P=this;return function(){return P.runGuarded(p,this,arguments,o);};}run(n,o,p,P){b={parent:b,zone:this};try{return this._zoneDelegate.invoke(this,n,o,p,P);}finally{b=b.parent;}}runGuarded(n,o=null,p,P){b={parent:b,zone:this};try{try{return this._zoneDelegate.invoke(this,n,o,p,P);}catch(q){if(this._zoneDelegate.handleError(this,q))throw q;}}finally{b=b.parent;}}runTask(n,o,p){if(n.zone!=this)throw new Error("A task can only be run in the zone of creation! (Creation: "+(n.zone||K).name+"; Execution: "+this.name+")");let P=n,{type:q,data:{isPeriodic:A=!1,isRefreshable:_e=!1}={}}=n;if(n.state===X&&(q===U||q===g))return;let ae=n.state!=j;ae&&P._transitionTo(j,h);let le=D;D=P,b={parent:b,zone:this};try{q==g&&n.data&&!A&&!_e&&(n.cancelFn=void 0);try{return this._zoneDelegate.invokeTask(this,P,o,p);}catch(ne){if(this._zoneDelegate.handleError(this,ne))throw ne;}}finally{let ne=n.state;if(ne!==X&&ne!==Y)if(q==U||A||_e&&ne===k)ae&&P._transitionTo(h,j,k);else{let f=P._zoneDelegates;this._updateTaskCount(P,-1),ae&&P._transitionTo(X,j,X),_e&&(P._zoneDelegates=f);}b=b.parent,D=le;}}scheduleTask(n){if(n.zone&&n.zone!==this){let p=this;for(;p;){if(p===n.zone)throw Error(`can not reschedule task to ${this.name} which is descendants of the original zone ${n.zone.name}`);p=p.parent;}}n._transitionTo(k,X);let o=[];n._zoneDelegates=o,n._zone=this;try{n=this._zoneDelegate.scheduleTask(this,n);}catch(p){throw n._transitionTo(Y,k,X),this._zoneDelegate.handleError(this,p),p;}return n._zoneDelegates===o&&this._updateTaskCount(n,1),n.state==k&&n._transitionTo(h,k),n;}scheduleMicroTask(n,o,p,P){return this.scheduleTask(new E(V,n,o,p,P,void 0));}scheduleMacroTask(n,o,p,P,q){return this.scheduleTask(new E(g,n,o,p,P,q));}scheduleEventTask(n,o,p,P,q){return this.scheduleTask(new E(U,n,o,p,P,q));}cancelTask(n){if(n.zone!=this)throw new Error("A task can only be cancelled in the zone of creation! (Creation: "+(n.zone||K).name+"; Execution: "+this.name+")");if(!(n.state!==h&&n.state!==j)){n._transitionTo(G,h,j);try{this._zoneDelegate.cancelTask(this,n);}catch(o){throw n._transitionTo(Y,G),this._zoneDelegate.handleError(this,o),o;}return this._updateTaskCount(n,-1),n._transitionTo(X,G),n.runCount=-1,n;}}_updateTaskCount(n,o){let p=n._zoneDelegates;o==-1&&(n._zoneDelegates=null);for(let P=0;P<p.length;P++)p[P]._updateTaskCount(n.type,o);}}return N;})(),i={name:"",onHasTask:(N,_,n,o)=>N.hasTask(n,o),onScheduleTask:(N,_,n,o)=>N.scheduleTask(n,o),onInvokeTask:(N,_,n,o,p,P)=>N.invokeTask(n,o,p,P),onCancelTask:(N,_,n,o)=>N.cancelTask(n,o)};class u{get zone(){return this._zone;}constructor(_,n,o){this._taskCounts={microTask:0,macroTask:0,eventTask:0},this._zone=_,this._parentDelegate=n,this._forkZS=o&&(o&&o.onFork?o:n._forkZS),this._forkDlgt=o&&(o.onFork?n:n._forkDlgt),this._forkCurrZone=o&&(o.onFork?this._zone:n._forkCurrZone),this._interceptZS=o&&(o.onIntercept?o:n._interceptZS),this._interceptDlgt=o&&(o.onIntercept?n:n._interceptDlgt),this._interceptCurrZone=o&&(o.onIntercept?this._zone:n._interceptCurrZone),this._invokeZS=o&&(o.onInvoke?o:n._invokeZS),this._invokeDlgt=o&&(o.onInvoke?n:n._invokeDlgt),this._invokeCurrZone=o&&(o.onInvoke?this._zone:n._invokeCurrZone),this._handleErrorZS=o&&(o.onHandleError?o:n._handleErrorZS),this._handleErrorDlgt=o&&(o.onHandleError?n:n._handleErrorDlgt),this._handleErrorCurrZone=o&&(o.onHandleError?this._zone:n._handleErrorCurrZone),this._scheduleTaskZS=o&&(o.onScheduleTask?o:n._scheduleTaskZS),this._scheduleTaskDlgt=o&&(o.onScheduleTask?n:n._scheduleTaskDlgt),this._scheduleTaskCurrZone=o&&(o.onScheduleTask?this._zone:n._scheduleTaskCurrZone),this._invokeTaskZS=o&&(o.onInvokeTask?o:n._invokeTaskZS),this._invokeTaskDlgt=o&&(o.onInvokeTask?n:n._invokeTaskDlgt),this._invokeTaskCurrZone=o&&(o.onInvokeTask?this._zone:n._invokeTaskCurrZone),this._cancelTaskZS=o&&(o.onCancelTask?o:n._cancelTaskZS),this._cancelTaskDlgt=o&&(o.onCancelTask?n:n._cancelTaskDlgt),this._cancelTaskCurrZone=o&&(o.onCancelTask?this._zone:n._cancelTaskCurrZone),this._hasTaskZS=null,this._hasTaskDlgt=null,this._hasTaskDlgtOwner=null,this._hasTaskCurrZone=null;let p=o&&o.onHasTask,P=n&&n._hasTaskZS;(p||P)&&(this._hasTaskZS=p?o:i,this._hasTaskDlgt=n,this._hasTaskDlgtOwner=this,this._hasTaskCurrZone=this._zone,o.onScheduleTask||(this._scheduleTaskZS=i,this._scheduleTaskDlgt=n,this._scheduleTaskCurrZone=this._zone),o.onInvokeTask||(this._invokeTaskZS=i,this._invokeTaskDlgt=n,this._invokeTaskCurrZone=this._zone),o.onCancelTask||(this._cancelTaskZS=i,this._cancelTaskDlgt=n,this._cancelTaskCurrZone=this._zone));}fork(_,n){return this._forkZS?this._forkZS.onFork(this._forkDlgt,this.zone,_,n):new t(_,n);}intercept(_,n,o){return this._interceptZS?this._interceptZS.onIntercept(this._interceptDlgt,this._interceptCurrZone,_,n,o):n;}invoke(_,n,o,p,P){return this._invokeZS?this._invokeZS.onInvoke(this._invokeDlgt,this._invokeCurrZone,_,n,o,p,P):n.apply(o,p);}handleError(_,n){return this._handleErrorZS?this._handleErrorZS.onHandleError(this._handleErrorDlgt,this._handleErrorCurrZone,_,n):!0;}scheduleTask(_,n){let o=n;if(this._scheduleTaskZS)this._hasTaskZS&&o._zoneDelegates.push(this._hasTaskDlgtOwner),o=this._scheduleTaskZS.onScheduleTask(this._scheduleTaskDlgt,this._scheduleTaskCurrZone,_,n),o||(o=n);else if(n.scheduleFn)n.scheduleFn(n);else if(n.type==V)z(n);else throw new Error("Task is missing scheduleFn.");return o;}invokeTask(_,n,o,p){return this._invokeTaskZS?this._invokeTaskZS.onInvokeTask(this._invokeTaskDlgt,this._invokeTaskCurrZone,_,n,o,p):n.callback.apply(o,p);}cancelTask(_,n){let o;if(this._cancelTaskZS)o=this._cancelTaskZS.onCancelTask(this._cancelTaskDlgt,this._cancelTaskCurrZone,_,n);else{if(!n.cancelFn)throw Error("Task is not cancelable");o=n.cancelFn(n);}return o;}hasTask(_,n){try{this._hasTaskZS&&this._hasTaskZS.onHasTask(this._hasTaskDlgt,this._hasTaskCurrZone,_,n);}catch(o){this.handleError(_,o);}}_updateTaskCount(_,n){let o=this._taskCounts,p=o[_],P=o[_]=p+n;if(P<0)throw new Error("More tasks executed then were scheduled.");if(p==0||P==0){let q={microTask:o.microTask>0,macroTask:o.macroTask>0,eventTask:o.eventTask>0,change:_};this.hasTask(this._zone,q);}}}class E{constructor(_,n,o,p,P,q){if(this._zone=null,this.runCount=0,this._zoneDelegates=null,this._state="notScheduled",this.type=_,this.source=n,this.data=p,this.scheduleFn=P,this.cancelFn=q,!o)throw new Error("callback is not defined");this.callback=o;let A=this;_===U&&p&&p.useG?this.invoke=E.invokeTask:this.invoke=function(){return E.invokeTask.call(ce,A,this,arguments);};}static invokeTask(_,n,o){_||(_=this),Q++;try{return _.runCount++,_.zone.runTask(_,n,o);}finally{Q==1&&J(),Q--;}}get zone(){return this._zone;}get state(){return this._state;}cancelScheduleRequest(){this._transitionTo(X,k);}_transitionTo(_,n,o){if(this._state===n||this._state===o)this._state=_,_==X&&(this._zoneDelegates=null);else throw new Error(`${this.type} '${this.source}': can not transition to '${_}', expecting state '${n}'${o?" or '"+o+"'":""}, was '${this._state}'.`);}toString(){return this.data&&typeof this.data.handleId<"u"?this.data.handleId.toString():Object.prototype.toString.call(this);}toJSON(){return{type:this.type,state:this.state,source:this.source,zone:this.zone.name,runCount:this.runCount};}}let T=ee("setTimeout"),y=ee("Promise"),S=ee("then"),d=[],w=!1,Z;function x(N){if(Z||ce[y]&&(Z=ce[y].resolve(0)),Z){let _=Z[S];_||(_=Z.then),_.call(Z,N);}else ce[T](N,0);}function z(N){Q===0&&d.length===0&&x(J),N&&d.push(N);}function J(){if(!w){for(w=!0;d.length;){let N=d;d=[];for(let _=0;_<N.length;_++){let n=N[_];try{n.zone.runTask(n,null,null);}catch(o){R.onUnhandledError(o);}}}R.microtaskDrainDone(),w=!1;}}let K={name:"NO ZONE"},X="notScheduled",k="scheduling",h="scheduled",j="running",G="canceling",Y="unknown",V="microTask",g="macroTask",U="eventTask",O={},R={symbol:ee,currentZoneFrame:()=>b,onUnhandledError:W,microtaskDrainDone:W,scheduleMicroTask:z,showUncaughtError:()=>!t[ee("ignoreConsoleErrorUncaughtError")],patchEventTarget:()=>[],patchOnProperties:W,patchMethod:()=>W,bindArguments:()=>[],patchThen:()=>W,patchMacroTask:()=>W,patchEventPrototype:()=>W,isIEOrEdge:()=>!1,getGlobalObjects:()=>{},ObjectDefineProperty:()=>W,ObjectGetOwnPropertyDescriptor:()=>{},ObjectCreate:()=>{},ArraySlice:()=>[],patchClass:()=>W,wrapWithCurrentZone:()=>W,filterProperties:()=>[],attachOriginToPatched:()=>W,_redefineProperty:()=>W,patchCallbacks:()=>W,nativeScheduleMicroTask:x},b={parent:null,zone:new t(null,null)},D=null,Q=0;function W(){}return c("Zone","Zone"),t;}function _t(){let e=globalThis,r=e[ee("forceDuplicateZoneCheck")]===!0;if(e.Zone&&(r||typeof e.Zone.__symbol__!="function"))throw new Error("Zone already loaded.");return e.Zone??=dt(),e.Zone;}var be=Object.getOwnPropertyDescriptor,Ae=Object.defineProperty,je=Object.getPrototypeOf,Et=Object.create,Tt=Array.prototype.slice,He="addEventListener",xe="removeEventListener",Le=ee(He),Ie=ee(xe),ue="true",fe="false",Pe=ee("");function Ge(e,r){return Zone.current.wrap(e,r);}function Ve(e,r,c,t,i){return Zone.current.scheduleMacroTask(e,r,c,t,i);}var H=ee,Se=typeof window<"u",pe=Se?window:void 0,$=Se&&pe||globalThis,gt="removeAttribute";function Fe(e,r){for(let c=e.length-1;c>=0;c--)typeof e[c]=="function"&&(e[c]=Ge(e[c],r+"_"+c));return e;}function mt(e,r){let c=e.constructor.name;for(let t=0;t<r.length;t++){let i=r[t],u=e[i];if(u){let E=be(e,i);if(!tt(E))continue;e[i]=(T=>{let y=function(){return T.apply(this,Fe(arguments,c+"."+i));};return de(y,T),y;})(u);}}}function tt(e){return e?e.writable===!1?!1:!(typeof e.get=="function"&&typeof e.set>"u"):!0;}var nt=typeof WorkerGlobalScope<"u"&&self instanceof WorkerGlobalScope,De=!("nw"in $)&&typeof $.process<"u"&&$.process.toString()==="[object process]",Be=!De&&!nt&&!!(Se&&pe.HTMLElement),rt=typeof $.process<"u"&&$.process.toString()==="[object process]"&&!nt&&!!(Se&&pe.HTMLElement),Ce={},yt=H("enable_beforeunload"),Ye=function(e){if(e=e||$.event,!e)return;let r=Ce[e.type];r||(r=Ce[e.type]=H("ON_PROPERTY"+e.type));let c=this||e.target||$,t=c[r],i;if(Be&&c===pe&&e.type==="error"){let u=e;i=t&&t.call(this,u.message,u.filename,u.lineno,u.colno,u.error),i===!0&&e.preventDefault();}else i=t&&t.apply(this,arguments),e.type==="beforeunload"&&$[yt]&&typeof i=="string"?e.returnValue=i:i!=null&&!i&&e.preventDefault();return i;};function $e(e,r,c){let t=be(e,r);if(!t&&c&&be(c,r)&&(t={enumerable:!0,configurable:!0}),!t||!t.configurable)return;let i=H("on"+r+"patched");if(e.hasOwnProperty(i)&&e[i])return;delete t.writable,delete t.value;let u=t.get,E=t.set,T=r.slice(2),y=Ce[T];y||(y=Ce[T]=H("ON_PROPERTY"+T)),t.set=function(S){let d=this;if(!d&&e===$&&(d=$),!d)return;typeof d[y]=="function"&&d.removeEventListener(T,Ye),E&&E.call(d,null),d[y]=S,typeof S=="function"&&d.addEventListener(T,Ye,!1);},t.get=function(){let S=this;if(!S&&e===$&&(S=$),!S)return null;let d=S[y];if(d)return d;if(u){let w=u.call(this);if(w)return t.set.call(this,w),typeof S[gt]=="function"&&S.removeAttribute(r),w;}return null;},Ae(e,r,t),e[i]=!0;}function ot(e,r,c){if(r)for(let t=0;t<r.length;t++)$e(e,"on"+r[t],c);else{let t=[];for(let i in e)i.slice(0,2)=="on"&&t.push(i);for(let i=0;i<t.length;i++)$e(e,t[i],c);}}var oe=H("originalInstance");function ve(e){let r=$[e];if(!r)return;$[H(e)]=r,$[e]=function(){let i=Fe(arguments,e);switch(i.length){case 0:this[oe]=new r();break;case 1:this[oe]=new r(i[0]);break;case 2:this[oe]=new r(i[0],i[1]);break;case 3:this[oe]=new r(i[0],i[1],i[2]);break;case 4:this[oe]=new r(i[0],i[1],i[2],i[3]);break;default:throw new Error("Arg list too long.");}},de($[e],r);let c=new r(function(){}),t;for(t in c)e==="XMLHttpRequest"&&t==="responseBlob"||function(i){typeof c[i]=="function"?$[e].prototype[i]=function(){return this[oe][i].apply(this[oe],arguments);}:Ae($[e].prototype,i,{set:function(u){typeof u=="function"?(this[oe][i]=Ge(u,e+"."+i),de(this[oe][i],u)):this[oe][i]=u;},get:function(){return this[oe][i];}});}(t);for(t in r)t!=="prototype"&&r.hasOwnProperty(t)&&($[e][t]=r[t]);}function he(e,r,c){let t=e;for(;t&&!t.hasOwnProperty(r);)t=je(t);!t&&e[r]&&(t=e);let i=H(r),u=null;if(t&&(!(u=t[i])||!t.hasOwnProperty(i))){u=t[i]=t[r];let E=t&&be(t,r);if(tt(E)){let T=c(u,i,r);t[r]=function(){return T(this,arguments);},de(t[r],u);}}return u;}function pt(e,r,c){let t=null;function i(u){let E=u.data;return E.args[E.cbIdx]=function(){u.invoke.apply(this,arguments);},t.apply(E.target,E.args),u;}t=he(e,r,u=>function(E,T){let y=c(E,T);return y.cbIdx>=0&&typeof T[y.cbIdx]=="function"?Ve(y.name,T[y.cbIdx],y,i):u.apply(E,T);});}function de(e,r){e[H("OriginalDelegate")]=r;}var Je=!1,Me=!1;function kt(){try{let e=pe.navigator.userAgent;if(e.indexOf("MSIE ")!==-1||e.indexOf("Trident/")!==-1)return!0;}catch{}return!1;}function vt(){if(Je)return Me;Je=!0;try{let e=pe.navigator.userAgent;(e.indexOf("MSIE ")!==-1||e.indexOf("Trident/")!==-1||e.indexOf("Edge/")!==-1)&&(Me=!0);}catch{}return Me;}function Ke(e){return typeof e=="function";}function Qe(e){return typeof e=="number";}var ye=!1;if(typeof window<"u")try{let e=Object.defineProperty({},"passive",{get:function(){ye=!0;}});window.addEventListener("test",e,e),window.removeEventListener("test",e,e);}catch{ye=!1;}var bt={useG:!0},te={},st={},it=new RegExp("^"+Pe+"(\\w+)(true|false)$"),ct=H("propagationStopped");function at(e,r){let c=(r?r(e):e)+fe,t=(r?r(e):e)+ue,i=Pe+c,u=Pe+t;te[e]={},te[e][fe]=i,te[e][ue]=u;}function Pt(e,r,c,t){let i=t&&t.add||He,u=t&&t.rm||xe,E=t&&t.listeners||"eventListeners",T=t&&t.rmAll||"removeAllListeners",y=H(i),S="."+i+":",d="prependListener",w="."+d+":",Z=function(k,h,j){if(k.isRemoved)return;let G=k.callback;typeof G=="object"&&G.handleEvent&&(k.callback=g=>G.handleEvent(g),k.originalDelegate=G);let Y;try{k.invoke(k,h,[j]);}catch(g){Y=g;}let V=k.options;if(V&&typeof V=="object"&&V.once){let g=k.originalDelegate?k.originalDelegate:k.callback;h[u].call(h,j.type,g,V);}return Y;};function x(k,h,j){if(h=h||e.event,!h)return;let G=k||h.target||e,Y=G[te[h.type][j?ue:fe]];if(Y){let V=[];if(Y.length===1){let g=Z(Y[0],G,h);g&&V.push(g);}else{let g=Y.slice();for(let U=0;U<g.length&&!(h&&h[ct]===!0);U++){let O=Z(g[U],G,h);O&&V.push(O);}}if(V.length===1)throw V[0];for(let g=0;g<V.length;g++){let U=V[g];r.nativeScheduleMicroTask(()=>{throw U;});}}}let z=function(k){return x(this,k,!1);},J=function(k){return x(this,k,!0);};function K(k,h){if(!k)return!1;let j=!0;h&&h.useG!==void 0&&(j=h.useG);let G=h&&h.vh,Y=!0;h&&h.chkDup!==void 0&&(Y=h.chkDup);let V=!1;h&&h.rt!==void 0&&(V=h.rt);let g=k;for(;g&&!g.hasOwnProperty(i);)g=je(g);if(!g&&k[i]&&(g=k),!g||g[y])return!1;let U=h&&h.eventNameToString,O={},R=g[y]=g[i],b=g[H(u)]=g[u],D=g[H(E)]=g[E],Q=g[H(T)]=g[T],W;h&&h.prepend&&(W=g[H(h.prepend)]=g[h.prepend]);function N(s,l){return!ye&&typeof s=="object"&&s?!!s.capture:!ye||!l?s:typeof s=="boolean"?{capture:s,passive:!0}:s?typeof s=="object"&&s.passive!==!1?{...s,passive:!0}:s:{passive:!0};}let _=function(s){if(!O.isExisting)return R.call(O.target,O.eventName,O.capture?J:z,O.options);},n=function(s){if(!s.isRemoved){let l=te[s.eventName],v;l&&(v=l[s.capture?ue:fe]);let C=v&&s.target[v];if(C){for(let m=0;m<C.length;m++)if(C[m]===s){C.splice(m,1),s.isRemoved=!0,s.removeAbortListener&&(s.removeAbortListener(),s.removeAbortListener=null),C.length===0&&(s.allRemoved=!0,s.target[v]=null);break;}}}if(s.allRemoved)return b.call(s.target,s.eventName,s.capture?J:z,s.options);},o=function(s){return R.call(O.target,O.eventName,s.invoke,O.options);},p=function(s){return W.call(O.target,O.eventName,s.invoke,O.options);},P=function(s){return b.call(s.target,s.eventName,s.invoke,s.options);},q=j?_:o,A=j?n:P,_e=function(s,l){let v=typeof l;return v==="function"&&s.callback===l||v==="object"&&s.originalDelegate===l;},ae=h&&h.diff?h.diff:_e,le=Zone[H("UNPATCHED_EVENTS")],ne=e[H("PASSIVE_EVENTS")];function f(s){if(typeof s=="object"&&s!==null){let l={...s};return s.signal&&(l.signal=s.signal),l;}return s;}let a=function(s,l,v,C,m=!1,L=!1){return function(){let I=this||e,M=arguments[0];h&&h.transferEventName&&(M=h.transferEventName(M));let F=arguments[1];if(!F)return s.apply(this,arguments);if(De&&M==="uncaughtException")return s.apply(this,arguments);let B=!1;if(typeof F!="function"){if(!F.handleEvent)return s.apply(this,arguments);B=!0;}if(G&&!G(s,F,I,arguments))return;let Ee=ye&&!!ne&&ne.indexOf(M)!==-1,se=f(N(arguments[2],Ee)),Te=se?.signal;if(Te?.aborted)return;if(le){for(let ie=0;ie<le.length;ie++)if(M===le[ie])return Ee?s.call(I,M,F,se):s.apply(this,arguments);}let Oe=se?typeof se=="boolean"?!0:se.capture:!1,ze=se&&typeof se=="object"?se.once:!1,ht=Zone.current,Ne=te[M];Ne||(at(M,U),Ne=te[M]);let Ue=Ne[Oe?ue:fe],ge=I[Ue],We=!1;if(ge){if(We=!0,Y){for(let ie=0;ie<ge.length;ie++)if(ae(ge[ie],F))return;}}else ge=I[Ue]=[];let we,qe=I.constructor.name,Xe=st[qe];Xe&&(we=Xe[M]),we||(we=qe+l+(U?U(M):M)),O.options=se,ze&&(O.options.once=!1),O.target=I,O.capture=Oe,O.eventName=M,O.isExisting=We;let ke=j?bt:void 0;ke&&(ke.taskData=O),Te&&(O.options.signal=void 0);let re=ht.scheduleEventTask(we,F,ke,v,C);if(Te){O.options.signal=Te;let ie=()=>re.zone.cancelTask(re);s.call(Te,"abort",ie,{once:!0}),re.removeAbortListener=()=>Te.removeEventListener("abort",ie);}if(O.target=null,ke&&(ke.taskData=null),ze&&(O.options.once=!0),!ye&&typeof re.options=="boolean"||(re.options=se),re.target=I,re.capture=Oe,re.eventName=M,B&&(re.originalDelegate=F),L?ge.unshift(re):ge.push(re),m)return I;};};return g[i]=a(R,S,q,A,V),W&&(g[d]=a(W,w,p,A,V,!0)),g[u]=function(){let s=this||e,l=arguments[0];h&&h.transferEventName&&(l=h.transferEventName(l));let v=arguments[2],C=v?typeof v=="boolean"?!0:v.capture:!1,m=arguments[1];if(!m)return b.apply(this,arguments);if(G&&!G(b,m,s,arguments))return;let L=te[l],I;L&&(I=L[C?ue:fe]);let M=I&&s[I];if(M)for(let F=0;F<M.length;F++){let B=M[F];if(ae(B,m)){if(M.splice(F,1),B.isRemoved=!0,M.length===0&&(B.allRemoved=!0,s[I]=null,!C&&typeof l=="string")){let Ee=Pe+"ON_PROPERTY"+l;s[Ee]=null;}return B.zone.cancelTask(B),V?s:void 0;}}return b.apply(this,arguments);},g[E]=function(){let s=this||e,l=arguments[0];h&&h.transferEventName&&(l=h.transferEventName(l));let v=[],C=lt(s,U?U(l):l);for(let m=0;m<C.length;m++){let L=C[m],I=L.originalDelegate?L.originalDelegate:L.callback;v.push(I);}return v;},g[T]=function(){let s=this||e,l=arguments[0];if(l){h&&h.transferEventName&&(l=h.transferEventName(l));let v=te[l];if(v){let C=v[fe],m=v[ue],L=s[C],I=s[m];if(L){let M=L.slice();for(let F=0;F<M.length;F++){let B=M[F],Ee=B.originalDelegate?B.originalDelegate:B.callback;this[u].call(this,l,Ee,B.options);}}if(I){let M=I.slice();for(let F=0;F<M.length;F++){let B=M[F],Ee=B.originalDelegate?B.originalDelegate:B.callback;this[u].call(this,l,Ee,B.options);}}}}else{let v=Object.keys(s);for(let C=0;C<v.length;C++){let m=v[C],L=it.exec(m),I=L&&L[1];I&&I!=="removeListener"&&this[T].call(this,I);}this[T].call(this,"removeListener");}if(V)return this;},de(g[i],R),de(g[u],b),Q&&de(g[T],Q),D&&de(g[E],D),!0;}let X=[];for(let k=0;k<c.length;k++)X[k]=K(c[k],t);return X;}function lt(e,r){if(!r){let u=[];for(let E in e){let T=it.exec(E),y=T&&T[1];if(y&&(!r||y===r)){let S=e[E];if(S)for(let d=0;d<S.length;d++)u.push(S[d]);}}return u;}let c=te[r];c||(at(r),c=te[r]);let t=e[c[fe]],i=e[c[ue]];return t?i?t.concat(i):t.slice():i?i.slice():[];}function wt(e,r){let c=e.Event;c&&c.prototype&&r.patchMethod(c.prototype,"stopImmediatePropagation",t=>function(i,u){i[ct]=!0,t&&t.apply(i,u);});}function Rt(e,r){r.patchMethod(e,"queueMicrotask",c=>function(t,i){Zone.current.scheduleMicroTask("queueMicrotask",i[0]);});}var Re=H("zoneTask");function me(e,r,c,t){let i=null,u=null;r+=t,c+=t;let E={};function T(S){let d=S.data;d.args[0]=function(){return S.invoke.apply(this,arguments);};let w=i.apply(e,d.args);return Qe(w)?d.handleId=w:(d.handle=w,d.isRefreshable=Ke(w.refresh)),S;}function y(S){let{handle:d,handleId:w}=S.data;return u.call(e,d??w);}i=he(e,r,S=>function(d,w){if(Ke(w[0])){let Z={isRefreshable:!1,isPeriodic:t==="Interval",delay:t==="Timeout"||t==="Interval"?w[1]||0:void 0,args:w},x=w[0];w[0]=function(){try{return x.apply(this,arguments);}finally{let{handle:j,handleId:G,isPeriodic:Y,isRefreshable:V}=Z;!Y&&!V&&(G?delete E[G]:j&&(j[Re]=null));}};let z=Ve(r,w[0],Z,T,y);if(!z)return z;let{handleId:J,handle:K,isRefreshable:X,isPeriodic:k}=z.data;if(J)E[J]=z;else if(K&&(K[Re]=z,X&&!k)){let h=K.refresh;K.refresh=function(){let{zone:j,state:G}=z;return G==="notScheduled"?(z._state="scheduled",j._updateTaskCount(z,1)):G==="running"&&(z._state="scheduling"),h.call(this);};}return K??J??z;}else return S.apply(e,w);}),u=he(e,c,S=>function(d,w){let Z=w[0],x;Qe(Z)?(x=E[Z],delete E[Z]):(x=Z?.[Re],x?Z[Re]=null:x=Z),x?.type?x.cancelFn&&x.zone.cancelTask(x):S.apply(e,w);});}function Ct(e,r){let{isBrowser:c,isMix:t}=r.getGlobalObjects();if(!c&&!t||!e.customElements||!("customElements"in e))return;let i=["connectedCallback","disconnectedCallback","adoptedCallback","attributeChangedCallback","formAssociatedCallback","formDisabledCallback","formResetCallback","formStateRestoreCallback"];r.patchCallbacks(r,e.customElements,"customElements","define",i);}function St(e,r){if(Zone[r.symbol("patchEventTarget")])return;let{eventNames:c,zoneSymbolEventNames:t,TRUE_STR:i,FALSE_STR:u,ZONE_SYMBOL_PREFIX:E}=r.getGlobalObjects();for(let y=0;y<c.length;y++){let S=c[y],d=S+u,w=S+i,Z=E+d,x=E+w;t[S]={},t[S][u]=Z,t[S][i]=x;}let T=e.EventTarget;if(!(!T||!T.prototype))return r.patchEventTarget(e,r,[T&&T.prototype]),!0;}function Dt(e,r){r.patchEventPrototype(e,r);}function ut(e,r,c){if(!c||c.length===0)return r;let t=c.filter(u=>u.target===e);if(!t||t.length===0)return r;let i=t[0].ignoreProperties;return r.filter(u=>i.indexOf(u)===-1);}function et(e,r,c,t){if(!e)return;let i=ut(e,r,c);ot(e,i,t);}function Ze(e){return Object.getOwnPropertyNames(e).filter(r=>r.startsWith("on")&&r.length>2).map(r=>r.substring(2));}function Ot(e,r){if(De&&!rt||Zone[e.symbol("patchEvents")])return;let c=r.__Zone_ignore_on_properties,t=[];if(Be){let i=window;t=t.concat(["Document","SVGElement","Element","HTMLElement","HTMLBodyElement","HTMLMediaElement","HTMLFrameSetElement","HTMLFrameElement","HTMLIFrameElement","HTMLMarqueeElement","Worker"]);let u=kt()?[{target:i,ignoreProperties:["error"]}]:[];et(i,Ze(i),c&&c.concat(u),je(i));}t=t.concat(["XMLHttpRequest","XMLHttpRequestEventTarget","IDBIndex","IDBRequest","IDBOpenDBRequest","IDBDatabase","IDBTransaction","IDBCursor","WebSocket"]);for(let i=0;i<t.length;i++){let u=r[t[i]];u&&u.prototype&&et(u.prototype,Ze(u.prototype),c);}}function Nt(e){e.__load_patch("legacy",r=>{let c=r[e.__symbol__("legacyPatch")];c&&c();}),e.__load_patch("timers",r=>{let c="set",t="clear";me(r,c,t,"Timeout"),me(r,c,t,"Interval"),me(r,c,t,"Immediate");}),e.__load_patch("requestAnimationFrame",r=>{me(r,"request","cancel","AnimationFrame"),me(r,"mozRequest","mozCancel","AnimationFrame"),me(r,"webkitRequest","webkitCancel","AnimationFrame");}),e.__load_patch("blocking",(r,c)=>{let t=["alert","prompt","confirm"];for(let i=0;i<t.length;i++){let u=t[i];he(r,u,(E,T,y)=>function(S,d){return c.current.run(E,r,d,y);});}}),e.__load_patch("EventTarget",(r,c,t)=>{Dt(r,t),St(r,t);let i=r.XMLHttpRequestEventTarget;i&&i.prototype&&t.patchEventTarget(r,t,[i.prototype]);}),e.__load_patch("MutationObserver",(r,c,t)=>{ve("MutationObserver"),ve("WebKitMutationObserver");}),e.__load_patch("IntersectionObserver",(r,c,t)=>{ve("IntersectionObserver");}),e.__load_patch("FileReader",(r,c,t)=>{ve("FileReader");}),e.__load_patch("on_property",(r,c,t)=>{Ot(t,r);}),e.__load_patch("customElements",(r,c,t)=>{Ct(r,t);}),e.__load_patch("XHR",(r,c)=>{S(r);let t=H("xhrTask"),i=H("xhrSync"),u=H("xhrListener"),E=H("xhrScheduled"),T=H("xhrURL"),y=H("xhrErrorBeforeScheduled");function S(d){let w=d.XMLHttpRequest;if(!w)return;let Z=w.prototype;function x(R){return R[t];}let z=Z[Le],J=Z[Ie];if(!z){let R=d.XMLHttpRequestEventTarget;if(R){let b=R.prototype;z=b[Le],J=b[Ie];}}let K="readystatechange",X="scheduled";function k(R){let b=R.data,D=b.target;D[E]=!1,D[y]=!1;let Q=D[u];z||(z=D[Le],J=D[Ie]),Q&&J.call(D,K,Q);let W=D[u]=()=>{if(D.readyState===D.DONE)if(!b.aborted&&D[E]&&R.state===X){let _=D[c.__symbol__("loadfalse")];if(D.status!==0&&_&&_.length>0){let n=R.invoke;R.invoke=function(){let o=D[c.__symbol__("loadfalse")];for(let p=0;p<o.length;p++)o[p]===R&&o.splice(p,1);!b.aborted&&R.state===X&&n.call(R);},_.push(R);}else R.invoke();}else!b.aborted&&D[E]===!1&&(D[y]=!0);};return z.call(D,K,W),D[t]||(D[t]=R),U.apply(D,b.args),D[E]=!0,R;}function h(){}function j(R){let b=R.data;return b.aborted=!0,O.apply(b.target,b.args);}let G=he(Z,"open",()=>function(R,b){return R[i]=b[2]==!1,R[T]=b[1],G.apply(R,b);}),Y="XMLHttpRequest.send",V=H("fetchTaskAborting"),g=H("fetchTaskScheduling"),U=he(Z,"send",()=>function(R,b){if(c.current[g]===!0||R[i])return U.apply(R,b);{let D={target:R,url:R[T],isPeriodic:!1,args:b,aborted:!1},Q=Ve(Y,h,D,k,j);R&&R[y]===!0&&!D.aborted&&Q.state===X&&Q.invoke();}}),O=he(Z,"abort",()=>function(R,b){let D=x(R);if(D&&typeof D.type=="string"){if(D.cancelFn==null||D.data&&D.data.aborted)return;D.zone.cancelTask(D);}else if(c.current[V]===!0)return O.apply(R,b);});}}),e.__load_patch("geolocation",r=>{r.navigator&&r.navigator.geolocation&&mt(r.navigator.geolocation,["getCurrentPosition","watchPosition"]);}),e.__load_patch("PromiseRejectionEvent",(r,c)=>{function t(i){return function(u){lt(r,i).forEach(T=>{let y=r.PromiseRejectionEvent;if(y){let S=new y(i,{promise:u.promise,reason:u.rejection});T.invoke(S);}});};}r.PromiseRejectionEvent&&(c[H("unhandledPromiseRejectionHandler")]=t("unhandledrejection"),c[H("rejectionHandledHandler")]=t("rejectionhandled"));}),e.__load_patch("queueMicrotask",(r,c,t)=>{Rt(r,t);});}function Lt(e){e.__load_patch("ZoneAwarePromise",(r,c,t)=>{let i=Object.getOwnPropertyDescriptor,u=Object.defineProperty;function E(f){if(f&&f.toString===Object.prototype.toString){let a=f.constructor&&f.constructor.name;return(a||"")+": "+JSON.stringify(f);}return f?f.toString():Object.prototype.toString.call(f);}let T=t.symbol,y=[],S=r[T("DISABLE_WRAPPING_UNCAUGHT_PROMISE_REJECTION")]!==!1,d=T("Promise"),w=T("then"),Z="__creationTrace__";t.onUnhandledError=f=>{if(t.showUncaughtError()){let a=f&&f.rejection;a?console.error("Unhandled Promise rejection:",a instanceof Error?a.message:a,"; Zone:",f.zone.name,"; Task:",f.task&&f.task.source,"; Value:",a,a instanceof Error?a.stack:void 0):console.error(f);}},t.microtaskDrainDone=()=>{for(;y.length;){let f=y.shift();try{f.zone.runGuarded(()=>{throw f.throwOriginal?f.rejection:f;});}catch(a){z(a);}}};let x=T("unhandledPromiseRejectionHandler");function z(f){t.onUnhandledError(f);try{let a=c[x];typeof a=="function"&&a.call(this,f);}catch{}}function J(f){return f&&f.then;}function K(f){return f;}function X(f){return A.reject(f);}let k=T("state"),h=T("value"),j=T("finally"),G=T("parentPromiseValue"),Y=T("parentPromiseState"),V="Promise.then",g=null,U=!0,O=!1,R=0;function b(f,a){return s=>{try{N(f,a,s);}catch(l){N(f,!1,l);}};}let D=function(){let f=!1;return function(s){return function(){f||(f=!0,s.apply(null,arguments));};};},Q="Promise resolved with itself",W=T("currentTaskTrace");function N(f,a,s){let l=D();if(f===s)throw new TypeError(Q);if(f[k]===g){let v=null;try{(typeof s=="object"||typeof s=="function")&&(v=s&&s.then);}catch(C){return l(()=>{N(f,!1,C);})(),f;}if(a!==O&&s instanceof A&&s.hasOwnProperty(k)&&s.hasOwnProperty(h)&&s[k]!==g)n(s),N(f,s[k],s[h]);else if(a!==O&&typeof v=="function")try{v.call(s,l(b(f,a)),l(b(f,!1)));}catch(C){l(()=>{N(f,!1,C);})();}else{f[k]=a;let C=f[h];if(f[h]=s,f[j]===j&&a===U&&(f[k]=f[Y],f[h]=f[G]),a===O&&s instanceof Error){let m=c.currentTask&&c.currentTask.data&&c.currentTask.data[Z];m&&u(s,W,{configurable:!0,enumerable:!1,writable:!0,value:m});}for(let m=0;m<C.length;)o(f,C[m++],C[m++],C[m++],C[m++]);if(C.length==0&&a==O){f[k]=R;let m=s;try{throw new Error("Uncaught (in promise): "+E(s)+(s&&s.stack?`
`+s.stack:""));}catch(L){m=L;}S&&(m.throwOriginal=!0),m.rejection=s,m.promise=f,m.zone=c.current,m.task=c.currentTask,y.push(m),t.scheduleMicroTask();}}}return f;}let _=T("rejectionHandledHandler");function n(f){if(f[k]===R){try{let a=c[_];a&&typeof a=="function"&&a.call(this,{rejection:f[h],promise:f});}catch{}f[k]=O;for(let a=0;a<y.length;a++)f===y[a].promise&&y.splice(a,1);}}function o(f,a,s,l,v){n(f);let C=f[k],m=C?typeof l=="function"?l:K:typeof v=="function"?v:X;a.scheduleMicroTask(V,()=>{try{let L=f[h],I=!!s&&j===s[j];I&&(s[G]=L,s[Y]=C);let M=a.run(m,void 0,I&&m!==X&&m!==K?[]:[L]);N(s,!0,M);}catch(L){N(s,!1,L);}},s);}let p="function ZoneAwarePromise() { [native code] }",P=function(){},q=r.AggregateError;class A{static toString(){return p;}static resolve(a){return a instanceof A?a:N(new this(null),U,a);}static reject(a){return N(new this(null),O,a);}static withResolvers(){let a={};return a.promise=new A((s,l)=>{a.resolve=s,a.reject=l;}),a;}static any(a){if(!a||typeof a[Symbol.iterator]!="function")return Promise.reject(new q([],"All promises were rejected"));let s=[],l=0;try{for(let m of a)l++,s.push(A.resolve(m));}catch{return Promise.reject(new q([],"All promises were rejected"));}if(l===0)return Promise.reject(new q([],"All promises were rejected"));let v=!1,C=[];return new A((m,L)=>{for(let I=0;I<s.length;I++)s[I].then(M=>{v||(v=!0,m(M));},M=>{C.push(M),l--,l===0&&(v=!0,L(new q(C,"All promises were rejected")));});});}static race(a){let s,l,v=new this((L,I)=>{s=L,l=I;});function C(L){s(L);}function m(L){l(L);}for(let L of a)J(L)||(L=this.resolve(L)),L.then(C,m);return v;}static all(a){return A.allWithCallback(a);}static allSettled(a){return(this&&this.prototype instanceof A?this:A).allWithCallback(a,{thenCallback:l=>({status:"fulfilled",value:l}),errorCallback:l=>({status:"rejected",reason:l})});}static allWithCallback(a,s){let l,v,C=new this((M,F)=>{l=M,v=F;}),m=2,L=0,I=[];for(let M of a){J(M)||(M=this.resolve(M));let F=L;try{M.then(B=>{I[F]=s?s.thenCallback(B):B,m--,m===0&&l(I);},B=>{s?(I[F]=s.errorCallback(B),m--,m===0&&l(I)):v(B);});}catch(B){v(B);}m++,L++;}return m-=2,m===0&&l(I),C;}constructor(a){let s=this;if(!(s instanceof A))throw new Error("Must be an instanceof Promise.");s[k]=g,s[h]=[];try{let l=D();a&&a(l(b(s,U)),l(b(s,O)));}catch(l){N(s,!1,l);}}get[Symbol.toStringTag](){return"Promise";}get[Symbol.species](){return A;}then(a,s){let l=this.constructor?.[Symbol.species];(!l||typeof l!="function")&&(l=this.constructor||A);let v=new l(P),C=c.current;return this[k]==g?this[h].push(C,v,a,s):o(this,C,v,a,s),v;}catch(a){return this.then(null,a);}finally(a){let s=this.constructor?.[Symbol.species];(!s||typeof s!="function")&&(s=A);let l=new s(P);l[j]=j;let v=c.current;return this[k]==g?this[h].push(v,l,a,a):o(this,v,l,a,a),l;}}A.resolve=A.resolve,A.reject=A.reject,A.race=A.race,A.all=A.all;let _e=r[d]=r.Promise;r.Promise=A;let ae=T("thenPatched");function le(f){let a=f.prototype,s=i(a,"then");if(s&&(s.writable===!1||!s.configurable))return;let l=a.then;a[w]=l,f.prototype.then=function(v,C){return new A((L,I)=>{l.call(this,L,I);}).then(v,C);},f[ae]=!0;}t.patchThen=le;function ne(f){return function(a,s){let l=f.apply(a,s);if(l instanceof A)return l;let v=l.constructor;return v[ae]||le(v),l;};}return _e&&(le(_e),he(r,"fetch",f=>ne(f))),Promise[c.__symbol__("uncaughtPromiseErrors")]=y,A;});}function It(e){e.__load_patch("toString",r=>{let c=Function.prototype.toString,t=H("OriginalDelegate"),i=H("Promise"),u=H("Error"),E=function(){if(typeof this=="function"){let d=this[t];if(d)return typeof d=="function"?c.call(d):Object.prototype.toString.call(d);if(this===Promise){let w=r[i];if(w)return c.call(w);}if(this===Error){let w=r[u];if(w)return c.call(w);}}return c.call(this);};E[t]=c,Function.prototype.toString=E;let T=Object.prototype.toString,y="[object Promise]";Object.prototype.toString=function(){return typeof Promise=="function"&&this instanceof Promise?y:T.call(this);};});}function Mt(e,r,c,t,i){let u=Zone.__symbol__(t);if(r[u])return;let E=r[u]=r[t];r[t]=function(T,y,S){return y&&y.prototype&&i.forEach(function(d){let w=`${c}.${t}::`+d,Z=y.prototype;try{if(Z.hasOwnProperty(d)){let x=e.ObjectGetOwnPropertyDescriptor(Z,d);x&&x.value?(x.value=e.wrapWithCurrentZone(x.value,w),e._redefineProperty(y.prototype,d,x)):Z[d]&&(Z[d]=e.wrapWithCurrentZone(Z[d],w));}else Z[d]&&(Z[d]=e.wrapWithCurrentZone(Z[d],w));}catch{}}),E.call(r,T,y,S);},e.attachOriginToPatched(r[t],E);}function Zt(e){e.__load_patch("util",(r,c,t)=>{let i=Ze(r);t.patchOnProperties=ot,t.patchMethod=he,t.bindArguments=Fe,t.patchMacroTask=pt;let u=c.__symbol__("BLACK_LISTED_EVENTS"),E=c.__symbol__("UNPATCHED_EVENTS");r[E]&&(r[u]=r[E]),r[u]&&(c[u]=c[E]=r[u]),t.patchEventPrototype=wt,t.patchEventTarget=Pt,t.isIEOrEdge=vt,t.ObjectDefineProperty=Ae,t.ObjectGetOwnPropertyDescriptor=be,t.ObjectCreate=Et,t.ArraySlice=Tt,t.patchClass=ve,t.wrapWithCurrentZone=Ge,t.filterProperties=ut,t.attachOriginToPatched=de,t._redefineProperty=Object.defineProperty,t.patchCallbacks=Mt,t.getGlobalObjects=()=>({globalSources:st,zoneSymbolEventNames:te,eventNames:i,isBrowser:Be,isMix:rt,isNode:De,TRUE_STR:ue,FALSE_STR:fe,ZONE_SYMBOL_PREFIX:Pe,ADD_EVENT_LISTENER_STR:He,REMOVE_EVENT_LISTENER_STR:xe});});}function At(e){Lt(e),It(e),Zt(e);}var ft=_t();At(ft);Nt(ft);(globalThis.$localize??={}).locale="en-US";/**i18n:cbe5cfdf7c2118a9c3d78ef1d684f3afa089201352886449a06a6511cfef74a7*/
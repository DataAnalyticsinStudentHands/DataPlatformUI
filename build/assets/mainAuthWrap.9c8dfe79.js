import{_ as h,u as p,L as _,o as l,I as i,w as t,V as v,b as s,s as u,j as V,q as b,N as w,O as g,g as d,t as m,r as c,P as C,Q as y,R as N}from"./index.ff4761a7.js";import R from"./login.9da3f931.js";import $ from"./verifyAccWithCode.194e5516.js";import x from"./register.d2fcae6d.js";import"./index.esm.e5323e3e.js";const D={name:"mainAuthWrap",emits:["showDashboard"],components:{LoginForm:R,VerifyNew:$,RegisterForm:x},data(){return{tab:"login",forgotPassword:null,forgotPasswordColor:null,language:!1}},mounted(){this.language=this.$i18n.locale==="es"},setup(){return{store:p()}},watch:{"$route.path":{immediate:!0,handler(e){e==="/login"?this.tab="login":e==="/register"&&(this.tab="register")}}},methods:{async login(){try{await this.store.login(this.email,this.password),await this.store.checkFormCompletion()}catch(e){this.handleError(e)}},changeRoute(e){typeof e=="string"?this.$router.push(e):e&&e.routeName&&e.userID&&this.$router.push({name:e.routeName,params:{userID:e.userID}})},changeLanguage(){this.language?this.$i18n.locale="es":this.$i18n.locale="en"}}},I={class:"font-semibold text-red-800"},L={class:"font-semibold text-red-800"};function k(e,a,T,S,n,r){const f=_("router-view");return l(),i(v,null,{default:t(()=>[s(c,null,{default:t(()=>[s(u,{cols:"12",sm:"10",md:"8",lg:"6",class:"mx-auto pt-5"},{default:t(()=>[s(V,{class:b(["pa-5 mb-12",{"fill-height":e.$vuetify.display.xs}]),elevation:e.$vuetify.display.xs?0:8},{default:t(()=>[s(w,{modelValue:n.tab,"onUpdate:modelValue":a[2]||(a[2]=o=>n.tab=o),centered:"",grow:"",density:"comfortable","slider-color":"red-800"},{default:t(()=>[s(g,{onClick:a[0]||(a[0]=o=>r.changeRoute("/login")),value:"login"},{default:t(()=>[d("span",I,m(e.$t("Login")),1)]),_:1}),s(g,{onClick:a[1]||(a[1]=o=>r.changeRoute("/register")),value:"register"},{default:t(()=>[d("span",L,m(e.$t("Register")),1)]),_:1})]),_:1},8,["modelValue"]),s(c,{class:"mb-n4 align-center justify-end"},{default:t(()=>[s(u,{cols:"auto",class:"pt-3 pb-0 pr-1"},{default:t(()=>[s(C,{density:"compact",modelValue:n.language,"onUpdate:modelValue":a[3]||(a[3]=o=>n.language=o),inset:"","hide-details":"",color:"red-800",onChange:r.changeLanguage,label:"ES",class:"switch-container"},null,8,["modelValue","onChange"])]),_:1})]),_:1}),s(f,{onNavigateTo:r.changeRoute},{default:t(({Component:o})=>[s(y,null,{default:t(()=>[(l(),i(N(o)))]),_:2},1024)]),_:1},8,["onNavigateTo"])]),_:1},8,["class","elevation"])]),_:1})]),_:1})]),_:1})}const U=h(D,[["render",k],["__scopeId","data-v-f1830af4"]]);export{U as default};

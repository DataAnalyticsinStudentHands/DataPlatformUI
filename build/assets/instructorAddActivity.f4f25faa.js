import{_ as d,u as m,a as _,o as p,c as v,b as t,w as a,d as y,e as h,V as f,r as V,s as b,v as k,h as c,l as u,g as S}from"./index.ff4761a7.js";const x={data(){return{activity:{activityName:""}}},methods:{async handleSubmitForm(){let e=m().token,o="http://1529618mytest.us.reclaim.cloud/backend/instructorSideData/activities/";_.post(o,this.activity,{headers:{token:e}}).then(s=>{this.$router.push({name:"instructorActivities",params:{toastType:"success",toastMessage:"Activity added!",toastPosition:"top-right",toastCSS:"Toastify__toast--create"}})}).catch(s=>{this.handleError(s)})}}},g=S("p",{class:"font-weight-black text-h6"},"New Activity",-1);function A(i,e,o,s,n,r){return p(),v("main",null,[t(h,{onSubmit:y(r.handleSubmitForm,["prevent"])},{default:a(()=>[t(f,null,{default:a(()=>[g,t(V,null,{default:a(()=>[t(b,{cols:"12",md:"6"},{default:a(()=>[t(k,{modelValue:n.activity.activityName,"onUpdate:modelValue":e[0]||(e[0]=l=>n.activity.activityName=l),label:"Activity's Name"},null,8,["modelValue"])]),_:1})]),_:1}),t(c,{onClick:r.handleSubmitForm},{default:a(()=>[u("Submit")]),_:1},8,["onClick"]),t(c,{onClick:e[1]||(e[1]=l=>i.$router.back()),style:{"margin-left":"10px"}},{default:a(()=>[u(" Cancel ")]),_:1})]),_:1})]),_:1},8,["onSubmit"])])}const N=d(x,[["render",A]]);export{N as default};

import{_ as m,u as c,a as u,L as y,o as f,c as h,b as i,w as a,g as n,h as d,V as g,t as V,r as A,s as N,v as S,l as _}from"./index.19bf4f6c.js";const k={props:["id"],data(){return{activity:{activityName:"",activityStatus:!1},originalActivityName:""}},beforeMount(){let t=c().token,s=`${{BASE_URL:"/platform/",MODE:"production",DEV:!1,PROD:!0}.VITE_ROOT_API}/instructorSideData/activities`;u.get(`${s}/${this.$route.params.id}`,{headers:{token:t}}).then(r=>{let e=r.data;this.activity.activityName=e.activityName,this.activity.activityStatus=e.activityStatus,this.originalActivityName=e.activityName})},methods:{handleUpdateForm(){let t=c().token,s=`${{BASE_URL:"/platform/",MODE:"production",DEV:!1,PROD:!0}.VITE_ROOT_API}/instructorSideData/activities`;u.put(`${s}/${this.$route.params.id}`,this.activity,{headers:{token:t}}).then(()=>{this.$router.push({name:"instructorActivities",params:{toastType:"info",toastMessage:"Activity updated!",toastPosition:"top-right",toastCSS:"Toastify__toast--update"}})})}}},x={class:""},$={class:"font-weight-black text-h6"},C=n("br",null,null,-1),D={style:{"text-align":"right"}};function E(o,t,s,r,e,p){const v=y("center");return f(),h("main",x,[i(v,null,{default:a(()=>[i(g,null,{default:a(()=>[n("p",$,"Activity: "+V(e.originalActivityName),1),C,i(A,null,{default:a(()=>[i(N,{cols:"12",md:"6"},{default:a(()=>[i(S,{modelValue:e.activity.activityName,"onUpdate:modelValue":t[0]||(t[0]=l=>e.activity.activityName=l),label:"Activity Name"},null,8,["modelValue"])]),_:1})]),_:1})]),_:1})]),_:1}),n("div",D,[i(d,{onClick:t[1]||(t[1]=l=>o.$router.back()),style:{"margin-right":"10px"}},{default:a(()=>[_(" Cancel ")]),_:1}),i(d,{style:{"text-align":"center"},onClick:p.handleUpdateForm},{default:a(()=>[_("Update")]),_:1},8,["onClick"])])])}const T=m(k,[["render",E]]);export{T as default};

import{_ as v,u as l,a as r,P as _,o as m,c as h,b as a,w as s,l as c,j as y,V as f,t as g,f as k,g as N,W as V,k as x}from"./index.06e63598.js";const S={props:["id"],data(){return{activity:{activityName:"",activityStatus:!1},originalActivityName:""}},beforeMount(){let e=l().token,o="https://cis-4339.herokuapp.com/instructorSideData/activities";r.get(`${o}/${this.$route.params.id}`,{headers:{token:e}}).then(i=>{let t=i.data[0];console.log(i.data[0]),this.activity.activityName=t.activityName,this.activity.activityStatus=t.activityStatus,this.originalActivityName=t.activityName})},methods:{handleUpdateForm(){let e=l().token,o="https://cis-4339.herokuapp.com/instructorSideData/activities";r.put(`${o}/${this.$route.params.id}`,this.activity,{headers:{token:e}}).then(()=>{alert("Update has been saved."),this.$router.back().catch(i=>{console.log(i)})})}}},$={class:""},b={class:"font-weight-black text-h6"},A=c("br",null,null,-1),C={style:{"text-align":"right"}};function U(n,e,o,i,t,u){const d=_("center");return m(),h("main",$,[a(d,null,{default:s(()=>[a(f,null,{default:s(()=>[c("p",b,"Activity: "+g(t.originalActivityName),1),A,a(k,null,{default:s(()=>[a(N,{cols:"12",md:"6"},{default:s(()=>[a(V,{modelValue:t.activity.activityName,"onUpdate:modelValue":e[0]||(e[0]=p=>t.activity.activityName=p),label:"Activity Name"},null,8,["modelValue"])]),_:1})]),_:1})]),_:1})]),_:1}),c("div",C,[a(y,{style:{"text-align":"center"},onClick:u.handleUpdateForm},{default:s(()=>[x("Update")]),_:1},8,["onClick"])])])}const B=v(S,[["render",U]]);export{B as default};

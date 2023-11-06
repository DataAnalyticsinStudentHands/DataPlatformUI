import{_ as w,u as l,i as f,a as E,L as y,o as d,c as _,g as e,b as o,w as a,al as S,l as c,t as x,h as v,I as g,B as k,v as b,M as D,F as I,x as L,q as N,z as V,af as T}from"./index.ff4761a7.js";import{D as A}from"./datetime.a1e71b77.js";const M={data(){return{experienceData:[],showInactive:!1,selectedExperiences:[],searchQuery:"",hoverId:null}},mounted(){l().startLoading(),this.fetchExperienceData().then(()=>{l().stopLoading()}).catch(()=>{this.handleError(error),l().stopLoading()}),window.scrollTo(0,0),this.$route.params.toastType&&f[this.$route.params.toastType](this.$route.params.toastMessage,{position:this.$route.params.toastPosition,toastClassName:this.$route.params.toastCSS})},methods:{async fetchExperienceData(){try{let s=l().token,u="http://1529618mytest.us.reclaim.cloud/backend/instructorSideData/experiences/";const h=await E.get(u,{headers:{token:s}});this.experienceData=h.data}catch(n){throw this.handleError(n),n}},formatDate(n){return A.fromISO(n).toFormat("MM-dd-yyyy")},editExperience(n){this.$router.push({name:"instructorSpecificExperience",params:{id:n}})},toggleShowInactive(){this.showInactive=!this.showInactive},deactivateExperiences(){let s=l().token;const u={experienceStatus:!1},h=this.selectedExperiences.map(t=>{let r=`http://1529618mytest.us.reclaim.cloud/backend/instructorSideData/experiences/${t}`;return E.put(r,u,{headers:{token:s}})});Promise.all(h).then(()=>{const t=(this.selectedExperiences.length===1?"Experience":"Experiences")+" deactivated!";this.selectedExperiences=[],this.fetchExperienceData(),f.error(t,{position:"top-right",toastClassName:"Toastify__toast--delete"})}).catch(t=>{this.handleError(t)})},activateExperiences(){let s=l().token;const u={experienceStatus:!0},h=this.selectedExperiences.map(t=>{let r=`http://1529618mytest.us.reclaim.cloud/backend/instructorSideData/experiences/${t}`;return E.put(r,u,{headers:{token:s}})});Promise.all(h).then(()=>{const t=(this.selectedExperiences.length===1?"Experience":"Experiences")+" activated!";this.selectedExperiences=[],this.fetchExperienceData(),f.success(t,{position:"top-right",toastClassName:"Toastify__toast--create"})}).catch(t=>{this.handleError(t)})}},computed:{filteredExperienceData(){const n=this.searchQuery.toLowerCase().trim();return this.showInactive?this.experienceData.filter(s=>!s.experienceStatus&&(s.experienceCategory.toLowerCase().includes(n)||s.experienceName.toLowerCase().includes(n))):this.experienceData.filter(s=>s.experienceStatus&&(s.experienceCategory.toLowerCase().includes(n)||s.experienceName.toLowerCase().includes(n)))},loading(){return l().loading}}},B=e("br",null,null,-1),U=e("br",null,null,-1),F={class:"font-weight-black text-h6"},P=e("br",null,null,-1),Q=e("br",null,null,-1),R=e("br",null,null,-1),j=e("br",null,null,-1),q=e("br",null,null,-1),z=e("br",null,null,-1),O={key:0,justify:"center",align:"center"},G={key:1,style:{display:"flex","justify-content":"center"}},H={style:{"max-height":"400px","overflow-y":"auto"}},J=e("thead",null,[e("tr",null,[e("th",{class:"text-left"}),e("th",{class:"text-left"},"Experience Category"),e("th",{class:"text-left"},"Experience Name"),e("th",{class:"text-left"},"Status"),e("th"),e("th")])],-1),K=["onMouseenter"],W={class:"text-left"},X=["value"],Y=["onClick"],Z=["onClick"],$=["onClick"],ee=e("td",null,null,-1),te=e("td",null,null,-1);function se(n,s,u,h,t,r){const m=y("router-link"),C=y("center");return d(),_("main",null,[e("div",null,[o(C,null,{default:a(()=>[B,e("h2",null,[o(m,{to:"/instructorSemesters"},{default:a(()=>[c("Semesters")]),_:1}),c(" | "),o(m,{to:"/instructorExperiences"},{default:a(()=>[c("Experiences")]),_:1}),c(" | "),o(m,{to:"/instructorActivities"},{default:a(()=>[c("Activities")]),_:1})]),U,e("p",F,x(t.showInactive?"Inactive":"Active")+" Experiences ",1),P,o(v,{style:{"text-align":"center","margin-right":"2rem"}},{default:a(()=>[o(m,{to:"/instructorAddExperience"},{default:a(()=>[c("Add New Experience")]),_:1})]),_:1}),o(v,{onClick:r.toggleShowInactive},{default:a(()=>[c(x(t.showInactive?"Show Active Experiences":"Show Inactive Experiences"),1)]),_:1},8,["onClick"]),Q,R,t.selectedExperiences.length>0?(d(),g(v,{key:0,onClick:r.deactivateExperiences,style:{"text-align":"center","margin-right":"2rem"}},{default:a(()=>[c(" Deactivate ")]),_:1},8,["onClick"])):k("",!0),t.selectedExperiences.length>0?(d(),g(v,{key:1,onClick:r.activateExperiences},{default:a(()=>[c(" Activate ")]),_:1},8,["onClick"])):k("",!0),j,q,o(b,{modelValue:t.searchQuery,"onUpdate:modelValue":s[0]||(s[0]=i=>t.searchQuery=i),label:"Search by experience category or name","solo-inverted":"","hide-details":"",outlined:"",dense:""},null,8,["modelValue"]),z]),_:1})]),r.loading?(d(),_("div",O,[o(D,{indeterminate:""})])):(d(),_("div",G,[e("div",H,[o(S,{style:{width:"100%"}},{default:a(()=>[J,e("tbody",null,[(d(!0),_(I,null,L(r.filteredExperienceData,i=>(d(),_("tr",{key:i._id,style:{cursor:"pointer"},class:N({hoverRow:t.hoverId===i._id}),onMouseenter:p=>t.hoverId=i._id,onMouseleave:s[2]||(s[2]=p=>t.hoverId=null)},[e("td",W,[V(e("input",{type:"checkbox","onUpdate:modelValue":s[1]||(s[1]=p=>t.selectedExperiences=p),value:i._id,style:{outline:"2px solid #808080","margin-right":"10px"}},null,8,X),[[T,t.selectedExperiences]])]),e("td",{class:"text-left",onClick:p=>r.editExperience(i._id)},x(i.experienceCategory),9,Y),e("td",{class:"text-left",onClick:p=>r.editExperience(i._id)},x(i.experienceName),9,Z),e("td",{class:"text-left",onClick:p=>r.editExperience(i._id)},x(i.experienceStatus?"Active":"Inactive"),9,$),ee,te],42,K))),128))])]),_:1})])]))])}const ie=w(M,[["render",se]]);export{ie as default};

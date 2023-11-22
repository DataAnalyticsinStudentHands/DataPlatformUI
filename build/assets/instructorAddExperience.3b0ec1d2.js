import{_ as y,u as p,a as x,o as d,c as u,b as t,w as r,d as g,e as b,V,r as k,s as m,v as h,al as C,g as i,F as N,x as S,z as w,af as E,t as A,h as f,l as _}from"./index.b63c9539.js";const D={data(){return{experience:{experienceCategory:"",experienceName:""},activities:[],selectedActivities:[]}},beforeMount(){window.scrollTo(0,0),this.fetchActivityData()},methods:{fetchActivityData(){let e=p().token,n="https://node13835-1529618full3.us.reclaim.cloud/backend/instructorSideData/activities/";x.get(n,{headers:{token:e}}).then(l=>{const s=l.data;this.activities=s.filter(c=>c.activityStatus===!0)}).catch(l=>{this.handleError(l)})},handleSubmitForm(){let e=p().token,n="https://node13835-1529618full3.us.reclaim.cloud/backend/instructorSideData/experiences/";x.post(n,{experienceCategory:this.experience.experienceCategory,experienceName:this.experience.experienceName,activities:this.selectedActivities},{headers:{token:e}}).then(()=>{this.$router.push({name:"instructorExperiences",params:{toastType:"success",toastMessage:"Experience added!",toastPosition:"top-right",toastCSS:"Toastify__toast--create"}})}).catch(l=>{this.handleError(l)})}}},F=i("p",{class:"font-weight-black text-h6"},"New Experience",-1),T=i("thead",null,[i("tr",null,[i("th",{class:"text-left"}),i("th",{class:"text-left"},"Activity Name")])],-1),U={class:"text-left"},B=["value"],L={class:"text-left"};function M(o,e,n,l,s,c){return d(),u("main",null,[t(b,{onSubmit:g(c.handleSubmitForm,["prevent"])},{default:r(()=>[t(V,null,{default:r(()=>[F,t(k,null,{default:r(()=>[t(m,{cols:"12",md:"6"},{default:r(()=>[t(h,{modelValue:s.experience.experienceCategory,"onUpdate:modelValue":e[0]||(e[0]=a=>s.experience.experienceCategory=a),label:"Experience's Category"},null,8,["modelValue"])]),_:1}),t(m,{cols:"12",md:"6"},{default:r(()=>[t(h,{modelValue:s.experience.experienceName,"onUpdate:modelValue":e[1]||(e[1]=a=>s.experience.experienceName=a),label:"Experience's Name"},null,8,["modelValue"])]),_:1})]),_:1}),t(C,{style:{width:"80%"}},{default:r(()=>[T,i("tbody",null,[(d(!0),u(N,null,S(s.activities,a=>(d(),u("tr",{key:a._id},[i("td",U,[w(i("input",{type:"checkbox","onUpdate:modelValue":e[2]||(e[2]=v=>s.selectedActivities=v),value:a._id,style:{outline:"2px solid #808080","margin-right":"10px"}},null,8,B),[[E,s.selectedActivities]])]),i("td",L,A(a.activityName),1)]))),128))])]),_:1}),t(f,{type:"submit"},{default:r(()=>[_("Submit")]),_:1}),t(f,{onClick:e[3]||(e[3]=a=>o.$router.back()),style:{"margin-left":"10px"}},{default:r(()=>[_(" Cancel ")]),_:1})]),_:1})]),_:1},8,["onSubmit"])])}const z=y(D,[["render",M]]);export{z as default};
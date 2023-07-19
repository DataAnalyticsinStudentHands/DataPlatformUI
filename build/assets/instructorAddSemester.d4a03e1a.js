import{_ as V,u as _,a as x,o as m,c as d,b as s,w as o,d as D,e as g,V as b,f,g as u,W as c,U as k,l as r,F as E,r as N,m as y,Q as w,t as p,n as C,j as v,k as M}from"./index.06e63598.js";const U={data(){return{semester:{semesterName:"",semesterStartDate:"",semesterEndDate:""},experiences:[],selectedExperiences:[],errorMessage:""}},beforeMount(){window.scrollTo(0,0),this.fetchExperienceData()},methods:{fetchExperienceData(){let t=_().token,n="https://cis-4339.herokuapp.com/instructorSideData/experiences/";x.get(n,{headers:{token:t}}).then(l=>{const e=l.data;this.experiences=e.filter(i=>i.experienceStatus===!0)}).catch(l=>{console.log(l)})},handleSubmitForm(){if(!this.semester.semesterName||!this.semester.semesterStartDate||!this.semester.semesterEndDate){this.errorMessage="Please fill in all fields.";return}let t=_().token,n="https://cis-4339.herokuapp.com/instructorSideData/semesters/";x.post(n,{semesterName:this.semester.semesterName,semesterStartDate:this.semester.semesterStartDate,semesterEndDate:this.semester.semesterEndDate,experiences:this.selectedExperiences},{headers:{token:t}}).then(()=>{alert("Semester has been successfully added."),this.$router.push("/instructorSemesters")}).catch(l=>{l.response&&l.response.data&&l.response.data.error?this.errorMessage=l.response.data.error:console.log(l)})}}},F=r("p",{class:"font-weight-black text-h6"},"New Semester",-1),B=r("br",null,null,-1),L=r("thead",null,[r("tr",null,[r("th",{class:"text-left"}),r("th",{class:"text-left"},"Experience Code"),r("th",{class:"text-left"},"Experience Name")])],-1),T={class:"text-left"},R=["value"],A={class:"text-left"},j={class:"text-left"},I={key:0,class:"error-message"};function P(h,t,n,l,e,i){return m(),d("main",null,[s(g,{onSubmit:D(i.handleSubmitForm,["prevent"])},{default:o(()=>[s(b,null,{default:o(()=>[F,B,s(f,null,{default:o(()=>[s(u,{cols:"12",md:"6"},{default:o(()=>[s(c,{modelValue:e.semester.semesterName,"onUpdate:modelValue":t[0]||(t[0]=a=>e.semester.semesterName=a),label:"Semester Name"},null,8,["modelValue"])]),_:1})]),_:1}),s(f,null,{default:o(()=>[s(u,{cols:"12",md:"6"},{default:o(()=>[s(c,{type:"date",modelValue:e.semester.semesterStartDate,"onUpdate:modelValue":t[1]||(t[1]=a=>e.semester.semesterStartDate=a),label:"Semester Start Date"},null,8,["modelValue"])]),_:1}),s(u,{cols:"12",md:"6"},{default:o(()=>[s(c,{type:"date",modelValue:e.semester.semesterEndDate,"onUpdate:modelValue":t[2]||(t[2]=a=>e.semester.semesterEndDate=a),label:"Semester End Date"},null,8,["modelValue"])]),_:1})]),_:1}),s(k,{style:{width:"80%"}},{default:o(()=>[L,r("tbody",null,[(m(!0),d(E,null,N(e.experiences,a=>(m(),d("tr",{key:a._id},[r("td",T,[y(r("input",{type:"checkbox","onUpdate:modelValue":t[3]||(t[3]=S=>e.selectedExperiences=S),value:a._id,style:{outline:"2px solid #808080","margin-right":"10px"}},null,8,R),[[w,e.selectedExperiences]])]),r("td",A,p(a.experienceCode),1),r("td",j,p(a.experienceName),1)]))),128))])]),_:1}),e.errorMessage?(m(),d("div",I,p(e.errorMessage),1)):C("",!0),s(v,{style:{"text-align":"center"},onClick:i.handleSubmitForm},{default:o(()=>[M("Submit")]),_:1},8,["onClick"])]),_:1})]),_:1},8,["onSubmit"])])}const W=V(U,[["render",P]]);export{W as default};
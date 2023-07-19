import{_ as g,u as c,a as m,o as u,c as h,b as l,w as o,V,l as s,t as p,f,g as x,W as S,U as k,F as E,r as N,m as b,Q as y,j as U,k as w}from"./index.06e63598.js";import{D}from"./datetime.a1e71b77.js";const C={props:["id"],data(){return{semester:{originalSemesterName:"",semesterName:"",semesterStartDate:"",semesterEndDate:"",semesterStatus:!1,experiences:[]},selectedExperiences:[]}},beforeMount(){window.scrollTo(0,0),this.fetchExperienceData(),this.fetchSemesterData()},methods:{fetchSemesterData(){let t=c().token,n="https://cis-4339.herokuapp.com/instructorSideData/semesters";m.get(`${n}/${this.$route.params.id}`,{headers:{token:t}}).then(a=>{let e=a.data[0];console.log(a.data[0]),this.semester.originalSemesterName=e.semesterName,this.semester.semesterName=e.semesterName,this.semester.semesterStartDate=D.fromISO(e.semesterStartDate).plus({days:1}).toISODate(),this.semester.semesterEndDate=D.fromISO(e.semesterEndDate).plus({days:1}).toISODate(),this.semester.semesterStatus=e.semesterStatus,this.selectedExperiences=e.experiences}).catch(a=>{console.log(a)})},fetchExperienceData(){let t=c().token,n="https://cis-4339.herokuapp.com/instructorSideData/experiences/";m.get(n,{headers:{token:t}}).then(a=>{this.semester.experiences=a.data.filter(e=>e.experienceStatus===!0)}).catch(a=>{console.log(a)})},handleUpdateForm(){let t=c().token;const n={semesterName:this.semesterName,semesterStartDate:this.semesterStartDate,semesterEndDate:this.semesterEndDate,experiences:this.selectedExperiences};let a="https://cis-4339.herokuapp.com/instructorSideData/semesters";m.get(`${a}/${this.$route.params.id}`,{headers:{token:t}}).then(e=>{let d=e.data[0];this.semester.semesterStatus=d.semesterStatus,m.put(`${a}/${this.$route.params.id}`,n,{headers:{token:t}}).then(()=>{alert("Update has been saved."),this.$router.back().catch(r=>{console.log(r)})})})}}},v={class:""},$={class:"font-weight-black text-h6"},F=s("br",null,null,-1),I=s("thead",null,[s("tr",null,[s("th",{class:"text-left"}),s("th",{class:"text-left"},"Experience Code"),s("th",{class:"text-left"},"Experience Name")])],-1),T={class:"text-left"},B=["value"],O={class:"text-left"},L={class:"text-left"},M={style:{"text-align":"right"}};function R(i,t,n,a,e,d){return u(),h("main",v,[l(V,null,{default:o(()=>[s("p",$,"Semester: "+p(e.semester.originalSemesterName),1),F,l(f,null,{default:o(()=>[l(x,{cols:"12",md:"6"},{default:o(()=>[l(S,{modelValue:e.semester.semesterName,"onUpdate:modelValue":t[0]||(t[0]=r=>e.semester.semesterName=r),label:"Semester Name"},null,8,["modelValue"])]),_:1})]),_:1}),l(f,null,{default:o(()=>[l(x,{cols:"12",md:"6"},{default:o(()=>[l(S,{type:"date",modelValue:e.semester.semesterStartDate,"onUpdate:modelValue":t[1]||(t[1]=r=>e.semester.semesterStartDate=r),label:"Semester Start Date"},null,8,["modelValue"])]),_:1}),l(x,{cols:"12",md:"6"},{default:o(()=>[l(S,{type:"date",modelValue:e.semester.semesterEndDate,"onUpdate:modelValue":t[2]||(t[2]=r=>e.semester.semesterEndDate=r),label:"Semester End Date"},null,8,["modelValue"])]),_:1})]),_:1}),l(k,{style:{width:"80%"}},{default:o(()=>[I,s("tbody",null,[(u(!0),h(E,null,N(e.semester.experiences,r=>(u(),h("tr",{key:r._id},[s("td",T,[b(s("input",{type:"checkbox",value:r._id,"onUpdate:modelValue":t[3]||(t[3]=_=>e.selectedExperiences=_),style:{outline:"2px solid #808080","margin-right":"10px"}},null,8,B),[[y,e.selectedExperiences]])]),s("td",O,p(r.experienceCode),1),s("td",L,p(r.experienceName),1)]))),128))])]),_:1}),s("div",M,[l(U,{style:{"text-align":"center"},onClick:d.handleUpdateForm},{default:o(()=>[w(" Update ")]),_:1},8,["onClick"])])]),_:1})])}const W=g(C,[["render",R]]);export{W as default};
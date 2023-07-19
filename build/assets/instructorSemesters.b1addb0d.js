import{_ as y,u as f,a as p,P as v,o as u,c as g,b as i,w as c,l as e,U as w,k as m,j as _,t as S,M as k,n as x,W as C,F as b,r as T,m as I,Q as V}from"./index.06e63598.js";import{D as N}from"./datetime.a1e71b77.js";const A={data(){return{semesterData:[],showInactive:!1,selectedSemesters:[],searchTerm:""}},mounted(){this.fetchSemesterData(),window.scrollTo(0,0)},methods:{formatDate(l){return N.fromISO(l).plus({days:1}).toFormat("MM-dd-yyyy")},editSemester(l){this.$router.push({name:"instructorSpecificSemester",params:{id:l}})},fetchSemesterData(){let s=f().token,r="https://cis-4339.herokuapp.com/instructorSideData/semesters/";p.get(r,{headers:{token:s}}).then(n=>{this.semesterData=n.data}).catch(n=>{console.log(n)})},toggleShowInactive(){this.showInactive=!this.showInactive},deactivateSemesters(){let s=f().token;const r={semesterStatus:!1},n=this.selectedSemesters.map(t=>{let a=`https://cis-4339.herokuapp.com/instructorSideData/semesters/${t}`;return p.put(a,r,{headers:{token:s}})});Promise.all(n).then(()=>{this.selectedSemesters=[],this.fetchSemesterData(),alert("The semester(s) have been deactivated."),this.$router.push("/instructorSemesters")}).catch(t=>{console.log(t)})},activateSemesters(){let s=f().token;const r={semesterStatus:!0},n=this.selectedSemesters.map(t=>{let a=`https://cis-4339.herokuapp.com/instructorSideData/semesters/${t}`;return p.put(a,r,{headers:{token:s}})});Promise.all(n).then(()=>{this.selectedSemesters=[],this.fetchSemesterData(),alert("The semester(s) have been activated."),this.$router.push("/instructorSemesters")}).catch(t=>{console.log(t)})}},computed:{filteredSemesterData(){const l=this.searchTerm.toLowerCase(),s=this.semesterData.filter(r=>{const n=r.semesterName.toLowerCase(),t=this.formatDate(r.semesterStartDate)+" to "+this.formatDate(r.semesterEndDate);return n.includes(l)||t.includes(l)});return this.showInactive?s.filter(r=>!r.semesterStatus):s.filter(r=>r.semesterStatus)}}},L={class:""},U={style:{"text-align":"center","margin-top":"2rem","margin-bottom":"2rem"}},B=e("p",{class:"font-weight-black text-h6"},"Semesters",-1),E=e("br",null,null,-1),R=e("br",null,null,-1),F=e("br",null,null,-1),M=e("br",null,null,-1),P=e("br",null,null,-1),j={style:{display:"flex","justify-content":"center"}},O={style:{"max-height":"400px","overflow-y":"auto"}},Q=e("thead",null,[e("tr",null,[e("th",{class:"text-left column-margin"}),e("th",{class:"text-left column-margin"},"Semester"),e("th",{class:"text-left column-margin"},"Date Ranges"),e("th",{class:"text-left column-margin"},"Status"),e("th"),e("th")])],-1),W={class:"text-left"},q=["value"],z=["onClick"],G=["onClick"],H=["onClick"],J=e("td",null,null,-1),K=e("td",null,null,-1);function X(l,s,r,n,t,a){const d=v("router-link"),D=v("center");return u(),g("main",L,[i(D,null,{default:c(()=>[e("h2",U,[i(d,{class:"",to:"/instructorSemesters"},{default:c(()=>[m("Semesters")]),_:1}),m(" | "),i(d,{class:"",to:"/instructorExperiences"},{default:c(()=>[m("Experiences")]),_:1}),m(" | "),i(d,{class:"",to:"/instructorActivities"},{default:c(()=>[m("Activities")]),_:1})]),B,E,i(_,{style:{"text-align":"center","margin-right":"2rem"}},{default:c(()=>[i(d,{class:"",to:"/instructorAddSemester"},{default:c(()=>[m("Add New Semester")]),_:1})]),_:1}),i(_,{style:{"text-align":"center"},onClick:a.toggleShowInactive},{default:c(()=>[m(S(t.showInactive?"Show Active Semesters":"Show Inactive Semesters"),1)]),_:1},8,["onClick"]),R,F,t.selectedSemesters.length>0?(u(),k(_,{key:0,style:{"text-align":"center","margin-right":"2rem"},onClick:a.deactivateSemesters},{default:c(()=>[m(" Deactivate ")]),_:1},8,["onClick"])):x("",!0),t.selectedSemesters.length>0?(u(),k(_,{key:1,style:{"text-align":"center"},onClick:a.activateSemesters},{default:c(()=>[m(" Activate ")]),_:1},8,["onClick"])):x("",!0),M,P,i(C,{modelValue:t.searchTerm,"onUpdate:modelValue":s[0]||(s[0]=o=>t.searchTerm=o),placeholder:"Search by semester name or date ranges"},null,8,["modelValue"])]),_:1}),e("div",j,[e("div",O,[i(w,{style:{width:"100%"}},{default:c(()=>[Q,e("tbody",null,[(u(!0),g(b,null,T(a.filteredSemesterData,o=>(u(),g("tr",{key:o._id},[e("td",W,[I(e("input",{type:"checkbox","onUpdate:modelValue":s[1]||(s[1]=h=>t.selectedSemesters=h),value:o._id,style:{outline:"2px solid #808080","margin-right":"10px"}},null,8,q),[[V,t.selectedSemesters]])]),e("td",{class:"text-left",onClick:h=>a.editSemester(o._id)},S(o.semesterName),9,z),e("td",{class:"text-left",onClick:h=>a.editSemester(o._id)},S(a.formatDate(o.semesterStartDate)+" to "+a.formatDate(o.semesterEndDate)),9,G),e("td",{class:"text-left",onClick:h=>a.editSemester(o._id)},S(o.semesterStatus?"Active":"Inactive"),9,H),J,K]))),128))])]),_:1})])])])}const $=y(A,[["render",X]]);export{$ as default};
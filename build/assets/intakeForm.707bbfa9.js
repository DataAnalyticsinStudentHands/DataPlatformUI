import{_ as b,u as m,a as g,o as n,c as i,l as t,t as c,d as x,m as y,v as _,F as u,r as h,n as f,p as M}from"./index.06e63598.js";import{u as D,r as a,a as v,e as k,n as w}from"./index.esm.b1d8e672.js";const S={setup(){return{v$:D({$autoDirty:!0})}},mounted(){let o=m().token,d="https://cis-4339.herokuapp.com/eventdata/";this.queryData=[],g.get(d,{headers:{token:o}}).then(e=>{this.queryData=e.data},e=>{e&&this.$router.push("/login")}),window.scrollTo(0,0)},data(){return{el:"#app",client:{birthMonth:"",birthDay:"",daysInMonth:[],selectedYear:"2004"},error:""}},watch:{"client.selectedMonth"(l){const o=new Date(this.client.selectedYear,l,0).getDate();this.client.daysInMonth=Array.from({length:o},(d,e)=>e+1),this.client.selectedDay>o&&(this.client.selectedDay="")}},methods:{getDaysInMonth:function(l){var o={1:31,2:29,3:31,4:30,5:31,6:30,7:31,8:31,9:30,10:31,11:30,12:31};return Array.from({length:o[l]},(d,e)=>e+1)},async handleSubmitForm(){let o=m().token;{let d="https://cis-4339.herokuapp.com/primarydata";g.post(d,this.client,{headers:{token:o}}).then(e=>{e.data.redirectTo&&this.$router.push(e.data.redirectTo)}).catch(e=>{this.error=e.response.data.error,console.log(e)})}}},validations(){return{client:{firstName:{required:a,alpha:v},lastName:{required:a,alpha:v},email:{email:k},birthMonth:{required:a},birthDay:{required:a},birthday:{month:{required:a},day:{required:a}},phoneNumbers:[{primaryPhone:{required:a,numeric:w}}]}}}},N=t("h1",{class:"font-bold text-4xl text-red-700 tracking-widest text-center mt-10"}," Client Intake Form ",-1),F={class:"grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10 px-10"},I={class:"errorMessage bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4",role:"alert"},$={id:"app",class:"px-10 py-20"},V={class:"mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10"},A=t("h2",{class:"text-2xl font-bold"},"Date of Birth",-1),U={class:"flex flex-col"},B=t("label",{for:"selectedMonth"},"Select a month:",-1),L=M('<option value="">--Select Month--</option><option value="1">January</option><option value="2">February</option><option value="3">March</option><option value="4">April</option><option value="5">May</option><option value="6">June</option><option value="7">July</option><option value="8">August</option><option value="9">September</option><option value="10">October</option><option value="11">November</option><option value="12">December</option>',13),q=[L],C={key:0,class:"text-black"},J={class:"flex flex-col"},T=t("label",{for:"selectedDay"},"Select a day:",-1),R=["disabled"],Y=t("option",{value:""},"--Select Day--",-1),j=["value"],E={key:0,class:"text-black"},O=t("div",null,null,-1),P=t("div",{class:"flex justify-between mt-10 mr-20"},[t("button",{class:"bg-red-700 text-white rounded",type:"submit"}," Add Client ")],-1);function z(l,o,d,e,r,p){return n(),i("main",null,[N,t("div",F,[t("div",I,c(r.error),1)]),t("div",$,[t("form",{onSubmit:o[2]||(o[2]=x((...s)=>p.handleSubmitForm&&p.handleSubmitForm(...s),["prevent"]))},[t("div",V,[A,t("div",U,[B,y(t("select",{id:"selectedMonth",class:"w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50","onUpdate:modelValue":o[0]||(o[0]=s=>r.client.selectedMonth=s)},q,512),[[_,r.client.selectedMonth]]),e.v$.client.firstName.$error?(n(),i("span",C,[(n(!0),i(u,null,h(e.v$.client.firstName.$errors,s=>(n(),i("p",{class:"text-red-700",key:s.$uid},c(s.$message)+"! ",1))),128))])):f("",!0)]),t("div",J,[T,y(t("select",{id:"selectedDay",class:"w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50","onUpdate:modelValue":o[1]||(o[1]=s=>r.client.selectedDay=s),disabled:!r.client.selectedMonth},[Y,(n(!0),i(u,null,h(r.client.daysInMonth,s=>(n(),i("option",{key:s,value:s},c(s),9,j))),128))],8,R),[[_,r.client.selectedDay]]),e.v$.client.firstName.$error?(n(),i("span",E,[(n(!0),i(u,null,h(e.v$.client.firstName.$errors,s=>(n(),i("p",{class:"text-red-700",key:s.$uid},c(s.$message)+"! ",1))),128))])):f("",!0)]),O,P])],32)])])}const K=b(S,[["render",z]]);export{K as default};

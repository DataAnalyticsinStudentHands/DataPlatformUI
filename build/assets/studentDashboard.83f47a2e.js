import{_ as h,u as m,a as c,o as r,c as l,l as t,t as s,F as _,r as p}from"./index.06e63598.js";import{D as f}from"./datetime.a1e71b77.js";const g={data(){return{queryData:[],firstName:"",lastName:""}},mounted(){let d=m().token,n="https://cis-4339.herokuapp.com/userdata/user";c.get(n,{headers:{token:d}}).then(e=>{this.firstName=e.data.user.firstName,this.lastName=e.data.user.lastName},e=>{e&&this.$router.push("/login")});let i="https://cis-4339.herokuapp.com/dashboarddata/recentEvent/";this.queryData=[],c.get(i,{headers:{token:localStorage.getItem("token")}}).then(e=>{this.queryData=e.data})},methods:{routePush(a){this.$router.push({name:a})},formattedDate(a){return f.fromISO(a).plus({days:1}).toLocaleString()}}},x={class:"font-bold text-4xl text-red-700 tracking-widest text-center mt-10"},y=t("br",null,null,-1),k={class:"grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10"},D=t("div",{class:"ml-10"},null,-1),N={class:"flex flex-col col-span-2"},b={class:"min-w-full shadow-md rounded"},S=t("thead",{class:"bg-gray-50 text-xl"},[t("tr",null,[t("th",{class:"p-4 text-left"},"Experiences"),t("th",{class:"p-4 text-left"},"Completion of Goal Setting Form")])],-1),v={class:"divide-y divide-gray-300"},q={class:"p-2 text-left"},L={class:"p-2 text-left"},w={class:"p-2 text-left"};function B(a,d,n,i,e,u){return r(),l("main",null,[t("div",null,[t("h1",x," Welcome "+s(e.firstName)+" "+s(e.lastName)+" "+s(this.role)+" "+s(a.res),1),y,t("div",k,[D,t("div",N,[t("table",b,[S,t("tbody",v,[(r(!0),l(_,null,p(e.queryData,o=>(r(),l("tr",{key:o._id},[t("td",q,s(o.eventName),1),t("td",L,s(u.formattedDate(o.date)),1),t("td",w,s(o.attendees),1)]))),128))])])])])])])}const I=h(g,[["render",B]]);export{I as default};
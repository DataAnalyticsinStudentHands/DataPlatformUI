import{_,u as h,a as c,o as l,c as d,g as t,t as s,F as m,x as f}from"./index.19bf4f6c.js";import{D as p}from"./datetime.a1e71b77.js";const g={data(){return{queryData:[],firstName:"",lastName:""}},mounted(){let o=h().token,n={BASE_URL:"/platform/",MODE:"production",DEV:!1,PROD:!0}.VITE_ROOT_API+"/userdata/user";c.get(n,{headers:{token:o}}).then(e=>{this.firstName=e.data.user.firstName,this.lastName=e.data.user.lastName},e=>{e&&this.$router.push("/login")});let i={BASE_URL:"/platform/",MODE:"production",DEV:!1,PROD:!0}.VITE_ROOT_API+"/dashboarddata/recentEvent/";this.queryData=[],c.get(i,{headers:{token:o}}).then(e=>{this.queryData=e.data})},methods:{routePush(a){this.$router.push({name:a})},formattedDate(a){return p.fromISO(a).plus({days:1}).toLocaleString()}}},x={class:"font-bold text-4xl text-red-700 tracking-widest text-center mt-10"},D=t("br",null,null,-1),y={class:"grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10"},E=t("div",{class:"ml-10"},null,-1),N={class:"flex flex-col col-span-2"},O={class:"min-w-full shadow-md rounded"},b=t("thead",{class:"bg-gray-50 text-xl"},[t("tr",null,[t("th",{class:"p-4 text-left"},"Event Name"),t("th",{class:"p-4 text-left"},"Event Date"),t("th",{class:"p-4 text-left"},"Attendees Amount")])],-1),v={class:"divide-y divide-gray-300"},R={class:"p-2 text-left"},k={class:"p-2 text-left"},A={class:"p-2 text-left"};function I(a,o,n,i,e,u){return l(),d("main",null,[t("div",null,[t("h1",x," Welcome "+s(e.firstName)+" "+s(e.lastName)+" "+s(this.role)+" "+s(a.res),1),D,t("div",y,[E,t("div",N,[t("table",O,[b,t("tbody",v,[(l(!0),d(m,null,f(e.queryData,r=>(l(),d("tr",{key:r._id},[t("td",R,s(r.eventName),1),t("td",k,s(u.formattedDate(r.date)),1),t("td",A,s(r.attendees),1)]))),128))])])])])])])}const B=_(g,[["render",I]]);export{B as default};

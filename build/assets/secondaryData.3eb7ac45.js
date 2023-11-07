import{_ as u,a as c,o as p,c as g,g as s,t as f,d as _,z as i,X as l}from"./index.19bf4f6c.js";const m={setup(){},mounted(){const e=window.location.pathname.split("/")[2];this.client.primaryDataID=e;let r={BASE_URL:"/platform/",MODE:"production",DEV:!1,PROD:!0}.VITE_ROOT_API+"/primarydata/";this.queryData=[],c.get(r,{headers:{token:localStorage.getItem("token")}}).then(n=>{this.queryData=n.data},n=>{n&&this.$router.push("/login")}),window.scrollTo(0,0)},created(){localStorage.getItem("token")===null&&this.$router.push("/login")},data(){return{client:{primaryDataID:null,address:{line1:"",line2:"",city:"",county:"",zip:""}},error:""}},methods:{async handleSubmitForm(){{let d={BASE_URL:"/platform/",MODE:"production",DEV:!1,PROD:!0}.VITE_ROOT_API+"/secondarydata/address";c.post(d,this.client,{headers:{token:localStorage.getItem("token")}}).then(()=>{alert("Client has been succesfully added."),this.$router.push("/findclient"),this.client={address:{line1:"",line2:"",city:"",county:"",zip:""}}}).catch(e=>{this.error=e})}}}},h=s("h1",{class:"font-bold text-4xl text-red-700 tracking-widest text-center mt-10"}," Client Intake Form ",-1),y={class:"grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10 px-10"},x={class:"errorMessage bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4",role:"alert"},b={class:"px-10 py-20"},w={class:"mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10"},D=s("h2",{class:"text-2xl font-bold"},"Client Address",-1),v={class:"flex flex-col"},k={class:"block"},I=s("span",{class:"text-gray-700"},"Address Line",-1),S={class:"flex flex-col"},V={class:"block"},E=s("span",{class:"text-gray-700"},"Address line 2",-1),U={class:"flex flex-col"},A={class:"block"},O=s("span",{class:"text-gray-700"},"City",-1),R=s("div",null,null,-1),C={class:"flex flex-col"},T={class:"block"},z=s("span",{class:"text-gray-700"},"County",-1),B={class:"flex flex-col"},L={class:"block"},M=s("span",{class:"text-gray-700"},"Zip Code",-1),F=s("div",null,null,-1),P=s("div",{class:"flex justify-between mt-10 mr-20"},[s("button",{class:"bg-red-700 text-white rounded",type:"submit"}," Add Client ")],-1);function q(d,e,r,n,t,a){return p(),g("main",null,[h,s("div",y,[s("div",x,f(t.error),1)]),s("div",b,[s("form",{onSubmit:e[5]||(e[5]=_((...o)=>a.handleSubmitForm&&a.handleSubmitForm(...o),["prevent"]))},[s("div",w,[D,s("div",v,[s("label",k,[I,i(s("input",{type:"text",class:"w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50","onUpdate:modelValue":e[0]||(e[0]=o=>t.client.address.line1=o)},null,512),[[l,t.client.address.line1]])])]),s("div",S,[s("label",V,[E,i(s("input",{type:"text",class:"w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50","onUpdate:modelValue":e[1]||(e[1]=o=>t.client.address.line2=o)},null,512),[[l,t.client.address.line2]])])]),s("div",U,[s("label",A,[O,i(s("input",{type:"text",class:"w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50","onUpdate:modelValue":e[2]||(e[2]=o=>t.client.address.city=o)},null,512),[[l,t.client.address.city]])])]),R,s("div",C,[s("label",T,[z,i(s("input",{type:"text",class:"w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50","onUpdate:modelValue":e[3]||(e[3]=o=>t.client.address.county=o)},null,512),[[l,t.client.address.county]])])]),s("div",B,[s("label",L,[M,i(s("input",{type:"text",class:"w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50","onUpdate:modelValue":e[4]||(e[4]=o=>t.client.address.zip=o)},null,512),[[l,t.client.address.zip]])])]),F,P])],32)])])}const N=u(m,[["render",q]]);export{N as default};

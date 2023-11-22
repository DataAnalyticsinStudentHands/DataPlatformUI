import{u as p,r as h,m as w}from"./index.esm.24afc402.js";import{_ as f,a as m,o as i,c as d,g as s,d as y,z as n,X as l,F as P,x as _,B as b,t as c}from"./index.b63c9539.js";const v={name:"VerifyAccount",created(){localStorage.getItem("token")===null&&this.$router.push("/login")},setup(){return{v$:p({$autoDirty:!0})}},mounted(){let a="https://node13835-1529618full3.us.reclaim.cloud/backend/eventdata/";this.queryData=[],m.get(a,{headers:{token:localStorage.getItem("token")}}).then(e=>{this.queryData=e.data},e=>{e&&this.$router.push("/login")}),window.scrollTo(0,0)},data(){return{isConfirmPasswordValid:!1,code:"",newPassword:"",confirmNewPassword:"",error:"",success:"",loginLink:"",toggle:"hide"}},methods:{chechConfirmPassword(){this.isConfirmPasswordValid=!0,this.newPassword!==this.confirmNewPassword&&(this.error="Passwords do not match.",this.isConfirmPasswordValid=!1)},async activateAccount(){const a=await this.v$.$validate();if(this.chechConfirmPassword(),a&&this.isConfirmPasswordValid){let e={code:this.code,newPassword:this.newPassword,error:this.error},u="https://node13835-1529618full3.us.reclaim.cloud/backend/userdata/updatePasswordForm";m.put(u,e,{headers:{token:localStorage.getItem("token")}}).then(t=>{t.status==200&&(this.success=t.data.error,this.loginLink=" Login",this.error="",this.$router.push({name:"studentDashboard",params:{toastType:"success",toastMessage:"Password successfully reset!",toastPosition:"top-right",toastCSS:"Toastify__toast--create"}}))},t=>{this.error=t.response.data.error,this.success="",toast.error("An error occurred. Please try again later.",{position:"top-right",toastClassName:"Toastify__toast--delete"})})}}},validations(){return{newPassword:{required:h,minLengthValue:w(8)}}}},k={class:""},x={class:"px-10 py-20"},C={class:"p-6 space-y-4 md:space-y-6 sm:p-8"},V={class:"grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10"},T=s("label",{for:"email",class:"block"},"Current Password",-1),N={class:"grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10"},L=s("label",{for:"email",class:"block"},"New Password",-1),S={key:0,class:"text-black"},D={class:"grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10"},A=s("label",{for:"email",class:"block"},"Confirm New Password",-1),U={class:"grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10"},$={class:"errorMessage bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4",role:"alert"},B={id:"myDIV",class:"hide grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10"},F={class:"bg-green-100 border-l-4 border-green-500 text-green-700 p-4",role:"alert"};function I(a,e,u,t,r,g){return i(),d("section",k,[s("div",x,[s("div",C,[s("form",{onSubmit:e[4]||(e[4]=y(()=>{},["prevent"])),class:"space-y-4 md:space-y-6",action:"/login",method:"POST"},[s("div",V,[s("div",null,[T,n(s("input",{"onUpdate:modelValue":e[0]||(e[0]=o=>r.code=o),type:"password",name:"secretToken",id:"secretToken",class:"w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50",placeholder:"\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"},null,512),[[l,r.code]])])]),s("div",N,[s("div",null,[L,n(s("input",{"onUpdate:modelValue":e[1]||(e[1]=o=>r.newPassword=o),type:"password",name:"secretToken",id:"secretToken",class:"w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50",placeholder:"\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"},null,512),[[l,r.newPassword]]),t.v$.newPassword.$error?(i(),d("span",S,[(i(!0),d(P,null,_(t.v$.newPassword.$errors,o=>(i(),d("p",{class:"text-red-700",key:o.$uid},c(o.$message)+"! ",1))),128))])):b("",!0)])]),s("div",D,[s("div",null,[A,n(s("input",{"onUpdate:modelValue":e[2]||(e[2]=o=>r.confirmNewPassword=o),type:"Password",name:"secretToken",id:"secretToken",class:"w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50",placeholder:"\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"},null,512),[[l,r.confirmNewPassword]])])]),s("div",U,[s("div",$,c(r.error),1)]),s("div",B,[s("div",F,c(r.success),1)]),s("button",{onClick:e[3]||(e[3]=(...o)=>g.activateAccount&&g.activateAccount(...o)),type:"submit",class:"bg-red-700 text-white rounded"}," Reset Password ")],32)])])])}const R=f(v,[["render",I]]);export{R as default};
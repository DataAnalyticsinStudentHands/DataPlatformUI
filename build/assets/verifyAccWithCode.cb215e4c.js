import{_ as p,u as y,a as f,i,o as g,I as _,w as s,k as w,b as o,s as l,g as b,t as n,r as u,l as h,S as C,e as V,d as $,v as k,h as x}from"./index.b63c9539.js";const I={name:"VerifyNew",props:["id"],data(){return{code:null,loading:!1,userID:null,rules:[r=>r?!0:this.$t("Code is required.")]}},mounted(){this.$route.params&&this.$route.params.id&&(this.userID=this.$route.params.id)},methods:{formSubmit(){!this.code||this.activateAccount()},async activateAccount(){this.loading=!0;let r={code:this.code,userID:this.userID,error:this.error},a="https://node13835-1529618full3.us.reclaim.cloud/backend/userdata/verify";const e=y();let c=e.token;try{const t=await f.put(a,r,{headers:{token:c}});t.status===200?(await e.verifyExistingAcc(t.data),e.isLoggedIn=!0,e.role==="Instructor"?this.$router.push("/instructorDash"):e.role==="Student"?(await e.checkFormCompletion(),e.hasCompletedEntryForm?this.$router.push("/studentDashboard"):this.$router.push("/studentEntryForm")):this.$router.push("/")):i.error(this.$t("An error occurred. Please try again."),{position:"top-right",toastClassName:"Toastify__toast--delete"})}catch(t){if(console.log("err: ",t),t.response&&t.response.status===401)if(t.response.data.title==="Expired code")try{await this.sendNewCode(),i.error(this.$t("Your code has already expired. A new code has been sent! Please wait for email."),{position:"top-right",toastClassName:"Toastify__toast--delete",autoClose:!1})}catch(d){this.handleError(d)}else t.response.data.title==="Invalid code"&&i.error(this.$t("Invalid code."),{position:"top-right",toastClassName:"Toastify__toast--delete"});else console.log(t),i.error(this.$t("An error has occured. Please try again."),{position:"top-right",toastClassName:"Toastify__toast--delete"})}finally{this.loading=!1}},async sendNewCode(){let r={userID:this.userID,error:this.error},a="https://node13835-1529618full3.us.reclaim.cloud/backend/userdata/sendNewCode";f.put(a,r).then(e=>{e.status==200?e.data.userID:console.log("Unexpected response status:",e.status)}).catch(e=>{console.log(e)})}}},N={class:"font-bold text-2xl text-red-800 tracking-widest"};function v(r,a,e,c,t,d){return g(),_(w,null,{default:s(()=>[o(u,null,{default:s(()=>[o(l,{cols:"12",class:"pb-0"},{default:s(()=>[b("h2",N,n(r.$t("Please Verify Your Email")),1)]),_:1})]),_:1}),o(u,null,{default:s(()=>[o(l,{cols:"12"},{default:s(()=>[h(n(r.$t("Please check your email for a confirmation code to verify your email address. This may take a few minutes.")),1)]),_:1})]),_:1}),o(u,{justify:"center"},{default:s(()=>[o(l,{cols:"12",md:"8"},{default:s(()=>[o(C,null,{default:s(()=>[o(V,{ref:"form","validate-on":"submit lazy",onSubmit:$(d.formSubmit,["prevent"])},{default:s(()=>[o(k,{modelValue:t.code,"onUpdate:modelValue":a[0]||(a[0]=m=>t.code=m),rules:t.rules,label:r.$t("Confirmation Code:"),class:"mx-auto",style:{width:"100%"}},null,8,["modelValue","rules","label"]),o(u,{justify:"center"},{default:s(()=>[o(l,{cols:"6"},{default:s(()=>[o(x,{loading:t.loading,type:"submit",block:"",class:"mt-3 bg-red-700 text-white rounded"},{default:s(()=>[h(n(r.$t("Submit")),1)]),_:1},8,["loading"])]),_:1})]),_:1})]),_:1},8,["onSubmit"])]),_:1})]),_:1})]),_:1})]),_:1})}const S=p(I,[["render",v]]);export{S as default};
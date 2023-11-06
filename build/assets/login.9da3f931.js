import{_ as f,u as g,i as p,a as $,o as C,c as w,b as s,w as o,k as y,g as n,t as i,e as b,v as h,r as u,s as d,h as V,l as v}from"./index.ff4761a7.js";const _={name:"LoginForm",props:["tab"],data(){return{email:"",password:"",error:"",loading:!1,emailRules:[e=>{if(e){if(!/.+@.+/.test(e))return this.$t("Email must be valid")}else return this.$t("Email is required");return!0}],requiredRule:[e=>!!e||this.$t("This field is required")]}},setup(){return{store:g()}},mounted(){this.$route.params.toastType&&p[this.$route.params.toastType](this.$route.params.toastMessage,{position:this.$route.params.toastPosition,toastClassName:this.$route.params.toastCSS})},methods:{async login(){if(await this.$refs.loginForm.validate(),!(this.$refs.loginForm.errors.length>0)){this.loading=!0;try{const t=await this.store.login(this.email,this.password);t&&t.toast&&p[t.type](this.$t(t.message),{position:"top-right",toastClassName:"Toastify__toast--delete",limit:2,multiple:!1}),this.store.role==="Instructor"?this.$router.push("/instructorDash"):this.store.role==="Student"?(await this.store.checkFormCompletion(),this.store.hasCompletedEntryForm?this.$router.push("/studentDashboard"):this.$router.push("/studentEntryForm")):this.$router.push("/"),this.store.unverified===!0&&this.sendNewCode()}catch(t){this.handleError(t)}finally{this.loading=!1}}},async sendNewCode(){let e={email:this.email,error:this.error},t="http://1529618mytest.us.reclaim.cloud/backend/userdata/sendNewCode";$.put(t,e).then(a=>{if(a.status==200){let m=a.data.userID;this.$router.push({name:"verifyAccWithCode",params:{id:m}})}else console.log("Unexpected response status:",a.status)}).catch(a=>{console.log(a)})}}},k={class:"font-bold text-2xl text-red-800 tracking-widest text-center mt-3 mb-5"};function x(e,t,a,m,r,c){return C(),w("div",null,[s(y,null,{default:o(()=>[n("h2",k,i(e.$t("Welcome to Engaged Data")),1),s(b,{ref:"loginForm"},{default:o(()=>[s(h,{label:e.$t("Email:"),modelValue:r.email,"onUpdate:modelValue":t[0]||(t[0]=l=>r.email=l),rules:r.emailRules,required:"","prepend-icon":"mdi-email"},null,8,["label","modelValue","rules"]),s(h,{label:e.$t("Password:"),type:"password",modelValue:r.password,"onUpdate:modelValue":t[1]||(t[1]=l=>r.password=l),rules:r.requiredRule,required:"","prepend-icon":"mdi-lock"},null,8,["label","modelValue","rules"])]),_:1},512),s(u,null,{default:o(()=>[s(d,{cols:"12",class:"pl-0 pt-6"},{default:o(()=>[n("span",{class:"font-semibold text-base text-red-800 cursor-pointer no-select",onClick:t[2]||(t[2]=l=>e.$emit("navigateTo","/passResetRequest"))},i(e.$t("Forgot Your Password?")),1)]),_:1})]),_:1}),s(u,{class:"mt-0"},{default:o(()=>[s(d,{cols:"12",class:"pl-0"},{default:o(()=>[n("span",{class:"font-bold text-base text-red-800 cursor-pointer no-select",onClick:t[3]||(t[3]=l=>e.$emit("navigateTo","/verifyAccWithEmailCode"))},i(e.$t("Have a Confirmation Code?")),1)]),_:1})]),_:1}),s(u,{justify:"center"},{default:o(()=>[s(d,{cols:"8"},{default:o(()=>[s(V,{loading:r.loading,block:"",class:"mt-3 bg-red-700 text-white rounded",onClick:c.login},{default:o(()=>[v(i(e.$t("Login")),1)]),_:1},8,["loading","onClick"])]),_:1})]),_:1})]),_:1})])}const F=f(_,[["render",x]]);export{F as default};

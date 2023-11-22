import{_ as x,u as _,a as p,o as n,c as i,g as e,d as k,z as d,X as c,F as m,x as v,B as y,af as g,t as f}from"./index.b63c9539.js";import{u as w,r as b}from"./index.esm.24afc402.js";import{D as S}from"./datetime.a1e71b77.js";const N={props:["id"],setup(){return{v$:w({$autoDirty:!0})}},data(){return{attendeeIDs:[],attendeeData:[],checkedServices:[],event:{eventName:"",services:[],date:"",address:{line1:"",line2:"",city:"",county:"",zip:""},description:""}}},beforeMount(){let t=_().token,u="https://node13835-1529618full3.us.reclaim.cloud/backend/userdata/user";p.get(u+`/eventdata/id/${this.$route.params.id}`,{headers:{token:t}}).then(l=>{let o=l.data[0];this.event.eventName=o.eventName,this.event.date=S.fromISO(o.date).plus({days:1}).toISODate(),this.event.description=o.description,this.checkedServices=o.services,this.event.address=o.address,this.attendeeIDs=o.attendees;for(let r=0;r<this.attendeeIDs.length;r++)p.get(u+`/primarydata/id/${this.attendeeIDs[r]}`,{headers:{token:t}}).then(s=>{let h=s.data[0];this.attendeeData.push({attendeeID:this.attendeeIDs[r],attendeeFirstName:h.firstName,attendeeLastName:h.lastName,attendeeCity:h.address.city,attendeePhoneNumber:h.phoneNumbers[0].primaryPhone})})})},methods:{handleEventUpdate(){let t=_().token,u="https://node13835-1529618full3.us.reclaim.cloud/backend/userdata/user";this.event.services=this.checkedServices,p.put(u+`/eventdata/${this.id}`,this.event,{headers:{token:t}}).then(()=>{alert("Update has been saved."),this.$router.back().catch(l=>{this.handleError(l)})})},editClient(a){this.$router.push({name:"updateclient",params:{id:a}})}},validations(){return{event:{eventName:{required:b},date:{required:b}}}}},D=e("div",null,[e("h1",{class:"font-bold text-4xl text-red-700 tracking-widest text-center mt-10"},"Update Event")],-1),E={class:"px-10 py-20"},U={class:"grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10"},C=e("h2",{class:"text-2xl font-bold"},"Event Details",-1),V={class:"flex flex-col"},I={class:"block"},F=e("span",{class:"text-gray-700"},"Event Name",-1),L=e("span",{style:{color:"#ff0000"}},"*",-1),A={key:0,class:"text-black"},P={class:"flex flex-col"},z={class:"block"},B=e("span",{class:"text-gray-700"},"Date",-1),M=e("span",{style:{color:"#ff0000"}},"*",-1),O={key:0,class:"text-black"},j=e("div",null,null,-1),T=e("div",null,null,-1),Y=e("div",{class:"flex flex-col"},[e("label",{class:"block"},[e("span",{class:"text-gray-700"},"Description"),e("textarea",{class:"mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50",rows:"2"})])],-1),q=e("div",null,null,-1),G=e("div",null,null,-1),X=e("div",null,null,-1),Z={class:"flex flex-col grid-cols-3"},H=e("label",null,"Services Offered at Event",-1),J={for:"familySupport",class:"inline-flex items-center"},K=e("span",{class:"ml-2"},"Family Support",-1),Q={for:"adultEducation",class:"inline-flex items-center"},R=e("span",{class:"ml-2"},"Adult Education",-1),W={for:"youthServices",class:"inline-flex items-center"},$=e("span",{class:"ml-2"},"Youth Services Program",-1),ee={for:"childhoodEducation",class:"inline-flex items-center"},se=e("span",{class:"ml-2"},"Early Childhood Education",-1),te={class:"mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10"},oe=e("h2",{class:"text-2xl font-bold"},"Address",-1),de={class:"flex flex-col"},ne={class:"block"},ie=e("span",{class:"text-gray-700"},"Address Line 1",-1),le={class:"flex flex-col"},re={class:"block"},ae=e("span",{class:"text-gray-700"},"Address Line 2",-1),ce={class:"flex flex-col"},ue={class:"block"},he=e("span",{class:"text-gray-700"},"City",-1),fe=e("div",null,null,-1),ge={class:"flex flex-col"},pe={class:"block"},me=e("span",{class:"text-gray-700"},"County",-1),ve={class:"flex flex-col"},_e={class:"block"},ye=e("span",{class:"text-gray-700"},"Zip Code",-1),be={class:"grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10"},xe={class:"flex justify-between mt-10 mr-20"},ke={class:"flex justify-between mt-10 mr-20"},we=e("hr",{class:"mt-10 mb-10"},null,-1),Se={class:"grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10"},Ne=e("div",null,[e("h2",{class:"text-2xl font-bold"},"List of Attendees"),e("h3",{class:"italic"},"Click table row to edit/display an entry")],-1),De={class:"flex flex-col col-span-2"},Ee={class:"min-w-full shadow-md rounded"},Ue=e("thead",{class:"bg-gray-50 text-xl"},[e("tr",null,[e("th",{class:"p-4 text-left"},"Name"),e("th",{class:"p-4 text-left"},"City"),e("th",{class:"p-4 text-left"},"Phone Number")])],-1),Ce={class:"divide-y divide-gray-300"},Ve=["onClick"],Ie={class:"p-2 text-left"},Fe={class:"p-2 text-left"},Le={class:"p-2 text-left"};function Ae(a,t,u,l,o,r){return n(),i("main",null,[D,e("div",E,[e("form",{onSubmit:t[13]||(t[13]=k((...s)=>a.handleSubmitForm&&a.handleSubmitForm(...s),["prevent"]))},[e("div",U,[C,e("div",V,[e("label",I,[F,L,d(e("input",{type:"text",class:"w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50","onUpdate:modelValue":t[0]||(t[0]=s=>o.event.eventName=s)},null,512),[[c,o.event.eventName]]),l.v$.event.eventName.$error?(n(),i("span",A,[(n(!0),i(m,null,v(l.v$.event.eventName.$errors,s=>(n(),i("p",{class:"text-red-700",key:s.$uid},f(s.$message)+"!",1))),128))])):y("",!0)])]),e("div",P,[e("label",z,[B,M,d(e("input",{class:"w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50","onUpdate:modelValue":t[1]||(t[1]=s=>o.event.date=s),type:"date"},null,512),[[c,o.event.date]]),l.v$.event.date.$error?(n(),i("span",O,[(n(!0),i(m,null,v(l.v$.event.date.$errors,s=>(n(),i("p",{class:"text-red-700",key:s.$uid},f(s.$message)+"!",1))),128))])):y("",!0)])]),j,T,Y,q,G,X,e("div",Z,[H,e("div",null,[e("label",J,[d(e("input",{type:"checkbox",id:"familySupport",value:"Family Support","onUpdate:modelValue":t[2]||(t[2]=s=>o.checkedServices=s),class:"rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-offset-0 focus:ring-indigo-200 focus:ring-opacity-50",notchecked:""},null,512),[[g,o.checkedServices]]),K])]),e("div",null,[e("label",Q,[d(e("input",{type:"checkbox",id:"adultEducation",value:"Adult Education","onUpdate:modelValue":t[3]||(t[3]=s=>o.checkedServices=s),class:"rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-offset-0 focus:ring-indigo-200 focus:ring-opacity-50",notchecked:""},null,512),[[g,o.checkedServices]]),R])]),e("div",null,[e("label",W,[d(e("input",{type:"checkbox",id:"youthServices",value:"Youth Services Program","onUpdate:modelValue":t[4]||(t[4]=s=>o.checkedServices=s),class:"rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-offset-0 focus:ring-indigo-200 focus:ring-opacity-50",notchecked:""},null,512),[[g,o.checkedServices]]),$])]),e("div",null,[e("label",ee,[d(e("input",{type:"checkbox",id:"childhoodEducation",value:"Early Childhood Education","onUpdate:modelValue":t[5]||(t[5]=s=>o.checkedServices=s),class:"rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-offset-0 focus:ring-indigo-200 focus:ring-opacity-50",notchecked:""},null,512),[[g,o.checkedServices]]),se])])])]),e("div",te,[oe,e("div",de,[e("label",ne,[ie,d(e("input",{type:"text",class:"w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50",placeholder:"","onUpdate:modelValue":t[6]||(t[6]=s=>o.event.address.line1=s)},null,512),[[c,o.event.address.line1]])])]),e("div",le,[e("label",re,[ae,d(e("input",{type:"text",class:"w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50",placeholder:"","onUpdate:modelValue":t[7]||(t[7]=s=>o.event.address.line2=s)},null,512),[[c,o.event.address.line2]])])]),e("div",ce,[e("label",ue,[he,d(e("input",{type:"text",class:"w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50",placeholder:"","onUpdate:modelValue":t[8]||(t[8]=s=>o.event.address.city=s)},null,512),[[c,o.event.address.city]])])]),fe,e("div",ge,[e("label",pe,[me,d(e("input",{type:"text",class:"w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50",placeholder:"","onUpdate:modelValue":t[9]||(t[9]=s=>o.event.address.county=s)},null,512),[[c,o.event.address.county]])])]),e("div",ve,[e("label",_e,[ye,d(e("input",{type:"text",class:"w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50",placeholder:"","onUpdate:modelValue":t[10]||(t[10]=s=>o.event.address.zip=s)},null,512),[[c,o.event.address.zip]])])])]),e("div",be,[e("div",xe,[e("button",{onClick:t[11]||(t[11]=(...s)=>r.handleEventUpdate&&r.handleEventUpdate(...s)),type:"submit",class:"bg-red-700 text-white rounded"},"Update Event")]),e("div",ke,[e("button",{type:"reset",class:"border border-red-700 bg-white text-red-700 rounded",onClick:t[12]||(t[12]=s=>a.$router.go(-1))},"Go back")])]),we,e("div",Se,[Ne,e("div",De,[e("table",Ee,[Ue,e("tbody",Ce,[(n(!0),i(m,null,v(o.attendeeData,s=>(n(),i("tr",{onClick:h=>r.editClient(s.attendeeID),key:s._id},[e("td",Ie,f(s.attendeeFirstName+" "+s.attendeeLastName),1),e("td",Fe,f(s.attendeeCity),1),e("td",Le,f(s.attendeePhoneNumber),1)],8,Ve))),128))])])])])],32)])])}const Me=x(N,[["render",Ae]]);export{Me as default};
import{r as c,j as o,a as t,b as g}from"./index-e4a951c8.js";import{h as P}from"./html2pdf-6f407488.js";const w="https://backend.onrequestlab.com/api/v1/admin/instances/",k=5,U=()=>{const[b,y]=c.useState([]),[i,f]=c.useState([]),[N,_]=c.useState(!1),[d,D]=c.useState(""),[l,S]=c.useState(1),[I,C]=c.useState(0),h=(e=>{const a=`; ${document.cookie}`.split(`; ${e}=`);if(a.length===2)return a.pop().split(";").shift()})("access"),u=async(e=1)=>{_(!0);try{const n=await g.get(`${w}?page=${e}`,{headers:h?{Authorization:`Bearer ${h}`}:{},withCredentials:!0}),a=n.data.results||[],r=n.data.count||a.length;y(a),f(a),C(r),S(e)}catch(n){console.error("Error fetching instances:",n)}finally{_(!1)}};c.useEffect(()=>{u(l)},[]),c.useEffect(()=>{f(b.filter(e=>{var n,a,r;return((n=e.userName)==null?void 0:n.toLowerCase().includes(d.toLowerCase()))||((a=e.instance_type)==null?void 0:a.toLowerCase().includes(d.toLowerCase()))||((r=e.instance_ip)==null?void 0:r.toLowerCase().includes(d.toLowerCase()))}))},[d,b]);const m=Math.ceil(I/k),p=e=>{e<1||e>m||u(e)},L=async e=>{if(window.confirm("Are you sure you want to delete this instance?"))try{await g.delete(`${w}${e}/`,{headers:h?{Authorization:`Bearer ${h}`}:{},withCredentials:!0}),alert("Instance deleted successfully!"),u(l)}catch(n){console.error("Delete failed:",n),alert("Failed to delete instance.")}},x=()=>{let n=["ID","User Name","Instance Type","Instance Size","User ID","IP","Status","Processing","Deleted","Comments","Hours","Rent Date","Timestamp"].join(",")+`
`;i.forEach(s=>{n+=[s.user_instance_id,s.userName,s.instance_type,s.instance_size,s.userId,s.instance_ip,s.status,s.processing_status?"Yes":"No",s.isDeleted?"Yes":"No",s.comments||"-",s.hours,new Date(s.rentDate).toLocaleString(),new Date(s.timestamp).toLocaleString()].join(",")+`
`});const a=new Blob([n],{type:"text/csv"}),r=document.createElement("a");r.href=URL.createObjectURL(a),r.download="LabList.csv",r.click()},$=()=>{const e=document.createElement("table");e.innerHTML=`
      <thead>
        <tr>
          <th>ID</th>
          <th>User Name</th>
          <th>Instance Type</th>
          <th>Instance Size</th>
          <th>User ID</th>
          <th>IP</th>
          <th>Status</th>
          <th>Processing</th>
          <th>Deleted</th>
          <th>Comments</th>
          <th>Hours</th>
          <th>Rent Date</th>
          <th>Timestamp</th>
        </tr>
      </thead>
      <tbody>
        ${i.map(n=>`
          <tr>
            <td>${n.user_instance_id}</td>
            <td>${n.userName}</td>
            <td>${n.instance_type}</td>
            <td>${n.instance_size}</td>
            <td>${n.userId}</td>
            <td>${n.instance_ip}</td>
            <td>${n.status}</td>
            <td>${n.processing_status?"Yes":"No"}</td>
            <td>${n.isDeleted?"Yes":"No"}</td>
            <td>${n.comments||"-"}</td>
            <td>${n.hours}</td>
            <td>${new Date(n.rentDate).toLocaleString()}</td>
            <td>${new Date(n.timestamp).toLocaleString()}</td>
          </tr>`).join("")}
      </tbody>
    `,P().set({margin:10,filename:"LabList.pdf",html2canvas:{scale:2},jsPDF:{unit:"pt",format:"a4",orientation:"landscape"}}).from(e).save()},v=e=>{window.open(e,"_blank")};return o("div",{children:[o("div",{className:"flex flex-wrap justify-between items-center gap-3 mb-4",children:[t("input",{type:"text",placeholder:"Search instances...",className:"form-input py-2 px-3 border rounded",value:d,onChange:e=>D(e.target.value)}),o("div",{className:"flex gap-2",children:[t("button",{className:"btn btn-sm btn-primary",onClick:x,children:"Export CSV"}),t("button",{className:"btn btn-sm btn-primary",onClick:$,children:"Export PDF"})]})]}),t("div",{className:"overflow-x-auto",children:o("table",{className:"table table-striped table-hover w-full",children:[t("thead",{children:o("tr",{children:[t("th",{children:"ID"}),t("th",{children:"User Name"}),t("th",{children:"Instance Type"}),t("th",{children:"Instance Size"}),t("th",{children:"User ID"}),t("th",{children:"IP"}),t("th",{children:"Status"}),t("th",{children:"Processing"}),t("th",{children:"Deleted"}),t("th",{children:"Comments"}),t("th",{children:"Hours"}),t("th",{children:"Rent Date"}),t("th",{children:"Timestamp"}),t("th",{children:"Actions"})]})}),t("tbody",{children:N?t("tr",{children:t("td",{colSpan:14,className:"text-center py-4",children:"Loading..."})}):i.length===0?t("tr",{children:t("td",{colSpan:14,className:"text-center py-4",children:"No records found"})}):i.map(e=>o("tr",{children:[t("td",{children:e.user_instance_id}),t("td",{children:e.userName}),t("td",{children:e.instance_type}),t("td",{children:e.instance_size}),t("td",{children:e.userId}),t("td",{children:e.instance_ip}),t("td",{children:e.status}),t("td",{children:e.processing_status?"Yes":"No"}),t("td",{children:e.isDeleted?"Yes":"No"}),t("td",{children:e.comments||"-"}),t("td",{children:e.hours}),t("td",{children:new Date(e.rentDate).toLocaleString()}),t("td",{children:new Date(e.timestamp).toLocaleString()}),o("td",{className:"flex gap-1 flex-wrap",children:[t("button",{className:"btn btn-sm btn-danger",onClick:()=>L(e.user_instance_id),children:"Delete"}),e.web_ssh_url&&t("button",{className:"btn btn-sm btn-warning",onClick:()=>v(e.web_ssh_url),children:"SSH"})]})]},e.user_instance_id))})]})}),m>1&&o("div",{className:"flex justify-center mt-4 gap-1 flex-wrap",children:[t("button",{className:"btn btn-sm btn-outline-primary",disabled:l===1,onClick:()=>p(l-1),children:"Prev"}),Array.from({length:m},(e,n)=>n+1).map(e=>t("button",{className:`btn btn-sm ${l===e?"btn-primary":"btn-outline-primary"}`,onClick:()=>p(e),children:e},e)),t("button",{className:"btn btn-sm btn-outline-primary",disabled:l===m,onClick:()=>p(l+1),children:"Next"})]})]})};export{U as default};

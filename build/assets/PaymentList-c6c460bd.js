import{r as s,j as d,a as e,b as $}from"./index-e4a951c8.js";import{h as v}from"./html2pdf-6f407488.js";const w="https://backend.onrequestlab.com/api/v1/admin/payments/",A=5,E=()=>{const[p,P]=s.useState([]),[c,b]=s.useState([]),[S,y]=s.useState(!1),[l,x]=s.useState(""),[o,D]=s.useState(1),[C,I]=s.useState(0),h=(t=>{const r=`; ${document.cookie}`.split(`; ${t}=`);if(r.length===2)return r.pop().split(";").shift()})("access"),g=async(t=1)=>{y(!0);try{const a=await $.get(`${w}?page=${t}`,{headers:h?{Authorization:`Bearer ${h}`}:{},withCredentials:!0}),r=a.data.results||[],n=a.data.count||r.length;P(r),b(r),I(n),D(t)}catch(a){console.error("Error fetching payments:",a)}finally{y(!1)}};s.useEffect(()=>{g(o)},[]),s.useEffect(()=>{b(p.filter(t=>(t.order_id||"").toLowerCase().includes(l.toLowerCase())||(t.payment_id||"").toLowerCase().includes(l.toLowerCase())))},[l,p]);const m=Math.ceil(C/A),f=t=>{t<1||t>m||g(t)},L=()=>{const t=[["ID","Order ID","Payment ID","Amount","Status","Refund ID","Refund Status","Created At"],...c.map(n=>[n.id,n.order_id,n.payment_id||"-",n.amount,n.status,n.refund_id||"-",n.refund_status||"-",new Date(n.created_at).toLocaleString()])].map(n=>n.map(i=>`"${i}"`).join(",")).join(`
`),a=new Blob([t],{type:"text/csv"}),r=document.createElement("a");r.href=URL.createObjectURL(a),r.download="Payments_Table.csv",r.click()},N=()=>{const t=document.createElement("table");t.innerHTML=`
      <thead>
        <tr>
          <th>ID</th>
          <th>Order ID</th>
          <th>Payment ID</th>
          <th>Amount</th>
          <th>Status</th>
          <th>Refund ID</th>
          <th>Refund Status</th>
          <th>Created At</th>
        </tr>
      </thead>
      <tbody>
        ${c.map(a=>`
          <tr>
            <td>${a.id}</td>
            <td>${a.order_id}</td>
            <td>${a.payment_id||"-"}</td>
            <td>${a.amount}</td>
            <td>${a.status}</td>
            <td>${a.refund_id||"-"}</td>
            <td>${a.refund_status||"-"}</td>
            <td>${new Date(a.created_at).toLocaleString()}</td>
          </tr>
        `).join("")}
      </tbody>
    `,v().set({margin:10,filename:"Payments_Table.pdf",image:{type:"jpeg",quality:.98},html2canvas:{scale:2},jsPDF:{unit:"pt",format:"a4",orientation:"landscape"}}).from(t).save()},_=async(t,a)=>{try{const n=(await $.get(`${w}${t}/`,{headers:h?{Authorization:`Bearer ${h}`}:{},withCredentials:!0})).data,i=document.createElement("div");if(i.style.padding="20px",i.innerHTML=`
        <h2 style="text-align:center;">Invoice #${n.id}</h2>
        <p><strong>Order ID:</strong> ${n.order_id}</p>
        <p><strong>Payment ID:</strong> ${n.payment_id||"-"}</p>
        <p><strong>Amount:</strong> ${n.amount}</p>
        <p><strong>Status:</strong> ${n.status}</p>
        <p><strong>Refund ID:</strong> ${n.refund_id||"-"}</p>
        <p><strong>Refund Status:</strong> ${n.refund_status||"-"}</p>
        <p><strong>Created At:</strong> ${new Date(n.created_at).toLocaleString()}</p>
      `,a==="print"){const u=window.open("","","width=700,height=700");u.document.write("<html><head><title>Invoice</title></head><body>"+i.innerHTML+"</body></html>"),u.document.close(),u.focus(),u.print()}else v().set({margin:10,filename:`Invoice_${n.id}.pdf`,image:{type:"jpeg",quality:.98},html2canvas:{scale:2},jsPDF:{unit:"pt",format:"a4",orientation:"portrait"}}).from(i).save()}catch(r){console.error("Invoice fetch error:",r)}};return d("div",{children:[d("div",{className:"flex flex-wrap justify-between items-center gap-3 mb-4",children:[e("input",{type:"text",placeholder:"Search payments...",className:"form-input py-2 px-3 border rounded",value:l,onChange:t=>x(t.target.value)}),d("div",{className:"flex gap-2",children:[e("button",{className:"btn btn-sm btn-primary",onClick:L,children:"Export CSV"}),e("button",{className:"btn btn-sm btn-primary",onClick:N,children:"Export PDF"})]})]}),e("div",{className:"overflow-x-auto",children:d("table",{className:"table table-striped table-hover w-full",id:"dataTable",children:[e("thead",{children:d("tr",{children:[e("th",{children:"ID"}),e("th",{children:"Order ID"}),e("th",{children:"Payment ID"}),e("th",{children:"Amount"}),e("th",{children:"Status"}),e("th",{children:"Refund ID"}),e("th",{children:"Refund Status"}),e("th",{children:"Created At"}),e("th",{children:"Actions"})]})}),e("tbody",{children:S?e("tr",{children:e("td",{colSpan:9,className:"text-center py-4",children:"Loading..."})}):c.length===0?e("tr",{children:e("td",{colSpan:9,className:"text-center py-4 text-muted",children:"No records found"})}):c.map(t=>d("tr",{children:[e("td",{children:t.id}),e("td",{children:t.order_id}),e("td",{children:t.payment_id||"-"}),e("td",{children:t.amount}),e("td",{children:t.status}),e("td",{children:t.refund_id||"-"}),e("td",{children:t.refund_status||"-"}),e("td",{children:new Date(t.created_at).toLocaleString()}),d("td",{children:[e("button",{className:"btn btn-sm btn-primary me-1",onClick:()=>_(t.id,"print"),children:"Print"}),e("button",{className:"btn btn-sm btn-success",onClick:()=>_(t.id,"download"),children:"PDF"})]})]},t.id))})]})}),m>1&&d("div",{className:"flex justify-center mt-4 gap-1 flex-wrap",children:[e("button",{className:"btn btn-sm btn-outline-primary",disabled:o===1,onClick:()=>f(o-1),children:"Prev"}),Array.from({length:m},(t,a)=>a+1).map(t=>e("button",{className:`btn btn-sm ${o===t?"btn-primary":"btn-outline-primary"}`,onClick:()=>f(t),children:t},t)),e("button",{className:"btn btn-sm btn-outline-primary",disabled:o===m,onClick:()=>f(o+1),children:"Next"})]})]})};export{E as default};

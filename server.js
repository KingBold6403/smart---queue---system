const express = require('express');
const app = express();
app.use(express.json());

class SmartQueue {
  constructor(){ this.queues=new Map(); }
  createQueue(businessId,service){
    const id=`${businessId}-${Date.now()}`;
    this.queues.set(id,{id,businessId,customers:[],status:'active'});
    return id;
  }
  addCustomer(queueId,data){
    const q=this.queues.get(queueId);
    const ticket={number:`GH-${Date.now().toString().slice(-6)}`,...data,joined:new Date(),wait:q.customers.length*4.5};
    q.customers.push(ticket);
    return ticket;
  }
  next(queueId){ return this.queues.get(queueId).customers.shift(); }
}

app.post('/api/queue',(req,res)=>{
  const qm=new SmartQueue();
  const id=qm.createQueue(req.body.business,req.body.service);
  res.json({queueId:id});
});

app.listen(3000,()=>console.log('Running'));
module.exports=SmartQueue;

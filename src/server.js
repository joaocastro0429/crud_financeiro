import express, { response } from 'express'
import { uuid } from 'uuidv4';
const app=express()

const customer=[]
app.use(express.json())

// middleware

function verrifyAlreadyExists(request,response,next){
    const {cpf}=request.headers
    const index=customer.find(customer=>customer.cpf===cpf)
    if(!index){
        return response.status(404).json({message:"Customer not Founds !"}) 

    }
    request.index=index

    next()



}

app.post("/account",(request,response)=>{
    const {cpf,name}=request.body
    const customerAlreadyExists=customer.some(customer=>customer.cpf===cpf)

    if(customerAlreadyExists){
        return response.status(400).json({message:"Customer already exists"})
    }

    customer.push({
        id:uuid(),
        name,
        cpf,
        statement:[]

    })
    return response.status(201).send()
})


app.get("/account",verrifyAlreadyExists,(request,response)=>{

 const{index}=request
   


    return response.json(index.statement)
})

app.listen(3333)
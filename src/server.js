import express, { response } from 'express'
import { uuid } from 'uuidv4';
const app=express()

const customers=[]
app.use(express.json())

// middleware

function verrifyAlreadyExists(request,response,next){
    const {cpf}=request.headers
    const customer=customers.find(customer=>customer.cpf===cpf)
    if(!customer){
        return response.status(404).json({message:"Customer not Founds !"}) 

    }
    request.customer=customer

    next()



}

function balance(statement){
   const balance= statement.reduce((acc,operation)=>{
        if(operation.type=="credit"){
            return acc+ operation.amount
        }else{
            acc- operation.amount
        }

    },0)
    return balance
}

app.post("/account",(request,response)=>{
    const {cpf,name}=request.body
    const customerAlreadyExists=customers.some(customer=>customer.cpf===cpf)

    if(customerAlreadyExists){
        return response.status(400).json({message:"Customer already exists"})
    }

    customers.push({
        id:uuid(),
        name,
        cpf,
        statement:[]

    })
    return response.status(201).send()
})


app.get("/account",verrifyAlreadyExists,(request,response)=>{

 const{customer}=request

    return response.json(customer.statement)
})

app.post("/deposit",verrifyAlreadyExists,(request,response)=>{


    const {description,amount}=request.body
    
    const {customer}=request

    const statementOperation={
        description,
        amount,
        create_at:new Date(),
        type:'credit'
    }

    customer.statement.push(statementOperation)

    return response.status(201).send()


}) 

app.post("/withdraw",verrifyAlreadyExists,(request,response)=>{
    const {amount}=request.body

    const {customer}=request

    const getbalnce=balance(customer.statement)
    if(getbalnce<amount){
      return response.status(400).json({message:"insufficient funds !"})
    }

    const statementOperation = {
        amount,
        created_at: new Date(),
        type: 'debit'
      };


      customer.statement.push(statementOperation)

      return response.status(201).send()
})

app.listen(3333) 
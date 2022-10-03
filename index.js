import { dataBalance } from "./utils/balance.js";
import { listFilesInFolder, readFile } from "./utils/fileSystem.js";
import { invoicesCheck, invoicesSchemaVerification } from "./utils/invoicesSchemas.js";
import { itemsNumberVerification, ordersSchemaVerification } from "./utils/ordersSchemas.js";

const ordersList = await listFilesInFolder("./Pedidos")
const invoicesList = await listFilesInFolder("./Notas")

const ordersDetails = []
const invoicesDetails = []

for(let i = 0; i<ordersList.length; i++){
    const ordersDataFile = await readFile(`./Pedidos/${ordersList[i]}`)
    
    let itemNumbers = []

    ordersDataFile.forEach((data, index) => {
        try {
            ordersSchemaVerification(data, index)
            
        } catch (error) {
            console.error({message: "error", order: ordersList[i].replace(".txt", ""), ...error}) 
            return           
        }
        
        itemNumbers.push(data["número_item"])
    })
    
    itemsNumberVerification(itemNumbers)

    ordersDetails.push({id_pedido: ordersList[i].replace('.txt', '').replace('P', ''), data: ordersDataFile})
}


for(let i = 0; i<invoicesList.length; i++){
    const invoicesDataFile = await readFile(`./Notas/${invoicesList[i]}`)

    invoicesDataFile.forEach((data, index) => {
        invoicesSchemaVerification(data, index)

        const idOrder = Number(data["id_pedido"])
        const orderSearched = ordersDetails.find(order => Number(order["id_pedido"]) === idOrder)

        if(!orderSearched){
            throw `Order ${idOrder} not found`
        }

        invoicesCheck(data, orderSearched)        
    })
    invoicesDetails.push({invoice: invoicesList[i].replace(".txt", ''), data: invoicesDataFile})
}

// console.log(ordersDetails.length)

for(let i = 0; i<ordersDetails.length; i++){
    let reportData = dataBalance(ordersDetails[i], invoicesDetails)
    reportData["id_pedido"] = ordersDetails[i]["id_pedido"]
    console.log(reportData)
}


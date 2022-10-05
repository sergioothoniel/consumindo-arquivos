function itemsBalanceReport(itemsBalance, order){    
    let missingInvoiceItems = false
    let tooManyItems = false
    let missingItemsList = []
    let tooManyItemsList = []
    let missingItemsTotalValue = 0
    const totalValue = String(orderTotalValueFunction(order).toFixed(2)).replace(".", ",")
   
    for(let key in itemsBalance){        
        if(itemsBalance[key] > 0){
            missingInvoiceItems = true
            missingItemsList.push({"número_item": key, "saldo_quantidade": itemsBalance[key]})

            const unitaryValue = Number(order.data.find(item=>item["número_item"] === Number(key))["valor_unitário_produto"].replace(",", "."))
            missingItemsTotalValue += itemsBalance[key]*unitaryValue
        }

        if(itemsBalance[key] < 0){
            throw `Too many invoices for item number ${key} in order ${order["id_pedido"]}` 
            // tooManyItems = true
            // tooManyItemsList.push({"número_item": key, "quantidade": itemsBalance[key]})
        }
    }

    missingItemsTotalValue = String(missingItemsTotalValue.toFixed(2)).replace(".", ",")

    return {missingInvoiceItems, tooManyItems, missingItemsList, tooManyItemsList, orderTotalValue: totalValue, missingItemsTotalValue}
}



function orderTotalValueFunction(order){
    const totalValue = order.data.reduce((acc, cur) =>{
        const currentItemValue = Number(cur["quantidade_produto"])*Number(cur["valor_unitário_produto"].replace(",", "."))
        return acc+currentItemValue
    }, 0)

    return totalValue
}



export function dataBalance(order, invoicesList){
    const orderId = Number(order["id_pedido"])    
        
    const invoicesFilteredByOrderId = invoicesList.filter(invoice =>{
        for(let i = 0; i<invoice.data.length; i++){
            if(invoice.data[i]["id_pedido"] === orderId){
                return true
            }
        }        
    })

    const invoicesId = invoicesFilteredByOrderId.map(item => item.invoice)
    const invoicesDatas = invoicesFilteredByOrderId.reduce((acc, cur) => acc.concat(cur.data), []).filter(item =>item["id_pedido"] === orderId)
    const itemNumbers = order.data.map(item => item["número_item"])
    let itemsBalanceSumary = {}

    for(let i = 0; i<itemNumbers.length; i++){
        const itemNumber = Number(itemNumbers[i])
        let quantityItems = Number(order.data.find(item => Number(item["número_item"]) === itemNumber)["quantidade_produto"])
        
        for(let j = 0; j<invoicesDatas.length; j++){
            const itemInvoice = invoicesDatas[j]

            if(Number(itemInvoice["número_item"]) === itemNumber){
                let quantityInInvoice = Number(itemInvoice["quantidade_produto"])                
                quantityItems -= quantityInInvoice
            }
        }

        itemsBalanceSumary[itemNumber] ? itemsBalanceSumary[itemNumber] -= quantityItems : itemsBalanceSumary[itemNumber] = quantityItems        
    }

    let summary = itemsBalanceReport(itemsBalanceSumary, order)  
    summary.invoices = invoicesId
    
    return summary
}
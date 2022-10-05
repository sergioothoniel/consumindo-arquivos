import { alfaNumericRegex } from "./regex.js"

export function invoicesSchemaVerification(invoiceData, invoiceRow){
    const invoiceKeysDefault = ["id_pedido", "número_item", "quantidade_produto"]

    for(const key in invoiceData){
        if(!invoiceKeysDefault.includes(key)){
            throw `The order in row ${invoiceRow+1} has the improper key "${key}"`
        }
    }

    let valuesTypes = {row: invoiceRow+1}

    if(!alfaNumericRegex.test(invoiceData["id_pedido"])){
        valuesTypes["id_pedido"] = "Must be an alfanumeric value"
    }

    if(!(Number(invoiceData["número_item"] > 0))){
        valuesTypes["número_item"] = "Must be a number grater than 0"
    }

    if(!(Number(invoiceData["quantidade_produto"] > 0))){
        valuesTypes["quantidade_produto"] = "Must be a number grater than 0"
    }

    if(Object.keys(valuesTypes).length > 1){
        throw valuesTypes
    }
}


export function invoicesCheck(invoiceData, order){
    const itemNumber = Number(invoiceData["número_item"])  
    
    let itemsNumberMatch = 0

    order.data.forEach(orderData => {
        Number(orderData["número_item"]) === itemNumber && itemsNumberMatch++
    })    

    if(!itemsNumberMatch){
        throw `Item number ${itemNumber} does not exist in order ${order["id_pedido"]}`
    }
}
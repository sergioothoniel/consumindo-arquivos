import { alfaNumericRegex } from "./regex.js"

function checkFloatType(value, numberOfDecimals){    
    if(typeof value === 'string'){
        let arrayValue = value.split(',')

        const index1 = Number(arrayValue[0])
        const index2 = arrayValue[1] ? Number(arrayValue[1]) : 100
          
        if(!(index1 >= 0) || !(index2 >= 0)){
            return false
        } 

        if(arrayValue[1].length>numberOfDecimals){
            return false
        }       
    }
    else if(typeof value !== Number){
        return false
    }

    return true    
}


export function ordersSchemaVerification(order, orderRow){    
    const orderKeysDefault = ["número_item", "código_produto", "quantidade_produto", "valor_unitário_produto"]

    for(const key in order){
        if(!orderKeysDefault.includes(key)){
            throw `The order in row ${orderRow+1} has the improper key "${key}"`
        }
    }

    let valuesTypes = {row: orderRow+1}
    

    if(typeof order["número_item"] !== 'number'){                
        valuesTypes["número_item"] = "Must be a number"
    }

    if(!alfaNumericRegex.test(order["código_produto"])){
        valuesTypes["código_produto"] = "Must be an alfanumeric value"
    }

    if(typeof order["quantidade_produto"] !== 'number'){
        valuesTypes["número_item"] = "Must be a number"
    }

    if(!checkFloatType(order["valor_unitário_produto"], 2)){
        valuesTypes["valor_unitário_produto"] = "Must be a maximum 2 decimals float number"
    }

    if(Object.keys(valuesTypes).length > 1){
        throw valuesTypes
    }
    
} 

export function itemsNumberVerification(itemsNumberList){
    const itemNumbersSorted = itemsNumberList.sort((a,b)=>a-b)
    const noRepetitionsItemNumbersList = itemNumbersSorted.filter((item, index) => itemNumbersSorted.indexOf(item) === index)  

    if(itemNumbersSorted.length !== noRepetitionsItemNumbersList.length){
        throw `The order ${ordersList[i].replace('.txt', '')} has items number repeated`
    }

    itemNumbersSorted.forEach((itemNumber, index) => {
        if(itemNumber !== (index+1)){
            throw `Missing item number ${index+1} in order ${ordersList[i].replace('.txt', '')} `
        }
    })
}
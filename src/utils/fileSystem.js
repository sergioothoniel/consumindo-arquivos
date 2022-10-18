import fs from "fs/promises"
import os from "os"

const newLineMetaChar = os.EOL

export async function readFile(path){   
    
    try {

        const data = await fs.readFile(path, "utf8")               
        return data.split(newLineMetaChar).map(item=>item && JSON.parse(item.trim())).filter(item=>!!item)
        
    } catch (error) {
        console.error(error)        
    }     
}


export async function listFilesInFolder(path){

    try {

        const files = await fs.readdir(path, "utf8")
        return files  

    } catch (error) {
        console.error(error)        
    }    
}


export async function writeFile(path, data){
    try {

        await fs.writeFile(path, data)
        console.log(`File ${path} created!`)
        
    } catch (error) {
        console.error(error)        
    }
}


export function jsonObjectToTextFunction(data){
    let textResult = ""
    
    data.forEach(object =>{
        textResult += JSON.stringify(object)+"\n"
    })

    return textResult
}
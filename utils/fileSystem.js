import fs from "fs/promises"

export async function readFile(path){   
    
    try {

        const data = await fs.readFile(path, "utf8")               
        return data.split("\r\n").map(item=>item && JSON.parse(item.trim())).filter(item=>!!item)
        
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
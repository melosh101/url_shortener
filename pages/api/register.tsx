import { NextApiRequest, NextApiResponse } from "next";
import {PrismaClient } from "@prisma/client" 
import {nanoid} from "nanoid";

const prisma = new PrismaClient();


export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    if(req.method != "POST") {
        return res.status(406).send("Method not allowed")
    }

    console.log(req.body)
    var {name, url, random} = req.body;


    if(typeof url != "string") 
        return res.status(406).send("url not string but is a " + typeof url);

    if(typeof name != "string") 
        return res.status(406).end();
    
    if(typeof random != "boolean") 
        return res.status(406).end();

    const Name = await prisma.url.findFirst({where: { id: name}})

    if(Name) 
        return res.status(200).json({status: "name taken", code: 3, url: url, name: name})

    if(random === true) {
        name = nanoid(5)
    }

    if(!validURL(url)) {
        return res.status(200).json({status: "invalid url", code: 4, url: url, name: name})
    }
    
    await prisma.url.create({data: {id: name, url: url}})
    return res.status(200).json({status: "success", code: 1, url: url, name: name, query: req.query})
}

function validURL(str): boolean {
    var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
      '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return !!pattern.test(str);
  }
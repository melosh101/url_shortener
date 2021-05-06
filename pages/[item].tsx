import {useRouter} from "next/router"
import { PrismaClient } from "@prisma/client"
import { useEffect } from "react"

const prisma = new PrismaClient

const Items = (props) => {

    useEffect(() => {
        if(props.url) {
            return window.location.replace(props.url)
        }

        return
    })

    if(!props) {
        return <h1>props came back as undefined</h1>
    }
    if(props.url) {
        <h1>Please wait redirecting</h1>
    }

    return (
        <h1>{props.error}</h1>
    )
}

export async function getServerSideProps({params}) {
    const item = params.item

    if(typeof item != "string") {
        return {
            props: {
                url: null,
                error: "invalid url"
            }
        }
    }
    
    const url = await prisma.url.findFirst({where: {id: item}})
    if(!url) {
        return {
            props: {
                url: null,
                error: "invalid url"
            }
        }
    }
    return {
        props: {
            url: await url.url
        }
    }
}

export default Items
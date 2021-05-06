import { useState } from "react";
import {Row, Col, Container} from "react-bootstrap"
import styles from "../styles/home.module.css"

export default function Home() {
  var [random, setRandom] = useState(false);
  var [shorUrl, setShorUrl] = useState(null)
  var [status, setStatus] = useState(null);
  var [loading, setLoading] = useState(false);

  function handleChange() {
    setRandom(!random)
  }

  const handleRegistration = async event => {
    event.preventDefault()
    setLoading(true)
    console.log(event.target.random)

    const res = await fetch("/api/register",
      {
        body: JSON.stringify({
          url: event.target.url.value,
          name: event.target.name.value? event.target.name.value: null,
          random: event.target.random.checked
        }),
        headers: {
          'Content-Type': 'application/json'
        },
        method: "POST"
      }
    )

    const result = await res.json()


    setStatus(
      {
        status: result.status,
        code: result.code,
      }
    )
    setShorUrl(result.name)

    event.target.reset()

    setLoading(false)

  }

  return (
    <div className={styles.container}>
        <h1>URL Shortener</h1>
        
        <form onSubmit={handleRegistration} >
        < label htmlFor="url">URL</label>
          <input id="url" type="text" autoComplete="URL" required/><br/>
          {status?.code == 4 || status?.code == 2 && 
              <li className={styles.error}>{status.status}</li>
          }
          {!random &&
            <>
            <label htmlFor="name">Name</label>
            <input id="name" type="text" autoComplete="Name" required/><br/>
            {status?.code == 3 && 
              <li className={styles.error}>{status.status}</li>
            }
            </>
          }
          <label htmlFor="random">Random name?</label>
          <input type="checkbox" name="Random" id="random" onChange={handleChange}/> <br/>
          <button type="submit" disabled={loading} className={styles.submit}>{
          loading && <img src="loading.svg" alt="loading"className={styles.spinner}/>
          ||
          <>Shorten</>
          }</button>
        
        </form>
    </div>
  )
}

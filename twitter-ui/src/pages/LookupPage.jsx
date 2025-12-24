import { useState } from "react"
import { useNavigate } from "react-router-dom"

export default function LookupPage() {
  const [tweetId, setTweetId] = useState("")
  const nav = useNavigate()

  return (
    <div className="card">
      <h2>Tweet Lookup</h2>
      <div className="row gap">
        <input className="input" placeholder="tweet id" value={tweetId} onChange={(e) => setTweetId(e.target.value)} />
        <button className="btn" disabled={!tweetId} onClick={() => nav(`/tweet/${tweetId}`)}>
          Open
        </button>
      </div>
    </div>
  )
}

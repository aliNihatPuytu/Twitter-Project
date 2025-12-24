import api from "../api"
import { useMemo, useState } from "react"

export default function TweetDetailCard({ tweet, me, onRefresh }) {
  const isOwner = useMemo(() => me && tweet.user && tweet.user.id === me.userId, [me, tweet])
  const [editing, setEditing] = useState(false)
  const [text, setText] = useState(tweet.content)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState("")

  const save = async () => {
    setErr("")
    setBusy(true)
    try {
      await api.put(`/tweet/${tweet.id}`, { content: text })
      setEditing(false)
      onRefresh()
    } catch {
      setErr("Güncellenemedi")
    } finally {
      setBusy(false)
    }
  }

  const remove = async () => {
    setErr("")
    setBusy(true)
    try {
      await api.delete(`/tweet/${tweet.id}`)
      onRefresh()
    } catch {
      setErr("Silinemedi")
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="card">
      <div className="row space">
        <div>
          <div className="tweetUser">@{tweet.user?.username}</div>
          <div className="tweetMeta">tweetId: {tweet.id}</div>
        </div>
        <div className="row gap">
          <div className="chip">Likes {tweet.likeCount}</div>
          <div className="chip">Retweets {tweet.retweetCount}</div>
        </div>
      </div>

      {!editing ? (
        <div className="tweetBody">{tweet.content}</div>
      ) : (
        <textarea className="textarea" value={text} onChange={(e) => setText(e.target.value)} />
      )}

      {err && <div className="error">{err}</div>}

      {isOwner && (
        <div className="row end gap">
          {!editing ? (
            <button className="btn btnGhost" onClick={() => setEditing(true)} disabled={busy}>Edit</button>
          ) : (
            <>
              <button className="btn btnGhost" onClick={() => setEditing(false)} disabled={busy}>Cancel</button>
              <button className="btn" onClick={save} disabled={busy}>Save</button>
            </>
          )}
          <button className="btn btnDanger" onClick={remove} disabled={busy}>Delete</button>
        </div>
      )}

      <div className="divider" />

      <h3>Comments</h3>
      <div className="col">
        {tweet.comments?.length ? tweet.comments.map((c) => (
          <div key={c.id} className="comment">
            <div className="row space">
              <div className="commentUser">@{c.user?.username}</div>
              <div className="commentMeta">#{c.id}</div>
            </div>
            <div className="commentBody">{c.content}</div>
          </div>
        )) : (
          <div className="muted">No comments</div>
        )}
      </div>
    </div>
  )
}

import { useMemo, useState } from "react"
import api from "../api"

export default function CommentBox({ tweet, me, onRefresh }) {
  const [content, setContent] = useState("")
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState("")
  const [editId, setEditId] = useState(null)
  const [editText, setEditText] = useState("")

  const canInteract = useMemo(() => !!me, [me])

  const submit = async () => {
    if (!canInteract) return
    if (!content.trim()) return
    setErr("")
    setBusy(true)
    try {
      await api.post("/comment", { tweetId: tweet.id, content })
      setContent("")
      onRefresh()
    } catch {
      setErr("Yorum eklenemedi")
    } finally {
      setBusy(false)
    }
  }

  const startEdit = (c) => {
    setEditId(c.id)
    setEditText(c.content)
  }

  const saveEdit = async () => {
    setErr("")
    setBusy(true)
    try {
      await api.put(`/comment/${editId}`, { content: editText })
      setEditId(null)
      setEditText("")
      onRefresh()
    } catch {
      setErr("Yorum güncellenemedi")
    } finally {
      setBusy(false)
    }
  }

  const remove = async (id) => {
    setErr("")
    setBusy(true)
    try {
      await api.delete(`/comment/${id}`)
      onRefresh()
    } catch {
      setErr("Yorum silinemedi (yetki kontrolü olabilir)")
    } finally {
      setBusy(false)
    }
  }

  const isCommentOwner = (c) => me && c.user && c.user.id === me.userId
  const isTweetOwner = me && tweet.user && tweet.user.id === me.userId

  return (
    <div className="card">
      <div className="row space">
        <h3>Add Comment</h3>
        <div className="muted">{canInteract ? "Logged in" : "Login required"}</div>
      </div>

      <textarea className="textarea" value={content} onChange={(e) => setContent(e.target.value)} placeholder="Write a reply..." />
      <div className="row end">
        <button className="btn" onClick={submit} disabled={!canInteract || busy}>Reply</button>
      </div>

      {err && <div className="error">{err}</div>}

      <div className="divider" />

      <h3>Manage Comments</h3>
      <div className="col">
        {tweet.comments?.map((c) => (
          <div key={c.id} className="comment manage">
            <div className="row space">
              <div className="commentUser">@{c.user?.username}</div>
              <div className="row gap">
                {(isCommentOwner(c)) && (
                  <button className="chip" onClick={() => startEdit(c)} disabled={busy}>Edit</button>
                )}
                {(isCommentOwner(c) || isTweetOwner) && (
                  <button className="chip danger" onClick={() => remove(c.id)} disabled={busy}>Delete</button>
                )}
              </div>
            </div>

            {editId === c.id ? (
              <div className="col">
                <textarea className="textarea" value={editText} onChange={(e) => setEditText(e.target.value)} />
                <div className="row end gap">
                  <button className="btn btnGhost" onClick={() => setEditId(null)} disabled={busy}>Cancel</button>
                  <button className="btn" onClick={saveEdit} disabled={busy}>Save</button>
                </div>
              </div>
            ) : (
              <div className="commentBody">{c.content}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

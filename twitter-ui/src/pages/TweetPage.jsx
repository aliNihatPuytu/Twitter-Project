import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../api"
import TweetComposer from "../ui/TweetComposer.jsx"
import TweetCard from "../ui/TweetCard.jsx"

function normalizeTweet(t) {
  const id = t?.id ?? t?.tweetId ?? t?.tweet_id
  const content = t?.content ?? t?.text ?? t?.tweetText ?? t?.message ?? ""
  const createdAt = t?.createdAt ?? t?.created_at ?? t?.date ?? t?.timestamp ?? null
  const userId = t?.user?.id ?? t?.userId ?? t?.user_id
  const username = t?.user?.username ?? t?.username ?? t?.userName ?? (userId ? `user${userId}` : "handle")
  return {
    ...t,
    id,
    content,
    createdAt,
    user: t?.user ?? { id: userId, username }
  }
}

export default function HomePage({ me }) {
  const navigate = useNavigate()
  const [tab, setTab] = useState("forYou")
  const [feedUserId, setFeedUserId] = useState(() => String(me?.userId ?? ""))
  const [tweets, setTweets] = useState([])
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState("")

  const effectiveUserId = useMemo(() => {
    if (tab === "following") return me?.userId ? String(me.userId) : feedUserId
    return feedUserId
  }, [tab, me, feedUserId])

  const load = async () => {
    setErr("")
    setLoading(true)
    try {
      const res = await api.get("/tweet/findByUserId", { params: { userId: effectiveUserId } })
      const arr = Array.isArray(res.data) ? res.data : (res.data?.tweets || [])
      setTweets(arr.map(normalizeTweet).filter((x) => x.id))
    } catch (e) {
      setErr("Tweetler yüklenemedi")
      setTweets([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!effectiveUserId) return
    load()
  }, [tab, effectiveUserId])

  useEffect(() => {
    if (me?.userId && !feedUserId) setFeedUserId(String(me.userId))
  }, [me])

  return (
    <div className="xHome">
      <div className="xHomeHeader">
        <button className={tab === "forYou" ? "xHomeTab active" : "xHomeTab"} onClick={() => setTab("forYou")} type="button">
          Sana özel
        </button>
        <button className={tab === "following" ? "xHomeTab active" : "xHomeTab"} onClick={() => setTab("following")} type="button">
          Takip
        </button>
      </div>

      {me ? (
        <TweetComposer
          me={me}
          feedUserId={feedUserId}
          onChangeFeedUserId={setFeedUserId}
          onReload={load}
          onPosted={load}
        />
      ) : (
        <div className="xGuestGate">
          <div className="xGuestTitle">Tweet/like/comment için giriş yap</div>
          <button className="xGuestBtn" type="button" onClick={() => navigate("/auth")}>
            Sign in
          </button>
          <div className="xGuestDev">
            <span className="xDevLabel">feed userId</span>
            <input className="xDevInput" value={feedUserId} onChange={(e) => setFeedUserId(e.target.value)} />
            <button className="xDevBtn" type="button" onClick={load}>
              Load
            </button>
          </div>
        </div>
      )}

      {err ? <div className="xErr">{err}</div> : null}

      <div className="xFeed">
        {loading ? (
          <>
            <div className="xSkeleton" />
            <div className="xSkeleton" />
            <div className="xSkeleton" />
          </>
        ) : (
          tweets.map((t) => <TweetCard key={t.id} tweet={t} me={me} onRefresh={load} />)
        )}
      </div>
    </div>
  )
}

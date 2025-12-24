import { useNavigate } from "react-router-dom"
import { FiFeather, FiMail } from "react-icons/fi"

export default function FloatingDock() {
  const navigate = useNavigate()

  const goCompose = () => {
    navigate("/")
    window.dispatchEvent(new CustomEvent("x:compose"))
  }

  const goMessages = () => {
    navigate("/messages")
  }

  return (
    <div className="xFloatDock">
      <button className="xFloatBtn" type="button" onClick={goCompose} aria-label="Compose">
        <FiFeather size={22} />
      </button>
      <button className="xFloatBtn" type="button" onClick={goMessages} aria-label="Messages">
        <FiMail size={22} />
      </button>
    </div>
  )
}

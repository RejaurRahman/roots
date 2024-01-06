import { FC } from "react"

import { Link } from "react-router-dom"

import { library } from "@fortawesome/fontawesome-svg-core"
import { fab } from "@fortawesome/free-brands-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import "./SocialList.styles.scss"

library.add(
  fab
)

const SocialList: FC = () => {
  return (
    <ul className="top-header-social-list">
      <li className="top-header-social-item">
        <Link
          className="top-header-social-link"
          rel="noreferrer"
          target="_blank"
          to="https://en-gb.facebook.com/"
          aria-label="Facebook"
        >
          <FontAwesomeIcon
            icon={["fab", "facebook-f"]}
          />
        </Link>
      </li>
      <li className="top-header-social-item">
        <Link
          className="top-header-social-link"
          rel="noreferrer"
          target="_blank"
          to="https://twitter.com/"
          aria-label="Twitter"
        >
          <FontAwesomeIcon
            icon={["fab", "twitter"]}
          />
        </Link>
      </li>
      <li className="top-header-social-item">
        <Link
          className="top-header-social-link"
          rel="noreferrer"
          target="_blank"
          to="https://www.instagram.com/"
          aria-label="Instagram"
        >
          <FontAwesomeIcon
            icon={["fab", "instagram"]}
          />
        </Link>
      </li>
    </ul>
  )
}

export default SocialList

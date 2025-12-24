import {
  FiHome,
  FiSearch,
  FiBell,
  FiUserPlus,
  FiMail,
  FiZap,
  FiBookmark,
  FiUsers,
  FiStar,
  FiUser,
  FiMoreHorizontal,
  FiBarChart2
} from "react-icons/fi";
import { RiChat1Line, RiRepeat2Line, RiHeart3Line, RiHeart3Fill, RiShare2Line } from "react-icons/ri";

export function NavHomeIcon(props) {
  return <FiHome {...props} />;
}
export function NavExploreIcon(props) {
  return <FiSearch {...props} />;
}
export function NavNotificationsIcon(props) {
  return <FiBell {...props} />;
}
export function NavFollowIcon(props) {
  return <FiUserPlus {...props} />;
}
export function NavMessagesIcon(props) {
  return <FiMail {...props} />;
}
export function NavGrokIcon(props) {
  return <FiZap {...props} />;
}
export function NavBookmarksIcon(props) {
  return <FiBookmark {...props} />;
}
export function NavCommunitiesIcon(props) {
  return <FiUsers {...props} />;
}
export function NavPremiumIcon(props) {
  return <FiStar {...props} />;
}
export function NavProfileIcon(props) {
  return <FiUser {...props} />;
}
export function NavMoreIcon(props) {
  return <FiMoreHorizontal {...props} />;
}

export function ActionReplyIcon(props) {
  return <RiChat1Line {...props} />;
}
export function ActionRepostIcon(props) {
  return <RiRepeat2Line {...props} />;
}
export function ActionLikeIcon({ active, ...props }) {
  const Cmp = active ? RiHeart3Fill : RiHeart3Line;
  return <Cmp {...props} />;
}
export function ActionViewsIcon(props) {
  return <FiBarChart2 {...props} />;
}
export function ActionShareIcon(props) {
  return <RiShare2Line {...props} />;
}

const XIcons = {
  NavHomeIcon,
  NavExploreIcon,
  NavNotificationsIcon,
  NavFollowIcon,
  NavMessagesIcon,
  NavGrokIcon,
  NavBookmarksIcon,
  NavCommunitiesIcon,
  NavPremiumIcon,
  NavProfileIcon,
  NavMoreIcon,
  ActionReplyIcon,
  ActionRepostIcon,
  ActionLikeIcon,
  ActionViewsIcon,
  ActionShareIcon,
};

export default XIcons;

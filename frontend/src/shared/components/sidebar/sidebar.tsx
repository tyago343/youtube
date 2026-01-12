import { Link, useLocation } from "react-router";
import {
  ChevronRight,
  Clock,
  Download,
  History,
  HomeIcon,
  ListVideo,
  PlaySquare,
  Settings,
  ThumbsUp,
  User,
  type LucideIcon,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@shared/lib/utils";
import Button from "@shared/ui/button/button";
import { Separator } from "@shared/ui/separator/separator";
import { useSidebar } from "./use-sidebar.hook";

const DUMMY_CHANNELS = [
  { id: "1", name: "Buenas Tardes C..." },
  { id: "2", name: "Radio Con Vos 8..." },
  { id: "3", name: "midudev" },
  { id: "4", name: "The PrimeTime" },
  { id: "5", name: "BLENDER" },
];

const YOU_LINKS = [
  { to: "/history", labelKey: "navigation.history", icon: History },
  { to: "/playlists", labelKey: "navigation.playlists", icon: ListVideo },
  { to: "/watch-later", labelKey: "navigation.watchLater", icon: Clock },
  { to: "/liked-videos", labelKey: "navigation.likedVideos", icon: ThumbsUp },
  { to: "/your-videos", labelKey: "navigation.yourVideos", icon: PlaySquare },
  { to: "/downloads", labelKey: "navigation.downloads", icon: Download },
];

const BASE_BUTTON_CLASSES =
  "w-full justify-start cursor-pointer hover:bg-accent hover:text-accent-foreground py-5";
const ACTIVE_CLASSES = "bg-accent text-accent-foreground";

interface CollapsedNavItem {
  to: string;
  labelKey: string;
  icon: LucideIcon;
}

const COLLAPSED_NAV_ITEMS: CollapsedNavItem[] = [
  { to: "/", labelKey: "navigation.home", icon: HomeIcon },
  { to: "/profile", labelKey: "navigation.you", icon: User },
  {
    to: "/subscriptions",
    labelKey: "navigation.subscriptions",
    icon: ListVideo,
  },
  { to: "/settings", labelKey: "navigation.settings", icon: Settings },
];

function Sidebar() {
  const location = useLocation();
  const { isCollapsed } = useSidebar();
  const isActive = (path: string) => location.pathname === path;
  const { t } = useTranslation("shared");

  if (isCollapsed) {
    return <CollapsedSidebar isActive={isActive} />;
  }

  return (
    <aside className="w-64 hidden md:block h-[calc(100vh-73px)] sticky top-[73px] overflow-y-auto">
      <nav className="px-4 pr-8">
        <ul className="flex flex-col gap-1">
          <li>
            <Link to="/">
              <Button
                variant="ghost"
                className={cn(
                  BASE_BUTTON_CLASSES,
                  isActive("/") && ACTIVE_CLASSES
                )}
              >
                <HomeIcon className="size-4" />
                <span>{t("navigation.home")}</span>
              </Button>
            </Link>
          </li>
        </ul>
      </nav>
      <Separator className="my-4" />
      <nav className="px-4 pr-8">
        <div className="flex flex-col gap-1">
          <Link to="/subscriptions">
            <Button
              variant="ghost"
              className={cn(
                BASE_BUTTON_CLASSES,
                "font-semibold",
                isActive("/subscriptions") && ACTIVE_CLASSES
              )}
            >
              <span>{t("navigation.subscriptions")}</span>
              <ChevronRight className="size-4" />
            </Button>
          </Link>
          <ul className="flex flex-col gap-1">
            {DUMMY_CHANNELS.map((channel) => {
              const channelPath = `/channel/${channel.id}`;
              return (
                <li key={channel.id}>
                  <Link to={channelPath}>
                    <Button
                      variant="ghost"
                      className={cn(
                        BASE_BUTTON_CLASSES,
                        isActive(channelPath) && ACTIVE_CLASSES
                      )}
                    >
                      <User className="size-4" />
                      <span className="truncate">{channel.name}</span>
                    </Button>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>
      <Separator className="my-4" />
      <nav className="px-4 pr-8">
        <div className="flex flex-col gap-1">
          <Link to="/profile">
            <Button
              variant="ghost"
              className={cn(
                BASE_BUTTON_CLASSES,
                "font-semibold",
                isActive("/profile") && ACTIVE_CLASSES
              )}
            >
              <span>{t("navigation.you")}</span>
              <ChevronRight className="size-4" />
            </Button>
          </Link>
          <ul className="flex flex-col gap-1">
            {YOU_LINKS.map((link) => (
              <li key={link.to}>
                <Link to={link.to}>
                  <Button
                    variant="ghost"
                    className={cn(
                      BASE_BUTTON_CLASSES,
                      isActive(link.to) && ACTIVE_CLASSES
                    )}
                  >
                    <link.icon className="size-4" />
                    <span>{t(link.labelKey)}</span>
                  </Button>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
      <Separator className="my-4" />
      <nav className="px-4 pr-8">
        <ul className="flex flex-col gap-1">
          <li>
            <Link to="/settings">
              <Button
                variant="ghost"
                className={cn(
                  BASE_BUTTON_CLASSES,
                  isActive("/settings") && ACTIVE_CLASSES
                )}
              >
                <Settings className="size-4" />
                <span>{t("navigation.settings")}</span>
              </Button>
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}

interface CollapsedSidebarProps {
  isActive: (path: string) => boolean;
}

function CollapsedSidebar({ isActive }: CollapsedSidebarProps) {
  const { t } = useTranslation("shared");

  return (
    <aside className="w-[72px] hidden md:flex flex-col items-center h-[calc(100vh-73px)] sticky top-[73px] overflow-y-auto py-2">
      <nav className="flex flex-col items-center gap-1 w-full">
        {COLLAPSED_NAV_ITEMS.map((item) => (
          <Link key={item.to} to={item.to} className="w-full">
            <Button
              variant="ghost"
              className={cn(
                "w-full h-auto flex-col gap-1 py-4 px-1 cursor-pointer hover:bg-accent hover:text-accent-foreground rounded-lg",
                isActive(item.to) && ACTIVE_CLASSES
              )}
            >
              <item.icon className="size-6" />
              <span className="text-[10px] font-normal">
                {t(item.labelKey)}
              </span>
            </Button>
          </Link>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;

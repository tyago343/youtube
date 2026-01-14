import { useState } from "react";
import { Link, useLocation } from "react-router";
import { ChevronDown, User } from "lucide-react";
import { cn } from "@shared/lib/utils";
import Button from "@shared/ui/button/button";
import { useGetActiveChannelsQuery } from "../model/channel.api";

const INITIAL_CHANNELS_LIMIT = 8;

const BASE_BUTTON_CLASSES =
  "w-full justify-start cursor-pointer hover:bg-accent hover:text-accent-foreground py-5";
const ACTIVE_CLASSES = "bg-accent text-accent-foreground";

function SubscriptionsList() {
  const location = useLocation();
  const [showAll, setShowAll] = useState(false);
  const { data: channels = [], isLoading } = useGetActiveChannelsQuery();

  const isActive = (path: string) => location.pathname === path;

  if (isLoading) {
    return <SubscriptionsListSkeleton />;
  }

  const visibleChannels = showAll
    ? channels
    : channels.slice(0, INITIAL_CHANNELS_LIMIT);

  const hasMoreChannels = channels.length > INITIAL_CHANNELS_LIMIT;

  return (
    <ul className="flex flex-col gap-1">
      {visibleChannels.map((channel) => {
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
                <ChannelAvatar
                  avatarUrl={channel.avatarUrl}
                  name={channel.name}
                />
                <span className="truncate">{channel.name}</span>
              </Button>
            </Link>
          </li>
        );
      })}
      {hasMoreChannels && !showAll && (
        <li>
          <Button
            variant="ghost"
            className={BASE_BUTTON_CLASSES}
            onClick={() => setShowAll(true)}
          >
            <ChevronDown className="size-4" />
            <span>Show more</span>
          </Button>
        </li>
      )}
    </ul>
  );
}

interface ChannelAvatarProps {
  avatarUrl: string | null | undefined;
  name: string;
}

function ChannelAvatar({ avatarUrl, name }: ChannelAvatarProps) {
  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={name}
        className="size-4 rounded-full object-cover"
      />
    );
  }

  return <User className="size-4" />;
}

function SubscriptionsListSkeleton() {
  return (
    <ul className="flex flex-col gap-1">
      {Array.from({ length: 4 }).map((_, index) => (
        <li key={index}>
          <div className="flex items-center gap-2 px-4 py-3">
            <div className="size-4 rounded-full bg-muted animate-pulse" />
            <div className="h-4 w-24 bg-muted animate-pulse rounded" />
          </div>
        </li>
      ))}
    </ul>
  );
}

export default SubscriptionsList;

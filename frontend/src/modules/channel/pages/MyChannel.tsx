import { useState } from "react";
import useAuthenticatedUser from "@auth/context/authenticated-user.context";
import { useGetUserChannelQuery } from "../model/channel.api";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar/avatar";
import Button from "@/shared/ui/button/button";

const DESCRIPTION_PREVIEW_LENGTH = 100;

function ChannelDescription({ description }: { description: string }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const shouldTruncate = description.length > DESCRIPTION_PREVIEW_LENGTH;

  if (!shouldTruncate) {
    return <p className="text-sm text-muted-foreground">{description}</p>;
  }

  const displayText = isExpanded
    ? description
    : `${description.slice(0, DESCRIPTION_PREVIEW_LENGTH)}...`;

  return (
    <p className="text-sm text-muted-foreground">
      {displayText}
      <Button
        variant="ghost"
        onClick={() => setIsExpanded(!isExpanded)}
        className="ml-1 text-primary hover:underline font-medium cursor-pointer"
      >
        {isExpanded ? "menos" : "más"}
      </Button>
    </p>
  );
}

function ChannelBanner({
  bannerUrl,
}: {
  bannerUrl: string | null | undefined;
}) {
  if (!bannerUrl) {
    return <div className="w-full h-32 md:h-48 bg-muted rounded-xl" />;
  }

  return (
    <div className="w-full h-32 md:h-48 rounded-xl overflow-hidden">
      <img
        src={bannerUrl}
        alt="Channel banner"
        className="w-full h-full object-cover"
      />
    </div>
  );
}

function ChannelAvatar({
  avatarUrl,
  channelName,
}: {
  avatarUrl: string | null | undefined;
  channelName: string;
}) {
  const fallbackLetter = channelName.charAt(0).toUpperCase();

  return (
    <Avatar className="size-20 md:size-32 border-4 border-background">
      {avatarUrl ? (
        <AvatarImage src={avatarUrl} alt={channelName} />
      ) : (
        <AvatarFallback className="text-2xl md:text-4xl bg-primary text-primary-foreground">
          {fallbackLetter}
        </AvatarFallback>
      )}
    </Avatar>
  );
}

function MyChannel() {
  const user = useAuthenticatedUser();
  const { data: channel, isLoading } = useGetUserChannelQuery(user.id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!channel) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <p className="text-muted-foreground">Channel not found</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      <ChannelBanner bannerUrl={channel.bannerUrl} />

      <div className="flex flex-col md:flex-row gap-4 md:gap-6 mt-4">
        <ChannelAvatar
          avatarUrl={channel.avatarUrl}
          channelName={channel.name}
        />

        <div className="flex flex-col gap-2 flex-1">
          <h1 className="text-2xl md:text-3xl font-bold">{channel.name}</h1>

          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <span>@{user.username}</span>
          </div>

          {channel.description && (
            <ChannelDescription description={channel.description} />
          )}

          <div className="flex flex-wrap gap-2 mt-2">
            <Button variant="secondary" className="rounded-full cursor-pointer">
              Personalizar canal
            </Button>
            <Button variant="secondary" className="rounded-full cursor-pointer">
              Gestionar vídeos
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyChannel;

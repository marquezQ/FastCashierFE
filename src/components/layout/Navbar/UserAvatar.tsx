import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getInitials } from '@/utils/string.utils';

interface UserAvatarProps {
  name: string;
  avatar?: string;
}

export const UserAvatar = ({ name, avatar }: UserAvatarProps) => {
  return (
    <Avatar className="h-8 w-8">
      <AvatarImage src={avatar} alt={name} />
      <AvatarFallback className="bg-primary text-primary-foreground">
        {getInitials(name)}
      </AvatarFallback>
    </Avatar>
  );
};
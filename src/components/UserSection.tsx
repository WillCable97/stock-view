import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';


const UserSection = ({ user }: { user: typeof dummyUser }) => (
    <Card className="bg-zinc-800 text-white">
      <CardHeader>
        <CardTitle>User Overview</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center gap-4">
        <Avatar>
          <AvatarImage src={user.avatar} />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-lg font-semibold">{user.name}</p>
          <p className="text-sm text-zinc-400">{user.email}</p>
        </div>
      </CardContent>
    </Card>
  );

  export default UserSection;

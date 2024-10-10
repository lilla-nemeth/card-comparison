export interface UserGroupMembershipUser {
  id: string;
  username: string;
}

export interface UserGroupMembership {
  id: string;
  nickname: string;
  role: "host" | "member";
  userId?: UserGroupMembershipUser;
}

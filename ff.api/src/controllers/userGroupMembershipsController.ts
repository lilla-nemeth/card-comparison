import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { GroupMembershipModel, Role } from '../models/userGroupMembershipModel';
import User from '../models/userModel';
import UserGroup from '../models/userGroupSchema';

async function createGroupMembership(groupId: string, nickname: string, role: Role = Role.Member, customColor?: string) {
  const membership = new GroupMembershipModel({
    groupId: new mongoose.Types.ObjectId(groupId),
    role,
    nickname,
    customColor,
  });

  await membership.save();
  return membership;
}

// Function to claim a group membership
async function claimGroupMembership(userId: string, membershipId: string) {
  const membership = await GroupMembershipModel.findById(membershipId);
  if (!membership) throw new Error('Membership not found');
  if (membership.userId) throw new Error('Membership already claimed');

  membership.userId = new mongoose.Types.ObjectId(userId);
  await membership.save();

  return membership;
}

export async function createGroupMembershipHandler(req: Request, res: Response) {
  try {
    const { nickname, role, customColor } = req.body;

    if (!nickname) {
      return res.status(400).json({ message: 'GroupId and Nickname are required.' });
    }

    const user = await User.findById(req.user.id)
      .populate<{ activeUserGroup: UserGroup }>('activeUserGroup');
    const userGroup = user!.activeUserGroup

    const membership = await createGroupMembership(
      user!.activeUserGroup.id,
      nickname,
      role as Role || Role.Member,
      customColor
    );

    res.json(membership);
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Server error', error });
  }
}

export async function claimGroupMembershipHandler(req: Request, res: Response) {
  try {
    const { membershipId } = req.params;

    if (!membershipId) {
      return res.status(400).json({ message: 'UserId and MembershipId are required.' });
    }

    const membership = await claimGroupMembership(req.user.id, membershipId);

    res.json(membership);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
}

export async function getGroupMembers(req: Request, res: Response) {
  try {
    const user = await User.findById(req.user.id)
    const groupId = user!.activeUserGroup
    const members = await GroupMembershipModel
      .find({ groupId })
      .populate('userId', 'id username')
    res.json(members);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
}
export enum VisibilityType {
  PUBLIC = "PUBLIC",
  WORKSPACE = "WORKSPACE",
  PRIVATE = "PRIVATE",
}
export enum MemberRole {
  OWNER = "OWNER",
  ADMIN = "ADMIN",
  MEMBER = "MEMBER",
  VIEWER = "VIEWER",
}
export interface UserModal {
  user_id: string;
  username: string;
  email: string;
}
export interface MemberModal {
  user: UserModal;
}
export interface AssignModal {
  user_id: string;
  username: string;
  email: string;
}
export interface LabelModal {
  label_id: string;
  title: string;
  value: string;
}
export interface Check_list_itemModal {
  item_id: string;
  name: string;
  is_checked: boolean;
}
export interface Check_listModal {
  check_list_id: string;
  title: string;
  items: Check_list_itemModal[];
}
export interface AttachmentModal {
  file_id: string;
  url: string;
  added_date: string;
}
export interface CommentModal {
  comment_id: string;
  user_id: string;
  username: string;
  email: string;
  content: string;
  created_at: string;
}
export interface CardModal {
  card_id: string;
  name: string;
  description: string;
  position: number;
  assign: string[];
  label: LabelModal[];
  check_list: Check_listModal[];
  attachment: AttachmentModal[];
  watch: string[];
  comment: CommentModal[];
  start_date: string;
  due_date: string;
  is_completed: boolean;
  is_archived: boolean;
}
export interface ListModal {
  list_id: string;
  cards: CardModal[];
  title: string;
  position: number;
  is_todo: boolean;
  is_default: boolean;
  is_archived: boolean;
}
export interface BoardModal {
    board_id: string;
    title: string;
    description: string;
    visibility: VisibilityType;
    members: UserModal[];
    lists: ListModal[];
    labels: LabelModal[];
    star: string[];
    is_deleted: boolean;
    created_at: string;
    updated_at: string;
}

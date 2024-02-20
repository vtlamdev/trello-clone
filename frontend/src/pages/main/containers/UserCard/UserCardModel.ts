interface Label {
  label_id: string;
  title: string;
  value: string;
}

interface CheckList {
  check_list_id: string;
  title: string;
  item: CheckListItem[];
}

interface CheckListItem {
  item_id: string;
  name: string;
  is_checked: boolean;
}

interface Attachment {
  file_id: string;
  url: string;
  name: string;
  type: string;
  added_date: string;
}

interface UserInfo {
  user_id: string;
  username: string;
  email: string;
}

interface Comment {
  comment_id: string;
  user: UserInfo;
  content: string;
  created_at: string;
}

interface BoardInfo {
  board_id: string;
  title: string;
}

interface ListInfo {
  list_id: string;
  title: string;
}

interface CardModel {
  card_id: string;
  name: string;
  description: string;
  position: number;
  assign: string[];
  label: Label[];
  check_list: CheckList[];
  start_date: string;
  due_date: string;
  is_completed: boolean;
  is_archived: boolean;
  attachment: Attachment[];
  watch: string[];
  comment: Comment[];
  created_at: string;
  updated_at: string;
  is_deleted: false;
  board: BoardInfo;
  list: ListInfo;
}

interface DueDateFilter {
  noDate: boolean;
  completed: boolean;
  overdue: boolean;
}

export type { DueDateFilter };

export default CardModel;

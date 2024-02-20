interface CardModel {
  card_id: string;
  list: {
    list_id: string;
    title: string;
  };
  board: {
    board_id: string;
    title: string;
  };
  name: string;
  description: string;
  position: number;
  assign: Assign[];
  label: Label[];
  check_list: Checklist[];
  start_date: string;
  due_date: string;
  is_completed: boolean;
  is_archived: boolean;
  attachment: Attachment[];
  watch: string[];
  comment: CommentModel[];
  created_at: string;
  updated_at: string;
}

interface Assign {
  user_id: string;
  username: string;
  email: string;
}

interface Label {
  label_id: string;
  title: string;
  value: string;
}

interface Checklist {
  check_list_id: string;
  title: string;
  item: Item[];
}

interface Item {
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

interface CommentModel {
  comment_id: string;
  user: {
    user_id: string;
    username: string;
    email: string;
  };
  content: string;
  created_at: string;
}

export type { Assign, Label, Attachment, Checklist, Item, CommentModel };

export default CardModel;

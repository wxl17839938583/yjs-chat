
export interface Hero{
  cname: string;
  ename: number;
  hero_type: number;
  id_name: string;
  moss_id: number;
  new_type: number;
  skin_name: string;
  title: string;
}

export interface Message{
  content: string;
  clientId: number;
  time: string;
  cname: string;
  ename: number;
  color: string;
}
export type MessageWithoutColor = Omit<Message, 'color'>
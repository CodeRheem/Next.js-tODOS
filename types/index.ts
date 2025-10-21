


export interface User {
  id: string;
  email: string;
}

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  user_id: string;
  created_at: string;
  offline?: boolean;
}

import { User, Todo } from '@/types';

// For demo purposes, using localStorage
// Replace with actual Supabase:
// import { createClient } from '@supabase/supabase-js'
// export const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL!,
//   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
// )

export const supabase = {
  auth: {
    signIn: async (email: string, password: string) => {
      await new Promise(resolve => setTimeout(resolve, 500));
      const user: User = { id: '1', email };
      localStorage.setItem('user', JSON.stringify(user));
      return { user, error: null };
    },

    signUp: async (email: string, password: string) => {
      await new Promise(resolve => setTimeout(resolve, 500));
      const user: User = { id: '1', email };
      localStorage.setItem('user', JSON.stringify(user));
      return { user, error: null };
    },

    signOut: async () => {
      localStorage.removeItem('user');
      return { error: null };
    },

    getUser: (): User | null => {
      if (typeof window === 'undefined') return null;
      const stored = localStorage.getItem('user');
      return stored ? JSON.parse(stored) : null;
    }
  },

  from: (table: string) => ({
    select: async () => {
      if (typeof window === 'undefined') return { data: [], error: null };
      const todos = JSON.parse(localStorage.getItem('todos') || '[]');
      return { data: todos, error: null };
    },

    insert: async (data: Partial<Todo>) => {
      if (typeof window === 'undefined') return { data: null, error: null };
      const todos = JSON.parse(localStorage.getItem('todos') || '[]');
      const newTodo: Todo = {
        ...data as Todo,
        id: Date.now().toString()
      };
      todos.push(newTodo);
      localStorage.setItem('todos', JSON.stringify(todos));
      return { data: newTodo, error: null };
    },

    update: (data: Partial<Todo>) => ({
      eq: async (field: string, value: string) => {
        if (typeof window === 'undefined') return { error: null };
        const todos: Todo[] = JSON.parse(localStorage.getItem('todos') || '[]');
        const index = todos.findIndex((t: Todo) => (t as any)[field] === value);
        if (index !== -1) {
          todos[index] = { ...todos[index], ...data };
          localStorage.setItem('todos', JSON.stringify(todos));
        }
        return { error: null };
      }
    }),

    delete: () => ({
      eq: async (field: string, value: string) => {
        if (typeof window === 'undefined') return { error: null };
        const todos: Todo[] = JSON.parse(localStorage.getItem('todos') || '[]');
        const filtered = todos.filter((t: Todo) => (t as any)[field] !== value);
        localStorage.setItem('todos', JSON.stringify(filtered));
        return { error: null };
      }
    }),

    on: (event: string) => ({
      subscribe: (callback: (payload: any) => void) => {
        const interval = setInterval(() => {
          callback({ eventType: 'UPDATE' });
        }, 5000);
        return { unsubscribe: () => clearInterval(interval) };
      }
    })
  })
};
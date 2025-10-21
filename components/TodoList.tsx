'use client';

import React, { useState, useEffect } from 'react';
import { Check, Trash2, Clock, Plus, User as UserIcon, LogOut, Wifi, WifiOff } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { User, Todo } from '@/types';

interface TodoListProps {
  user: User;
  onSignOut: () => Promise<void>;
}

const TodoList: React.FC<TodoListProps> = ({ user, onSignOut }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [isOnline, setIsOnline] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    fetchTodos();

    // Poll for updates every 5 seconds instead of real-time
    const interval = setInterval(() => {
      fetchTodos();
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [user?.id]);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    setIsOnline(navigator.onLine);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

const fetchTodos = async () => {
    if (!user?.id) return;
    try {
      const result = await (supabase.from('todos') as any).select('*', user.id);
      if (result?.error) throw result.error;
      setTodos(result?.data || []);
    } catch (error) {
      console.error('Error fetching todos:', error);
      setTodos([]);
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async () => {
    if (!newTodo.trim() || !user?.id) return;
    try {
      const result = await (supabase.from('todos') as any).insert({ 
        text: newTodo, 
        completed: false, 
        user_id: user.id 
      });
      if (result?.error) throw result.error;
      setNewTodo('');
      // Refresh todos after insert
      await fetchTodos();
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const toggleTodo = async (id: string) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;
    try {
      const { error } = await supabase
        .from('todos')
        .update({ completed: !todo.completed })
        .eq('id', id);
      if (error) throw error;
    } catch (error) {
      console.error('Error toggling todo:', error);
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      const { error } = await supabase.from('todos').delete().eq('id', id);
      if (error) throw error;
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const safeTodos = Array.isArray(todos) ? todos : [];
  const completedCount = safeTodos.filter((t) => t.completed).length;
  const userName = (user as any)?.user_metadata?.name || user?.email?.split('@')?.[0] || 'User';

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-600 via-blue-600 to-cyan-500 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-6 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-linear-to-r from-purple-600 to-blue-600 p-3 rounded-full">
                <UserIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">{userName}</h2>
                <p className="text-sm text-gray-600">{user?.email || ''}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm">
                {isOnline ? (
                  <div className="flex items-center gap-2 text-green-600">
                    <Wifi className="w-4 h-4" />
                    <span>Online</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-orange-600">
                    <WifiOff className="w-4 h-4" />
                    <span>Offline</span>
                  </div>
                )}
              </div>
              <button
                onClick={onSignOut}
                className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-lg p-4 text-center">
            <div className="text-3xl font-bold text-purple-600">{safeTodos.length}</div>
            <div className="text-sm text-gray-600">Total</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4 text-center">
            <div className="text-3xl font-bold text-green-600">{completedCount}</div>
            <div className="text-sm text-gray-600">Done</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4 text-center">
            <div className="text-3xl font-bold text-blue-600">{safeTodos.length - completedCount}</div>
            <div className="text-sm text-gray-600">Active</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-6 mb-6">
          <div className="flex gap-3">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              onKeyUp={(e) => e.key === 'Enter' && addTodo()}
              placeholder="What needs to be done?"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
            />
            <button
              onClick={addTodo}
              disabled={!newTodo.trim()}
              className="bg-linear-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">Add</span>
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {loading ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <div className="text-gray-400 text-lg">Loading todos...</div>
            </div>
          ) : safeTodos.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <div className="text-gray-400 text-lg">No tasks yet. Add one to get started!</div>
            </div>
          ) : (
            safeTodos.map((todo) => (
              <div
                key={todo.id}
                className="bg-white rounded-xl shadow-lg p-4 flex items-center gap-4 hover:shadow-xl transition-shadow"
              >
                <button
                  onClick={() => toggleTodo(todo.id)}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition ${
                    todo.completed ? 'bg-green-500 border-green-500' : 'border-gray-300 hover:border-purple-500'
                  }`}
                  aria-label={todo.completed ? 'Mark as incomplete' : 'Mark as complete'}
                >
                  {todo.completed && <Check className="w-4 h-4 text-white" />}
                </button>
                <span className={`flex-1 text-lg ${todo.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                  {todo.text || ''}
                </span>
                <div className="flex items-center gap-3">
                  {todo.offline && (
                    <div className="flex items-center gap-1 text-xs text-orange-600">
                      <Clock className="w-3 h-3 animate-spin" />
                      <span>Syncing</span>
                    </div>
                  )}
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="text-red-500 hover:text-red-700 transition p-2 hover:bg-red-50 rounded-lg"
                    aria-label="Delete todo"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TodoList;
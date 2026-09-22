import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  X, 
  ListTodo, 
  Plus, 
  CheckCircle2, 
  Circle, 
  Trash2, 
  RefreshCw, 
  LogIn, 
  Calendar, 
  Layers, 
  Sparkles,
  ExternalLink,
  Check,
  Clock,
  Activity,
  CheckCheck,
  Pause,
  Play
} from 'lucide-react';
import { GoogleTask, GoogleTaskList, GoogleUserProfile } from '../types';
import { googleTasksService } from '../services/googleTasksService';

interface GoogleTasksDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  isConnected: boolean;
  userProfile: GoogleUserProfile | null;
  onConnectGoogle: () => void;
}

export const GoogleTasksDrawer: React.FC<GoogleTasksDrawerProps> = ({
  isOpen,
  onClose,
  isConnected,
  userProfile,
  onConnectGoogle,
}) => {
  const [taskLists, setTaskLists] = useState<GoogleTaskList[]>([]);
  const [selectedListId, setSelectedListId] = useState<string | null>(null);
  const [tasks, setTasks] = useState<GoogleTask[]>([]);
  const [isLoadingLists, setIsLoadingLists] = useState(false);
  const [isLoadingTasks, setIsLoadingTasks] = useState(false);
  const [isSilentSyncing, setIsSilentSyncing] = useState(false);
  const [isAutoPolling, setIsAutoPolling] = useState(true);
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [newTitle, setNewTitle] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [newListTitle, setNewListTitle] = useState('');
  const [showNewListInput, setShowNewListInput] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const isSyncingRef = useRef(false);

  // Load task lists when drawer opens
  useEffect(() => {
    if (isOpen && isConnected) {
      loadTaskLists();
    }
  }, [isOpen, isConnected]);

  const loadTaskLists = async () => {
    setIsLoadingLists(true);
    try {
      const lists = await googleTasksService.getTaskLists();
      setTaskLists(lists);
      if (lists.length > 0) {
        // Select an AI Income list if available, or first list
        const currentStillExists = selectedListId && lists.some((l) => l.id === selectedListId);
        if (!currentStillExists) {
          const aiList = lists.find((l) => l.title.includes('AI Income')) || lists[0];
          setSelectedListId(aiList.id);
          loadTasks(aiList.id);
        }
      }
    } catch (e: any) {
      console.error('Error fetching task lists:', e);
      setStatusMessage('टास्क लिस्ट लोड करने में समस्या: ' + (e.message || ''));
    } finally {
      setIsLoadingLists(false);
    }
  };

  const loadTasks = async (listId: string) => {
    setIsLoadingTasks(true);
    try {
      const fetchedTasks = await googleTasksService.getTasks(listId);
      setTasks(fetchedTasks);
      setLastSyncedAt(new Date());
    } catch (e: any) {
      console.error('Error fetching tasks:', e);
    } finally {
      setIsLoadingTasks(false);
    }
  };

  // Background silent polling function
  const pollTasksSilently = useCallback(async (listId: string) => {
    if (!listId || isSyncingRef.current) return;
    isSyncingRef.current = true;
    setIsSilentSyncing(true);
    try {
      const fetchedTasks = await googleTasksService.getTasks(listId);
      setTasks(fetchedTasks);
      setLastSyncedAt(new Date());
    } catch (e) {
      console.warn('Background poll for Google Tasks failed:', e);
    } finally {
      isSyncingRef.current = false;
      setIsSilentSyncing(false);
    }
  }, []);

  // Periodic polling interval (every 6 seconds when drawer is active and connected)
  useEffect(() => {
    if (!isOpen || !isConnected || !selectedListId || !isAutoPolling) {
      return;
    }

    const intervalId = setInterval(() => {
      pollTasksSilently(selectedListId);
    }, 6000);

    return () => clearInterval(intervalId);
  }, [isOpen, isConnected, selectedListId, isAutoPolling, pollTasksSilently]);

  const handleSelectList = (listId: string) => {
    setSelectedListId(listId);
    loadTasks(listId);
  };

  const handleToggleTask = async (task: GoogleTask) => {
    if (!selectedListId) return;
    const oldStatus = task.status;
    const optimisticStatus = oldStatus === 'completed' ? 'needsAction' : 'completed';
    const completedTimestamp = optimisticStatus === 'completed' ? new Date().toISOString() : undefined;

    // Optimistic UI update
    setTasks((prev) =>
      prev.map((t) =>
        t.id === task.id
          ? {
              ...t,
              status: optimisticStatus,
              completed: completedTimestamp,
            }
          : t
      )
    );

    try {
      await googleTasksService.toggleTaskStatus(selectedListId, task.id, oldStatus);
      setLastSyncedAt(new Date());
    } catch (e) {
      console.error('Error toggling task:', e);
      // Revert if failed
      setTasks((prev) =>
        prev.map((t) => (t.id === task.id ? { ...t, status: oldStatus } : t))
      );
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!selectedListId) return;
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    try {
      await googleTasksService.deleteTask(selectedListId, taskId);
      setLastSyncedAt(new Date());
    } catch (e) {
      console.error('Error deleting task:', e);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedListId || !newTitle.trim()) return;

    try {
      const created = await googleTasksService.createTask(selectedListId, {
        title: newTitle.trim(),
        notes: newNotes.trim() || undefined,
      });
      setTasks((prev) => [created, ...prev]);
      setNewTitle('');
      setNewNotes('');
      setLastSyncedAt(new Date());
    } catch (e) {
      console.error('Error creating task:', e);
    }
  };

  const handleCreateList = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListTitle.trim()) return;
    try {
      const created = await googleTasksService.createTaskList(newListTitle.trim());
      setTaskLists((prev) => [...prev, created]);
      setSelectedListId(created.id);
      loadTasks(created.id);
      setNewListTitle('');
      setShowNewListInput(false);
      setLastSyncedAt(new Date());
    } catch (e) {
      console.error('Error creating task list:', e);
    }
  };

  // Completion calculation
  const completedTasks = tasks.filter((t) => t.status === 'completed');
  const pendingTasks = tasks.filter((t) => t.status === 'needsAction');
  const completedCount = completedTasks.length;
  const pendingCount = pendingTasks.length;
  const totalCount = tasks.length;
  const completionPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const filteredTasks = tasks.filter((t) => {
    if (filter === 'completed') return t.status === 'completed';
    if (filter === 'pending') return t.status === 'needsAction';
    return true;
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-sm flex justify-end">
      <div 
        id="google-tasks-drawer-container"
        className="relative w-full max-w-2xl bg-[#111] border-l border-[#333] shadow-2xl h-full flex flex-col animate-in slide-in-from-right duration-300"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#262626] bg-[#0c0c0c] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#3b82f6]/15 text-[#3b82f6] flex items-center justify-center border border-[#3b82f6]/30">
              <ListTodo className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Google Tasks मैनेजर</h3>
                {isConnected && (
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#10b981]/20 text-[#10b981] text-[11px] font-mono font-semibold border border-[#10b981]/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
                    Live Sync
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-400 font-mono">
                {isConnected
                  ? userProfile?.email || 'Google Tasks से कनेक्टेड'
                  : 'AI कमाई के टास्क ट्रैक करने के लिए कनेक्ट करें'}
              </p>
            </div>
          </div>

          <button
            id="close-tasks-drawer-btn"
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white rounded-xl hover:bg-[#1a1a1a] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {!isConnected ? (
          <div className="flex-1 p-8 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-[#3b82f6]/10 border border-[#3b82f6]/20 flex items-center justify-center text-[#3b82f6]">
              <ListTodo className="w-8 h-8" />
            </div>
            <div className="max-w-md space-y-2">
              <h4 className="text-lg font-bold text-white">Google Tasks को कनेक्ट करें</h4>
              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                अपने AI कमाई के 30-दिन के रोडमैप, डेली हैबिट्स और ऐक्शन आइटम्स को सीधे अपने रियल Google Tasks अकाउंट में सिंक करें।
              </p>
            </div>
            <button
              id="drawer-connect-google-btn"
              onClick={onConnectGoogle}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#3b82f6] hover:bg-[#2563eb] text-white font-bold text-sm shadow-lg shadow-[#3b82f6]/20 transition-all active:scale-95"
            >
              <LogIn className="w-4 h-4" />
              <span>Google Account से कनेक्ट करें</span>
            </button>
          </div>
        ) : (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Task Lists selector bar */}
            <div className="p-3 bg-[#050505] border-b border-[#262626] flex items-center gap-2 overflow-x-auto scrollbar-none shrink-0">
              <span className="text-xs text-gray-400 font-mono font-semibold pl-2 shrink-0 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5" /> लिस्ट्स:
              </span>
              {taskLists.map((list) => (
                <button
                  key={list.id}
                  id={`select-tasklist-${list.id}`}
                  onClick={() => handleSelectList(list.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                    selectedListId === list.id
                      ? 'bg-[#3b82f6] text-white border-[#3b82f6] shadow-sm'
                      : 'bg-[#111] hover:bg-[#1a1a1a] text-gray-300 border-[#262626]'
                  }`}
                >
                  {list.title}
                </button>
              ))}

              <button
                id="add-new-list-btn"
                onClick={() => setShowNewListInput(!showNewListInput)}
                className="px-2.5 py-1.5 rounded-xl bg-[#111] hover:bg-[#1a1a1a] text-gray-400 hover:text-gray-200 text-xs flex items-center gap-1 border border-[#262626] shrink-0"
                title="नई लिस्ट बनाएं"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>नई लिस्ट</span>
              </button>
            </div>

            {/* Live Polling & Completion Status Banner */}
            <div className="p-3.5 bg-[#0a0a0a] border-b border-[#222] shrink-0 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                {/* Completion Metric */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-mono text-gray-400">टास्क प्रगति:</span>
                    <span className="text-xs font-mono font-bold text-white">
                      {completedCount}/{totalCount} पूर्ण ({completionPercent}%)
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#10b981]/15 text-[#10b981] text-[11px] font-mono font-semibold border border-[#10b981]/30">
                      <Check className="w-3 h-3 stroke-[3]" /> {completedCount} Done
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#3b82f6]/15 text-[#60a5fa] text-[11px] font-mono font-semibold border border-[#3b82f6]/30">
                      <Clock className="w-3 h-3" /> {pendingCount} Remaining
                    </span>
                  </div>
                </div>

                {/* Polling Controls & Status */}
                <div className="flex items-center gap-2">
                  <button
                    id="toggle-auto-polling-btn"
                    onClick={() => setIsAutoPolling(!isAutoPolling)}
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-mono border transition-all ${
                      isAutoPolling
                        ? 'bg-[#10b981]/10 border-[#10b981]/30 text-[#10b981] hover:bg-[#10b981]/20'
                        : 'bg-[#222] border-[#333] text-gray-400 hover:text-gray-200'
                    }`}
                    title={isAutoPolling ? 'ऑटो-पोलिंग रोकें' : 'ऑटो-पोलिंग चालू करें'}
                  >
                    {isAutoPolling ? (
                      <>
                        <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
                        <span>Polling (6s)</span>
                      </>
                    ) : (
                      <>
                        <Pause className="w-3 h-3" />
                        <span>Paused</span>
                      </>
                    )}
                  </button>

                  <button
                    id="refresh-tasks-btn"
                    onClick={() => {
                      if (selectedListId) loadTasks(selectedListId);
                      loadTaskLists();
                    }}
                    className="p-1.5 text-gray-400 hover:text-white rounded-lg bg-[#161616] hover:bg-[#222] border border-[#262626] transition-colors flex items-center gap-1 text-xs font-mono"
                    title="Google Tasks API से अभी सिंक करें"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isLoadingTasks || isSilentSyncing ? 'animate-spin text-[#3b82f6]' : ''}`} />
                    {lastSyncedAt && (
                      <span className="hidden sm:inline text-[10px] text-gray-500">
                        {lastSyncedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </span>
                    )}
                  </button>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-[#1c1c1c] h-1.5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#3b82f6] to-[#10b981] transition-all duration-500 ease-out rounded-full"
                  style={{ width: `${completionPercent}%` }}
                />
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-1.5 pt-0.5">
                <button
                  id="filter-all-tasks-btn"
                  onClick={() => setFilter('all')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors ${
                    filter === 'all'
                      ? 'bg-[#222] text-white font-semibold border border-[#333]'
                      : 'text-gray-400 hover:text-gray-200'
                  }`}
                >
                  सभी ({totalCount})
                </button>
                <button
                  id="filter-pending-tasks-btn"
                  onClick={() => setFilter('pending')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors ${
                    filter === 'pending'
                      ? 'bg-[#3b82f6]/20 text-[#60a5fa] font-semibold border border-[#3b82f6]/40'
                      : 'text-gray-400 hover:text-gray-200'
                  }`}
                >
                  बाकी ({pendingCount})
                </button>
                <button
                  id="filter-completed-tasks-btn"
                  onClick={() => setFilter('completed')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors ${
                    filter === 'completed'
                      ? 'bg-[#10b981]/20 text-[#10b981] font-semibold border border-[#10b981]/40'
                      : 'text-gray-400 hover:text-gray-200'
                  }`}
                >
                  पूर्ण ({completedCount})
                </button>
              </div>
            </div>

            {/* New list input drawer */}
            {showNewListInput && (
              <form onSubmit={handleCreateList} className="p-3 bg-[#0c0c0c] border-b border-[#262626] flex items-center gap-2">
                <input
                  type="text"
                  value={newListTitle}
                  onChange={(e) => setNewListTitle(e.target.value)}
                  placeholder="नई लिस्ट का नाम (उदा: 🎯 AI YouTube Plan)..."
                  className="flex-1 bg-[#050505] border border-[#333] rounded-xl px-3 py-2 text-xs text-gray-200 focus:outline-none focus:border-[#3b82f6]"
                  autoFocus
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#3b82f6] text-white text-xs font-semibold"
                >
                  बनाएं
                </button>
              </form>
            )}

            {/* Tasks list */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
              {isLoadingTasks ? (
                <div className="py-12 text-center text-gray-500 text-xs flex flex-col items-center gap-2 font-mono">
                  <RefreshCw className="w-5 h-5 animate-spin text-[#3b82f6]" />
                  <span>Google Tasks लोड हो रहे हैं...</span>
                </div>
              ) : filteredTasks.length === 0 ? (
                <div className="py-12 text-center text-gray-500 text-xs space-y-1 font-mono">
                  <p className="font-semibold text-gray-400">
                    {filter === 'completed'
                      ? 'अभी कोई पूर्ण टास्क नहीं है'
                      : filter === 'pending'
                      ? 'बधाई! सभी टास्क पूरे हो चुके हैं'
                      : 'इस लिस्ट में कोई टास्क नहीं है'}
                  </p>
                  <p className="text-[11px]">
                    {filter === 'all'
                      ? 'किसी भी AI कमाई प्लान के "Google Tasks में जोड़ें" बटन पर क्लिक करें या नीचे नया टास्क बनाएं।'
                      : 'टास्क की स्थिति बदलने के लिए चेकबॉक्स पर क्लिक करें।'}
                  </p>
                </div>
              ) : (
                filteredTasks.map((t) => {
                  const isDone = t.status === 'completed';
                  return (
                    <div
                      key={t.id}
                      id={`task-item-${t.id}`}
                      className={`group p-3.5 rounded-2xl border transition-all flex items-start justify-between gap-3.5 ${
                        isDone
                          ? 'bg-[#080d09]/60 border-[#10b981]/25 hover:border-[#10b981]/40'
                          : 'bg-[#050505] border-[#222] hover:border-[#333] shadow-sm'
                      }`}
                    >
                      {/* Checkmark Completion Button */}
                      <button
                        id={`toggle-task-${t.id}`}
                        onClick={() => handleToggleTask(t)}
                        className="mt-0.5 shrink-0 transition-transform active:scale-90"
                        title={isDone ? 'अपूर्ण चिह्नित करें (Mark as Pending)' : 'पूर्ण चिह्नित करें (Mark as Completed)'}
                      >
                        {isDone ? (
                          <div className="w-6 h-6 rounded-full bg-[#10b981]/20 border-2 border-[#10b981] flex items-center justify-center text-[#10b981] shadow-sm shadow-[#10b981]/20">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded-full border-2 border-gray-600 hover:border-[#3b82f6] flex items-center justify-center transition-colors">
                            <Circle className="w-3.5 h-3.5 text-transparent hover:text-[#3b82f6]/40" />
                          </div>
                        )}
                      </button>

                      {/* Task Info & Status Badges */}
                      <div className="flex-1 min-w-0 space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className={`text-xs sm:text-sm font-medium ${isDone ? 'line-through text-gray-400 font-semibold' : 'text-gray-100'}`}>
                            {t.title}
                          </p>
                          {isDone ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#10b981]/20 text-[#10b981] text-[10px] font-mono font-bold border border-[#10b981]/30">
                              <Check className="w-2.5 h-2.5 stroke-[3]" /> पूर्ण (Done)
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#3b82f6]/15 text-[#60a5fa] text-[10px] font-mono border border-[#3b82f6]/25">
                              <Clock className="w-2.5 h-2.5" /> बाकी (In Progress)
                            </span>
                          )}
                        </div>

                        {t.notes && (
                          <p className="text-[11px] text-gray-400 line-clamp-2 leading-relaxed font-mono">
                            {t.notes}
                          </p>
                        )}

                        <div className="flex flex-wrap items-center gap-3 pt-0.5 text-[10px] text-gray-500 font-mono">
                          {t.due && (
                            <span className="inline-flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-gray-400" />
                              Due: {new Date(t.due).toLocaleDateString()}
                            </span>
                          )}
                          {isDone && t.completed && (
                            <span className="inline-flex items-center gap-1 text-[#10b981]/80">
                              <CheckCheck className="w-3 h-3" />
                              Finished: {new Date(t.completed).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Action buttons */}
                      <button
                        id={`delete-task-${t.id}`}
                        onClick={() => handleDeleteTask(t.id)}
                        className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-500 hover:text-[#f43f5e] rounded-lg transition-opacity hover:bg-[#161616]"
                        title="टास्क हटाएं"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            {/* Add task quick form */}
            <form onSubmit={handleCreateTask} className="p-3 sm:p-4 bg-[#050505] border-t border-[#262626] space-y-2 shrink-0">
              <div className="flex items-center gap-2">
                <input
                  id="new-task-title-input"
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="नया टास्क जोड़ें..."
                  className="flex-1 bg-[#111] border border-[#262626] rounded-xl px-3.5 py-2 text-xs sm:text-sm text-gray-200 focus:outline-none focus:border-[#3b82f6]"
                />
                <button
                  id="add-task-submit-btn"
                  type="submit"
                  disabled={!newTitle.trim()}
                  className="px-4 py-2 rounded-xl bg-[#3b82f6] hover:bg-[#2563eb] disabled:opacity-40 text-white font-bold text-xs sm:text-sm transition-all"
                >
                  जोड़ें
                </button>
              </div>
              <input
                id="new-task-notes-input"
                type="text"
                value={newNotes}
                onChange={(e) => setNewNotes(e.target.value)}
                placeholder="नोट्स या डिटेल्स (वैकल्पिक)..."
                className="w-full bg-[#111]/60 border border-[#262626] rounded-xl px-3 py-1.5 text-xs text-gray-400 focus:outline-none focus:border-[#3b82f6]"
              />
            </form>
          </div>
        )}
      </div>
    </div>
  );
};


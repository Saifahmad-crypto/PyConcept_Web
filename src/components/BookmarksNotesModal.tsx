import React, { useState } from 'react';
import {
  X,
  Bookmark,
  FileText,
  Search,
  ArrowRight,
  Trash2,
  Edit3,
  Check,
  BookOpen,
} from 'lucide-react';
import { LessonNote, TopicId } from '../types';
import {
  TOPIC_BASICS_LESSONS,
  TOPIC_08_LESSONS,
  TOPIC_09_LESSONS,
} from '../data/curriculumData';

interface BookmarksNotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookmarkedLessons: string[];
  lessonNotes: Record<string, LessonNote>;
  onNavigateToLesson: (topic: TopicId, lessonId: string) => void;
  onToggleBookmark: (lessonId: string) => void;
  onSaveNote: (lessonId: string, topic: TopicId, title: string, note: string) => void;
  onDeleteNote: (lessonId: string) => void;
}

export const BookmarksNotesModal: React.FC<BookmarksNotesModalProps> = ({
  isOpen,
  onClose,
  bookmarkedLessons,
  lessonNotes,
  onNavigateToLesson,
  onToggleBookmark,
  onSaveNote,
  onDeleteNote,
}) => {
  const [activeTab, setActiveTab] = useState<'bookmarks' | 'notes'>('bookmarks');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingLessonId, setEditingLessonId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState<string>('');
  const [savedFlash, setSavedFlash] = useState<boolean>(false);

  if (!isOpen) return null;

  const allLessons = [
    ...TOPIC_BASICS_LESSONS.map((l) => ({ ...l, topic: 'basics' as TopicId })),
    ...TOPIC_08_LESSONS.map((l) => ({ ...l, topic: 'conditionals' as TopicId })),
    ...TOPIC_09_LESSONS.map((l) => ({ ...l, topic: 'loops' as TopicId })),
  ];

  const bookmarkedList = allLessons.filter((l) => bookmarkedLessons.includes(l.id));
  const notesList = Object.values(lessonNotes);

  const filteredBookmarks = bookmarkedList.filter(
    (l) =>
      l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.number.includes(searchQuery) ||
      l.topic.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredNotes = notesList.filter(
    (n) =>
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.note.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.topic.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStartEdit = (note: LessonNote) => {
    setEditingLessonId(note.lessonId);
    setEditContent(note.note);
  };

  const handleSaveEdit = (note: LessonNote) => {
    onSaveNote(note.lessonId, note.topic, note.title, editContent);
    setEditingLessonId(null);
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 2000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto"
    >
      <div className="relative w-full max-w-2xl rounded-2xl border border-[#3A1D1D] bg-[#100303] text-[#FBF5F9] shadow-2xl p-5 sm:p-7 space-y-5 my-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#2C1616] pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#E10906]/60 bg-[#1E0505] text-[#E10906]">
              <Bookmark className="h-6 w-6 fill-current" />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-white">
                Saved Notes &amp; Bookmarks
              </h2>
              <p className="font-mono text-xs text-[#8A8585]">
                {bookmarkedLessons.length} bookmarked · {notesList.length} notes saved
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg p-2 text-[#8A8585] hover:text-white hover:bg-[#190909] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Selector & Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="inline-flex rounded-xl border border-[#3A1D1D] bg-[#190909] p-1 gap-1">
            <button
              type="button"
              onClick={() => setActiveTab('bookmarks')}
              className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
                activeTab === 'bookmarks'
                  ? 'bg-[#E10906] text-white shadow-sm'
                  : 'text-[#8A8585] hover:text-white'
              }`}
            >
              <Bookmark className="h-3.5 w-3.5" />
              Bookmarks ({bookmarkedLessons.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('notes')}
              className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
                activeTab === 'notes'
                  ? 'bg-[#E10906] text-white shadow-sm'
                  : 'text-[#8A8585] hover:text-white'
              }`}
            >
              <FileText className="h-3.5 w-3.5" />
              My Notes ({notesList.length})
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-[#8A8585]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by title, note, topic..."
              className="w-full rounded-xl border border-[#3A1D1D] bg-[#190909] pl-8 pr-3 py-1.5 text-xs text-white placeholder-[#8A8585] focus:outline-none focus:ring-1 focus:ring-[#E10906]"
            />
          </div>
        </div>

        {/* Tab 1: Bookmarks Content */}
        {activeTab === 'bookmarks' && (
          <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
            {filteredBookmarks.length === 0 ? (
              <div className="rounded-xl border border-[#2C1616] bg-[#140606] p-8 text-center space-y-2">
                <Bookmark className="mx-auto h-8 w-8 text-[#8A8585]/50" />
                <p className="text-sm font-semibold text-[#D1C7C7]">No bookmarks found</p>
                <p className="text-xs text-[#8A8585]">
                  Click the bookmark icon on any lesson header to keep quick shortcuts here!
                </p>
              </div>
            ) : (
              filteredBookmarks.map((lesson) => (
                <div
                  key={lesson.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-[#2C1616] bg-[#190909] p-3.5 transition-colors hover:border-[#3A1D1D]"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] font-bold text-[#E10906] uppercase">
                        {lesson.topic} · Section {lesson.number}
                      </span>
                    </div>
                    <h4 className="font-display text-sm font-bold text-white truncate">
                      {lesson.title}
                    </h4>
                    <p className="text-xs text-[#8A8585] line-clamp-1">{lesson.summary}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => onToggleBookmark(lesson.id)}
                      title="Remove bookmark"
                      className="p-1.5 text-amber-400 hover:text-amber-300 rounded-lg transition-colors"
                    >
                      <Bookmark className="h-4 w-4 fill-amber-400" />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onNavigateToLesson(lesson.topic, lesson.id);
                      }}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-[#E10906] px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[#C40705]"
                    >
                      <span>Jump</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 2: Notes Content */}
        {activeTab === 'notes' && (
          <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
            {savedFlash && (
              <div className="rounded-lg bg-emerald-950/60 border border-emerald-800 p-2 text-xs text-emerald-300 flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-400" />
                Note updated successfully!
              </div>
            )}

            {filteredNotes.length === 0 ? (
              <div className="rounded-xl border border-[#2C1616] bg-[#140606] p-8 text-center space-y-2">
                <FileText className="mx-auto h-8 w-8 text-[#8A8585]/50" />
                <p className="text-sm font-semibold text-[#D1C7C7]">No lesson notes yet</p>
                <p className="text-xs text-[#8A8585]">
                  Click the note icon on any lesson to jot down insights, syntax reminders, or formulas!
                </p>
              </div>
            ) : (
              filteredNotes.map((note) => {
                const isEditing = editingLessonId === note.lessonId;
                const dateStr = new Date(note.updatedAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                });

                return (
                  <div
                    key={note.lessonId}
                    className="rounded-xl border border-[#2C1616] bg-[#190909] p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between gap-2 border-b border-[#2C1616] pb-2">
                      <div>
                        <span className="font-mono text-[10px] font-bold text-[#E10906] uppercase">
                          {note.topic}
                        </span>
                        <h4 className="font-display text-sm font-bold text-white">
                          {note.title}
                        </h4>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] text-[#8A8585]">{dateStr}</span>
                        {!isEditing && (
                          <button
                            type="button"
                            onClick={() => handleStartEdit(note)}
                            title="Edit Note"
                            className="p-1 text-[#8A8585] hover:text-white rounded"
                          >
                            <Edit3 className="h-3.5 w-3.5" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => onDeleteNote(note.lessonId)}
                          title="Delete Note"
                          className="p-1 text-[#8A8585] hover:text-rose-400 rounded"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    {isEditing ? (
                      <div className="space-y-2">
                        <textarea
                          rows={3}
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          className="w-full rounded-lg border border-[#3A1D1D] bg-[#100303] p-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#E10906]"
                        />
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setEditingLessonId(null)}
                            className="rounded-lg px-2.5 py-1 text-xs text-[#8A8585] hover:text-white"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSaveEdit(note)}
                            className="rounded-lg bg-[#E10906] px-3 py-1 text-xs font-semibold text-white hover:bg-[#C40705]"
                          >
                            Save Note
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-[#D1C7C7] whitespace-pre-wrap leading-relaxed font-sans bg-[#120404] p-2.5 rounded-lg border border-[#230b0b]">
                        {note.note}
                      </p>
                    )}

                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onNavigateToLesson(note.topic, note.lessonId);
                        }}
                        className="inline-flex items-center gap-1 font-mono text-[11px] font-semibold text-[#E10906] hover:underline"
                      >
                        <BookOpen className="h-3 w-3" />
                        Go to Lesson
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { FaReply } from 'react-icons/fa';

const Comment = ({ comment, onReply, level = 0, username, postId }) => {
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyText.trim() || isSubmitting) return;
    
    setIsSubmitting(true);
    setError('');
    
    try {
      await onReply(comment._id, replyText);
      setReplyText('');
      setIsReplying(false);
    } catch (err) {
      setError('Failed to post reply. Please try again.');
      console.error('Error submitting reply:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`mt-3 ${level > 0 ? 'ml-6 pl-4 border-l-2 border-gray-200' : ''}`}>
      <div className="flex space-x-3">
        <div className="shrink-0">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-xs text-gray-500">👤</span>
          </div>
        </div>
        <div className="flex-1">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex justify-between items-start">
              <span className="font-medium text-sm">{comment.author}</span>
              <span className="text-xs text-gray-400">{comment.timestamp}</span>
            </div>
            <p className="text-sm text-gray-700 mt-1">{comment.content}</p>
            
            <div className="flex items-center mt-2 space-x-3 text-xs text-gray-500">
              <button 
                type="button"
                onClick={() => setIsReplying(!isReplying)}
                className="flex items-center hover:text-blue-600 disabled:opacity-50 text-xs"
                disabled={isSubmitting || !username}
              >
                <FaReply className="mr-1" size={10} />
                <span>{isSubmitting ? 'Posting...' : 'Reply'}</span>
              </button>
            </div>
          </div>

          {isReplying && (
            <form onSubmit={handleReplySubmit} className="mt-2">
              <div className="text-xs text-gray-500 mb-1 flex items-center">
                <span>Replying to </span>
                <span className="font-medium text-blue-600 ml-1">{comment.author}</span>
              </div>
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder={`Reply to ${comment.author}...`}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isSubmitting}
              />
              {error && (
                <div className="text-red-500 text-xs mt-1">{error}</div>
              )}
              <div className="flex justify-end mt-2 space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsReplying(false);
                    setError('');
                  }}
                  className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!replyText.trim() || isSubmitting}
                  className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {isSubmitting ? 'Posting...' : 'Reply'}
                </button>
              </div>
            </form>
          )}

          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-3 space-y-3">
              {comment.replies?.map(reply => (
                <Comment
                  key={reply._id}
                  comment={{
                    ...reply,
                    parentId: comment._id
                  }}
                  onReply={onReply}
                  level={level + 1}
                  username={username}
                  postId={postId}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Comment;

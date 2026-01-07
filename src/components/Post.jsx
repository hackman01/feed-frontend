import { useState } from 'react';
import { FaComment } from 'react-icons/fa';
import Comment from './Comment';

const Post = ({ post, onAddComment, username }) => {
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);


  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    
    try {
      await onAddComment(post._id, { author: username || 'Anonymous', content: commentText });
      setCommentText('');
      setShowComments(true);
    } catch (err) {
      console.error('Error submitting comment:', err);
    }
  };

  const handleReply = async (commentId, replyContent) => {
    try {
      const reply = {
        author: username || 'Anonymous',
        content: replyContent,
      };
      
      await onAddComment(post._id, reply, commentId);
    } catch (err) {
      console.error('Error submitting reply:', err);

    }
  };


  return (
    <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-200 mb-6">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500">👤</span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{post.author}</h3>
            <p className="text-xs text-gray-500">{post.timestamp}</p>
          </div>
        </div>
      </div>
      
      <div className="mb-4">
        <p className="text-gray-800 whitespace-pre-line">{post.content}</p>
      </div>
      
      <div className="flex items-center justify-start border-t border-b border-gray-100 py-2 my-3">
        <button 
          onClick={() => setShowComments(!showComments)}
          className="flex items-center space-x-1 text-gray-500 hover:text-blue-600"
        >
          <FaComment />
          <span>{post.commentCount || 0} Comments</span>
        </button>
      </div>

      {showComments && (
        <div className="mt-4 space-y-4">
          <form onSubmit={handleCommentSubmit} className="flex space-x-2">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button 
              type="submit"
              disabled={!commentText.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50"
            >
              Post
            </button>
          </form>

          <div className="space-y-3 mt-4">
            {post.comments?.map(comment => (
              <Comment 
                username={username}
                key={comment._id} 
                comment={comment} 
                onReply={handleReply}
                postId={post._id}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Post;
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import api from './api';
import CreatePost from './components/CreatePost';
import Post from './components/Post';
import UsernameForm from './components/UsernameForm';

const App = () => {
  const [username, setUsername] = useState('');

  useEffect(() => {
    const savedUsername = sessionStorage.getItem('username');
    if (savedUsername) {
      setUsername(savedUsername);
    }
  }, []);

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');


  const fetchPosts = async () => {
    try {

      const postsResponse = await api.get('/api/posts');
      const posts = Array.isArray(postsResponse?.data) ? postsResponse.data : [];
      

      const postsWithComments = await Promise.all(
        posts.map(async (post) => {
          try {
            const commentsResponse = await api.get(`/api/posts/${post._id}/comments`);
            return {
              ...post,
              comments: Array.isArray(commentsResponse?.data) ? commentsResponse.data : []
            };
          } catch (error) {
            console.error(`Error fetching comments for post ${post._id}:`, error);
            return {
              ...post,
              comments: []
            };
          }
        })
      );
      
      setPosts(postsWithComments);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch posts');
      setPosts([]);
      setLoading(false);
      console.error('Error fetching posts:', err);
    }
  };


  useEffect(() => {
    if (username) {
      fetchPosts();
    }
  }, [username]);


  const handleNewPost = async (postData) => {
    try {
      await api.post('/api/posts', postData);
      

      await fetchPosts();
    } catch (err) {
      console.error('Error creating post:', err);
      setError('Failed to create post');
      throw err;
    }
  };

  const handleAddComment = async (postId, comment, parentCommentId = null) => {
    try {
      if (Array.isArray(comment)) {

        setPosts(posts.map(post => 
          post._id === postId ? { ...post, comments: comment } : post
        ));
        return;
      }


      const commentData = {
        ...comment,
        postId,
        ...(parentCommentId && { parentCommentId })
      };
      
      await api.post(`/api/posts/${postId}/comments`, commentData);


      await fetchPosts();
      
    } catch (err) {
      console.error('Error adding comment:', err);
      setError('Failed to add comment');
      throw err;
    }
  };

  const handleUsernameSet = (newUsername) => {
    setUsername(newUsername);
  };

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={
            !username ? (
              <Navigate to="/set-username" replace />
            ) : (
              <div className="min-h-screen bg-gray-50 py-8 px-4">
                <div className="max-w-2xl mx-auto">
                  <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Social Feed</h1>
                    <div className="text-sm text-gray-600">
                      Logged in as: <span className="font-medium">{username}</span>
                    </div>
                  </div>
                  
                  <CreatePost onPostSubmit={handleNewPost} username={username} />
                  
                  <div className="space-y-6 mt-8">
                    {loading ? (
                      <div className="text-center py-8">Loading posts...</div>
                    ) : error ? (
                      <div className="text-red-500 text-center py-8">{error}</div>
                    ) : !Array.isArray(posts) || posts.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">No posts yet. Be the first to post something!</div>
                    ) : (
                      posts.map(post => (
                        <Post
                          key={post?._id || Math.random()} 
                          post={post} 
                          onAddComment={handleAddComment}
                          username={username}
                        />
                      ))
                    )}
                  </div>
                </div>
              </div>
            )
          } 
        />
        <Route 
          path="/set-username" 
          element={
            username ? (
              <Navigate to="/" replace />
            ) : (
              <UsernameForm onUsernameSet={handleUsernameSet} />
            )
          } 
        />
      </Routes>
    </Router>
  );
};

export default App;

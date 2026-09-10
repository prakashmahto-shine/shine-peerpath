import React, { useState } from 'react';
import { 
  MessageSquare, Heart, Send, Share2, Compass, Award, 
  CheckCircle, Sparkles, Filter, Users, Bell, Bookmark, 
  ArrowRight, ShieldCheck, Calendar, Info, PlusCircle, Check,
  ThumbsUp, Globe, MoreHorizontal, X, FileText, Lightbulb, Hash
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CommunityPost } from '../../types';

export const CommunityView: React.FC = () => {
  const { 
    currentUser, 
    isCreatorMode, 
    communityPosts, 
    createMentorPost, 
    addPostComment, 
    togglePostLike, 
    toggleCommentLike,
    followedMentorIds, 
    toggleFollowMentor, 
    isFollowingMentor,
    navigate,
    selectExpertById,
    setIsBookingModalOpen,
    showToast
  } = useApp();

  // Filters: 'following' vs 'all'
  const [feedFilter, setFeedFilter] = useState<'all' | 'following'>('following');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  
  // Mentor composer modal state
  const [composerOpen, setComposerOpen] = useState<boolean>(false);
  const [postTitle, setPostTitle] = useState<string>('');
  const [postContent, setPostContent] = useState<string>('');
  const [postTags, setPostTags] = useState<string>('');

  // Comment input per post: { [postId]: string }
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  
  // Expanded comments per post: { [postId]: boolean }
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({
    'post-1': true,
    'post-2': true,
    'post-3': true,
    'post-4': true
  });

  const isMentorRole = currentUser?.role === 'mentor' || isCreatorMode;

  // Filter posts
  const filteredPosts = communityPosts.filter(post => {
    // Following filter
    if (feedFilter === 'following') {
      const isFollowed = isFollowingMentor(post.mentorId) || (currentUser && post.mentorId === currentUser.id);
      if (!isFollowed) return false;
    }

    // Tag filter
    if (selectedTag !== 'all') {
      const matchTag = post.tags.some(t => t.toLowerCase().includes(selectedTag.toLowerCase()));
      if (!matchTag) return false;
    }

    return true;
  });

  const handlePublishPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle.trim() || !postContent.trim()) {
      showToast('Incomplete Post', 'Please provide a title and insight content.', 'warning');
      return;
    }

    const tagsArray = postTags
      .split(',')
      .map(t => t.trim().replace(/^#/, ''))
      .filter(Boolean);

    const created = createMentorPost({
      title: postTitle.trim(),
      content: postContent.trim(),
      tags: tagsArray
    });

    if (created) {
      setPostTitle('');
      setPostContent('');
      setPostTags('');
      setComposerOpen(false);
      setFeedFilter('all');
      showToast('Post Published!', 'Your followers received an in-app alert.', 'success');
    }
  };

  const handleAddComment = (postId: string) => {
    const text = commentInputs[postId] || '';
    if (!text.trim()) return;

    addPostComment(postId, text);
    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
    setExpandedComments(prev => ({ ...prev, [postId]: true }));
  };

  const handleSharePost = (post: CommunityPost) => {
    const url = `${window.location.origin}/community#${post.id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      showToast('Link Copied!', 'Post link copied to clipboard.', 'info');
    }
  };

  const handleBookWithMentor = (mentorId: string) => {
    selectExpertById(mentorId);
    setIsBookingModalOpen(true);
  };

  const allTags = ['all', 'System Design', 'Frontend Architecture', 'AI & GenAI', 'Product Management', 'Career Transition'];

  return (
    <div className="community-page-wrapper">
      <div className="community-view-container">
        
        {/* Authentic LinkedIn 3-Column Grid */}
        <div className="community-linkedin-grid">
          
          {/* =========================================================================
              LEFT COLUMN: Candidate/User Profile Snapshot & Topic Navigation
             ========================================================================= */}
          <aside className="community-left-column">
            
            {/* User Mini Profile Card (LinkedIn Style) */}
            <div className="linkedin-profile-card">
              <div className="lpc-banner" />
              <div className="lpc-avatar-container">
                <img 
                  src={currentUser?.avatar || '/avatars/prakash.jpg'} 
                  alt={currentUser?.name || 'User'} 
                  className="lpc-avatar" 
                />
              </div>

              <div className="lpc-body">
                <h4 className="lpc-name">{currentUser?.name || 'Prakash Mahto'}</h4>
                <p className="lpc-headline">
                  {currentUser?.headline || 'Senior Frontend Engineer (Transitioning to Fullstack)'}
                </p>
              </div>

              <div className="lpc-divider" />

              <div className="lpc-analytics">
                <div 
                  className="lpc-stat-item"
                  onClick={() => setFeedFilter('following')}
                  title="Filter feed by mentors you follow"
                >
                  <span className="lpc-stat-label">Mentors followed</span>
                  <span className="lpc-stat-value">{followedMentorIds.length}</span>
                </div>
                <div 
                  className="lpc-stat-item"
                  onClick={() => setFeedFilter('all')}
                  title="View all mentor insights"
                >
                  <span className="lpc-stat-label">Insights in feed</span>
                  <span className="lpc-stat-value">{communityPosts.length}</span>
                </div>
              </div>

              <div className="lpc-divider" />

              <div 
                className="lpc-saved-row"
                onClick={() => navigate('sessions-view')}
              >
                <Bookmark size={14} className="lpc-bookmark-icon" />
                <span>My Peerpath Bookings</span>
              </div>
            </div>

            {/* Trending Topics & Hashtags Widget */}
            <div className="linkedin-left-widget">
              <div className="llw-header">
                <span className="llw-title">Topics & Hashtags</span>
              </div>
              <div className="llw-tags-list">
                {allTags.filter(t => t !== 'all').map(tag => (
                  <button
                    key={tag}
                    className={`llw-tag-btn ${selectedTag === tag ? 'active' : ''}`}
                    onClick={() => setSelectedTag(selectedTag === tag ? 'all' : tag)}
                  >
                    <Hash size={13} className="llw-tag-hash" />
                    <span>{tag.replace(/\s+/g, '')}</span>
                  </button>
                ))}
              </div>

              <div className="llw-divider" />

              <div className="llw-trust-badge">
                <ShieldCheck size={14} className="text-emerald" />
                <span>Verified Mentors Only • No Recruiter Spam</span>
              </div>
            </div>

          </aside>

          {/* =========================================================================
              CENTER COLUMN: LinkedIn Post Feed & Controls
             ========================================================================= */}
          <main className="community-center-feed">
            
            {/* LinkedIn-style Composer / Prompt Box */}
            {isMentorRole ? (
              <div className="linkedin-composer-box">
                <div className="lcb-top-row">
                  <img 
                    src={currentUser?.avatar || '/avatars/akash.jpg'} 
                    alt={currentUser?.name || 'Mentor'} 
                    className="lcb-avatar" 
                  />
                  <button 
                    className="lcb-input-trigger"
                    onClick={() => setComposerOpen(true)}
                  >
                    Share an architecture breakdown, interview question, or transition playbook...
                  </button>
                </div>
                <div className="lcb-buttons-row">
                  <button className="lcb-btn" onClick={() => setComposerOpen(true)}>
                    <FileText size={16} className="lcb-icon text-blue" />
                    <span>System Design</span>
                  </button>
                  <button className="lcb-btn" onClick={() => setComposerOpen(true)}>
                    <Lightbulb size={16} className="lcb-icon text-amber" />
                    <span>Interview Traps</span>
                  </button>
                  <button className="lcb-btn" onClick={() => setComposerOpen(true)}>
                    <Calendar size={16} className="lcb-icon text-purple" />
                    <span>Open 1:1 Slots</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="linkedin-candidate-prompt">
                <div className="lcp-header">
                  <img 
                    src={currentUser?.avatar || '/avatars/prakash.jpg'} 
                    alt="Prakash" 
                    className="lcp-avatar" 
                  />
                  <div className="lcp-text">
                    <span className="lcp-title">Candidate Community Access • Technical Q&A</span>
                    <p className="lcp-sub">
                      Only verified tech leaders post insights. Ask architecture doubts & transition questions directly in any comment thread!
                    </p>
                  </div>
                </div>
                <div className="lcp-quick-tags">
                  <span className="lcp-tag-label">Popular discussions:</span>
                  <button className="lcp-quick-pill" onClick={() => setSelectedTag('System Design')}>#SystemDesign</button>
                  <button className="lcp-quick-pill" onClick={() => setSelectedTag('Backend Architecture')}>#BackendArchitecture</button>
                  <button className="lcp-quick-pill" onClick={() => setSelectedTag('Kafka')}>#Kafka</button>
                </div>
              </div>
            )}

            {/* LinkedIn-style Feed Filter Sort Bar */}
            <div className="linkedin-feed-filter-bar">
              <div className="lff-tabs-left">
                <button 
                  className={`lff-tab-button ${feedFilter === 'following' ? 'active' : ''}`}
                  onClick={() => setFeedFilter('following')}
                >
                  Following Feed
                  <span className="lff-badge">{followedMentorIds.length}</span>
                </button>

                <button 
                  className={`lff-tab-button ${feedFilter === 'all' ? 'active' : ''}`}
                  onClick={() => setFeedFilter('all')}
                >
                  All Mentor Insights
                  <span className="lff-badge">{communityPosts.length}</span>
                </button>
              </div>

              {selectedTag !== 'all' && (
                <div className="lff-tag-indicator">
                  <span>Filtered: <strong>#{selectedTag}</strong></span>
                  <button 
                    className="btn-clear-tag" 
                    onClick={() => setSelectedTag('all')}
                    title="Clear filter"
                  >
                    <X size={12} />
                  </button>
                </div>
              )}
            </div>

            {/* Empty State */}
            {filteredPosts.length === 0 ? (
              <div className="linkedin-empty-state">
                <Users size={44} className="text-muted" />
                <h3>No posts in this feed</h3>
                <p>
                  {feedFilter === 'following' 
                    ? "You haven't followed any mentors who posted under this filter yet." 
                    : "No insights match the selected topic filter."}
                </p>
                <div className="empty-actions-row">
                  {feedFilter === 'following' && (
                    <button 
                      className="btn-empty-switch"
                      onClick={() => { setFeedFilter('all'); setSelectedTag('all'); }}
                    >
                      View All Insights ({communityPosts.length})
                    </button>
                  )}
                  <button 
                    className="btn-empty-explore"
                    onClick={() => navigate('experts-view')}
                  >
                    <Compass size={14} /> Find Mentors to Follow
                  </button>
                </div>
              </div>
            ) : (
              /* Posts Feed (Authentic LinkedIn Post Cards) */
              <div className="community-posts-list">
                {filteredPosts.map(post => {
                  const isFollowing = isFollowingMentor(post.mentorId);
                  const isCommentsOpen = expandedComments[post.id] ?? false;
                  const commentText = commentInputs[post.id] || '';

                  return (
                    <article key={post.id} id={post.id} className="community-post-card linkedin-style-card">
                      
                      {/* Post Header: Avatar + Name + Follow + Headline + Time + Book CTA */}
                      <div className="post-card-header">
                        <div className="post-author-block">
                          <div className="post-author-avatar-wrap">
                            <img 
                              src={post.mentorAvatar} 
                              alt={post.mentorName} 
                              className="post-author-avatar" 
                            />
                            <span className="post-avatar-badge" title="Verified Shine Peerpath Mentor">
                              <CheckCircle size={11} />
                            </span>
                          </div>

                          <div className="post-author-details">
                            <div className="post-author-name-row">
                              <span 
                                className="post-author-name"
                                onClick={() => {
                                  selectExpertById(post.mentorId);
                                  navigate('expert-profile-view', `/expert/${post.mentorId}`);
                                }}
                              >
                                {post.mentorName}
                              </span>
                              <span className="post-mentor-tag">Mentor</span>
                              
                              {currentUser?.id !== post.mentorId && (
                                <button 
                                  className={`post-header-follow-btn ${isFollowing ? 'following' : ''}`}
                                  onClick={() => toggleFollowMentor(post.mentorId, post.mentorName)}
                                  title={isFollowing ? 'Unfollow mentor' : 'Follow to receive instant alerts'}
                                >
                                  {isFollowing ? '• Following' : '+ Follow'}
                                </button>
                              )}
                            </div>

                            <span className="post-author-headline">
                              {post.mentorRole} @ <strong>{post.mentorCompany}</strong>
                            </span>

                            <div className="post-meta-subline">
                              <span>{post.createdAt}</span>
                              <span>•</span>
                              <Globe size={11} className="post-meta-globe" />
                            </div>
                          </div>
                        </div>

                        {/* Right Top Action: Book 1:1 Live Call */}
                        <div className="post-header-right-cta">
                          <button 
                            className="btn-header-book-mentor"
                            onClick={() => handleBookWithMentor(post.mentorId)}
                            title={`Book 1:1 Live Guidance with ${post.mentorName}`}
                          >
                            <Calendar size={13} /> Book 1:1
                          </button>
                        </div>
                      </div>

                      {/* Post Content: Natural conversational flow (No H2 blog title) */}
                      <div className="post-card-body">
                        {post.title && (
                          <div className="post-lead-hook">
                            {post.title}
                          </div>
                        )}
                        
                        <div className="post-content-text">
                          {post.content.split('\n\n').map((paragraph, i) => (
                            <p key={i}>{paragraph}</p>
                          ))}
                        </div>

                        {/* LinkedIn style clickable hashtags */}
                        {post.tags && post.tags.length > 0 && (
                          <div className="post-hashtags-row">
                            {post.tags.map(tag => (
                              <span 
                                key={tag} 
                                className="post-hashtag-link"
                                onClick={() => setSelectedTag(tag)}
                              >
                                #{tag.replace(/\s+/g, '')}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* LinkedIn-style Social Stats Row */}
                      <div className="post-social-counts-row">
                        <div className="post-reactions-summary">
                          <div className="reaction-icons-stack">
                            <span className="rx-circle rx-blue"><ThumbsUp size={10} /></span>
                            <span className="rx-circle rx-red"><Heart size={10} /></span>
                          </div>
                          <span className="rx-count">{post.likesCount}</span>
                        </div>

                        <div className="post-social-counts-right">
                          <span 
                            className="post-stat-clickable"
                            onClick={() => setExpandedComments(prev => ({ ...prev, [post.id]: !isCommentsOpen }))}
                          >
                            {post.commentsCount} {post.commentsCount === 1 ? 'comment' : 'comments'}
                          </span>
                          <span>•</span>
                          <span className="post-stat-clickable" onClick={() => handleSharePost(post)}>
                            1 share
                          </span>
                        </div>
                      </div>

                      {/* LinkedIn Action Buttons Bar: Like, Comment, Share, Book 1:1 */}
                      <div className="post-action-buttons-bar">
                        <button 
                          className={`btn-social-action ${post.likedByCurrentUser ? 'active-liked' : ''}`}
                          onClick={() => togglePostLike(post.id)}
                        >
                          <ThumbsUp size={16} className={post.likedByCurrentUser ? 'fill-blue text-blue' : ''} />
                          <span>{post.likedByCurrentUser ? 'Liked' : 'Like'}</span>
                        </button>

                        <button 
                          className={`btn-social-action ${isCommentsOpen ? 'active-commenting' : ''}`}
                          onClick={() => setExpandedComments(prev => ({ ...prev, [post.id]: !isCommentsOpen }))}
                        >
                          <MessageSquare size={16} />
                          <span>Comment</span>
                        </button>

                        <button 
                          className="btn-social-action"
                          onClick={() => handleSharePost(post)}
                        >
                          <Share2 size={16} />
                          <span>Share</span>
                        </button>

                        <button 
                          className="btn-social-action btn-social-book"
                          onClick={() => handleBookWithMentor(post.mentorId)}
                        >
                          <Calendar size={15} />
                          <span>Book 1:1</span>
                        </button>
                      </div>

                      {/* Comments Section (LinkedIn Style Bubble Thread) */}
                      {isCommentsOpen && (
                        <div className="post-comments-container">
                          
                          {/* New Comment Input */}
                          <div className="comment-composer-row">
                            <img 
                              src={currentUser?.avatar || '/avatars/prakash.jpg'} 
                              alt={currentUser?.name || 'User'} 
                              className="comment-user-avatar" 
                            />
                            <div className="comment-input-box">
                              <input 
                                type="text" 
                                placeholder="Add a comment or ask an architecture doubt..."
                                value={commentText}
                                onChange={(e) => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleAddComment(post.id);
                                  }
                                }}
                                className="comment-input-field"
                              />
                              {commentText.trim() && (
                                <button 
                                  className="btn-submit-comment-pill"
                                  onClick={() => handleAddComment(post.id)}
                                  title="Post comment"
                                >
                                  Post
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Comments Thread List */}
                          {post.comments && post.comments.length > 0 ? (
                            <div className="comments-list">
                              {post.comments.map(c => (
                                <div key={c.id} className="comment-thread-item">
                                  <img 
                                    src={c.authorAvatar} 
                                    alt={c.authorName} 
                                    className="comment-author-avatar" 
                                  />
                                  <div className="comment-thread-body">
                                    <div className={`comment-bubble ${c.authorIsMentor ? 'is-mentor-bubble' : ''}`}>
                                      <div className="comment-bubble-header">
                                        <div className="comment-author-meta">
                                          <span className="cb-author-name">{c.authorName}</span>
                                          {c.authorIsMentor && (
                                            <span className="cb-mentor-tag">Author • Mentor</span>
                                          )}
                                          <span className="cb-author-role">{c.authorRole}</span>
                                        </div>
                                        <span className="cb-time">{c.createdAt}</span>
                                      </div>

                                      <p className="cb-text">{c.content}</p>
                                    </div>

                                    <div className="comment-sub-actions">
                                      <button 
                                        className={`csa-btn ${c.likedByCurrentUser ? 'liked' : ''}`}
                                        onClick={() => toggleCommentLike(post.id, c.id)}
                                      >
                                        Like {c.likesCount > 0 && `(${c.likesCount})`}
                                      </button>
                                      <span>•</span>
                                      <button 
                                        className="csa-btn"
                                        onClick={() => setCommentInputs(prev => ({ ...prev, [post.id]: `@${c.authorName} ` }))}
                                      >
                                        Reply
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="no-comments-yet">
                              <span>No comments yet. Join the conversation!</span>
                            </div>
                          )}

                        </div>
                      )}

                    </article>
                  );
                })}
              </div>
            )}

          </main>

          {/* =========================================================================
              RIGHT COLUMN: Mentors You Follow, Guardrails & Creator Callout
             ========================================================================= */}
          <aside className="community-right-column">
            
            {/* Followed Mentors Widget */}
            <div className="sidebar-widget-card">
              <div className="widget-header">
                <div className="widget-title-row">
                  <Users size={16} className="text-purple" />
                  <h3>Mentors You Follow</h3>
                </div>
                <span className="widget-count-badge">{followedMentorIds.length}</span>
              </div>

              <p className="widget-desc">
                Get WhatsApp alerts and see their insights first whenever they publish new posts or open 1:1 slots.
              </p>

              <div className="followed-mentors-list">
                {followedMentorIds.length === 0 ? (
                  <div className="empty-followed-mentors">
                    <span>You haven't followed any mentors yet. Click Follow on any mentor card to stay notified!</span>
                    <button 
                      className="btn-sidebar-explore"
                      onClick={() => navigate('experts-view')}
                    >
                      Find Mentors to Follow
                    </button>
                  </div>
                ) : (
                  followedMentorIds.map(mentorId => {
                    const matchingPost = communityPosts.find(p => p.mentorId === mentorId);
                    const name = matchingPost ? matchingPost.mentorName : (mentorId === 'saheli' ? 'Saheli Kanjilal' : mentorId);
                    const role = matchingPost ? matchingPost.mentorRole : 'Verified Mentor';
                    const company = matchingPost ? matchingPost.mentorCompany : 'Tech Leader';
                    const avatar = matchingPost ? matchingPost.mentorAvatar : `/avatars/${mentorId}.jpg`;

                    return (
                      <div key={mentorId} className="followed-mentor-item">
                        <div className="fmi-left">
                          <img src={avatar} alt={name} className="fmi-avatar" />
                          <div className="fmi-info">
                            <span 
                              className="fmi-name"
                              onClick={() => {
                                selectExpertById(mentorId);
                                navigate('expert-profile-view', `/expert/${mentorId}`);
                              }}
                            >
                              {name}
                            </span>
                            <span className="fmi-role">{role} @ {company}</span>
                          </div>
                        </div>

                        <div className="fmi-actions">
                          <button 
                            className="fmi-book-btn"
                            onClick={() => handleBookWithMentor(mentorId)}
                            title="Book 1:1 Session"
                          >
                            Book
                          </button>
                          <button 
                            className="fmi-unfollow-btn"
                            onClick={() => toggleFollowMentor(mentorId, name)}
                            title="Unfollow"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* How Community Works Widget */}
            <div className="sidebar-widget-card rules-card">
              <div className="widget-header">
                <div className="widget-title-row">
                  <ShieldCheck size={16} className="text-emerald" />
                  <h3>Community Standards</h3>
                </div>
              </div>

              <ul className="rules-list">
                <li>
                  <div className="rule-number">1</div>
                  <div className="rule-content">
                    <strong>Mentor-Led Signal:</strong> Only vetted tech leaders from top product companies publish top posts.
                  </div>
                </li>
                <li>
                  <div className="rule-number">2</div>
                  <div className="rule-content">
                    <strong>Zero Recruiter Spam:</strong> Direct architecture discussion without agency marketing posts.
                  </div>
                </li>
                <li>
                  <div className="rule-number">3</div>
                  <div className="rule-content">
                    <strong>Follower Priority:</strong> Followed mentors notify you via app alert (🔔) and priority booking access.
                  </div>
                </li>
                <li>
                  <div className="rule-number">4</div>
                  <div className="rule-content">
                    <strong>Direct Transition to 1:1:</strong> Book 1:1 sessions immediately with authors to resolve deep doubts.
                  </div>
                </li>
              </ul>
            </div>

            {/* Quick Creator Studio Card if Candidate wants to become a Mentor */}
            {!isMentorRole && (
              <div className="sidebar-widget-card mentor-invite-card">
                <div className="mic-sparkle">
                  <Award size={20} className="text-amber" />
                </div>
                <h4>Are you a Senior Engineer or Tech Leader?</h4>
                <p>Share your transition experience, earn up to ₹2,500/hr, and guide ambitious developers.</p>
                <button 
                  className="btn-apply-mentor"
                  onClick={() => navigate('experts-view')}
                >
                  Apply as Verified Mentor <ArrowRight size={14} />
                </button>
              </div>
            )}

          </aside>

        </div>

      </div>

      {/* =========================================================================
          LINKEDIN-STYLE POST COMPOSER MODAL (FOR MENTORS)
         ========================================================================= */}
      {composerOpen && (
        <div className="linkedin-modal-backdrop" onClick={() => setComposerOpen(false)}>
          <div className="linkedin-modal-card" onClick={e => e.stopPropagation()}>
            <div className="lmc-header">
              <h3>Create an Insight Post for Candidates</h3>
              <button 
                className="lmc-close-btn"
                onClick={() => setComposerOpen(false)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="lmc-author-strip">
              <img 
                src={currentUser?.avatar || '/avatars/akash.jpg'} 
                alt={currentUser?.name || 'Mentor'} 
                className="lmc-author-avatar" 
              />
              <div className="lmc-author-meta">
                <strong>{currentUser?.name || 'Mentor'}</strong>
                <span className="lmc-privacy-tag">
                  <Globe size={11} /> Anyone • {followedMentorIds.length * 140 + 380} followers notified
                </span>
              </div>
            </div>

            <form onSubmit={handlePublishPost} className="lmc-form">
              <div className="form-group">
                <input 
                  type="text" 
                  placeholder="Post Headline (e.g. Distributed Transactions & Outbox Pattern: What we evaluate in 40LPA+ rounds)" 
                  value={postTitle} 
                  onChange={(e) => setPostTitle(e.target.value)}
                  className="lmc-input-title"
                  required
                />
              </div>

              <div className="form-group">
                <textarea 
                  rows={6}
                  placeholder="What architecture breakdown, candidate pitfall, or interview takeaway do you want to share? (Bullet points and structured takeaways recommended)"
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  className="lmc-textarea-body"
                  required
                />
              </div>

              <div className="form-group">
                <input 
                  type="text" 
                  placeholder="Topic tags separated by comma (e.g. System Design, Kafka, Microservices)" 
                  value={postTags} 
                  onChange={(e) => setPostTags(e.target.value)}
                  className="lmc-input-tags"
                />
              </div>

              <div className="lmc-footer">
                <button 
                  type="button" 
                  className="lmc-btn-cancel"
                  onClick={() => setComposerOpen(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="lmc-btn-post"
                >
                  <Send size={14} /> Post & Notify Followers
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

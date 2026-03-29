                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">{reply.user.name}</span>
                        </div>
                        <p className="text-sm text-gray-800">{reply.content}</p>
                      </div>
                      
                      <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                        <span>{reply.timestamp}</span>
                        <button
                          onClick={() => handleCommentLike(reply.id)}
                          className={cn(
                            "flex items-center gap-1 hover:text-red-500",
                            reply.isLiked && "text-red-500"
                          )}
                        >
                          <Heart className={cn("w-3 h-3", reply.isLiked && "fill-current")} />
                          {reply.likes}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}

            {/* Show more comments */}
            {comments.length > 3 && !showAllComments && (
              <Button
                variant="ghost"
                onClick={() => setShowAllComments(true)}
                className="text-orange-500 hover:text-orange-600 hover:bg-orange-50"
              >
                View all {comments.length} comments
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Bottom spacing */}
      <div className="h-6"></div>
    </div>
  );
};

export default PostDetailModal;
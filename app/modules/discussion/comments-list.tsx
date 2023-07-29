import React from 'react';
import { useLoaderData } from '@remix-run/react';

import { useSocketEvent } from '~/ws/use-socket-event';
import type { Loader } from './_layout.d.$id.route';
import { requester } from '~/lib/requester';
import { Comment } from './comment';

export function CommentsList() {
  const data = useLoaderData<Loader>();

  const [comments, setComments] = React.useState(data.comments);

  useSocketEvent('comment_new', comment =>
    setComments(state => state.concat([comment]))
  );
  useSocketEvent('comment_update', async commentId => {
    const response = await requester.get(
      `/api/v1/discussions/${data.discussion.id}/comments/${commentId}`
    );
    const { comment } = await response.json();

    comments.splice(
      comments.findIndex(it => it.id === commentId),
      1,
      comment
    );
    setComments(Array.from(comments));
  });
  useSocketEvent('comment_delete', commentId =>
    setComments(comments.filter(it => it.id !== commentId))
  );

  return (
    <ul>
      {comments.map(comment => (
        <Comment
          key={comment.id}
          comment={comment}
          onDelete={commentId =>
            setComments(comments.filter(it => it.id !== commentId))
          }
        />
      ))}
    </ul>
  );
}

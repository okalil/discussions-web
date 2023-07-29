import React from 'react';
import { useSocketEvent } from '~/ws/use-socket-event';
import { cn } from '~/lib/classnames';
import { ArrowUpIcon } from '~/icons/arrow-up-icon';
import { Form, useRouteLoaderData } from '@remix-run/react';
import { requester } from '~/lib/requester';

interface CommentVoteProps {
  discussion: { id: number };
  comment: { id: number; user_voted: boolean; votes_count: number };
}

export function CommentVote({
  discussion,
  comment: initialComment,
}: CommentVoteProps) {
  const [comment, setComment] = React.useState(initialComment);

  const root = useRouteLoaderData('root');

  useSocketEvent('comment_update', async commentId => {
    if (comment.id === commentId) {
      const response = await requester.get(
        `/api/v1/discussions/${discussion.id}/comments/${comment.id}`
      );
      const data = await response.json();
      setComment(data.comment);
    }
  });

  return (
    <Form
      method="POST"
      className="flex items-center justify-end"
      onSubmit={e => {
        e.preventDefault();
        const voted = !comment.user_voted;
        setComment({
          ...comment,
          user_voted: voted,
          votes_count: comment.votes_count + (voted ? 1 : -1),
        });

        requester[voted ? 'post' : 'delete'](
          `/api/v1/discussions/${discussion.id}/comments/${comment.id}/votes`
        );
      }}
    >
      <button
        className={cn(
          'flex items-center gap-2 rounded-xl',
          'px-2 py-1 border',
          'cursor-default hover:bg-gray-50 hover:text-blue-500',
          comment.user_voted
            ? 'border-blue-500 text-blue-500'
            : 'border-gray-200'
        )}
        aria-label={`${comment.votes_count} votos`}
        disabled={!root.token}
        title={root.token ? 'Votar' : 'Você precisa estar logado para votar'}
      >
        <ArrowUpIcon size={16} />
        {comment.votes_count}
      </button>
    </Form>
  );
}

import React from 'react';
import { Form, useRouteLoaderData } from '@remix-run/react';

import { useSocketEvent } from '~/ws/use-socket-event';
import { cn } from '~/lib/classnames';
import { ArrowUpIcon } from '~/icons/arrow-up-icon';
import { requester } from '~/lib/requester';

interface DiscussionVoteProps {
  discussion: { id: number; user_voted: boolean; votes_count: number };
}

export function DiscussionVote({
  discussion: initialDiscussion,
}: DiscussionVoteProps) {
  const [discussion, setDiscussion] = React.useState(initialDiscussion);

  // keep local state in sync with loader data
  React.useEffect(() => setDiscussion(initialDiscussion), [initialDiscussion]);

  const root = useRouteLoaderData('root');

  useSocketEvent('discussion_update', async discussionId => {
    if (discussion.id === discussionId) {
      const response = await requester.get(
        `/api/v1/discussions/${discussion.id}`
      );
      const data = await response.json();
      setDiscussion(data.discussion);
    }
  });

  return (
    <Form
      method="POST"
      className="flex items-center justify-end"
      onSubmit={e => {
        e.preventDefault();
        const voted = !discussion.user_voted;
        setDiscussion({
          ...discussion,
          user_voted: voted,
          votes_count: discussion.votes_count + (voted ? 1 : -1),
        });

        requester[voted ? 'post' : 'delete'](
          `/api/v1/discussions/${discussion.id}/votes`
        );
      }}
    >
      <button
        className={cn(
          'flex items-center gap-2 rounded-xl',
          'px-2 py-1 border',
          'cursor-default hover:bg-gray-50 hover:text-blue-500',
          discussion.user_voted
            ? 'border-blue-500 text-blue-500'
            : 'border-gray-200'
        )}
        aria-label={`${discussion.votes_count} votos`}
        disabled={!root.token}
        title={root.token ? 'Votar' : 'Você precisa estar logado para votar'}
      >
        <ArrowUpIcon size={16} />
        {discussion.votes_count}
      </button>
    </Form>
  );
}

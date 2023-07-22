import { Form, Link } from '@remix-run/react';
import { ArrowUpIcon } from '~/icons/arrow-up-icon';
import { ChatBubbleIcon } from '~/icons/chat-bubble-icon';
import { cn } from '~/lib/classnames';

import type { Loader } from './_layout._index.route';

interface Props {
  discussion: Awaited<ReturnType<Loader>>['data'][number];
}

export function Discussion({ discussion }: Props) {
  const formattedCreatedAt = new Intl.DateTimeFormat('en', {
    month: 'short',
    year: '2-digit',
    day: 'numeric',
  }).format(new Date(discussion.created_at));

  return (
    <li className="flex gap-3 py-2 border-b border-gray-300">
      <div>
        <img
          src={'http://localhost:3333' + discussion.user.picture}
          alt={discussion.user.name}
          className="w-12 rounded-full"
        />
      </div>
      <div className="flex-1">
        <h2>
          <Link
            to={`d/${discussion.id}`}
            className="text-lg visited:text-gray-600"
          >
            {discussion.title}
          </Link>
        </h2>
        <p className="text-gray-500 text-sm">
          {discussion.user.name} started on {formattedCreatedAt}
        </p>
      </div>
      <div className="grid gap-1 text-sm">
        <button
          className={cn(
            'flex items-center gap-2 rounded-xl',
            'px-2 py-1 border border-gray-200',
            'cursor-default hover:bg-gray-50 hover:text-blue-500'
          )}
          aria-label={`${discussion.votes_count} votos`}
        >
          <ArrowUpIcon size={16} />
          {discussion.votes_count}
        </button>

        <Form action={`d/${discussion.id}`}>
          <button
            className={cn(
              'flex items-center gap-2 rounded-xl',
              'px-2 py-1 hover:text-blue-500'
            )}
            aria-label={`${discussion.comments_count} comentários`}
          >
            <ChatBubbleIcon size={16} />
            {discussion.comments_count}
          </button>
        </Form>
      </div>
    </li>
  );
}
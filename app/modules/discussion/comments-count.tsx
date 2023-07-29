import React from 'react';
import { useSocketEvent } from '~/ws/use-socket-event';

export function CommentsCount({ defaultCount = 0 }: { defaultCount?: number }) {
  const [count, setCount] = React.useState(defaultCount);

  useSocketEvent('comment_new', () => setCount(c => c + 1));
  useSocketEvent('comment_delete', () => setCount(c => c - 1));

  if (count > 1) return `${count} comentários`;

  if (count === 1) return `${count} comentário`;

  return 'Nenhum comentário';
}

export const cn = (...args: (string | undefined | false)[]) => {
  return args.filter(Boolean).join(' ');
};

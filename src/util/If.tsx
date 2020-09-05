import React, { memo, PropsWithChildren } from 'react';

interface Props {
  condition: boolean;
  renderElse?: JSX.Element | string | number;
}

const If = (props: PropsWithChildren<Props>) => {
  if (!props.condition) {
    return <>{props.renderElse}</>;
  }
  return <>{props.children}</>;
};
const MemoIf = memo(If);
export { MemoIf as If };

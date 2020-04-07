import React, { memo, PropsWithChildren } from 'react';

interface Props {
  renderCondition: boolean;
  renderElse?: JSX.Element | string | number;
  // child: ReactChild;
}

const Condition = (props: PropsWithChildren<Props>) => {
  if (!props.renderCondition) {
    return <>{props.renderElse}</>;
  }
  return <>{props.children}</>;
};
const MemoCondition = memo(Condition);
export { MemoCondition as Condition };

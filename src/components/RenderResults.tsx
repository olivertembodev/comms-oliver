import { KBarResults, useMatches } from 'kbar';
import ResultItem from './ResultItem';

const groupNameStyle = {
  padding: '8px 16px',
  fontSize: '10px',
  textTransform: 'uppercase' as const,
  opacity: 0.5,
};

const RenderResults = () => {
  const { results, rootActionId } = useMatches();

  return (
    <KBarResults
      items={results}
      onRender={({ item, active }) =>
        typeof item === 'string' ? (
          <div style={groupNameStyle}>{item}</div>
        ) : (
          <ResultItem
            action={item}
            active={active}
            currentRootActionId={rootActionId}
          />
        )
      }
    />
  );
};
export default RenderResults;

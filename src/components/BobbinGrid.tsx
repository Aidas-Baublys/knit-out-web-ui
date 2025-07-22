type Props = {
  bobbins: number[][];
  onClick: (row: number, col: number) => void;
  used: Set<string>;
};

const BobbinGrid: React.FC<Props> = ({ bobbins, onClick, used }) => {
  return (
    <div className='bobbin-grid'>
      {bobbins.map((row, rIdx) => (
        <div key={rIdx} className='bobbin-row'>
          {row.map((val, cIdx) => {
            const key = `${rIdx}-${cIdx}`;
            const isUsed = used.has(key);
            return (
              <button
                key={cIdx}
                className={`bobbin-tile color-${val} ${isUsed ? 'used' : ''}`}
                onClick={() => onClick(rIdx, cIdx)}
                disabled={isUsed}>
                {val >= 0 ? val : ''}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default BobbinGrid;

type Props = {
  carpets: number[][];
};

const CarpetGrid: React.FC<Props> = ({ carpets }) => {
  const maxHeight = Math.max(...carpets.map(col => col.length));

  return (
    <div className='carpet-grid'>
      {[...Array(maxHeight)].map((_, i) => (
        <div className='carpet-row' key={i}>
          {carpets.map((col, colIndex) => {
            const reverseIndex = col.length - 1 - (maxHeight - 1 - i);
            const val = reverseIndex >= 0 ? col[reverseIndex] : -1;
            return (
              <div key={colIndex} className={`carpet-tile color-${val}`}>
                {val >= 0 ? val : ''}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default CarpetGrid;

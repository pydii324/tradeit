const PositionsTable = () => {
    return (
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">Open Positions</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              <th>Symbol</th>
              <th>Size</th>
              <th>PNL</th>
              <th>Liq. Price</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td>BTC/USDT</td>
              <td>0.5</td>
              <td className="text-green-600">+25.00</td>
              <td>11800.00</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };

  export default PositionsTable;
  
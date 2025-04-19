import { usePage } from "@inertiajs/react";

const PositionsTable = () => {
  const { open_positions } = usePage().props;

    return (
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">Open Positions</h3>
        <table className="table-fixed w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              <th className="py-2">Symbol</th>
              <th className="py-2">Size</th>
              <th className="py-2">PNL</th>
              <th className="py-2">Liq. Price</th>
              <th className="py-2 text-right pe-5">Options</th>
            </tr>
          </thead>
          <tbody>
            {open_positions.length > 0 ? (
              open_positions.map((position) => (
                <tr key={position.id} className="border-b">
                  <td className="py-2">{position.market}</td>
                  <td className="py-2">{position.amount}</td>
                  <td className="py-2">{position.pnl > 0 ? `+${position.pnl}` : position.pnl}</td>
                  <td className="py-2">{position.entry_price}</td>
                  <td className="py-2 text-right pe-5 text-red-500">
                    <button onClick={() => closePosition(position.id)}>Close</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="py-4 text-center text-gray-500" colSpan={5}>
                  No open positions
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  };

  export default PositionsTable;
  
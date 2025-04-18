const OrderBook = () => {
    return (
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">Order Book</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="text-green-500">Bids</h4>
            <div>123.45 — 1.2 BTC</div>
            <div>123.40 — 0.5 BTC</div>
          </div>
          <div>
            <h4 className="text-red-500">Asks</h4>
            <div>123.55 — 0.8 BTC</div>
            <div>123.60 — 2.1 BTC</div>
          </div>
        </div>
      </div>
    );
  };

export default OrderBook;
  